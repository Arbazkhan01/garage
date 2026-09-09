import {
  UserProfile,
  CustomerVehicle,
  Booking,
  Invoice,
  InspectionReport,
  Quotation,
  NotificationItem,
  ReviewItem,
  ActiveOffer
} from '../types';

export const DEMO_CUSTOMERS: UserProfile[] = [
  {
    id: 'user-vikram',
    name: 'Vikram Malhotra',
    email: 'vikram.malhotra@gmail.com',
    phone: '+91 98221 44556',
    role: 'customer',
    address: 'Villa 14, Panchshil Towers, Kharadi, Pune, MH 411014',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    memberSince: 'January 2024'
  },
  {
    id: 'user-ananya',
    name: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@outlook.com',
    phone: '+91 97645 88990',
    role: 'customer',
    address: 'A-402, Rohan Tarang, Wakad, Pune, MH 411057',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    memberSince: 'March 2024'
  },
  {
    id: 'user-sameer',
    name: 'Dr. Sameer Kulkarni',
    email: 'dr.sameer.k@apollo.org',
    phone: '+91 98500 23145',
    role: 'customer',
    address: '701, Trump Towers, Kalyani Nagar, Pune, MH 411006',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    memberSince: 'November 2023'
  },
  {
    id: 'user-rohan',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@techmahindra.com',
    phone: '+91 99234 56789',
    role: 'customer',
    address: 'B-12, Clover Highlands, NIBM Road, Pune, MH 411048',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
    memberSince: 'June 2024'
  },
  {
    id: 'user-priya',
    name: 'Priya Joshi',
    email: 'priya.joshi@infosys.com',
    phone: '+91 94220 33441',
    role: 'customer',
    address: 'Flat 304, Blue Ridge, Hinjawadi Phase 1, Pune, MH 411057',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    memberSince: 'February 2024'
  },
  {
    id: 'user-aditya',
    name: 'Aditya Kadam',
    email: 'aditya.kadam@kirloskar.com',
    phone: '+91 98901 88231',
    role: 'customer',
    address: 'Plot 24, Prabhat Road, Lane 4, Deccan, Pune, MH 411004',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    memberSince: 'August 2024'
  },
  {
    id: 'user-shweta',
    name: 'Shweta Shinde',
    email: 'shweta.shinde@tcs.com',
    phone: '+91 91580 99887',
    role: 'customer',
    address: 'Rowhouse 8, Krome Luxuria, Aundh, Pune, MH 411007',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    memberSince: 'September 2024'
  },
  {
    id: 'user-arjun',
    name: 'Arjun Nambiar',
    email: 'arjun.nambiar@startup.io',
    phone: '+91 99700 12345',
    role: 'customer',
    address: 'Penthouse 18, Amar Renaissance, Sopan Baug, Pune, MH 411001',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    memberSince: 'May 2024'
  },
  {
    id: 'user-admin',
    name: 'Kunal Singhania (Garage Manager)',
    email: 'manager@torqxautocare.com',
    phone: '+91 98765 43210',
    role: 'admin',
    address: 'TORQX AutoCare HQ, Baner, Pune, MH 411045',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    memberSince: 'Founding Member'
  },
  {
    id: 'user-tech1',
    name: 'Rahul Sharma (Master Tech)',
    email: 'rahul.s@torqxautocare.com',
    phone: '+91 98220 11450',
    role: 'technician',
    address: 'Workshop Bay 01, Baner, Pune, MH 411045',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    memberSince: 'January 2022'
  }
];

