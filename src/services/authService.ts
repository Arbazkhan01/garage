import { UserProfile, UserRole } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { DEMO_CUSTOMERS } from '../data/demoData';

export class AuthService {
  private static listeners: ((user: UserProfile) => void)[] = [];

  public static subscribe(callback: (user: UserProfile) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private static notify(user: UserProfile): void {
    this.listeners.forEach((cb) => cb(user));
  }

  public static getCurrentUser(): UserProfile {
    return StorageService.get<UserProfile>(STORAGE_KEYS.CURRENT_USER, DEMO_CUSTOMERS[0]);
  }

  public static setCurrentUser(user: UserProfile): void {
    StorageService.set(STORAGE_KEYS.CURRENT_USER, user);
    this.notify(user);
  }

  public static getAllUsers(): UserProfile[] {
    return StorageService.get<UserProfile[]>(STORAGE_KEYS.USERS, DEMO_CUSTOMERS);
  }

  public static switchRole(role: UserRole): UserProfile {
    const users = this.getAllUsers();
    let target = users.find((u) => u.role === role);

    if (!target) {
      if (role === 'admin') {
        target = {
          id: 'user-admin',
          name: 'Kunal Singhania (Garage Manager)',
          email: 'manager@torqxautocare.com',
          phone: '+91 98765 43210',
          role: 'admin',
          memberSince: 'Founding Member'
        };
      } else if (role === 'technician') {
        target = {
          id: 'user-tech1',
          name: 'Rahul Sharma (Master Tech)',
          email: 'rahul.s@torqxautocare.com',
          phone: '+91 98220 11450',
          role: 'technician',
          memberSince: 'January 2022'
        };
      } else {
        target = DEMO_CUSTOMERS[0];
      }
    }

    this.setCurrentUser(target);
    return target;
  }

  public static login(email: string, role: UserRole = 'customer'): UserProfile {
    const users = this.getAllUsers();
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      user = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
        phone: '+91 98765 00000',
        role,
        memberSince: 'Just now'
      };
      users.push(user);
      StorageService.set(STORAGE_KEYS.USERS, users);
    }

    this.setCurrentUser(user);
    return user;
  }

  public static register(params: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  }): UserProfile {
    const users = this.getAllUsers();
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: params.name,
      email: params.email,
      phone: params.phone,
      address: params.address,
      role: 'customer',
      memberSince: 'Just now'
    };
    users.push(newUser);
    StorageService.set(STORAGE_KEYS.USERS, users);
    this.setCurrentUser(newUser);
    return newUser;
  }

  public static logout(): void {
    // Revert to demo customer
    this.setCurrentUser(DEMO_CUSTOMERS[0]);
  }
}
