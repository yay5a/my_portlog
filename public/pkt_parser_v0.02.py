#!/usr/bin/env python3
"""
Memory-efficient PCAP batch analyzer for investigating suspicious network traffic.
Designed to handle massive pcap collections (30GB+) without memory exhaustion.
"""

import json
import os
import sys
from datetime import datetime
from collections import defaultdict, Counter
from pathlib import Path
import struct
import ipaddress
import hashlib

# Using dpkt for memory efficiency - it doesn't load entire files
import dpkt

class MemoryEfficientPCAPAnalyzer:
    def __init__(self, output_file="analysis_results.json"):
        """Initialize analyzer with streaming-friendly data structures."""
        # Use counters and sets that can be periodically flushed
        self.stats = {
            'total_packets': 0,
            'total_bytes': 0,
            'start_time': None,
            'end_time': None,
            'files_processed': 0
        }
        
        # Rolling windows for pattern detection
        self.packet_sizes = Counter()
        self.mac_addresses = Counter()
        self.ip_conversations = Counter()
        self.protocols = Counter()
        self.quic_patterns = defaultdict(lambda: {'count': 0, 'bytes': 0})
        
        # Anomaly detection
        self.anomalies = []
        self.suspicious_macs = set()
        self.uniform_traffic_flows = defaultdict(list)
        
        # Memory management
        self.FLUSH_INTERVAL = 100000  # Flush aggregations every 100k packets
        self.packets_since_flush = 0
        self.output_file = output_file
        
    def process_pcap_file(self, filepath):
        """Process a single pcap/pcapng file with minimal memory footprint."""
        print(f"Processing: {filepath}")
        
        try:
            with open(filepath, 'rb') as f:
                # Detect file format
                magic = f.read(4)
                f.seek(0)
                
                if magic == b'\xa1\xb2\xc3\xd4' or magic == b'\xd4\xc3\xb2\xa1':
                    # Standard PCAP
                    pcap = dpkt.pcap.Reader(f)
                    self._process_packets(pcap, filepath)
                elif magic == b'\x0a\x0d\x0d\x0a':
                    # PCAPNG - requires different handling
                    self._process_pcapng(f, filepath)
                else:
                    print(f"Unknown format for {filepath}")
                    
        except Exception as e:
            print(f"Error processing {filepath}: {e}")
            self.anomalies.append({
                'type': 'file_error',
                'file': str(filepath),
                'error': str(e)
            })
    
    def _process_packets(self, pcap, filepath):
        """Stream process packets from pcap reader."""
        packet_num = 0
        
        for timestamp, packet_data in pcap:
            packet_num += 1
            self.stats['total_packets'] += 1
            self.packets_since_flush += 1
            
            # Update time bounds
            if self.stats['start_time'] is None:
                self.stats['start_time'] = timestamp
            self.stats['end_time'] = timestamp
            
            try:
                # Parse Ethernet frame
                eth = dpkt.ethernet.Ethernet(packet_data)
                
                # Extract MACs efficiently
                src_mac = ':'.join('%02x' % b for b in eth.src)
                dst_mac = ':'.join('%02x' % b for b in eth.dst)
                
                self.mac_addresses[src_mac] += 1
                self.mac_addresses[dst_mac] += 1
                
                # Check for mystery MAC
                if src_mac == 'ae:56:71:e7:a0:a6':
                    self._analyze_suspicious_packet(timestamp, eth, packet_data, filepath, packet_num)
                
                # Packet size analysis
                packet_size = len(packet_data)
                self.stats['total_bytes'] += packet_size
                self.packet_sizes[packet_size] += 1
                
                # Protocol analysis
                if isinstance(eth.data, dpkt.ip.IP):
                    self._analyze_ip_packet(eth.data, packet_size, timestamp)
                elif isinstance(eth.data, dpkt.ip6.IP6):
                    self._analyze_ipv6_packet(eth.data, packet_size, timestamp)
                    
            except Exception as e:
                # Don't stop on malformed packets
                if packet_num % 10000 == 0:
                    print(f"  Processed {packet_num} packets...")
                continue
            
            # Periodic memory management
            if self.packets_since_flush >= self.FLUSH_INTERVAL:
                self._flush_aggregations()
    
    def _analyze_ip_packet(self, ip, packet_size, timestamp):
        """Analyze IPv4 packet for patterns."""
        self.protocols[ip.p] += 1
        
        # Track conversations
        src_ip = str(ipaddress.ip_address(ip.src))
        dst_ip = str(ipaddress.ip_address(ip.dst))
        conversation = f"{src_ip}->{dst_ip}"
        self.ip_conversations[conversation] += 1
        
        # Check for QUIC (UDP port 443)
        if ip.p == dpkt.ip.IP_PROTO_UDP:
            udp = ip.data
            if hasattr(udp, 'dport') and udp.dport == 443:
                self._analyze_quic_traffic(src_ip, dst_ip, packet_size, timestamp)
    
    def _analyze_ipv6_packet(self, ip6, packet_size, timestamp):
        """Analyze IPv6 packet for patterns."""
        self.protocols[ip6.nxt] += 1
        
        # Track conversations
        src_ip = str(ipaddress.ip_address(ip6.src))
        dst_ip = str(ipaddress.ip_address(ip6.dst))
        conversation = f"{src_ip}->{dst_ip}"
        self.ip_conversations[conversation] += 1
        
        # Check for QUIC
        if ip6.nxt == dpkt.ip.IP_PROTO_UDP:
            udp = ip6.data
            if hasattr(udp, 'dport') and udp.dport == 443:
                self._analyze_quic_traffic(src_ip, dst_ip, packet_size, timestamp)
                
                # Check for Cloudflare IPs
                if dst_ip.startswith('2606:4700:'):
                    self.quic_patterns['cloudflare']['count'] += 1
                    self.quic_patterns['cloudflare']['bytes'] += packet_size
    
    def _analyze_quic_traffic(self, src_ip, dst_ip, packet_size, timestamp):
        """Detect uniform QUIC patterns."""
        flow_key = f"{src_ip}->{dst_ip}"
        
        # Detect uniform 1292-byte packets
        if packet_size == 1292:
            self.uniform_traffic_flows[flow_key].append({
                'timestamp': timestamp,
                'size': packet_size
            })
            
            # Flag if we see sustained uniform traffic
            if len(self.uniform_traffic_flows[flow_key]) > 100:
                if flow_key not in [a['flow'] for a in self.anomalies if a['type'] == 'uniform_quic']:
                    self.anomalies.append({
                        'type': 'uniform_quic',
                        'flow': flow_key,
                        'packet_count': len(self.uniform_traffic_flows[flow_key]),
                        'packet_size': 1292
                    })
    
    def _analyze_suspicious_packet(self, timestamp, eth, packet_data, filepath, packet_num):
        """Deep analysis of packets from suspicious MAC."""
        self.suspicious_macs.add(':'.join('%02x' % b for b in eth.src))
        
        # Log first few instances for detailed analysis
        if len(self.anomalies) < 100:
            self.anomalies.append({
                'type': 'suspicious_mac',
                'mac': ':'.join('%02x' % b for b in eth.src),
                'timestamp': timestamp,
                'file': str(filepath),
                'packet_num': packet_num,
                'size': len(packet_data),
                'hash': hashlib.md5(packet_data).hexdigest()
            })
    
    def _flush_aggregations(self):
        """Periodically flush aggregations to prevent memory bloat."""
        print(f"  Flushing aggregations at {self.stats['total_packets']} packets...")
        
        # Keep only top entries in counters
        self.mac_addresses = Counter(dict(self.mac_addresses.most_common(1000)))
        self.ip_conversations = Counter(dict(self.ip_conversations.most_common(5000)))
        self.packet_sizes = Counter(dict(self.packet_sizes.most_common(100)))
        
        # Trim uniform traffic flows
        for flow_key in list(self.uniform_traffic_flows.keys()):
            if len(self.uniform_traffic_flows[flow_key]) > 1000:
                # Keep only sample
                self.uniform_traffic_flows[flow_key] = self.uniform_traffic_flows[flow_key][-100:]
        
        self.packets_since_flush = 0
    
    def _process_pcapng(self, file_handle, filepath):
        """Handle PCAPNG format - more complex but similar approach."""
        # Simplified PCAPNG processing - you might want python-pcapng library
        print(f"  PCAPNG format detected - using fallback processing")
        # This would need proper PCAPNG block parsing
        # For now, marking as needing specialized handling
        self.anomalies.append({
            'type': 'pcapng_file',
            'file': str(filepath),
            'note': 'Requires specialized PCAPNG parsing'
        })
    
    def analyze_directory(self, directory_path):
        """Process all pcap files in directory."""
        pcap_dir = Path(directory_path)
        pcap_files = sorted(pcap_dir.glob('*.pcap*'))
        
        print(f"Found {len(pcap_files)} PCAP files to process")
        
        for pcap_file in pcap_files:
            self.process_pcap_file(pcap_file)
            self.stats['files_processed'] += 1
            
            # Save intermediate results every 10 files
            if self.stats['files_processed'] % 10 == 0:
                self.save_results(f"{self.output_file}.intermediate")
        
        # Final analysis
        self._final_analysis()
        self.save_results(self.output_file)
    
    def _final_analysis(self):
        """Perform final statistical analysis."""
        print("\nPerforming final analysis...")
        
        # Identify dominant packet sizes
        top_packet_sizes = self.packet_sizes.most_common(10)
        
        # Check for 1292-byte dominance
        if top_packet_sizes and top_packet_sizes[0][0] == 1292:
            percentage = (top_packet_sizes[0][1] / self.stats['total_packets']) * 100
            if percentage > 50:
                self.anomalies.append({
                    'type': 'packet_size_anomaly',
                    'dominant_size': 1292,
                    'percentage': percentage,
                    'interpretation': 'Majority of traffic is uniform 1292-byte packets'
                })
    
    def save_results(self, output_file):
        """Save analysis results to JSON."""
        results = {
            'metadata': {
                'analysis_timestamp': datetime.now().isoformat(),
                'total_packets': self.stats['total_packets'],
                'total_bytes': self.stats['total_bytes'],
                'files_processed': self.stats['files_processed'],
                'time_range': {
                    'start': self.stats['start_time'],
                    'end': self.stats['end_time']
                }
            },
            'statistics': {
                'top_mac_addresses': dict(self.mac_addresses.most_common(20)),
                'top_conversations': dict(self.ip_conversations.most_common(50)),
                'packet_size_distribution': dict(self.packet_sizes.most_common(20)),
                'protocols': dict(self.protocols),
                'quic_analysis': dict(self.quic_patterns)
            },
            'anomalies': self.anomalies,
            'suspicious_macs': list(self.suspicious_macs),
            'uniform_flows_detected': len(self.uniform_traffic_flows)
        }
        
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2, default=str)
        
        print(f"\nResults saved to {output_file}")
        print(f"Total anomalies detected: {len(self.anomalies)}")
        print(f"Suspicious MACs found: {len(self.suspicious_macs)}")


def main():
    """Main entry point."""
    if len(sys.argv) != 2:
        print("Usage: python pcap_analyzer.py /path/to/pcap/directory")
        sys.exit(1)
    
    pcap_directory = sys.argv[1]
    
    if not os.path.exists(pcap_directory):
        print(f"Error: Directory {pcap_directory} does not exist")
        sys.exit(1)
    
    analyzer = MemoryEfficientPCAPAnalyzer()
    analyzer.analyze_directory(pcap_directory)
    
    # Print summary
    print("\n=== Analysis Complete ===")
    print(f"Processed {analyzer.stats['total_packets']:,} packets")
    print(f"Total data: {analyzer.stats['total_bytes'] / (1024**3):.2f} GB")
    print(f"Anomalies found: {len(analyzer.anomalies)}")
    
    if analyzer.suspicious_macs:
        print(f"\nSuspicious MACs detected: {analyzer.suspicious_macs}")


if __name__ == "__main__":
    main()