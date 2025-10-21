#!/usr/bin/env python3
"""
triage_parser_with_devices.py
=============================

This enhanced parser builds on ``triage_parser.py`` to integrate a device
inventory from a spreadsheet.  By mapping IP and MAC addresses to human‑friendly
device names, the output becomes much easier to interpret: instead of seeing
``192.168.4.82`` you see ``TV - Guest Room`` alongside its upload/download
statistics.  The script accepts two parameters: the directory of capture files
and the path to a device inventory in Excel format.

Key features:

* Streams packets from each pcap/pcapng file using Scapy to avoid high
  memory usage.
* Detects traffic crossing your private RFC 1918 prefixes (configurable via
  ``LOCAL_NETS``) and breaks out uploads/downloads to/from external peers.
* Looks up each internal IP and MAC address in the supplied inventory and
  annotates the report with device names where possible.
* Aggregates statistics across all captures and writes a JSON report as well
  as a console summary of top talkers and their device names.

Usage::

    python3 triage_parser_with_devices.py /path/to/pcaps /path/to/devices.xlsx

Your ``devices.xlsx`` must contain at least three columns named ``IPv4 Address``,
``MAC`` and ``Device``.  IP ranges or multiple addresses can be specified in
one cell separated by ``/`` or commas.

Requires: scapy, pandas
"""

from __future__ import annotations

import json
import os
import sys
from collections import Counter, defaultdict
from datetime import datetime
from typing import Dict, Iterable, Tuple

try:
    import pandas as pd
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "pandas must be installed to run this script.\n"
        "Install it with `pip install pandas` on the system where you have your PCAPs."
    )

try:
    from scapy.all import PcapReader, Packet, IP, IPv6, UDP, TCP
    from scapy.layers.l2 import Ether
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "Scapy must be installed to run this script.\n"
        "Install it with `pip install scapy` on the system where you have your PCAPs."
    )

# RFC1918 private networks plus common IPv6 local scopes; adjust to match your environment.
# IPv6 Unique Local Addresses (ULA) live in fc00::/7 and link-local addresses live in fe80::/10.
LOCAL_NETS = [
    '10.0.0.0/8',
    '172.16.0.0/12',
    '192.168.0.0/16',
    'fc00::/7',  # IPv6 ULA
    'fe80::/10',  # IPv6 link-local
]

# IP ranges to ignore entirely when classifying external traffic.
# These encompass well-known IPv4 and IPv6 multicast/broadcast prefixes (e.g. mDNS, SSDP).
IGNORED_NETS = [
    '224.0.0.0/4',  # IPv4 multicast
    'ff00::/8',     # IPv6 multicast
]


def is_local_ip(ip_addr: str) -> bool:
    """Return True if the IP address belongs to one of the local networks."""
    from ipaddress import ip_network, ip_address
    ip_obj = ip_address(ip_addr)
    for net_str in LOCAL_NETS:
        if ip_obj in ip_network(net_str):
            return True
    return False

def is_ignored_ip(ip_addr: str) -> bool:
    """
    Return True if the IP address falls into any ignored multicast/broadcast range.
    We treat these specially so that common service chatter like mDNS (224.0.0.251, ff02::fb)
    does not pollute external peer statistics.
    """
    from ipaddress import ip_network, ip_address
    ip_obj = ip_address(ip_addr)
    for net_str in IGNORED_NETS:
        if ip_obj in ip_network(net_str):
            return True
    return False


def load_device_inventory(path: str) -> Tuple[Dict[str, str], Dict[str, str]]:
    """
    Load a device inventory from an Excel file.  Returns two dictionaries:

    - ``ip_to_name``: maps each IP (string) to a friendly device name
    - ``mac_to_name``: maps each MAC (lowercase) to a friendly device name

    The inventory must contain columns ``IPv4 Address``, ``MAC`` and ``Device``.
    IP ranges or multiple addresses in a single cell can be separated by
    ``/`` or comma.
    """
    df = pd.read_excel(path)
    required = {'IPv4 Address', 'MAC', 'Device'}
    missing = required.difference(df.columns)
    if missing:
        raise ValueError(f'Missing required columns in inventory: {missing}')
    ip_to_name: Dict[str, str] = {}
    mac_to_name: Dict[str, str] = {}
    for _, row in df.iterrows():
        name = str(row['Device']).strip()
        # handle IPs separated by '/' or ','
        raw_ip = str(row['IPv4 Address']).strip()
        for part in raw_ip.replace(',', '/').split('/'):
            ip = part.strip()
            if ip:
                ip_to_name[ip] = name
        # store MAC in lower case
        mac = str(row['MAC']).strip().lower()
        if mac:
            mac_to_name[mac] = name
    return ip_to_name, mac_to_name


