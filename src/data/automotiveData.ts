import { ServiceItem, StatItem, GalleryProject, BeforeAfterItem, TestimonialItem, ProcessStep } from '../types';

export const BRAND_INFO = {
  name: 'TORQX AUTOCARE',
  tagline: 'Precision Service. Peak Performance.',
  phoneDisplay: '+91 98765 43210',
  phoneRaw: '+919876543210',
  whatsappNumber: '919876543210',
  whatsappLink: 'https://wa.me/919876543210?text=Hello%20TORQX%20AutoCare%2C%20I%20would%20like%20to%20inquire%20about%20a%20service%20booking%20for%20my%20vehicle.',
  email: 'service@torqxautocare.com',
  address: '123 Automotive Avenue, Baner-Balewadi Tech Corridor, Pune, Maharashtra 411045, India',
  city: 'Pune, Maharashtra',
  hoursWeekday: 'Monday – Saturday: 9:00 AM – 8:00 PM',
  hoursWeekend: 'Sunday: 10:00 AM – 4:00 PM',
  googleMapsUrl: 'https://maps.google.com/?q=Pune+Automotive+Avenue',
};

export const STATS_DATA: StatItem[] = [
  {
    value: 10,
    suffix: '+',
    label: 'Years',
    sublabel: 'Automotive Experience'
  },
  {
    value: 5000,
    suffix: '+',
    label: 'Cars Serviced',
    sublabel: 'German & Luxury Specialists'
  },
  {
    value: 98,
    suffix: '%',
    label: 'Customer Satisfaction',
    sublabel: 'Verified Reviews & Repeat Clients'
  },
  {
    value: 24,
    suffix: '/7',
    label: 'Roadside Support',
    sublabel: 'Rapid Breakdown Assistance'
  }
];

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'engine-transmission',
    title: 'Engine & Transmission',
    category: 'mechanical',
    shortDesc: 'Complete inspection, repair and maintenance.',
    detailedDesc: 'Comprehensive diagnostics and mechanical overhauls for internal combustion and hybrid powertrains, dual-clutch transmission fluid flush, timing chain synchronization, and turbocharger tuning.',
    duration: '4 - 8 Hours',
    priceEstimate: 'From ₹4,499',
    iconName: 'Wrench',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    features: [
      'Digital bore-scope valve inspection',
      'ECU timing & fuel rail calibration',
      'DSG/AT automatic transmission service',
      'Compression & cylinder leakage test'
    ]
  },
  {
    id: 'periodic-service',
    title: 'Periodic Service',
    category: 'mechanical',
    shortDesc: 'Oil change, filters, fluids and complete vehicle inspection.',
    detailedDesc: 'Factory-scheduled maintenance using manufacturer-specified fully synthetic engine oils (0W-20, 5W-30, 5W-40), OEM oil, cabin and air filters, spark plug check, and 60-point mechanical safety audit.',
    duration: '2 - 3 Hours',
    priceEstimate: 'From ₹3,199',
    iconName: 'CalendarCheck',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    features: [
      'Full synthetic OEM-spec oil replacement',
      'Filter renewal (Air, Oil, AC pollen)',
      'Suspension & undercarriage torque check',
      'Coolant, brake & washer fluid top-up'
    ]
  },
  {
    id: 'brake-service',
    title: 'Brake Service',
    category: 'mechanical',
    shortDesc: 'Brake inspection, pad replacement and brake system repair.',
    detailedDesc: 'High-performance and ceramic brake pad installations, rotor disc skim resurfacing, ABS hydraulic bleed with Brembo/ATE fluid, caliper rebuilds, and electronic parking brake calibration.',
    duration: '1.5 - 3 Hours',
    priceEstimate: 'From ₹2,499',
    iconName: 'Disc',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
    features: [
      'Ceramic and semi-metallic pad options',
      'Rotor runout & disc thickness micrometer test',
      'DOT 4 / DOT 5.1 pressure fluid flush',
      'Electronic parking brake caliper reset'
    ]
  },
  {
    id: 'ac-climate',
    title: 'AC & Climate',
    category: 'mechanical',
    shortDesc: 'AC diagnostics, gas refill, compressor and cooling system service.',
    detailedDesc: 'Deep ultrasonic evaporator decontamination, refrigerant recovery and R134a/R1234yf precision recharge, compressor clutch testing, condenser radiator washing, and odor elimination.',
    duration: '2 - 4 Hours',
    priceEstimate: 'From ₹2,199',
    iconName: 'Wind',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    features: [
      'Precision vacuum leak detection',
      'Refrigerant & PAG compressor oil recharge',
      'Ozone antiviral HVAC disinfection',
      'Condenser coil chemical pressure wash'
    ]
  },
  {
    id: 'wheel-alignment',
    title: 'Wheel Alignment',
    category: 'mechanical',
    shortDesc: 'Precision alignment and balancing.',
    detailedDesc: 'Computerized 3D laser wheel alignment and dynamic wheel balancing up to 22-inch rims. Corrects uneven tire wear, steering pull, and optimizes high-speed highway stability.',
    duration: '45 - 60 Mins',
    priceEstimate: 'From ₹999',
    iconName: 'Gauge',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    features: [
      'Computerized 3D camera sensor alignment',
      'Camber, caster & toe angle zero-tolerance adjustment',
      'High-speed road-force tire balancing',
      'Steering angle sensor (SAS) electronic reset'
    ]
  },
  {
    id: 'computer-diagnostics',
    title: 'Computer Diagnostics',
    category: 'diagnostics',
    shortDesc: 'Advanced vehicle scanning and fault detection.',
    detailedDesc: 'Dealer-level OBD-II diagnostics using Autel MaxiSys and OEM diagnostic software. Live ECU sensor stream reading, sensor recalibration, check engine light diagnosis, and clearing stored error codes.',
    duration: '1 - 2 Hours',
    priceEstimate: 'From ₹1,499',
    iconName: 'Cpu',
    image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80',
    features: [
      'Full ECU system scan (Engine, TCM, BCM, SRS)',
      'Live graphing of sensor signals & fuel trims',
      'Freeze-frame telemetry fault code extraction',
      'Digital diagnostic PDF report emailed instantly'
    ]
  },
  {
    id: 'battery-electrical',
    title: 'Battery & Electrical',
    category: 'diagnostics',
    shortDesc: 'Battery testing, replacement and electrical diagnostics.',
    detailedDesc: 'State-of-health conductance battery analysis, alternator voltage regulator load testing, starter motor draw assessment, and troubleshooting parasitic battery drains on modern electronics.',
    duration: '45 - 90 Mins',
    priceEstimate: 'From ₹1,299',
    iconName: 'Zap',
    image: 'https://images.unsplash.com/photo-1597766353926-e26b1318a096?auto=format&fit=crop&w=800&q=80',
    features: [
      'Digital CCA (Cold Cranking Amps) health audit',
      'Alternator ripple & diode rectifier check',
      'Parasitic overnight amperage draw isolation',
      'OEM AGM and EFB stop-start battery programming'
    ]
  },
  {
    id: 'detailing',
    title: 'Detailing',
    category: 'detailing',
    shortDesc: 'Premium interior and exterior detailing.',
    detailedDesc: 'Multi-stage paint correction removing 90%+ swirl marks, 9H/10H ceramic coating application, interior leather nourishment with Swissvax conditioners, steam extraction, and deep hydrophobic glass treatment.',
    duration: '1 - 2 Days',
    priceEstimate: 'From ₹4,999',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80',
    features: [
      'Multi-stage rotary compound swirl removal',
      '9H Graphene/Ceramic protective paint shield',
      'Dry steam interior deep sterilization',
      'Engine bay degreasing and satin dressing'
    ]
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Book Your Service',
    description: 'Schedule online or via WhatsApp with your vehicle details and preferred slot.',
    details: 'Immediate slot confirmation with SMS & WhatsApp booking token.',
    iconName: 'Calendar'
  },
  {
    number: '02',
    title: 'Vehicle Inspection',
    description: 'Initial intake with 40-point walk-around safety inspection & intake photos.',
    details: 'Covers fluid condition, tire tread depth, brake pads, and body condition.',
    iconName: 'ClipboardCheck'
  },
  {
    number: '03',
    title: 'Digital Diagnosis',
    description: 'Automated OBD scanner diagnostics and transparent electronic estimation.',
    details: 'You receive an itemized digital quotation via SMS/WhatsApp with photos.',
    iconName: 'Scan'
  },
  {
    number: '04',
    title: 'Repair & Service',
    description: 'Certified master technicians carry out work using genuine OEM components.',
    details: 'Live service bay tracking; genuine part packaging shared with client.',
    iconName: 'Wrench'
  },
  {
    number: '05',
    title: 'Quality Check',
    description: 'Senior workshop supervisor multi-point road test and final inspection checklist.',
    details: 'Rigorous torque verification, code re-scan, and road test protocol.',
    iconName: 'ShieldCheck'
  },
  {
    number: '06',
    title: 'Vehicle Handover',
    description: 'Detailed service invoice, warranty cert, and complimentary wash upon pickup.',
    details: 'Contactless digital payment, old parts display, and 6-month warranty card.',
    iconName: 'KeyRound'
  }
];

