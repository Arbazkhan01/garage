import { JobCard } from '../types';

export const INITIAL_JOB_CARDS: JobCard[] = [
  // 10 ACTIVE JOBS
  {
    id: 'JC-001',
    jobCardNumber: 'TORQX-JC-2026-00001',
    bookingId: 'TORQX-2026-00482',
    customerName: 'Vikram Malhotra',
    customerPhone: '+91 98221 44556',
    customerEmail: 'vikram.malhotra@gmail.com',
    customerAddress: 'Villa 14, Panchshil Towers, Kharadi, Pune',
    vehicleBrand: 'BMW',
    vehicleModel: '3 Series',
    vehicleVariant: '330i M Sport',
    vehicleRegNumber: 'MH 12 AB 1234',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-1',
    assignedTechnicianName: 'Rahul Sharma (Master Tech)',
    serviceBay: 'Bay 01 - Diagnostic Hub',
    checkInDate: '2026-09-08 09:30 AM',
    expectedDeliveryDate: '2026-09-08 06:30 PM',
    currentKm: 42350,
    customerComplaint: 'Minor brake shudder during high-speed deceleration on expressway; periodic service due indicator on iDrive.',
    technicianDiagnosis: 'Front brake pads worn down to 2.8mm; slight rotor lateral run-out (0.04mm); engine oil degraded past 9,800 km.',
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
        name: 'Motul 8100 X-cess Gen2 5W-40 Synthetic (4L)',
        partNumber: 'MOT-109776',
        quantity: 1,
        unitPrice: 3950,
        total: 3950
      },
      {
        id: 'jcp-2',
        inventoryPartId: 'PART-003',
        name: 'Mann-Filter High Efficiency Oil Filter',
        partNumber: 'MAN-HU816X',
        quantity: 1,
        unitPrice: 1150,
        total: 1150
      },
      {
        id: 'jcp-3',
        inventoryPartId: 'PART-001',
        name: 'Brembo Ceramic Front Brake Pads',
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
    approvalStatus: 'PENDING',
    paymentStatus: 'PENDING',
    jobStatus: 'WORK_IN_PROGRESS',
    notes: [
      'Customer requested doorstep drop to Kharadi office by 6:30 PM.',
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
    assignedTechnicianId: 'tech-3',
    assignedTechnicianName: 'Dinesh Patil (Senior Mechanic)',
    serviceBay: 'Bay 04 - Suspension & Brake Bay',
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
        name: 'Denso AC Cabin Pollen Activated Carbon Filter',
        partNumber: 'DNS-DCF045K',
        quantity: 1,
        unitPrice: 950,
        total: 950
      },
      {
        id: 'jcp-5',
        inventoryPartId: 'PART-017',
        name: 'R134a Pure Refrigerant Gas Canister (13.6 kg)',
        partNumber: 'FRE-R134A-136',
        quantity: 1,
        unitPrice: 8500,
        total: 8500
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
    approvalStatus: 'APPROVED',
    paymentStatus: 'PENDING',
    jobStatus: 'QUALITY_CHECK',
    notes: [
      'AC vent temperature successfully lowered to 6.2°C.',
      'Ready for final 10-point road test and quality audit.'
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
    bookingId: 'TORQX-2026-00479',
    customerName: 'Kavita Nair',
    customerPhone: '+91 97654 32100',
    customerEmail: 'kavita.nair@investments.com',
    customerAddress: 'Row House 4, Koregaon Park Annexe, Pune',
    vehicleBrand: 'Audi',
    vehicleModel: 'Q5',
    vehicleVariant: '45 TFSI Technology',
    vehicleRegNumber: 'MH 12 QX 5566',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-2',
    assignedTechnicianName: 'Amitabh Sen (VAG Group Specialist)',
    serviceBay: 'Bay 02 - Heavy Mechanical Lift',
    checkInDate: '2026-09-08 10:15 AM',
    expectedDeliveryDate: '2026-09-08 07:00 PM',
    currentKm: 31200,
    customerComplaint: 'Engine check light flashing intermittent amber; slight hesitation on acceleration.',
    technicianDiagnosis: 'Misfire code P0302 cylinder 2 detected on OBD scan. Spark plug electrode eroded.',
    workRequired: [
      'Comprehensive VCDS Diagnostics Scan',
      'High-Performance Spark Plug Replacement',
      'Throttle Body De-carbonization'
    ],
    partsRequired: [
      {
        id: 'jcp-6',
        inventoryPartId: 'PART-005',
        name: 'Bosch Double Iridium Spark Plugs (Set of 4)',
        partNumber: 'BSH-0242140519',
        quantity: 1,
        unitPrice: 2850,
        total: 2850
      }
    ],
    labour: [
      {
        id: 'jcl-5',
        description: 'OBD Diagnostics & Ignition Coil Testing',
        hours: 1.5,
        ratePerHour: 950,
        total: 1425
      }
    ],
    additionalWork: [],
    approvalStatus: 'NOT_REQUIRED',
    paymentStatus: 'PENDING',
    jobStatus: 'PARTS_RESERVED',
    notes: ['Parts reserved from warehouse, waiting for engine cooldown.'],
    photos: [],
    createdAt: '2026-09-08T10:15:00Z',
    updatedAt: '2026-09-08T11:00:00Z'
  },
  {
    id: 'JC-004',
    jobCardNumber: 'TORQX-JC-2026-00004',
    bookingId: 'TORQX-2026-00471',
    customerName: 'Dr. Sameer Kulkarni',
    customerPhone: '+91 98500 23145',
    customerEmail: 'dr.sameer.k@apollo.org',
    customerAddress: '701, Trump Towers, Kalyani Nagar, Pune',
    vehicleBrand: 'Porsche',
    vehicleModel: 'Macan',
    vehicleVariant: 'Macan GTS',
    vehicleRegNumber: 'MH 12 GT 0911',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-5',
    assignedTechnicianName: 'Karan Joshi (Master Detailing Artisan)',
    serviceBay: 'Bay 06 - Dust-Free Ceramic Studio',
    checkInDate: '2026-09-07 09:00 AM',
    expectedDeliveryDate: '2026-09-08 07:00 PM',
    currentKm: 14800,
    customerComplaint: '3-Year 9H Ceramic Protection package & interior leather ceramic shield.',
    technicianDiagnosis: 'Paint depth measured between 110-130 microns; minimal micro-swirls on clear coat.',
    workRequired: [
      'Dual-Action 3-Stage Rupes Paint Correction',
      '9H Gyeon MOHS EVO Multi-Layer Ceramic Application',
      'Infrared Curing Bake Cycle'
    ],
    partsRequired: [
      {
        id: 'jcp-7',
        inventoryPartId: 'PART-028',
        name: 'Gyeon Q² MOHS EVO 9H Certified Ceramic Quartz (50ml)',
        partNumber: 'GYE-Q2MOHS50',
        quantity: 1,
        unitPrice: 12000,
        total: 12000
      }
    ],
    labour: [
      {
        id: 'jcl-6',
        description: 'Stage 3 Multi-Cut Paint Correction & Ceramic Application',
        hours: 6,
        ratePerHour: 1250,
        total: 7500
      }
    ],
    additionalWork: [],
    approvalStatus: 'APPROVED',
    paymentStatus: 'PENDING',
    jobStatus: 'READY_FOR_DELIVERY',
    notes: ['Ceramic cure complete; gloss meter reading 97.4 GU.'],
    photos: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80'
    ],
    createdAt: '2026-09-07T09:00:00Z',
    updatedAt: '2026-09-08T15:30:00Z'
  },
  {
    id: 'JC-005',
    jobCardNumber: 'TORQX-JC-2026-00005',
    bookingId: 'TORQX-2026-00485',
    customerName: 'Aditya Birla',
    customerPhone: '+91 98901 11223',
    customerEmail: 'aditya.birla@corporation.in',
    customerAddress: 'Plot 88, Model Colony, Pune',
    vehicleBrand: 'BMW',
    vehicleModel: '5 Series',
    vehicleVariant: '530d M Sport',
    vehicleRegNumber: 'MH 12 BK 0005',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-1',
    assignedTechnicianName: 'Rahul Sharma (Master Tech)',
    serviceBay: 'Bay 01 - Diagnostic Hub',
    checkInDate: '2026-09-08 11:00 AM',
    expectedDeliveryDate: '2026-09-09 12:00 PM',
    currentKm: 65400,
    customerComplaint: 'Suspension clunk on rough road potholes; steering wheel off-center.',
    technicianDiagnosis: 'Front lower control arm hydro-bushings torn; lateral play 3.2mm.',
    workRequired: [
      'Suspension Control Arm Bushing Replacement',
      'Hunter 3D Alignment & Toe Adjustment'
    ],
    partsRequired: [
      {
        id: 'jcp-8',
        inventoryPartId: 'PART-009',
        name: 'Lemförder Front Lower Suspension Control Arm',
        partNumber: 'LMF-3621401',
        quantity: 1,
        unitPrice: 8900,
        total: 8900
      }
    ],
    labour: [
      {
        id: 'jcl-7',
        description: 'Suspension Arm Press & Hydraulic Bleeding',
        hours: 3,
        ratePerHour: 1000,
        total: 3000
      }
    ],
    additionalWork: [],
    approvalStatus: 'PENDING',
    paymentStatus: 'PENDING',
    jobStatus: 'APPROVAL_PENDING',
    notes: ['Quotation transmitted to customer. Awaiting one-click approval.'],
    photos: [],
    createdAt: '2026-09-08T11:00:00Z',
    updatedAt: '2026-09-08T11:30:00Z'
  },
  {
    id: 'JC-006',
    jobCardNumber: 'TORQX-JC-2026-00006',
    bookingId: 'TORQX-2026-00486',
    customerName: 'Priya Sundaram',
    customerPhone: '+91 97644 55667',
    customerEmail: 'priya.sundaram@infosys.com',
    customerAddress: 'Flat 502, Nyati Epitome, Undri, Pune',
    vehicleBrand: 'Volkswagen',
    vehicleModel: 'Taigun',
    vehicleVariant: 'GT Plus 1.5L TSI',
    vehicleRegNumber: 'MH 12 TR 8899',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-2',
    assignedTechnicianName: 'Amitabh Sen (VAG Specialist)',
    serviceBay: 'Bay 03 - Quick Periodic Lift',
    checkInDate: '2026-09-08 12:30 PM',
    expectedDeliveryDate: '2026-09-08 05:30 PM',
    currentKm: 21500,
    customerComplaint: 'Wiper streaking on windscreen; washer fluid nozzle blocked.',
    technicianDiagnosis: 'Wiper rubber hardened by UV exposure; reservoir pump strainer clogged.',
    workRequired: [
      'Bosch Aerotwin Blade Fitting',
      'Washer Reservoir Flush & Pressure Purge'
    ],
    partsRequired: [
      {
        id: 'jcp-9',
        inventoryPartId: 'PART-004',
        name: 'Bosch Aerotwin Frameless Wiper Blades (Pair)',
        partNumber: 'BSH-A938S',
        quantity: 1,
        unitPrice: 1650,
        total: 1650
      }
    ],
    labour: [
      {
        id: 'jcl-8',
        description: 'Washer System Purge & Blade Fitting',
        hours: 0.5,
        ratePerHour: 800,
        total: 400
      }
    ],
    additionalWork: [],
    approvalStatus: 'APPROVED',
    paymentStatus: 'PENDING',
    jobStatus: 'OUT_FOR_DELIVERY',
    notes: ['Dispatched with valet driver Santosh Yadav to Undri.'],
    photos: [],
    createdAt: '2026-09-08T12:30:00Z',
    updatedAt: '2026-09-08T15:45:00Z'
  },
  {
    id: 'JC-007',
    jobCardNumber: 'TORQX-JC-2026-00007',
    bookingId: 'TORQX-2026-00487',
    customerName: 'Manish Chawla',
    customerPhone: '+91 99220 33445',
    customerEmail: 'manish.chawla@realty.com',
    customerAddress: 'Bungalow 7, Sindh Society, Aundh, Pune',
    vehicleBrand: 'Mercedes-Benz',
    vehicleModel: 'E-Class',
    vehicleVariant: 'E350d Exclusive',
    vehicleRegNumber: 'MH 14 MB 3500',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-6',
    assignedTechnicianName: 'Vikram Shinde (Senior Mechanical)',
    serviceBay: 'Bay 02 - Heavy Mechanical Lift',
    checkInDate: '2026-09-08 01:00 PM',
    expectedDeliveryDate: '2026-09-09 03:00 PM',
    currentKm: 78900,
    customerComplaint: 'Transmission shift delay between 2nd and 3rd gear.',
    technicianDiagnosis: 'ZF 9G-Tronic fluid viscosity degraded; temperature reading high.',
    workRequired: [
      'ZF Lifeguard Transmission Fluid Flush',
      'Transmission Pan & Integrated Magnet Filter Replacement'
    ],
    partsRequired: [
      {
        id: 'jcp-10',
        inventoryPartId: 'PART-024',
        name: 'ZF Lifeguard 8 Transmission Fluid (1L)',
        partNumber: 'ZF-S671090312',
        quantity: 1,
        unitPrice: 2650,
        total: 2650
      }
    ],
    labour: [
      {
        id: 'jcl-9',
        description: 'Transmission Flush & Adaptations Reset',
        hours: 3.5,
        ratePerHour: 1100,
        total: 3850
      }
    ],
    additionalWork: [],
    approvalStatus: 'NOT_REQUIRED',
    paymentStatus: 'PENDING',
    jobStatus: 'INSPECTION',
    notes: ['Initial transmission telemetry data logged under load.'],
    photos: [],
    createdAt: '2026-09-08T13:00:00Z',
    updatedAt: '2026-09-08T13:45:00Z'
  },
  {
    id: 'JC-008',
    jobCardNumber: 'TORQX-JC-2026-00008',
    bookingId: 'TORQX-2026-00488',
    customerName: 'Sanjay Reddy',
    customerPhone: '+91 98811 77889',
    customerEmail: 'sanjay.reddy@techventures.io',
    customerAddress: 'Penthouse 1201, Amanora Gateway Towers, Pune',
    vehicleBrand: 'BMW',
    vehicleModel: 'X3',
    vehicleVariant: 'xDrive30d Luxury',
    vehicleRegNumber: 'MH 12 XZ 0033',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-1',
    assignedTechnicianName: 'Rahul Sharma (Master Tech)',
    serviceBay: 'Bay 01 - Diagnostic Hub',
    checkInDate: '2026-09-08 02:00 PM',
    expectedDeliveryDate: '2026-09-09 05:00 PM',
    currentKm: 52100,
    customerComplaint: 'Coolant low warning on digital instrument cluster.',
    technicianDiagnosis: 'Pressure test indicates small hairline pinhole in auxiliary radiator hose.',
    workRequired: [
      'Cooling System Hydro-Pressure Testing',
      'Hose Replacement & Wurth G40 Coolant Flush'
    ],
    partsRequired: [
      {
        id: 'jcp-11',
        inventoryPartId: 'PART-010',
        name: 'Wurth Glysantin G40 Long-life Coolant (5L)',
        partNumber: 'WRT-0892332840',
        quantity: 1,
        unitPrice: 2800,
        total: 2800
      }
    ],
    labour: [
      {
        id: 'jcl-10',
        description: 'Cooling Pressure Test & Vacuum Refill',
        hours: 2,
        ratePerHour: 950,
        total: 1900
      }
    ],
    additionalWork: [],
    approvalStatus: 'NOT_REQUIRED',
    paymentStatus: 'PENDING',
    jobStatus: 'DIAGNOSIS',
    notes: ['Cooling system pressure held steady at 1.4 bar.'],
    photos: [],
    createdAt: '2026-09-08T14:00:00Z',
    updatedAt: '2026-09-08T14:40:00Z'
  },
  {
    id: 'JC-009',
    jobCardNumber: 'TORQX-JC-2026-00009',
    bookingId: 'TORQX-2026-00489',
    customerName: 'Meera Sen',
    customerPhone: '+91 98230 44556',
    customerEmail: 'meera.sen@designstudio.in',
    customerAddress: 'Lane 5, Koregaon Park, Pune',
    vehicleBrand: 'Skoda',
    vehicleModel: 'Octavia',
    vehicleVariant: 'L&K 2.0 TSI',
    vehicleRegNumber: 'MH 12 SK 7700',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-2',
    assignedTechnicianName: 'Amitabh Sen (VAG Specialist)',
    serviceBay: 'Bay 03 - Quick Periodic Lift',
    checkInDate: '2026-09-08 02:30 PM',
    expectedDeliveryDate: '2026-09-08 06:30 PM',
    currentKm: 39800,
    customerComplaint: 'Scheduled 40,000 km minor service & brake fluid renewal.',
    technicianDiagnosis: 'Pending full diagnostic review.',
    workRequired: [
      'Scheduled Maintenance Inspection',
      'Motul DOT 5.1 Pressure Bleed'
    ],
    partsRequired: [
      {
        id: 'jcp-12',
        inventoryPartId: 'PART-011',
        name: 'Motul DOT 5.1 High Performance Brake Fluid (1L)',
        partNumber: 'MOT-100951',
        quantity: 1,
        unitPrice: 1100,
        total: 1100
      }
    ],
    labour: [
      {
        id: 'jcl-11',
        description: 'Hydraulic Pressure Bleed Labour',
        hours: 1,
        ratePerHour: 900,
        total: 900
      }
    ],
    additionalWork: [],
    approvalStatus: 'NOT_REQUIRED',
    paymentStatus: 'PENDING',
    jobStatus: 'VEHICLE_RECEIVED',
    notes: ['Customer waiting in executive lounge.'],
    photos: [],
    createdAt: '2026-09-08T14:30:00Z',
    updatedAt: '2026-09-08T14:35:00Z'
  },
  {
    id: 'JC-010',
    jobCardNumber: 'TORQX-JC-2026-00010',
    bookingId: 'TORQX-2026-00490',
    customerName: 'Gaurav Singhania',
    customerPhone: '+91 98902 99887',
    customerEmail: 'gaurav.s@singhania.org',
    customerAddress: 'Bungalow 3, Prabhat Road, Pune',
    vehicleBrand: 'Audi',
    vehicleModel: 'A4',
    vehicleVariant: '40 TFSI Premium Plus',
    vehicleRegNumber: 'MH 12 AU 4400',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-3',
    assignedTechnicianName: 'Dinesh Patil (Suspension Lead)',
    serviceBay: 'Bay 05 - Hunter 3D Alignment Station',
    checkInDate: '2026-09-08 03:00 PM',
    expectedDeliveryDate: '2026-09-09 11:00 AM',
    currentKm: 46200,
    customerComplaint: 'Car pulling slightly to the left under heavy braking.',
    technicianDiagnosis: 'Hunter 3D alignment reading shows -0.8° camber imbalance on front left wheel.',
    workRequired: [
      'Hunter HawkEye Elite Multi-Camera Alignment',
      'Brake Caliper Slide Pin Lubrication'
    ],
    partsRequired: [
      {
        id: 'jcp-13',
        inventoryPartId: 'PART-029',
        name: 'Wurth HHS 2000 High Pressure Synthetic Lubricant',
        partNumber: 'WRT-0893106',
        quantity: 1,
        unitPrice: 950,
        total: 950
      }
    ],
    labour: [
      {
        id: 'jcl-12',
        description: 'Hunter 3D Laser Calibration',
        hours: 1.5,
        ratePerHour: 1000,
        total: 1500
      }
    ],
    additionalWork: [],
    approvalStatus: 'NOT_REQUIRED',
    paymentStatus: 'PENDING',
    jobStatus: 'QUOTE_PENDING',
    notes: ['Quotation prepared and queued for supervisor sign-off.'],
    photos: [],
    createdAt: '2026-09-08T15:00:00Z',
    updatedAt: '2026-09-08T15:15:00Z'
  },

  // 10 COMPLETED JOBS
  {
    id: 'JC-011',
    jobCardNumber: 'TORQX-JC-2026-00011',
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
        id: 'jcp-14',
        inventoryPartId: 'PART-005',
        name: 'Bosch Double Iridium Spark Plugs (Set of 4)',
        partNumber: 'BSH-0242140519',
        quantity: 1,
        unitPrice: 2850,
        total: 2850
      },
      {
        id: 'jcp-15',
        inventoryPartId: 'PART-013',
        name: 'Castrol Edge Professional LongLife III 5W-30 (5L)',
        partNumber: 'CAS-EDGE-5W30-5L',
        quantity: 1,
        unitPrice: 4600,
        total: 4600
      }
    ],
    labour: [
      {
        id: 'jcl-13',
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
  },
  {
    id: 'JC-012',
    jobCardNumber: 'TORQX-JC-2026-00012',
    bookingId: 'TORQX-2026-00465',
    customerName: 'Rajesh Khanna',
    customerPhone: '+91 98223 99881',
    customerEmail: 'rajesh.khanna@textiles.in',
    customerAddress: '42, Boat Club Road, Pune',
    vehicleBrand: 'Toyota',
    vehicleModel: 'Fortuner',
    vehicleVariant: 'Legender 4x4 AT',
    vehicleRegNumber: 'MH 12 RK 0007',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-6',
    assignedTechnicianName: 'Vikram Shinde (Senior Mechanical)',
    serviceBay: 'Bay 02 - Heavy Mechanical Lift',
    checkInDate: '2026-09-04 09:15 AM',
    expectedDeliveryDate: '2026-09-04 05:00 PM',
    currentKm: 62000,
    customerComplaint: 'Front brake grinding sound during hill descent.',
    technicianDiagnosis: 'Front brake pads worn down to metal backing plate; scored rotors.',
    workRequired: [
      'Front Brake Disc Rotor Replacement',
      'Heavy Duty Ceramic Brake Pad Replacement',
      'Brake Line Flushing'
    ],
    partsRequired: [
      {
        id: 'jcp-16',
        inventoryPartId: 'PART-001',
        name: 'Brembo Ceramic Front Brake Pads',
        partNumber: 'BRM-P06024N',
        quantity: 1,
        unitPrice: 4800,
        total: 4800
      }
    ],
    labour: [
      {
        id: 'jcl-14',
        description: 'Brake Disc Overhaul & Caliper Service',
        hours: 2,
        ratePerHour: 950,
        total: 1900
      }
    ],
    additionalWork: [],
    approvalStatus: 'APPROVED',
    paymentStatus: 'PAID',
    jobStatus: 'COMPLETED',
    notes: ['Braking test passed with 0.85g deceleration.'],
    photos: [],
    createdAt: '2026-09-04T09:15:00Z',
    updatedAt: '2026-09-04T16:30:00Z'
  },
  {
    id: 'JC-013',
    jobCardNumber: 'TORQX-JC-2026-00013',
    bookingId: 'TORQX-2026-00462',
    customerName: 'Shalini Gupta',
    customerPhone: '+91 97633 44112',
    customerEmail: 'shalini.gupta@consulting.org',
    customerAddress: 'Flat 304, Marvel Zephyr, Kharadi, Pune',
    vehicleBrand: 'Honda',
    vehicleModel: 'City',
    vehicleVariant: 'ZX CVT i-VTEC',
    vehicleRegNumber: 'MH 12 SG 1200',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-4',
    assignedTechnicianName: 'Sameer Khan (HVAC Lead)',
    serviceBay: 'Bay 03 - Quick Periodic Lift',
    checkInDate: '2026-09-03 10:30 AM',
    expectedDeliveryDate: '2026-09-03 04:00 PM',
    currentKm: 34500,
    customerComplaint: 'Cabin bad odor when AC turned on.',
    technicianDiagnosis: 'Bacterial growth on cooling coil; cabin filter moldy.',
    workRequired: [
      'AC Evaporator Ultrasonic Foam Cleaning',
      'Denso Activated Carbon Pollen Filter Fitting',
      'Ozone Sanitization'
    ],
    partsRequired: [
      {
        id: 'jcp-17',
        inventoryPartId: 'PART-008',
        name: 'Denso AC Cabin Pollen Activated Carbon Filter',
        partNumber: 'DNS-DCF045K',
        quantity: 1,
        unitPrice: 950,
        total: 950
      }
    ],
    labour: [
      {
        id: 'jcl-15',
        description: 'AC Coil Ultrasonic Sanitization Labour',
        hours: 1.5,
        ratePerHour: 900,
        total: 1350
      }
    ],
    additionalWork: [],
    approvalStatus: 'APPROVED',
    paymentStatus: 'PAID',
    jobStatus: 'COMPLETED',
    notes: ['Odour eliminated; interior fresh.'],
    photos: [],
    createdAt: '2026-09-03T10:30:00Z',
    updatedAt: '2026-09-03T15:30:00Z'
  },
  {
    id: 'JC-014',
    jobCardNumber: 'TORQX-JC-2026-00014',
    bookingId: 'TORQX-2026-00459',
    customerName: 'Kishore Joshi',
    customerPhone: '+91 98224 88772',
    customerEmail: 'kishore.joshi@pharma.in',
    customerAddress: 'Row House 9, Sopan Baug, Pune',
    vehicleBrand: 'BMW',
    vehicleModel: '5 Series',
    vehicleVariant: '520d Luxury Line',
    vehicleRegNumber: 'MH 12 KJ 5520',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-1',
    assignedTechnicianName: 'Rahul Sharma (Master Tech)',
    serviceBay: 'Bay 01 - Diagnostic Hub',
    checkInDate: '2026-09-02 09:00 AM',
    expectedDeliveryDate: '2026-09-02 06:00 PM',
    currentKm: 71200,
    customerComplaint: 'Periodic 70k service and engine vibration at idle.',
    technicianDiagnosis: 'Hydraulic engine mounts collapsed; engine sitting on subframe bracket.',
    workRequired: [
      'Motul 8100 5W-40 Synthetic Oil Change',
      'OEM Engine Mount Replacement (Pair)',
      'Underbody Inspection'
    ],
    partsRequired: [
      {
        id: 'jcp-18',
        inventoryPartId: 'PART-002',
        name: 'Motul 8100 X-cess Gen2 5W-40 Synthetic (4L)',
        partNumber: 'MOT-109776',
        quantity: 1,
        unitPrice: 3950,
        total: 3950
      },
      {
        id: 'jcp-19',
        inventoryPartId: 'PART-003',
        name: 'Mann-Filter High Efficiency Oil Filter',
        partNumber: 'MAN-HU816X',
        quantity: 1,
        unitPrice: 1150,
        total: 1150
      }
    ],
    labour: [
      {
        id: 'jcl-16',
        description: 'Engine Mount Replacement Labour',
        hours: 3,
        ratePerHour: 1000,
        total: 3000
      }
    ],
    additionalWork: [],
    approvalStatus: 'APPROVED',
    paymentStatus: 'PAID',
    jobStatus: 'COMPLETED',
    notes: ['Idle NVH vibration reduced by 85%.'],
    photos: [],
    createdAt: '2026-09-02T09:00:00Z',
    updatedAt: '2026-09-02T17:15:00Z'
  },
  {
    id: 'JC-015',
    jobCardNumber: 'TORQX-JC-2026-00015',
    bookingId: 'TORQX-2026-00455',
    customerName: 'Pooja Hegde',
    customerPhone: '+91 99231 66778',
    customerEmail: 'pooja.hegde@creatives.co',
    customerAddress: 'Flat 801, Castel Royale, Bhosale Nagar, Pune',
    vehicleBrand: 'Volkswagen',
    vehicleModel: 'Virtus',
    vehicleVariant: 'Topline 1.0 TSI AT',
    vehicleRegNumber: 'MH 14 PH 9900',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-2',
    assignedTechnicianName: 'Amitabh Sen (VAG Specialist)',
    serviceBay: 'Bay 03 - Quick Periodic Lift',
    checkInDate: '2026-09-01 11:15 AM',
    expectedDeliveryDate: '2026-09-01 04:30 PM',
    currentKm: 18900,
    customerComplaint: 'First 15,000 km paid service and wheel balancing.',
    technicianDiagnosis: 'Vehicle in pristine mechanical order; tire pressure adjusted to 33 psi.',
    workRequired: [
      'VW Approved 5W-40 Synthetic Oil Renewal',
      'Hunter 3D Dynamic Wheel Balancing (4 Wheels)'
    ],
    partsRequired: [
      {
        id: 'jcp-20',
        inventoryPartId: 'PART-013',
        name: 'Castrol Edge Professional LongLife III 5W-30 (5L)',
        partNumber: 'CAS-EDGE-5W30-5L',
        quantity: 1,
        unitPrice: 4600,
        total: 4600
      }
    ],
    labour: [
      {
        id: 'jcl-17',
        description: 'First Periodic Service & Balancing',
        hours: 2,
        ratePerHour: 850,
        total: 1700
      }
    ],
    additionalWork: [],
    approvalStatus: 'APPROVED',
    paymentStatus: 'PAID',
    jobStatus: 'COMPLETED',
    notes: ['Customer satisfied with seamless doorstep valet.'],
    photos: [],
    createdAt: '2026-09-01T11:15:00Z',
    updatedAt: '2026-09-01T16:00:00Z'
  },
  {
    id: 'JC-016',
    jobCardNumber: 'TORQX-JC-2026-00016',
    bookingId: 'TORQX-2026-00450',
    customerName: 'Vivek Oberoi',
    customerPhone: '+91 98229 33221',
    customerEmail: 'vivek.oberoi@enterprises.com',
    customerAddress: 'Villa 21, Clover Highlands, NIBM, Pune',
    vehicleBrand: 'Mercedes-Benz',
    vehicleModel: 'GLC',
    vehicleVariant: 'GLC 300 4MATIC',
    vehicleRegNumber: 'MH 12 VO 0300',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-3',
    assignedTechnicianName: 'Dinesh Patil (Suspension Lead)',
    serviceBay: 'Bay 04 - Suspension & Brake Bay',
    checkInDate: '2026-08-30 10:00 AM',
    expectedDeliveryDate: '2026-08-30 06:00 PM',
    currentKm: 48300,
    customerComplaint: 'Slight squeak from rear brake during reverse parking.',
    technicianDiagnosis: 'Rear brake pads at 3.5mm; glaze accumulation on disc surface.',
    workRequired: [
      'Brembo Ceramic Rear Brake Pad Replacement',
      'Rear Rotor Deglazing & Ultrasonic Cleaning'
    ],
    partsRequired: [
      {
        id: 'jcp-21',
        inventoryPartId: 'PART-019',
        name: 'Brembo Ceramic Rear Brake Pad Set',
        partNumber: 'BRM-P06025N',
        quantity: 1,
        unitPrice: 4200,
        total: 4200
      }
    ],
    labour: [
      {
        id: 'jcl-18',
        description: 'Rear Brake Caliper Servicing',
        hours: 1.5,
        ratePerHour: 950,
        total: 1425
      }
    ],
    additionalWork: [],
    approvalStatus: 'APPROVED',
    paymentStatus: 'PAID',
    jobStatus: 'COMPLETED',
    notes: ['Brake noise resolved completely.'],
    photos: [],
    createdAt: '2026-08-30T10:00:00Z',
    updatedAt: '2026-08-30T17:00:00Z'
  },
  {
    id: 'JC-017',
    jobCardNumber: 'TORQX-JC-2026-00017',
    bookingId: 'TORQX-2026-00445',
    customerName: 'Tarun Tahiliani',
    customerPhone: '+91 97650 11992',
    customerEmail: 'tarun.t@fashioncouture.in',
    customerAddress: 'Bungalow 18, Salisbury Park, Pune',
    vehicleBrand: 'Porsche',
    vehicleModel: 'Cayenne',
    vehicleVariant: 'Cayenne E-Hybrid',
    vehicleRegNumber: 'MH 12 TT 9999',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-5',
    assignedTechnicianName: 'Karan Joshi (Master Detailing)',
    serviceBay: 'Bay 06 - Dust-Free Ceramic Studio',
    checkInDate: '2026-08-28 09:30 AM',
    expectedDeliveryDate: '2026-08-29 06:00 PM',
    currentKm: 22400,
    customerComplaint: 'Annual Ceramic Rejuvenation Coating & Interior Conditioning.',
    technicianDiagnosis: 'Hydrophobic properties at 70%; light water spot etching on bonnet.',
    workRequired: [
      'Chemical Decontamination & Clay Bar Treatment',
      'Gyeon Ceramic Quartz Topcoat Booster',
      'Swissvax Leather Balm Conditioning'
    ],
    partsRequired: [
      {
        id: 'jcp-22',
        inventoryPartId: 'PART-028',
        name: 'Gyeon Q² MOHS EVO 9H Certified Ceramic Quartz (50ml)',
        partNumber: 'GYE-Q2MOHS50',
        quantity: 1,
        unitPrice: 12000,
        total: 12000
      }
    ],
    labour: [
      {
        id: 'jcl-19',
        description: 'Annual Ceramic Topcoat Application',
        hours: 4,
        ratePerHour: 1200,
        total: 4800
      }
    ],
    additionalWork: [],
    approvalStatus: 'APPROVED',
    paymentStatus: 'PAID',
    jobStatus: 'COMPLETED',
    notes: ['Water contact angle restored to >110 degrees.'],
    photos: [],
    createdAt: '2026-08-28T09:30:00Z',
    updatedAt: '2026-08-29T17:30:00Z'
  },
  {
    id: 'JC-018',
    jobCardNumber: 'TORQX-JC-2026-00018',
    bookingId: 'TORQX-2026-00440',
    customerName: 'Deepak Parekh',
    customerPhone: '+91 98220 55661',
    customerEmail: 'deepak.parekh@housing.org',
    customerAddress: 'Flat 1102, One North, Magarpatta City, Pune',
    vehicleBrand: 'Audi',
    vehicleModel: 'A6',
    vehicleVariant: '45 TFSI Technology',
    vehicleRegNumber: 'MH 12 DP 0045',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-2',
    assignedTechnicianName: 'Amitabh Sen (VAG Specialist)',
    serviceBay: 'Bay 02 - Heavy Mechanical Lift',
    checkInDate: '2026-08-26 10:15 AM',
    expectedDeliveryDate: '2026-08-26 05:45 PM',
    currentKm: 54100,
    customerComplaint: 'Auxiliary serpentine belt squeal on cold engine start.',
    technicianDiagnosis: 'Serpentine belt tensioner bearing dry; belt surface glazed.',
    workRequired: [
      'Continental Multi-Rib Serpentine Belt Replacement',
      'Belt Tensioner Pulley Alignment'
    ],
    partsRequired: [
      {
        id: 'jcp-23',
        inventoryPartId: 'PART-007',
        name: 'Continental ContiTech Multi-Rib Serpentine V-Belt',
        partNumber: 'CNT-6PK1870',
        quantity: 1,
        unitPrice: 1850,
        total: 1850
      }
    ],
    labour: [
      {
        id: 'jcl-20',
        description: 'Belt & Tensioner Assembly Labour',
        hours: 1.5,
        ratePerHour: 950,
        total: 1425
      }
    ],
    additionalWork: [],
    approvalStatus: 'APPROVED',
    paymentStatus: 'PAID',
    jobStatus: 'COMPLETED',
    notes: ['Serpentine belt tension verified with sonic tension meter.'],
    photos: [],
    createdAt: '2026-08-26T10:15:00Z',
    updatedAt: '2026-08-26T16:45:00Z'
  },
  {
    id: 'JC-019',
    jobCardNumber: 'TORQX-JC-2026-00019',
    bookingId: 'TORQX-2026-00435',
    customerName: 'Natasha Poonawalla',
    customerPhone: '+91 98900 88776',
    customerEmail: 'natasha.p@seruminstitute.com',
    customerAddress: 'Serum Villa, Ghorpadi, Pune',
    vehicleBrand: 'BMW',
    vehicleModel: 'Z4',
    vehicleVariant: 'M40i Roadster',
    vehicleRegNumber: 'MH 12 NP 0001',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-1',
    assignedTechnicianName: 'Rahul Sharma (Master Tech)',
    serviceBay: 'Bay 01 - Diagnostic Hub',
    checkInDate: '2026-08-24 09:00 AM',
    expectedDeliveryDate: '2026-08-24 06:00 PM',
    currentKm: 16400,
    customerComplaint: 'Track day preparation: high-performance brake fluid flush & tyre scan.',
    technicianDiagnosis: 'Vehicle in peak athletic condition; brake fluid moisture at 0.4%.',
    workRequired: [
      'Motul 300V Factory Line 100% Synthetic Upgrade',
      'Motul RBF 660 Racing Brake Fluid Flush',
      'Michelin Pilot Sport 4 Tread Depth Check'
    ],
    partsRequired: [
      {
        id: 'jcp-24',
        inventoryPartId: 'PART-011',
        name: 'Motul DOT 5.1 High Performance Brake Fluid (1L)',
        partNumber: 'MOT-100951',
        quantity: 2,
        unitPrice: 1100,
        total: 2200
      }
    ],
    labour: [
      {
        id: 'jcl-21',
        description: 'Track Calibration & Pressure Flushes',
        hours: 2.5,
        ratePerHour: 1100,
        total: 2750
      }
    ],
    additionalWork: [],
    approvalStatus: 'APPROVED',
    paymentStatus: 'PAID',
    jobStatus: 'COMPLETED',
    notes: ['Track inspection certified by Master Tech Rahul Sharma.'],
    photos: [],
    createdAt: '2026-08-24T09:00:00Z',
    updatedAt: '2026-08-24T17:00:00Z'
  },
  {
    id: 'JC-020',
    jobCardNumber: 'TORQX-JC-2026-00020',
    bookingId: 'TORQX-2026-00430',
    customerName: 'Anil Ambani',
    customerPhone: '+91 98221 00991',
    customerEmail: 'anil.ambani@telecom.in',
    customerAddress: 'Penthouse 16, Panchshil One, Kalyani Nagar, Pune',
    vehicleBrand: 'Mercedes-Benz',
    vehicleModel: 'S-Class',
    vehicleVariant: 'S450 4MATIC',
    vehicleRegNumber: 'MH 12 AA 0001',
    serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
    assignedTechnicianId: 'tech-6',
    assignedTechnicianName: 'Vikram Shinde (Senior Mechanical)',
    serviceBay: 'Bay 02 - Heavy Mechanical Lift',
    checkInDate: '2026-08-20 09:30 AM',
    expectedDeliveryDate: '2026-08-20 05:30 PM',
    currentKm: 38200,
    customerComplaint: 'Scheduled 40k Major Service & Airmatic suspension recalibration.',
    technicianDiagnosis: 'Airmatic air struts holding factory pressure specs with zero drop.',
    workRequired: [
      'Mobil 1 ESP 0W-30 Synthetic Lubricant Service',
      'Mercedes Genuine Air & Pollen Filter Renewal',
      'Star Diagnostic Suspension Level Sensor Re-calibration'
    ],
    partsRequired: [
      {
        id: 'jcp-25',
        inventoryPartId: 'PART-014',
        name: 'Mann-Filter Engine Air Filter Element',
        partNumber: 'MAN-C28038',
        quantity: 1,
        unitPrice: 1550,
        total: 1550
      },
      {
        id: 'jcp-26',
        inventoryPartId: 'PART-030',
        name: 'Mann-Filter High Performance Fuel Filter Element',
        partNumber: 'MAN-WK8201',
        quantity: 1,
        unitPrice: 2200,
        total: 2200
      }
    ],
    labour: [
      {
        id: 'jcl-22',
        description: 'S-Class Flagship Scheduled Service Labour',
        hours: 3.5,
        ratePerHour: 1200,
        total: 4200
      }
    ],
    additionalWork: [],
    approvalStatus: 'APPROVED',
    paymentStatus: 'PAID',
    jobStatus: 'COMPLETED',
    notes: ['Delivered via white-glove chauffeur service.'],
    photos: [],
    createdAt: '2026-08-20T09:30:00Z',
    updatedAt: '2026-08-20T17:30:00Z'
  }
];
