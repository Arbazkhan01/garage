import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Wrench, RefreshCw, Car, ChevronRight, Check } from 'lucide-react';
import { AuthService } from '../services/authService';
import { StorageService } from '../services/storageService';
import { UserProfile, UserRole } from '../types';

export const RoleSwitcherBar: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(AuthService.getCurrentUser());
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setCurrentUser(AuthService.getCurrentUser());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    const updated = AuthService.switchRole(role);
    setCurrentUser(updated);
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'technician') {
      navigate('/service/TORQX-2026-00482');
    } else {
      navigate('/dashboard');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo bookings, vehicles, and invoices to initial state?')) {
      StorageService.resetToFactoryDemo();
      setCurrentUser(AuthService.getCurrentUser());
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2500);
      window.location.reload();
    }
  };

  return (
    <div className="bg-[#0e121a] border-b border-white/10 text-xs py-2 px-4 select-none relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Current Active Role Indicator */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-tech text-neutral-400 tracking-wider uppercase text-[11px]">
            Platform Mode:
          </span>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
            {currentUser.role === 'admin' ? (
              <Shield className="w-3.5 h-3.5 text-amber-400" />
            ) : currentUser.role === 'technician' ? (
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <User className="w-3.5 h-3.5 text-[#ff5500]" />
            )}
            <span className="font-medium text-white text-[11px] truncate max-w-[150px] sm:max-w-none">
              {currentUser.name} ({currentUser.role.toUpperCase()})
            </span>
          </div>
        </div>

        {/* Center: Fast Role Switcher Pills */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => handleRoleSelect('customer')}
            className={`px-2.5 py-1 rounded font-tech text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 ${
              currentUser.role === 'customer'
                ? 'bg-[#ff5500] text-white font-bold shadow'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-3 h-3" />
            <span>Customer</span>
          </button>

          <button
            onClick={() => handleRoleSelect('admin')}
            className={`px-2.5 py-1 rounded font-tech text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 ${
              currentUser.role === 'admin'
                ? 'bg-amber-500 text-black font-bold shadow'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>Admin</span>
          </button>

          <button
            onClick={() => handleRoleSelect('technician')}
            className={`px-2.5 py-1 rounded font-tech text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 ${
              currentUser.role === 'technician'
                ? 'bg-cyan-500 text-black font-bold shadow'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wrench className="w-3 h-3" />
            <span>Technician</span>
          </button>
        </div>

        {/* Right: Quick Action Links */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/service/TORQX-2026-00482')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors font-tech text-[11px] tracking-wide"
          >
            <Car className="w-3.5 h-3.5 text-[#ff5500]" />
            <span className="hidden sm:inline">Track Demo Car</span>
            <span className="sm:hidden">Track</span>
            <ChevronRight className="w-3 h-3 text-neutral-500" />
          </button>

          <button
            onClick={handleResetData}
            title="Reset prototype data to initial state"
            className="flex items-center gap-1 px-2 py-1 rounded bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-300 border border-white/10 hover:border-red-500/30 transition-colors"
          >
            {resetSuccess ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
