#!/usr/bin/env python3
"""
Concise PCAPNG Investigation Tool
---------------------------------
Analyzes .pcapng files for suspicious device behaviors:

- Detects use of unusual ports (esp. 9999).
- Tracks devices by MAC with correlated IPs.
- Detects high-frequency connections to same destinations.
- Measures upload/download volume per device.
- Produces concise, aggregated summaries instead of verbose packet logs.
- Retains anomaly checks (ARP floods, DHCP, IPv6 RA, broadcasts).

Dependencies:
    pip install scapy

Run:
    python analyze_pcaps.py /path/to/pcapng/dir
"""

import os
import sys
import json
from collections import Counter, defaultdict
from scapy.all import rdpcap, ARP, DHCP, IPv6, UDP, TCP, Ether, IP

# Thresholds
HIGH_CONN_THRESHOLD = 10000  # flag devices making >10k connections
COMMON_PORTS = {80, 443, 53, 22, 25, 110, 143, 123}  # known common safe ports
TOP_N_DEST = 10  # max destinations to keep per device


def analyze_pcap(file_path, devices, timeline):
    try:
        packets = rdpcap(file_path)
    except Exception as e:
        return {"error": f"Could not read {file_path}: {e}"}

    total = len(packets)
    if total == 0:
        return {"error": f"No packets in {file_path}"}

    # anomaly trackers
    arp_counter = Counter()
    dhcp_counter = Counter()
    ipv6_ra_counter = Counter()
    udp_ports = Counter()
    tcp_ports = Counter()
    broadcasts = 0
    src_counter = Counter()
    dst_counter = Counter()

    for pkt in packets:
        ts = float(pkt.time)

        if not pkt.haslayer(Ether):
            continue
        src_mac = pkt[Ether].src
        dst_mac = pkt[Ether].dst
        dev = devices[src_mac]

        # Broadcast detection
        if dst_mac == "ff:ff:ff:ff:ff:ff":
            broadcasts += 1

        # ARP storms
        if ARP in pkt:
            arp_counter[pkt[ARP].psrc] += 1

        # DHCP floods
        if DHCP in pkt:
            dhcp_counter[src_mac] += 1

        # IPv6 Router Advertisements
        if IPv6 in pkt and pkt[IPv6].nh == 58:  # ICMPv6
            ipv6_ra_counter[src_mac] += 1

        # Initialize device fields
        dev.setdefault("ips", set())
        dev.setdefault("ports", Counter())
        dev.setdefault("connections", Counter())
        dev.setdefault("bytes_sent", 0)
        dev.setdefault("bytes_recv", 0)
        dev.setdefault(
            "port9999",
            {"first": None, "last": None, "count": 0, "destinations": Counter()},
        )

        # IP-level analysis
        if IP in pkt:
            src_ip = pkt[IP].src
            dst_ip = pkt[IP].dst
            dev["ips"].add(src_ip)
            src_counter[src_ip] += 1
            dst_counter[dst_ip] += 1

            # connections
            dev["connections"][dst_ip] += 1

            # data volume
            pkt_len = len(pkt)
            dev["bytes_sent"] += pkt_len
            if dst_mac in devices:
                devices[dst_mac]["bytes_recv"] += pkt_len

        # UDP/TCP ports
        if UDP in pkt:
            port = pkt[UDP].dport
            udp_ports[port] += 1
            dev["ports"][port] += 1
            if port == 9999 and IP in pkt:
                dev["port9999"]["count"] += 1
                dev["port9999"]["destinations"][pkt[IP].dst] += 1
                if dev["port9999"]["first"] is None:
                    dev["port9999"]["first"] = ts
                dev["port9999"]["last"] = ts

        if TCP in pkt:
            port = pkt[TCP].dport
            tcp_ports[port] += 1
            dev["ports"][port] += 1
            if port == 9999 and IP in pkt:
                dev["port9999"]["count"] += 1
                dev["port9999"]["destinations"][pkt[IP].dst] += 1
                if dev["port9999"]["first"] is None:
                    dev["port9999"]["first"] = ts
                dev["port9999"]["last"] = ts

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
    devices = defaultdict(dict)
    timeline = []
    report = {}

    # process files in chronological order (by modtime)
    pcap_files = [
        os.path.join(pcap_dir, f) for f in os.listdir(pcap_dir) if f.endswith(".pcapng")
    ]
    pcap_files.sort(key=lambda f: os.path.getmtime(f))

    for path in pcap_files:
        fname = os.path.basename(path)
        print(f"[+] Analyzing {fname} ...")
        report[fname] = analyze_pcap(path, devices, timeline)

    # build device summaries
    device_summary = {}
    for mac, info in devices.items():
        # Summarize port9999 activity
        p9999 = info.get("port9999", {})
        p9999_summary = None
        if p9999 and p9999["count"] > 0:
            p9999_summary = {
                "first_seen": p9999["first"],
                "last_seen": p9999["last"],
                "count": p9999["count"],
                "top_destinations": p9999["destinations"].most_common(5),
            }

        device_summary[mac] = {
            "ips": list(info.get("ips", [])),
            "total_bytes_sent": info.get("bytes_sent", 0),
            "total_bytes_recv": info.get("bytes_recv", 0),
            "top_ports": info.get("ports", Counter()).most_common(5),
            "top_connections": info.get("connections", Counter()).most_common(
                TOP_N_DEST
            ),
            "port9999_summary": p9999_summary,
            "flags": [],
        }

        # Flag suspicious patterns
        if p9999_summary:
            device_summary[mac]["flags"].append("Uses port 9999")
        if any(p not in COMMON_PORTS and p > 1024 for p in info.get("ports", {})):
            device_summary[mac]["flags"].append("Unusual port usage")
        if sum(info.get("connections", {}).values()) > HIGH_CONN_THRESHOLD:
            device_summary[mac]["flags"].append("High-frequency connections")
        if info.get("bytes_sent", 0) > 1e9:  # >1GB sent
            device_summary[mac]["flags"].append("Heavy data upload")

    final_report = {
        "files": report,
        "devices": device_summary,
    }

    # Save JSON report
    out_path = os.path.join(pcap_dir, "pcap_investigation_report.json")
    with open(out_path, "w") as f:
        json.dump(final_report, f, indent=4)

    print(f"\n[+] Investigation report written to {out_path}")
    print("[+] Devices flagged:")
    for mac, summary in device_summary.items():
        if summary["flags"]:
            print(f"  {mac}: {summary['flags']}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python analyze_pcaps.py /path/to/pcapng/dir")
        sys.exit(1)
    main(sys.argv[1])
