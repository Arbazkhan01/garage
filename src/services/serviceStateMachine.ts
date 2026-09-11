import { ServiceLifecycleStatus } from '../types';

export const VALID_TRANSITIONS: Record<ServiceLifecycleStatus, ServiceLifecycleStatus[]> = {
  BOOKING_CONFIRMED: ['VEHICLE_RECEIVED', 'CANCELLED'],
  VEHICLE_RECEIVED: ['INSPECTION', 'DIAGNOSIS', 'CANCELLED'],
  INSPECTION: ['DIAGNOSIS', 'QUOTE_PENDING', 'WORK_IN_PROGRESS'],
  DIAGNOSIS: ['QUOTE_PENDING', 'WORK_IN_PROGRESS', 'APPROVAL_PENDING'],
  QUOTE_PENDING: ['APPROVAL_PENDING', 'WORK_IN_PROGRESS'],
  APPROVAL_PENDING: ['PARTS_RESERVED', 'WORK_IN_PROGRESS', 'CANCELLED'],
  PARTS_RESERVED: ['WORK_IN_PROGRESS'],
  WORK_IN_PROGRESS: ['QUALITY_CHECK', 'APPROVAL_PENDING'],
  QUALITY_CHECK: ['READY_FOR_DELIVERY', 'WORK_IN_PROGRESS'], // Returns to WORK_IN_PROGRESS on QC fail
  READY_FOR_DELIVERY: ['OUT_FOR_DELIVERY', 'COMPLETED'],
  OUT_FOR_DELIVERY: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: []
};

// Linear customer journey mapping for progress percentages and timelines
export const LIFECYCLE_STAGES: {
  status: ServiceLifecycleStatus;
  label: string;
  shortLabel: string;
  description: string;
  step: number;
}[] = [
  {
    status: 'BOOKING_CONFIRMED',
    label: 'Booking Confirmed',
    shortLabel: 'Confirmed',
    description: 'Appointment slot and service bay reserved in workshop schedule.',
    step: 1
  },
  {
    status: 'VEHICLE_RECEIVED',
    label: 'Vehicle Received',
    shortLabel: 'Checked In',
    description: 'Car arrived at workshop, mileage logged, and Job Card issued.',
    step: 2
  },
  {
    status: 'INSPECTION',
    label: 'Digital 60-Point Inspection',
    shortLabel: 'Inspection',
    description: 'Master diagnostic lead inspecting powertrain, brakes, fluids, and electronics.',
    step: 3
  },
  {
    status: 'DIAGNOSIS',
    label: 'Diagnostic Analysis',
    shortLabel: 'Diagnosis',
    description: 'OBD-II telemetry scan completed and mechanical tolerances recorded.',
    step: 4
  },
  {
    status: 'QUOTE_PENDING',
    label: 'Quotation Generated',
    shortLabel: 'Quote Ready',
    description: 'Parts requisition and transparent labour estimate prepared.',
    step: 5
  },
  {
    status: 'APPROVAL_PENDING',
    label: 'Awaiting Customer Approval',
    shortLabel: 'Approval Due',
    description: 'Scope and additional findings pending one-click customer authorization.',
    step: 6
  },
  {
    status: 'PARTS_RESERVED',
    label: 'Genuine OEM Parts Reserved',
    shortLabel: 'Parts Reserved',
    description: 'Required OEM spare parts allocated from central warehouse stock.',
    step: 7
  },
  {
    status: 'WORK_IN_PROGRESS',
    label: 'Work in Progress',
    shortLabel: 'In Progress',
    description: 'Certified technicians actively executing maintenance in service bay.',
    step: 8
  },
  {
    status: 'QUALITY_CHECK',
    label: '10-Point Quality & Road Test',
    shortLabel: 'Quality Check',
    description: 'Senior supervisor verifying torque specs, fluid levels, and road dynamics.',
    step: 9
  },
  {
    status: 'READY_FOR_DELIVERY',
    label: 'Ready for Delivery / Pickup',
    shortLabel: 'Ready',
    description: 'Vehicle cleaned, sanitized, and ready for handover with final invoice.',
    step: 10
  },
  {
    status: 'OUT_FOR_DELIVERY',
    label: 'Out for Doorstep Delivery',
    shortLabel: 'Out for Delivery',
    description: 'Dedicated valet chauffeur en route with your vehicle.',
    step: 11
  },
  {
    status: 'COMPLETED',
    label: 'Service Completed & Delivered',
    shortLabel: 'Delivered',
    description: 'Vehicle handed over to owner, payment settled, warranty active.',
    step: 12
  },
  {
    status: 'CANCELLED',
    label: 'Service Cancelled',
    shortLabel: 'Cancelled',
    description: 'Booking or job cancelled; reserved stock and bay released.',
    step: 0
  }
];

