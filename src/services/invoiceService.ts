import { Invoice, Booking } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';

export class InvoiceService {
  public static getAllInvoices(): Invoice[] {
    return StorageService.get<Invoice[]>(STORAGE_KEYS.INVOICES, []);
  }

  public static getUserInvoices(customerPhoneOrEmail: string): Invoice[] {
    const all = this.getAllInvoices();
    return all.filter(
      (inv) =>
        inv.customerEmail.toLowerCase() === customerPhoneOrEmail.toLowerCase() ||
        inv.customerPhone === customerPhoneOrEmail
    );
  }

  public static getInvoiceById(id: string): Invoice | undefined {
    const all = this.getAllInvoices();
    return all.find((inv) => inv.id === id || inv.invoiceNumber === id);
  }

  public static getInvoiceByBookingId(bookingId: string): Invoice | undefined {
    const all = this.getAllInvoices();
    return all.find((inv) => inv.bookingId.toLowerCase() === bookingId.toLowerCase());
  }

  public static createInvoiceFromBooking(booking: Booking): Invoice {
    const all = this.getAllInvoices();
    const existing = all.find((inv) => inv.bookingId === booking.id);
    if (existing) return existing;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${booking.id.replace('TORQX-', '')}`,
      bookingId: booking.id,
      date: new Date().toISOString().split('T')[0],
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      customerEmail: booking.customerEmail,
      customerAddress: booking.customerAddress,
      vehicleDetails: `${booking.vehicleBrand} ${booking.vehicleModel} (${booking.fuelType})`,
      vehicleReg: booking.vehicleRegNumber,
      items: [
        {
          description: `${booking.serviceName} Package`,
          quantity: 1,
          rate: booking.priceBreakdown.serviceBasePrice,
          amount: booking.priceBreakdown.serviceBasePrice
        },
        {
          description: 'OEM-Grade Replacement Components & Fluids',
          quantity: 1,
          rate: booking.priceBreakdown.partsEstimate,
          amount: booking.priceBreakdown.partsEstimate
        },
        {
          description: 'Master Diagnostic & Mechanical Labour',
          quantity: 1,
          rate: booking.priceBreakdown.labourCharges,
          amount: booking.priceBreakdown.labourCharges
        }
      ],
      subtotal: booking.priceBreakdown.subtotal,
      discount: booking.priceBreakdown.discountAmount,
      couponCode: booking.priceBreakdown.couponCode,
      gst: booking.priceBreakdown.gstAmount,
      total: booking.priceBreakdown.grandTotal,
      paymentStatus: 'pending'
    };

    if (booking.priceBreakdown.addonsTotal > 0) {
      newInvoice.items.push({
        description: 'Selected Add-on Packages & Enhancements',
        quantity: 1,
        rate: booking.priceBreakdown.addonsTotal,
        amount: booking.priceBreakdown.addonsTotal
      });
    }

    if (booking.priceBreakdown.pickupDropFee > 0) {
      newInvoice.items.push({
        description: 'Doorstep Valet Pickup & Drop Service',
        quantity: 1,
        rate: booking.priceBreakdown.pickupDropFee,
        amount: booking.priceBreakdown.pickupDropFee
      });
    }

    all.unshift(newInvoice);
    StorageService.set(STORAGE_KEYS.INVOICES, all);
    return newInvoice;
  }

  public static payInvoice(
    invoiceId: string,
    method: 'UPI' | 'Card' | 'Net Banking' | 'Razorpay' | 'Cash at Counter',
    transactionId?: string
  ): boolean {
    const all = this.getAllInvoices();
    const idx = all.findIndex((i) => i.id === invoiceId || i.invoiceNumber === invoiceId);
    if (idx !== -1) {
      all[idx].paymentStatus = 'paid';
      all[idx].paymentMethod = method;
      all[idx].transactionId = transactionId || `TXN-TORQX-${Date.now()}`;
      all[idx].paidAt = new Date().toISOString();
      StorageService.set(STORAGE_KEYS.INVOICES, all);
      return true;
    }
    return false;
  }
}
