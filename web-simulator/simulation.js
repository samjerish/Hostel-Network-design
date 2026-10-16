/* ==============================================================================
   PACKET TRACER SIMULATION, ACL EVALUATION & DHCP ENGINE
   ============================================================================== */

const SIMULATION_ENGINE = {
  // Endpoints Definition
  endpoints: {
    "student_f1_wired": { id: "student_f1_wired", name: "Room 102 PC", ip: "10.20.0.52", vlan: 10, mac: "0001.64A1.2B01", switch: "F1-ACC-A", port: "Fa0/2", node: "EP-F1-STU" },
    "student_f1_wifi":  { id: "student_f1_wifi",  name: "Floor 1 Laptop Wi-Fi", ip: "10.20.0.85", vlan: 10, mac: "0001.64A1.2B99", switch: "F1-ACC-A", port: "Fa0/31", node: "EP-F1-STU" },
    "student_f2_wired": { id: "student_f2_wired", name: "Room 205 PC", ip: "10.20.2.60", vlan: 20, mac: "0002.43B2.1105", switch: "F2-ACC-A", port: "Fa0/5", node: "EP-F2-STU" },
    "student_f2_wifi":  { id: "student_f2_wifi",  name: "Floor 2 Phone Wi-Fi", ip: "10.20.2.92", vlan: 20, mac: "0002.43B2.9902", switch: "F2-ACC-B", port: "Fa0/31", node: "EP-F2-STU" },
    "student_f3_wired": { id: "student_f3_wired", name: "Room 312 PC", ip: "10.20.4.55", vlan: 30, mac: "0003.88C1.3112", switch: "F3-ACC-A", port: "Fa0/12", node: "EP-F3-STU" },
    "student_f4_wired": { id: "student_f4_wired", name: "Room 418 PC", ip: "10.20.6.72", vlan: 40, mac: "0004.99D4.4118", switch: "F4-ACC-B", port: "Fa0/18", node: "EP-F4-STU" },
    "admin_pc":         { id: "admin_pc",         name: "Warden Workstation", ip: "10.20.16.10", vlan: 50, mac: "0050.1111.A001", switch: "ADMIN-ACC", port: "Fa0/1", node: "EP-WARDEN" },
    "sec_pc":           { id: "sec_pc",           name: "Security Guard Console", ip: "10.20.17.10", vlan: 60, mac: "0060.2222.B001", switch: "SECURITY-ACC", port: "Fa0/1", node: "EP-SECURITY" },
    "cctv_cam_1":       { id: "cctv_cam_1",       name: "CCTV Camera F1-01", ip: "10.20.18.11", vlan: 70, mac: "0070.3333.C011", switch: "F1-ACC-B", port: "Fa0/33", node: "EP-F1-CAM" },
    "cctv_cam_2":       { id: "cctv_cam_2",       name: "CCTV Camera F4-08", ip: "10.20.18.42", vlan: 70, mac: "0070.3333.C042", switch: "F4-ACC-B", port: "Fa0/36", node: "EP-F4-CAM" },
    "srv_web":          { id: "srv_web",          name: "HOSTEL-SRV (DNS & Web)", ip: "10.20.19.10", vlan: 80, mac: "0080.5555.D010", switch: "HOSTEL-CORE", port: "Gi1/0/12", node: "HOSTEL-SRV" },
    "srv_nvr":          { id: "srv_nvr",          name: "HOSTEL-NVR (Storage)", ip: "10.20.19.20", vlan: 80, mac: "0080.5555.D020", switch: "HOSTEL-CORE", port: "Gi1/0/13", node: "HOSTEL-NVR" },
    "nms_host":         { id: "nms_host",         name: "HOSTEL-NMS Host", ip: "10.20.20.10", vlan: 90, mac: "0090.7777.E010", switch: "HOSTEL-CORE", port: "Gi1/0/14", node: "HOSTEL-NMS" },
    "core_sw":          { id: "core_sw",          name: "HOSTEL-CORE SVI", ip: "10.20.20.1", vlan: 90, mac: "0000.0C07.AC01", switch: "HOSTEL-CORE", port: "Vlan90", node: "HOSTEL-CORE" },
    "f1_sw":            { id: "f1_sw",            name: "F1-ACC-A Mgmt SVI", ip: "10.20.20.11", vlan: 90, mac: "0011.2233.4401", switch: "F1-ACC-A", port: "Vlan90", node: "F1-ACC-A" },
    "common_wifi":      { id: "common_wifi",      name: "Common Room Tablet", ip: "10.20.8.61", vlan: 100, mac: "0100.4444.F061", switch: "COMMON-ACC", port: "Fa0/2", node: "EP-COMMON" }
  },

  // Active DHCP Table
  dhcpLeases: [
    { ip: "10.20.0.50", mac: "001A.2B3C.4D01", vlan: "VLAN 10 (F1)", gw: "10.20.0.1", dns: "10.20.19.10", expires: "23h 48m", type: "Automatic" },
    { ip: "10.20.0.51", mac: "001A.2B3C.4D02", vlan: "VLAN 10 (F1)", gw: "10.20.0.1", dns: "10.20.19.10", expires: "23h 12m", type: "Automatic" },
    { ip: "10.20.2.50", mac: "002A.3C4D.5E01", vlan: "VLAN 20 (F2)", gw: "10.20.2.1", dns: "10.20.19.10", expires: "22h 30m", type: "Automatic" },
    { ip: "10.20.4.50", mac: "003A.4D5E.6F01", vlan: "VLAN 30 (F3)", gw: "10.20.4.1", dns: "10.20.19.10", expires: "21h 15m", type: "Automatic" },
    { ip: "10.20.6.50", mac: "004A.5E6F.7A01", vlan: "VLAN 40 (F4)", gw: "10.20.6.1", dns: "10.20.19.10", expires: "20h 05m", type: "Automatic" },
    { ip: "10.20.8.50", mac: "005A.6F7A.8B01", vlan: "VLAN 100 (Common)", gw: "10.20.8.1", dns: "10.20.19.10", expires: "19h 40m", type: "Automatic" }
  ],

  // Simulate Packet Transmission
  evaluatePacket(srcKey, dstKey, protoKey) {
    const src = this.endpoints[srcKey];
    const dst = this.endpoints[dstKey];

    if (!src || !dst) {
      return { error: "Invalid source or destination selected." };
    }

    // Determine path through topology
    const pathNodes = [];
    const steps = [];

    // 1. Ingress at Source
    pathNodes.push(src.node);
    steps.push({
      step: 1,
      device: src.name,
      action: `Frame Encapsulation: IP packet (${src.ip} → ${dst.ip}) sent to access switch via port ${src.port}.`,
      status: "PASS",
      tag: `VLAN ${src.vlan} Access`
    });

    // 2. Access Switch Ingress & 802.1Q Trunk
    if (src.switch !== "HOSTEL-CORE") {
      pathNodes.push(src.switch);
      steps.push({
        step: 2,
        device: src.switch,
        action: `802.1Q Ingress: Inbound on ${src.port} tagged into VLAN ${src.vlan}. Egresses Gi0/1 trunk uplink to HOSTEL-CORE.`,
        status: "PASS",
        tag: "802.1Q Tagged"
      });
    }

    // 3. Multilayer Core Switch SVI & ACL Evaluation
    pathNodes.push("HOSTEL-CORE");

    let isPermitted = false;
    let aclName = "";
    let matchedRule = "";
    let reason = "";

    // Special Check: SSH Management Access (VTY Lines)
    if (protoKey === "SSH_22") {
      aclName = "MGMT-SSH (Standard VTY Access-Class)";
      if (src.ip === "10.20.20.10") {
        isPermitted = true;
        matchedRule = "permit host 10.20.20.10  <-- [MATCHED: PERMIT]";
        reason = "Authorized HOSTEL-NMS management station permitted SSH administrative access.";
      } else {
        isPermitted = false;
        matchedRule = "deny any  <-- [MATCHED: EXPLICIT DENY]";
        reason = "Unauthorized endpoint denied SSH terminal access to network infrastructure.";
      }
    }
    // Student Floor Traffic (VLANs 10, 20, 30, 40, 100)
    else if ([10, 20, 30, 40, 100].includes(src.vlan)) {
      aclName = "STUDENT-IN (Extended ACL on SVI)";

      if (protoKey === "DNS_53" && dst.ip === "10.20.19.10") {
        isPermitted = true;
        matchedRule = "permit udp any host 10.20.19.10 eq 53  <-- [MATCHED: PERMIT]";
        reason = "Authorized DNS domain lookup to HOSTEL-SRV permitted.";
      } else if (protoKey === "HTTP_80" && dst.ip === "10.20.19.10") {
        isPermitted = true;
        matchedRule = "permit tcp any host 10.20.19.10 eq 80  <-- [MATCHED: PERMIT]";
        reason = "Student access to designated Hostel Web Portal permitted.";
      } else if (protoKey === "HTTPS_443" && dst.ip === "10.20.19.10") {
        isPermitted = true;
        matchedRule = "permit tcp any host 10.20.19.10 eq 443  <-- [MATCHED: PERMIT]";
        reason = "Student access to designated Hostel Secure Web Portal permitted.";
      } else if (dst.ip.startsWith("10.20.")) {
        // Any other internal hostel destination
        isPermitted = false;
        matchedRule = "deny ip any 10.20.0.0 0.0.255.255  <-- [MATCHED: DENY]";
        if ([10, 20, 30, 40].includes(dst.vlan) && dst.vlan !== src.vlan) {
          reason = "Inter-floor student communication blocked by policy (inter-VLAN isolation).";
        } else if (dst.vlan === 50) {
          reason = "Student connection to administrative systems blocked by security policy.";
        } else if (dst.vlan === 60 || dst.vlan === 70) {
          reason = "Student access to security operations and CCTV devices strictly blocked.";
        } else {
          reason = "Student access to unauthorized internal hostel resource prohibited.";
        }
      } else {
        isPermitted = true;
        matchedRule = "permit ip any any  <-- [MATCHED]";
        reason = "Permitted by ACL (would route to Internet edge if upstream circuit existed).";
      }
    }
    // Admin Traffic (VLAN 50)
    else if (src.vlan === 50) {
      aclName = "ADMIN-IN (Extended ACL on SVI 50)";
      if (dst.ip === "10.20.19.10" && ["HTTP_80", "HTTPS_443", "DNS_53"].includes(protoKey)) {
        isPermitted = true;
        matchedRule = "permit tcp any host 10.20.19.10 eq 443  <-- [MATCHED: PERMIT]";
        reason = "Authorized administration workstation granted access to central servers.";
      } else if (dst.ip.startsWith("10.20.")) {
        isPermitted = false;
        matchedRule = "deny ip any 10.20.0.0 0.0.255.255  <-- [MATCHED: DENY]";
        reason = "Administrative network isolated from unauthorized internal hostel subnets.";
      } else {
        isPermitted = true;
        matchedRule = "permit ip any any";
        reason = "External access permitted.";
      }
    }
    // Security Operations (VLAN 60)
    else if (src.vlan === 60) {
      aclName = "SECURITY-IN (Extended ACL on SVI 60)";
      if (dst.vlan === 70 && protoKey === "HTTPS_443") {
        isPermitted = true;
        matchedRule = "permit tcp 10.20.17.0 0.0.0.255 10.20.18.0 0.0.0.255 eq 443  <-- [MATCHED: PERMIT]";
        reason = "Security guard station authorized to access CCTV camera web management console.";
      } else if (dst.ip === "10.20.19.20" && protoKey === "HTTPS_443") {
        isPermitted = true;
        matchedRule = "permit tcp 10.20.17.0 0.0.0.255 host 10.20.19.20 eq 443  <-- [MATCHED: PERMIT]";
        reason = "Security guard console authorized to view recorded video playback on HOSTEL-NVR.";
      } else if (dst.ip === "10.20.19.10" && protoKey === "DNS_53") {
        isPermitted = true;
        matchedRule = "permit udp any host 10.20.19.10 eq 53  <-- [MATCHED: PERMIT]";
        reason = "DNS resolution permitted.";
      } else {
        isPermitted = false;
        matchedRule = "deny ip any 10.20.0.0 0.0.255.255  <-- [MATCHED: DENY]";
        reason = "Security desk restricted to authorized security resources.";
      }
    }
    // CCTV Infrastructure (VLAN 70)
    else if (src.vlan === 70) {
      aclName = "CCTV-IN (Extended ACL on SVI 70)";
      if (dst.ip === "10.20.19.20" && ["RTSP_554", "HTTPS_443"].includes(protoKey)) {
        isPermitted = true;
        matchedRule = "permit tcp 10.20.18.0 0.0.0.255 host 10.20.19.20 eq 554  <-- [MATCHED: PERMIT]";
        reason = "IP Camera video streaming to central HOSTEL-NVR storage server permitted.";
      } else {
        isPermitted = false;
        matchedRule = "deny ip any 10.20.0.0 0.0.255.255  <-- [MATCHED: DENY]";
        reason = "CCTV camera isolated from student and unauthorized internal subnets.";
      }
    }
    // Management Host (VLAN 90)
    else if (src.vlan === 90) {
      aclName = "MANAGEMENT ROUTE";
      isPermitted = true;
      matchedRule = "SVI 90 (No inbound restriction for NMS)";
      reason = "Authorized NMS workstation permitted to manage network infrastructure.";
    }

    // SVI Step
    steps.push({
      step: 3,
      device: "HOSTEL-CORE (Catalyst 3650)",
      action: `ACL Evaluation: Checked against '${aclName}'. Result: ${isPermitted ? 'PERMIT' : 'DENY (DROP)'}.`,
      status: isPermitted ? "PASS" : "DROP",
      tag: isPermitted ? "ACL PERMIT" : "ACL DENY"
    });

    // 4. Egress to Destination if Permitted
    if (isPermitted) {
      if (dst.switch !== "HOSTEL-CORE") {
        pathNodes.push(dst.switch);
        steps.push({
          step: 4,
          device: dst.switch,
          action: `Egress Switching: Forwarded across trunk to destination access switch port ${dst.port}.`,
          status: "PASS",
          tag: `VLAN ${dst.vlan} Delivery`
        });
      }
      pathNodes.push(dst.node);
      steps.push({
        step: dst.switch !== "HOSTEL-CORE" ? 5 : 4,
        device: dst.name,
        action: `Packet Accepted: Destination ${dst.ip} received packet and generated return response.`,
        status: "PASS",
        tag: "Delivered (200 OK)"
      });
    }

    return {
      src,
      dst,
      isPermitted,
      aclName,
      matchedRule,
      reason,
      steps,
      pathNodes,
      hops: pathNodes.length - 1,
      latency: (0.8 + (pathNodes.length * 0.4)).toFixed(1) + " ms"
    };
  },

  // Perform DHCP Lease Simulation
  requestDhcpLease(floorId) {
    const floorMap = {
      "1":   { vlan: "VLAN 10 (F1)", base: "10.20.0.", start: 52, gw: "10.20.0.1", mask: "255.255.254.0" },
      "2":   { vlan: "VLAN 20 (F2)", base: "10.20.2.", start: 51, gw: "10.20.2.1", mask: "255.255.254.0" },
      "3":   { vlan: "VLAN 30 (F3)", base: "10.20.4.", start: 51, gw: "10.20.4.1", mask: "255.255.254.0" },
      "4":   { vlan: "VLAN 40 (F4)", base: "10.20.6.", start: 51, gw: "10.20.6.1", mask: "255.255.254.0" },
      "100": { vlan: "VLAN 100 (Common)", base: "10.20.8.", start: 51, gw: "10.20.8.1", mask: "255.255.254.0" }
    };

    const info = floorMap[floorId] || floorMap["1"];
    const randomHost = info.start + Math.floor(Math.random() * 80);
    const assignedIp = `${info.base}${randomHost}`;
    const randomHex = Math.floor(Math.random()*0xFFFF).toString(16).padStart(4, '0').toUpperCase();
    const mac = `001C.73A8.${randomHex}`;

    const newLease = {
      ip: assignedIp,
      mac: mac,
      vlan: info.vlan,
      gw: info.gw,
      dns: "10.20.19.10",
      expires: "24h 00m",
      type: "Automatic"
    };

    // Insert at top of table
    this.dhcpLeases.unshift(newLease);
    if (this.dhcpLeases.length > 15) this.dhcpLeases.pop();

    return newLease;
  },

  // 8 Verification Tests Suite
  getVerificationTests() {
    return [
      {
        id: 1,
        title: "DHCP Address Allocation (Floors 1-4)",
        category: "Network Services",
        command: "HOSTEL-CORE# show ip dhcp binding",
        expected: "All 4 student floors automatically acquire valid IP addresses from /23 pools (10.20.0.50-254) with default gateway and DNS 10.20.19.10.",
        status: "passed",
        result: "VERIFIED: DHCP DISCOVER broadcast correctly serviced by local Catalyst 3650 pools. Floor 1 (10.20.0.52), Floor 2 (10.20.2.60), Floor 3 (10.20.4.55), Floor 4 (10.20.6.72) allocated with 24-hour lease timers.",
        aclCheck: "STUDENT-IN: permit udp any eq bootpc any eq bootps [PASSED]"
      },
      {
        id: 2,
        title: "Inter-Floor Student Isolation",
        category: "Network Segmentation",
        command: "Room-102-PC> ping 10.20.2.60",
        expected: "Ping between Floor 1 student device and Floor 2 student device is dropped by extended ACL.",
        status: "passed",
        result: "VERIFIED: ICMP Echo packets dropped at Core SVI interface Vlan10. Traffic matching 'deny ip any 10.20.0.0 0.0.255.255' returned ICMP Destination Administratively Prohibited.",
        aclCheck: "STUDENT-IN: deny ip any 10.20.0.0 0.0.255.255 [DROPPED 100%]"
      },
      {
        id: 3,
        title: "Hostel Server Authorized Access",
        category: "Centralized Services",
        command: "Student-F1-PC> curl http://10.20.19.10:80",
        expected: "HTTP Port 80 and DNS Port 53 queries to HOSTEL-SRV are permitted from all student VLANs.",
        status: "passed",
        result: "VERIFIED: TCP 3-way handshake established between 10.20.0.52 and 10.20.19.10:80. HTTP 200 OK received with 1.2 ms round-trip time.",
        aclCheck: "STUDENT-IN: permit tcp any host 10.20.19.10 eq 80 [PERMITTED]"
      },
      {
        id: 4,
        title: "Denial of Student Access to Admin, Security & CCTV",
        category: "Access Control & Security",
        command: "Student-F1-PC> ping 10.20.16.10 && ping 10.20.18.11",
        expected: "Student requests to Warden Office (10.20.16.10), Security Console (10.20.17.10), and Cameras (10.20.18.x) are strictly blocked.",
        status: "passed",
        result: "VERIFIED: 100% packet loss. Neither ping nor TCP connections can cross from VLAN 10 into VLAN 50, 60, or 70. Administrative isolation intact.",
        aclCheck: "STUDENT-IN: deny ip any 10.20.0.0 0.0.255.255 [DROPPED]"
      },
      {
        id: 5,
        title: "Permitted Security & CCTV Communication",
        category: "Surveillance Policy",
        command: "CCTV-Cam-F1-01> rtsp://10.20.19.20:554/live",
        expected: "CCTV cameras stream video to HOSTEL-NVR via RTSP (554) and Security Guard console views camera web streams via HTTPS (443).",
        status: "passed",
        result: "VERIFIED: Video stream from 10.20.18.11 to NVR 10.20.19.20 permitted under CCTV-IN rule. Security console 10.20.17.10 HTTPS sessions permitted under SECURITY-IN rule.",
        aclCheck: "CCTV-IN: permit tcp 10.20.18.0 0.0.0.255 host 10.20.19.20 eq 554 [PERMITTED]"
      },
      {
        id: 6,
        title: "VLAN Membership & 802.1Q Trunk Integrity",
        category: "Switching Infrastructure",
        command: "HOSTEL-CORE# show interfaces trunk",
        expected: "All 11 switch downlinks operate in 802.1Q trunking mode with native VLAN 999 and strict allowed-VLAN pruning.",
        status: "passed",
        result: "VERIFIED: 11 active trunks (Gi1/0/1 to Gi1/0/11) operational. Native VLAN 999 untagged; all floor access ports mapped to their respective student VLANs with BPDU Guard enabled.",
        aclCheck: "Trunk allowed VLANs: 10,20,30,40,50,60,70,90,100,999 [VALIDATED]"
      },
      {
        id: 7,
        title: "Recovery Following Trunk Link Interruption",
        category: "Fault Tolerance",
        command: "HOSTEL-CORE(config-if)# shutdown Gi1/0/1",
        expected: "Document service interruption on affected access switch; non-redundant uplink isolates Floor 1 Wing A while other switches remain unaffected.",
        status: "passed",
        result: "VERIFIED: Single point of failure isolated to F1-ACC-A. F1-ACC-B continues serving Rooms 16-30 and 4 cameras. Rapid-PVST reports topology change with zero broadcast storm.",
        aclCheck: "Fault Isolation: Link failure restricted to single switch domain [CONFIRMED]"
      },
      {
        id: 8,
        title: "Effect of Access Switch Failure on Endpoints",
        category: "Resilience & Capacity",
        command: "Power cycle / failure simulation on F1-ACC-A",
        expected: "Rooms 1-15 and 3 APs lose connectivity, but Floor 1 retains 50% capacity via F1-ACC-B (rooms 16-30, 2 APs, 4 cameras).",
        status: "passed",
        result: "VERIFIED: Dual-switch architecture per floor prevents complete floor blackout. 50% wireless coverage and surveillance remain operational on Floor 1 South Wing.",
        aclCheck: "Split-Wing Resiliency: Floor capacity degrades gracefully to 50% [VERIFIED]"
      }
    ];
  }
};

window.SIMULATION_ENGINE = SIMULATION_ENGINE;
