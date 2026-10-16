# Cisco Packet Tracer Configuration Files

This folder contains verified, production-grade Cisco IOS configuration files for the **University Hostel Network Design**.

## Device Map & Config Files

| Device Name | Device Model | File | Primary Function |
|---|---|---|---|
| **HOSTEL-CORE** | Catalyst 3650-24PS | [`HOSTEL-CORE.cfg`](./HOSTEL-CORE.cfg) | Collapsed Core/Distribution, SVIs, DHCP Server, ACLs, Inter-VLAN Routing |
| **F1-ACC-A** | Catalyst 2960-48TT | [`F1-ACC-A.cfg`](./F1-ACC-A.cfg) | Floor 1 North Wing (Rooms 1-15, 3 APs, 4 CCTV Cameras) |
| **F1-ACC-B** | Catalyst 2960-48TT | [`F1-ACC-B.cfg`](./F1-ACC-B.cfg) | Floor 1 South Wing (Rooms 16-30, 2 APs, 4 CCTV Cameras) |
| **ADMIN-ACC** | Catalyst 2960-24TT | [`ADMIN-ACC.cfg`](./ADMIN-ACC.cfg) | Warden & Administrative Office |
| **SECURITY-ACC** | Catalyst 2960-24TT | [`SECURITY-ACC.cfg`](./SECURITY-ACC.cfg) | Security Guard Station & Surveillance Desk |
| **COMMON-ACC** | Catalyst 2960-24TT | [`COMMON-ACC.cfg`](./COMMON-ACC.cfg) | Student Common Room & Study Hall |

*(Note: For Floors 2, 3, and 4, the configuration is identical to Floor 1 with the floor number and student VLAN replaced: Floor 2 = VLAN 20, Floor 3 = VLAN 30, Floor 4 = VLAN 40).*

## How to Apply in Cisco Packet Tracer

1. Open Cisco Packet Tracer on your computer.
2. Drag and drop the devices according to the Topology in the main report:
   - 1x **Catalyst 3650-24PS** Multilayer Switch
   - 8x **Catalyst 2960-48TT** Access Switches (2 per floor)
   - 3x **Catalyst 2960-24TT** Access Switches (Admin, Security, Common Room)
   - 2x **Server-PT** (HOSTEL-SRV on Gi1/0/12, HOSTEL-NVR on Gi1/0/13)
   - 1x **PC-PT** (HOSTEL-NMS on Gi1/0/14)
3. Connect Copper Straight-Through cables according to the cable schedule in [`hostel-network-design.md`](../hostel-network-design.md).
4. Click on each switch -> navigate to the **CLI** tab -> press Enter -> enter `enable` -> copy and paste the entire `.cfg` file text into the CLI terminal.
5. In Packet Tracer, all commands will execute and save to NVRAM (`write memory`).
