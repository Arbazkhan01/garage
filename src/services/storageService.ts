import {
  DEMO_CUSTOMERS,
  DEMO_VEHICLES,
  DEMO_BOOKINGS,
  DEMO_INSPECTIONS,
  DEMO_QUOTATIONS,
  DEMO_INVOICES,
  DEMO_NOTIFICATIONS,
  DEMO_SERVICE_HISTORY
} from '../data/demoData';
import { INITIAL_TECHNICIANS, INITIAL_SERVICE_BAYS } from '../data/technicianData';
import { INITIAL_COUPONS } from '../data/pricingData';
import { TESTIMONIALS_DATA } from '../data/automotiveData';
import { INITIAL_INVENTORY_PARTS } from '../data/inventoryData';
import { INITIAL_JOB_CARDS } from '../data/jobCardData';
import { INITIAL_PICKUP_DROP_REQUESTS } from '../data/pickupDropData';
import { INITIAL_AUDIT_LOGS } from '../data/auditLogData';
import { INITIAL_SERVICE_PACKAGES } from '../data/packageData';
import { ReviewItem } from '../types';

export const STORAGE_KEYS = {
  CURRENT_USER: 'torqx_current_user',
  USERS: 'torqx_users',
  SESSIONS: 'torqx_sessions',
  VEHICLES: 'torqx_vehicles',
  BOOKINGS: 'torqx_bookings',
  JOB_CARDS: 'torqx_job_cards',
  INSPECTIONS: 'torqx_inspections',
  QUOTATIONS: 'torqx_quotes',
  INVOICES: 'torqx_invoices',
  PAYMENTS: 'torqx_payments',
  TECHNICIANS: 'torqx_technicians',
  BAYS: 'torqx_bays',
  SERVICE_BAYS: 'torqx_bays',
  SERVICE_HISTORY: 'torqx_service_history_v1',
  INVENTORY: 'torqx_inventory',
  PICKUP_DROP: 'torqx_pickup_drop',
  COUPONS: 'torqx_coupons',
  NOTIFICATIONS: 'torqx_notifications',
  AUDIT_LOGS: 'torqx_audit_logs',
  PACKAGES: 'torqx_packages',
  PRICING: 'torqx_pricing',
  REVIEWS: 'torqx_reviews',
  SETTINGS: 'torqx_settings'
};

export class StorageService {
  private static isInitialized = false;

  public static init(): void {
    if (this.isInitialized) return;

    // Check if initial data already populated
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEMO_CUSTOMERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      // Default to Vikram Mehta (customer)
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_CUSTOMERS[0]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.VEHICLES)) {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(DEMO_VEHICLES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(DEMO_BOOKINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.JOB_CARDS)) {
      localStorage.setItem(STORAGE_KEYS.JOB_CARDS, JSON.stringify(INITIAL_JOB_CARDS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY_PARTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PICKUP_DROP)) {
      localStorage.setItem(STORAGE_KEYS.PICKUP_DROP, JSON.stringify(INITIAL_PICKUP_DROP_REQUESTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PACKAGES)) {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(INITIAL_SERVICE_PACKAGES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INSPECTIONS)) {
      localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(DEMO_INSPECTIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.QUOTATIONS)) {
      localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(DEMO_QUOTATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(DEMO_INVOICES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TECHNICIANS)) {
      localStorage.setItem(STORAGE_KEYS.TECHNICIANS, JSON.stringify(INITIAL_TECHNICIANS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BAYS)) {
      localStorage.setItem(STORAGE_KEYS.BAYS, JSON.stringify(INITIAL_SERVICE_BAYS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COUPONS)) {
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEMO_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SERVICE_HISTORY)) {
      localStorage.setItem(STORAGE_KEYS.SERVICE_HISTORY, JSON.stringify(DEMO_SERVICE_HISTORY));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      const initialReviews: ReviewItem[] = TESTIMONIALS_DATA.map((t, idx) => ({
        id: `rev-${idx + 1}`,
        name: t.name,
        location: t.location,
        carModel: t.carModel,
        rating: t.rating,
        quote: t.quote,
        serviceType: t.serviceType,
        avatar: t.avatar,
        approved: true,
        date: '2026-08-20'
      }));
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(initialReviews));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify({
          garageName: 'TORQX AUTOCARE',
          phone: '+91 98765 43210',
          email: 'service@torqxautocare.com',
          address: '123 Automotive Avenue, Baner-Balewadi Tech Corridor, Pune, MH 411045',
          gstRate: 18,
          defaultPickupFee: 299,
          defaultPickupDropFee: 499,
          autoAssignBays: true
        })
      );
    }

    this.isInitialized = true;
  }

  public static get<T>(key: string, defaultValue: T): T {
    this.init();
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error(`Error reading key ${key} from storage:`, e);
      return defaultValue;
    }
  }

  public static set<T>(key: string, value: T): void {
    this.init();
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing key ${key} to storage:`, e);
    }
  }

  public static resetToFactoryDemo(): void {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    this.isInitialized = false;
    this.init();
  }
}
