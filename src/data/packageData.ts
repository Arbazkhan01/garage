import { ServicePackage } from '../types';

export const INITIAL_SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'PKG-01',
    name: 'TORQX Grand Tourer Annual Package',
    category: 'all',
    description: 'All-inclusive annual maintenance program covering 2 full services, roadside support, unlimited top-ups, and monsoon check.',
    services: [
      '2x Scheduled Engine Oil & Filter Replacements',
      '2x 60-Point Comprehensive Electronic Inspections',
      'Wheel Alignment & Dynamic Road Balancing',
      '1x Full AC Disinfection & Evaporator Cleanse',
      '24/7 Priority Emergency Breakdown Assistance'
    ],
    partsIncluded: [
      'Synthetic Engine Oil (up to 12L)',
      'Mann-Filter OEM Oil Filters',
      'Wurth Windshield Concentrates',
      'Brake Fluid DOT 4 Flush'
    ],
    originalPrice: 28500,
    packagePrice: 19999,
    savings: 8501,
    popular: true
  },
  {
    id: 'PKG-02',
    name: 'Precision Brake Care & Rotor Rejuvenation',
    category: 'premium',
    description: 'Dedicated high-performance brake system overhaul for European sedans and performance SUVs.',
    services: [
      'Brake Caliper Ultrasonic De-Greasing',
      'Brake Rotor Micro-Skimming (Lateral Runout Correction)',
      'DOT 4+ High-Boiling-Point Fluid Bleed',
      'ABS Electronic Solenoid Diagnostic Test'
    ],
    partsIncluded: [
      'Genuine or Brembo Ceramic Pad Set (Front)',
      'Brembo Sensor Harness Kit',
      'Castrol React Performance Fluid (1L)'
    ],
    originalPrice: 16800,
    packagePrice: 12499,
    savings: 4301
  },
  {
    id: 'PKG-03',
    name: 'Arctic Chill Climate Master Package',
    category: 'all',
    description: 'High-temperature humidity climate control restore with compressor oil replenishment and anti-allergen filtration.',
    services: [
      'Automated R134a/R1234yf Evacuation & Moisture Purge',
      'UV Dye Fluorescent Micro-Leak Detection',
      'PAG 46 Synthetic Compressor Lubricant Refill',
      'Ozone Anti-Bacterial Cabin Sanitization'
    ],
    partsIncluded: [
      'Denso Activated Carbon Cabin Micro-Filter',
      'OEM Refrigerant Gas Charge (Up to 650g)'
    ],
    originalPrice: 8900,
    packagePrice: 5999,
    savings: 2901
  },
  {
    id: 'PKG-04',
    name: 'Apex Graphene & Hydrophobic Detail Package',
    category: 'luxury',
    description: 'Showroom surface correction with 3-stage rotary paint correction and 9H Graphene protective matrix.',
    services: [
      'Citrus Foam Pre-Wash & Clay Bar Decontamination',
      '3-Stage Rupes Rotary Compound & Polish',
      'Interior Leather Conditioning & UV Treatment',
      'Alloy Wheel Face Ceramic Coating'
    ],
    partsIncluded: [
      'Apex 9H Graphene Matrix Coating (2-Year Warranty)',
      'Gtechniq Leather Guard',
      'Koch-Chemie Motor Plast Bay Dressing'
    ],
    originalPrice: 34000,
    packagePrice: 24999,
    savings: 9001,
    popular: true
  }
];
