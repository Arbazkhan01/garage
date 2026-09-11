import {
  JobCard,
  JobStatus,
  JobCardPartItem,
  JobCardLabourItem,
  JobCardAdditionalWorkItem,
  Booking,
  Invoice,
  QualityCheckAudit
} from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { INITIAL_JOB_CARDS } from '../data/jobCardData';
import { NotificationService } from './notificationService';
import { InvoiceService } from './invoiceService';
import { InventoryService } from './inventoryService';
import { AuditService } from './auditService';
import { ServiceHistoryService } from './serviceHistoryService';
import { ServiceStateMachine } from './serviceStateMachine';

const STORAGE_QUALITY_CHECKS = 'torqx_quality_checks_v1';

export class JobCardService {
  public static getAllJobCards(): JobCard[] {
    return StorageService.get<JobCard[]>(STORAGE_KEYS.JOB_CARDS, INITIAL_JOB_CARDS);
  }

  public static getJobCardById(id: string): JobCard | null {
    const list = this.getAllJobCards();
    return list.find((j) => j.id === id || j.jobCardNumber === id || j.bookingId === id) || null;
  }

  public static getJobCardsByTechnician(technicianId: string): JobCard[] {
    const list = this.getAllJobCards();
    return list.filter((j) => j.assignedTechnicianId === technicianId);
  }

  public static getJobCardsByCustomer(customerEmail: string): JobCard[] {
    const list = this.getAllJobCards();
    return list.filter((j) => j.customerEmail.toLowerCase() === customerEmail.toLowerCase());
  }

