import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Car,
  Calendar,
  Wrench,
  FileText,
  Bell,
  User,
  Plus,
  Trash2,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  CreditCard,
  QrCode,
  ShieldCheck,
  Check
} from 'lucide-react';
import { CustomerVehicle, Booking, Invoice, NotificationItem, UserProfile } from '../types';
import { AuthService } from '../services/authService';
import { VehicleService } from '../services/vehicleService';
import { BookingService } from '../services/bookingService';
import { InvoiceService } from '../services/invoiceService';
import { NotificationService } from '../services/notificationService';
import { VEHICLE_DATABASE } from '../data/vehicleData';

export const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab from URL path or state
  const getTabFromPath = () => {
    const p = location.pathname;
    if (p.includes('/vehicles')) return 'vehicles';
    if (p.includes('/bookings')) return 'bookings';
    if (p.includes('/service-history')) return 'history';
    if (p.includes('/invoices')) return 'invoices';
    if (p.includes('/notifications')) return 'notifications';
    if (p.includes('/profile')) return 'profile';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<string>(getTabFromPath());
  const [currentUser, setCurrentUser] = useState<UserProfile>(AuthService.getCurrentUser());
  const [vehicles, setVehicles] = useState<CustomerVehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Add Vehicle Modal State
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newBrand, setNewBrand] = useState('BMW');
  const [newModel, setNewModel] = useState('3 Series');
  const [newVariant, setNewVariant] = useState('330i M Sport');
  const [newReg, setNewReg] = useState('');
  const [newYear, setNewYear] = useState(2024);
  const [newKm, setNewKm] = useState(15000);
  const [newFuel, setNewFuel] = useState<any>('Petrol');

  // Pay Invoice Modal State
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card'>('UPI');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const loadAll = () => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    setVehicles(VehicleService.getUserVehicles(user.id));
    setBookings(BookingService.getUserBookings(user.id));
    setInvoices(InvoiceService.getUserInvoices(user.email));
    setNotifications(NotificationService.getUserNotifications(user.id));
  };

  useEffect(() => {
    loadAll();
    window.addEventListener('storage', loadAll);
    return () => window.removeEventListener('storage', loadAll);
  }, [location.pathname]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'overview') navigate('/dashboard');
    else navigate(`/dashboard/${tab}`);
  };

  // Add vehicle submit
  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReg.trim()) return;

    VehicleService.addVehicle({
      userId: currentUser.id,
      brand: newBrand,
      model: newModel,
      variant: newVariant,
      regNumber: newReg.toUpperCase(),
      year: Number(newYear),
      currentKm: Number(newKm),
      fuelType: newFuel,
      lastServiceDate: new Date().toISOString().split('T')[0],
      nextServiceDueDate: '2027-03-01',
      nextServiceDueKm: Number(newKm) + 10000
    });

    setShowAddVehicleModal(false);
    setNewReg('');
    loadAll();
  };

  // Delete vehicle
  const handleDeleteVehicle = (id: string) => {
    if (window.confirm('Remove this vehicle from your garage profile?')) {
      VehicleService.deleteVehicle(id);
      loadAll();
    }
  };

  // Pay invoice submit
  const handleExecutePayment = () => {
    if (!payingInvoice) return;
    setPaymentProcessing(true);
    setTimeout(() => {
      InvoiceService.payInvoice(payingInvoice.id, paymentMethod);
      setPaymentProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
        setPayingInvoice(null);
        loadAll();
      }, 1500);
    }, 1200);
  };

  const activeBooking = bookings.find((b) => b.status !== 'completed' && b.status !== 'cancelled');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Header Banner */}
      <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#ff5500]/40 shadow-xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{currentUser.name}</h1>
              <span className="px-2.5 py-0.5 rounded bg-[#ff5500]/15 text-[#ff5500] text-[10px] font-tech font-bold uppercase tracking-wider border border-[#ff5500]/30">
                VIP Owner
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {currentUser.email} • {currentUser.phone} • {currentUser.address}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/book-service')}
            className="px-5 py-2.5 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-tech font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff5500]/25 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Service</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-1 mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: Wrench },
          { id: 'vehicles', label: `My Garage (${vehicles.length})`, icon: Car },
          { id: 'bookings', label: `Service Bookings (${bookings.length})`, icon: Calendar },
          { id: 'history', label: 'Service History', icon: Clock },
          { id: 'invoices', label: `Invoices & Payments (${invoices.length})`, icon: FileText },
          { id: 'notifications', label: `Notifications (${notifications.length})`, icon: Bell },
          { id: 'profile', label: 'Profile Settings', icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-tech text-xs uppercase tracking-wider border-b-2 transition-all shrink-0 ${
                isActive
                  ? 'border-[#ff5500] text-white font-bold bg-white/5'
                  : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#ff5500]' : 'text-neutral-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Active Car In Workshop Callout */}
          {activeBooking && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1b2330] to-[#12161f] border border-[#ff5500]/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5500] animate-ping" />
                  <span className="text-xs font-tech font-bold uppercase tracking-widest text-[#ff5500]">
                    Active Service In Progress • {activeBooking.bayNumber || 'Bay 01'}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {activeBooking.vehicleBrand} {activeBooking.vehicleModel} ({activeBooking.vehicleRegNumber})
                </h3>
                <p className="text-xs text-neutral-300">
                  Current Status: <strong className="text-white uppercase font-tech">{activeBooking.status.replace(/_/g, ' ')}</strong> • Estimated Completion: <strong>{activeBooking.estimatedCompletion || 'Today, 6:30 PM'}</strong>
                </p>
              </div>

              <button
                onClick={() => navigate(`/service/${activeBooking.id}`)}
                className="px-6 py-3 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-tech font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff5500]/30 transition-all flex items-center justify-center gap-2 self-start md:self-auto"
              >
                <span>Track Live Progress</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Registered Vehicles', val: vehicles.length, desc: 'In digital garage' },
              { label: 'Active Bookings', val: bookings.filter((b) => b.status !== 'completed').length, desc: 'Currently in progress' },
              { label: 'Completed Services', val: bookings.filter((b) => b.status === 'completed').length + 2, desc: 'Certified maintenance' },
              { label: 'Total Invoices', val: invoices.length, desc: 'GST compliant bills' }
            ].map((m, i) => (
              <div key={i} className="bg-[#12161f] border border-white/10 rounded-xl p-5">
                <span className="text-xs font-tech uppercase tracking-wider text-neutral-400 block">
                  {m.label}
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-tech my-1 block">
                  {m.val}
                </span>
                <span className="text-[11px] text-neutral-500">{m.desc}</span>
              </div>
            ))}
          </div>

          {/* Vehicles Preview & Recent Bookings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* My Cars Box */}
            <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#ff5500]" />
                  My Registered Vehicles
                </h3>
                <button
                  onClick={() => handleTabChange('vehicles')}
                  className="text-xs font-tech text-[#ff5500] hover:underline"
                >
                  View All ({vehicles.length})
                </button>
              </div>

              <div className="space-y-3">
                {vehicles.slice(0, 3).map((v) => (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-white">{v.brand} {v.model}</h4>
                      <p className="text-xs text-neutral-400 font-mono mt-0.5">
                        {v.regNumber} • {v.fuelType} • {v.currentKm.toLocaleString('en-IN')} KM
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/book-service')}
                      className="text-xs font-tech uppercase tracking-wider text-neutral-300 hover:text-white px-2.5 py-1 rounded bg-white/5 hover:bg-white/10"
                    >
                      Book Service
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Bookings Box */}
            <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#ff5500]" />
                  Recent Service Records
                </h3>
                <button
                  onClick={() => handleTabChange('bookings')}
                  className="text-xs font-tech text-[#ff5500] hover:underline"
                >
                  View All ({bookings.length})
                </button>
              </div>

              <div className="space-y-3">
                {bookings.slice(0, 3).map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#ff5500]">{b.id}</span>
                        <span className="text-xs font-tech uppercase text-neutral-400">
                          {b.serviceDate}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white mt-0.5">{b.serviceName}</h4>
                      <p className="text-xs text-neutral-400">{b.vehicleBrand} {b.vehicleModel}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/service/${b.id}`)}
                      className="px-3 py-1.5 rounded-lg bg-[#ff5500]/15 text-[#ff5500] hover:bg-[#ff5500] hover:text-white text-xs font-tech font-bold uppercase tracking-wider transition-colors"
                    >
                      Track
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: MY GARAGE (VEHICLES) */}
      {activeTab === 'vehicles' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-white">Registered Garage Fleet</h3>
              <p className="text-xs text-neutral-400">
                Manage your vehicles, track service due intervals, and schedule bookings.
              </p>
            </div>
            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="px-4 py-2 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-tech font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="bg-[#12161f] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-mono font-bold text-neutral-200">
                      {v.regNumber}
                    </span>
                    <button
                      onClick={() => handleDeleteVehicle(v.id)}
                      title="Remove vehicle"
                      className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="text-lg font-bold text-white">{v.brand} {v.model}</h4>
                  <p className="text-xs text-neutral-400">{v.variant}</p>

                  <div className="mt-4 space-y-2 text-xs text-neutral-300">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-neutral-500">Year / Fuel:</span>
                      <span className="font-semibold text-white">{v.year} • {v.fuelType}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-neutral-500">Odometer:</span>
                      <span className="font-mono text-white">{v.currentKm.toLocaleString('en-IN')} KM</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-neutral-500">Next Service Due:</span>
                      <span className="text-amber-400 font-semibold">{v.nextServiceDueDate || 'In 6 Months'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-neutral-500">Insurance Expiry:</span>
                      <span className="text-neutral-300">{v.insuranceExpiry || 'Valid'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex gap-2">
                  <button
                    onClick={() => navigate('/book-service')}
                    className="w-full py-2.5 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-tech font-bold text-xs uppercase tracking-wider transition-colors shadow"
                  >
                    Schedule Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-white">All Service Bookings</h3>
              <p className="text-xs text-neutral-400">
                Track status in real-time, view invoices, and inspect technician notes.
              </p>
            </div>
            <button
              onClick={() => navigate('/book-service')}
              className="px-4 py-2 rounded-xl bg-[#ff5500] text-white font-tech font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Booking</span>
            </button>
          </div>

          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-[#12161f] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#ff5500]">{b.id}</span>
                    <span
                      className={`text-[10px] font-tech font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        b.status === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[#ff5500]/15 text-[#ff5500] border border-[#ff5500]/30'
                      }`}
                    >
                      {b.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-neutral-400 font-tech">
                      • {b.serviceDate} ({b.serviceTime})
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white">
                    {b.serviceName} - {b.vehicleBrand} {b.vehicleModel}
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Reg: {b.vehicleRegNumber} • Valet: {b.pickupDrop === 'garage_drop' ? 'Self Drop' : 'Doorstep Pickup'} • Total: <strong className="text-white font-mono">₹{b.priceBreakdown.grandTotal.toLocaleString('en-IN')}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/service/${b.id}`)}
                    className="px-4 py-2 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-tech font-bold text-xs uppercase tracking-wider shadow"
                  >
                    Track Live
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SERVICE HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white">Documented Maintenance History</h3>
            <p className="text-xs text-neutral-400">
              Complete archival records of all services performed at TORQX AUTOCARE Pune.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 font-tech uppercase tracking-wider">
                  <th className="py-3 px-3">Service Date</th>
                  <th className="py-3 px-3">Vehicle</th>
                  <th className="py-3 px-3">Package / Scope</th>
                  <th className="py-3 px-3">Odometer</th>
                  <th className="py-3 px-3 text-right">Cost (INR)</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-3 text-white font-tech">{b.serviceDate}</td>
                    <td className="py-3.5 px-3">
                      <strong className="text-white block">{b.vehicleBrand} {b.vehicleModel}</strong>
                      <span className="text-neutral-400 font-mono text-[11px]">{b.vehicleRegNumber}</span>
                    </td>
                    <td className="py-3.5 px-3 text-neutral-300">{b.serviceName}</td>
                    <td className="py-3.5 px-3 text-neutral-400 font-mono">18,450 KM</td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                      ₹{b.priceBreakdown.grandTotal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => navigate(`/service/${b.id}`)}
                        className="text-[#ff5500] hover:underline font-tech uppercase text-[11px]"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: INVOICES & PAYMENTS */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-white">Invoices & Digital Receipts</h3>
              <p className="text-xs text-neutral-400">
                Official GST-compliant tax invoices for insurance & maintenance records.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-[#12161f] border border-white/10 rounded-2xl p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-mono text-sm font-bold text-[#ff5500]">
                        {inv.invoiceNumber}
                      </span>
                      <span className="text-xs text-neutral-400 block">{inv.date}</span>
                    </div>
                    <span
                      className={`px-3 py-0.5 rounded-full text-[10px] font-tech font-bold uppercase tracking-wider ${
                        inv.paymentStatus === 'paid'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {inv.paymentStatus.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-white">{inv.vehicleDetails}</h4>
                  <p className="text-xs text-neutral-400 font-mono">Reg: {inv.vehicleReg || 'MH 12 AB 1234'}</p>

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-1 text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal:</span>
                      <span className="font-mono text-white">₹{inv.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>GST @ 18%:</span>
                      <span className="font-mono text-white">₹{inv.gst.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white pt-1">
                      <span>Total Billed:</span>
                      <span className="font-mono text-[#ff5500]">₹{inv.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                  {inv.paymentStatus === 'pending' ? (
                    <button
                      onClick={() => setPayingInvoice(inv)}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-tech font-bold text-xs uppercase tracking-wider shadow"
                    >
                      Pay Online Now (UPI / Card)
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/service/${inv.bookingId}`)}
                      className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-tech font-bold text-xs uppercase tracking-wider"
                    >
                      View Tax Invoice
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Notifications & Alerts</h3>
              <p className="text-xs text-neutral-400">
                Service status alerts, inspection reports, and preventive care reminders.
              </p>
            </div>
            <button
              onClick={() => {
                NotificationService.markAllAsRead(currentUser.id);
                loadAll();
              }}
              className="text-xs font-tech text-[#ff5500] hover:underline"
            >
              Mark All as Read
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  n.read ? 'bg-black/20 border-white/5 opacity-70' : 'bg-white/5 border-white/15'
                }`}
              >
                <div>
                  <h4 className="font-bold text-sm text-white">{n.title}</h4>
                  <p className="text-xs text-neutral-300 mt-1">{n.message}</p>
                  <span className="text-[10px] text-neutral-500 font-tech mt-2 block">
                    {n.createdAt}
                  </span>
                </div>

                {n.link && (
                  <button
                    onClick={() => navigate(n.link!)}
                    className="px-3 py-1.5 rounded-lg bg-[#ff5500]/15 text-[#ff5500] hover:bg-[#ff5500] hover:text-white text-xs font-tech font-bold uppercase tracking-wider shrink-0 transition-colors"
                  >
                    View
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-2xl space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white">Owner Profile Details</h3>
            <p className="text-xs text-neutral-400">
              Keep your contact and doorstep delivery address updated.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-tech uppercase text-neutral-400 mb-1">Full Name</label>
              <input
                type="text"
                defaultValue={currentUser.name}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#ff5500] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-tech uppercase text-neutral-400 mb-1">Email Address</label>
              <input
                type="email"
                defaultValue={currentUser.email}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#ff5500] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-tech uppercase text-neutral-400 mb-1">WhatsApp Phone Number</label>
              <input
                type="tel"
                defaultValue={currentUser.phone}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white font-mono focus:border-[#ff5500] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-tech uppercase text-neutral-400 mb-1">Default Pickup Address (Pune)</label>
              <textarea
                rows={3}
                defaultValue={currentUser.address}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#ff5500] focus:outline-none"
              />
            </div>
            <button
              onClick={() => alert('Profile details updated successfully!')}
              className="px-6 py-2.5 rounded-xl bg-[#ff5500] text-white font-tech font-bold text-xs uppercase tracking-wider"
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      )}

      {/* ADD VEHICLE MODAL */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12161f] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-lg text-white">Add Vehicle to Garage</h3>
              <button
                onClick={() => setShowAddVehicleModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddVehicleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-tech uppercase text-neutral-400 mb-1">Brand</label>
                <select
                  value={newBrand}
                  onChange={(e) => {
                    setNewBrand(e.target.value);
                    const b = VEHICLE_DATABASE.find((item) => item.name === e.target.value);
                    if (b && b.models.length > 0) {
                      setNewModel(b.models[0].name);
                    }
                  }}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white"
                >
                  {VEHICLE_DATABASE.map((b) => (
                    <option key={b.name} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-tech uppercase text-neutral-400 mb-1">Model</label>
                <input
                  type="text"
                  required
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-tech uppercase text-neutral-400 mb-1">Variant</label>
                <input
                  type="text"
                  required
                  value={newVariant}
                  onChange={(e) => setNewVariant(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-tech uppercase text-neutral-400 mb-1">Registration Number</label>
                <input
                  type="text"
                  required
                  placeholder="MH 12 AB 1234"
                  value={newReg}
                  onChange={(e) => setNewReg(e.target.value.toUpperCase())}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Fuel Type</label>
                  <select
                    value={newFuel}
                    onChange={(e) => setNewFuel(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Odometer KM</label>
                  <input
                    type="number"
                    value={newKm}
                    onChange={(e) => setNewKm(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-neutral-300 font-tech uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#ff5500] text-white font-tech font-bold uppercase shadow"
                >
                  Add to Garage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAY INVOICE MODAL */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12161f] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-lg text-white">Instant Payment Checkout</h3>
              <button
                onClick={() => setPayingInvoice(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {paymentSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Payment Successful!</h4>
                <p className="text-xs text-neutral-300">
                  Invoice {payingInvoice.invoiceNumber} has been marked as PAID.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="text-neutral-400 block font-tech uppercase">Amount Payable</span>
                    <strong className="text-xl font-extrabold text-white font-mono">
                      ₹{payingInvoice.total.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">
                    {payingInvoice.invoiceNumber}
                  </span>
                </div>

                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-2">Select Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-3 rounded-xl border text-center font-tech uppercase tracking-wider flex items-center justify-center gap-2 ${
                        paymentMethod === 'UPI'
                          ? 'bg-[#ff5500]/15 border-[#ff5500] text-white font-bold'
                          : 'bg-black/30 border-white/10 text-neutral-400'
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span>UPI / QR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Card')}
                      className={`p-3 rounded-xl border text-center font-tech uppercase tracking-wider flex items-center justify-center gap-2 ${
                        paymentMethod === 'Card'
                          ? 'bg-[#ff5500]/15 border-[#ff5500] text-white font-bold'
                          : 'bg-black/30 border-white/10 text-neutral-400'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Debit / Credit</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="p-4 rounded-xl bg-black/50 border border-white/5 text-center space-y-2">
                    <div className="w-24 h-24 bg-white p-2 rounded-lg mx-auto flex items-center justify-center">
                      <QrCode className="w-20 h-20 text-black" />
                    </div>
                    <span className="text-neutral-300 font-mono block">VPA: torqx.autocare@icici</span>
                    <p className="text-[11px] text-neutral-400">Scan using Google Pay, PhonePe, or Paytm</p>
                  </div>
                )}

                <button
                  type="button"
                  disabled={paymentProcessing}
                  onClick={handleExecutePayment}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-tech font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {paymentProcessing ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authorize & Pay ₹{payingInvoice.total.toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