export const DEMO_VEHICLES: CustomerVehicle[] = [
  {
    id: 'veh-1',
    userId: 'user-vikram',
    regNumber: 'MH 12 AB 1234',
    brand: 'BMW',
    model: '3 Series',
    variant: '330i Gran Limousine M Sport (258hp)',
    year: 2024,
    fuelType: 'Petrol',
    currentKm: 18450,
    vin: 'WBA330I98240PUNE1',
    lastServiceDate: '2026-03-10',
    nextServiceDueKm: 28450,
    nextServiceDueDate: '2027-03-10',
    insuranceExpiry: '2026-11-15',
    pucExpiry: '2026-10-30',
    createdAt: '2024-01-15'
  },
  {
    id: 'veh-2',
    userId: 'user-vikram',
    regNumber: 'MH 14 XY 4567',
    brand: 'Audi',
    model: 'Q5',
    variant: '45 TFSI quattro Technology (249hp)',
    year: 2023,
    fuelType: 'Petrol',
    currentKm: 34200,
    vin: 'WAUZZZ8R98124AUDI2',
    lastServiceDate: '2026-01-20',
    nextServiceDueKm: 44200,
    nextServiceDueDate: '2027-01-20',
    insuranceExpiry: '2026-12-05',
    pucExpiry: '2026-09-25',
    createdAt: '2024-02-10'
  },
  {
    id: 'veh-3',
    userId: 'user-ananya',
    regNumber: 'MH 12 CR 9001',
    brand: 'Mercedes-Benz',
    model: 'C-Class',
    variant: 'C220d Progressive Line',
    year: 2023,
    fuelType: 'Diesel',
    currentKm: 26800,
    vin: 'WDD2050041R887711',
    lastServiceDate: '2025-11-14',
    nextServiceDueKm: 36800,
    nextServiceDueDate: '2026-11-14',
    insuranceExpiry: '2027-01-20',
    pucExpiry: '2026-11-10',
    createdAt: '2024-03-01'
  },
  {
    id: 'veh-4',
    userId: 'user-sameer',
    regNumber: 'MH 12 GT 0911',
    brand: 'Porsche',
    model: 'Macan',
    variant: 'Macan GTS (440hp Track Spec)',
    year: 2022,
    fuelType: 'Petrol',
    currentKm: 14200,
    vin: 'WP1AA2A58NL998877',
    lastServiceDate: '2026-02-18',
    nextServiceDueKm: 24200,
    nextServiceDueDate: '2027-02-18',
    insuranceExpiry: '2026-10-10',
    pucExpiry: '2026-12-01',
    createdAt: '2023-11-20'
  },
  {
    id: 'veh-5',
    userId: 'user-rohan',
    regNumber: 'MH 14 VR 2450',
    brand: 'Skoda',
    model: 'Slavia',
    variant: 'Style / Monte Carlo 1.5L TSI DSG',
    year: 2024,
    fuelType: 'Petrol',
    currentKm: 12500,
    vin: 'TMBJE6NW6R2001928',
    lastServiceDate: '2026-04-12',
    nextServiceDueKm: 22500,
    nextServiceDueDate: '2027-04-12',
    insuranceExpiry: '2027-04-01',
    pucExpiry: '2027-04-01',
    createdAt: '2024-06-15'
  },
  {
    id: 'veh-6',
    userId: 'user-priya',
    regNumber: 'MH 14 NX 8844',
    brand: 'Tata',
    model: 'Nexon',
    variant: 'Fearless+ S 1.5L Revotorq Diesel',
    year: 2023,
    fuelType: 'Diesel',
    currentKm: 29400,
    vin: 'MAT613144N7892019',
    lastServiceDate: '2025-12-02',
    nextServiceDueKm: 39400,
    nextServiceDueDate: '2026-12-02',
    insuranceExpiry: '2026-11-28',
    pucExpiry: '2026-10-15',
    createdAt: '2024-02-18'
  },
  {
    id: 'veh-7',
    userId: 'user-aditya',
    regNumber: 'MH 12 VT 5500',
    brand: 'Volkswagen',
    model: 'Virtus',
    variant: 'GT Plus 1.5L TSI EVO DSG (150hp)',
    year: 2023,
    fuelType: 'Petrol',
    currentKm: 21900,
    vin: 'WVWZZZ6R8R1009283',
    lastServiceDate: '2026-01-15',
    nextServiceDueKm: 31900,
    nextServiceDueDate: '2027-01-15',
    insuranceExpiry: '2026-09-30',
    pucExpiry: '2026-11-20',
    createdAt: '2024-08-01'
  },
  {
    id: 'veh-8',
    userId: 'user-shweta',
    regNumber: 'MH 12 HY 7722',
    brand: 'Hyundai',
    model: 'Creta',
    variant: 'SX(O) 1.5L CRDi Diesel',
    year: 2024,
    fuelType: 'Diesel',
    currentKm: 16800,
    vin: 'MALC58117R0019283',
    lastServiceDate: '2026-05-10',
    nextServiceDueKm: 26800,
    nextServiceDueDate: '2027-05-10',
    insuranceExpiry: '2027-05-01',
    pucExpiry: '2027-05-01',
    createdAt: '2024-09-02'
  },
  {
    id: 'veh-9',
    userId: 'user-arjun',
    regNumber: 'MH 12 FT 0007',
    brand: 'Toyota',
    model: 'Fortuner',
    variant: '4x4 2.8L Diesel AT (500Nm)',
    year: 2023,
    fuelType: 'Diesel',
    currentKm: 42100,
    vin: 'MR0KA32G6R1098234',
    lastServiceDate: '2025-10-18',
    nextServiceDueKm: 52100,
    nextServiceDueDate: '2026-10-18',
    insuranceExpiry: '2026-10-15',
    pucExpiry: '2026-09-20',
    createdAt: '2024-05-10'
  },
  {
    id: 'veh-10',
    userId: 'user-vikram',
    regNumber: 'MH 12 SW 6611',
    brand: 'Maruti Suzuki',
    model: 'Swift',
    variant: 'ZXi+ DualTone',
    year: 2022,
    fuelType: 'Petrol',
    currentKm: 31200,
    vin: 'MA3EWB1S6R1092831',
    lastServiceDate: '2026-02-05',
    nextServiceDueKm: 41200,
    nextServiceDueDate: '2027-02-05',
    insuranceExpiry: '2027-02-01',
    pucExpiry: '2026-11-15',
    createdAt: '2024-01-20'
  },
  {
    id: 'veh-11',
    userId: 'user-sameer',
    regNumber: 'MH 12 XC 4040',
    brand: 'Volvo',
    model: 'XC60',
    variant: 'B5 Ultimate 48V Hybrid (250hp)',
    year: 2023,
    fuelType: 'Petrol',
    currentKm: 27500,
    vin: 'YV4102SK8R1092834',
    lastServiceDate: '2026-01-08',
    nextServiceDueKm: 37500,
    nextServiceDueDate: '2027-01-08',
    insuranceExpiry: '2026-12-10',
    pucExpiry: '2026-12-15',
    createdAt: '2024-01-10'
  },
  {
    id: 'veh-12',
    userId: 'user-rohan',
    regNumber: 'MH 14 HC 1122',
    brand: 'Honda',
    model: 'City',
    variant: 'City e:HEV Strong Hybrid ZX',
    year: 2024,
    fuelType: 'Hybrid',
    currentKm: 8900,
    vin: 'MAKGN1678R1092845',
    lastServiceDate: '2026-06-01',
    nextServiceDueKm: 18900,
    nextServiceDueDate: '2027-06-01',
    insuranceExpiry: '2027-06-01',
    pucExpiry: '2027-06-01',
    createdAt: '2024-06-05'
  }
];

