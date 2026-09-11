import React, { useState, useEffect, useMemo } from 'react';
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
  Check,
  LogOut,
  ClipboardCheck,
  FileSignature,
  Tag,
  AlertTriangle,
  X
} from 'lucide-react';
import { CustomerVehicle, Booking, Invoice, NotificationItem, UserProfile, JobCard, ServiceHistoryRecord } from '../types';
import { AuthService } from '../services/authService';
import { VehicleService } from '../services/vehicleService';
import { BookingService } from '../services/bookingService';
import { InvoiceService } from '../services/invoiceService';
import { NotificationService } from '../services/notificationService';
import { JobCardService } from '../services/jobCardService';
import { ServiceHistoryService } from '../services/serviceHistoryService';
import { VEHICLE_DATABASE } from '../data/vehicleData';

export const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab from URL path or state
  const getTabFromPath = () => {
    const p = location.pathname;
    if (p.includes('/vehicles')) return 'vehicles';
    if (p.includes('/bookings')) return 'bookings';
    if (p.includes('/inspections')) return 'inspections';
    if (p.includes('/quotations')) return 'quotations';
    if (p.includes('/reminders')) return 'reminders';
    if (p.includes('/offers')) return 'offers';
    if (p.includes('/service-history')) return 'history';
    if (p.includes('/invoices')) return 'invoices';
    if (p.includes('/notifications')) return 'notifications';
    if (p.includes('/profile')) return 'profile';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<string>(getTabFromPath());
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(AuthService.getCurrentUser());
  const [vehicles, setVehicles] = useState<CustomerVehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryRecord[]>([]);
  const [couponCopied, setCouponCopied] = useState<string | null>(null);

  // Computed dynamic vehicle reminders
  const computedReminders = useMemo(() => {
    if (vehicles.length === 0) {
      return [
        {
          vehicle: 'BMW 330i (MH 12 AB 9981)',
          title: 'Periodic Scheduled Service',
          due: 'Due in 24 Days or 1,250 km',
          badge: 'Upcoming',
          badgeColor: 'amber',
          desc: 'Engine oil change, oil filter, air filter cleaning, 40-point safety check.',
          action: 'Book Service Bay'
        },
        {
          vehicle: 'BMW 330i (MH 12 AB 9981)',
          title: 'Comprehensive Insurance Expiry',
          due: 'Expires: 18 April 2026',
          badge: 'Active',
          badgeColor: 'emerald',
          desc: 'Zero depreciation + engine protect policy. 0% No-claim bonus lock.',
          action: 'Assistance via WhatsApp'
        },
        {
          vehicle: 'BMW 330i (MH 12 AB 9981)',
          title: 'Pollution Under Control (PUC)',
          due: 'Expires in 14 Days (Mandatory)',
          badge: 'Action Required',
          badgeColor: 'red',
          desc: 'Government mandated emissions certificate required for road legality.',
          action: 'Renew with Service'
        }
      ];
    }

    return vehicles.flatMap((v) => {
      const rem = ServiceHistoryService.getVehicleReminders(v.regNumber);
      return [
        {
          vehicle: `${v.brand} ${v.model} (${v.regNumber})`,
          title: 'Periodic Scheduled Maintenance',
          due: rem.isServiceOverdue
            ? 'Overdue for Service'
            : `Due in ${rem.serviceDueDays} Days or ${rem.serviceDueKm.toLocaleString('en-IN')} km`,
          badge: rem.isServiceOverdue ? 'Action Required' : rem.serviceDueDays <= 15 ? 'Upcoming' : 'On Schedule',
          badgeColor: rem.isServiceOverdue ? 'red' : rem.serviceDueDays <= 15 ? 'amber' : 'emerald',
          desc: rem.recommendedAction,
          action: 'Book Service Bay'
        },
        {
          vehicle: `${v.brand} ${v.model} (${v.regNumber})`,
          title: 'Insurance Policy Renewal',
          due: `Expires in ${rem.insuranceDueDays} Days`,
          badge: 'Active',
          badgeColor: 'emerald',
          desc: 'Comprehensive coverage active. Zero-depreciation cover locked.',
          action: 'Assistance via WhatsApp'
        },
        {
          vehicle: `${v.brand} ${v.model} (${v.regNumber})`,
          title: 'Pollution Under Control (PUC)',
          due: `Valid for next ${rem.pucDueDays} Days`,
          badge: rem.pucDueDays <= 30 ? 'Action Required' : 'Valid',
          badgeColor: rem.pucDueDays <= 30 ? 'amber' : 'emerald',
          desc: 'Mandatory emissions compliance certificate for road legality.',
          action: 'Renew with Service'
        }
      ];
    });
  }, [vehicles]);

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
    if (user) {
      setVehicles(VehicleService.getUserVehicles(user.id));
      setBookings(BookingService.getUserBookings(user.id));
      setInvoices(InvoiceService.getUserInvoices(user.email));
      setNotifications(NotificationService.getUserNotifications(user.id));
      const userHist = ServiceHistoryService.getHistoryForCustomer(user.email);
      setServiceHistory(userHist.length > 0 ? userHist : ServiceHistoryService.getAllHistory());
    } else {
      setServiceHistory(ServiceHistoryService.getAllHistory());
    }
    setJobCards(JobCardService.getAllJobCards());
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

  const handleRespondAdditionalWork = (jobCardId: string, workId: string, decision: 'approved' | 'rejected') => {
    JobCardService.respondToAdditionalWork(jobCardId, workId, decision);
    loadAll();
  };

  // Add vehicle submit
  const handleAddVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReg.trim() || !currentUser) return;

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

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Sign In Required</h2>
        <p className="text-xs text-neutral-400">Please sign in to access your digital vehicle garage.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-xl bg-[#ff5500] text-white font-tech font-bold uppercase text-xs"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

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
          <button
            onClick={() => {
              AuthService.logout();
              navigate('/login');
            }}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-tech text-xs uppercase tracking-wider border border-white/10 transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-1 mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: Wrench },
          { id: 'vehicles', label: `My Garage (${vehicles.length})`, icon: Car },
          { id: 'bookings', label: `Service Bookings (${bookings.length})`, icon: Calendar },
          { id: 'inspections', label: 'Inspections & DVI', icon: ClipboardCheck },
          { id: 'quotations', label: 'Quotations & Approvals', icon: FileSignature },
          { id: 'reminders', label: 'Service Reminders', icon: AlertTriangle },
          { id: 'offers', label: 'Exclusive Offers', icon: Tag },
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Documented Maintenance History</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Official certified workshop service records with parts replaced, technicians, and warranty tags.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-tech font-bold">
                {serviceHistory.length} Certified Records
              </span>
            </div>
          </div>

          {serviceHistory.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <Wrench className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <p className="text-sm">No historical service records found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {serviceHistory.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-black/40 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#ff5500]/10 border border-[#ff5500]/30 flex items-center justify-center text-[#ff5500]">
                        <Car className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-white">{rec.vehicleDetails}</h4>
                        <span className="text-neutral-400 font-mono text-xs">{rec.vehicleRegNumber}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:text-right">
                      <div>
                        <span className="text-xs font-tech text-neutral-400 block">Service Date</span>
                        <strong className="text-xs text-white font-tech">{rec.date}</strong>
                      </div>
                      <div className="h-6 w-px bg-white/10 hidden sm:block" />
                      <div>
                        <span className="text-xs font-tech text-neutral-400 block">Total Amount</span>
                        <strong className="text-sm font-mono font-bold text-white">₹{rec.totalCost.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-tech uppercase text-neutral-500 block">Service Package</span>
                      <strong className="text-neutral-200">{rec.serviceType}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-tech uppercase text-neutral-500 block">Odometer Reading</span>
                      <span className="font-mono text-neutral-300">{rec.odometer.toLocaleString('en-IN')} KM</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-tech uppercase text-neutral-500 block">Assigned Technician</span>
                      <span className="text-neutral-300">{rec.technicianName}</span>
                    </div>
                  </div>

                  {rec.partsReplaced && rec.partsReplaced.length > 0 && (
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-[10px] font-tech uppercase text-neutral-500 block mb-1.5">
                        OEM Parts Installed
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {rec.partsReplaced.map((part, pIdx) => (
                          <span
                            key={pIdx}
                            className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-300"
                          >
                            ✓ {part}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{rec.warrantyPeriod || '12 Months / 20,000 km Warranty'}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/service/${rec.bookingId || 'TORQX-2026-00482'}`)}
                        className="text-[#ff5500] hover:underline font-tech uppercase text-xs flex items-center gap-1"
                      >
                        <span>View Inspection & Invoice</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      {/* TAB: INSPECTIONS & DVI */}
      {activeTab === 'inspections' && (
        <div className="space-y-6">
          <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-xs font-tech font-bold uppercase tracking-widest text-[#ff5500]">
                  Digital Vehicle Inspection (DVI)
                </span>
                <h3 className="text-xl font-bold text-white mt-1">Multi-Point Diagnostic Health Report</h3>
                <p className="text-xs text-neutral-400">
                  Certified garage inspection by TORQX Master Technicians using OEM OBD-II diagnostic tools.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-tech font-bold text-xs">
                  Overall Health: 92% (Pass)
                </span>
              </div>
            </div>

            {/* DVI 13-Point Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {[
                { title: 'Engine Oil & Viscosity', status: 'pass', desc: '0W-40 Motul 300V fresh level optimal', color: 'emerald' },
                { title: 'Front Brake Pads (Brembo)', status: 'warning', desc: '4.2mm remaining (Recommend replacement at 3mm)', color: 'amber' },
                { title: 'Rear Brake Pads & Discs', status: 'pass', desc: '7.8mm remaining, rotors runout within 0.03mm', color: 'emerald' },
                { title: 'Battery State of Health (SoH)', status: 'pass', desc: '12.6V resting, 94% cold cranking capacity (CCA)', color: 'emerald' },
                { title: 'Suspension & Bushings', status: 'pass', desc: 'No hydraulic strut leakage, bushings intact', color: 'emerald' },
                { title: 'Tyre Tread & Alignment', status: 'warning', desc: 'Front tyres 3.8mm, minor toe-in angle deviation', color: 'amber' },
                { title: 'Cooling System & Radiator', status: 'pass', desc: '50/50 G13 coolant mix tested to -35°C, no leaks', color: 'emerald' },
                { title: 'Transmission Fluid & DSG', status: 'pass', desc: 'Shift adaptation normal, fluid clarity good', color: 'emerald' },
                { title: 'Air Conditioning & Cabin Filter', status: 'pass', desc: 'Vent temperature 6.2°C at idle, filter clean', color: 'emerald' },
                { title: 'Steering & Tie Rods', status: 'pass', desc: 'Zero rack play, electric power steering calibrated', color: 'emerald' },
                { title: 'OBD-II Electronics Scan', status: 'pass', desc: '0 Active DTC fault codes stored in ECU/TCU/ABS', color: 'emerald' },
                { title: 'Underbody & Exhaust Lines', status: 'pass', desc: 'Cat-back heat shields fastened, no corrosion', color: 'emerald' }
              ].map((item, idx) => (
                <div key={idx} className="bg-black/30 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-bold text-white text-sm">{item.title}</span>
                    <span
                      className={`text-[10px] font-tech font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        item.status === 'pass'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: QUOTATIONS & APPROVALS */}
      {activeTab === 'quotations' && (
        <div className="space-y-6">
          <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="text-xs font-tech font-bold uppercase tracking-widest text-[#ff5500]">
                  Job Approvals & Additional Work
                </span>
                <h3 className="text-xl font-bold text-white mt-1">Authorize Additional Parts & Repairs</h3>
                <p className="text-xs text-neutral-400">
                  During inspection, our technician may identify worn components. Review transparent pricing and approve or decline with 1-click.
                </p>
              </div>
            </div>

            {/* List all additional work from job cards */}
            {(() => {
              const allAdditionalWork = jobCards.flatMap((job) =>
                (job.additionalWork || []).map((work) => ({
                  ...work,
                  jobCardId: job.id,
                  jobCardNumber: job.jobCardNumber,
                  vehicle: `${job.vehicleBrand} ${job.vehicleModel}`
                }))
              );

              if (allAdditionalWork.length === 0) {
                return (
                  <div className="py-16 text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto opacity-70" />
                    <h4 className="text-lg font-bold text-white">No Pending Authorizations</h4>
                    <p className="text-xs text-neutral-400 max-w-md mx-auto">
                      All work on your vehicle is currently authorized and proceeding according to the primary estimate.
                    </p>
                  </div>
                );
              }

              return (
                <div className="divide-y divide-white/10 mt-4">
                  {allAdditionalWork.map((item) => (
                    <div key={item.id} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#ff5500]">{item.jobCardNumber}</span>
                          <span className="text-xs text-neutral-400">• {item.vehicle}</span>
                          <span
                            className={`text-[10px] font-tech font-bold uppercase px-2 py-0.5 rounded border ${
                              item.status === 'approved'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : item.status === 'rejected'
                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}
                          >
                            {item.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-base">{item.description}</h4>
                        <p className="text-xs text-neutral-400">Diagnostic finding: {item.reason}</p>
                        <div className="flex items-center gap-4 text-xs font-mono text-neutral-300 pt-1">
                          <span>Parts: ₹{item.partsCost.toLocaleString('en-IN')}</span>
                          <span>Labour: ₹{item.labourCost.toLocaleString('en-IN')}</span>
                          <span>GST (18%): ₹{Math.round((item.partsCost + item.labourCost) * 0.18).toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right mr-3">
                          <span className="text-[10px] font-tech uppercase text-neutral-400 block">Total Est.</span>
                          <span className="text-lg font-bold font-mono text-white">
                            ₹{(item.partsCost + item.labourCost + Math.round((item.partsCost + item.labourCost) * 0.18)).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {item.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRespondAdditionalWork(item.jobCardId, item.id, 'approved')}
                              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-tech font-bold text-xs uppercase flex items-center gap-1.5 shadow"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleRespondAdditionalWork(item.jobCardId, item.id, 'rejected')}
                              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white font-tech text-xs uppercase flex items-center gap-1.5 border border-white/10"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB: SERVICE REMINDERS */}
      {activeTab === 'reminders' && (
        <div className="space-y-6">
          <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6">
            <div className="border-b border-white/10 pb-5">
              <span className="text-xs font-tech font-bold uppercase tracking-widest text-[#ff5500]">
                Automated Preventive Maintenance
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Vehicle Health & Compliance Reminders</h3>
              <p className="text-xs text-neutral-400">
                Track compliance certificates, warranty requirements, and maintenance intervals for your garage fleet.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {computedReminders.map((rem, idx) => (
                <div key={idx} className="bg-black/30 border border-white/10 rounded-xl p-5 flex flex-col justify-between hover:border-white/20 transition-colors">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div>
                        <span className="text-[10px] font-tech font-bold uppercase text-[#ff5500] block">
                          {rem.vehicle}
                        </span>
                        <h4 className="font-bold text-white text-base">{rem.title}</h4>
                      </div>
                      <span
                        className={`text-[10px] font-tech font-bold uppercase px-2 py-0.5 rounded border ${
                          rem.badgeColor === 'red'
                            ? 'bg-red-500/10 text-red-400 border-red-500/25'
                            : rem.badgeColor === 'amber'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                        }`}
                      >
                        {rem.badge}
                      </span>
                    </div>
                    <div className="text-xs font-mono font-bold text-white mb-2">{rem.due}</div>
                    <p className="text-xs text-neutral-400 mb-4">{rem.desc}</p>
                  </div>
                  <button
                    onClick={() => navigate('/book-service')}
                    className="self-start px-4 py-2 rounded-xl bg-white/5 hover:bg-[#ff5500] hover:text-white text-neutral-200 font-tech text-xs uppercase tracking-wider border border-white/10 transition-colors"
                  >
                    {rem.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: OFFERS & COUPONS */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6">
            <div className="border-b border-white/10 pb-5">
              <span className="text-xs font-tech font-bold uppercase tracking-widest text-[#ff5500]">
                Exclusive Member Benefits
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Owner Privileges & Workshop Vouchers</h3>
              <p className="text-xs text-neutral-400">
                Apply these codes during booking or show them at reception to redeem discounts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {[
                {
                  code: 'TORQX10',
                  title: '10% Off Periodic Service',
                  min: 'Min booking ₹4,500',
                  valid: 'Valid until 31 Dec 2026',
                  desc: 'Applies to Motul synthetic oil service packages on German, British, and Japanese sedans.'
                },
                {
                  code: 'APEXCERAMIC',
                  title: '₹2,000 Off Ceramic Shield',
                  min: '9H Triple Layer Coating',
                  valid: 'Valid until 31 Dec 2026',
                  desc: 'Complimentary interior leather conditioning included with exterior ceramic package.'
                },
                {
                  code: 'FREEPUC',
                  title: 'Free PUC Certificate',
                  min: 'With Any Major Service',
                  valid: 'Ongoing Member Benefit',
                  desc: 'Government registered emissions test and certificate included with periodic maintenance.'
                }
              ].map((offer, idx) => (
                <div key={idx} className="bg-gradient-to-br from-black/40 to-black/20 border border-white/10 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-tech uppercase text-neutral-400">{offer.valid}</span>
                      <span className="px-2 py-0.5 rounded bg-[#ff5500]/15 text-[#ff5500] font-tech text-[10px] font-bold uppercase">
                        Active
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/60 border border-dashed border-white/20 font-mono font-bold text-base text-center text-amber-400 tracking-wider mb-3">
                      {offer.code}
                    </div>
                    <h4 className="font-bold text-white text-sm mb-1">{offer.title}</h4>
                    <p className="text-xs text-neutral-400 mb-2">{offer.desc}</p>
                    <span className="text-[11px] text-neutral-500 font-mono block mb-4">{offer.min}</span>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(offer.code);
                      setCouponCopied(offer.code);
                      setTimeout(() => setCouponCopied(null), 2500);
                    }}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-tech text-xs uppercase tracking-wider border border-white/10"
                  >
                    {couponCopied === offer.code ? '✓ Code Copied!' : 'Copy Promo Code'}
                  </button>
                </div>
              ))}
            </div>
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
