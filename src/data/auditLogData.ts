import { AuditLog } from '../types';

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-001',
    userId: 'user-tech1',
    userName: 'Rahul Sharma',
    userRole: 'technician',
    action: 'Additional Work Quote Created',
    entity: 'JobCard',
    entityId: 'TORQX-JC-2026-00001',
    timestamp: '2026-09-08 11:15 AM',
    previousValue: 'Total: ₹17,390',
    newValue: 'Total: ₹20,458 (Pending Approval: ₹3,068)',
    details: 'Front rotor lateral runout 0.04mm. Recommended precision rotor skimming.'
  },
  {
    id: 'LOG-002',
    userId: 'user-admin',
    userName: 'Rajesh Nair',
    userRole: 'admin',
    action: 'Job Card Assigned',
    entity: 'JobCard',
    entityId: 'TORQX-JC-2026-00001',
    timestamp: '2026-09-08 09:35 AM',
    previousValue: 'Unassigned',
    newValue: 'Rahul Sharma (Bay 01)',
    details: 'Vehicle checked in. Assigned priority technician.'
  },
  {
    id: 'LOG-003',
    userId: 'user-admin',
    userName: 'Rajesh Nair',
    userRole: 'admin',
    action: 'Inventory Stock Adjusted',
    entity: 'InventoryPart',
    entityId: 'PART-001',
    timestamp: '2026-09-08 09:00 AM',
    previousValue: 'Stock: 16',
    newValue: 'Stock: 14 (Reserved: 2)',
    details: 'Parts requisitioned for Job Card TORQX-JC-2026-00001.'
  },
  {
    id: 'LOG-004',
    userId: 'user-vikram',
    userName: 'Vikram Mehta',
    userRole: 'customer',
    action: 'Booking Created',
    entity: 'Booking',
    entityId: 'TORQX-2026-00482',
    timestamp: '2026-09-07 08:15 PM',
    previousValue: 'N/A',
    newValue: 'Periodic Service + Valet Chauffeur',
    details: 'Online reservation via Dynamic 6-Step Engine.'
  },
  {
    id: 'LOG-005',
    userId: 'user-tech2',
    userName: 'Suresh Patil',
    userRole: 'technician',
    action: 'Quality Check Completed',
    entity: 'JobCard',
    entityId: 'TORQX-JC-2026-00002',
    timestamp: '2026-09-08 01:10 PM',
    previousValue: 'WORK_IN_PROGRESS',
    newValue: 'QUALITY_CHECK',
    details: 'AC temperature achieved 6.2°C. Sent to final quality audit.'
  }
];
