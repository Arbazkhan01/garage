import { CustomerVehicle, VehicleBrand, VehicleModel, VehicleVariant } from '../types';
import { VEHICLE_DATABASE } from '../data/vehicleData';
import { StorageService, STORAGE_KEYS } from './storageService';

export class VehicleService {
  public static getAllBrands(): VehicleBrand[] {
    return VEHICLE_DATABASE;
  }

  public static getModelsForBrand(brandName: string): VehicleModel[] {
    const brand = VEHICLE_DATABASE.find(
      (b) => b.name.toLowerCase() === brandName.toLowerCase()
    );
    return brand ? brand.models : [];
  }

  public static getVariantsForModel(brandName: string, modelName: string): VehicleVariant[] {
    const models = this.getModelsForBrand(brandName);
    const model = models.find(
      (m) => m.name.toLowerCase() === modelName.toLowerCase()
    );
    return model ? model.variants : [];
  }

  public static getUserVehicles(userId: string): CustomerVehicle[] {
    const all = StorageService.get<CustomerVehicle[]>(STORAGE_KEYS.VEHICLES, []);
    return all.filter((v) => v.userId === userId);
  }

  public static getAllVehicles(): CustomerVehicle[] {
    return StorageService.get<CustomerVehicle[]>(STORAGE_KEYS.VEHICLES, []);
  }

  public static addVehicle(
    vehicle: Omit<CustomerVehicle, 'id' | 'createdAt'>
  ): CustomerVehicle {
    const all = StorageService.get<CustomerVehicle[]>(STORAGE_KEYS.VEHICLES, []);
    const newVehicle: CustomerVehicle = {
      ...vehicle,
      id: `veh-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    all.unshift(newVehicle);
    StorageService.set(STORAGE_KEYS.VEHICLES, all);
    return newVehicle;
  }

  public static updateVehicle(updated: CustomerVehicle): void {
    const all = StorageService.get<CustomerVehicle[]>(STORAGE_KEYS.VEHICLES, []);
    const index = all.findIndex((v) => v.id === updated.id);
    if (index !== -1) {
      all[index] = updated;
      StorageService.set(STORAGE_KEYS.VEHICLES, all);
    }
  }

  public static deleteVehicle(id: string): void {
    const all = StorageService.get<CustomerVehicle[]>(STORAGE_KEYS.VEHICLES, []);
    const filtered = all.filter((v) => v.id !== id);
    StorageService.set(STORAGE_KEYS.VEHICLES, filtered);
  }
}
