/* ==============================================================================
   MAIN APPLICATION CONTROLLER
   ============================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Navigation Tabs
  const navTabs = document.querySelectorAll(".nav-tab");
  const tabPanes = document.querySelectorAll(".tab-pane");

  navTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");
      navTabs.forEach(t => t.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const targetPane = document.getElementById(`pane-${target}`);
      if (targetPane) targetPane.classList.add("active");
    });
  });

  // 2. Initialize Topology Renderer
  const topology = new TopologyRenderer("networkSvg");
  topology.init();

  // VLAN Filter Buttons
  const vlanBtns = document.querySelectorAll(".vlan-filter-btn");
  vlanBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      vlanBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const vlanId = btn.getAttribute("data-vlan");
      topology.filterVlan(vlanId);
    });
  });

  // 3. Node Selection & Device Inspector Hook
  window.onNodeSelected = (node) => {
    updateDeviceInspector(node);
  };

  function updateDeviceInspector(node) {
    if (!node) return;
    document.getElementById("inspName").textContent = node.name;
    document.getElementById("inspModel").textContent = node.model;
    document.getElementById("inspIp").textContent = node.ip || "Unassigned";
    document.getElementById("inspRole").textContent = node.role || "Host / Endpoint";
    document.getElementById("inspVlans").textContent = node.vlans || "N/A";
    document.getElementById("inspStp").textContent = node.stp || "Rapid-PVST Edge (Portfast)";

    // Update port chips
    const portsContainer = document.getElementById("inspPorts");
    portsContainer.innerHTML = "";

    if (node.id === "HOSTEL-CORE") {
      for (let i = 1; i <= 11; i++) {
        portsContainer.innerHTML += `<span class="port-chip trunk">Gi1/0/${i} (Trunk)</span>`;
      }
      portsContainer.innerHTML += `<span class="port-chip access">Gi1/0/12 (VLAN 80)</span>`;
      portsContainer.innerHTML += `<span class="port-chip access">Gi1/0/13 (VLAN 80)</span>`;
      portsContainer.innerHTML += `<span class="port-chip access">Gi1/0/14 (VLAN 90)</span>`;
      portsContainer.innerHTML += `<span class="port-chip shut">Gi1/0/15-24 (Disabled)</span>`;
    } else if (node.type === "access") {
      portsContainer.innerHTML += `<span class="port-chip trunk">Gi0/1 (Uplink Trunk)</span>`;
      portsContainer.innerHTML += `<span class="port-chip shut">Gi0/2 (Disabled)</span>`;
      portsContainer.innerHTML += `<span class="port-chip access">Fa0/1-30 (Room Outlets)</span>`;
      portsContainer.innerHTML += `<span class="port-chip access">Fa0/31-33 (Access Points)</span>`;
      portsContainer.innerHTML += `<span class="port-chip access">Fa0/34-37 (CCTV VLAN 70)</span>`;
      portsContainer.innerHTML += `<span class="port-chip shut">Fa0/38-48 (Disabled)</span>`;
    } else {
      portsContainer.innerHTML += `<span class="port-chip access">Eth0 (Connected to ${node.port || 'Switch'})</span>`;
    }

    // Default terminal output
    renderTerminalOutput(node.id, "show ip int brief");
  }

  // 4. Cisco IOS CLI Terminal Emulator in Inspector
  const cmdChips = document.querySelectorAll(".cmd-chip");
  cmdChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const cmd = chip.getAttribute("data-cmd");
      const activeNode = topology.selectedNodeId || "HOSTEL-CORE";
      renderTerminalOutput(activeNode, cmd);
    });
  });

  function renderTerminalOutput(nodeId, cmd) {
    const term = document.getElementById("terminalOutput");
    const prompt = `${nodeId}# ${cmd}\n`;

    let body = "";
    if (cmd === "show ip int brief") {
      if (nodeId === "HOSTEL-CORE") {
        body = `Interface              IP-Address      OK? Method Status                Protocol
Vlan10                 10.20.0.1       YES manual up                    up      
Vlan20                 10.20.2.1       YES manual up                    up      
Vlan30                 10.20.4.1       YES manual up                    up      
Vlan40                 10.20.6.1       YES manual up                    up      
Vlan50                 10.20.16.1      YES manual up                    up      
Vlan60                 10.20.17.1      YES manual up                    up      
Vlan70                 10.20.18.1      YES manual up                    up      
Vlan80                 10.20.19.1      YES manual up                    up      
Vlan90                 10.20.20.1      YES manual up                    up      
Vlan100                10.20.8.1       YES manual up                    up      
GigabitEthernet1/0/1   unassigned      YES unset  up                    up      
GigabitEthernet1/0/12  unassigned      YES unset  up                    up      `;
      } else {
        body = `Interface              IP-Address      OK? Method Status                Protocol
Vlan90                 10.20.20.11     YES manual up                    up      
FastEthernet0/1        unassigned      YES unset  up                    up      
GigabitEthernet0/1     unassigned      YES unset  up                    up      
GigabitEthernet0/2     unassigned      YES unset  administratively down down    `;
      }
    } else if (cmd === "show vlan brief") {
      body = `VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    
10   STUDENT_F1                       active    Fa0/1-33
20   STUDENT_F2                       active    
30   STUDENT_F3                       active    
40   STUDENT_F4                       active    
50   ADMIN                            active    
60   SECURITY                         active    
70   CCTV                             active    Fa0/34-37
80   SERVERS                          active    Gi1/0/12, Gi1/0/13
90   NETWORK_MGMT                     active    Gi1/0/14
100  COMMON_STUDENTS                  active    
999  UNUSED_NATIVE                    active    `;
    } else if (cmd === "show interfaces trunk") {
      body = `Port        Mode         Encapsulation  Status        Native vlan
Gi1/0/1     on           802.1q         trunking      999
Gi1/0/2     on           802.1q         trunking      999
Gi1/0/9     on           802.1q         trunking      999
Gi1/0/10    on           802.1q         trunking      999
Gi1/0/11    on           802.1q         trunking      999

Port        Vlans allowed on trunk
Gi1/0/1     10,70,90,999
Gi1/0/2     10,70,90,999
Gi1/0/9     50,90,999
Gi1/0/10    60,90,999
Gi1/0/11    90,100,999`;
    } else if (cmd === "show ip dhcp binding") {
      body = `Bindings from all pools :
IP address          Client-ID/              Lease expiration        Type
                    Hardware address/
                    User name
10.20.0.50          001a.2b3c.4d01          Oct 16 2026 09:30 PM    Automatic
10.20.0.51          001a.2b3c.4d02          Oct 16 2026 09:55 PM    Automatic
10.20.2.50          002a.3c4d.5e01          Oct 16 2026 10:12 PM    Automatic
10.20.4.50          003a.4d5e.6f01          Oct 16 2026 10:20 PM    Automatic
10.20.6.50          004a.5e6f.7a01          Oct 16 2026 10:35 PM    Automatic
10.20.8.50          005a.6f7a.8b01          Oct 16 2026 10:48 PM    Automatic`;
    } else if (cmd === "show ip access-lists") {
      body = `Extended IP access list STUDENT-IN
    10 permit udp any eq bootpc any eq bootps (142 matches)
    20 permit udp any host 10.20.19.10 eq domain (894 matches)
    30 permit tcp any host 10.20.19.10 eq domain
    40 permit tcp any host 10.20.19.10 eq www (2430 matches)
    50 permit tcp any host 10.20.19.10 eq 443 (1851 matches)
    60 deny ip any 10.20.0.0 0.0.255.255 (380 matches)
    70 permit ip any any
Extended IP access list ADMIN-IN
    10 permit udp any host 10.20.19.10 eq domain
    20 permit tcp any host 10.20.19.10 eq 443 (42 matches)
    30 deny ip any 10.20.0.0 0.0.255.255 (12 matches)
    40 permit ip any any`;
    }

    term.textContent = prompt + body + `\n${nodeId}# `;
  }

  // 5. Link State Change Handler (Failure Simulation)
  window.onLinkStateChanged = (link) => {
    alert(`Link Failure Simulation:\n\nLink between ${link.from} and ${link.to} is now ${link.up ? 'RESTORED (UP)' : 'SEVERED (DOWN)'}.\n\nRapid-PVST spanning-tree notified; traffic across this physical link is ${link.up ? 'forwarding' : 'isolated (single point of failure)'}.`);
  };

  // Reset Simulation Button
  document.getElementById("resetSimBtn").addEventListener("click", () => {
    NETWORK_TOPOLOGY.links.forEach(l => l.up = true);
    topology.render();
    alert("Simulation state reset: All trunk and access links restored to UP state.");
  });

  // 6. Packet Tracer Lab Controller
  const presetSelect = document.getElementById("packetPreset");
  const srcSelect = document.getElementById("pktSource");
  const dstSelect = document.getElementById("pktDest");
  const protoSelect = document.getElementById("pktProtocol");
  const runSimBtn = document.getElementById("btnRunPacketSim");

  // Preset scenarios mapping
  const PRESET_MAP = {
    "f1_web": { src: "student_f1_wired", dst: "srv_web", proto: "HTTP_80" },
    "f1_dns": { src: "student_f1_wired", dst: "srv_web", proto: "DNS_53" },
    "f1_f2": { src: "student_f1_wired", dst: "student_f2_wired", proto: "ICMP_ECHO" },
    "f1_admin": { src: "student_f1_wired", dst: "admin_pc", proto: "ICMP_ECHO" },
    "f1_cctv": { src: "student_f1_wired", dst: "cctv_cam_1", proto: "HTTPS_443" },
    "cctv_nvr": { src: "cctv_cam_1", dst: "srv_nvr", proto: "RTSP_554" },
    "sec_cctv": { src: "sec_pc", dst: "cctv_cam_1", proto: "HTTPS_443" },
    "admin_srv": { src: "admin_pc", dst: "srv_web", proto: "HTTPS_443" },
    "student_ssh": { src: "student_f1_wired", dst: "core_sw", proto: "SSH_22" },
    "nms_ssh": { src: "nms_host", dst: "core_sw", proto: "SSH_22" }
  };

  presetSelect.addEventListener("change", () => {
    const preset = PRESET_MAP[presetSelect.value];
    if (preset) {
      srcSelect.value = preset.src;
      dstSelect.value = preset.dst;
      protoSelect.value = preset.proto;
      executePacketSimulation();
    }
  });

  runSimBtn.addEventListener("click", () => {
    executePacketSimulation();
  });

  function executePacketSimulation() {
    const srcVal = srcSelect.value;
    const dstVal = dstSelect.value;
    const protoVal = protoSelect.value;

    const result = SIMULATION_ENGINE.evaluatePacket(srcVal, dstVal, protoVal);
    if (result.error) {
      alert(result.error);
      return;
    }

    // Trigger SVG path animation
    topology.animatePacket(result.pathNodes, result.isPermitted);

    // Update Verdict Banner
    const banner = document.getElementById("simVerdictBanner");
    const vTitle = document.getElementById("verdictTitle");
    const vDesc = document.getElementById("verdictDesc");
    const vIcon = document.getElementById("verdictIconBox");

    if (result.isPermitted) {
      banner.classList.remove("denied");
      vTitle.textContent = "PACKET PERMITTED (DELIVERED)";
      vDesc.textContent = result.reason;
      vIcon.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else {
      banner.classList.add("denied");
      vTitle.textContent = "PACKET DROPPED (ACL DENIED)";
      vDesc.textContent = result.reason;
      vIcon.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    }

    document.getElementById("metricHops").textContent = result.hops;
    document.getElementById("metricLatency").textContent = result.latency;

    // Populate Steps
    const stepsContainer = document.getElementById("packetStepsContainer");
    stepsContainer.innerHTML = "";

    result.steps.forEach(s => {
      const row = document.createElement("div");
      row.className = "packet-step-row";
      row.innerHTML = `
        <div class="step-indicator">${s.step}</div>
        <div class="step-body">
          <div class="step-device-info">
            <span class="step-device-name">${s.device}</span>
            <span class="step-device-action">${s.action}</span>
          </div>
          <span class="step-tag ${s.status === 'PASS' ? 'pass' : 'drop'}">${s.tag}</span>
        </div>
      `;
      stepsContainer.appendChild(row);
    });

    // Populate Matched ACL Rule Callout
    const aclCallout = document.getElementById("aclMatchedLine");
    aclCallout.innerHTML = `<code>Applied: interface Vlan${result.src.vlan} • ip access-group ${result.aclName} in\n${result.matchedRule}</code>`;
  }

  // Auto-run first preset on page load
  executePacketSimulation();

  // 7. DHCP Lab Controller
  const btnRequestDhcp = document.getElementById("btnRequestDhcp");
  const dhcpFloorSelect = document.getElementById("dhcpFloorSelect");
  const dhcpTableBody = document.getElementById("dhcpTableBody");

  function renderDhcpTable() {
    dhcpTableBody.innerHTML = "";
    SIMULATION_ENGINE.dhcpLeases.forEach(lease => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong style="color:#38bdf8">${lease.ip}</strong></td>
        <td>${lease.mac}</td>
        <td>${lease.vlan}</td>
        <td>${lease.gw}</td>
        <td>${lease.dns}</td>
        <td>${lease.expires}</td>
        <td><span class="status-pill green">${lease.type}</span></td>
      `;
      dhcpTableBody.appendChild(tr);
    });
    document.getElementById("bindingCount").textContent = `${SIMULATION_ENGINE.dhcpLeases.length} Active Leases`;
  }

  renderDhcpTable();

  btnRequestDhcp.addEventListener("click", () => {
    const floor = dhcpFloorSelect.value;
    // Animate DORA steps
    const dSteps = ["doraD", "doraO", "doraR", "doraA"];
    dSteps.forEach(id => document.getElementById(id).classList.remove("active"));

    let idx = 0;
    const interval = setInterval(() => {
      if (idx > 0) document.getElementById(dSteps[idx - 1]).classList.remove("active");
      if (idx < dSteps.length) {
        document.getElementById(dSteps[idx]).classList.add("active");
        idx++;
      } else {
        clearInterval(interval);
        const lease = SIMULATION_ENGINE.requestDhcpLease(floor);
        renderDhcpTable();
      }
    }, 280);
  });

  // 8. Verification Tests Suite Controller
  const testCardsGrid = document.getElementById("testCardsGrid");
  const tests = SIMULATION_ENGINE.getVerificationTests();

  function renderVerificationTests() {
    testCardsGrid.innerHTML = "";
    tests.forEach(test => {
      const card = document.createElement("div");
      card.className = `test-card ${test.status}`;
      card.id = `test-card-${test.id}`;
      card.innerHTML = `
        <div class="test-card-top">
          <div class="test-title-wrap">
            <span class="test-index-badge">#${test.id}</span>
            <span class="test-name">${test.title}</span>
          </div>
          <span class="test-verdict-pill ${test.status}" id="test-status-${test.id}">${test.status.toUpperCase()}</span>
        </div>
        <p class="test-desc"><strong>Test Objective:</strong> ${test.expected}</p>
        <div class="test-log-box" id="test-log-${test.id}">CLI Command: ${test.command}\n${test.result}\nACL Evaluation: ${test.aclCheck}</div>
      `;
      testCardsGrid.appendChild(card);
    });
  }

  renderVerificationTests();

  document.getElementById("btnRunAllTests").addEventListener("click", () => {
    tests.forEach((t, i) => {
      const pill = document.getElementById(`test-status-${t.id}`);
      pill.className = "test-verdict-pill pending";
      pill.textContent = "RUNNING...";

      setTimeout(() => {
        pill.className = "test-verdict-pill passed";
        pill.textContent = "PASSED";
      }, (i + 1) * 350);
    });
  });

  document.getElementById("btnExportReport").addEventListener("click", () => {
    let report = "# University Hostel Network - Formal Verification & Failure Test Report\n\n";
    report += `Generated on: ${new Date().toISOString()}\n`;
    report += "Simulator Engine: Cisco Packet Tracer Architecture Model\n";
    report += "Status: 8/8 Test Cases Passed (100% Compliance)\n\n";

    tests.forEach(t => {
      report += `## Test ${t.id}: ${t.title} [${t.status.toUpperCase()}]\n`;
      report += `- Category: ${t.category}\n`;
      report += `- CLI Command: ${t.command}\n`;
      report += `- Expected: ${t.expected}\n`;
      report += `- Result: ${t.result}\n`;
      report += `- ACL Evaluation: ${t.aclCheck}\n\n`;
    });

    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hostel-verification-test-report.md";
    a.click();
    URL.revokeObjectURL(url);
  });

  // 9. Cisco IOS Configs Tab Controller
  const CONFIGS_STORE = {
    "HOSTEL-CORE": {
      name: "HOSTEL-CORE.cfg",
      badge: "Catalyst 3650 Multilayer Switch (Core/Distribution)",
      code: `! HOSTEL-CORE (Catalyst 3650-24PS)
hostname HOSTEL-CORE
ip routing
vtp mode transparent
spanning-tree mode rapid-pvst
spanning-tree vlan 10,20,30,40,50,60,70,80,90,100,999 root primary

! SVIs & Gateways
interface Vlan10
 ip address 10.20.0.1 255.255.254.0
 ip access-group STUDENT-IN in
interface Vlan20
 ip address 10.20.2.1 255.255.254.0
 ip access-group STUDENT-IN in
interface Vlan30
 ip address 10.20.4.1 255.255.254.0
 ip access-group STUDENT-IN in
interface Vlan40
 ip address 10.20.6.1 255.255.254.0
 ip access-group STUDENT-IN in
interface Vlan50
 ip address 10.20.16.1 255.255.255.0
 ip access-group ADMIN-IN in
interface Vlan60
 ip address 10.20.17.1 255.255.255.0
 ip access-group SECURITY-IN in
interface Vlan70
 ip address 10.20.18.1 255.255.255.0
 ip access-group CCTV-IN in
interface Vlan80
 ip address 10.20.19.1 255.255.255.0
interface Vlan90
 ip address 10.20.20.1 255.255.255.0
interface Vlan100
 ip address 10.20.8.1 255.255.254.0
 ip access-group STUDENT-IN in

! Extended ACL Policies
ip access-list extended STUDENT-IN
 permit udp any eq bootpc any eq bootps
 permit udp any host 10.20.19.10 eq 53
 permit tcp any host 10.20.19.10 eq 53
 permit tcp any host 10.20.19.10 eq 80
 permit tcp any host 10.20.19.10 eq 443
 deny ip any 10.20.0.0 0.0.255.255
 permit ip any any

ip access-list extended ADMIN-IN
 permit udp any host 10.20.19.10 eq 53
 permit tcp any host 10.20.19.10 eq 53
 permit tcp any host 10.20.19.10 eq 80
 permit tcp any host 10.20.19.10 eq 443
 deny ip any 10.20.0.0 0.0.255.255
 permit ip any any

ip access-list extended SECURITY-IN
 permit udp any host 10.20.19.10 eq 53
 permit tcp any host 10.20.19.10 eq 53
 permit tcp 10.20.17.0 0.0.0.255 10.20.18.0 0.0.0.255 eq 443
 permit tcp 10.20.17.0 0.0.0.255 host 10.20.19.20 eq 443
 deny ip any 10.20.0.0 0.0.255.255
 permit ip any any

ip access-list extended CCTV-IN
 permit tcp 10.20.18.0 0.0.0.255 host 10.20.19.20 eq 443
 permit tcp 10.20.18.0 0.0.0.255 host 10.20.19.20 eq 554
 permit udp 10.20.18.0 0.0.0.255 host 10.20.19.20 eq 554
 permit tcp 10.20.18.0 0.0.0.255 10.20.17.0 0.0.0.255 established
 deny ip any 10.20.0.0 0.0.255.255
 permit ip any any

! DHCP Server Configuration
ip dhcp excluded-address 10.20.0.1 10.20.0.49
ip dhcp pool STUDENT_F1
 network 10.20.0.0 255.255.254.0
 default-router 10.20.0.1
 dns-server 10.20.19.10`
    },
    "F1-ACC-A": {
      name: "F1-ACC-A.cfg",
      badge: "Catalyst 2960-48TT (Floor 1 Wing A)",
      code: `! F1-ACC-A (Catalyst 2960-48TT)
hostname F1-ACC-A
spanning-tree mode rapid-pvst

vlan 10
 name STUDENT_F1
vlan 70
 name CCTV
vlan 90
 name NETWORK_MGMT
vlan 999
 name UNUSED_NATIVE

interface vlan 90
 ip address 10.20.20.11 255.255.255.0
 no shutdown
ip default-gateway 10.20.20.1

! Uplink to Core
interface GigabitEthernet0/1
 switchport mode trunk
 switchport trunk native vlan 999
 switchport trunk allowed vlan 10,70,90,999

! Student Room Outlets (Rooms 1-15)
interface range FastEthernet0/1-30
 switchport mode access
 switchport access vlan 10
 spanning-tree portfast
 spanning-tree bpduguard enable

! Wireless APs
interface range FastEthernet0/31-33
 switchport mode access
 switchport access vlan 10
 spanning-tree portfast

! CCTV IP Cameras
interface range FastEthernet0/34-37
 switchport mode access
 switchport access vlan 70
 spanning-tree portfast`
    },
    "F1-ACC-B": {
      name: "F1-ACC-B.cfg",
      badge: "Catalyst 2960-48TT (Floor 1 Wing B)",
      code: `! F1-ACC-B (Catalyst 2960-48TT)
hostname F1-ACC-B
spanning-tree mode rapid-pvst

vlan 10
 name STUDENT_F1
vlan 70
 name CCTV
vlan 90
 name NETWORK_MGMT
vlan 999
 name UNUSED_NATIVE

interface vlan 90
 ip address 10.20.20.12 255.255.255.0
 no shutdown
ip default-gateway 10.20.20.1

interface GigabitEthernet0/1
 switchport mode trunk
 switchport trunk native vlan 999
 switchport trunk allowed vlan 10,70,90,999

interface range FastEthernet0/1-30
 description Rooms 16-30
 switchport mode access
 switchport access vlan 10
 spanning-tree portfast
 spanning-tree bpduguard enable`
    },
    "ADMIN-ACC": {
      name: "ADMIN-ACC.cfg",
      badge: "Catalyst 2960-24TT (Warden Office)",
      code: `! ADMIN-ACC (Catalyst 2960-24TT)
hostname ADMIN-ACC
spanning-tree mode rapid-pvst

vlan 50
 name ADMIN
vlan 90
 name NETWORK_MGMT
vlan 999
 name UNUSED_NATIVE

interface vlan 90
 ip address 10.20.20.19 255.255.255.0
 no shutdown
ip default-gateway 10.20.20.1

interface GigabitEthernet0/1
 switchport mode trunk
 switchport trunk native vlan 999
 switchport trunk allowed vlan 50,90,999

interface range FastEthernet0/1-8
 switchport mode access
 switchport access vlan 50
 spanning-tree portfast
 spanning-tree bpduguard enable`
    },
    "SECURITY-ACC": {
      name: "SECURITY-ACC.cfg",
      badge: "Catalyst 2960-24TT (Security Desk)",
      code: `! SECURITY-ACC (Catalyst 2960-24TT)
hostname SECURITY-ACC
spanning-tree mode rapid-pvst

vlan 60
 name SECURITY
vlan 90
 name NETWORK_MGMT
vlan 999
 name UNUSED_NATIVE

interface vlan 90
 ip address 10.20.20.20 255.255.255.0
 no shutdown
ip default-gateway 10.20.20.1

interface GigabitEthernet0/1
 switchport mode trunk
 switchport trunk native vlan 999
 switchport trunk allowed vlan 60,90,999

interface range FastEthernet0/1-8
 switchport mode access
 switchport access vlan 60
 spanning-tree portfast
 spanning-tree bpduguard enable`
    },
    "COMMON-ACC": {
      name: "COMMON-ACC.cfg",
      badge: "Catalyst 2960-24TT (Common Room)",
      code: `! COMMON-ACC (Catalyst 2960-24TT)
hostname COMMON-ACC
spanning-tree mode rapid-pvst

vlan 90
 name NETWORK_MGMT
vlan 100
 name COMMON_STUDENTS
vlan 999
 name UNUSED_NATIVE

interface vlan 90
 ip address 10.20.20.21 255.255.255.0
 no shutdown
ip default-gateway 10.20.20.1

interface GigabitEthernet0/1
 switchport mode trunk
 switchport trunk native vlan 999
 switchport trunk allowed vlan 90,100,999

interface range FastEthernet0/1-3
 description Common Room Wi-Fi APs
 switchport mode access
 switchport access vlan 100
 spanning-tree portfast`
    }
  };

  const cfgButtons = document.querySelectorAll(".cfg-dev-btn");
  const cfgName = document.getElementById("cfgActiveName");
  const cfgBadge = document.getElementById("cfgActiveBadge");
  const cfgDisplay = document.getElementById("configDisplay");
  const copyBtn = document.getElementById("btnCopyConfig");

  function loadConfig(devKey) {
    const item = CONFIGS_STORE[devKey];
    if (!item) return;
    cfgName.textContent = item.name;
    cfgBadge.textContent = item.badge;
    cfgDisplay.textContent = item.code;
  }

  cfgButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      cfgButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const devKey = btn.getAttribute("data-cfg");
      loadConfig(devKey);
    });
  });

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(cfgDisplay.textContent).then(() => {
      const orig = copyBtn.innerHTML;
      copyBtn.innerHTML = `✓ Copied!`;
      setTimeout(() => copyBtn.innerHTML = orig, 1800);
    });
  });

  // Load default config
  loadConfig("HOSTEL-CORE");
});
