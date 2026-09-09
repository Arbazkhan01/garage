import { InventoryPart } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { INITIAL_INVENTORY_PARTS } from '../data/inventoryData';
import { NotificationService } from './notificationService';

export class InventoryService {
  public static getAllParts(): InventoryPart[] {
    return StorageService.get<InventoryPart[]>(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY_PARTS);
  }

  public static getPartById(id: string): InventoryPart | null {
    const list = this.getAllParts();
    return list.find((p) => p.id === id || p.partNumber.toLowerCase() === id.toLowerCase()) || null;
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

    list[idx].stockQuantity = Math.max(0, newQuantity);
    StorageService.set(STORAGE_KEYS.INVENTORY, list);

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

  public static reserveStock(id: string, quantity: number): boolean {
    const list = this.getAllParts();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return false;

    if (list[idx].stockQuantity >= quantity) {
      list[idx].reservedQuantity += quantity;
      StorageService.set(STORAGE_KEYS.INVENTORY, list);
      return true;
    }
    return false;
  }

  public static deductStock(id: string, quantity: number): boolean {
    const list = this.getAllParts();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return false;

    list[idx].stockQuantity = Math.max(0, list[idx].stockQuantity - quantity);
    list[idx].reservedQuantity = Math.max(0, list[idx].reservedQuantity - quantity);
    StorageService.set(STORAGE_KEYS.INVENTORY, list);

    if (list[idx].stockQuantity <= list[idx].minStock) {
      NotificationService.notifyUser(
        'user-admin',
        'Low Stock Alert',
        `Part "${list[idx].name}" reached low stock: ${list[idx].stockQuantity} units left.`,
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
}
