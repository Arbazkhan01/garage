import { InventoryPart, PartRequest } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { INITIAL_INVENTORY_PARTS } from '../data/inventoryData';
import { NotificationService } from './notificationService';
import { AuditService } from './auditService';

export class InventoryService {
  public static getAllParts(): InventoryPart[] {
    return StorageService.get<InventoryPart[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY_PARTS);
  }

  public static getPartById(id: string): InventoryPart | null {
    const list = this.getAllParts();
    return list.find((p) => p.id === id || p.partNumber.toLowerCase() === id.toLowerCase()) || null;
  }

  public static getAvailableStock(id: string): number {
    const part = this.getPartById(id);
    if (!part) return 0;
    return Math.max(0, part.stockQuantity - (part.reservedQuantity || 0));
  }

  public static checkStockAvailability(id: string, quantity: number): {
    available: boolean;
    currentStock: number;
    reserved: number;
    freeStock: number;
    part: InventoryPart | null;
  } {
    const part = this.getPartById(id);
    if (!part) {
      return { available: false, currentStock: 0, reserved: 0, freeStock: 0, part: null };
    }
    const reserved = part.reservedQuantity || 0;
    const freeStock = Math.max(0, part.stockQuantity - reserved);
    return {
      available: freeStock >= quantity,
      currentStock: part.stockQuantity,
      reserved,
      freeStock,
      part
    };
  }

