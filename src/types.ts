export type VehicleCategory = 'economy' | 'premium' | 'luxury';
export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric' | 'CNG';

export interface VehicleVariant {
  name: string;
  fuelTypes: FuelType[];
  engineSize?: string;
  multiplier: number; // e.g. 1.0 for base, 1.15 for higher trim/performance
}

export interface VehicleModel {
  name: string;
  category: VehicleCategory;
  image?: string;
  variants: VehicleVariant[];
}

export interface VehicleBrand {
  name: string;
  country: string;
  category: VehicleCategory;
  logo?: string;
  models: VehicleModel[];
}

export interface CustomerVehicle {
  id: string;
  userId: string;
  regNumber: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  fuelType: FuelType;
  currentKm: number;
  vin?: string;
  lastServiceDate?: string;
  nextServiceDueKm?: number;
  nextServiceDueDate?: string;
  insuranceExpiry?: string;
  pucExpiry?: string;
  createdAt: string;
}

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
  basePriceEconomy?: number;
  basePricePremium?: number;
  basePriceLuxury?: number;
  isInspectionDependent?: boolean;
}

export interface AddonOption {
  id: string;
  title: string;
  description: string;
  category: 'engine' | 'climate' | 'wheels' | 'cleaning' | 'safety' | 'convenience';
  priceEconomy: number;
  pricePremium: number;
  priceLuxury: number;
  duration?: string;
}

export type ServiceLifecycleStatus =
  | 'BOOKING_CONFIRMED'
  | 'VEHICLE_RECEIVED'
  | 'INSPECTION'
  | 'DIAGNOSIS'
  | 'QUOTE_PENDING'
  | 'APPROVAL_PENDING'
  | 'PARTS_RESERVED'
  | 'WORK_IN_PROGRESS'
  | 'QUALITY_CHECK'
  | 'READY_FOR_DELIVERY'
  | 'OUT_FOR_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED';

export type ServiceStatus =
  | ServiceLifecycleStatus
  | 'booking_confirmed'
  | 'vehicle_received'
  | 'inspection'
  | 'diagnosis'
  | 'quote_sent'
  | 'quote_approved'
  | 'quote_pending'
  | 'approval_pending'
  | 'parts_reserved'
  | 'work_in_progress'
  | 'quality_check'
  | 'ready_for_pickup'
  | 'ready_for_delivery'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';

export interface PriceBreakdown {
  serviceBasePrice: number;
  partsEstimate: number;
  labourCharges: number;
  addonsTotal: number;
  pickupDropFee: number;
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  gstAmount: number; // 18%
  grandTotal: number;
  isInspectionSubject?: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress?: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleVariant: string;
  vehicleRegNumber?: string;
  fuelType: FuelType;
  serviceId: string;
  serviceName: string;
  addonIds: string[];
  serviceDate: string;
  serviceTime: string;
  pickupDrop: 'garage_drop' | 'pickup_only' | 'pickup_and_drop';
  pickupAddress?: string;
  additionalNotes?: string;
  status: ServiceStatus;
  jobCardId?: string;
  jobCardNumber?: string;
  technicianId?: string;
  bayNumber?: string;
  deliveryType?: 'workshop_pickup' | 'doorstep_delivery';
  deliveryTimestamp?: string;
  driverName?: string;
  priceBreakdown: PriceBreakdown;
  createdAt: string;
  updatedAt: string;
  estimatedCompletion?: string;
}

export type HealthStatus = 'GOOD' | 'ATTENTION' | 'URGENT' | 'CRITICAL';

export interface InspectionItem {
  id: string;
  name: string;
  status: HealthStatus;
  notes?: string;
  measurement?: string; // e.g. "6.5 mm", "12.6V"
}

export interface InspectionCategory {
  title: string;
  icon: string;
  items: InspectionItem[];
}

export interface InspectionReport {
  id: string;
  bookingId: string;
  technicianId: string;
  technicianName: string;
  vehicleReg: string;
  vehicleName: string;
  odometer: number;
  date: string;
  categories: {
    engine: InspectionCategory;
    brakes: InspectionCategory;
    tyres: InspectionCategory;
    battery: InspectionCategory;
    suspension: InspectionCategory;
    ac: InspectionCategory;
  };
  overallHealthScore: number; // 0-100
  technicianNotes: string;
  recommendations: string[];
}

export interface QuotationItem {
  id: string;
  name: string;
  type: 'parts' | 'labour' | 'addon';
  cost: number;
}

export interface Quotation {
  id: string;
  bookingId: string;
  quotationNumber: string;
  date: string;
  items: QuotationItem[];
  subtotal: number;
  gst: number;
  total: number;
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  customerNotes?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  jobCardId?: string;
  jobCardNumber?: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress?: string;
  vehicleDetails: string;
  vehicleReg?: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  gst: number;
  cgst?: number;
  sgst?: number;
  gstin?: string;
  sacCode?: string;
  total: number;
  paidAmount?: number;
  remainingAmount?: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_paid' | 'PARTIALLY_PAID' | 'PAID' | 'PENDING';
  paymentMethod?: 'UPI' | 'Card' | 'Net Banking' | 'Razorpay' | 'Cash at Counter';
  transactionId?: string;
  paidAt?: string;
}

export interface Technician {
  id: string;
  name: string;
  role: string;
  specialization: string;
  experienceYears: number;
  activeJobs: number;
  completedJobs: number;
  rating: number;
  phone: string;
  avatar: string;
  status: 'available' | 'busy' | 'off_duty';
}

