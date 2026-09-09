import { AuditLog, UserRole } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { INITIAL_AUDIT_LOGS } from '../data/auditLogData';

export class AuditService {
  public static getAllLogs(): AuditLog[] {
    return StorageService.get<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  public static log(entry: {
    userId: string;
    userName: string;
    userRole: UserRole;
    action: string;
    entity: string;
    entityId: string;
    previousValue?: string;
    newValue?: string;
    details?: string;
  }): AuditLog {
    const logs = this.getAllLogs();
    const newLog: AuditLog = {
      id: `LOG-${String(logs.length + 1).padStart(3, '0')}`,
      ...entry,
      timestamp: new Date().toLocaleString('en-IN')
    };
    logs.unshift(newLog);
    StorageService.set(STORAGE_KEYS.AUDIT_LOGS, logs);
    return newLog;
  }
}
