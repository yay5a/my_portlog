#!/usr/bin/env python3
"""
PCAPNG Malware/Anomaly Analyzer
--------------------------------
Analyzes .pcapng files for suspicious traffic patterns:
- Broadcast storms
- ARP floods
- Rogue DHCP/IPv6 Router Advertisements
- Unusual port usage
- Top talkers (src/dst IPs)

Dependencies:
    pip install scapy

Run:
    python analyze_pcaps.py /path/to/pcapng/dir
"""

import os
import sys
import json
from scapy.all import rdpcap, ARP, DHCP, IPv6, UDP, TCP, Ether, IP
from collections import Counter, defaultdict


def analyze_pcap(file_path):
    try:
        packets = rdpcap(file_path)
    except Exception as e:
        return {"error": f"Could not read {file_path}: {e}"}

    total = len(packets)
    if total == 0:
        return {"error": f"No packets in {file_path}"}

    arp_counter = Counter()
    dhcp_counter = Counter()
    ipv6_ra_counter = Counter()
    udp_ports = Counter()
    tcp_ports = Counter()
    broadcasts = 0
    src_counter = Counter()
    dst_counter = Counter()

    for pkt in packets:
        # Broadcast detection
        if Ether in pkt and pkt[Ether].dst == "ff:ff:ff:ff:ff:ff":
            broadcasts += 1

        # ARP storms
        if ARP in pkt:
            arp_counter[pkt[ARP].psrc] += 1

        # DHCP floods
        if DHCP in pkt:
            dhcp_counter[pkt[Ether].src] += 1

        # IPv6 Router Advertisements
        if IPv6 in pkt and pkt[IPv6].nh == 58:  # ICMPv6
            ipv6_ra_counter[pkt[Ether].src] += 1

        # UDP/TCP ports
        if UDP in pkt:
            udp_ports[pkt[UDP].dport] += 1
        if TCP in pkt:
            tcp_ports[pkt[TCP].dport] += 1

        # IP-level talkers
        if IP in pkt:
            src_counter[pkt[IP].src] += 1
            dst_counter[pkt[IP].dst] += 1

    return {
        "total_packets": total,
        "broadcast_percent": round(100 * broadcasts / total, 2),
        "top_sources": src_counter.most_common(5),
        "top_destinations": dst_counter.most_common(5),
        "arp_suspects": arp_counter.most_common(3),
        "dhcp_suspects": dhcp_counter.most_common(3),
        "ipv6_ra_suspects": ipv6_ra_counter.most_common(3),
        "udp_ports": udp_ports.most_common(5),
        "tcp_ports": tcp_ports.most_common(5),
    }


def main(pcap_dir):
    report = {}
    for fname in os.listdir(pcap_dir):
        if fname.endswith(".pcapng"):
            path = os.path.join(pcap_dir, fname)
            print(f"[+] Analyzing {fname} ...")
            report[fname] = analyze_pcap(path)

    # Save JSON report
    out_path = os.path.join(pcap_dir, "pcap_analysis_report.json")
    with open(out_path, "w") as f:
        json.dump(report, f, indent=4)

    print("\n=== Summary Report ===")
    for f, r in report.items():
        print(f"\nFile: {f}")
        if "error" in r:
            print(f"  Error: {r['error']}")
            continue
        print(f"  Packets: {r['total_packets']}")
        print(f"  Broadcast %: {r['broadcast_percent']}")
        print(f"  Top Sources: {r['top_sources']}")
        print(f"  Top Destinations: {r['top_destinations']}")
        print(f"  ARP Suspects: {r['arp_suspects']}")
        print(f"  DHCP Suspects: {r['dhcp_suspects']}")
        print(f"  IPv6 RA Suspects: {r['ipv6_ra_suspects']}")
        print(f"  Top UDP Ports: {r['udp_ports']}")
        print(f"  Top TCP Ports: {r['tcp_ports']}")
    print(f"\n[+] JSON report written to {out_path}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python analyze_pcaps.py /path/to/pcapng/dir")
        sys.exit(1)
    main(sys.argv[1])