export const WHY_CHOOSE_US_ITEMS = [
  {
    id: 'pricing',
    title: 'Transparent Pricing',
    description: 'No hidden charges. Clear estimates before work begins. What we quote is strictly what you pay.',
    iconName: 'FileText',
    stat: '100% Itemized'
  },
  {
    id: 'technicians',
    title: 'Skilled Technicians',
    description: 'Experienced master professionals factory-trained to diagnose and repair modern European, Japanese, and domestic vehicles.',
    iconName: 'Award',
    stat: 'Certified Staff'
  },
  {
    id: 'diagnostics',
    title: 'Advanced Diagnostics',
    description: 'Dealer-level computerized scanning and optical calibration equipment that pinpoints errors within minutes.',
    iconName: 'Cpu',
    stat: 'OEM Level Scanners'
  },
  {
    id: 'parts',
    title: 'Genuine Quality Parts',
    description: 'Direct OEM components and high-grade consumables sourced with verifiable QR codes and manufacturer warranties.',
    iconName: 'Shield',
    stat: '100% Authentic'
  },
  {
    id: 'updates',
    title: 'Digital Service Updates',
    description: 'Customers receive real-time photo & video inspection reports on WhatsApp during every phase of work.',
    iconName: 'Smartphone',
    stat: 'Real-Time Photos'
  },
  {
    id: 'warranty',
    title: 'Service Warranty',
    description: 'Total peace of mind backed by our comprehensive 6-month or 10,000 km workshop warranty on all labor and parts.',
    iconName: 'CheckCircle2',
    stat: '6 Months / 10K km'
  }
];

