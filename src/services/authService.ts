import { UserProfile, UserRole } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { DEMO_CUSTOMERS } from '../data/demoData';

export interface AuthSession {
  userId: string;
  token: string;
  expiresAt: number;
}

export interface StoredUserAccount extends UserProfile {
  passwordHash?: string;
  mobile?: string;
}

const DEFAULT_ACCOUNTS: StoredUserAccount[] = [
  {
    id: 'user-vikram',
    name: 'Vikram Mehta',
    email: 'vikram@torqx.com',
    phone: '+91 98221 44556',
    mobile: '9822144556',
    role: 'customer',
    address: 'A-402, Rohan Nilay, Aundh, Pune 411007',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    memberSince: 'March 2023',
    passwordHash: 'password123'
  },
  {
    id: 'user-admin',
    name: 'Rajesh Nair',
    email: 'admin@torqx.com',
    phone: '+91 98765 43210',
    mobile: '9876543210',
    role: 'admin',
    address: 'TORQX Autocare Operations Center, Baner, Pune',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    memberSince: 'Founding Member (2020)',
    passwordHash: 'password123'
  },
  {
    id: 'user-tech1',
    name: 'Rahul Sharma',
    email: 'rahul@torqx.com',
    phone: '+91 98220 11450',
    mobile: '9822011450',
    role: 'technician',
    address: 'Diagnostic Bay 01, TORQX Autocare, Pune',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    memberSince: 'January 2022',
    passwordHash: 'password123'
  }
];

export class AuthService {
  private static listeners: ((user: UserProfile | null) => void)[] = [];

  public static subscribe(callback: (user: UserProfile | null) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private static notify(user: UserProfile | null): void {
    this.listeners.forEach((cb) => cb(user));
  }

  public static getAllUsers(): StoredUserAccount[] {
    const existing = StorageService.get<StoredUserAccount[]>(STORAGE_KEYS.USERS, []);
    if (existing.length === 0) {
      StorageService.set(STORAGE_KEYS.USERS, DEFAULT_ACCOUNTS);
      return DEFAULT_ACCOUNTS;
    }
    // Ensure demo accounts are always present
    let updated = false;
    for (const def of DEFAULT_ACCOUNTS) {
      if (!existing.some((u) => u.email.toLowerCase() === def.email.toLowerCase())) {
        existing.push(def);
        updated = true;
      }
    }
    if (updated) {
      StorageService.set(STORAGE_KEYS.USERS, existing);
    }
    return existing;
  }

  public static getCurrentUser(): UserProfile {
    const user = StorageService.get<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null);
    return user || DEFAULT_ACCOUNTS[0];
  }

  public static setCurrentUser(user: UserProfile | null): void {
    if (user) {
      StorageService.set(STORAGE_KEYS.CURRENT_USER, user);
      StorageService.set(STORAGE_KEYS.SESSIONS, {
        userId: user.id,
        token: `jwt-sim-${user.id}-${Date.now()}`,
        expiresAt: Date.now() + 7 * 24 * 3600 * 1000
      });
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    }
    this.notify(user);
  }

  public static isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return !!user;
  }

  public static getUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  public static authenticate(identifier: string, password: string): { success: boolean; user?: UserProfile; error?: string } {
    const users = this.getAllUsers();
    const cleanId = identifier.trim().toLowerCase();

    // Match by email or phone digits
    const matched = users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        (u.phone && u.phone.replace(/\D/g, '').includes(cleanId.replace(/\D/g, ''))) ||
        (u.mobile && u.mobile.includes(cleanId))
    );

    if (!matched) {
      return { success: false, error: 'No account found with this email or mobile number.' };
    }

    // In this prototype, accept 'password123' or whatever password they set (or password length >= 6)
    if (matched.passwordHash && matched.passwordHash !== password && password !== 'password123' && password.length < 6) {
      return { success: false, error: 'Invalid credentials. Use password123 or registered password.' };
    }

    const { passwordHash, ...profile } = matched;
    this.setCurrentUser(profile);
    return { success: true, user: profile };
  }

  public static register(params: {
    name: string;
    email: string;
    phone: string;
    password: string;
    address?: string;
  }): { success: boolean; user?: UserProfile; error?: string } {
    const users = this.getAllUsers();
    if (users.some((u) => u.email.toLowerCase() === params.email.toLowerCase())) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    const newAccount: StoredUserAccount = {
      id: `user-${Date.now()}`,
      name: params.name,
      email: params.email.toLowerCase(),
      phone: params.phone,
      mobile: params.phone.replace(/\D/g, ''),
      address: params.address || 'Pune, MH',
      role: 'customer', // Self-registered accounts are always CUSTOMER role
      memberSince: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      passwordHash: params.password,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };

    users.push(newAccount);
    StorageService.set(STORAGE_KEYS.USERS, users);

    const { passwordHash, ...profile } = newAccount;
    this.setCurrentUser(profile);
    return { success: true, user: profile };
  }

  public static resetPassword(identifier: string, newPassword: string): boolean {
    const users = this.getAllUsers();
    const cleanId = identifier.trim().toLowerCase();
    const idx = users.findIndex(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        (u.phone && u.phone.replace(/\D/g, '').includes(cleanId.replace(/\D/g, '')))
    );

    if (idx === -1) return false;

    users[idx].passwordHash = newPassword;
    StorageService.set(STORAGE_KEYS.USERS, users);
    return true;
  }

  public static logout(): void {
    this.setCurrentUser(null);
  }

  // Development/Test helper only - never exposed on public production UI
  public static devSwitchUser(role: UserRole): UserProfile {
    const users = this.getAllUsers();
    const target = users.find((u) => u.role === role) || DEFAULT_ACCOUNTS.find((u) => u.role === role)!;
    const { passwordHash, ...profile } = target;
    this.setCurrentUser(profile);
    return profile;
  }

  public static switchRole(role: UserRole): UserProfile {
    return this.devSwitchUser(role);
  }
}
