import { ServiceItem, AddonOption, Coupon } from '../types';

export const COMPREHENSIVE_SERVICES: ServiceItem[] = [
  {
    id: 'periodic-service',
    title: 'Periodic Service',
    category: 'mechanical',
    shortDesc: 'Factory scheduled oil change, filters, fluids and 60-point safety audit.',
    detailedDesc: 'Recommended every 10,000 km or 1 year. Includes complete engine oil flush, replacement with OEM-grade fully synthetic engine oil, oil filter replacement, engine air filter cleaning/replacement, cabin AC pollen filter check, brake fluid inspection, battery health test, and comprehensive underbody torque inspection.',
    duration: '2.5 - 3.5 Hours',
    priceEstimate: 'From ₹2,999',
    iconName: 'CalendarCheck',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    basePriceEconomy: 2999,
    basePricePremium: 6499,
    basePriceLuxury: 12999,
    isInspectionDependent: false,
    features: [
      'OEM-spec fully synthetic engine oil replacement',
      'Original equipment oil filter renewal',
      'Engine air filter & AC cabin filter service',
      '60-point computerized mechanical safety audit',
      'Coolant, power steering & washer fluids top-up'
    ]
  },
  {
    id: 'general-service',
    title: 'General Service',
    category: 'mechanical',
    shortDesc: 'Comprehensive mechanical checkup, spark plugs, belt tension, and fluid flushing.',
    detailedDesc: 'Full intermediate inspection including throttle body cleaning, spark plug inspection/cleaning, brake caliper slide lubrication, auxiliary belt tension check, radiator fan operation, and full chassis lubrication.',
    duration: '3 - 4 Hours',
    priceEstimate: 'From ₹3,499',
    iconName: 'Wrench',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80',
    basePriceEconomy: 3499,
    basePricePremium: 7499,
    basePriceLuxury: 14499,
    isInspectionDependent: false,
    features: [
      'Electronic throttle body cleaning & calibration',
      'Spark plug health inspection / laser gap setting',
      'Serpentine belt tension & bearing acoustic check',
      'Chassis point lubrication & propeller shaft grease'
    ]
  },
  {
    id: 'engine-oil-change',
    title: 'Engine Oil Change',
    category: 'mechanical',
    shortDesc: 'Premium synthetic oil flush with new genuine OEM oil filter cartridge.',
    detailedDesc: 'High-grade fully synthetic motor oil (0W-20, 5W-30, 5W-40 based on manufacturer specification: Castrol Edge, Mobil 1, or Motul 8100) with magnetic drain plug check and washer gasket replacement.',
    duration: '45 - 60 Mins',
    priceEstimate: 'From ₹1,899',
    iconName: 'Droplets',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    basePriceEconomy: 1899,
    basePricePremium: 4299,
    basePriceLuxury: 8999,
    isInspectionDependent: false,
    features: [
      'Grade-specific OEM synthetic oil drain & refill',
      'New OEM cartridge/spin-on oil filter',
      'Crush washer gasket replacement',
      'Digital service interval computer reset'
    ]
  },
  {
    id: 'brake-service',
    title: 'Brake Service',
    category: 'mechanical',
    shortDesc: 'Brake inspection, caliper slide pin lubrication, rotor disc runout check.',
    detailedDesc: 'Complete 4-wheel brake inspection. Caliper pins cleaned and lubricated with ceramic high-temperature grease, rotor discs checked for lateral runout and minimum thickness tolerance using digital micrometers, and high-pressure brake dust extraction.',
    duration: '1.5 - 2 Hours',
    priceEstimate: 'From ₹1,499',
    iconName: 'Disc',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
    basePriceEconomy: 1499,
    basePricePremium: 3499,
    basePriceLuxury: 7499,
    isInspectionDependent: false,
    features: [
      '4-Wheel brake drum/disc disassembly & cleaning',
      'Caliper slide pin synthetic lubrication',
      'Micrometer rotor thickness & runout measurement',
      'Brake fluid boiling point moisture test'
    ]
  },
  {
    id: 'brake-pad-replacement',
    title: 'Brake Pad Replacement',
    category: 'mechanical',
    shortDesc: 'Genuine Brembo, ATE or OEM brake pad installation with hardware clips.',
    detailedDesc: 'Replacement of front or rear friction pads with ceramic or semi-metallic OEM pads. Includes electronic parking brake caliper decompression, anti-rattle hardware clips, and disc bedding procedure.',
    duration: '1.5 - 2.5 Hours',
    priceEstimate: 'From ₹2,499',
    iconName: 'ShieldAlert',
    image: 'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?auto=format&fit=crop&w=800&q=80',
    basePriceEconomy: 2499,
    basePricePremium: 5999,
    basePriceLuxury: 13999,
    isInspectionDependent: true,
    features: [
      'OEM low-dust ceramic brake pads fitted',
      'New anti-squeal shims and hardware clips',
      'Electronic parking brake caliper adaptation',
      'Post-install bed-in road test'
    ]
  },
  {
    id: 'ac-service',
    title: 'AC Service & Deep Clean',
    category: 'mechanical',
    shortDesc: 'Cooling coil high-pressure wash, condenser flushing, blower cleaning.',
    detailedDesc: 'Restores crisp, hygienic air conditioning. Includes evaporator cooling coil ultrasound wash, condenser fins pressure wash, blower motor cleaning, cabin disinfectant treatment, and AC belt tension check.',
    duration: '2 - 3 Hours',
    priceEstimate: 'From ₹1,999',
    iconName: 'Wind',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    basePriceEconomy: 1999,
    basePricePremium: 4499,
    basePriceLuxury: 9499,
    isInspectionDependent: false,
    features: [
      'Evaporator coil antimicrobial ultrasonic foam wash',
      'Condenser coil debris blast & fin straightening',
      'Blower fan disassembly and dust extraction',
      'Vent temperature drop benchmark audit'
    ]
  },
  {
    id: 'ac-gas-refill',
    title: 'AC Gas Refill & Vacuum Leak Test',
    category: 'mechanical',
    shortDesc: 'Automatic machine vacuum leak test, compressor PAG oil injection & R134a/R1234yf refrigerant recharge.',
    detailedDesc: 'Precision computerized refrigerant recovery, 20-minute nitrogen/vacuum decay leak test, fresh UV leak dye, synthetic PAG compressor lubricant injection, and pure gram-precise refrigerant charge.',
    duration: '1 - 1.5 Hours',
    priceEstimate: 'From ₹1,799',
    iconName: 'Gauge',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    basePriceEconomy: 1799,
    basePricePremium: 3899,
    basePriceLuxury: 7999,
    isInspectionDependent: false,
    features: [
      'Automated Robinair vacuum recovery cycle',
      '20-Minute pressure holding leak diagnosis',
      'PAG 46 / PAG 100 compressor synthetic oil inject',
      'Gram-accurate R134a/R1234yf charge'
    ]
  },
  {
    id: 'wheel-alignment',
    title: '3D Wheel Alignment',
    category: 'mechanical',
    shortDesc: 'High-definition 3D camera alignment for Camber, Caster, and Toe angles.',
    detailedDesc: 'Corrects steering pulling, uneven tire shoulder wear, and vehicle wander using calibrated Hunter 3D imaging sensors. Includes steering wheel leveling and electric power steering angle sensor calibration.',
    duration: '45 - 60 Mins',
    priceEstimate: 'From ₹499',
    iconName: 'Compass',
    image: 'https://images.unsplash.com/photo-1574769002242-990e6dc23974?auto=format&fit=crop&w=800&q=80',
    basePriceEconomy: 499,
    basePricePremium: 999,
    basePriceLuxury: 2199,
    isInspectionDependent: false,
    features: [
      'Hunter 3D multi-camera laser target calibration',
      'Front & rear Toe, Camber, Caster adjustments',
      'Electronic Steering Angle Sensor (SAS) reset',
      'Color before/after alignment report printout'
    ]
  },
  {
    id: 'wheel-balancing',
    title: 'Wheel Balancing & Rotation',
    category: 'mechanical',
    shortDesc: 'Dynamic high-speed computer balancing with adhesive/clip-on zinc counterweights.',
    detailedDesc: 'Eliminates steering vibrations at 80-120 km/h. All four wheels removed, rim runout inspected, and dynamically balanced on digital spin balancers with zinc-coated adhesive weights. Includes tire rotation.',
    duration: '45 - 60 Mins',
    priceEstimate: 'From ₹599',
    iconName: 'LifeBuoy',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
    basePriceEconomy: 599,
    basePricePremium: 1199,
    basePriceLuxury: 2499,
    isInspectionDependent: false,
    features: [
      'High-speed digital spin balancing (4 wheels)',
      'Adhesive low-profile wheel weights',
      '4-wheel directional tire rotation',
      'Tire tread depth micrometer audit'
    ]
  },
  {
    id: 'battery-replacement',
    title: 'Battery Replacement & Testing',
    category: 'mechanical',
    shortDesc: 'Digital CCA conductance test, alternator charging test, and Exide/Amaron OEM battery replacement.',
    detailedDesc: 'Comprehensive test of starter draw and alternator diode ripple. If required, installation of fresh zero-maintenance or AGM/EFB start-stop battery with memory saver to prevent ECU code loss, plus battery terminal grease.',
    duration: '30 - 45 Mins',
    priceEstimate: 'From ₹3,499',
    iconName: 'Zap',
    image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=800&q=80',
    basePriceEconomy: 3499,
    basePricePremium: 7999,
    basePriceLuxury: 18999,
    isInspectionDependent: true,
    features: [
      'Midtronics CCA cranking ampere test',
      'Alternator ripple & load charging test',
      'OBD memory saver preserves radio/seat profiles',
      'Exide/Amaron/Varta AGM battery options'
    ]
  },
  {
    id: 'computer-diagnostics',
    title: 'Computer Diagnostics (OBD-II)',
    category: 'diagnostics',
    shortDesc: 'OEM-level ECU scan, live sensor stream telemetry, fault code clearing, and report.',
    detailedDesc: 'Deep dealer-level scanning of all modules: Engine Control (ECU), Transmission (TCU), Airbag (SRS), Anti-lock Brakes (ABS), Body Control (BCM). Live parameter monitoring (fuel trim, boost pressure, DPF soot load).',
    duration: '45 - 90 Mins',
    priceEstimate: 'From ₹999',
    iconName: 'Cpu',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    basePriceEconomy: 999,
    basePricePremium: 2499,
    basePriceLuxury: 4999,
    isInspectionDependent: false,
    features: [
      'Autel / Bosch dealer-grade multi-protocol scanner',
      'Full vehicle module health scan',
      'Real-time live sensor telemetry log',
      'Itemized Diagnostic Trouble Code (DTC) printout'
    ]
  },
  {
    id: 'suspension-inspection',
    title: 'Suspension & Steering Overhaul',
    category: 'mechanical',
    shortDesc: 'Strut dampening test, lower control arm bushes, ball joints, and tie rods inspection.',
    detailedDesc: 'Underbody chassis test for clunks, rattles, or loose handling. Examines shock absorber hydraulic seal weeping, stabilizer bar links, subframe rubber bushes, rack-and-pinion play, and wheel bearing rumble.',
    duration: '1.5 - 2 Hours',
    priceEstimate: 'From ₹1,299',
    iconName: 'Activity',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    basePriceEconomy: 1299,
    basePricePremium: 2999,
    basePriceLuxury: 6499,
    isInspectionDependent: true,
    features: [
      'Two-post hydraulic lift underbody audit',
      'Pry-bar play check on lower arm & subframe bushes',
      'Strut dust boot & hydraulic leak check',
      'Drive-shaft CV joint boot tear check'
    ]
  },
  {
    id: 'full-vehicle-inspection',
    title: 'Full Vehicle 80-Point Inspection',
    category: 'diagnostics',
    shortDesc: 'Comprehensive pre-purchase or long-drive certification with digital photo report.',
    detailedDesc: 'Exhaustive bumper-to-bumper digital evaluation covering mechanical, electrical, braking, body paint thickness micrometer test (accident detection), tire health, cooling system, and full road test.',
    duration: '2 - 3 Hours',
    priceEstimate: 'From ₹1,499',
    iconName: 'CheckCircle2',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    basePriceEconomy: 1499,
    basePricePremium: 3499,
    basePriceLuxury: 7499,
    isInspectionDependent: false,
    features: [
      '80-Point digital safety & mechanical certification',
      'Paint depth gauge micrometer test (panel repaint check)',
      'Underbody frame collision inspection',
      'Downloadable PDF inspection report with photos'
    ]
  },
  {
    id: 'interior-detailing',
    title: 'Interior Spa & Deep Detailing',
    category: 'detailing',
    shortDesc: 'Dry-steam seat shampoo, leather conditioning, dashboard dressing, and ozone odor elimination.',
    detailedDesc: 'Complete revitalization of cabin surfaces. Hot dry-steam extraction on fabric upholstery/carpets, pH-neutral luxury leather cleaning and balm replenishment, roof liner stain removal, and AC ozone sterilization.',
    duration: '4 - 6 Hours',
    priceEstimate: 'From ₹2,199',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80',
    basePriceEconomy: 2199,
    basePricePremium: 4999,
    basePriceLuxury: 9999,
    isInspectionDependent: false,
    features: [
      'High-temperature dry steam carpet & seat extraction',
      'pH-balanced German leather balm conditioning',
      'Anti-static UV matte dashboard & console dressing',
      'Medical-grade ozone cabin sterilization'
    ]
  },
  {
    id: 'exterior-detailing',
    title: 'Exterior Paint Correction & Polish',
    category: 'detailing',
    shortDesc: 'Decontamination clay bar, dual-action rotary compounding, and mirror glaze sealant.',
    detailedDesc: 'Restores brilliant showroom gloss. Chemical iron fallout wash, clay bar surface decontamination, two-stage rotary compounding with Rupes / Menzerna polish to eliminate 85%+ of swirl marks and light scratches.',
    duration: '5 - 7 Hours',
    priceEstimate: 'From ₹2,799',
    iconName: 'Sparkle',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
    basePriceEconomy: 2799,
    basePricePremium: 5999,
    basePriceLuxury: 12999,
    isInspectionDependent: false,
    features: [
      'Iron fallout & tar chemical decontamination',
      'Fine clay bar decontamination treatment',
      '2-Stage Rupes dual-action machine polish',
      'Hydrophobic synthetic carnauba paint sealant'
    ]
  },
  {
    id: 'ceramic-coating',
    title: '9H Ceramic Coating (3 Years)',
    category: 'detailing',
    shortDesc: 'Certified 9H SiO2 ceramic shielding on paint, wheels, chrome, and glass with warranty.',
    detailedDesc: 'Ultimate high-gloss chemical and UV armor. Two layers of Japanese 9H ceramic quartz crystal coating baked with infrared curing lamps. Repels bird droppings, acid rain, swirl marks, and intense sunlight.',
    duration: '24 - 48 Hours',
    priceEstimate: 'From ₹11,999',
    iconName: 'ShieldCheck',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    basePriceEconomy: 11999,
    basePricePremium: 22999,
    basePriceLuxury: 38999,
    isInspectionDependent: true,
    features: [
      '3-Stage jewel cut paint correction prep',
      'Double layer 9H hardness quartz ceramic application',
      'Infrared bake lamps thermal curing process',
      '3-Year documented workshop warranty card'
    ]
  },
  {
    id: 'headlight-restoration',
    title: 'Optical Headlight Restoration',
    category: 'detailing',
    shortDesc: 'Multi-stage wet sanding, polycarbonate vapor polymer coating, and anti-UV hard coat.',
    detailedDesc: 'Transforms foggy, yellowed, hazy polycarbonate headlight lenses back to crystal optical clarity. Restores 40%+ nighttime light projection output and includes a 1-year anti-yellowing guarantee.',
    duration: '1.5 - 2 Hours',
    priceEstimate: 'From ₹1,199',
    iconName: 'Sun',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    basePriceEconomy: 1199,
    basePricePremium: 1999,
    basePriceLuxury: 3499,
    isInspectionDependent: false,
    features: [
      '4-Step 800 to 3000 grit wet sanding',
      'Polycarbonate vapor chemical polymerization',
      'UV-blocking ceramic lens clear seal',
      'Lumen output before & after optical lux test'
    ]
  }
];

