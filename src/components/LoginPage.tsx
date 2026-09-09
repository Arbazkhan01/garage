import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Wrench, Lock, ArrowRight } from 'lucide-react';
import { AuthService } from '../services/authService';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleQuickLogin = (role: UserRole) => {
    AuthService.switchRole(role);
    if (role === 'admin') navigate('/admin');
    else if (role === 'technician') navigate('/service/TORQX-2026-00482');
    else navigate('/dashboard');
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default to customer login
    AuthService.switchRole('customer');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-tech font-bold uppercase tracking-widest text-[#ff5500]">
          TORQX Security Gateway
        </span>
        <h1 className="text-3xl font-display font-extrabold text-white">Access Your Portal</h1>
        <p className="text-xs text-neutral-400">
          Sign in to view your garage fleet, track live repair orders, and manage invoices.
        </p>
      </div>

      {/* 1-Click Role Logins */}
      <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <span className="text-[11px] font-tech uppercase tracking-wider text-neutral-400 block text-center">
          Instant Prototype Demo Sign-in
        </span>

        <div className="space-y-2.5">
          <button
            onClick={() => handleQuickLogin('customer')}
            className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between text-xs transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#ff5500]/20 text-[#ff5500] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block font-bold">Customer Portal</strong>
                <span className="text-neutral-400 text-[11px]">Vikram M. (BMW 330i Owner)</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400" />
          </button>

          <button
            onClick={() => handleQuickLogin('admin')}
            className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between text-xs transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block font-bold">Admin Console</strong>
                <span className="text-neutral-400 text-[11px]">Garage Director (All Bays & Financials)</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400" />
          </button>

          <button
            onClick={() => handleQuickLogin('technician')}
            className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left flex items-center justify-between text-xs transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block font-bold">Master Technician</strong>
                <span className="text-neutral-400 text-[11px]">Rahul S. (Diagnostics Lead)</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Manual Login Form */}
      <form onSubmit={handleManualLogin} className="bg-[#12161f] border border-white/10 rounded-2xl p-6 space-y-4 text-xs">
        <div>
          <label className="block font-tech uppercase text-neutral-400 mb-1">Email or Phone</label>
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vikram.malhotra@gmail.com"
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#ff5500] focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-tech uppercase text-neutral-400 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#ff5500] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-tech font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff5500]/25 transition-all"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};
