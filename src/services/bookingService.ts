import { Booking, ServiceStatus, InspectionReport, Quotation, ServiceBay } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { COMPREHENSIVE_SERVICES } from '../data/pricingData';
import { PricingService } from './pricingService';

export class BookingService {
  public static getAllBookings(): Booking[] {
    return StorageService.get<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  }

  public static getUserBookings(userId: string): Booking[] {
    const all = this.getAllBookings();
    return all.filter((b) => b.userId === userId);
  }

  public static getBookingById(id: string): Booking | undefined {
    const all = this.getAllBookings();
    return all.find((b) => b.id.toLowerCase() === id.toLowerCase());
  }

  /**
   * Capacity & Bay Management to prevent overbooking
   */
  public static getBayCapacity(date: string, timeSlot: string): {
    totalBays: number;
    bookedCount: number;
    availableCount: number;
    isFull: boolean;
    availableBayNames: string[];
  } {
    const bays = StorageService.get<ServiceBay[]>(STORAGE_KEYS.BAYS, []);
    const totalBays = bays.length > 0 ? bays.length : 6;
    const allBookings = this.getAllBookings();

    // Active bookings occupying bays for this date & slot
    const slotBookings = allBookings.filter(
      (b) =>
        b.serviceDate === date &&
        b.serviceTime === timeSlot &&
        b.status !== 'completed' &&
        b.status !== 'cancelled'
    );

    const bookedBayNames = new Set(slotBookings.map((b) => b.bayNumber).filter(Boolean));
    const allBayNames = bays.length > 0 ? bays.map((b) => b.name) : ['Bay 01', 'Bay 02', 'Bay 03', 'Bay 04', 'Bay 05', 'Bay 06'];
    const availableBayNames = allBayNames.filter((name) => !bookedBayNames.has(name));

    const bookedCount = slotBookings.length;
    const availableCount = Math.max(0, totalBays - bookedCount);

    return {
      totalBays,
      bookedCount,
      availableCount,
      isFull: availableCount === 0,
      availableBayNames
    };
  }

  public static getSlotAvailabilityForDate(date: string, timeSlots: string[]): Record<string, { availableCount: number; isFull: boolean }> {
    const result: Record<string, { availableCount: number; isFull: boolean }> = {};
    for (const slot of timeSlots) {
      const cap = this.getBayCapacity(date, slot);
      result[slot] = {
        availableCount: cap.availableCount,
        isFull: cap.isFull
      };
    }
    return result;
  }

