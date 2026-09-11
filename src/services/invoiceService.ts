import { Invoice, Booking, JobCard } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { AuditService } from './auditService';
import { NotificationService } from './notificationService';

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

  public static getInvoiceByBooking(bookingId: string): Invoice | undefined {
    return this.getInvoiceByBookingId(bookingId);
  }

  public static getInvoiceByJobCard(jobCardNumber: string): Invoice | undefined {
    const all = this.getAllInvoices();
    return all.find((inv) => inv.jobCardNumber === jobCardNumber || inv.jobCardId === jobCardNumber);
  }

  public static createInvoiceFromBooking(booking: Booking): Invoice {
    const all = this.getAllInvoices();
    const existing = all.find((inv) => inv.bookingId === booking.id);
    if (existing) return existing;

    const subtotal = booking.priceBreakdown.subtotal;
    const discount = booking.priceBreakdown.discountAmount || 0;
    const taxableAmount = Math.max(0, subtotal - discount);
    const cgst = Math.round(taxableAmount * 0.09);
    const sgst = Math.round(taxableAmount * 0.09);
    const gstTotal = cgst + sgst;
    const grandTotal = taxableAmount + gstTotal;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${booking.id.replace('TORQX-', '')}`,
      bookingId: booking.id,
      jobCardId: booking.jobCardId,
      jobCardNumber: booking.jobCardNumber,
      date: new Date().toISOString().split('T')[0],
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      customerEmail: booking.customerEmail,
      customerAddress: booking.customerAddress,
      vehicleDetails: `${booking.vehicleBrand} ${booking.vehicleModel} ${booking.vehicleVariant} (${booking.fuelType})`,
      vehicleReg: booking.vehicleRegNumber,
      items: [
        {
          description: `${booking.serviceName} Scheduled Service`,
          quantity: 1,
          rate: booking.priceBreakdown.serviceBasePrice,
          amount: booking.priceBreakdown.serviceBasePrice
        },
        {
          description: 'OEM Factory-Grade Consumables & Fluids',
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
      subtotal,
      discount,
      couponCode: booking.priceBreakdown.couponCode,
      gst: gstTotal,
      cgst,
      sgst,
      gstin: '27AAACT2026Q1Z5',
      sacCode: '998714',
      total: grandTotal,
      paidAmount: 0,
      remainingAmount: grandTotal,
      paymentStatus: 'pending'
    };

    if (booking.priceBreakdown.addonsTotal > 0) {
      newInvoice.items.push({
        description: 'Selected Workshop Add-on Packages',
        quantity: 1,
        rate: booking.priceBreakdown.addonsTotal,
        amount: booking.priceBreakdown.addonsTotal
      });
    }

    if (booking.priceBreakdown.pickupDropFee > 0) {
      newInvoice.items.push({
        description: 'Doorstep Valet Chauffeur & Flatbed Transit',
        quantity: 1,
        rate: booking.priceBreakdown.pickupDropFee,
        amount: booking.priceBreakdown.pickupDropFee
      });
    }

    all.unshift(newInvoice);
    StorageService.set(STORAGE_KEYS.INVOICES, all);
    return newInvoice;
  }

  public static createInvoiceFromJobCard(jobCard: JobCard): Invoice {
    const all = this.getAllInvoices();
    const existing = all.find((inv) => inv.jobCardNumber === jobCard.jobCardNumber || inv.bookingId === jobCard.bookingId);
    if (existing) return existing;

    const items: { description: string; quantity: number; rate: number; amount: number }[] = [];

    // Add parts
    jobCard.partsRequired.forEach((p) => {
      items.push({
        description: `${p.name} ${p.partNumber ? `[${p.partNumber}]` : ''}`,
        quantity: p.quantity,
        rate: p.unitPrice,
        amount: p.total
      });
    });

    // Add labour
    jobCard.labour.forEach((l) => {
      items.push({
        description: `${l.description} (${l.hours} hrs @ ₹${l.ratePerHour}/hr)`,
        quantity: l.hours,
        rate: l.ratePerHour,
        amount: l.total
      });
    });

    // Add approved additional work
    jobCard.additionalWork
      .filter((w) => w.status === 'approved')
      .forEach((w) => {
        items.push({
          description: `Authorized Additional: ${w.description}`,
          quantity: 1,
          rate: w.partsCost + w.labourCost,
          amount: w.partsCost + w.labourCost
        });
      });

    const subtotal = items.reduce((acc, it) => acc + it.amount, 0);
    const discount = 0;
    const taxable = Math.max(0, subtotal - discount);
    const cgst = Math.round(taxable * 0.09);
    const sgst = Math.round(taxable * 0.09);
    const gst = cgst + sgst;
    const total = taxable + gst;

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-${jobCard.jobCardNumber.replace('TORQX-JC-', '')}`,
      bookingId: jobCard.bookingId,
      jobCardId: jobCard.id,
      jobCardNumber: jobCard.jobCardNumber,
      date: new Date().toISOString().split('T')[0],
      customerName: jobCard.customerName,
      customerPhone: jobCard.customerPhone,
      customerEmail: jobCard.customerEmail,
      customerAddress: jobCard.customerAddress,
      vehicleDetails: `${jobCard.vehicleBrand} ${jobCard.vehicleModel} ${jobCard.vehicleVariant}`,
      vehicleReg: jobCard.vehicleRegNumber,
      items,
      subtotal,
      discount,
      gst,
      cgst,
      sgst,
      gstin: '27AAACT2026Q1Z5',
      sacCode: '998714',
      total,
      paidAmount: 0,
      remainingAmount: total,
      paymentStatus: 'pending'
    };

    all.unshift(newInvoice);
    StorageService.set(STORAGE_KEYS.INVOICES, all);
    return newInvoice;
  }

  public static payInvoice(
    invoiceId: string,
    method: 'UPI' | 'Card' | 'Net Banking' | 'Razorpay' | 'Cash at Counter',
    amountToPay?: number,
    transactionId?: string
  ): { success: boolean; invoice: Invoice | null; message: string } {
    const all = this.getAllInvoices();
    const idx = all.findIndex((i) => i.id === invoiceId || i.invoiceNumber === invoiceId);
    if (idx === -1) return { success: false, invoice: null, message: 'Invoice not found' };

    const inv = all[idx];
    const currentPaid = inv.paidAmount || 0;
    const remaining = inv.remainingAmount ?? (inv.total - currentPaid);
    const payment = amountToPay !== undefined && amountToPay > 0 ? Math.min(amountToPay, remaining) : remaining;

    const newPaid = currentPaid + payment;
    const newRemaining = Math.max(0, inv.total - newPaid);

    inv.paidAmount = newPaid;
    inv.remainingAmount = newRemaining;
    inv.paymentMethod = method;
    inv.transactionId = transactionId || `TXN-TORQX-${Date.now()}`;
    inv.paidAt = new Date().toISOString();

    if (newRemaining <= 0) {
      inv.paymentStatus = 'paid';
    } else {
      inv.paymentStatus = 'partially_paid';
    }

    all[idx] = inv;
    StorageService.set(STORAGE_KEYS.INVOICES, all);

    AuditService.logAction(
      'customer',
      inv.customerName,
      'INVOICE_PAYMENT',
      `Payment of ₹${payment.toLocaleString('en-IN')} received via ${method} for Invoice ${inv.invoiceNumber}. Status: ${inv.paymentStatus.toUpperCase()}`
    );

    NotificationService.notifyUser(
      inv.customerEmail,
      'Payment Received',
      `We have received your payment of ₹${payment.toLocaleString('en-IN')} via ${method} for Invoice #${inv.invoiceNumber}.`,
      'success'
    );

    return { success: true, invoice: inv, message: `Payment processed: ₹${payment.toLocaleString('en-IN')}` };
  }
}