export const DEMO_BOOKINGS: Booking[] = [
  {
    id: 'TORQX-2026-00482',
    userId: 'user-vikram',
    customerName: 'Vikram Malhotra',
    customerPhone: '+91 98221 44556',
    customerEmail: 'vikram.malhotra@gmail.com',
    customerAddress: 'Villa 14, Panchshil Towers, Kharadi, Pune',
    vehicleBrand: 'BMW',
    vehicleModel: '3 Series',
    vehicleVariant: '330i Gran Limousine M Sport (258hp)',
    vehicleRegNumber: 'MH 12 AB 1234',
    fuelType: 'Petrol',
    serviceId: 'periodic-service',
    serviceName: 'Periodic Service',
    addonIds: ['oil-upgrade', 'ac-disinfecting', 'wheel-alignment-addon'],
    serviceDate: '2026-09-09',
    serviceTime: '10:00 AM - 12:00 PM',
    pickupDrop: 'pickup_and_drop',
    pickupAddress: 'Villa 14, Panchshil Towers, Kharadi, Pune',
    additionalNotes: 'Check slight steering vibration at 100 km/h and please flush with Motul 300V synthetic oil.',
    status: 'work_in_progress',
    technicianId: 'tech-1',
    bayNumber: 'Bay 01',
    priceBreakdown: {
      serviceBasePrice: 12999,
      partsEstimate: 4500,
      labourCharges: 2500,
      addonsTotal: 6799,
      pickupDropFee: 499,
      subtotal: 27297,
      discountAmount: 2000,
      couponCode: 'TORQX10',
      gstAmount: 4553,
      grandTotal: 29850,
      isInspectionSubject: false
    },
    createdAt: '2026-09-07T09:30:00Z',
    updatedAt: '2026-09-08T14:20:00Z',
    estimatedCompletion: 'Today, 6:30 PM'
  },
  {
    id: 'TORQX-2026-00479',
    userId: 'user-vikram',
    customerName: 'Vikram Malhotra',
    customerPhone: '+91 98221 44556',
    customerEmail: 'vikram.malhotra@gmail.com',
    customerAddress: 'Villa 14, Panchshil Towers, Kharadi, Pune',
    vehicleBrand: 'Audi',
    vehicleModel: 'Q5',
    vehicleVariant: '45 TFSI quattro Technology (249hp)',
    vehicleRegNumber: 'MH 14 XY 4567',
    fuelType: 'Petrol',
    serviceId: 'brake-service',
    serviceName: 'Brake Service',
    addonIds: ['brake-inspection-addon'],
    serviceDate: '2026-09-08',
    serviceTime: '02:30 PM - 04:30 PM',
    pickupDrop: 'garage_drop',
    additionalNotes: 'Squeal from front right wheel under hard deceleration.',
    status: 'inspection',
    technicianId: 'tech-2',
    bayNumber: 'Bay 02',
    priceBreakdown: {
      serviceBasePrice: 7499,
      partsEstimate: 3200,
      labourCharges: 1800,
      addonsTotal: 1200,
      pickupDropFee: 0,
      subtotal: 13699,
      discountAmount: 500,
      couponCode: 'FIRSTSERVICE',
      gstAmount: 2375,
      grandTotal: 15574,
      isInspectionSubject: false
    },
    createdAt: '2026-09-06T11:00:00Z',
    updatedAt: '2026-09-08T11:45:00Z',
    estimatedCompletion: 'Tomorrow, 1:00 PM'
  },
  {
    id: 'TORQX-2026-00475',
    userId: 'user-ananya',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 97645 88990',
    customerEmail: 'ananya.deshmukh@outlook.com',
    customerAddress: 'A-402, Rohan Tarang, Wakad, Pune',
    vehicleBrand: 'Mercedes-Benz',
    vehicleModel: 'C-Class',
    vehicleVariant: 'C220d Progressive Line',
    vehicleRegNumber: 'MH 12 CR 9001',
    fuelType: 'Diesel',
    serviceId: 'suspension-inspection',
    serviceName: 'Suspension & Steering Overhaul',
    addonIds: ['wheel-alignment-addon'],
    serviceDate: '2026-09-08',
    serviceTime: '09:00 AM - 11:00 AM',
    pickupDrop: 'garage_drop',
    additionalNotes: 'Suspension clunk when going over Baner speed bumps.',
    status: 'quote_sent',
    technicianId: 'tech-3',
    bayNumber: 'Bay 04',
    priceBreakdown: {
      serviceBasePrice: 6499,
      partsEstimate: 8500,
      labourCharges: 2500,
      addonsTotal: 1800,
      pickupDropFee: 0,
      subtotal: 19299,
      discountAmount: 1500,
      couponCode: 'GERMANSPEC',
      gstAmount: 3203,
      grandTotal: 21002,
      isInspectionSubject: true
    },
    createdAt: '2026-09-05T14:10:00Z',
    updatedAt: '2026-09-08T10:15:00Z',
    estimatedCompletion: 'Today, 5:00 PM'
  },
  {
    id: 'TORQX-2026-00471',
    userId: 'user-sameer',
    customerName: 'Dr. Sameer Kulkarni',
    customerPhone: '+91 98500 23145',
    customerEmail: 'dr.sameer.k@apollo.org',
    vehicleBrand: 'Porsche',
    vehicleModel: 'Macan',
    vehicleVariant: 'Macan GTS (440hp Track Spec)',
    vehicleRegNumber: 'MH 12 GT 0911',
    fuelType: 'Petrol',
    serviceId: 'ceramic-coating',
    serviceName: '9H Ceramic Coating (3 Years)',
    addonIds: ['interior-deep-cleaning', 'engine-bay-dressing'],
    serviceDate: '2026-09-07',
    serviceTime: '09:00 AM - 11:00 AM',
    pickupDrop: 'pickup_and_drop',
    pickupAddress: '701, Trump Towers, Kalyani Nagar, Pune',
    additionalNotes: 'Special attention to gloss black trim panels.',
    status: 'quality_check',
    technicianId: 'tech-5',
    bayNumber: 'Bay 06',
    priceBreakdown: {
      serviceBasePrice: 38999,
      partsEstimate: 4500,
      labourCharges: 6500,
      addonsTotal: 4849,
      pickupDropFee: 499,
      subtotal: 55347,
      discountAmount: 3500,
      couponCode: 'WEEKEND',
      gstAmount: 9332,
      grandTotal: 61179,
      isInspectionSubject: true
    },
    createdAt: '2026-09-04T16:00:00Z',
    updatedAt: '2026-09-08T15:30:00Z',
    estimatedCompletion: 'Today, 7:00 PM'
  },
  {
    id: 'TORQX-2026-00468',
    userId: 'user-rohan',
    customerName: 'Rohan Mehta',
    customerPhone: '+91 99234 56789',
    customerEmail: 'rohan.mehta@techmahindra.com',
    vehicleBrand: 'Skoda',
    vehicleModel: 'Slavia',
    vehicleVariant: 'Style / Monte Carlo 1.5L TSI DSG',
    vehicleRegNumber: 'MH 14 VR 2450',
    fuelType: 'Petrol',
    serviceId: 'periodic-service',
    serviceName: 'Periodic Service',
    addonIds: ['ac-disinfecting', 'exterior-foam-wash'],
    serviceDate: '2026-09-05',
    serviceTime: '11:30 AM - 01:30 PM',
    pickupDrop: 'garage_drop',
    status: 'completed',
    technicianId: 'tech-2',
    priceBreakdown: {
      serviceBasePrice: 6499,
      partsEstimate: 2100,
      labourCharges: 1600,
      addonsTotal: 1598,
      pickupDropFee: 0,
      subtotal: 11797,
      discountAmount: 1180,
      couponCode: 'TORQX10',
      gstAmount: 1911,
      grandTotal: 12528,
      isInspectionSubject: false
    },
    createdAt: '2026-09-02T10:00:00Z',
    updatedAt: '2026-09-05T17:00:00Z'
  }
];

