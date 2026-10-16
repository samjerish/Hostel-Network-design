/* ==============================================================================
   TOPOLOGY MAP & SVG RENDER ENGINE
   ============================================================================== */

const NETWORK_TOPOLOGY = {
  nodes: {
    // Collapsed Core Multilayer Switch
    "HOSTEL-CORE": {
      id: "HOSTEL-CORE",
      name: "HOSTEL-CORE",
      type: "core",
      model: "Catalyst 3650-24PS",
      ip: "10.20.20.1",
      role: "Collapsed Core / Distribution, SVIs, Inter-VLAN Routing, DHCP Server",
      vlans: "10,20,30,40,50,60,70,80,90,100,999",
      x: 650, y: 150,
      width: 170, height: 54,
      stp: "Rapid-PVST (Root Primary)"
    },

    // Servers directly attached to Core
    "HOSTEL-SRV": {
      id: "HOSTEL-SRV",
      name: "HOSTEL-SRV (DNS & Web)",
      type: "server",
      model: "Server-PT (Dual NIC)",
      ip: "10.20.19.10",
      role: "Central Web Portal (HTTP 80/443), DNS (UDP 53)",
      vlans: "80",
      x: 470, y: 40,
      width: 150, height: 44,
      port: "Core Gi1/0/12"
    },
    "HOSTEL-NVR": {
      id: "HOSTEL-NVR",
      name: "HOSTEL-NVR (Video Storage)",
      type: "server",
      model: "Server-PT Storage Appliance",
      ip: "10.20.19.20",
      role: "Surveillance NVR, RTSP 554, HTTPS 443",
      vlans: "80",
      x: 650, y: 40,
      width: 150, height: 44,
      port: "Core Gi1/0/13"
    },
    "HOSTEL-NMS": {
      id: "HOSTEL-NMS",
      name: "HOSTEL-NMS (Admin Station)",
      type: "endpoint",
      model: "PC-PT Management Host",
      ip: "10.20.20.10",
      role: "Authorized Network Management (SSH v2)",
      vlans: "90",
      x: 830, y: 40,
      width: 150, height: 44,
      port: "Core Gi1/0/14"
    },

    // Floor 1 Access Switches
    "F1-ACC-A": {
      id: "F1-ACC-A",
      name: "F1-ACC-A (Floor 1 Wing A)",
      type: "access",
      model: "Catalyst 2960-48TT",
      ip: "10.20.20.11",
      role: "Floor 1 Rooms 1-15, 3 APs, 4 Cameras",
      vlans: "10,70,90,999",
      x: 90, y: 320,
      width: 120, height: 48,
      uplink: "Core Gi1/0/1"
    },
    "F1-ACC-B": {
      id: "F1-ACC-B",
      name: "F1-ACC-B (Floor 1 Wing B)",
      type: "access",
      model: "Catalyst 2960-48TT",
      ip: "10.20.20.12",
      role: "Floor 1 Rooms 16-30, 2 APs, 4 Cameras",
      vlans: "10,70,90,999",
      x: 230, y: 320,
      width: 120, height: 48,
      uplink: "Core Gi1/0/2"
    },

    // Floor 2 Access Switches
    "F2-ACC-A": {
      id: "F2-ACC-A",
      name: "F2-ACC-A (Floor 2 Wing A)",
      type: "access",
      model: "Catalyst 2960-48TT",
      ip: "10.20.20.13",
      role: "Floor 2 Rooms 1-15, 3 APs, 4 Cameras",
      vlans: "20,70,90,999",
      x: 370, y: 320,
      width: 120, height: 48,
      uplink: "Core Gi1/0/3"
    },
    "F2-ACC-B": {
      id: "F2-ACC-B",
      name: "F2-ACC-B (Floor 2 Wing B)",
      type: "access",
      model: "Catalyst 2960-48TT",
      ip: "10.20.20.14",
      role: "Floor 2 Rooms 16-30, 2 APs, 4 Cameras",
      vlans: "20,70,90,999",
      x: 510, y: 320,
      width: 120, height: 48,
      uplink: "Core Gi1/0/4"
    },

    // Floor 3 Access Switches
    "F3-ACC-A": {
      id: "F3-ACC-A",
      name: "F3-ACC-A (Floor 3 Wing A)",
      type: "access",
      model: "Catalyst 2960-48TT",
      ip: "10.20.20.15",
      role: "Floor 3 Rooms 1-15, 3 APs, 4 Cameras",
      vlans: "30,70,90,999",
      x: 650, y: 320,
      width: 120, height: 48,
      uplink: "Core Gi1/0/5"
    },
    "F3-ACC-B": {
      id: "F3-ACC-B",
      name: "F3-ACC-B (Floor 3 Wing B)",
      type: "access",
      model: "Catalyst 2960-48TT",
      ip: "10.20.20.16",
      role: "Floor 3 Rooms 16-30, 2 APs, 4 Cameras",
      vlans: "30,70,90,999",
      x: 790, y: 320,
      width: 120, height: 48,
      uplink: "Core Gi1/0/6"
    },

    // Floor 4 Access Switches
    "F4-ACC-A": {
      id: "F4-ACC-A",
      name: "F4-ACC-A (Floor 4 Wing A)",
      type: "access",
      model: "Catalyst 2960-48TT",
      ip: "10.20.20.17",
      role: "Floor 4 Rooms 1-15, 3 APs, 4 Cameras",
      vlans: "40,70,90,999",
      x: 930, y: 320,
      width: 120, height: 48,
      uplink: "Core Gi1/0/7"
    },
    "F4-ACC-B": {
      id: "F4-ACC-B",
      name: "F4-ACC-B (Floor 4 Wing B)",
      type: "access",
      model: "Catalyst 2960-48TT",
      ip: "10.20.20.18",
      role: "Floor 4 Rooms 16-30, 2 APs, 4 Cameras",
      vlans: "40,70,90,999",
      x: 1070, y: 320,
      width: 120, height: 48,
      uplink: "Core Gi1/0/8"
    },

    // Facility Access Switches
    "ADMIN-ACC": {
      id: "ADMIN-ACC",
      name: "ADMIN-ACC (Warden Office)",
      type: "access",
      model: "Catalyst 2960-24TT",
      ip: "10.20.20.19",
      role: "Warden & Administrative Staff Ports",
      vlans: "50,90,999",
      x: 1210, y: 300,
      width: 120, height: 48,
      uplink: "Core Gi1/0/9"
    },
    "SECURITY-ACC": {
      id: "SECURITY-ACC",
      name: "SECURITY-ACC (Security Desk)",
      type: "access",
      model: "Catalyst 2960-24TT",
      ip: "10.20.20.20",
      role: "Security Guard Station & Video Console",
      vlans: "60,90,999",
      x: 1210, y: 390,
      width: 120, height: 48,
      uplink: "Core Gi1/0/10"
    },
    "COMMON-ACC": {
      id: "COMMON-ACC",
      name: "COMMON-ACC (Common Room)",
      type: "access",
      model: "Catalyst 2960-24TT",
      ip: "10.20.20.21",
      role: "Student Wi-Fi APs & Study Hall Outlets",
      vlans: "90,100,999",
      x: 1210, y: 480,
      width: 120, height: 48,
      uplink: "Core Gi1/0/11"
    },

    // Representative Endpoints Layer (Bottom Row)
    "EP-F1-STU": {
      id: "EP-F1-STU",
      name: "Floor 1 Students & APs",
      type: "endpoint",
      model: "PCs, Laptops, 5x APs",
      ip: "10.20.0.50-254 (DHCP)",
      role: "Floor 1 Outlets & Wi-Fi",
      vlans: "10",
      x: 160, y: 480,
      width: 150, height: 42
    },
    "EP-F1-CAM": {
      id: "EP-F1-CAM",
      name: "Floor 1 CCTV (8 Cams)",
      type: "endpoint",
      model: "8x IP Cameras",
      ip: "10.20.18.11-18",
      role: "Surveillance Cameras",
      vlans: "70",
      x: 160, y: 560,
      width: 150, height: 40
    },

    "EP-F2-STU": {
      id: "EP-F2-STU",
      name: "Floor 2 Students & APs",
      type: "endpoint",
      model: "PCs, Laptops, 5x APs",
      ip: "10.20.2.50-254 (DHCP)",
      role: "Floor 2 Outlets & Wi-Fi",
      vlans: "20",
      x: 440, y: 480,
      width: 150, height: 42
    },
    "EP-F2-CAM": {
      id: "EP-F2-CAM",
      name: "Floor 2 CCTV (8 Cams)",
      type: "endpoint",
      model: "8x IP Cameras",
      ip: "10.20.18.19-26",
      role: "Surveillance Cameras",
      vlans: "70",
      x: 440, y: 560,
      width: 150, height: 40
    },

    "EP-F3-STU": {
      id: "EP-F3-STU",
      name: "Floor 3 Students & APs",
      type: "endpoint",
      model: "PCs, Laptops, 5x APs",
      ip: "10.20.4.50-254 (DHCP)",
      role: "Floor 3 Outlets & Wi-Fi",
      vlans: "30",
      x: 720, y: 480,
      width: 150, height: 42
    },
    "EP-F3-CAM": {
      id: "EP-F3-CAM",
      name: "Floor 3 CCTV (8 Cams)",
      type: "endpoint",
      model: "8x IP Cameras",
      ip: "10.20.18.27-34",
      role: "Surveillance Cameras",
      vlans: "70",
      x: 720, y: 560,
      width: 150, height: 40
    },

    "EP-F4-STU": {
      id: "EP-F4-STU",
      name: "Floor 4 Students & APs",
      type: "endpoint",
      model: "PCs, Laptops, 5x APs",
      ip: "10.20.6.50-254 (DHCP)",
      role: "Floor 4 Outlets & Wi-Fi",
      vlans: "40",
      x: 1000, y: 480,
      width: 150, height: 42
    },
    "EP-F4-CAM": {
      id: "EP-F4-CAM",
      name: "Floor 4 CCTV (8 Cams)",
      type: "endpoint",
      model: "8x IP Cameras",
      ip: "10.20.18.35-42",
      role: "Surveillance Cameras",
      vlans: "70",
      x: 1000, y: 560,
      width: 150, height: 40
    },

    "EP-WARDEN": {
      id: "EP-WARDEN",
      name: "Warden Workstation",
      type: "endpoint",
      model: "Admin PC",
      ip: "10.20.16.10",
      role: "Hostel Admin Desk",
      vlans: "50",
      x: 1210, y: 640,
      width: 140, height: 38
    },
    "EP-SECURITY": {
      id: "EP-SECURITY",
      name: "Security Console",
      type: "endpoint",
      model: "Surveillance Station",
      ip: "10.20.17.10",
      role: "Live Video Monitoring",
      vlans: "60",
      x: 1050, y: 640,
      width: 140, height: 38
    },
    "EP-COMMON": {
      id: "EP-COMMON",
      name: "Common Wi-Fi (3 APs)",
      type: "endpoint",
      model: "Wireless Laptops/Phones",
      ip: "10.20.8.50-254",
      role: "Recreational Access",
      vlans: "100",
      x: 880, y: 640,
      width: 140, height: 38
    }
  },

  links: [
    // Core to Servers
    { id: "link-core-srv", from: "HOSTEL-CORE", to: "HOSTEL-SRV", type: "access", vlans: [80], portFrom: "Gi1/0/12", portTo: "NIC", up: true },
    { id: "link-core-nvr", from: "HOSTEL-CORE", to: "HOSTEL-NVR", type: "access", vlans: [80], portFrom: "Gi1/0/13", portTo: "NIC", up: true },
    { id: "link-core-nms", from: "HOSTEL-CORE", to: "HOSTEL-NMS", type: "access", vlans: [90], portFrom: "Gi1/0/14", portTo: "NIC", up: true },

    // Core to Floor 1 Access Switches
    { id: "link-core-f1a", from: "HOSTEL-CORE", to: "F1-ACC-A", type: "trunk", vlans: [10,70,90,999], portFrom: "Gi1/0/1", portTo: "Gi0/1", up: true },
    { id: "link-core-f1b", from: "HOSTEL-CORE", to: "F1-ACC-B", type: "trunk", vlans: [10,70,90,999], portFrom: "Gi1/0/2", portTo: "Gi0/1", up: true },

    // Core to Floor 2 Access Switches
    { id: "link-core-f2a", from: "HOSTEL-CORE", to: "F2-ACC-A", type: "trunk", vlans: [20,70,90,999], portFrom: "Gi1/0/3", portTo: "Gi0/1", up: true },
    { id: "link-core-f2b", from: "HOSTEL-CORE", to: "F2-ACC-B", type: "trunk", vlans: [20,70,90,999], portFrom: "Gi1/0/4", portTo: "Gi0/1", up: true },

    // Core to Floor 3 Access Switches
    { id: "link-core-f3a", from: "HOSTEL-CORE", to: "F3-ACC-A", type: "trunk", vlans: [30,70,90,999], portFrom: "Gi1/0/5", portTo: "Gi0/1", up: true },
    { id: "link-core-f3b", from: "HOSTEL-CORE", to: "F3-ACC-B", type: "trunk", vlans: [30,70,90,999], portFrom: "Gi1/0/6", portTo: "Gi0/1", up: true },

    // Core to Floor 4 Access Switches
    { id: "link-core-f4a", from: "HOSTEL-CORE", to: "F4-ACC-A", type: "trunk", vlans: [40,70,90,999], portFrom: "Gi1/0/7", portTo: "Gi0/1", up: true },
    { id: "link-core-f4b", from: "HOSTEL-CORE", to: "F4-ACC-B", type: "trunk", vlans: [40,70,90,999], portFrom: "Gi1/0/8", portTo: "Gi0/1", up: true },

    // Core to Facility Switches
    { id: "link-core-admin", from: "HOSTEL-CORE", to: "ADMIN-ACC", type: "trunk", vlans: [50,90,999], portFrom: "Gi1/0/9", portTo: "Gi0/1", up: true },
    { id: "link-core-sec", from: "HOSTEL-CORE", to: "SECURITY-ACC", type: "trunk", vlans: [60,90,999], portFrom: "Gi1/0/10", portTo: "Gi0/1", up: true },
    { id: "link-core-common", from: "HOSTEL-CORE", to: "COMMON-ACC", type: "trunk", vlans: [90,100,999], portFrom: "Gi1/0/11", portTo: "Gi0/1", up: true },

    // Floor Switches to Endpoints
    { id: "link-f1-stu", from: "F1-ACC-A", to: "EP-F1-STU", type: "access", vlans: [10], portFrom: "Fa0/1-33", portTo: "Rooms/APs", up: true },
    { id: "link-f1-cam", from: "F1-ACC-B", to: "EP-F1-CAM", type: "access", vlans: [70], portFrom: "Fa0/33-36", portTo: "CCTV", up: true },

    { id: "link-f2-stu", from: "F2-ACC-A", to: "EP-F2-STU", type: "access", vlans: [20], portFrom: "Fa0/1-33", portTo: "Rooms/APs", up: true },
    { id: "link-f2-cam", from: "F2-ACC-B", to: "EP-F2-CAM", type: "access", vlans: [70], portFrom: "Fa0/33-36", portTo: "CCTV", up: true },

    { id: "link-f3-stu", from: "F3-ACC-A", to: "EP-F3-STU", type: "access", vlans: [30], portFrom: "Fa0/1-33", portTo: "Rooms/APs", up: true },
    { id: "link-f3-cam", from: "F3-ACC-B", to: "EP-F3-CAM", type: "access", vlans: [70], portFrom: "Fa0/33-36", portTo: "CCTV", up: true },

    { id: "link-f4-stu", from: "F4-ACC-A", to: "EP-F4-STU", type: "access", vlans: [40], portFrom: "Fa0/1-33", portTo: "Rooms/APs", up: true },
    { id: "link-f4-cam", from: "F4-ACC-B", to: "EP-F4-CAM", type: "access", vlans: [70], portFrom: "Fa0/33-36", portTo: "CCTV", up: true },

    { id: "link-admin-warden", from: "ADMIN-ACC", to: "EP-WARDEN", type: "access", vlans: [50], portFrom: "Fa0/1", portTo: "NIC", up: true },
    { id: "link-sec-guard", from: "SECURITY-ACC", to: "EP-SECURITY", type: "access", vlans: [60], portFrom: "Fa0/1", portTo: "NIC", up: true },
    { id: "link-common-wifi", from: "COMMON-ACC", to: "EP-COMMON", type: "access", vlans: [100], portFrom: "Fa0/1-3", portTo: "APs", up: true }
  ]
};

