import { JobCard } from '../types';

export const INITIAL_JOB_CARDS: JobCard[] = [
  {
    id: 'JC-001',
    jobCardNumber: 'TORQX-JC-2026-00001',
    bookingId: 'TORQX-2026-00482',
    customerName: 'Vikram Mehta',
    customerPhone: '+91 98221 44556',
    customerEmail: 'vikram.mehta@gmail.com',
    customerAddress: 'A-402, Rohan Nilay, Aundh, Pune 411007',
    vehicleBrand: 'BMW',
    vehicleModel: '3 Series',
    vehicleVariant: '330i M Sport (G20)',
    vehicleRegNumber: 'MH 12 PX 4482',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-1',
    assignedTechnicianName: 'Rahul Sharma (Master Tech)',
    serviceBay: 'Bay 01 - Diagnostic Hub',
    checkInDate: '2026-09-08 09:30 AM',
    expectedDeliveryDate: '2026-09-08 06:30 PM',
    currentKm: 42350,
    customerComplaint: 'Minor brake shudder during high-speed deceleration on Mumbai-Pune expressway; periodic service due indicator on iDrive.',
    technicianDiagnosis: 'Front brake pads worn down to 2.8mm (recommended minimum: 3.0mm); slight rotor lateral run-out (0.04mm); engine oil degraded past 9,800 km.',
    workRequired: [
      'Comprehensive 60-Point Vehicle Health Audit',
      'Engine Oil & OEM Microfilter Replacement',
      'Front Brake Pad & Sensor Replacement',
      'Wheel Alignment & Dynamic Road Calibration'
    ],
    partsRequired: [
      {
        id: 'jcp-1',
        inventoryPartId: 'PART-002',
        name: 'Motul 8100 X-cess Gen2 5W-40 Synthetic (5.5L)',
        partNumber: 'MOT-109776',
        quantity: 1,
        unitPrice: 4200,
        total: 4200
      },
      {
        id: 'jcp-2',
        inventoryPartId: 'PART-003',
        name: 'Mann-Filter BMW High-Efficiency Oil Filter',
        partNumber: 'MAN-HU816X',
        quantity: 1,
        unitPrice: 1150,
        total: 1150
      },
      {
        id: 'jcp-3',
        inventoryPartId: 'PART-001',
        name: 'Brembo Ceramic Front Brake Pad Set',
        partNumber: 'BRM-P06024N',
        quantity: 1,
        unitPrice: 4800,
        total: 4800
      }
    ],
    labour: [
      {
        id: 'jcl-1',
        description: 'Periodic Service & Digital Diagnostics Labour',
        hours: 2,
        ratePerHour: 950,
        total: 1900
      },
      {
        id: 'jcl-2',
        description: 'Brake Overhaul & Sensor Calibration Labour',
        hours: 1.5,
        ratePerHour: 1000,
        total: 1500
      }
    ],
    additionalWork: [
      {
        id: 'addw-1',
        description: 'Front Brake Disc Rotor High-Precision Skimming & Sensor Reset',
        partsCost: 1200,
        labourCost: 1400,
        gst: 468,
        total: 3068,
        status: 'pending',
        requestedAt: '2026-09-08 11:15 AM'
      }
    ],
    inspectionId: 'INSP-2026-00482',
    quotationId: 'QT-2026-00482',
    invoiceId: 'INV-2026-00482',
    approvalStatus: 'PENDING',
    paymentStatus: 'PENDING',
    jobStatus: 'WORK_IN_PROGRESS',
    notes: [
      'Customer requested valet drop to Aundh office by 6:30 PM.',
      'Brake rotor skimming quote transmitted to customer portal for one-click authorization.'
    ],
    photos: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: '2026-09-08T09:30:00Z',
    updatedAt: '2026-09-08T11:45:00Z'
  },
  {
    id: 'JC-002',
    jobCardNumber: 'TORQX-JC-2026-00002',
    bookingId: 'TORQX-2026-00475',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 98199 88776',
    customerEmail: 'ananya.d@fintech.io',
    customerAddress: 'B-12, Panchshil Towers, Kharadi, Pune',
    vehicleBrand: 'Mercedes-Benz',
    vehicleModel: 'C-Class',
    vehicleVariant: 'C220d Progressive',
    vehicleRegNumber: 'MH 14 JM 8820',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-2',
    assignedTechnicianName: 'Suresh Patil (Senior Mechanic)',
    serviceBay: 'Bay 02 - Mechanical Bay',
    checkInDate: '2026-09-08 08:45 AM',
    expectedDeliveryDate: '2026-09-08 05:00 PM',
    currentKm: 58200,
    customerComplaint: 'A/C not blowing cold air during noon traffic; unusual squeal when compressor kicks on.',
    technicianDiagnosis: 'R134a refrigerant level down to 240g (spec: 590g); cabin pollen filter clogged with micro-particulates.',
    workRequired: [
      'HVAC Pressure Leak Test & Vacuum Purge',
      'R134a Refrigerant Gas Recharge with UV Dye',
      'Denso Activated Carbon Cabin Filter Replacement',
      'Anti-Bacterial Ultrasonic Evaporator Cleaning'
    ],
    partsRequired: [
      {
        id: 'jcp-4',
        inventoryPartId: 'PART-008',
        name: 'Denso AC Cabin Pollen Filter',
        partNumber: 'DNS-DCF045K',
        quantity: 1,
        unitPrice: 950,
        total: 950
      }
    ],
    labour: [
      {
        id: 'jcl-3',
        description: 'Complete Climate Diagnostic & Evaporator Treatment',
        hours: 2,
        ratePerHour: 1100,
        total: 2200
      }
    ],
    additionalWork: [],
    inspectionId: 'INSP-2026-00475',
    approvalStatus: 'APPROVED',
    paymentStatus: 'PENDING',
    jobStatus: 'QUALITY_CHECK',
    notes: [
      'AC vent temperature successfully lowered to 6.2°C.',
      'Ready for final wash and interior vacuum.'
    ],
    photos: [
      'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: '2026-09-08T08:45:00Z',
    updatedAt: '2026-09-08T13:10:00Z'
  },
  {
    id: 'JC-003',
    jobCardNumber: 'TORQX-JC-2026-00003',
    bookingId: 'TORQX-2026-00468',
    customerName: 'Rohan Mehta',
    customerPhone: '+91 99234 56789',
    customerEmail: 'rohan.mehta@techmahindra.com',
    customerAddress: 'Flat 901, Blue Ridge, Hinjawadi Phase 1, Pune',
    vehicleBrand: 'Skoda',
    vehicleModel: 'Slavia',
    vehicleVariant: 'Style 1.5L TSI DSG',
    vehicleRegNumber: 'MH 14 VR 2450',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-1',
    assignedTechnicianName: 'Rahul Sharma (Master Tech)',
    serviceBay: 'Bay 03 - Quick Lift',
    checkInDate: '2026-09-05 10:00 AM',
    expectedDeliveryDate: '2026-09-05 04:30 PM',
    currentKm: 28400,
    customerComplaint: '2-Year Scheduled Periodic Service & Spark Plug inspection.',
    technicianDiagnosis: 'Oil degradation normal; spark plugs replaced per manufacturer 30k interval.',
    workRequired: [
      'Periodic 30,000 KM Maintenance Package',
      'Spark Plug Replacement (Set of 4)',
      'Underbody Multi-Point Visual Scan'
    ],
    partsRequired: [
      {
        id: 'jcp-5',
        inventoryPartId: 'PART-005',
        name: 'Bosch High-Performance Spark Plug Set (x4)',
        partNumber: 'BSH-0242140519',
        quantity: 1,
        unitPrice: 2850,
        total: 2850
      }
    ],
    labour: [
      {
        id: 'jcl-4',
        description: 'Standard Periodic Service Labour',
        hours: 2.5,
        ratePerHour: 800,
        total: 2000
      }
    ],
    additionalWork: [],
    approvalStatus: 'APPROVED',
    paymentStatus: 'PAID',
    jobStatus: 'COMPLETED',
    notes: [
      'Completed test drive; delivered to customer on 2026-09-05.',
      'Customer rating: 5 Stars.'
    ],
    photos: [],
    createdAt: '2026-09-05T10:00:00Z',
    updatedAt: '2026-09-05T16:20:00Z'
  }
];