def parse_file(filepath: str, mac_to_name: Dict[str, str]) -> Dict:
    """
    Parse a single pcap/pcapng file and return a summary dictionary.  This
    function streams packets to avoid high memory usage, extracts MAC
    addresses explicitly from the Ethernet layer, maintains a mapping of
    observed IPs to their MACs, and classifies traffic crossing the
    configured local networks.
    """
    summary = {
        'file': os.path.basename(filepath),
        'total_packets': 0,
        'total_bytes': 0,
        'ts_first': None,
        'ts_last': None,
        'src_bytes': Counter(),
        'dst_bytes': Counter(),
        'external_src_bytes': Counter(),
        'external_dst_bytes': Counter(),
        'external_histogram': Counter(),
        'mac_src_bytes': Counter(),  # bytes by source MAC
        'mac_dst_bytes': Counter(),  # bytes by destination MAC
        # track last seen MAC address for each IP
        'ip_to_mac': {},
        # histograms of bytes by destination and source ports
        'dport_bytes': Counter(),
        'sport_bytes': Counter(),
        # maintain original port histogram (counts) for backward compatibility
        'port_histogram': Counter(),
    }
    try:
        reader = PcapReader(filepath)
    except Exception as exc:
        summary['error'] = f'Error opening {filepath}: {exc}'
        return summary
    try:
        for pkt in reader:  # type: Packet
            summary['total_packets'] += 1
            pkt_len = len(pkt)
            summary['total_bytes'] += pkt_len
            # update timestamps
            if hasattr(pkt, 'time'):
                if summary['ts_first'] is None:
                    summary['ts_first'] = pkt.time
                summary['ts_last'] = pkt.time
            # capture MAC addresses if present on the Ethernet layer
            src_mac = None
            dst_mac = None
            if Ether in pkt:
                try:
                    src_mac = pkt[Ether].src.lower()
                except Exception:
                    src_mac = None
                try:
                    dst_mac = pkt[Ether].dst.lower()
                except Exception:
                    dst_mac = None
                if src_mac:
                    summary['mac_src_bytes'][src_mac] += pkt_len
                if dst_mac:
                    summary['mac_dst_bytes'][dst_mac] += pkt_len
            # IPv4 or IPv6
            if IP in pkt:
                src_ip = pkt[IP].src
                dst_ip = pkt[IP].dst
            elif IPv6 in pkt:
                src_ip = pkt[IPv6].src
                dst_ip = pkt[IPv6].dst
            else:
                # skip packets without an IP layer
                continue

            # update mapping of IPs to observed MACs
            if src_mac:
                summary['ip_to_mac'][src_ip] = src_mac
            if dst_mac:
                summary['ip_to_mac'][dst_ip] = dst_mac

            summary['src_bytes'][src_ip] += pkt_len
            summary['dst_bytes'][dst_ip] += pkt_len

            # Determine external transfer direction, skipping ignored multicast/broadcast traffic
            ignore = is_ignored_ip(src_ip) or is_ignored_ip(dst_ip)
            if not ignore:
                src_local = is_local_ip(src_ip)
                dst_local = is_local_ip(dst_ip)
                if src_local and not dst_local:
                    summary['external_src_bytes'][src_ip] += pkt_len
                    summary['external_histogram'][dst_ip] += pkt_len
                elif not src_local and dst_local:
                    summary['external_dst_bytes'][dst_ip] += pkt_len
                    summary['external_histogram'][src_ip] += pkt_len

            # accumulate port statistics by bytes and maintain packet counts
            if UDP in pkt:
                dport = int(pkt[UDP].dport)
                sport = int(pkt[UDP].sport)
                summary['dport_bytes'][dport] += pkt_len
                summary['sport_bytes'][sport] += pkt_len
                summary['port_histogram'][dport] += 1
            elif TCP in pkt:
                dport = int(pkt[TCP].dport)
                sport = int(pkt[TCP].sport)
                summary['dport_bytes'][dport] += pkt_len
                summary['sport_bytes'][sport] += pkt_len
                summary['port_histogram'][dport] += 1
        return summary
    finally:
        reader.close()