export const ADDON_OPTIONS: AddonOption[] = [
  {
    id: 'oil-upgrade',
    title: 'Performance Synthetic Oil Upgrade',
    description: 'Upgrade from standard synthetic to Motul 300V / Mobil 1 ESP High-Performance formula for maximum thermal stability.',
    category: 'engine',
    priceEconomy: 850,
    pricePremium: 1750,
    priceLuxury: 3500,
    duration: '15 Mins'
  },
  {
    id: 'ac-disinfecting',
    title: 'AC Duct Disinfection & Ozone Treatment',
    description: 'Eliminates mold, mildew, tobacco odor, and bacteria in HVAC vents using hospital-grade dry ozone.',
    category: 'climate',
    priceEconomy: 499,
    pricePremium: 899,
    priceLuxury: 1499,
    duration: '30 Mins'
  },
  {
    id: 'wheel-alignment-addon',
    title: 'Computerized 3D Wheel Alignment Add-on',
    description: 'Pair your routine service with calibrated computerized steering and suspension alignment.',
    category: 'wheels',
    priceEconomy: 450,
    pricePremium: 850,
    priceLuxury: 1800,
    duration: '40 Mins'
  },
  {
    id: 'interior-deep-cleaning',
    title: 'Cabin Foam & Leather Moisturizing Add-on',
    description: 'Deep antimicrobial foam wash for all door pads, dash crevices, and leather balm nourishment.',
    category: 'cleaning',
    priceEconomy: 799,
    pricePremium: 1599,
    priceLuxury: 2999,
    duration: '60 Mins'
  },
  {
    id: 'exterior-foam-wash',
    title: 'Snow Foam Wash & High-Gloss Spray Sealant',
    description: 'pH-neutral dual bucket hand wash, micro-fiber dry, wheel de-greasing, and ceramic spray buff.',
    category: 'cleaning',
    priceEconomy: 399,
    pricePremium: 699,
    priceLuxury: 1299,
    duration: '45 Mins'
  },
  {
    id: 'brake-inspection-addon',
    title: 'Precision 4-Wheel Brake Caliper Micrometer Audit',
    description: 'Measure disc thickness, pad taper wear, brake fluid moisture percentage, and caliper boot health.',
    category: 'safety',
    priceEconomy: 350,
    pricePremium: 650,
    priceLuxury: 1200,
    duration: '30 Mins'
  },
  {
    id: 'battery-health-addon',
    title: 'Battery Cranking & Alternator Health Certificate',
    description: 'Digital computerized cold-cranking ampere test, state-of-health graph, and terminal anti-corrosion spray.',
    category: 'safety',
    priceEconomy: 299,
    pricePremium: 499,
    priceLuxury: 999,
    duration: '20 Mins'
  },
  {
    id: 'engine-bay-dressing',
    title: 'Engine Bay Steam Degrease & Dressing',
    description: 'Low-moisture electrical-safe dry steam wash and silicone-free matte protective coating on plastic housings.',
    category: 'cleaning',
    priceEconomy: 550,
    pricePremium: 950,
    priceLuxury: 1850,
    duration: '30 Mins'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'TORQX10',
    description: '10% Discount on all periodic services and mechanical overhauls',
    discountType: 'percentage',
    value: 10,
    minOrder: 2500,
    maxDiscount: 2000,
    validUntil: '2026-12-31',
    active: true
  },
  {
    code: 'FIRSTSERVICE',
    description: 'Flat ₹500 welcome discount for new customers in Pune',
    discountType: 'flat',
    value: 500,
    minOrder: 2000,
    validUntil: '2026-12-31',
    active: true
  },
  {
    code: 'WEEKEND',
    description: '15% Special weekend bay allocation discount',
    discountType: 'percentage',
    value: 15,
    minOrder: 4000,
    maxDiscount: 3500,
    validUntil: '2026-12-31',
    active: true
  },
  {
    code: 'GERMANSPEC',
    description: 'Flat ₹1,500 off for BMW, Mercedes, Audi & Porsche comprehensive bookings',
    discountType: 'flat',
    value: 1500,
    minOrder: 10000,
    validUntil: '2026-12-31',
    active: true
  }
];

export const PICKUP_DROP_PRICES = {
  garage_drop: 0,
  pickup_only: 299,
  pickup_and_drop: 499
};
