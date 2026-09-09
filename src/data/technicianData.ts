import { Technician, ServiceBay } from '../types';

export const INITIAL_TECHNICIANS: Technician[] = [
  {
    id: 'tech-1',
    name: 'Rahul Sharma',
    role: 'Master Diagnostic Lead',
    specialization: 'BMW & Mercedes Powertrains, Bosch Level 3',
    experienceYears: 12,
    activeJobs: 3,
    completedJobs: 142,
    rating: 4.9,
    phone: '+91 98220 11450',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    status: 'busy'
  },
  {
    id: 'tech-2',
    name: 'Amitabh Sen',
    role: 'VAG Group & Transmission Specialist',
    specialization: 'Audi, Volkswagen, Skoda DSG & 4MOTION',
    experienceYears: 10,
    activeJobs: 2,
    completedJobs: 118,
    rating: 4.85,
    phone: '+91 98220 11451',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    status: 'busy'
  },
  {
    id: 'tech-3',
    name: 'Dinesh Patil',
    role: 'Suspension, Braking & Dynamics Lead',
    specialization: 'Brembo Calipers, Hunter 3D Alignment, Air-Suspension',
    experienceYears: 8,
    activeJobs: 1,
    completedJobs: 94,
    rating: 4.9,
    phone: '+91 98220 11452',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    status: 'available'
  },
  {
    id: 'tech-4',
    name: 'Sameer Khan',
    role: 'Auto-Electrical & HVAC Specialist',
    specialization: 'Robinair Dual Gas AC, Hybrid battery isolation, CAN-Bus',
    experienceYears: 9,
    activeJobs: 2,
    completedJobs: 103,
    rating: 4.8,
    phone: '+91 98220 11453',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    status: 'available'
  },
  {
    id: 'tech-5',
    name: 'Karan Joshi',
    role: 'Master Detailing & Paint Correction Artisan',
    specialization: 'Rupes Certified 9H Ceramic & Polycarbonate Vapor',
    experienceYears: 7,
    activeJobs: 1,
    completedJobs: 87,
    rating: 4.95,
    phone: '+91 98220 11454',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
    status: 'available'
  }
];

export const INITIAL_SERVICE_BAYS: ServiceBay[] = [
  {
    id: 'bay-1',
    name: 'Bay 01 - Diagnostic Hub',
    type: 'Diagnostics',
    status: 'occupied',
    currentBookingId: 'TORQX-2026-00482',
    vehicleModel: 'BMW 3 Series (330i M Sport)',
    technicianName: 'Rahul Sharma'
  },
  {
    id: 'bay-2',
    name: 'Bay 02 - Heavy Mechanical Lift',
    type: 'Mechanical',
    status: 'occupied',
    currentBookingId: 'TORQX-2026-00479',
    vehicleModel: 'Audi Q5 45 TFSI',
    technicianName: 'Amitabh Sen'
  },
  {
    id: 'bay-3',
    name: 'Bay 03 - Quick Periodic Lift',
    type: 'Mechanical',
    status: 'empty'
  },
  {
    id: 'bay-4',
    name: 'Bay 04 - Suspension & Brake Bay',
    type: 'Wheel Bay',
    status: 'occupied',
    currentBookingId: 'TORQX-2026-00475',
    vehicleModel: 'Mercedes-Benz C-Class (C220d)',
    technicianName: 'Dinesh Patil'
  },
  {
    id: 'bay-5',
    name: 'Bay 05 - Hunter 3D Alignment Station',
    type: 'Wheel Bay',
    status: 'empty'
  },
  {
    id: 'bay-6',
    name: 'Bay 06 - Dust-Free Ceramic Studio',
    type: 'Detailing',
    status: 'occupied',
    currentBookingId: 'TORQX-2026-00471',
    vehicleModel: 'Porsche Macan GTS',
    technicianName: 'Karan Joshi'
  }
];
