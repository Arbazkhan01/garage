import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { AuthService } from '../services/authService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or mobile number.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = AuthService.authenticate(identifier, password);
      setIsLoading(false);

      if (!result.success || !result.user) {
        setErrorMessage(result.error || 'Invalid credentials. Please check and try again.');
        return;
      }

      setSuccessMessage(`Welcome back, ${result.user.name}! Redirecting to workspace...`);

      // Determine destination strictly by the user's stored RBAC role
      setTimeout(() => {
        const from = (location.state as any)?.from?.pathname;
        if (from && !from.includes('/login')) {
          navigate(from, { replace: true });
          return;
        }

        if (result.user?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else if (result.user?.role === 'technician') {
          navigate('/technician', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }, 700);
    }, 600);
  };

  const handleFillDemo = (email: string) => {
    setIdentifier(email);
    setPassword('password123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-tech uppercase tracking-widest text-[#ff5500]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Automotive Gateway</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
            Sign In to TORQX
          </h1>
          <p className="text-xs text-neutral-400">
            Access your garage fleet, real-time telemetry, and service command center.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          {/* Status Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Identifier */}
            <div className="space-y-1.5">
              <label className="block font-tech uppercase tracking-wider text-neutral-400 text-[11px]">
                Email Address or Registered Mobile
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. vikram@torqx.com or +91 98221 44556"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#ff5500] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block font-tech uppercase tracking-wider text-neutral-400 text-[11px]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[#ff5500] hover:underline text-[11px] font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#ff5500] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-400 text-[11px]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-black/40 border-white/20 text-[#ff5500] focus:ring-[#ff5500]"
                />
                <span>Remember session on this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff7700] hover:from-[#ff6611] hover:to-[#ff8811] text-white font-tech font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#ff5500]/20 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Authenticate & Open Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <span className="text-[10px] font-tech uppercase tracking-wider text-neutral-400 block text-center">
              Quick Test Credentials (Auto-fill email & password)
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => handleFillDemo('vikram@torqx.com')}
                className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-center font-mono truncate"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('admin@torqx.com')}
                className="py-1.5 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-center font-mono truncate"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('rahul@torqx.com')}
                className="py-1.5 px-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-center font-mono truncate"
              >
                Technician
              </button>
            </div>
            <p className="text-[10px] text-neutral-400 text-center">
              Standard demo password: <code className="text-neutral-300 font-mono">password123</code>
            </p>
          </div>
        </div>

        {/* Footer Link to Register */}
        <div className="text-center text-xs text-neutral-400">
          <span>Don't have a TORQX Garage account yet? </span>
          <Link to="/register" className="text-[#ff5500] hover:underline font-bold">
            Create Customer Account
          </Link>
        </div>
      </div>
    </div>
  );
};