export class ServiceStateMachine {
  /**
   * Normalizes any uppercase, lowercase, or legacy status string into standard ServiceLifecycleStatus.
   */
  static normalizeStatus(status: string | undefined | null): ServiceLifecycleStatus {
    if (!status) return 'BOOKING_CONFIRMED';
    const s = status.trim().toUpperCase().replace(/[-\s]/g, '_');

    switch (s) {
      case 'BOOKING_CONFIRMED':
      case 'CONFIRMED':
      case 'BOOKED':
      case 'OPEN':
        return 'BOOKING_CONFIRMED';
      case 'VEHICLE_RECEIVED':
      case 'RECEIVED':
      case 'CHECKED_IN':
        return 'VEHICLE_RECEIVED';
      case 'INSPECTION':
      case 'INSPECTING':
      case 'DVI':
        return 'INSPECTION';
      case 'DIAGNOSIS':
      case 'DIAGNOSING':
        return 'DIAGNOSIS';
      case 'QUOTE_PENDING':
      case 'QUOTE_SENT':
      case 'QUOTED':
        return 'QUOTE_PENDING';
      case 'APPROVAL_PENDING':
      case 'AWAITING_APPROVAL':
      case 'PENDING_APPROVAL':
        return 'APPROVAL_PENDING';
      case 'PARTS_RESERVED':
      case 'PARTS_ALLOCATED':
      case 'QUOTE_APPROVED':
        return 'PARTS_RESERVED';
      case 'WORK_IN_PROGRESS':
      case 'IN_PROGRESS':
      case 'WORKING':
        return 'WORK_IN_PROGRESS';
      case 'QUALITY_CHECK':
      case 'QC':
      case 'AUDIT':
        return 'QUALITY_CHECK';
      case 'READY_FOR_DELIVERY':
      case 'READY_FOR_PICKUP':
      case 'READY':
        return 'READY_FOR_DELIVERY';
      case 'OUT_FOR_DELIVERY':
      case 'ON_THE_WAY':
        return 'OUT_FOR_DELIVERY';
      case 'COMPLETED':
      case 'DELIVERED':
      case 'CLOSED':
        return 'COMPLETED';
      case 'CANCELLED':
      case 'CANCELED':
      case 'REJECTED':
        return 'CANCELLED';
      default:
        return 'BOOKING_CONFIRMED';
    }
  }

  /**
   * Checks if transition between two statuses is valid.
   */
  static canTransition(currentStatus: string, nextStatus: string): boolean {
    const current = this.normalizeStatus(currentStatus);
    const next = this.normalizeStatus(nextStatus);

    if (current === next) return true;
    const allowed = VALID_TRANSITIONS[current] || [];
    return allowed.includes(next);
  }

  /**
   * Returns all allowed next statuses from current status.
   */
  static getNextAllowedStatuses(currentStatus: string): ServiceLifecycleStatus[] {
    const current = this.normalizeStatus(currentStatus);
    return VALID_TRANSITIONS[current] || [];
  }

  static getAllowedTransitions(currentStatus: string): ServiceLifecycleStatus[] {
    return this.getNextAllowedStatuses(currentStatus);
  }

  /**
   * Human readable label
   */
  static getStatusLabel(status: string): string {
    const norm = this.normalizeStatus(status);
    const item = LIFECYCLE_STAGES.find((s) => s.status === norm);
    return item ? item.label : norm.replace(/_/g, ' ');
  }

  /**
   * Short badge label
   */
  static getShortLabel(status: string): string {
    const norm = this.normalizeStatus(status);
    const item = LIFECYCLE_STAGES.find((s) => s.status === norm);
    return item ? item.shortLabel : norm.replace(/_/g, ' ');
  }