export const DEMO_INSPECTIONS: Record<string, InspectionReport> = {
  'TORQX-2026-00482': {
    id: 'INSP-482',
    bookingId: 'TORQX-2026-00482',
    technicianId: 'tech-1',
    technicianName: 'Rahul Sharma (Master Diagnostic Lead)',
    vehicleReg: 'MH 12 AB 1234',
    vehicleName: 'BMW 3 Series 330i M Sport',
    odometer: 18450,
    date: '2026-09-08',
    overallHealthScore: 92,
    technicianNotes: 'Engine compression test is within 2% factory tolerances. Spark plugs show clean burn. Found slight outer edge feathered tire wear on front left wheel, recommending 3D Hunter alignment adjustment.',
    recommendations: [
      'Perform 3D Hunter camber/toe alignment (Customer approved)',
      'Flush brake fluid next service interval (moisture at 1.8%)',
      'Replace cabin AC pollen filter before Pune monsoon'
    ],
    categories: {
      engine: {
        title: 'Engine & Powertrain',
        icon: 'Wrench',
        items: [
          { id: 'eng-1', name: 'Engine Oil Quality & Level', status: 'GOOD', measurement: 'Dipstick Max / Fresh Synthetic' },
          { id: 'eng-2', name: 'Coolant Boiling Point & Level', status: 'GOOD', measurement: '-37°C glycol protection' },
          { id: 'eng-3', name: 'Auxiliary Serpentine Belts', status: 'GOOD', notes: 'Zero cracking or rubber glazing' },
          { id: 'eng-4', name: 'Gasket & Oil Sump Seepage', status: 'GOOD', notes: 'Completely bone dry underbody' }
        ]
      },
      brakes: {
        title: 'Braking Dynamics',
        icon: 'Disc',
        items: [
          { id: 'brk-1', name: 'Front Brake Pads Thickness', status: 'GOOD', measurement: '8.5 mm remaining' },
          { id: 'brk-2', name: 'Rear Brake Pads Thickness', status: 'GOOD', measurement: '7.8 mm remaining' },
          { id: 'brk-3', name: 'Brake Fluid Water Content', status: 'ATTENTION', measurement: '1.8% moisture detected' },
          { id: 'brk-4', name: 'Rotor Disc Runout (Lateral)', status: 'GOOD', measurement: '0.02 mm (factory spec)' }
        ]
      },
      tyres: {
        title: 'Wheels & Tyres',
        icon: 'Compass',
        items: [
          { id: 'tyr-1', name: 'Front Left Michelin PS4 Tread', status: 'ATTENTION', measurement: '5.2 mm (Feathered wear)' },
          { id: 'tyr-2', name: 'Front Right Michelin PS4 Tread', status: 'GOOD', measurement: '5.8 mm' },
          { id: 'tyr-3', name: 'Rear Left Tread Depth', status: 'GOOD', measurement: '6.4 mm' },
          { id: 'tyr-4', name: 'Rear Right Tread Depth', status: 'GOOD', measurement: '6.5 mm' }
        ]
      },
      battery: {
        title: 'Electrical & Battery',
        icon: 'Zap',
        items: [
          { id: 'bat-1', name: 'Resting Voltage (12V Varta AGM)', status: 'GOOD', measurement: '12.65 Volts' },
          { id: 'bat-2', name: 'Cold Cranking Amps (CCA)', status: 'GOOD', measurement: '810 / 850 CCA (95% SOH)' },
          { id: 'bat-3', name: 'Alternator Charging Rate', status: 'GOOD', measurement: '14.2 Volts under load' }
        ]
      },
      suspension: {
        title: 'Suspension & Steering',
        icon: 'Activity',
        items: [
          { id: 'sus-1', name: 'M Sport Adaptive Strut Seals', status: 'GOOD', notes: 'Zero hydraulic misting' },
          { id: 'sus-2', name: 'Lower Arm Hydraulic Bushes', status: 'GOOD', notes: 'Zero rubber tear or deflection' },
          { id: 'sus-3', name: 'Steering Rack & Tie Rods', status: 'GOOD', notes: 'Zero play detected' }
        ]
      },
      ac: {
        title: 'Climate & Air Conditioning',
        icon: 'Wind',
        items: [
          { id: 'ac-1', name: 'Vent Center Temperature', status: 'GOOD', measurement: '5.8°C at idle' },
          { id: 'ac-2', name: 'R134a Refrigerant Pressure', status: 'GOOD', measurement: '34 psi low / 195 psi high' },
          { id: 'ac-3', name: 'Cabin Activated Carbon Filter', status: 'ATTENTION', notes: 'Slight dust build-up' }
        ]
      }
    }
  }
};

