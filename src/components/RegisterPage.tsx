import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import { AuthService } from '../services/authService';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile phone number.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!formData.acceptTerms) {
      setErrorMessage('Please accept the TORQX Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = AuthService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      setIsLoading(false);

      if (!result.success) {
        setErrorMessage(result.error || 'Failed to create account.');
        return;
      }

      setSuccessMessage('Account created successfully! Welcome to TORQX AUTOCARE.');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 800);
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-tech uppercase tracking-widest text-[#ff5500]">
            <Shield className="w-3.5 h-3.5" />
            <span>Customer Membership</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">
            Create Your Garage Account
          </h1>
          <p className="text-xs text-neutral-400">
            Enjoy digital vehicle health reports, priority bays, and live service telemetry.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="block font-tech uppercase tracking-wider text-neutral-400 text-[11px]">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Siddharth Joshi"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#ff5500]"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block font-tech uppercase tracking-wider text-neutral-400 text-[11px]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. siddharth@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#ff5500]"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block font-tech uppercase tracking-wider text-neutral-400 text-[11px]">
                Mobile Number (SMS & WhatsApp updates)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +91 98221 44556"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#ff5500]"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block font-tech uppercase tracking-wider text-neutral-400 text-[11px]">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#ff5500]"
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block font-tech uppercase tracking-wider text-neutral-400 text-[11px]">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-type password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-[#ff5500]"
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 pt-1 cursor-pointer text-neutral-400 text-[11px]">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="mt-0.5 rounded bg-black/40 border-white/20 text-[#ff5500] focus:ring-[#ff5500]"
              />
              <span className="leading-snug">
                I agree to TORQX AUTOCARE's Terms of Service, workshop liability protocols, and digital service communications.
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff7700] hover:from-[#ff6611] text-white font-tech font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#ff5500]/20 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center text-xs text-neutral-400">
          <span>Already registered? </span>
          <Link to="/login" className="text-[#ff5500] hover:underline font-bold">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