  /**
   * Description of status
   */
  static getStatusDescription(status: string): string {
    const norm = this.normalizeStatus(status);
    const item = LIFECYCLE_STAGES.find((s) => s.status === norm);
    return item ? item.description : '';
  }

  /**
   * Timeline step number (1 to 12)
   */
  static getTimelineStep(status: string): number {
    const norm = this.normalizeStatus(status);
    const item = LIFECYCLE_STAGES.find((s) => s.status === norm);
    return item ? item.step : 1;
  }

  /**
   * Completion percentage (0 to 100%)
   */
  static getProgressPercentage(status: string): number {
    const norm = this.normalizeStatus(status);
    if (norm === 'CANCELLED') return 0;
    if (norm === 'COMPLETED') return 100;
    const step = this.getTimelineStep(norm);
    return Math.min(100, Math.round((step / 11) * 100));
  }

  /**
   * Terminal state check
   */
  static isTerminal(status: string): boolean {
    const norm = this.normalizeStatus(status);
    return norm === 'COMPLETED' || norm === 'CANCELLED';
  }

  /**
   * Styling tags for badges
   */
  static getStatusStyle(status: string): {
    badgeClass: string;
    dotClass: string;
    textClass: string;
    bgClass: string;
  } {
    const norm = this.normalizeStatus(status);
    switch (norm) {
      case 'BOOKING_CONFIRMED':
        return {
          badgeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          dotClass: 'bg-blue-400',
          textClass: 'text-blue-400',
          bgClass: 'bg-blue-500/10'
        };
      case 'VEHICLE_RECEIVED':
        return {
          badgeClass: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
          dotClass: 'bg-indigo-400',
          textClass: 'text-indigo-400',
          bgClass: 'bg-indigo-500/10'
        };
      case 'INSPECTION':
      case 'DIAGNOSIS':
        return {
          badgeClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
          dotClass: 'bg-purple-400 animate-pulse',
          textClass: 'text-purple-400',
          bgClass: 'bg-purple-500/10'
        };
      case 'QUOTE_PENDING':
      case 'APPROVAL_PENDING':
        return {
          badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          dotClass: 'bg-amber-400 animate-ping',
          textClass: 'text-amber-400',
          bgClass: 'bg-amber-500/10'
        };
      case 'PARTS_RESERVED':
        return {
          badgeClass: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
          dotClass: 'bg-cyan-400',
          textClass: 'text-cyan-400',
          bgClass: 'bg-cyan-500/10'
        };
      case 'WORK_IN_PROGRESS':
        return {
          badgeClass: 'bg-[#ff5500]/15 text-[#ff5500] border-[#ff5500]/30',
          dotClass: 'bg-[#ff5500] animate-pulse',
          textClass: 'text-[#ff5500]',
          bgClass: 'bg-[#ff5500]/10'
        };
      case 'QUALITY_CHECK':
        return {
          badgeClass: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
          dotClass: 'bg-pink-400',
          textClass: 'text-pink-400',
          bgClass: 'bg-pink-500/10'
        };
      case 'READY_FOR_DELIVERY':
      case 'OUT_FOR_DELIVERY':
        return {
          badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          dotClass: 'bg-emerald-400 animate-pulse',
          textClass: 'text-emerald-400',
          bgClass: 'bg-emerald-500/10'
        };
      case 'COMPLETED':
        return {
          badgeClass: 'bg-green-500/15 text-green-400 border-green-500/30',
          dotClass: 'bg-green-400',
          textClass: 'text-green-400',
          bgClass: 'bg-green-500/10'
        };
      case 'CANCELLED':
        return {
          badgeClass: 'bg-red-500/15 text-red-400 border-red-500/30',
          dotClass: 'bg-red-400',
          textClass: 'text-red-400',
          bgClass: 'bg-red-500/10'
        };
      default:
        return {
          badgeClass: 'bg-neutral-500/15 text-neutral-400 border-neutral-500/30',
          dotClass: 'bg-neutral-400',
          textClass: 'text-neutral-400',
          bgClass: 'bg-neutral-500/10'
        };
    }
  }
}