export const DEMO_QUOTATIONS: Record<string, Quotation> = {
  'TORQX-2026-00475': {
    id: 'QT-2026-091',
    bookingId: 'TORQX-2026-00475',
    quotationNumber: 'QTN-TORQX-091',
    date: '2026-09-08',
    status: 'pending',
    items: [
      { id: 'q1', name: 'Mercedes-Benz Genuine Front Stabilizer Links (Pair)', type: 'parts', cost: 5800 },
      { id: 'q2', name: 'Lower Control Arm Hydro-Bushing Renewal (L+R)', type: 'parts', cost: 6200 },
      { id: 'q3', name: 'Suspension Subframe Dismantling & Press Labour', type: 'labour', cost: 2500 },
      { id: 'q4', name: 'Hunter 3D Suspension Geometry Recalibration', type: 'labour', cost: 1800 },
      { id: 'q5', name: 'Underbody Anti-Corrosion Zinc Cavity Wax', type: 'addon', cost: 1200 }
    ],
    subtotal: 17500,
    gst: 3150,
    total: 20650
  }
};

export const DEMO_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-0482',
    bookingId: 'TORQX-2026-00482',
    date: '2026-09-08',
    customerName: 'Vikram Malhotra',
    customerPhone: '+91 98221 44556',
    customerEmail: 'vikram.malhotra@gmail.com',
    customerAddress: 'Villa 14, Panchshil Towers, Kharadi, Pune',
    vehicleDetails: 'BMW 3 Series 330i M Sport (Petrol, 2024)',
    vehicleReg: 'MH 12 AB 1234',
    items: [
      { description: 'Periodic Scheduled Service (BMW TwinPower Turbo 0W-30 synthetic, oil filter, air check)', quantity: 1, rate: 12999, amount: 12999 },
      { description: 'OEM Mann-Filter Oil Cartridge & Sump Washer', quantity: 1, rate: 2100, amount: 2100 },
      { description: 'Motul 300V Factory Line 100% Synthetic Upgrade', quantity: 1, rate: 3500, amount: 3500 },
      { description: 'AC Hospital-Grade Ozone Microbial Disinfection', quantity: 1, rate: 1499, amount: 1499 },
      { description: 'Hunter 3D Multi-Camera Laser Wheel Alignment', quantity: 1, rate: 1800, amount: 1800 },
      { description: 'Doorstep Pickup & Drop Valet (Flatbed/Chauffeur)', quantity: 1, rate: 499, amount: 499 },
      { description: 'Master Diagnostic & Mechanical Labour', quantity: 1, rate: 4900, amount: 4900 }
    ],
    subtotal: 27297,
    discount: 2000,
    couponCode: 'TORQX10',
    gst: 4553,
    total: 29850,
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    transactionId: 'UPI-ICICI-889102938102',
    paidAt: '2026-09-08 14:15:00'
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-0468',
    bookingId: 'TORQX-2026-00468',
    date: '2026-09-05',
    customerName: 'Rohan Mehta',
    customerPhone: '+91 99234 56789',
    customerEmail: 'rohan.mehta@techmahindra.com',
    vehicleDetails: 'Skoda Slavia Style 1.5L TSI DSG',
    vehicleReg: 'MH 14 VR 2450',
    items: [
      { description: 'Periodic Scheduled 15,000 KM Service (Castrol Magnatec Professional 5W-40, OEM filters)', quantity: 1, rate: 6499, amount: 6499 },
      { description: 'VW-Skoda Genuine Oil Filter Cartridge', quantity: 1, rate: 850, amount: 850 },
      { description: 'Pollen Cabin Filter (Antiallergenic)', quantity: 1, rate: 1250, amount: 1250 },
      { description: 'AC Vent Ozone Sterilization', quantity: 1, rate: 899, amount: 899 },
      { description: 'Snow Foam Exterior Body Wash & Ceramic Gloss', quantity: 1, rate: 699, amount: 699 },
      { description: 'General Inspection & Calibration Labour', quantity: 1, rate: 1600, amount: 1600 }
    ],
    subtotal: 11797,
    discount: 1180,
    couponCode: 'TORQX10',
    gst: 1911,
    total: 12528,
    paymentStatus: 'paid',
    paymentMethod: 'Card',
    transactionId: 'TXN-HDFC-99120938',
    paidAt: '2026-09-05 16:45:00'
  }
];

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-vikram',
    title: '🔧 Vehicle Inspection Completed',
    message: 'Master Technician Rahul Sharma completed the 60-point audit for your BMW 330i (Score: 92/100).',
    type: 'success',
    read: false,
    createdAt: '2 hours ago',
    link: '/service/TORQX-2026-00482'
  },
  {
    id: 'notif-2',
    userId: 'user-ananya',
    title: '💰 New Quotation Generated',
    message: 'Technician Dinesh Patil generated a repair quotation for your Mercedes C220d suspension links.',
    type: 'info',
    read: false,
    createdAt: '3 hours ago',
    link: '/service/TORQX-2026-00475'
  },
  {
    id: 'notif-3',
    userId: 'user-vikram',
    title: '🚗 Service Work In Progress',
    message: 'Your BMW 330i is currently in Bay 01. Estimated completion by 6:30 PM.',
    type: 'info',
    read: false,
    createdAt: '4 hours ago',
    link: '/service/TORQX-2026-00482'
  },
  {
    id: 'notif-4',
    userId: 'user-sameer',
    title: '✅ Quality Check Underway',
    message: 'Infrared curing of the 9H Ceramic layer on your Porsche Macan GTS is now being inspected.',
    type: 'success',
    read: true,
    createdAt: 'Yesterday',
    link: '/service/TORQX-2026-00471'
  },
  {
    id: 'notif-5',
    userId: 'user-vikram',
    title: '🔔 Service Reminder',
    message: 'Your Audi Q5 (MH 14 XY 4567) has an upcoming brake disc maintenance check.',
    type: 'reminder',
    read: true,
    createdAt: '3 days ago',
    link: '/book-service'
  }
];

export const ACTIVE_OFFERS: ActiveOffer[] = [
  {
    id: 'offer-monsoon',
    title: 'Free 40-Point Safety & Brake Health Audit',
    description: 'Complimentary computerized brake fluid test, suspension check & battery health test with every Periodic Service.',
    discountText: '100% Free Add-on',
    code: 'TORQX10',
    validUntil: '30 September 2026',
    applicableBrands: ['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Skoda', 'Toyota']
  },
  {
    id: 'offer-weekend',
    title: '15% Weekend Priority Bay Slot',
    description: 'Book Saturday or Sunday service slots online and get an instant 15% discount on labour & diagnostics.',
    discountText: '15% OFF',
    code: 'WEEKEND',
    validUntil: '31 October 2026',
    applicableBrands: ['All Brands']
  },
  {
    id: 'offer-welcome',
    title: 'Flat ₹500 First Time Customer Credit',
    description: 'Experience Pune’s finest independent German & multi-brand workshop with a ₹500 instant booking voucher.',
    discountText: '₹500 OFF',
    code: 'FIRSTSERVICE',
    validUntil: '31 December 2026',
    applicableBrands: ['All Brands']
  }
];