class TopologyRenderer {
  constructor(svgId) {
    this.svg = document.getElementById(svgId);
    this.linksGroup = document.getElementById("linksGroup");
    this.nodesGroup = document.getElementById("nodesGroup");
    this.packetsGroup = document.getElementById("packetsGroup");
    this.selectedNodeId = "HOSTEL-CORE";
    this.activeVlanFilter = "all";
  }

  init() {
    this.render();
  }

  render() {
    this.renderLinks();
    this.renderNodes();
  }

  renderLinks() {
    this.linksGroup.innerHTML = "";

    NETWORK_TOPOLOGY.links.forEach(link => {
      const fromNode = NETWORK_TOPOLOGY.nodes[link.from];
      const toNode = NETWORK_TOPOLOGY.nodes[link.to];
      if (!fromNode || !toNode) return;

      const x1 = fromNode.x;
      const y1 = fromNode.y;
      const x2 = toNode.x;
      const y2 = toNode.y;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      // Gentle curve
      const dx = x2 - x1;
      const dy = y2 - y1;
      const cx1 = x1;
      const cy1 = y1 + dy * 0.45;
      const cx2 = x2;
      const cy2 = y2 - dy * 0.45;
      const d = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

      path.setAttribute("d", d);
      path.setAttribute("id", `svg-link-${link.id}`);
      path.setAttribute("class", `svg-link ${link.type} ${link.up ? 'up' : 'down'}`);
      path.setAttribute("data-link-id", link.id);

      // Tooltip / title
      const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
      title.textContent = `${link.from} (${link.portFrom}) <--> ${link.to} (${link.portTo}) [${link.type.toUpperCase()}] • Click to cut/restore`;
      path.appendChild(title);

      // Link failure simulation click handler
      path.addEventListener("click", () => {
        link.up = !link.up;
        path.setAttribute("class", `svg-link ${link.type} ${link.up ? 'up' : 'down'}`);
        if (window.onLinkStateChanged) {
          window.onLinkStateChanged(link);
        }
      });

      this.linksGroup.appendChild(path);
    });
  }

