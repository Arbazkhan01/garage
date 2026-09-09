import { NotificationItem } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';

export class NotificationService {
  public static getUserNotifications(userId: string): NotificationItem[] {
    const all = StorageService.get<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    return all.filter((n) => n.userId === userId || n.userId === 'all');
  }

  public static getUnreadCount(userId: string): number {
    return this.getUserNotifications(userId).filter((n) => !n.read).length;
  }

  public static markAsRead(id: string): void {
    const all = StorageService.get<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const target = all.find((n) => n.id === id);
    if (target) {
      target.read = true;
      StorageService.set(STORAGE_KEYS.NOTIFICATIONS, all);
    }
  }

  public static markAllAsRead(userId: string): void {
    const all = StorageService.get<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    all.forEach((n) => {
      if (n.userId === userId || n.userId === 'all') {
        n.read = true;
      }
    });
    StorageService.set(STORAGE_KEYS.NOTIFICATIONS, all);
  }

  public static sendNotification(params: {
    userId: string;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'reminder';
    link?: string;
  }): NotificationItem {
    const all = StorageService.get<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: params.userId,
      title: params.title,
      message: params.message,
      type: params.type || 'info',
      read: false,
      createdAt: 'Just now',
      link: params.link
    };
    all.unshift(newNotif);
    StorageService.set(STORAGE_KEYS.NOTIFICATIONS, all);
    return newNotif;
  }

  public static notifyUser(
    userId: string,
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'reminder' = 'info',
    link?: string
  ): NotificationItem {
    return this.sendNotification({ userId, title, message, type, link });
  }
}
