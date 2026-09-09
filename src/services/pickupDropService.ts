import { PickupDropRequest, PickupDropStatus } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { INITIAL_PICKUP_DROP_REQUESTS } from '../data/pickupDropData';
import { NotificationService } from './notificationService';

export class PickupDropService {
  public static getAllRequests(): PickupDropRequest[] {
    return StorageService.get<PickupDropRequest[]>(STORAGE_KEYS.PICKUP_DROP, INITIAL_PICKUP_DROP_REQUESTS);
  }

  public static getRequestById(id: string): PickupDropRequest | null {
    const list = this.getAllRequests();
    return list.find((r) => r.id === id || r.bookingId === id) || null;
  }

  public static getRequestByBooking(bookingId: string): PickupDropRequest | null {
    const list = this.getAllRequests();
    return list.find((r) => r.bookingId === bookingId) || null;
  }

  public static assignDriver(
    requestId: string,
    driverName: string,
    driverPhone: string
  ): PickupDropRequest | null {
    const list = this.getAllRequests();
    const idx = list.findIndex((r) => r.id === requestId);
    if (idx === -1) return null;

    list[idx].driverName = driverName;
    list[idx].driverPhone = driverPhone;
    list[idx].status = 'DRIVER_ASSIGNED';
    StorageService.set(STORAGE_KEYS.PICKUP_DROP, list);

    NotificationService.notifyUser(
      list[idx].customerPhone,
      'Valet Chauffeur Assigned',
      `Driver ${driverName} (${driverPhone}) has been assigned to pick up your vehicle for Booking #${list[idx].bookingId}.`,
      'info'
    );

    return list[idx];
  }

  public static updateStatus(
    requestId: string,
    status: PickupDropStatus,
    notes?: string
  ): PickupDropRequest | null {
    const list = this.getAllRequests();
    const idx = list.findIndex((r) => r.id === requestId);
    if (idx === -1) return null;

    list[idx].status = status;
    if (notes) {
      list[idx].notes = (list[idx].notes ? list[idx].notes + ' | ' : '') + notes;
    }
    StorageService.set(STORAGE_KEYS.PICKUP_DROP, list);

    // Notify Customer on key milestones
    if (status === 'DRIVER_EN_ROUTE') {
      NotificationService.notifyUser(
        list[idx].customerPhone,
        'Driver En Route',
        `Valet chauffeur ${list[idx].driverName || 'Driver'} is heading to your location.`,
        'info'
      );
    } else if (status === 'AT_WORKSHOP') {
      NotificationService.notifyUser(
        list[idx].customerPhone,
        'Vehicle Arrived at Workshop',
        `Your ${list[idx].vehicleInfo} has safely arrived at TORQX Service Bay.`,
        'success'
      );
    } else if (status === 'DELIVERED') {
      NotificationService.notifyUser(
        list[idx].customerPhone,
        'Vehicle Delivered',
        `Your vehicle has been successfully handed over after servicing. Thank you for choosing TORQX AUTOCARE!`,
        'success'
      );
    }

    return list[idx];
  }

  public static createRequest(data: {
    bookingId: string;
    customerName: string;
    customerPhone: string;
    vehicleInfo: string;
    pickupAddress: string;
    dropAddress: string;
    date: string;
    time: string;
    notes?: string;
  }): PickupDropRequest {
    const list = this.getAllRequests();
    const newReq: PickupDropRequest = {
      id: `PUD-${String(list.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'REQUESTED'
    };
    list.unshift(newReq);
    StorageService.set(STORAGE_KEYS.PICKUP_DROP, list);
    return newReq;
  }
}
