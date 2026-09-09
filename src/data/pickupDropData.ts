import { PickupDropRequest } from '../types';

export const INITIAL_PICKUP_DROP_REQUESTS: PickupDropRequest[] = [
  {
    id: 'PUD-001',
    bookingId: 'TORQX-2026-00482',
    customerName: 'Vikram Mehta',
    customerPhone: '+91 98221 44556',
    vehicleInfo: 'BMW 3 Series (MH 12 PX 4482)',
    pickupAddress: 'A-402, Rohan Nilay, Aundh, Pune 411007',
    dropAddress: 'A-402, Rohan Nilay, Aundh, Pune 411007',
    driverName: 'Ramesh Sawant',
    driverPhone: '+91 98877 66554',
    date: '2026-09-08',
    time: '08:30 AM',
    status: 'AT_WORKSHOP',
    notes: 'Vehicle safely received at Bay 01. Valet checklist recorded 42,350 km on digital receipt.'
  },
  {
    id: 'PUD-002',
    bookingId: 'TORQX-2026-00475',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 98199 88776',
    vehicleInfo: 'Mercedes-Benz C-Class (MH 14 JM 8820)',
    pickupAddress: 'Panchshil Towers Tower B, Kharadi, Pune',
    dropAddress: 'Panchshil Towers Tower B, Kharadi, Pune',
    driverName: 'Sanjay Shinde',
    driverPhone: '+91 98231 22334',
    date: '2026-09-08',
    time: '04:45 PM',
    status: 'READY_FOR_DROP',
    notes: 'Awaiting final gate pass and detailing wipe-down.'
  },
  {
    id: 'PUD-003',
    bookingId: 'TORQX-2026-00490',
    customerName: 'Kavita Rao',
    customerPhone: '+91 97654 32109',
    vehicleInfo: 'Audi A4 45 TFSI (MH 12 KG 1990)',
    pickupAddress: 'Kalpataru Jade, Baner Road, Pune',
    dropAddress: 'Kalpataru Jade, Baner Road, Pune',
    driverName: 'Ramesh Sawant',
    driverPhone: '+91 98877 66554',
    date: '2026-09-09',
    time: '09:00 AM',
    status: 'DRIVER_ASSIGNED',
    notes: 'Scheduled for tomorrow morning doorstep pickup.'
  }
];
