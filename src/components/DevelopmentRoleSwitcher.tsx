import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Wrench, RefreshCw, X, ChevronUp, ChevronDown } from 'lucide-react';
import { AuthService } from '../services/authService';
import { StorageService } from '../services/storageService';
import { UserProfile, UserRole } from '../types';

export const DevelopmentRoleSwitcher: React.FC = () => {
  // CRITICAL REQUIREMENT: Render ONLY when in DEV mode
  if (!import.meta.env.DEV) {
    return null;
  }

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(AuthService.getCurrentUser());
  const [collapsed, setCollapsed] = useState(true);
  const [resetDone, setResetDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = AuthService.subscribe((u) => setCurrentUser(u));
    return () => unsub();
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    const updated = AuthService.devSwitchUser(role);
    setCurrentUser(updated);
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'technician') {
      navigate('/technician');
    } else {
      navigate('/dashboard');
    }
  };

  const handleResetData = () => {
    StorageService.resetToFactoryDemo();
    setCurrentUser(AuthService.getCurrentUser());
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2000);
    window.location.reload();
  };

  if (collapsed) {
    return (
      <aside aria-label="Dev tools" className="fixed bottom-3 right-3 z-50">
        <button
          onClick={() => setCollapsed(false)}
          className="bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white px-3 py-1.5 rounded-full border border-amber-500/40 text-[10px] font-mono tracking-wider flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>DEV: {currentUser ? currentUser.role.toUpperCase() : 'GUEST'}</span>
          <ChevronUp className="w-3 h-3 text-neutral-400" />
        </button>
      </aside>
    );
  }

  return (
    <aside aria-label="Dev tools console" className="fixed bottom-3 right-3 z-50 bg-[#0e121a] border border-amber-500/30 rounded-xl p-3 shadow-2xl backdrop-blur-xl text-xs max-w-xs animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="font-mono text-[11px] text-amber-300 font-semibold tracking-wider">
            DEV ROLE EMULATOR
          </span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="text-neutral-400 hover:text-white p-0.5 rounded hover:bg-white/10"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-[10px] text-neutral-400 mb-2 leading-tight">
        Active: <strong className="text-white">{currentUser?.name || 'Guest'}</strong> (
        {currentUser?.role || 'none'})
      </p>

      <div className="grid grid-cols-3 gap-1 mb-2">
        <button
          onClick={() => handleRoleSelect('customer')}
          className={`py-1.5 px-2 rounded text-[10px] font-tech font-bold uppercase transition-all flex flex-col items-center gap-1 ${
            currentUser?.role === 'customer'
              ? 'bg-[#ff5500] text-white shadow-md'
              : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Customer
        </button>
        <button
          onClick={() => handleRoleSelect('admin')}
          className={`py-1.5 px-2 rounded text-[10px] font-tech font-bold uppercase transition-all flex flex-col items-center gap-1 ${
            currentUser?.role === 'admin'
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Admin
        </button>
        <button
          onClick={() => handleRoleSelect('technician')}
          className={`py-1.5 px-2 rounded text-[10px] font-tech font-bold uppercase transition-all flex flex-col items-center gap-1 ${
            currentUser?.role === 'technician'
              ? 'bg-cyan-500 text-black shadow-md'
              : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          Tech
        </button>
      </div>

      <button
        onClick={handleResetData}
        className="w-full py-1 px-2 rounded bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 text-[10px] font-mono flex items-center justify-center gap-1 transition-colors"
      >
        <RefreshCw className="w-3 h-3" />
        {resetDone ? 'Reset Complete!' : 'Reset Demo LocalStorage'}
      </button>
    </aside>
  );
};