export const GALLERY_PROJECTS: GalleryProject[] = [
  {
    id: 'gal-1',
    title: 'Porsche 911 Carrera S — Flat-6 Engine Overhaul & Calibration',
    carModel: 'Porsche 911 (992) Carrera S',
    category: 'Engine Work',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    aspect: 'wide',
    description: 'Complete powertrain de-carbonization, twin-turbo oil feed pipe replacements, and dyno-matched throttle synchronization.',
    workDone: ['Carbon cleaning on intake valves', 'Motul 300V Motorsport Synthetic oil service', 'Bosch direct fuel injector testing', 'Transmission dual-clutch fluid renewal']
  },
  {
    id: 'gal-2',
    title: 'BMW M4 Competition — Carbon Ceramic Brake Upgrade',
    carModel: 'BMW M4 Competition (G82)',
    category: 'Brake Service',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    aspect: 'tall',
    description: 'Track-ready carbon-ceramic rotor installation, Endless high-temp pads, and stainless braided brake lines with race fluid flush.',
    workDone: ['Rotor runout tolerance dial calibration', 'Brembo 6-piston caliper rebuilding', 'Motul RBF 660 brake fluid flush', 'Bed-in heat cycle test drive']
  },
  {
    id: 'gal-3',
    title: 'Mercedes-AMG E63s — Advanced ECU Diagnostics & Fault Isolation',
    carModel: 'Mercedes-AMG E63s 4MATIC+',
    category: 'Diagnostics',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    aspect: 'square',
    description: 'Intermittent boost pressure drop diagnosis using high-speed telemetry logger. Repaired wastegate actuator wiring harness.',
    workDone: ['CAN-bus optical signal verification', 'Turbine actuator PWM calibration', 'Wastegate solenoid replacement', 'Adaptive fuel trim reset']
  },
  {
    id: 'gal-4',
    title: 'Audi RS5 Sportback — 9H Ceramic Coating & Paint Correction',
    carModel: 'Audi RS5 Sportback',
    category: 'Detailing',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
    aspect: 'tall',
    description: '3-stage rotary paint restoration removing micro-scratches followed by dual-layer ceramic shield and hydrophobic glass protection.',
    workDone: ['Clay bar decontamination', 'Rupes Bigfoot 3-stage polishing', 'Gtechniq Crystal Serum Ultra 9H coat', 'Alloy wheel rim face ceramic heat seal']
  },
  {
    id: 'gal-5',
    title: 'Precision Climate Control Servicing on Range Rover Velar',
    carModel: 'Range Rover Velar D300',
    category: 'AC & Climate',
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    aspect: 'square',
    description: 'Dual evaporator vacuum leak repair, compressor clutch replacement, and medical-grade ultrasonic cabin deodorization.',
    workDone: ['Digital helium leak detection', 'HVAC expansion valve renewal', 'OEM cabin particulate HEPA filters', 'Ozone HVAC sterilization']
  },
  {
    id: 'gal-6',
    title: 'Clean Room Workshop Bays — TORQX Pune Facility',
    carModel: 'Workshop Interior & Lift Bays',
    category: 'Workshop Facility',
    image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&w=1200&q=80',
    aspect: 'wide',
    description: 'Our state-of-the-art facility featuring Italian hydraulic lifts, dust-free pneumatic air systems, and dedicated diagnostic stations.',
    workDone: ['Dual post electro-hydraulic hoists', 'Snap-on wireless diagnostic towers', 'Epoxy non-slip clean-room flooring', 'Eco-friendly closed oil collection']
  }
];

