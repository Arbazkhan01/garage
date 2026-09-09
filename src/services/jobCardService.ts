import { JobCard, JobStatus, JobCardPartItem, JobCardLabourItem, JobCardAdditionalWorkItem, Booking, Invoice } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { INITIAL_JOB_CARDS } from '../data/jobCardData';
import { NotificationService } from './notificationService';
import { InvoiceService } from './invoiceService';

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

  public static createJobCardFromBooking(booking: Booking, technicianId = 'tech-1', bayNumber = 'Bay 01'): JobCard {
    const cards = this.getAllJobCards();
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
      customerAddress: booking.customerAddress,
      vehicleBrand: booking.vehicleBrand,
      vehicleModel: booking.vehicleModel,
      vehicleVariant: booking.vehicleVariant,
      vehicleRegNumber: booking.vehicleRegNumber || 'MH 12 TC 0099',
      serviceAdvisor: 'Kunal Singhania (Lead Advisor)',
      assignedTechnicianId: technicianId,
      assignedTechnicianName: technicianId === 'tech-1' ? 'Rahul Sharma (Master Tech)' : 'Suresh Patil (Senior Mechanic)',
      serviceBay: bayNumber,
      checkInDate: new Date().toLocaleDateString('en-IN') + ' 09:30 AM',
      expectedDeliveryDate: booking.serviceDate + ' 06:30 PM',
      currentKm: 35000,
      customerComplaint: booking.additionalNotes || 'Scheduled periodic maintenance & mechanical review.',
      technicianDiagnosis: 'Pending initial 60-point electronic diagnostic scan.',
      workRequired: [booking.serviceName, ...(booking.addonIds || []).map((a) => `Addon: ${a}`)],
      partsRequired: [],
      labour: [
        {
          id: `lab-${Date.now()}`,
          description: `${booking.serviceName} Execution & System Calibration`,
          hours: 2.5,
          ratePerHour: 900,
          total: 2250
        }
      ],
      additionalWork: [],
      approvalStatus: 'NOT_REQUIRED',
      paymentStatus: 'PENDING',
      jobStatus: 'VEHICLE_RECEIVED',
      notes: [`Converted from Booking #${booking.id}`],
      photos: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    cards.unshift(newJob);
    StorageService.set(STORAGE_KEYS.JOB_CARDS, cards);

    // Notify Customer
    NotificationService.notifyUser(
      booking.userId,
      'Job Card Generated',
      `Job Card #${newJob.jobCardNumber} has been initiated for your ${booking.vehicleBrand} ${booking.vehicleModel}. Bay: ${bayNumber}.`,
      'info'
    );

    return newJob;
  }

  public static updateJobStatus(jobCardId: string, status: JobStatus, note?: string): JobCard | null {
    const cards = this.getAllJobCards();
    const idx = cards.findIndex((j) => j.id === jobCardId || j.jobCardNumber === jobCardId);
    if (idx === -1) return null;

    cards[idx].jobStatus = status;
    cards[idx].updatedAt = new Date().toISOString();
    if (note) {
      cards[idx].notes.push(`[${new Date().toLocaleTimeString('en-IN')}] ${note}`);
    }

    StorageService.set(STORAGE_KEYS.JOB_CARDS, cards);
    return cards[idx];
  }

  public static addPartToJob(jobCardId: string, part: JobCardPartItem): JobCard | null {
    const cards = this.getAllJobCards();
    const idx = cards.findIndex((j) => j.id === jobCardId || j.jobCardNumber === jobCardId);
    if (idx === -1) return null;

    cards[idx].partsRequired.push(part);
    cards[idx].updatedAt = new Date().toISOString();
    StorageService.set(STORAGE_KEYS.JOB_CARDS, cards);
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

    // Notify Customer for approval
    NotificationService.notifyUser(
      cards[idx].customerEmail,
      'Additional Work Approval Required',
      `Technician requested approval for: ${item.description} (₹${total.toLocaleString('en-IN')} incl. GST). Please review in your dashboard.`,
      'warning'
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

    // Check if any still pending
    const hasPending = cards[idx].additionalWork.some((a) => a.status === 'pending');
    cards[idx].approvalStatus = hasPending ? 'PENDING' : decision === 'approved' ? 'APPROVED' : 'REJECTED';
    cards[idx].jobStatus = 'WORK_IN_PROGRESS';
    cards[idx].updatedAt = new Date().toISOString();

    StorageService.set(STORAGE_KEYS.JOB_CARDS, cards);

    // Notify Technician & Customer
    NotificationService.notifyUser(
      cards[idx].assignedTechnicianId,
      `Customer ${decision === 'approved' ? 'Approved' : 'Rejected'} Additional Work`,
      `Customer has ${decision} additional work for Job #${cards[idx].jobCardNumber}.`,
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

  public static updateJobCardStatus(jobCardId: string, status: any, note?: string): JobCard | null {
    return this.updateJobStatus(jobCardId, status as JobStatus, note);
  }

  public static completeJob(jobCardId: string): { jobCard: JobCard; invoice: Invoice } | null {
    const cards = this.getAllJobCards();
    const idx = cards.findIndex((j) => j.id === jobCardId || j.jobCardNumber === jobCardId);
    if (idx === -1) return null;

    cards[idx].jobStatus = 'COMPLETED';
    cards[idx].updatedAt = new Date().toISOString();
    StorageService.set(STORAGE_KEYS.JOB_CARDS, cards);

    // Generate final invoice
    const inv = InvoiceService.getInvoiceByBooking(cards[idx].bookingId) || InvoiceService.getAllInvoices()[0];

    NotificationService.notifyUser(
      cards[idx].customerEmail,
      'Service Completed & Ready for Delivery',
      `Your ${cards[idx].vehicleBrand} ${cards[idx].vehicleModel} has completed quality testing and is ready for pickup/delivery.`,
      'success'
    );

    return { jobCard: cards[idx], invoice: inv };
  }
}