def aggregate_results(per_file: Iterable[Dict]) -> Dict:
    """Combine per‑file summaries into an aggregate report."""
    agg = {
        'files': list(per_file),
        'total_packets': 0,
        'total_bytes': 0,
        'external_src_bytes': Counter(),
        'external_dst_bytes': Counter(),
        'external_histogram': Counter(),
        'mac_src_bytes': Counter(),
        'mac_dst_bytes': Counter(),
        # aggregated mapping of IPs to last-seen MAC addresses
        'ip_to_mac': {},
        # aggregated port byte histograms
        'dport_bytes': Counter(),
        'sport_bytes': Counter(),
    }
    for fsum in agg['files']:
        agg['total_packets'] += fsum.get('total_packets', 0)
        agg['total_bytes'] += fsum.get('total_bytes', 0)
        agg['external_src_bytes'].update(fsum.get('external_src_bytes', {}))
        agg['external_dst_bytes'].update(fsum.get('external_dst_bytes', {}))
        agg['external_histogram'].update(fsum.get('external_histogram', {}))
        agg['mac_src_bytes'].update(fsum.get('mac_src_bytes', {}))
        agg['mac_dst_bytes'].update(fsum.get('mac_dst_bytes', {}))
        # Combine IP→MAC mappings. Later entries override earlier ones.
        agg['ip_to_mac'].update(fsum.get('ip_to_mac', {}))
        # Merge port byte histograms
        agg['dport_bytes'].update(fsum.get('dport_bytes', {}))
        agg['sport_bytes'].update(fsum.get('sport_bytes', {}))
    return agg


def main(dir_path: str, devices_path: str) -> None:
    """
    Parse all capture files in ``dir_path`` while using the device inventory in
    ``devices_path`` to annotate results.  Writes a JSON report and prints
    top talkers with device names to the console.
    """
    if not os.path.isdir(dir_path):
        raise SystemExit(f'{dir_path!r} is not a directory')
    if not os.path.isfile(devices_path):
        raise SystemExit(f'{devices_path!r} does not exist')
    ip_to_name, mac_to_name = load_device_inventory(devices_path)
    files = [
        os.path.join(dir_path, fn)
        for fn in os.listdir(dir_path)
        if fn.lower().endswith(('.pcap', '.pcapng'))
    ]
    files.sort(key=lambda f: os.path.getmtime(f))
    per_file_results = []
    for f in files:
        print(f'Parsing {os.path.basename(f)}...')
        res = parse_file(f, mac_to_name)
        # convert epoch timestamps to ISO strings for readability
        # Cast timestamps to float before converting to ISO.  Scapy may
        # return EDecimal objects which cannot be passed directly to
        # datetime.fromtimestamp().  Explicitly cast to float to avoid
        # TypeError.
        if res.get('ts_first') is not None:
            try:
                ts_first = float(res['ts_first'])
            except Exception:
                ts_first = float(str(res['ts_first']))
            res['ts_first'] = datetime.fromtimestamp(ts_first).isoformat()
        if res.get('ts_last') is not None:
            try:
                ts_last = float(res['ts_last'])
            except Exception:
                ts_last = float(str(res['ts_last']))
            res['ts_last'] = datetime.fromtimestamp(ts_last).isoformat()
        per_file_results.append(res)
    report = aggregate_results(per_file_results)
    # annotate aggregated top talkers with device names
    top_uploaders = []
    # Determine device names for top external uploaders: check IP mapping then MAC mapping
    for ip, total_bytes in report['external_src_bytes'].most_common(20):
        mac = report.get('ip_to_mac', {}).get(ip)
        if ip in ip_to_name:
            name = ip_to_name[ip]
        elif mac and mac in mac_to_name:
            name = mac_to_name[mac]
        else:
            name = 'Unknown'
        top_uploaders.append({'ip': ip, 'device': name, 'bytes': total_bytes})

    top_downloaders = []
    # Determine device names for top external downloaders: check IP mapping then MAC mapping
    for ip, total_bytes in report['external_dst_bytes'].most_common(20):
        mac = report.get('ip_to_mac', {}).get(ip)
        if ip in ip_to_name:
            name = ip_to_name[ip]
        elif mac and mac in mac_to_name:
            name = mac_to_name[mac]
        else:
            name = 'Unknown'
        top_downloaders.append({'ip': ip, 'device': name, 'bytes': total_bytes})
    # include these annotated lists in the report
    report['top_uploaders'] = top_uploaders
    report['top_downloaders'] = top_downloaders
    # write JSON report
    out_path = os.path.join(dir_path, 'triage_report_with_devices.json')
    with open(out_path, 'w') as fh:
        json.dump(report, fh, indent=2)
    print(f'Wrote report to {out_path}')
    # console summary
    print('\nTop uploaders (with device names):')
    for entry in top_uploaders[:10]:
        mb = entry['bytes'] / (1024**2)
        print(f"  {entry['ip']} ({entry['device']}): {mb:.2f} MB")
    print('\nTop downloaders (with device names):')
    for entry in top_downloaders[:10]:
        mb = entry['bytes'] / (1024**2)
        print(f"  {entry['ip']} ({entry['device']}): {mb:.2f} MB")


if __name__ == '__main__':  # pragma: no cover
    if len(sys.argv) != 3:
        print('Usage: python3 triage_parser_with_devices.py <pcap_directory> <devices.xlsx>')
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])