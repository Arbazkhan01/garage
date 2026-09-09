import { VehicleBrand } from '../types';

export const VEHICLE_DATABASE: VehicleBrand[] = [
  // ================= ECONOMY BRANDS =================
  {
    name: 'Maruti Suzuki',
    country: 'India / Japan',
    category: 'economy',
    models: [
      {
        name: 'Swift',
        category: 'economy',
        variants: [
          { name: 'LXi 1.2L', fuelTypes: ['Petrol'], multiplier: 1.0 },
          { name: 'VXi 1.2L', fuelTypes: ['Petrol', 'CNG'], multiplier: 1.0 },
          { name: 'ZXi+ DualTone', fuelTypes: ['Petrol'], multiplier: 1.05 }
        ]
      },
      {
        name: 'Baleno',
        category: 'economy',
        variants: [
          { name: 'Sigma 1.2L', fuelTypes: ['Petrol'], multiplier: 1.0 },
          { name: 'Delta / Zeta', fuelTypes: ['Petrol', 'CNG'], multiplier: 1.03 },
          { name: 'Alpha AGS', fuelTypes: ['Petrol'], multiplier: 1.08 }
        ]
      },
      {
        name: 'Brezza',
        category: 'economy',
        variants: [
          { name: 'LXi Smart Hybrid', fuelTypes: ['Petrol'], multiplier: 1.08 },
          { name: 'ZXi 1.5L', fuelTypes: ['Petrol', 'CNG'], multiplier: 1.12 },
          { name: 'ZXi+ AT DualTone', fuelTypes: ['Petrol'], multiplier: 1.15 }
        ]
      },
      {
        name: 'Dzire',
        category: 'economy',
        variants: [
          { name: 'VXi 1.2L', fuelTypes: ['Petrol', 'CNG'], multiplier: 1.0 },
          { name: 'ZXi+ AMT', fuelTypes: ['Petrol'], multiplier: 1.05 }
        ]
      },
      {
        name: 'Ertiga',
        category: 'economy',
        variants: [
          { name: 'VXi Smart Hybrid', fuelTypes: ['Petrol', 'CNG'], multiplier: 1.1 },
          { name: 'ZXi+ Automatic', fuelTypes: ['Petrol'], multiplier: 1.15 }
        ]
      },
      {
        name: 'Fronx',
        category: 'economy',
        variants: [
          { name: 'Delta+ 1.2L', fuelTypes: ['Petrol', 'CNG'], multiplier: 1.05 },
          { name: 'Alpha 1.0L BoosterJet Turbo', fuelTypes: ['Petrol'], multiplier: 1.18 }
        ]
      }
    ]
  },
  {
    name: 'Hyundai',
    country: 'South Korea',
    category: 'economy',
    models: [
      {
        name: 'i20',
        category: 'economy',
        variants: [
          { name: 'Magna 1.2L Kappa', fuelTypes: ['Petrol'], multiplier: 1.05 },
          { name: 'Asta (O) IVT', fuelTypes: ['Petrol'], multiplier: 1.1 },
          { name: 'N Line N8 1.0 Turbo DCT', fuelTypes: ['Petrol'], multiplier: 1.25 }
        ]
      },
      {
        name: 'Creta',
        category: 'economy',
        variants: [
          { name: 'EX 1.5L MPi', fuelTypes: ['Petrol'], multiplier: 1.15 },
          { name: 'SX(O) 1.5L CRDi Diesel', fuelTypes: ['Diesel'], multiplier: 1.25 },
          { name: 'N Line 1.5L Turbo GDi 7DCT', fuelTypes: ['Petrol'], multiplier: 1.35 }
        ]
      },
      {
        name: 'Verna',
        category: 'economy',
        variants: [
          { name: 'SX 1.5L MPi', fuelTypes: ['Petrol'], multiplier: 1.15 },
          { name: 'SX(O) 1.5L Turbo GDi DCT', fuelTypes: ['Petrol'], multiplier: 1.3 }
        ]
      },
      {
        name: 'Venue',
        category: 'economy',
        variants: [
          { name: 'S(O) 1.2L', fuelTypes: ['Petrol'], multiplier: 1.08 },
          { name: 'SX 1.5L CRDi Diesel', fuelTypes: ['Diesel'], multiplier: 1.2 },
          { name: 'N Line N8 Turbo', fuelTypes: ['Petrol'], multiplier: 1.28 }
        ]
      },
      {
        name: 'Alcazar',
        category: 'economy',
        variants: [
          { name: 'Prestige 1.5 Turbo 7-Seater', fuelTypes: ['Petrol'], multiplier: 1.25 },
          { name: 'Signature (O) 1.5 CRDi AT', fuelTypes: ['Diesel'], multiplier: 1.35 }
        ]
      }
    ]
  },
  {
    name: 'Tata',
    country: 'India',
    category: 'economy',
    models: [
      {
        name: 'Nexon',
        category: 'economy',
        variants: [
          { name: 'Smart+ 1.2L Revotron Turbo', fuelTypes: ['Petrol'], multiplier: 1.1 },
          { name: 'Fearless+ S 1.5L Revotorq Diesel', fuelTypes: ['Diesel'], multiplier: 1.22 },
          { name: 'Nexon.ev Long Range', fuelTypes: ['Electric'], multiplier: 1.15 }
        ]
      },
      {
        name: 'Punch',
        category: 'economy',
        variants: [
          { name: 'Adventure 1.2L Revotron', fuelTypes: ['Petrol', 'CNG'], multiplier: 1.0 },
          { name: 'Creative Flagship iRA', fuelTypes: ['Petrol'], multiplier: 1.08 },
          { name: 'Punch.ev Empowered+', fuelTypes: ['Electric'], multiplier: 1.12 }
        ]
      },
      {
        name: 'Altroz',
        category: 'economy',
        variants: [
          { name: 'XZ 1.2L i-Turbo', fuelTypes: ['Petrol'], multiplier: 1.08 },
          { name: 'XZ Plus (S) 1.5L Diesel', fuelTypes: ['Diesel'], multiplier: 1.15 },
          { name: 'Racer R3 1.2 Turbo (120hp)', fuelTypes: ['Petrol'], multiplier: 1.2 }
        ]
      },
      {
        name: 'Harrier',
        category: 'economy',
        variants: [
          { name: 'Pure+ 2.0L Kryotec Diesel', fuelTypes: ['Diesel'], multiplier: 1.35 },
          { name: 'Fearless+ Dark Edition AT', fuelTypes: ['Diesel'], multiplier: 1.48 }
        ]
      },
      {
        name: 'Safari',
        category: 'economy',
        variants: [
          { name: 'Adventure+ 2.0L Kryotec', fuelTypes: ['Diesel'], multiplier: 1.4 },
          { name: 'Accomplished+ 6-Seater AT Dark', fuelTypes: ['Diesel'], multiplier: 1.5 }
        ]
      }
    ]
  },

  // ================= PREMIUM BRANDS =================
  {
    name: 'Toyota',
    country: 'Japan',
    category: 'premium',
    models: [
      {
        name: 'Fortuner',
        category: 'premium',
        variants: [
          { name: '4x2 2.7L Petrol AT', fuelTypes: ['Petrol'], multiplier: 1.35 },
          { name: '4x4 2.8L Diesel AT (500Nm)', fuelTypes: ['Diesel'], multiplier: 1.55 },
          { name: 'GR-Sport 4x4 High-Torque', fuelTypes: ['Diesel'], multiplier: 1.7 }
        ]
      },
      {
        name: 'Innova Crysta',
        category: 'premium',
        variants: [
          { name: 'GX 2.4L Diesel 7-Str', fuelTypes: ['Diesel'], multiplier: 1.28 },
          { name: 'ZX 2.4L Diesel Luxury Captain', fuelTypes: ['Diesel'], multiplier: 1.4 }
        ]
      },
      {
        name: 'Camry',
        category: 'premium',
        variants: [
          { name: '2.5L Hybrid Electric sedan', fuelTypes: ['Hybrid'], multiplier: 1.6 }
        ]
      }
    ]
  },
  {
    name: 'Honda',
    country: 'Japan',
    category: 'premium',
    models: [
      {
        name: 'City',
        category: 'premium',
        variants: [
          { name: 'V 1.5L i-VTEC Manual', fuelTypes: ['Petrol'], multiplier: 1.15 },
          { name: 'ZX 1.5L i-VTEC CVT', fuelTypes: ['Petrol'], multiplier: 1.25 },
          { name: 'City e:HEV Strong Hybrid ZX', fuelTypes: ['Hybrid'], multiplier: 1.45 }
        ]
      },
      {
        name: 'Elevate',
        category: 'premium',
        variants: [
          { name: 'V 1.5L i-VTEC MT', fuelTypes: ['Petrol'], multiplier: 1.18 },
          { name: 'ZX 1.5L CVT Black Edition', fuelTypes: ['Petrol'], multiplier: 1.28 }
        ]
      },
      {
        name: 'Civic',
        category: 'premium',
        variants: [
          { name: 'ZX 1.8L i-VTEC Petrol', fuelTypes: ['Petrol'], multiplier: 1.35 },
          { name: 'ZX 1.6L i-DTEC Diesel', fuelTypes: ['Diesel'], multiplier: 1.42 }
        ]
      }
    ]
  },
  {
    name: 'Volkswagen',
    country: 'Germany',
    category: 'premium',
    models: [
      {
        name: 'Virtus',
        category: 'premium',
        variants: [
          { name: 'Highline 1.0L TSI (115hp)', fuelTypes: ['Petrol'], multiplier: 1.2 },
          { name: 'GT Plus 1.5L TSI EVO DSG (150hp)', fuelTypes: ['Petrol'], multiplier: 1.4 }
        ]
      },
      {
        name: 'Taigun',
        category: 'premium',
        variants: [
          { name: 'Topline 1.0L TSI AT', fuelTypes: ['Petrol'], multiplier: 1.25 },
          { name: 'GT Edge Trail Edition 1.5L DSG', fuelTypes: ['Petrol'], multiplier: 1.42 }
        ]
      },
      {
        name: 'Tiguan',
        category: 'premium',
        variants: [
          { name: 'Elegance 2.0L TSI 4MOTION DSG', fuelTypes: ['Petrol'], multiplier: 1.7 }
        ]
      }
    ]
  },
  {
    name: 'Skoda',
    country: 'Czech Republic / Germany',
    category: 'premium',
    models: [
      {
        name: 'Slavia',
        category: 'premium',
        variants: [
          { name: 'Ambition 1.0L TSI', fuelTypes: ['Petrol'], multiplier: 1.2 },
          { name: 'Style / Monte Carlo 1.5L TSI DSG', fuelTypes: ['Petrol'], multiplier: 1.4 }
        ]
      },
      {
        name: 'Kushaq',
        category: 'premium',
        variants: [
          { name: 'Ambition 1.0L TSI', fuelTypes: ['Petrol'], multiplier: 1.22 },
          { name: 'Monte Carlo 1.5L TSI DSG', fuelTypes: ['Petrol'], multiplier: 1.42 }
        ]
      },
      {
        name: 'Kodiaq',
        category: 'premium',
        variants: [
          { name: 'Style 2.0L TSI 4x4 DSG', fuelTypes: ['Petrol'], multiplier: 1.75 },
          { name: 'L&K (Laurin & Klement) 4x4 Luxury', fuelTypes: ['Petrol'], multiplier: 1.88 }
        ]
      }
    ]
  },

  // ================= LUXURY BRANDS =================
  {
    name: 'BMW',
    country: 'Germany',
    category: 'luxury',
    models: [
      {
        name: '3 Series',
        category: 'luxury',
        variants: [
          { name: '330i Gran Limousine M Sport (258hp)', fuelTypes: ['Petrol'], multiplier: 1.8 },
          { name: '320d Gran Limousine Luxury Line', fuelTypes: ['Diesel'], multiplier: 1.85 },
          { name: 'M340i xDrive 3.0L Inline-6 (387hp)', fuelTypes: ['Petrol'], multiplier: 2.3 }
        ]
      },
      {
        name: '5 Series',
        category: 'luxury',
        variants: [
          { name: '530i M Sport', fuelTypes: ['Petrol'], multiplier: 2.1 },
          { name: '530d M Sport 3.0L 6-Cylinder Diesel', fuelTypes: ['Diesel'], multiplier: 2.35 },
          { name: '530e Plug-in Hybrid', fuelTypes: ['Hybrid'], multiplier: 2.4 }
        ]
      },
      {
        name: 'X1',
        category: 'luxury',
        variants: [
          { name: 'sDrive18i xLine (136hp)', fuelTypes: ['Petrol'], multiplier: 1.65 },
          { name: 'sDrive18d M Sport (150hp)', fuelTypes: ['Diesel'], multiplier: 1.75 }
        ]
      },
      {
        name: 'X3',
        category: 'luxury',
        variants: [
          { name: 'xDrive20d Luxury Edition', fuelTypes: ['Diesel'], multiplier: 1.95 },
          { name: 'M40i 3.0L Turbo Inline-6 (360hp)', fuelTypes: ['Petrol'], multiplier: 2.45 }
        ]
      },
      {
        name: 'X5',
        category: 'luxury',
        variants: [
          { name: 'xDrive40i M Sport 3.0L Petrol', fuelTypes: ['Petrol'], multiplier: 2.6 },
          { name: 'xDrive30d xLine 3.0L Diesel', fuelTypes: ['Diesel'], multiplier: 2.7 }
        ]
      }
    ]
  },
  {
    name: 'Mercedes-Benz',
    country: 'Germany',
    category: 'luxury',
    models: [
      {
        name: 'A-Class',
        category: 'luxury',
        variants: [
          { name: 'A200 Progressive Line', fuelTypes: ['Petrol'], multiplier: 1.6 },
          { name: 'A200d Diesel', fuelTypes: ['Diesel'], multiplier: 1.7 },
          { name: 'AMG A35 4MATIC 306hp', fuelTypes: ['Petrol'], multiplier: 2.2 }
        ]
      },
      {
        name: 'C-Class',
        category: 'luxury',
        variants: [
          { name: 'C200 Avantgarde Mild-Hybrid', fuelTypes: ['Petrol'], multiplier: 1.85 },
          { name: 'C220d Progressive Line', fuelTypes: ['Diesel'], multiplier: 1.9 },
          { name: 'C300d AMG Line (265hp)', fuelTypes: ['Diesel'], multiplier: 2.15 },
          { name: 'AMG C43 4MATIC Bi-Turbo', fuelTypes: ['Petrol'], multiplier: 2.5 }
        ]
      },
      {
        name: 'E-Class',
        category: 'luxury',
        variants: [
          { name: 'E200 Exclusive Long Wheelbase', fuelTypes: ['Petrol'], multiplier: 2.2 },
          { name: 'E220d Expression LWB', fuelTypes: ['Diesel'], multiplier: 2.3 },
          { name: 'E350d AMG Line 3.0L V6', fuelTypes: ['Diesel'], multiplier: 2.65 }
        ]
      },
      {
        name: 'GLC',
        category: 'luxury',
        variants: [
          { name: 'GLC 300 4MATIC 2.0L Turbo', fuelTypes: ['Petrol'], multiplier: 2.1 },
          { name: 'GLC 220d 4MATIC Diesel', fuelTypes: ['Diesel'], multiplier: 2.2 }
        ]
      }
    ]
  },
  {
    name: 'Audi',
    country: 'Germany',
    category: 'luxury',
    models: [
      {
        name: 'A4',
        category: 'luxury',
        variants: [
          { name: '40 TFSI Premium Plus (190hp)', fuelTypes: ['Petrol'], multiplier: 1.75 },
          { name: '40 TFSI Technology B&O Audio', fuelTypes: ['Petrol'], multiplier: 1.85 }
        ]
      },
      {
        name: 'A6',
        category: 'luxury',
        variants: [
          { name: '45 TFSI Premium Plus (245hp)', fuelTypes: ['Petrol'], multiplier: 2.1 },
          { name: '45 TFSI Technology Matrix LED', fuelTypes: ['Petrol'], multiplier: 2.25 }
        ]
      },
      {
        name: 'Q3',
        category: 'luxury',
        variants: [
          { name: '35 TFSI Premium quattro', fuelTypes: ['Petrol'], multiplier: 1.68 },
          { name: 'Sportback 40 TFSI quattro', fuelTypes: ['Petrol'], multiplier: 1.82 }
        ]
      },
      {
        name: 'Q5',
        category: 'luxury',
        variants: [
          { name: '45 TFSI quattro Technology (249hp)', fuelTypes: ['Petrol'], multiplier: 2.2 },
          { name: 'Special Edition Black Package', fuelTypes: ['Petrol'], multiplier: 2.3 }
        ]
      }
    ]
  },
  {
    name: 'Volvo',
    country: 'Sweden',
    category: 'luxury',
    models: [
      {
        name: 'XC40',
        category: 'luxury',
        variants: [
          { name: 'B4 Ultimate Mild-Hybrid (197hp)', fuelTypes: ['Petrol'], multiplier: 1.7 },
          { name: 'Recharge Twin Motor AWD Electric (408hp)', fuelTypes: ['Electric'], multiplier: 1.85 }
        ]
      },
      {
        name: 'XC60',
        category: 'luxury',
        variants: [
          { name: 'B5 Ultimate 48V Hybrid (250hp)', fuelTypes: ['Petrol'], multiplier: 2.15 }
        ]
      },
      {
        name: 'XC90',
        category: 'luxury',
        variants: [
          { name: 'B6 Ultimate 7-Seater AWD', fuelTypes: ['Petrol'], multiplier: 2.65 },
          { name: 'Recharge T8 Plug-in Hybrid (455hp)', fuelTypes: ['Hybrid'], multiplier: 2.9 }
        ]
      }
    ]
  },
  {
    name: 'Porsche',
    country: 'Germany',
    category: 'luxury',
    models: [
      {
        name: 'Macan',
        category: 'luxury',
        variants: [
          { name: '2.0L Turbo (265hp)', fuelTypes: ['Petrol'], multiplier: 2.4 },
          { name: 'Macan S 2.9L Twin-Turbo V6 (380hp)', fuelTypes: ['Petrol'], multiplier: 2.85 },
          { name: 'Macan GTS (440hp Track Spec)', fuelTypes: ['Petrol'], multiplier: 3.2 }
        ]
      },
      {
        name: 'Cayenne',
        category: 'luxury',
        variants: [
          { name: '3.0L Turbo V6 (353hp)', fuelTypes: ['Petrol'], multiplier: 3.1 },
          { name: 'Cayenne Coupe E-Hybrid (470hp)', fuelTypes: ['Hybrid'], multiplier: 3.5 },
          { name: 'Turbo GT 4.0L Twin-Turbo V8 (659hp)', fuelTypes: ['Petrol'], multiplier: 4.2 }
        ]
      },
      {
        name: '911',
        category: 'luxury',
        variants: [
          { name: 'Carrera 3.0L Twin-Turbo Flat-6 (385hp)', fuelTypes: ['Petrol'], multiplier: 3.6 },
          { name: 'Carrera S / 4S (450hp)', fuelTypes: ['Petrol'], multiplier: 4.0 },
          { name: 'GT3 RS 4.0L Naturally Aspirated (525hp)', fuelTypes: ['Petrol'], multiplier: 5.0 }
        ]
      }
    ]
  }
];