  public static createBooking(params: {
    userId?: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    customerAddress?: string;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleVariant?: string;
    vehicleRegNumber?: string;
    fuelType?: any;
    serviceId: string;
    addonIds?: string[];
    serviceDate: string;
    serviceTime: string;
    pickupDrop?: 'garage_drop' | 'pickup_only' | 'pickup_and_drop';
    pickupAddress?: string;
    additionalNotes?: string;
    couponCode?: string;
  }): Booking {
    const all = this.getAllBookings();

    // Enforce Bay Capacity Check to prevent overbooking
    const capacity = this.getBayCapacity(params.serviceDate, params.serviceTime);
    if (capacity.isFull) {
      throw new Error(`Workshop bay capacity reached for ${params.serviceDate} at ${params.serviceTime}. Please select another time slot.`);
    }

    const assignedBay = capacity.availableBayNames[0] || 'Bay 01';

    // Generate unique ID
    const randomNum = Math.floor(100 + Math.random() * 900);
    const bookingId = `TORQX-2026-00${randomNum}`;

    const service = COMPREHENSIVE_SERVICES.find((s) => s.id === params.serviceId) || COMPREHENSIVE_SERVICES[0];

    const priceBreakdown = PricingService.calculatePricing({
      brandName: params.vehicleBrand,
      modelName: params.vehicleModel,
      variantName: params.vehicleVariant || 'Standard',
      serviceId: params.serviceId,
      addonIds: params.addonIds,
      pickupDrop: params.pickupDrop,
      couponCode: params.couponCode
    });

    const newBooking: Booking = {
      id: bookingId,
      userId: params.userId || 'user-vikram',
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      customerEmail: params.customerEmail || `${params.customerName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      customerAddress: params.customerAddress,
      vehicleBrand: params.vehicleBrand,
      vehicleModel: params.vehicleModel,
      vehicleVariant: params.vehicleVariant || 'Standard',
      vehicleRegNumber: params.vehicleRegNumber || 'MH 12 TC 0099',
      fuelType: params.fuelType || 'Petrol',
      serviceId: service.id,
      serviceName: service.title,
      addonIds: params.addonIds || [],
      serviceDate: params.serviceDate,
      serviceTime: params.serviceTime,
      pickupDrop: params.pickupDrop || 'garage_drop',
      pickupAddress: params.pickupAddress,
      additionalNotes: params.additionalNotes,
      status: 'booking_confirmed',
      technicianId: 'tech-1', // Default lead
      bayNumber: assignedBay,
      priceBreakdown,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedCompletion: 'Same Day by 6:00 PM'
    };

    all.unshift(newBooking);
    StorageService.set(STORAGE_KEYS.BOOKINGS, all);

    return newBooking;
  }

  public static updateBookingStatus(id: string, status: ServiceStatus, estimatedCompletion?: string): void {
    const all = this.getAllBookings();
    const idx = all.findIndex((b) => b.id.toLowerCase() === id.toLowerCase());
    if (idx !== -1) {
      all[idx].status = status;
      all[idx].updatedAt = new Date().toISOString();
      if (estimatedCompletion) {
        all[idx].estimatedCompletion = estimatedCompletion;
      }
      StorageService.set(STORAGE_KEYS.BOOKINGS, all);
    }
  }

  public static assignTechnician(bookingId: string, technicianId: string): void {
    const all = this.getAllBookings();
    const idx = all.findIndex((b) => b.id.toLowerCase() === bookingId.toLowerCase());
    if (idx !== -1) {
      all[idx].technicianId = technicianId;
      all[idx].updatedAt = new Date().toISOString();
      StorageService.set(STORAGE_KEYS.BOOKINGS, all);
    }
  }

  public static assignBay(bookingId: string, bayNumber: string): void {
    const all = this.getAllBookings();
    const idx = all.findIndex((b) => b.id.toLowerCase() === bookingId.toLowerCase());
    if (idx !== -1) {
      all[idx].bayNumber = bayNumber;
      all[idx].updatedAt = new Date().toISOString();
      StorageService.set(STORAGE_KEYS.BOOKINGS, all);
    }
  }

  public static getInspectionReport(bookingId: string): InspectionReport | undefined {
    const all = StorageService.get<Record<string, InspectionReport>>(STORAGE_KEYS.INSPECTIONS, {});
    return all[bookingId];
  }

  public static saveInspectionReport(report: InspectionReport): void {
    const all = StorageService.get<Record<string, InspectionReport>>(STORAGE_KEYS.INSPECTIONS, {});
    all[report.bookingId] = report;
    StorageService.set(STORAGE_KEYS.INSPECTIONS, all);
  }

  public static getQuotation(bookingId: string): Quotation | undefined {
    const all = StorageService.get<Record<string, Quotation>>(STORAGE_KEYS.QUOTATIONS, {});
    return all[bookingId];
  }

  public static updateQuotationStatus(
    bookingId: string,
    status: 'approved' | 'rejected' | 'changes_requested',
    customerNotes?: string
  ): void {
    const all = StorageService.get<Record<string, Quotation>>(STORAGE_KEYS.QUOTATIONS, {});
    if (all[bookingId]) {
      all[bookingId].status = status;
      if (customerNotes) {
        all[bookingId].customerNotes = customerNotes;
      }
      StorageService.set(STORAGE_KEYS.QUOTATIONS, all);

      if (status === 'approved') {
        this.updateBookingStatus(bookingId, 'work_in_progress');
      }
    }
  }
}