export interface ServiceBay {
  id: string;
  name: string;
  type: 'Mechanical' | 'Diagnostics' | 'Detailing' | 'Wheel Bay' | 'Inspection Lift';
  status: 'empty' | 'occupied' | 'maintenance';
  currentBookingId?: string;
  vehicleModel?: string;
  technicianName?: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'flat';
  value: number; // percentage (e.g. 10 for 10%) or flat INR (e.g. 500)
  minOrder: number;
  maxDiscount?: number;
  validUntil: string;
  applicableServices?: string[];
  active: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'reminder';
  read: boolean;
  createdAt: string;
  link?: string;
}

export type UserRole = 'customer' | 'admin' | 'technician';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string;
  avatar?: string;
  memberSince: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  location: string;
  carModel: string;
  rating: number;
  quote: string;
  serviceType: string;
  avatar: string;
  approved: boolean;
  date: string;
}

export interface ActiveOffer {
  id: string;
  title: string;
  description: string;
  discountText: string;
  code: string;
  validUntil: string;
  applicableBrands: string[];
}

// Preserve existing UI types
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

export type JobStatus =
  | 'OPEN'
  | 'BOOKING_CONFIRMED'
  | 'VEHICLE_RECEIVED'
  | 'INSPECTION'
  | 'DIAGNOSIS'
  | 'QUOTE_PENDING'
  | 'APPROVAL_PENDING'
  | 'PARTS_RESERVED'
  | 'WORK_IN_PROGRESS'
  | 'QUALITY_CHECK'
  | 'READY_FOR_DELIVERY'
  | 'OUT_FOR_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED';

export type QCItemStatus = 'PASS' | 'FAIL' | 'NOT_CHECKED';

export interface QualityCheckAudit {
  id: string;
  jobCardId: string;
  inspectorName: string;
  items: {
    engine: QCItemStatus;
    brakes: QCItemStatus;
    tyres: QCItemStatus;
    lights: QCItemStatus;
    ac: QCItemStatus;
    fluidLevels: QCItemStatus;
    electrical: QCItemStatus;
    exterior: QCItemStatus;
    interior: QCItemStatus;
    roadTest: QCItemStatus;
  };
  overallStatus: 'PASS' | 'FAIL';
  failureReasons?: string[];
  notes?: string;
  timestamp: string;
}

export type PartRequestStatus = 'REQUESTED' | 'APPROVED' | 'RESERVED' | 'ISSUED' | 'REJECTED';

export interface PartRequest {
  id: string;
  jobCardId: string;
  technicianId: string;
  technicianName: string;
  partId: string;
  partName: string;
  partNumber: string;
  quantity: number;
  status: PartRequestStatus;
  requestedAt: string;
  resolvedAt?: string;
  notes?: string;
}

export interface ServiceHistoryRecord {
  id: string;
  vehicleId?: string;
  vehicleReg: string;
  vehicleName: string;
  customerName: string;
  customerEmail: string;
  date: string;
  odometer: number;
  serviceType: string;
  partsUsed: string[];
  partsCost: number;
  labourCost: number;
  totalCost: number;
  technicianName: string;
  jobCardNumber: string;
  invoiceNumber: string;
  notes?: string;
}

export interface JobCardPartItem {
  id: string;
  inventoryPartId?: string;
  name: string;
  partNumber?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface JobCardLabourItem {
  id: string;
  description: string;
  hours: number;
  ratePerHour: number;
  total: number;
}

export interface JobCardAdditionalWorkItem {
  id: string;
  description: string;
  partsCost: number;
  labourCost: number;
  gst: number;
  total: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  respondedAt?: string;
}

export interface JobCard {
  id: string;
  jobCardNumber: string;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress?: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleVariant: string;
  vehicleRegNumber: string;
  serviceAdvisor: string;
  assignedTechnicianId: string;
  assignedTechnicianName: string;
  serviceBay: string;
  checkInDate: string;
  expectedDeliveryDate: string;
  currentKm: number;
  customerComplaint: string;
  technicianDiagnosis: string;
  workRequired: string[];
  partsRequired: JobCardPartItem[];
  labour: JobCardLabourItem[];
  additionalWork: JobCardAdditionalWorkItem[];
  inspectionId?: string;
  quotationId?: string;
  invoiceId?: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_REQUIRED';
  paymentStatus: 'PENDING' | 'PAID' | 'PARTIAL';
  jobStatus: JobStatus;
  notes: string[];
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InventoryPart {
  id: string;
  name: string;
  partNumber: string;
  brand: string;
  category: string;
  compatibleVehicles: string[];
  supplier: string;
  purchasePrice: number;
  sellingPrice: number;
  gst: number;
  stockQuantity: number;
  reservedQuantity: number;
  minStock: number;
  warehouseLocation: string;
  createdAt: string;
}

export type PickupDropStatus =
  | 'REQUESTED'
  | 'DRIVER_ASSIGNED'
  | 'DRIVER_EN_ROUTE'
  | 'VEHICLE_PICKED_UP'
  | 'AT_WORKSHOP'
  | 'READY_FOR_DROP'
  | 'DELIVERED';

export interface PickupDropRequest {
  id: string;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  vehicleInfo: string;
  pickupAddress: string;
  dropAddress: string;
  driverName?: string;
  driverPhone?: string;
  date: string;
  time: string;
  status: PickupDropStatus;
  notes?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  previousValue?: string;
  newValue?: string;
  details?: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  category: VehicleCategory | 'all';
  description: string;
  services: string[];
  partsIncluded: string[];
  originalPrice: number;
  packagePrice: number;
  savings: number;
  popular?: boolean;
}

export interface PricingRule {
  id: string;
  brand: string;
  model: string;
  variant: string;
  fuelType: string;
  serviceId: string;
  basePrice: number;
  labourPrice: number;
  partsEstimate: number;
  multiplier: number;
  gst: number;
  inspectionRequired: boolean;
  active: boolean;
}