export const BEFORE_AFTER_ITEMS: BeforeAfterItem[] = [
  {
    id: 'ba-interior',
    title: 'Interior Ceramic Rejuvenation',
    carModel: 'Mercedes-Benz S-Class',
    description: 'From stained Nappa leather & neglected carpets to showroom-grade matte leather conditioning and sanitized fabrics.',
    beforeImg: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    beforeLabel: 'Before: Stained & Oxidized',
    afterLabel: 'After: TORQX Precision Detailed'
  },
  {
    id: 'ba-headlights',
    title: 'Optical Polycarbonate Headlight Restoration',
    carModel: 'BMW 5 Series (F10)',
    description: 'Oxidized yellowed UV haze completely wet-sanded and treated with 2K UV-cured optical lacquer for 100% light output.',
    beforeImg: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
    beforeLabel: 'Before: Cloudy & Dim',
    afterLabel: 'After: Crystal Clear 2K Restored'
  },
  {
    id: 'ba-brakes',
    title: 'Brembo Caliper & Rotor Restoration',
    carModel: 'Audi S4 Quattro',
    description: 'Corroded rotors and brake dust baked into calipers restored with zinc-coated slotted rotors and heat-cured finish.',
    beforeImg: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1200&q=80',
    afterImg: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    beforeLabel: 'Before: Corroded & Worn',
    afterLabel: 'After: Track-Spec Overhauled'
  }
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 't-1',
    name: 'Rahul M.',
    location: 'Koregaon Park, Pune',
    carModel: 'BMW 530d M-Sport',
    rating: 5,
    quote: 'Excellent service and completely transparent pricing. They diagnosed the gearbox shudder issue quickly and explained everything before starting the repair. The car now drives like it just left the showroom!',
    serviceType: 'Transmission & Periodic Service',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'
  },
  {
    id: 't-2',
    name: 'Vikramaditya S.',
    location: 'Baner, Pune',
    carModel: 'Mercedes-AMG C43',
    rating: 5,
    quote: 'Finding trusted technicians in Pune who understand AMG dynamics is tough. TORQX provided video updates of the brake caliper overhaul and rotor micrometer measurements. Unmatched professionalism and genuine parts.',
    serviceType: 'Brake Overhaul & Fluid Flush',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80'
  },
  {
    id: 't-3',
    name: 'Ananya Deshmukh',
    location: 'Aundh, Pune',
    carModel: 'Audi Q7 45 TFSI',
    rating: 5,
    quote: 'Authorized dealerships gave an estimate that was exorbitant with a 3-week waiting time. TORQX pinpointed the AC compressor solenoid issue via OBD diagnostics in 30 minutes, fixed it on the same day for half the cost.',
    serviceType: 'AC Diagnostics & Compressor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80'
  },
  {
    id: 't-4',
    name: 'Dr. Sameer Kulkarni',
    location: 'Kalyani Nagar, Pune',
    carModel: 'Porsche Macan GTS',
    rating: 5,
    quote: 'The 9H ceramic coating and interior leather care exceeded my expectations. The optical clarity of the paint under sun inspection is flawless. Their pickup and drop service was prompt and courteous.',
    serviceType: 'Ceramic Coating & Detailing',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80'
  },
  {
    id: 't-5',
    name: 'Rohan Mehta',
    location: 'Viman Nagar, Pune',
    carModel: 'Skoda Octavia vRS 245',
    rating: 5,
    quote: 'Finally a garage with genuine enthusiasm for performance cars! Clean workshop, calibrated tools, and zero nonsense upselling. Will definitely recommend them to every auto enthusiast in Pune.',
    serviceType: 'Stage 1 Inspection & Diagnostics',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=160&q=80'
  }
];

export const POPULAR_VEHICLE_BRANDS = [
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Porsche',
  'Volkswagen',
  'Skoda',
  'Volvo',
  'Land Rover / Jaguar',
  'Toyota',
  'Honda',
  'Hyundai',
  'Kia',
  'Tata Motors',
  'Mahindra',
  'Other / Exotic'
];