  public static addPart(partData: Omit<InventoryPart, 'id' | 'createdAt' | 'reservedQuantity'>): InventoryPart {
    const list = this.getAllParts();
    const newPart: InventoryPart = {
      ...partData,
      id: `PART-${String(list.length + 1).padStart(3, '0')}`,
      reservedQuantity: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    list.unshift(newPart);
    StorageService.set(STORAGE_KEYS.INVENTORY, list);

    AuditService.logAction(
      'user-admin',
      'Inventory Manager',
      'CREATE_PART',
      `Added new inventory part: ${newPart.name} (${newPart.partNumber}) - Initial Stock: ${newPart.stockQuantity}`
    );

    return newPart;
  }

  public static updatePart(id: string, updates: Partial<InventoryPart>): InventoryPart | null {
    const list = this.getAllParts();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    list[idx] = { ...list[idx], ...updates };
    StorageService.set(STORAGE_KEYS.INVENTORY, list);
    return list[idx];
  }

  public static deletePart(id: string): boolean {
    const list = this.getAllParts();
    const filtered = list.filter((p) => p.id !== id);
    if (filtered.length === list.length) return false;
    StorageService.set(STORAGE_KEYS.INVENTORY, filtered);
    return true;
  }

  public static adjustStock(id: string, newQuantity: number, reason?: string): InventoryPart | null {
    const list = this.getAllParts();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    const oldQty = list[idx].stockQuantity;
    list[idx].stockQuantity = Math.max(0, newQuantity);
    StorageService.set(STORAGE_KEYS.INVENTORY, list);

    AuditService.logAction(
      'user-admin',
      'Inventory Manager',
      'STOCK_ADJUSTMENT',
      `Manual stock count adjusted for ${list[idx].name} from ${oldQty} to ${newQuantity}. Reason: ${reason || 'Physical cycle count'}`
    );

    if (list[idx].stockQuantity <= list[idx].minStock) {
      NotificationService.notifyUser(
        'user-admin',
        'Low Stock Warning',
        `Part "${list[idx].name}" is at ${list[idx].stockQuantity} units (Min threshold: ${list[idx].minStock}). ${reason || ''}`,
        'warning'
      );
    }

    return list[idx];
  }

  /**
   * Reserves stock when technician adds a part to Job Card.
   * Checks if Free Stock (stockQuantity - reservedQuantity) >= quantity.
   */
  public static reserveStock(id: string, quantity: number): { success: boolean; message: string; part?: InventoryPart } {
    const list = this.getAllParts();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return { success: false, message: 'Part not found in inventory catalog' };

    const part = list[idx];
    const reserved = part.reservedQuantity || 0;
    const free = part.stockQuantity - reserved;

    if (free < quantity) {
      // Stock unavailable - notify admin & block
      NotificationService.notifyUser(
        'user-admin',
        'Stock Allocation Blocked',
        `Job requested ${quantity}x "${part.name}" but only ${Math.max(0, free)} units available in warehouse. Stock procurement needed.`,
        'warning'
      );
      return {
        success: false,
        message: `Insufficient stock for ${part.name}. Only ${Math.max(0, free)} unit(s) available.`
      };
    }

    list[idx].reservedQuantity = reserved + quantity;
    StorageService.set(STORAGE_KEYS.INVENTORY, list);

    AuditService.logAction(
      'system',
      'TORQX Automation',
      'RESERVE_STOCK',
      `Reserved ${quantity} units of ${part.name} for active job.`
    );

    return { success: true, message: `Successfully reserved ${quantity} units of ${part.name}`, part: list[idx] };
  }

  /**
   * Releases previously reserved stock (e.g. if part is removed from job or job cancelled)
   */
  public static releaseReservedStock(id: string, quantity: number): boolean {
    const list = this.getAllParts();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return false;

    list[idx].reservedQuantity = Math.max(0, (list[idx].reservedQuantity || 0) - quantity);
    StorageService.set(STORAGE_KEYS.INVENTORY, list);

    AuditService.logAction(
      'system',
      'TORQX Automation',
      'RELEASE_STOCK',
      `Released ${quantity} reserved units of ${list[idx].name} back to available stock.`
    );

    return true;
  }

  /**
   * Deducts reserved stock when job reaches completion.
   * Total Stock = Total Stock - Quantity
   * Reserved = Reserved - Quantity
   */
  public static deductStock(id: string, quantity: number): boolean {
    const list = this.getAllParts();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return false;

    const part = list[idx];
    list[idx].stockQuantity = Math.max(0, part.stockQuantity - quantity);
    list[idx].reservedQuantity = Math.max(0, (part.reservedQuantity || 0) - quantity);
    StorageService.set(STORAGE_KEYS.INVENTORY, list);

    AuditService.logAction(
      'system',
      'TORQX Automation',
      'DEDUCT_STOCK',
      `Deducted ${quantity} units of ${part.name} upon job completion. Remaining stock: ${list[idx].stockQuantity}.`
    );

    if (list[idx].stockQuantity <= list[idx].minStock) {
      NotificationService.notifyUser(
        'user-admin',
        'Low Stock Alert',
        `Part "${part.name}" reached low threshold: ${list[idx].stockQuantity} units left (Min: ${part.minStock}).`,
        'warning'
      );
    }
    return true;
  }

  public static getLowStockParts(): InventoryPart[] {
    const list = this.getAllParts();
    return list.filter((p) => p.stockQuantity <= p.minStock && p.stockQuantity > 0);
  }

  public static getOutOfStockParts(): InventoryPart[] {
    const list = this.getAllParts();
    return list.filter((p) => p.stockQuantity === 0);
  }

  // Part Requests Workflow
  private static readonly STORAGE_PART_REQUESTS = 'torqx_part_requests_v1';

  public static getAllPartRequests(): PartRequest[] {
    return StorageService.get<PartRequest[]>(this.STORAGE_PART_REQUESTS, []);
  }

  public static createPartRequest(data: {
    jobCardId: string;
    technicianId: string;
    technicianName: string;
    partId: string;
    quantity: number;
    notes?: string;
  }): { success: boolean; request?: PartRequest; message: string } {
    const part = this.getPartById(data.partId);
    if (!part) return { success: false, message: 'Part not found' };

    const requests = this.getAllPartRequests();
    const newReq: PartRequest = {
      id: `PR-${Date.now().toString().slice(-6)}`,
      jobCardId: data.jobCardId,
      technicianId: data.technicianId,
      technicianName: data.technicianName,
      partId: part.id,
      partName: part.name,
      partNumber: part.partNumber,
      quantity: data.quantity,
      status: 'REQUESTED',
      requestedAt: new Date().toISOString(),
      notes: data.notes
    };

    requests.unshift(newReq);
    StorageService.set(this.STORAGE_PART_REQUESTS, requests);

    NotificationService.notifyUser(
      'user-admin',
      'New Part Requisition',
      `${data.technicianName} requested ${data.quantity}x ${part.name} for Job ${data.jobCardId}.`,
      'info'
    );

    return { success: true, request: newReq, message: 'Requisition submitted to parts warehouse' };
  }

  public static approveAndReservePartRequest(requestId: string): { success: boolean; message: string } {
    const requests = this.getAllPartRequests();
    const req = requests.find((r) => r.id === requestId);
    if (!req) return { success: false, message: 'Request not found' };

    const reserveRes = this.reserveStock(req.partId, req.quantity);
    if (!reserveRes.success) {
      return { success: false, message: reserveRes.message };
    }

    req.status = 'RESERVED';
    req.resolvedAt = new Date().toISOString();
    StorageService.set(this.STORAGE_PART_REQUESTS, requests);

    NotificationService.notifyUser(
      req.technicianId,
      'Part Request Approved',
      `Warehouse approved and reserved ${req.quantity}x ${req.partName} for ${req.jobCardId}.`,
      'success'
    );

    return { success: true, message: 'Part request approved and stock reserved' };
  }
}
