export interface ServiceItem {
  id: string;
  title: string;
  category: 'all' | 'mechanical' | 'diagnostics' | 'detailing';
  shortDesc: string;
  detailedDesc: string;
  duration: string;
  priceEstimate: string;
  iconName: string;
  image: string;
  features: string[];
}

export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
}

export interface GalleryProject {
  id: string;
  title: string;
  carModel: string;
  category: string;
  image: string;
  aspect: 'square' | 'wide' | 'tall';
  description: string;
  workDone: string[];
}

export interface BeforeAfterItem {
  id: string;
  title: string;
  carModel: string;
  description: string;
  beforeImg: string;
  afterImg: string;
  beforeLabel: string;
  afterLabel: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  carModel: string;
  rating: number;
  quote: string;
  serviceType: string;
  avatar: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  details: string;
  iconName: string;
}

export interface BookingFormData {
  fullName: string;
  phone: string;
  vehicleBrand: string;
  vehicleModel: string;
  serviceRequired: string;
  preferredDate: string;
  preferredTime: string;
  additionalNotes: string;
}