  renderNodes() {
    this.nodesGroup.innerHTML = "";

    Object.values(NETWORK_TOPOLOGY.nodes).forEach(node => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", `svg-node node-${node.type} ${node.id === this.selectedNodeId ? 'node-selected' : ''}`);
      g.setAttribute("id", `svg-node-${node.id}`);
      g.setAttribute("transform", `translate(${node.x - node.width/2}, ${node.y - node.height/2})`);

      // Node background box
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("class", "node-rect");
      rect.setAttribute("width", node.width);
      rect.setAttribute("height", node.height);
      g.appendChild(rect);

      // Title
      const textTitle = document.createElementNS("http://www.w3.org/2000/svg", "text");
      textTitle.setAttribute("class", "node-title");
      textTitle.setAttribute("x", node.width / 2);
      textTitle.setAttribute("y", node.height / 2 - 2);
      textTitle.textContent = node.name.length > 22 ? node.name.substring(0, 20) + "…" : node.name;
      g.appendChild(textTitle);

      // Subtitle (IP / Model)
      const textSub = document.createElementNS("http://www.w3.org/2000/svg", "text");
      textSub.setAttribute("class", "node-subtitle");
      textSub.setAttribute("x", node.width / 2);
      textSub.setAttribute("y", node.height / 2 + 13);
      textSub.textContent = node.ip || node.model;
      g.appendChild(textSub);

      // Click to inspect
      g.addEventListener("click", () => {
        this.selectNode(node.id);
      });

      this.nodesGroup.appendChild(g);
    });
  }

  selectNode(nodeId) {
    this.selectedNodeId = nodeId;
    document.querySelectorAll(".svg-node").forEach(el => el.classList.remove("node-selected"));
    const selectedEl = document.getElementById(`svg-node-${nodeId}`);
    if (selectedEl) selectedEl.classList.add("node-selected");

    if (window.onNodeSelected) {
      window.onNodeSelected(NETWORK_TOPOLOGY.nodes[nodeId]);
    }
  }

  filterVlan(vlanId) {
    this.activeVlanFilter = vlanId;
    if (vlanId === "all") {
      document.querySelectorAll(".svg-node, .svg-link").forEach(el => el.style.opacity = "1");
      return;
    }

    const vId = parseInt(vlanId);

    // Dim nodes not in VLAN
    Object.values(NETWORK_TOPOLOGY.nodes).forEach(node => {
      const nodeEl = document.getElementById(`svg-node-${node.id}`);
      if (!nodeEl) return;
      const vlanList = (node.vlans || "").split(",").map(v => parseInt(v.trim()));
      if (vlanList.includes(vId) || node.type === "core") {
        nodeEl.style.opacity = "1";
      } else {
        nodeEl.style.opacity = "0.18";
      }
    });

    // Dim links not carrying VLAN
    NETWORK_TOPOLOGY.links.forEach(link => {
      const linkEl = document.getElementById(`svg-link-${link.id}`);
      if (!linkEl) return;
      if (link.vlans.includes(vId)) {
        linkEl.style.opacity = "1";
      } else {
        linkEl.style.opacity = "0.08";
      }
    });
  }

  animatePacket(pathNodeIds, isPermitted) {
    this.packetsGroup.innerHTML = "";
    if (!pathNodeIds || pathNodeIds.length < 2) return;

    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("r", "7");
    dot.setAttribute("class", `svg-packet-dot ${isPermitted ? '' : 'denied'}`);
    this.packetsGroup.appendChild(dot);

    let step = 0;
    const animateStep = () => {
      if (step >= pathNodeIds.length - 1) {
        // Complete or Denied pulse
        setTimeout(() => {
          this.packetsGroup.innerHTML = "";
        }, 1200);
        return;
      }

      const currNode = NETWORK_TOPOLOGY.nodes[pathNodeIds[step]];
      const nextNode = NETWORK_TOPOLOGY.nodes[pathNodeIds[step + 1]];
      step++;

      if (!currNode || !nextNode) return;

      const startTime = performance.now();
      const duration = 500;

      const stepFrame = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const x = currNode.x + (nextNode.x - currNode.x) * progress;
        const y = currNode.y + (nextNode.y - currNode.y) * progress;

        dot.setAttribute("cx", x);
        dot.setAttribute("cy", y);

        if (progress < 1) {
          requestAnimationFrame(stepFrame);
        } else {
          animateStep();
        }
      };

      requestAnimationFrame(stepFrame);
    };

    const firstNode = NETWORK_TOPOLOGY.nodes[pathNodeIds[0]];
    dot.setAttribute("cx", firstNode.x);
    dot.setAttribute("cy", firstNode.y);
    requestAnimationFrame(animateStep);
  }
}

window.TopologyRenderer = TopologyRenderer;
window.NETWORK_TOPOLOGY = NETWORK_TOPOLOGY;
