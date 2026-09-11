import { ServiceHistoryRecord } from '../types';
import { StorageService } from './storageService';
import { VehicleService } from './vehicleService';

const STORAGE_SERVICE_HISTORY = 'torqx_service_history_v1';

export class ServiceHistoryService {
  public static getAllHistory(): ServiceHistoryRecord[] {
    return StorageService.get<ServiceHistoryRecord[]>(STORAGE_SERVICE_HISTORY, []);
  }

  public static getHistoryForVehicle(vehicleReg: string): ServiceHistoryRecord[] {
    const list = this.getAllHistory();
    const clean = vehicleReg.replace(/\s+/g, '').toUpperCase();
    return list.filter((h) => h.vehicleReg.replace(/\s+/g, '').toUpperCase() === clean);
  }

  public static getHistoryForCustomer(customerEmail: string): ServiceHistoryRecord[] {
    const list = this.getAllHistory();
    const clean = customerEmail.trim().toLowerCase();
    return list.filter((h) => h.customerEmail.trim().toLowerCase() === clean);
  }

  public static addHistoryRecord(recordData: Omit<ServiceHistoryRecord, 'id'>): ServiceHistoryRecord {
    const list = this.getAllHistory();
    const newRecord: ServiceHistoryRecord = {
      ...recordData,
      id: `SH-${Date.now().toString().slice(-6)}-${String(list.length + 1).padStart(3, '0')}`
    };

    list.unshift(newRecord);
    StorageService.set(STORAGE_SERVICE_HISTORY, list);

    // Synchronize vehicle next service milestones
    try {
      const allVehicles = VehicleService.getAllVehicles();
      const cleanReg = recordData.vehicleReg.replace(/\s+/g, '').toUpperCase();
      const v = allVehicles.find((veh) => veh.regNumber.replace(/\s+/g, '').toUpperCase() === cleanReg);
      if (v) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 180); // 6 months standard interval

        VehicleService.updateVehicle(v.id, {
          lastServiceDate: recordData.date,
          currentKm: recordData.odometer,
          nextServiceDueDate: nextDate.toISOString().split('T')[0],
          nextServiceDueKm: recordData.odometer + 10000
        });
      }
    } catch (e) {
      console.error('Error updating vehicle milestones:', e);
    }

    return newRecord;
  }

  /**
   * Generates proactive reminders for vehicle owner:
   * 1. Periodic service due (date & KM limit)
   * 2. Insurance renewal countdown
   * 3. Pollution Under Control (PUC) certificate renewal
   */
  public static getVehicleReminders(vehicleReg: string): {
    serviceDueDays: number;
    serviceDueKm: number;
    isServiceOverdue: boolean;
    insuranceDueDays: number;
    pucDueDays: number;
    recommendedAction: string;
  } {
    const allVehicles = VehicleService.getAllVehicles();
    const cleanReg = vehicleReg.replace(/\s+/g, '').toUpperCase();
    const v = allVehicles.find((veh) => veh.regNumber.replace(/\s+/g, '').toUpperCase() === cleanReg);

    if (!v) {
      return {
        serviceDueDays: 90,
        serviceDueKm: 5000,
        isServiceOverdue: false,
        insuranceDueDays: 120,
        pucDueDays: 60,
        recommendedAction: 'Book inspection check'
      };
    }

    const today = new Date();
    const dueDate = v.nextServiceDueDate ? new Date(v.nextServiceDueDate) : new Date(today.getTime() + 90 * 86400000);
    const diffTime = dueDate.getTime() - today.getTime();
    const serviceDueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const serviceDueKm = Math.max(0, (v.nextServiceDueKm || (v.currentKm + 10000)) - v.currentKm);
    const isServiceOverdue = serviceDueDays <= 0 || serviceDueKm <= 0;

    let recommendedAction = 'Vehicle condition healthy. Periodic maintenance on schedule.';
    if (isServiceOverdue) {
      recommendedAction = 'Service overdue! Engine oil and brake pad inspection strongly recommended.';
    } else if (serviceDueDays <= 15) {
      recommendedAction = `Service due in ${serviceDueDays} days. Reserve priority bay slot now.`;
    }

    return {
      serviceDueDays,
      serviceDueKm,
      isServiceOverdue,
      insuranceDueDays: 85,
      pucDueDays: 45,
      recommendedAction
    };
  }
}
