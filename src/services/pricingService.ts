import { PriceBreakdown, VehicleCategory, Coupon } from '../types';
import { COMPREHENSIVE_SERVICES, ADDON_OPTIONS, PICKUP_DROP_PRICES } from '../data/pricingData';
import { VEHICLE_DATABASE } from '../data/vehicleData';
import { StorageService, STORAGE_KEYS } from './storageService';

export class PricingService {
  /**
   * Look up vehicle category & variant multiplier
   */
  public static getVehicleSpecs(brandName?: string, modelName?: string, variantName?: string): {
    category: VehicleCategory;
    multiplier: number;
  } {
    if (!brandName) return { category: 'premium', multiplier: 1.0 };

    const brand = VEHICLE_DATABASE.find(
      (b) => b.name.toLowerCase() === brandName.toLowerCase()
    );

    if (!brand) return { category: 'economy', multiplier: 1.0 };

    if (!modelName) return { category: brand.category, multiplier: 1.0 };

    const model = brand.models.find(
      (m) => m.name.toLowerCase() === modelName.toLowerCase()
    );

    if (!model) return { category: brand.category, multiplier: 1.0 };

    let multiplier = 1.0;
    if (variantName && model.variants.length > 0) {
      const variant = model.variants.find(
        (v) => v.name.toLowerCase() === variantName.toLowerCase()
      );
      if (variant) {
        multiplier = variant.multiplier;
      }
    }

    return {
      category: model.category,
      multiplier
    };
  }

  /**
   * Calculate precise price breakdown with GST and coupons
   */
  public static calculatePricing(params: {
    brandName?: string;
    modelName?: string;
    variantName?: string;
    serviceId: string;
    addonIds?: string[];
    pickupDrop?: 'garage_drop' | 'pickup_only' | 'pickup_and_drop';
    couponCode?: string;
  }): PriceBreakdown {
    const {
      brandName,
      modelName,
      variantName,
      serviceId,
      addonIds = [],
      pickupDrop = 'garage_drop',
      couponCode
    } = params;

    const { category, multiplier } = this.getVehicleSpecs(brandName, modelName, variantName);

    // Find service
    const service = COMPREHENSIVE_SERVICES.find((s) => s.id === serviceId) || COMPREHENSIVE_SERVICES[0];

    // Get category base rate
    let baseRaw = service.basePriceEconomy;
    if (category === 'premium') {
      baseRaw = service.basePricePremium;
    } else if (category === 'luxury') {
      baseRaw = service.basePriceLuxury;
    }

    // Apply trim multiplier and round to clean 50s
    const adjustedBase = Math.round((baseRaw * multiplier) / 50) * 50;

    // Component breakdown estimates
    const partsEstimate = Math.round((adjustedBase * 0.35) / 50) * 50;
    const labourCharges = Math.round((adjustedBase * 0.25) / 50) * 50;
    const serviceBasePrice = adjustedBase;

    // Calculate addons
    let addonsTotal = 0;
    if (addonIds.length > 0) {
      addonIds.forEach((id) => {
        const addon = ADDON_OPTIONS.find((a) => a.id === id);
        if (addon) {
          if (category === 'luxury') {
            addonsTotal += addon.priceLuxury;
          } else if (category === 'premium') {
            addonsTotal += addon.pricePremium;
          } else {
            addonsTotal += addon.priceEconomy;
          }
        }
      });
    }

    // Pickup & drop fee
    const pickupDropFee = PICKUP_DROP_PRICES[pickupDrop] || 0;

    // Subtotal
    const subtotal = serviceBasePrice + partsEstimate + labourCharges + addonsTotal + pickupDropFee;

    // Apply Coupon if valid
    let discountAmount = 0;
    let appliedCoupon: Coupon | undefined;

    if (couponCode) {
      const coupons = StorageService.get<Coupon[]>(STORAGE_KEYS.COUPONS, []);
      const found = coupons.find(
        (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active
      );

      if (found && subtotal >= found.minOrder) {
        appliedCoupon = found;
        if (found.discountType === 'percentage') {
          const rawDiscount = (subtotal * found.value) / 100;
          discountAmount = found.maxDiscount ? Math.min(rawDiscount, found.maxDiscount) : rawDiscount;
        } else {
          discountAmount = found.value;
        }
        discountAmount = Math.round(discountAmount);
      }
    }

    const discountedSubtotal = Math.max(0, subtotal - discountAmount);

    // GST @ 18%
    const gstAmount = Math.round(discountedSubtotal * 0.18);

    // Grand total
    const grandTotal = discountedSubtotal + gstAmount;

    return {
      serviceBasePrice,
      partsEstimate,
      labourCharges,
      addonsTotal,
      pickupDropFee,
      subtotal,
      discountAmount,
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      gstAmount,
      grandTotal,
      isInspectionSubject: service.isInspectionDependent
    };
  }

  /**
   * Returns display string e.g. "From ₹3,499" or "Starting from ₹3,499"
   */
  public static getServicePriceDisplay(serviceId: string, brandName?: string, modelName?: string): {
    display: string;
    isEstimate: boolean;
    note?: string;
  } {
    const service = COMPREHENSIVE_SERVICES.find((s) => s.id === serviceId);
    if (!service) return { display: 'Contact for Quote', isEstimate: true };

    const { category } = this.getVehicleSpecs(brandName, modelName);
    let price = service.basePriceEconomy;
    if (category === 'premium') price = service.basePricePremium;
    if (category === 'luxury') price = service.basePriceLuxury;

    if (service.isInspectionDependent) {
      return {
        display: `Starting from ₹${price.toLocaleString('en-IN')}`,
        isEstimate: true,
        note: 'Final price may vary after vehicle inspection.'
      };
    }

    return {
      display: `From ₹${price.toLocaleString('en-IN')}`,
      isEstimate: false
    };
  }

  public static formatCurrency(val: number): string {
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  }

  /**
   * Service Package Management
   */
  public static getAllPackages() {
    return StorageService.get(STORAGE_KEYS.PACKAGES, []);
  }

  public static getAllCoupons(): Coupon[] {
    return StorageService.get<Coupon[]>(STORAGE_KEYS.COUPONS, []);
  }

  public static validateCoupon(code: string, subtotal: number): {
    valid: boolean;
    discountAmount: number;
    message: string;
    coupon?: Coupon;
  } {
    if (!code || !code.trim()) {
      return { valid: false, discountAmount: 0, message: 'Please enter a coupon code.' };
    }

    const coupons = this.getAllCoupons();
    const found = coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.active
    );

    if (!found) {
      return { valid: false, discountAmount: 0, message: 'Invalid or expired coupon code.' };
    }

    if (subtotal < found.minOrder) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Minimum order of ₹${found.minOrder.toLocaleString('en-IN')} required for ${found.code}.`
      };
    }

    let discountAmount = 0;
    if (found.discountType === 'percentage') {
      const raw = (subtotal * found.value) / 100;
      discountAmount = found.maxDiscount ? Math.min(raw, found.maxDiscount) : raw;
    } else {
      discountAmount = found.value;
    }

    return {
      valid: true,
      discountAmount: Math.round(discountAmount),
      message: `Coupon ${found.code} applied! Saved ₹${Math.round(discountAmount).toLocaleString('en-IN')}`,
      coupon: found
    };
  }
}