  public static createJobCardFromBooking(
    booking: Booking,
    technicianId = 'tech-1',
    technicianName = 'Rahul Sharma (Master Tech)',
    bayNumber = 'Bay 01'
  ): JobCard {
    const cards = this.getAllJobCards();

    // Check if already created for this booking
    const existing = cards.find((j) => j.bookingId === booking.id);
    if (existing) {
      return existing;
    }

    const count = cards.length + 1;
    const formattedNum = String(count).padStart(5, '0');
    const jobCardNumber = `TORQX-JC-2026-${formattedNum}`;

    const newJob: JobCard = {
      id: `JC-${Date.now()}`,
      jobCardNumber,
      bookingId: booking.id,
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      customerEmail: booking.customerEmail,
      customerAddress: booking.customerAddress || 'Pune, Maharashtra',
      vehicleBrand: booking.vehicleBrand,
      vehicleModel: booking.vehicleModel,
      vehicleVariant: booking.vehicleVariant,
      vehicleRegNumber: booking.vehicleRegNumber || 'MH 12 TC 0099',
      serviceAdvisor: 'Kunal Singhania (Lead Service Advisor)',
      assignedTechnicianId: technicianId,
      assignedTechnicianName: technicianName,
      serviceBay: bayNumber,
      checkInDate: new Date().toLocaleDateString('en-IN') + ' 09:30 AM',
      expectedDeliveryDate: booking.serviceDate + ' 06:30 PM',
      currentKm: 38500,
      customerComplaint: booking.additionalNotes || 'Scheduled periodic maintenance and mechanical audit.',
      technicianDiagnosis: 'Pending initial 60-point electronic OBD-II diagnostic scan.',
      workRequired: [booking.serviceName, ...(booking.addonIds || []).map((a) => `Addon Package: ${a}`)],
      partsRequired: [],
      labour: [
        {
          id: `lab-${Date.now()}`,
          description: `${booking.serviceName} Execution & Dynamic Calibration`,
          hours: 2.5,
          ratePerHour: 950,
          total: 2375
        }
      ],
      additionalWork: [],
      approvalStatus: 'NOT_REQUIRED',
      paymentStatus: 'PENDING',
      jobStatus: 'VEHICLE_RECEIVED',
      notes: [`[${new Date().toLocaleTimeString('en-IN')}] Vehicle checked in. Job Card generated from Booking #${booking.id}`],
      photos: [
        'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    cards.unshift(newJob);
    StorageService.set(STORAGE_KEYS.JOB_CARDS, cards);

    // Sync booking status and link
    this.syncBookingStatus(booking.id, 'VEHICLE_RECEIVED', newJob.id, newJob.jobCardNumber, bayNumber, technicianId);

    // Occupy Bay
    this.occupyBay(bayNumber, booking.id, `${booking.vehicleBrand} ${booking.vehicleModel}`, technicianName);

    // Log Audit
    AuditService.logAction(
      'admin',
      'Workshop Manager',
      'CHECK_IN_VEHICLE',
      `Vehicle checked in: ${booking.vehicleBrand} ${booking.vehicleModel} (${booking.vehicleRegNumber}). Job Card #${newJob.jobCardNumber} created in ${bayNumber}.`
    );

    // Notify Customer
    NotificationService.notifyUser(
      booking.userId,
      'Vehicle Received at Garage',
      `Your ${booking.vehicleBrand} ${booking.vehicleModel} has checked in. Job Card #${newJob.jobCardNumber} opened. Assigned to ${bayNumber}.`,
      'info',
      `/service/${booking.id}`
    );

    return newJob;
  }

  public static updateJobStatus(jobCardId: string, status: JobStatus, note?: string): JobCard | null {
    const cards = this.getAllJobCards();
    const idx = cards.findIndex((j) => j.id === jobCardId || j.jobCardNumber === jobCardId);
    if (idx === -1) return null;

    const currentStatus = cards[idx].jobStatus;
    const normNext = ServiceStateMachine.normalizeStatus(status);

    cards[idx].jobStatus = status;
    cards[idx].updatedAt = new Date().toISOString();
    if (note) {
      cards[idx].notes.push(`[${new Date().toLocaleTimeString('en-IN')}] ${note}`);
    }

    StorageService.set(STORAGE_KEYS.JOB_CARDS, cards);

    // Sync with corresponding Booking
    this.syncBookingStatus(cards[idx].bookingId, normNext);

    AuditService.logAction(
      'system',
      'TORQX State Machine',
      'STATUS_CHANGE',
      `Job #${cards[idx].jobCardNumber} transitioned from ${currentStatus} to ${status}.`
    );

    return cards[idx];
  }

  public static updateJobCardStatus(jobCardId: string, status: JobStatus, note?: string): JobCard | null {
    return this.updateJobStatus(jobCardId, status, note);
  }

  public static completeJob(jobCardId: string, notes?: string): { success: boolean; jobCard: JobCard | null } {
    const cards = this.getAllJobCards();
    const idx = cards.findIndex((j) => j.id === jobCardId || j.jobCardNumber === jobCardId);
    if (idx === -1) return { success: false, jobCard: null };

    const job = cards[idx];
    job.jobStatus = 'READY_FOR_DELIVERY';
    job.updatedAt = new Date().toISOString();
    if (notes) {
      job.notes.push(`[${new Date().toLocaleTimeString('en-IN')}] ${notes}`);
    } else {
      job.notes.push(`[${new Date().toLocaleTimeString('en-IN')}] Technician completed work. Ready for customer handover.`);
    }

    this.releaseBay(job.serviceBay);

    let inv = InvoiceService.getInvoiceByBooking(job.bookingId);
    if (!inv) {
      inv = InvoiceService.createInvoiceFromJobCard(job);
    }

    cards[idx] = job;
    StorageService.set(STORAGE_KEYS.JOB_CARDS, cards);
    this.syncBookingStatus(job.bookingId, 'READY_FOR_DELIVERY');

    NotificationService.notifyUser(
      job.customerEmail,
      'Vehicle Ready for Collection / Delivery',
      `All work on your ${job.vehicleBrand} ${job.vehicleModel} is finished and certified. Your invoice is ready for payment.`,
      'success',
      `/service/${job.bookingId}`
    );

    return { success: true, jobCard: job };
  }

  /**
   * Adds part to Job Card with strict stock availability check and reservation
   */
  public static addPartToJob(
    jobCardId: string,
    partData: {
      id?: string;
      inventoryPartId: string;
      name: string;
      partNumber?: string;
      quantity: number;
      unitPrice: number;
      total?: number;
    }
  ): { success: boolean; jobCard: JobCard | null; message: string } {
    const cards = this.getAllJobCards();
    const idx = cards.findIndex((j) => j.id === jobCardId || j.jobCardNumber === jobCardId);
    if (idx === -1) return { success: false, jobCard: null, message: 'Job Card not found' };

    // Strict Inventory stock check & reservation
    const reservation = InventoryService.reserveStock(partData.inventoryPartId, partData.quantity);
    if (!reservation.success) {
      return { success: false, jobCard: cards[idx], message: reservation.message };
    }

    const newPartItem: JobCardPartItem = {
      id: `jcp-${Date.now()}`,
      inventoryPartId: partData.inventoryPartId,
      name: partData.name,
      partNumber: partData.partNumber || reservation.part?.partNumber,
      quantity: partData.quantity,
      unitPrice: partData.unitPrice,
      total: partData.quantity * partData.unitPrice
    };

    cards[idx].partsRequired.push(newPartItem);
    cards[idx].jobStatus = 'PARTS_RESERVED';
    cards[idx].updatedAt = new Date().toISOString();
    cards[idx].notes.push(`[${new Date().toLocaleTimeString('en-IN')}] Reserved ${partData.quantity}x ${partData.name} from warehouse.`);

    StorageService.set(STORAGE_KEYS.JOB_CARDS, cards);

    // Sync booking status
    this.syncBookingStatus(cards[idx].bookingId, 'PARTS_RESERVED');

    return { success: true, jobCard: cards[idx], message: `Successfully allocated ${partData.quantity}x ${partData.name}` };
  }

  /**
   * Removes part from Job Card and releases stock reservation
   */
  public static removePartFromJob(jobCardId: string, partItemId: string): JobCard | null {
    const cards = this.getAllJobCards();
    const idx = cards.findIndex((j) => j.id === jobCardId || j.jobCardNumber === jobCardId);
    if (idx === -1) return null;

    const partIdx = cards[idx].partsRequired.findIndex((p) => p.id === partItemId);
    if (partIdx !== -1) {
      const p = cards[idx].partsRequired[partIdx];
      if (p.inventoryPartId) {
        InventoryService.releaseReservedStock(p.inventoryPartId, p.quantity);
      }
      cards[idx].partsRequired.splice(partIdx, 1);
      cards[idx].updatedAt = new Date().toISOString();
      cards[idx].notes.push(`[${new Date().toLocaleTimeString('en-IN')}] Removed ${p.name} and released reserved stock.`);
      StorageService.set(STORAGE_KEYS.JOB_CARDS, cards);
    }

    return cards[idx];
  }

  public static addLabourToJob(jobCardId: string, labour: JobCardLabourItem): JobCard | null {
    const cards = this.getAllJobCards();
    const idx = cards.findIndex((j) => j.id === jobCardId || j.jobCardNumber === jobCardId);
    if (idx === -1) return null;

    cards[idx].labour.push(labour);
    cards[idx].updatedAt = new Date().toISOString();
    StorageService.set(STORAGE_KEYS.JOB_CARDS, cards);
    return cards[idx];
  }

  public static requestAdditionalWork(
    jobCardId: string,
    item: { description: string; partsCost: number; labourCost: number }
  ): JobCard | null {
    const cards = this.getAllJobCards();
    const idx = cards.findIndex((j) => j.id === jobCardId || j.jobCardNumber === jobCardId);
    if (idx === -1) return null;

    const gst = Math.round((item.partsCost + item.labourCost) * 0.18);
    const total = item.partsCost + item.labourCost + gst;

    const newAddWork: JobCardAdditionalWorkItem = {
      id: `addw-${Date.now()}`,
      description: item.description,
      partsCost: item.partsCost,
      labourCost: item.labourCost,
      gst,
      total,
      status: 'pending',
      requestedAt: new Date().toLocaleString('en-IN')
    };

    cards[idx].additionalWork.push(newAddWork);
    cards[idx].approvalStatus = 'PENDING';
    cards[idx].jobStatus = 'APPROVAL_PENDING';
    cards[idx].updatedAt = new Date().toISOString();

    StorageService.set(STORAGE_KEYS.JOB_CARDS, cards);

    // Sync booking
    this.syncBookingStatus(cards[idx].bookingId, 'APPROVAL_PENDING');

    NotificationService.notifyUser(
      cards[idx].customerEmail,
      'Additional Work Approval Required',
      `Diagnostic lead requested approval for: ${item.description} (₹${total.toLocaleString('en-IN')} incl. GST). Review in customer portal.`,
      'warning',
      `/service/${cards[idx].bookingId}`
    );

    return cards[idx];
  }

  public static respondToAdditionalWork(
    jobCardId: string,
    additionalWorkId: string,
    decision: 'approved' | 'rejected'
  ): JobCard | null {
    const cards = this.getAllJobCards();
    const idx = cards.findIndex((j) => j.id === jobCardId || j.jobCardNumber === jobCardId);
    if (idx === -1) return null;

    const addIdx = cards[idx].additionalWork.findIndex((a) => a.id === additionalWorkId);
    if (addIdx !== -1) {
      cards[idx].additionalWork[addIdx].status = decision;
      cards[idx].additionalWork[addIdx].respondedAt = new Date().toLocaleString('en-IN');
    }

    const hasPending = cards[idx].additionalWork.some((a) => a.status === 'pending');
    cards[idx].approvalStatus = hasPending ? 'PENDING' : decision === 'approved' ? 'APPROVED' : 'REJECTED';
    cards[idx].jobStatus = 'WORK_IN_PROGRESS';
    cards[idx].updatedAt = new Date().toISOString();

    StorageService.set(STORAGE_KEYS.JOB_CARDS, cards);

    // Sync booking
    this.syncBookingStatus(cards[idx].bookingId, 'WORK_IN_PROGRESS');

    NotificationService.notifyUser(
      cards[idx].assignedTechnicianId,
      `Customer ${decision === 'approved' ? 'Approved' : 'Rejected'} Additional Scope`,
      `Customer has ${decision} additional work for Job #${cards[idx].jobCardNumber}. Work in progress resumed.`,
      decision === 'approved' ? 'success' : 'info'
    );

    return cards[idx];
  }

  public static addTechnicianDiagnosis(jobCardId: string, diagnosis: string, notes?: string): JobCard | null {
    const cards = this.getAllJobCards();
    const idx = cards.findIndex((j) => j.id === jobCardId || j.jobCardNumber === jobCardId);
    if (idx === -1) return null;

    cards[idx].technicianDiagnosis = diagnosis;
    if (notes) {
      cards[idx].notes.push(`[Diagnosis Note] ${notes}`);
    }
    cards[idx].jobStatus = 'DIAGNOSIS';
    cards[idx].updatedAt = new Date().toISOString();

    StorageService.set(STORAGE_KEYS.JOB_CARDS, cards);
    this.syncBookingStatus(cards[idx].bookingId, 'DIAGNOSIS');

    return cards[idx];
  }

  public static addPhoto(jobCardId: string, photoUrl: string): JobCard | null {
    const cards = this.getAllJobCards();
    const idx = cards.findIndex((j) => j.id === jobCardId || j.jobCardNumber === jobCardId);
    if (idx === -1) return null;

    cards[idx].photos = cards[idx].photos || [];
    cards[idx].photos.push(photoUrl);
    cards[idx].updatedAt = new Date().toISOString();
    StorageService.set(STORAGE_KEYS.JOB_CARDS, cards);
    return cards[idx];
  }

  /**
   * 10-Point Quality Check Workflow:
   * If all items pass -> moves to READY_FOR_DELIVERY, generates final GST invoice, notifies customer.
   * If any item fails -> returns to WORK_IN_PROGRESS, records supervisor rework notes.
   */
  public static submitQualityCheck(
    jobCardId: string,
    qcData: {
      inspectorName: string;
      items: {
        engine: 'PASS' | 'FAIL' | 'NOT_CHECKED';
        brakes: 'PASS' | 'FAIL' | 'NOT_CHECKED';
        tyres: 'PASS' | 'FAIL' | 'NOT_CHECKED';
        lights: 'PASS' | 'FAIL' | 'NOT_CHECKED';
        ac: 'PASS' | 'FAIL' | 'NOT_CHECKED';
        fluidLevels: 'PASS' | 'FAIL' | 'NOT_CHECKED';
        electrical: 'PASS' | 'FAIL' | 'NOT_CHECKED';
        exterior: 'PASS' | 'FAIL' | 'NOT_CHECKED';
        interior: 'PASS' | 'FAIL' | 'NOT_CHECKED';
        roadTest: 'PASS' | 'FAIL' | 'NOT_CHECKED';
      };
      notes?: string;
    }
  ): { success: boolean; jobCard: JobCard | null; passed: boolean; invoice?: Invoice } {
    const cards = this.getAllJobCards();
    const idx = cards.findIndex((j) => j.id === jobCardId || j.jobCardNumber === jobCardId);
    if (idx === -1) return { success: false, jobCard: null, passed: false };

    // Check if any failed
    const failures: string[] = [];
    Object.entries(qcData.items).forEach(([key, val]) => {
      if (val === 'FAIL') failures.push(key);
    });

    const passed = failures.length === 0;

    // Save QC Audit record
    const audits = StorageService.get<QualityCheckAudit[]>(STORAGE_QUALITY_CHECKS, []);
    const newAudit: QualityCheckAudit = {
      id: `QC-${Date.now()}`,
      jobCardId: cards[idx].id,
      inspectorName: qcData.inspectorName,
      items: qcData.items,
      overallStatus: passed ? 'PASS' : 'FAIL',
      failureReasons: failures,
      notes: qcData.notes,
      timestamp: new Date().toISOString()
    };
    audits.unshift(newAudit);
    StorageService.set(STORAGE_QUALITY_CHECKS, audits);

    let generatedInvoice: Invoice | undefined;

    if (passed) {
      cards[idx].jobStatus = 'READY_FOR_DELIVERY';
      cards[idx].notes.push(
        `[${new Date().toLocaleTimeString('en-IN')}] Quality Audit PASSED by ${qcData.inspectorName}. Vehicle certified ready for delivery.`
      );

      // Auto-generate invoice
      generatedInvoice = InvoiceService.createInvoiceFromJobCard(cards[idx]);
      cards[idx].invoiceId = generatedInvoice.id;

      this.syncBookingStatus(cards[idx].bookingId, 'READY_FOR_DELIVERY');

      NotificationService.notifyUser(
        cards[idx].customerEmail,
        'Vehicle Ready for Delivery',
        `Quality inspection passed! Your ${cards[idx].vehicleBrand} ${cards[idx].vehicleModel} is sanitized, tested, and ready. Invoice #${generatedInvoice.invoiceNumber} is generated.`,
        'success',
        `/service/${cards[idx].bookingId}`
      );
    } else {
      // Revert to WORK_IN_PROGRESS for rework
      cards[idx].jobStatus = 'WORK_IN_PROGRESS';
      cards[idx].notes.push(
        `[${new Date().toLocaleTimeString('en-IN')}] Quality Audit REJECTED by ${qcData.inspectorName}. Failed items: ${failures.join(', ')}. Returned to bay for rectification.`
      );

      this.syncBookingStatus(cards[idx].bookingId, 'WORK_IN_PROGRESS');

      NotificationService.notifyUser(
        cards[idx].assignedTechnicianId,
        'Quality Check Rework Required',
        `Job #${cards[idx].jobCardNumber} failed QC on: ${failures.join(', ')}. Rectification required.`,
        'warning'
      );
    }

    cards[idx].updatedAt = new Date().toISOString();
    StorageService.set(STORAGE_KEYS.JOB_CARDS, cards);

    return { success: true, jobCard: cards[idx], passed, invoice: generatedInvoice };
  }

  /**
   * Final Delivery Handover:
   * 1. Workshop Pickup: Hands over vehicle -> marks COMPLETED
   * 2. Doorstep Delivery: Marks OUT_FOR_DELIVERY with driver -> then COMPLETED
   * 3. Deducts reserved inventory parts
   * 4. Releases bay
   * 5. Records entry into Service History
   */
  public static deliverVehicle(
    jobCardId: string,
    deliveryType: 'workshop_pickup' | 'doorstep_delivery',
    driverName?: string
  ): { success: boolean; jobCard: JobCard | null; message: string } {
    const cards = this.getAllJobCards();
    const idx = cards.findIndex((j) => j.id === jobCardId || j.jobCardNumber === jobCardId);
    if (idx === -1) return { success: false, jobCard: null, message: 'Job Card not found' };

    const job = cards[idx];

    // If doorstep delivery initiated
    if (deliveryType === 'doorstep_delivery' && job.jobStatus !== 'OUT_FOR_DELIVERY') {
      job.jobStatus = 'OUT_FOR_DELIVERY';
      job.notes.push(`[${new Date().toLocaleTimeString('en-IN')}] Dispatched with valet chauffeur ${driverName || 'Santosh Yadav'}.`);
      cards[idx] = job;
      StorageService.set(STORAGE_KEYS.JOB_CARDS, cards);
      this.syncBookingStatus(job.bookingId, 'OUT_FOR_DELIVERY');

      NotificationService.notifyUser(
        job.customerEmail,
        'Vehicle Out for Doorstep Delivery',
        `Valet chauffeur ${driverName || 'Santosh Yadav'} is en route with your ${job.vehicleBrand} ${job.vehicleModel}.`,
        'info',
        `/service/${job.bookingId}`
      );

      return { success: true, jobCard: job, message: 'Vehicle dispatched with driver' };
    }

    // Complete Job
    job.jobStatus = 'COMPLETED';
    job.paymentStatus = 'PAID';
    job.updatedAt = new Date().toISOString();
    job.notes.push(`[${new Date().toLocaleTimeString('en-IN')}] Vehicle delivered to customer. All warranties activated.`);

    // 1. Deduct all reserved inventory parts
    job.partsRequired.forEach((p) => {
      if (p.inventoryPartId) {
        InventoryService.deductStock(p.inventoryPartId, p.quantity);
      }
    });

    // 2. Release bay
    this.releaseBay(job.serviceBay);

    // 3. Mark invoice as paid if not already
    const invoice = InvoiceService.getInvoiceByBooking(job.bookingId);
    if (invoice && invoice.paymentStatus !== 'paid') {
      InvoiceService.payInvoice(invoice.id, 'UPI');
    }

    // 4. Record into Service History
    const partsCost = job.partsRequired.reduce((acc, p) => acc + p.total, 0);
    const labourCost = job.labour.reduce((acc, l) => acc + l.total, 0);
    ServiceHistoryService.addHistoryRecord({
      vehicleReg: job.vehicleRegNumber,
      vehicleName: `${job.vehicleBrand} ${job.vehicleModel} ${job.vehicleVariant}`,
      customerName: job.customerName,
      customerEmail: job.customerEmail,
      date: new Date().toISOString().split('T')[0],
      odometer: job.currentKm,
      serviceType: job.workRequired[0] || 'Comprehensive Periodic Service',
      partsUsed: job.partsRequired.map((p) => `${p.name} (x${p.quantity})`),
      partsCost,
      labourCost,
      totalCost: invoice ? invoice.total : partsCost + labourCost,
      technicianName: job.assignedTechnicianName,
      jobCardNumber: job.jobCardNumber,
      invoiceNumber: invoice ? invoice.invoiceNumber : `INV-${job.jobCardNumber.replace('TORQX-JC-', '')}`,
      notes: `Service completed without defects. Delivered via ${deliveryType === 'doorstep_delivery' ? 'valet chauffeur' : 'customer workshop pickup'}.`
    });

    cards[idx] = job;
    StorageService.set(STORAGE_KEYS.JOB_CARDS, cards);

    // Sync booking
    this.syncBookingStatus(job.bookingId, 'COMPLETED');

    NotificationService.notifyUser(
      job.customerEmail,
      'Service Completed & Delivered',
      `Thank you for choosing TORQX AUTOCARE! Your ${job.vehicleBrand} ${job.vehicleModel} service is complete with 6-month workshop warranty.`,
      'success',
      `/service/${job.bookingId}`
    );

    return { success: true, jobCard: job, message: 'Vehicle delivered and job marked COMPLETED' };
  }

  /**
   * Cancels Job Card and safely releases any reserved inventory stock and workshop bay
   */
  public static cancelJob(jobCardId: string, reason?: string): boolean {
    const cards = this.getAllJobCards();
    const idx = cards.findIndex((j) => j.id === jobCardId || j.jobCardNumber === jobCardId);
    if (idx === -1) return false;

    const job = cards[idx];
    job.jobStatus = 'CANCELLED';
    job.notes.push(`[${new Date().toLocaleTimeString('en-IN')}] Job cancelled. Reason: ${reason || 'Customer request'}`);

    // Release reserved parts
    job.partsRequired.forEach((p) => {
      if (p.inventoryPartId) {
        InventoryService.releaseReservedStock(p.inventoryPartId, p.quantity);
      }
    });

    // Release bay
    this.releaseBay(job.serviceBay);

    cards[idx] = job;
    StorageService.set(STORAGE_KEYS.JOB_CARDS, cards);

    this.syncBookingStatus(job.bookingId, 'CANCELLED');

    AuditService.logAction(
      'admin',
      'Workshop Lead',
      'CANCEL_JOB',
      `Job #${job.jobCardNumber} cancelled. Stock and bay released. Reason: ${reason || 'N/A'}`
    );

    return true;
  }

  // Helper to keep Booking status synchronized
  private static syncBookingStatus(
    bookingId: string,
    status: any,
    jobCardId?: string,
    jobCardNumber?: string,
    bayNumber?: string,
    technicianId?: string
  ) {
    try {
      const bookings = StorageService.get<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
      const bIdx = bookings.findIndex((b) => b.id === bookingId);
      if (bIdx !== -1) {
        bookings[bIdx].status = status;
        if (jobCardId) bookings[bIdx].jobCardId = jobCardId;
        if (jobCardNumber) bookings[bIdx].jobCardNumber = jobCardNumber;
        if (bayNumber) bookings[bIdx].bayNumber = bayNumber;
        if (technicianId) bookings[bIdx].technicianId = technicianId;
        bookings[bIdx].updatedAt = new Date().toISOString();
        StorageService.set(STORAGE_KEYS.BOOKINGS, bookings);
      }
    } catch (e) {
      console.error('Error syncing booking status:', e);
    }
  }

  // Helper to occupy Bay in storage
  private static occupyBay(bayName: string, bookingId: string, vehicleModel: string, technicianName: string) {
    try {
      const bays = StorageService.get<any[]>(STORAGE_KEYS.SERVICE_BAYS, []);
      const bay = bays.find((b) => b.name.toLowerCase() === bayName.toLowerCase() || b.id.toLowerCase() === bayName.toLowerCase());
      if (bay) {
        bay.status = 'occupied';
        bay.currentBookingId = bookingId;
        bay.vehicleModel = vehicleModel;
        bay.technicianName = technicianName;
        StorageService.set(STORAGE_KEYS.SERVICE_BAYS, bays);
      }
    } catch (e) {
      console.error('Error occupying bay:', e);
    }
  }

  // Helper to release Bay in storage
  private static releaseBay(bayName: string) {
    try {
      const bays = StorageService.get<any[]>(STORAGE_KEYS.SERVICE_BAYS, []);
      const bay = bays.find((b) => b.name.toLowerCase() === bayName.toLowerCase() || b.id.toLowerCase() === bayName.toLowerCase());
      if (bay) {
        bay.status = 'empty';
        bay.currentBookingId = undefined;
        bay.vehicleModel = undefined;
        bay.technicianName = undefined;
        StorageService.set(STORAGE_KEYS.SERVICE_BAYS, bays);
      }
    } catch (e) {
      console.error('Error releasing bay:', e);
    }
  }
}
