import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Calendar,
  Layers,
  Wrench,
  DollarSign,
  Users,
  Tag,
  Star,
  Settings,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Car,
  Filter,
  Plus,
  ArrowUpRight,
  RefreshCw,
  Edit2,
  FileText,
  Package,
  Navigation,
  History,
  AlertTriangle,
  Check,
  Truck,
  Eye,
  LogOut,
  X,
  FileCheck,
  BarChart3,
  Download,
  ChevronRight
} from 'lucide-react';
import {
  Booking,
  ServiceStatus,
  ServiceBay,
  Technician,
  Invoice,
  Coupon,
  ReviewItem,
  JobCard,
  InventoryPart,
  PickupDropRequest,
  AuditLog,
  ServiceHistoryRecord
} from '../types';
import { BookingService } from '../services/bookingService';
import { StorageService, STORAGE_KEYS } from '../services/storageService';
import { COMPREHENSIVE_SERVICES } from '../data/pricingData';
import { VEHICLE_DATABASE } from '../data/vehicleData';
import { PricingService } from '../services/pricingService';
import { JobCardService } from '../services/jobCardService';
import { InventoryService } from '../services/inventoryService';
import { PickupDropService } from '../services/pickupDropService';
import { AuditService } from '../services/auditService';
import { AuthService } from '../services/authService';
import { ServiceHistoryService } from '../services/serviceHistoryService';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bays, setBays] = useState<ServiceBay[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [inventoryParts, setInventoryParts] = useState<InventoryPart[]>([]);
  const [pickupRequests, setPickupRequests] = useState<PickupDropRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryRecord[]>([]);
  const [selectedJobCard, setSelectedJobCard] = useState<JobCard | null>(null);
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<ServiceHistoryRecord | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [historySearch, setHistorySearch] = useState('');
  const [historyBrandFilter, setHistoryBrandFilter] = useState('all');

  // Pricing Matrix test calculator state
  const [calcBrand, setCalcBrand] = useState('BMW');
  const [calcModel, setCalcModel] = useState('3 Series');
  const [calcService, setCalcService] = useState('periodic-service');

  // Create Coupon Modal
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(10);
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'flat'>('percentage');
  const [newCouponMin, setNewCouponMin] = useState(2500);

  // Add Part Modal
  const [showAddPartModal, setShowAddPartModal] = useState(false);
  const [newPartSku, setNewPartSku] = useState('');
  const [newPartName, setNewPartName] = useState('');
  const [newPartCategory, setNewPartCategory] = useState<'brakes' | 'filters' | 'fluids' | 'suspension' | 'electrical' | 'engine' | 'tyres'>('fluids');
  const [newPartStock, setNewPartStock] = useState(12);
  const [newPartMin, setNewPartMin] = useState(4);
  const [newPartCost, setNewPartCost] = useState(1200);
  const [newPartPrice, setNewPartPrice] = useState(1800);
  const [newPartLocation, setNewPartLocation] = useState('Bay Shelf A-02');
  const [newPartBrand, setNewPartBrand] = useState('Motul OEM');

  // Assign Driver Modal
  const [driverModalRequest, setDriverModalRequest] = useState<PickupDropRequest | null>(null);
  const [driverName, setDriverName] = useState('Sanjay Patil');
  const [driverPhone, setDriverPhone] = useState('+91 98220 54321');

  const loadAll = () => {
    setBookings(BookingService.getAllBookings());
    setBays(StorageService.get<ServiceBay[]>(STORAGE_KEYS.BAYS, []));
    setTechnicians(StorageService.get<Technician[]>(STORAGE_KEYS.TECHNICIANS, []));
    setInvoices(StorageService.get<Invoice[]>(STORAGE_KEYS.INVOICES, []));
    setCoupons(StorageService.get<Coupon[]>(STORAGE_KEYS.COUPONS, []));
    setReviews(StorageService.get<ReviewItem[]>(STORAGE_KEYS.REVIEWS, []));
    setJobCards(JobCardService.getAllJobCards());
    setInventoryParts(InventoryService.getAllParts());
    setPickupRequests(PickupDropService.getAllRequests());
    setAuditLogs(AuditService.getAllLogs());
    setServiceHistory(ServiceHistoryService.getAllHistory());
  };

  useEffect(() => {
    loadAll();
    window.addEventListener('storage', loadAll);
    return () => window.removeEventListener('storage', loadAll);
  }, []);

  const handleConvertToJobCard = (booking: Booking) => {
    const existing = jobCards.find(j => j.bookingId === booking.id);
    if (existing) {
      setSelectedJobCard(existing);
      setActiveTab('job-cards');
      return;
    }
    const assignedTech = technicians[0]?.id || 'TECH-001';
    const assignedBay = booking.bayNumber || 'Bay 01';
    const newJobCard = JobCardService.createJobCardFromBooking(booking, assignedTech, assignedBay);
    loadAll();
    setSelectedJobCard(newJobCard);
    setActiveTab('job-cards');
  };

  const handleUpdateJobCardStatus = (jobCardId: string, status: any) => {
    JobCardService.updateJobCardStatus(jobCardId, status);
    loadAll();
  };

  const handleAdjustPartStock = (partId: string, delta: number) => {
    const part = inventoryParts.find((p) => p.id === partId);
    if (part) {
      InventoryService.adjustStock(partId, Math.max(0, part.stockQuantity + delta), 'Manual Workshop Inventory Adjustment');
      loadAll();
    }
  };

  const handleCreatePart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartSku.trim() || !newPartName.trim()) return;
    InventoryService.addPart({
      partNumber: newPartSku.trim().toUpperCase(),
      name: newPartName.trim(),
      category: newPartCategory,
      brand: newPartBrand,
      compatibleVehicles: ['BMW', 'Audi', 'Mercedes-Benz', 'Skoda', 'Volkswagen', 'Porsche'],
      supplier: 'Apex Auto Wholesale Dist.',
      purchasePrice: Number(newPartCost),
      sellingPrice: Number(newPartPrice),
      gst: 18,
      stockQuantity: Number(newPartStock),
      minStock: Number(newPartMin),
      warehouseLocation: newPartLocation
    });
    setShowAddPartModal(false);
    setNewPartSku('');
    setNewPartName('');
    loadAll();
  };

  const handleAssignDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverModalRequest) return;
    PickupDropService.assignDriver(driverModalRequest.id, driverName, driverPhone);
    setDriverModalRequest(null);
    loadAll();
  };

  const handleAdvancePickupStatus = (requestId: string, nextStatus: any) => {
    PickupDropService.updateStatus(requestId, nextStatus);
    loadAll();
  };

  // Update booking status from admin
  const handleStatusChange = (bookingId: string, newStatus: ServiceStatus) => {
    BookingService.updateBookingStatus(bookingId, newStatus);
    loadAll();
  };

  // Assign technician to booking
  const handleAssignTechnician = (bookingId: string, techId: string) => {
    BookingService.assignTechnician(bookingId, techId);
    loadAll();
  };

  // Assign bay to booking
  const handleAssignBay = (bookingId: string, bayNumber: string) => {
    BookingService.assignBay(bookingId, bayNumber);
    loadAll();
  };

  // Bay toggle status
  const handleToggleBayStatus = (bayId: string) => {
    const updated = bays.map((b) => {
      if (b.id === bayId) {
        const nextStatus = b.status === 'occupied' ? 'empty' : 'occupied';
        return { ...b, status: nextStatus as any };
      }
      return b;
    });
    setBays(updated);
    StorageService.set(STORAGE_KEYS.BAYS, updated);
  };

  // Moderate review
  const handleToggleReview = (id: string) => {
    const updated = reviews.map((r) => (r.id === id ? { ...r, approved: !r.approved } : r));
    setReviews(updated);
    StorageService.set(STORAGE_KEYS.REVIEWS, updated);
  };

  // Create coupon submit
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const newCoupon: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      description: `${newCouponType === 'percentage' ? `${newCouponDiscount}%` : `₹${newCouponDiscount}`} workshop discount`,
      discountType: newCouponType,
      value: Number(newCouponDiscount),
      minOrder: Number(newCouponMin),
      validUntil: '2026-12-31',
      active: true
    };
    const updated = [...coupons, newCoupon];
    setCoupons(updated);
    StorageService.set(STORAGE_KEYS.COUPONS, updated);
    setShowCouponModal(false);
    setNewCouponCode('');
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.vehicleBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.vehicleRegNumber && b.vehicleRegNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  // Filtered Service History Records
  const filteredServiceHistory = useMemo(() => {
    return serviceHistory.filter((rec) => {
      const matchSearch =
        rec.vehicleRegNumber.toLowerCase().includes(historySearch.toLowerCase()) ||
        rec.vehicleDetails.toLowerCase().includes(historySearch.toLowerCase()) ||
        rec.customerName.toLowerCase().includes(historySearch.toLowerCase()) ||
        rec.customerPhone.includes(historySearch) ||
        rec.technicianName.toLowerCase().includes(historySearch.toLowerCase()) ||
        rec.serviceType.toLowerCase().includes(historySearch.toLowerCase());

      const matchBrand = historyBrandFilter === 'all' || rec.vehicleDetails.toLowerCase().startsWith(historyBrandFilter.toLowerCase());
      return matchSearch && matchBrand;
    });
  }, [serviceHistory, historySearch, historyBrandFilter]);

  const handleExportHistoryCSV = () => {
    const headers = ['Record ID', 'Date', 'Vehicle', 'Reg Number', 'Customer', 'Phone', 'Service Type', 'Odometer KM', 'Total Cost INR', 'Technician', 'Warranty'];
    const rows = filteredServiceHistory.map((r) => [
      r.id,
      r.date,
      `"${r.vehicleDetails}"`,
      r.vehicleRegNumber,
      `"${r.customerName}"`,
      r.customerPhone,
      `"${r.serviceType}"`,
      r.odometer,
      r.totalCost,
      `"${r.technicianName}"`,
      `"${r.warrantyPeriod || '12 Months'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `torqx_service_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pricing matrix test result
  const calculatedTestPrice = useMemo(() => {
    return PricingService.calculatePricing({
      brandName: calcBrand,
      modelName: calcModel,
      serviceId: calcService,
      pickupDrop: 'garage_drop'
    });
  }, [calcBrand, calcModel, calcService]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-tech font-bold uppercase tracking-widest text-amber-400">
              TORQX Master Workshop Command Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-wide">
            Garage Operations & Diagnostics Admin
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Live bay allocation, job cards, technician rosters, pricing management, and invoices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/service/TORQX-2026-00482')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-tech text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <Car className="w-4 h-4 text-[#ff5500]" />
            <span>Customer Tracker</span>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Bookings', val: bookings.length, sub: 'All client requests' },
          { label: 'Active Job Cards', val: jobCards.filter((j) => j.status !== 'delivered' && j.status !== 'cancelled').length, sub: 'In workshop pipeline' },
          { label: 'Bays Occupied', val: `${bays.filter((b) => b.status === 'occupied').length} / ${bays.length}`, sub: 'Hydraulic lifts active' },
          { label: 'Low Stock Alerts', val: inventoryParts.filter((p) => p.quantity <= p.minThreshold).length, sub: 'Restock required', alert: inventoryParts.some((p) => p.quantity <= p.minThreshold) },
          { label: 'Gross Revenue', val: `₹${invoices.reduce((acc, i) => acc + i.total, 0).toLocaleString('en-IN')}`, sub: 'Billed & GST paid' },
          { label: 'Master Techs', val: technicians.length, sub: 'On shift roster' }
        ].map((kpi, i) => (
          <div key={i} className={`bg-[#12161f] border rounded-xl p-4 ${kpi.alert ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/10'}`}>
            <span className="text-[11px] font-tech uppercase tracking-wider text-neutral-400 block truncate">
              {kpi.label}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-white font-tech my-1 block">
              {kpi.val}
            </span>
            <span className={`text-[10px] truncate block ${kpi.alert ? 'text-amber-400 font-bold' : 'text-neutral-500'}`}>{kpi.sub}</span>
          </div>
        ))}
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-white/10 gap-1 overflow-x-auto pb-1">
        {[
          { id: 'bookings', label: `Bookings (${bookings.length})`, icon: Calendar },
          { id: 'job-cards', label: `Job Cards (${jobCards.length})`, icon: FileText },
          { id: 'inventory', label: `Parts & Stock (${inventoryParts.length})`, icon: Package },
          { id: 'pickup-drop', label: `Valet Logistics (${pickupRequests.length})`, icon: Truck },
          { id: 'bays', label: `Workshop Bays (${bays.length})`, icon: Layers },
          { id: 'pricing', label: 'Dynamic Pricing', icon: DollarSign },
          { id: 'technicians', label: `Technicians (${technicians.length})`, icon: Users },
          { id: 'invoices', label: `Invoices (${invoices.length})`, icon: FileCheck },
          { id: 'reports', label: `Service History & Reports (${serviceHistory.length})`, icon: BarChart3 },
          { id: 'coupons', label: `Coupons (${coupons.length})`, icon: Tag },
          { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
          { id: 'audit', label: `Audit Trail (${auditLogs.length})`, icon: History }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 font-tech text-xs uppercase tracking-wider border-b-2 transition-all shrink-0 ${
                isActive
                  ? 'border-amber-400 text-white font-bold bg-white/5'
                  : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BOOKINGS MANAGEMENT */}
      {activeTab === 'bookings' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Controls: Search & Status Filter */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Booking ID, Customer Name, Vehicle or Reg#..."
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-tech uppercase"
              >
                <option value="all">All Statuses</option>
                <option value="booking_confirmed">Booking Confirmed</option>
                <option value="inspection">Inspection</option>
                <option value="quote_sent">Quote Sent</option>
                <option value="work_in_progress">Work In Progress</option>
                <option value="quality_check">Quality Check</option>
                <option value="ready_for_pickup">Ready for Pickup</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 font-tech uppercase tracking-wider">
                  <th className="py-3 px-3">Booking ID</th>
                  <th className="py-3 px-3">Customer & Contact</th>
                  <th className="py-3 px-3">Vehicle</th>
                  <th className="py-3 px-3">Service Package</th>
                  <th className="py-3 px-3">Assigned Bay</th>
                  <th className="py-3 px-3">Technician</th>
                  <th className="py-3 px-3">Status Pipeline</th>
                  <th className="py-3 px-3 text-right">Total (INR)</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-bold text-[#ff5500] block">{b.id}</span>
                      <span className="text-[10px] text-neutral-500 font-tech">{b.serviceDate}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <strong className="text-white block">{b.customerName}</strong>
                      <span className="text-neutral-400 text-[11px] font-mono">{b.customerPhone}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-white block font-medium">
                        {b.vehicleBrand} {b.vehicleModel}
                      </span>
                      <span className="text-neutral-400 text-[10px] font-mono">
                        {b.vehicleRegNumber || 'Reg Pending'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-neutral-300">{b.serviceName}</td>

                    {/* Bay Select */}
                    <td className="py-3.5 px-3">
                      <select
                        value={b.bayNumber || 'Bay 01'}
                        onChange={(e) => handleAssignBay(b.id, e.target.value)}
                        className="bg-black/60 border border-white/10 rounded px-2 py-1 text-white font-tech text-[11px]"
                      >
                        <option value="Bay 01">Bay 01 (Diag)</option>
                        <option value="Bay 02">Bay 02 (Lift)</option>
                        <option value="Bay 03">Bay 03 (Quick)</option>
                        <option value="Bay 04">Bay 04 (Brake)</option>
                        <option value="Bay 05">Bay 05 (Hunter)</option>
                        <option value="Bay 06">Bay 06 (Detail)</option>
                      </select>
                    </td>

                    {/* Tech Select */}
                    <td className="py-3.5 px-3">
                      <select
                        value={b.technicianId || 'tech-1'}
                        onChange={(e) => handleAssignTechnician(b.id, e.target.value)}
                        className="bg-black/60 border border-white/10 rounded px-2 py-1 text-white font-tech text-[11px]"
                      >
                        {technicians.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Status Select */}
                    <td className="py-3.5 px-3">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value as ServiceStatus)}
                        className={`border rounded px-2.5 py-1 text-[11px] font-tech font-bold uppercase ${
                          b.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : b.status === 'work_in_progress'
                            ? 'bg-[#ff5500]/20 text-[#ff5500] border-[#ff5500]/40'
                            : 'bg-black/60 text-white border-white/15'
                        }`}
                      >
                        <option value="booking_confirmed">01. Booking Confirmed</option>
                        <option value="vehicle_received">02. Vehicle Received</option>
                        <option value="inspection">03. Inspection</option>
                        <option value="diagnosis">04. Diagnosis</option>
                        <option value="quote_sent">05. Quote Sent</option>
                        <option value="quote_approved">06. Quote Approved</option>
                        <option value="work_in_progress">07. Work In Progress</option>
                        <option value="quality_check">08. Quality Check</option>
                        <option value="ready_for_pickup">09. Ready For Pickup</option>
                        <option value="completed">10. Completed</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                      ₹{b.priceBreakdown.grandTotal.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleConvertToJobCard(b)}
                          className="px-2.5 py-1 rounded-lg bg-[#ff5500]/15 hover:bg-[#ff5500]/25 text-[#ff5500] hover:text-white border border-[#ff5500]/30 font-tech text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
                          title="Generate workshop job card"
                        >
                          {jobCards.some((j) => j.bookingId === b.id) ? 'Job Card ✓' : '+ Job Card'}
                        </button>
                        <button
                          onClick={() => navigate(`/service/${b.id}`)}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
                          title="View Live Tracker"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: JOB CARDS & WORK ORDERS */}
      {activeTab === 'job-cards' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-bold text-white">Workshop Job Cards & Work Orders</h3>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Manage live technician execution, parts requisition, and customer additional work approvals.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 font-bold">
              Total Active: {jobCards.filter((j) => j.status !== 'delivered').length} Cards
            </span>
          </div>

          {jobCards.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <FileText className="w-12 h-12 text-neutral-500 mx-auto" />
              <h4 className="text-lg font-bold text-white">No Job Cards Generated Yet</h4>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Go to the "Bookings" tab and click "+ Job Card" on any booking to generate a full workshop work order.
              </p>
              <button
                onClick={() => setActiveTab('bookings')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black font-tech font-bold text-xs uppercase"
              >
                Go to Bookings
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 font-tech uppercase tracking-wider">
                    <th className="py-3 px-3">Job Card #</th>
                    <th className="py-3 px-3">Customer & Contact</th>
                    <th className="py-3 px-3">Vehicle</th>
                    <th className="py-3 px-3">Assigned Tech</th>
                    <th className="py-3 px-3">Bay</th>
                    <th className="py-3 px-3">Status Pipeline</th>
                    <th className="py-3 px-3 text-right">Parts + Labour</th>
                    <th className="py-3 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {jobCards.map((jc) => {
                    const totalParts = (jc.partsRequired || []).reduce((sum, p) => sum + (p.total || p.unitPrice * p.quantity), 0);
                    const totalLabour = (jc.labour || []).reduce((sum, l) => sum + (l.total || l.ratePerHour * l.hours), 0);
                    const totalAddl = (jc.additionalWork || [])
                      .filter((w) => w.status === 'approved')
                      .reduce((sum, w) => sum + w.partsCost + w.labourCost + (w.gst || 0), 0);
                    const totalCost = totalParts + totalLabour + totalAddl;

                    return (
                      <tr key={jc.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-3">
                          <span className="font-mono font-bold text-amber-400 block">{jc.jobCardNumber}</span>
                          <span className="text-[10px] text-neutral-500 font-tech">Ref: {jc.bookingId}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <strong className="text-white block">{jc.customerName}</strong>
                          <span className="text-neutral-400 text-[11px] font-mono">{jc.customerPhone}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="text-white block font-medium">
                            {jc.vehicleBrand} {jc.vehicleModel}
                          </span>
                          <span className="text-neutral-400 text-[10px] font-mono">{jc.vehicleRegNumber}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="text-white font-tech text-xs block">{jc.assignedTechnicianName}</span>
                          <span className="text-[10px] text-neutral-500">ID: {jc.assignedTechnicianId}</span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 font-mono text-white text-[11px]">
                            {jc.serviceBay}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <select
                            value={jc.jobStatus}
                            onChange={(e) => handleUpdateJobCardStatus(jc.id, e.target.value)}
                            className="bg-black/60 border border-white/10 rounded px-2 py-1 text-white font-tech text-[11px] font-bold uppercase"
                          >
                            <option value="OPEN">Open</option>
                            <option value="VEHICLE_RECEIVED">Vehicle Received</option>
                            <option value="INSPECTION">Inspection</option>
                            <option value="DIAGNOSIS">Diagnosis</option>
                            <option value="APPROVAL_PENDING">Approval Pending</option>
                            <option value="WORK_IN_PROGRESS">Work In Progress</option>
                            <option value="QUALITY_CHECK">Quality Check</option>
                            <option value="READY_FOR_DELIVERY">Ready For Delivery</option>
                            <option value="COMPLETED">Completed</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                          ₹{totalCost.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => setSelectedJobCard(jc)}
                            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-tech text-[11px] uppercase tracking-wider flex items-center gap-1 mx-auto"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Details</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB: PARTS & INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-bold text-white">Parts & Inventory Management</h3>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Real-time stock tracking, OEM spares catalog, reorder threshold alerts, and bin locations.
              </p>
            </div>
            <button
              onClick={() => setShowAddPartModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-tech font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add OEM Part</span>
            </button>
          </div>

          {/* Low Stock Warning Banner */}
          {inventoryParts.some((p) => p.stockQuantity <= p.minStock) && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Critical Low Stock Warning</h4>
                  <p className="text-xs text-neutral-300">
                    {inventoryParts.filter((p) => p.stockQuantity <= p.minStock).length} parts have fallen below workshop reorder thresholds.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded bg-amber-500/20 text-amber-400 font-tech font-bold text-[11px] uppercase">
                PO Generation Required
              </span>
            </div>
          )}

          {/* Inventory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 font-tech uppercase tracking-wider">
                  <th className="py-3 px-3">SKU & Code</th>
                  <th className="py-3 px-3">Part Name & Brand</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">In Stock</th>
                  <th className="py-3 px-3">Unit Cost</th>
                  <th className="py-3 px-3">Selling Price</th>
                  <th className="py-3 px-3">Bin Location</th>
                  <th className="py-3 px-3 text-center">Quick Stock Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {inventoryParts.map((part) => {
                  const isLow = part.stockQuantity <= part.minStock;
                  return (
                    <tr key={part.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="font-mono font-bold text-white block">{part.partNumber}</span>
                        <span className="text-[10px] text-neutral-500">Min: {part.minStock}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <strong className="text-white block">{part.name}</strong>
                        <span className="text-neutral-400 text-[11px]">{part.brand}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-tech uppercase text-neutral-300">
                          {part.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded ${
                            isLow ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {part.stockQuantity} units
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-neutral-300">
                        ₹{part.purchasePrice.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-white">
                        ₹{part.sellingPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-neutral-400">{part.warehouseLocation}</td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleAdjustPartStock(part.id, -1)}
                            className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 text-white font-mono font-bold border border-white/10"
                            title="Decrement stock (-1)"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleAdjustPartStock(part.id, 1)}
                            className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 text-white font-mono font-bold border border-white/10"
                            title="Increment stock (+1)"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleAdjustPartStock(part.id, 10)}
                            className="px-2 h-7 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-tech text-[10px] uppercase border border-amber-500/20 ml-1"
                            title="Restock bundle (+10)"
                          >
                            +10
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: VALET LOGISTICS (PICKUP & DROP) */}
      {activeTab === 'pickup-drop' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-bold text-white">Valet Pickup & Doorstep Delivery Logistics</h3>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Real-time concierge dispatch across Pune (Baner, Hinjawadi, Koregaon Park, Wakad).
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded bg-white/5 text-neutral-300 border border-white/10">
              Total Dispatches: {pickupRequests.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 font-tech uppercase tracking-wider">
                  <th className="py-3 px-3">Request ID</th>
                  <th className="py-3 px-3">Vehicle Details</th>
                  <th className="py-3 px-3">Customer & Location</th>
                  <th className="py-3 px-3">Date & Slot</th>
                  <th className="py-3 px-3">Assigned Driver</th>
                  <th className="py-3 px-3">Pipeline Status</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pickupRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-bold text-white block">{req.id}</span>
                      <span className="text-[10px] text-neutral-500">Booking: {req.bookingId}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <strong className="text-white block">{req.vehicleInfo}</strong>
                    </td>
                    <td className="py-3.5 px-3">
                      <strong className="text-white block">{req.customerName}</strong>
                      <span className="text-neutral-400 text-[11px] block">{req.pickupAddress}</span>
                      <span className="text-neutral-500 text-[10px] font-mono">{req.customerPhone}</span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-neutral-300">
                      <div>{req.date}</div>
                      <div className="text-neutral-500 text-[10px]">{req.time}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      {req.driverName ? (
                        <div>
                          <span className="text-white font-bold block">{req.driverName}</span>
                          <span className="text-[10px] font-mono text-neutral-400">{req.driverPhone}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDriverModalRequest(req)}
                          className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-tech text-[10px] uppercase font-bold"
                        >
                          + Assign Driver
                        </button>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 font-tech text-[10px] uppercase font-bold text-white">
                        {req.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setDriverModalRequest(req)}
                          className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-neutral-300 font-tech text-[10px] uppercase border border-white/10"
                        >
                          Reassign
                        </button>
                        {req.status !== 'DELIVERED' && (
                          <button
                            onClick={() => {
                              const nextMap: Record<string, any> = {
                                REQUESTED: 'DRIVER_ASSIGNED',
                                DRIVER_ASSIGNED: 'DRIVER_EN_ROUTE',
                                DRIVER_EN_ROUTE: 'VEHICLE_PICKED_UP',
                                VEHICLE_PICKED_UP: 'AT_WORKSHOP',
                                AT_WORKSHOP: 'READY_FOR_DROP',
                                READY_FOR_DROP: 'DELIVERED'
                              };
                              handleAdvancePickupStatus(req.id, nextMap[req.status] || 'DELIVERED');
                            }}
                            className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-tech text-[10px] uppercase font-bold border border-emerald-500/30"
                          >
                            Advance ➔
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: WORKSHOP BAYS FLOORPLAN */}
      {activeTab === 'bays' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Workshop Bays Floorplan (Baner Facility)</h3>
              <p className="text-xs text-neutral-400">
                Live status of all 6 dedicated hydraulic lift & diagnostic bays.
              </p>
            </div>
            <span className="text-xs font-tech uppercase text-neutral-400">
              Occupied: {bays.filter((b) => b.status === 'occupied').length} / {bays.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bays.map((bay) => (
              <div
                key={bay.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  bay.status === 'occupied'
                    ? 'bg-[#181f2c] border-[#ff5500]/40 shadow-lg'
                    : 'bg-black/30 border-white/10 opacity-70'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-tech font-bold uppercase tracking-wider text-neutral-400">
                      {bay.type}
                    </span>
                    <button
                      onClick={() => handleToggleBayStatus(bay.id)}
                      className={`text-[10px] font-tech font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        bay.status === 'occupied'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {bay.status.toUpperCase()} (Toggle)
                    </button>
                  </div>

                  <h4 className="font-extrabold text-lg text-white">{bay.name}</h4>

                  {bay.status === 'occupied' ? (
                    <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-neutral-200 font-medium">
                        <Car className="w-3.5 h-3.5 text-[#ff5500]" />
                        <span>{bay.vehicleModel || 'BMW 330i M Sport'}</span>
                      </div>
                      <p className="text-neutral-400 font-mono text-[11px]">
                        Booking: {bay.currentBookingId || 'TORQX-2026-00482'}
                      </p>
                      <p className="text-neutral-400 text-[11px]">
                        Lead: {bay.technicianName || 'Rahul Sharma'}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 p-4 rounded-xl bg-white/5 border border-dashed border-white/10 text-center text-xs text-neutral-500">
                      Bay Ready For Vehicle Check-in
                    </div>
                  )}
                </div>

                {bay.currentBookingId && (
                  <button
                    onClick={() => navigate(`/service/${bay.currentBookingId}`)}
                    className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-tech text-xs uppercase tracking-wider transition-colors"
                  >
                    View Active Bay Job
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DYNAMIC PRICING MATRIX */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">Dynamic Pricing Engine & Matrix</h3>
              <p className="text-xs text-neutral-400">
                Rule: Category Base (Economy / Premium / Luxury) × Trim Multiplier + Parts Ratio + Labour + Addons + 18% GST.
              </p>
            </div>

            {/* Live Pricing Test Sandbox */}
            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4">
              <h4 className="font-bold text-white text-sm uppercase font-tech tracking-wider text-amber-400">
                Interactive Pricing Simulator
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Brand</label>
                  <select
                    value={calcBrand}
                    onChange={(e) => {
                      setCalcBrand(e.target.value);
                      const b = VEHICLE_DATABASE.find((item) => item.name === e.target.value);
                      if (b && b.models.length > 0) setCalcModel(b.models[0].name);
                    }}
                    className="w-full bg-[#12161f] border border-white/10 rounded-xl p-3 text-white"
                  >
                    {VEHICLE_DATABASE.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name} ({b.category.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Model</label>
                  <select
                    value={calcModel}
                    onChange={(e) => setCalcModel(e.target.value)}
                    className="w-full bg-[#12161f] border border-white/10 rounded-xl p-3 text-white"
                  >
                    {VEHICLE_DATABASE.find((b) => b.name === calcBrand)?.models.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Service Package</label>
                  <select
                    value={calcService}
                    onChange={(e) => setCalcService(e.target.value)}
                    className="w-full bg-[#12161f] border border-white/10 rounded-xl p-3 text-white"
                  >
                    {COMPREHENSIVE_SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Result Display */}
              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-neutral-400 font-tech uppercase block">Computed Breakdown</span>
                  <span className="text-white font-mono">
                    Base: ₹{calculatedTestPrice.serviceBasePrice.toLocaleString('en-IN')} + Parts: ₹{calculatedTestPrice.partsEstimate.toLocaleString('en-IN')} + Labour: ₹{calculatedTestPrice.labourCharges.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 font-tech uppercase block">GST @ 18%</span>
                  <span className="text-white font-mono">₹{calculatedTestPrice.gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="text-amber-400 font-tech uppercase font-bold block">Grand Total Output</span>
                  <span className="text-2xl font-extrabold text-[#ff5500] font-tech">
                    ₹{calculatedTestPrice.grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Base Rates Catalog */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 font-tech uppercase tracking-wider">
                    <th className="py-3 px-3">Service</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3 text-right">Economy Base</th>
                    <th className="py-3 px-3 text-right">Premium Base</th>
                    <th className="py-3 px-3 text-right">Luxury Base</th>
                    <th className="py-3 px-3 text-center">Inspection Dependent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {COMPREHENSIVE_SERVICES.map((s) => (
                    <tr key={s.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 font-bold text-white">{s.title}</td>
                      <td className="py-3 px-3 text-neutral-400 uppercase font-tech">{s.category}</td>
                      <td className="py-3 px-3 text-right font-mono text-neutral-300">
                        ₹{s.basePriceEconomy.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-neutral-300">
                        ₹{s.basePricePremium.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-white font-bold">
                        ₹{s.basePriceLuxury.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {s.isInspectionDependent ? (
                          <span className="text-amber-400 text-[10px] font-tech font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10">
                            Yes
                          </span>
                        ) : (
                          <span className="text-neutral-500 text-[10px] font-tech uppercase">Fixed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TECHNICIANS ROSTER */}
      {activeTab === 'technicians' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Certified Master Technicians</h3>
              <p className="text-xs text-neutral-400">
                Roster of diagnostic leads, VAG specialists, and certified detailing artisans.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicians.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white/10 shadow"
                    />
                    <div>
                      <h4 className="font-bold text-base text-white">{t.name}</h4>
                      <span className="text-xs font-tech text-[#ff5500] uppercase block">{t.role}</span>
                      <span className="text-xs text-amber-400 font-tech">★ {t.rating} Rating</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 bg-white/5 p-2.5 rounded-lg border border-white/5">
                    {t.specialization}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-neutral-400 pt-2 border-t border-white/5">
                    <div>
                      <span className="block text-[10px] uppercase font-tech">Experience</span>
                      <strong className="text-white">{t.experienceYears} Years</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-tech">Completed Jobs</span>
                      <strong className="text-white">{t.completedJobs} Cars</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-neutral-400 font-mono">{t.phone}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-tech uppercase ${
                      t.status === 'available'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {t.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: INVOICES & BILLING */}
      {activeTab === 'invoices' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white">All Issued GST Invoices</h3>
              <p className="text-xs text-neutral-400">
                Official billing registers and payment collection status.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 font-tech uppercase tracking-wider">
                  <th className="py-3 px-3">Invoice Number</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Customer Name</th>
                  <th className="py-3 px-3">Vehicle Details</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Amount (INR)</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-[#ff5500]">{inv.invoiceNumber}</td>
                    <td className="py-3.5 px-3 text-neutral-300 font-tech">{inv.date}</td>
                    <td className="py-3.5 px-3 text-white font-medium">{inv.customerName}</td>
                    <td className="py-3.5 px-3 text-neutral-400">{inv.vehicleDetails}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-tech font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          inv.paymentStatus === 'paid'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                      ₹{inv.total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => navigate(`/service/${inv.bookingId}`)}
                        className="text-[#ff5500] hover:underline font-tech uppercase text-[11px]"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: COUPONS & OFFERS */}
      {activeTab === 'coupons' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Coupons & Promotional Offers</h3>
              <p className="text-xs text-neutral-400">
                Manage discounts applied at booking checkout.
              </p>
            </div>
            <button
              onClick={() => setShowCouponModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 text-black font-tech font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="p-5 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-base font-extrabold text-white tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10">
                      {c.code}
                    </span>
                    <span className="text-xs text-emerald-400 font-tech font-bold">
                      {c.discountType === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 mt-2">{c.description}</p>
                </div>

                <div className="text-[11px] text-neutral-500 pt-3 border-t border-white/5 flex justify-between font-tech">
                  <span>Min Order: ₹{c.minOrder.toLocaleString('en-IN')}</span>
                  <span>Valid until: {c.validUntil}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Customer Reviews Moderation</h3>
              <p className="text-xs text-neutral-400">
                Approve verified customer feedback before it displays on the homepage.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="p-5 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-white text-sm">{r.name}</strong>
                    <span className="text-xs text-neutral-400 font-tech">({r.location})</span>
                    <span className="text-amber-400 font-tech text-xs">★ {r.rating}/5</span>
                  </div>
                  <p className="text-xs text-neutral-300 italic">"{r.quote}"</p>
                  <p className="text-[11px] text-neutral-500 font-tech">
                    Car: {r.carModel} • Service: {r.serviceType}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleReview(r.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-tech font-bold uppercase tracking-wider shrink-0 ${
                    r.approved
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {r.approved ? 'Approved ✓' : 'Hidden ✕'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: AUDIT TRAIL & SYSTEM LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-bold text-white">System Security & Operations Audit Trail</h3>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Immutable chronological log of all garage events, parts adjustments, approvals, and authorization sessions.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded bg-white/5 text-neutral-400 border border-white/10">
              Total Log Entries: {auditLogs.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 font-tech uppercase tracking-wider">
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">User & Role</th>
                  <th className="py-3 px-3">Action Type</th>
                  <th className="py-3 px-3">Target Entity</th>
                  <th className="py-3 px-3">Operational Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-3 font-mono text-neutral-400 text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3.5 px-3">
                      <strong className="text-white block">{log.userName}</strong>
                      <span className="text-[10px] font-tech uppercase px-1.5 py-0.2 rounded bg-white/10 text-neutral-300">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-tech text-white uppercase text-[11px] block">{log.entity}</span>
                      <span className="text-neutral-500 font-mono text-[10px]">{log.entityId}</span>
                    </td>
                    <td className="py-3.5 px-3 text-neutral-300 max-w-md">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: SERVICE HISTORY & REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-amber-400" />
                Workshop Service History & Fleet Analytics
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Centralized registry of delivered work orders, parts consumed, technician allocations, and customer recall milestones.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportHistoryCSV}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-tech text-xs uppercase tracking-wider transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Historical Analytics Mini Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <span className="text-[10px] font-tech uppercase text-neutral-400 block">Total Work Orders</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">{serviceHistory.length}</span>
              <span className="text-[10px] text-emerald-400">100% Quality Inspected</span>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <span className="text-[10px] font-tech uppercase text-neutral-400 block">Historical Turnover</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                ₹{serviceHistory.reduce((acc, r) => acc + r.totalCost, 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-neutral-400">Excl. GST adjustments</span>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <span className="text-[10px] font-tech uppercase text-neutral-400 block">Average Ticket Size</span>
              <span className="text-2xl font-bold font-mono text-amber-400 mt-1 block">
                ₹{serviceHistory.length > 0 ? Math.round(serviceHistory.reduce((acc, r) => acc + r.totalCost, 0) / serviceHistory.length).toLocaleString('en-IN') : 0}
              </span>
              <span className="text-[10px] text-neutral-400">Per vehicle work order</span>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <span className="text-[10px] font-tech uppercase text-neutral-400 block">Active Warranties</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                {serviceHistory.filter((r) => !r.warrantyPeriod || r.warrantyPeriod.includes('12')).length}
              </span>
              <span className="text-[10px] text-emerald-400">12 Mo OEM Guarantee</span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Search Reg#, Owner, Vehicle, Service, or Tech..."
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-400" />
              <select
                value={historyBrandFilter}
                onChange={(e) => setHistoryBrandFilter(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-tech uppercase focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Vehicle Brands</option>
                <option value="BMW">BMW</option>
                <option value="Audi">Audi</option>
                <option value="Mercedes">Mercedes-Benz</option>
                <option value="Skoda">Skoda</option>
                <option value="Volkswagen">Volkswagen</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Tata">Tata</option>
              </select>
            </div>
          </div>

          {/* Service History Records Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 font-tech uppercase tracking-wider">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Vehicle Details</th>
                  <th className="py-3 px-3">Customer Contact</th>
                  <th className="py-3 px-3">Service Scope</th>
                  <th className="py-3 px-3">Odometer</th>
                  <th className="py-3 px-3">Technician</th>
                  <th className="py-3 px-3 text-right">Turnover</th>
                  <th className="py-3 px-3 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredServiceHistory.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-neutral-500 font-tech uppercase">
                      No matching historical service records found.
                    </td>
                  </tr>
                ) : (
                  filteredServiceHistory.map((rec) => (
                    <tr key={rec.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-3 text-white font-tech font-bold">{rec.date}</td>
                      <td className="py-3.5 px-3">
                        <strong className="text-white block">{rec.vehicleDetails}</strong>
                        <span className="text-amber-400 font-mono text-[11px] font-bold">{rec.vehicleRegNumber}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-neutral-200 block">{rec.customerName}</span>
                        <span className="text-neutral-400 font-mono text-[11px]">{rec.customerPhone}</span>
                      </td>
                      <td className="py-3.5 px-3 text-neutral-300">
                        <span>{rec.serviceType}</span>
                        {rec.partsReplaced && rec.partsReplaced.length > 0 && (
                          <span className="text-[10px] text-neutral-500 block font-mono">
                            {rec.partsReplaced.length} OEM parts replaced
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-neutral-300">
                        {rec.odometer.toLocaleString('en-IN')} KM
                      </td>
                      <td className="py-3.5 px-3 text-neutral-300">{rec.technicianName}</td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                        ₹{rec.totalCost.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => setSelectedHistoryRecord(rec)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-amber-400 hover:text-black text-amber-300 font-tech text-xs uppercase tracking-wider transition-all inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Audit</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* JOB CARD DETAILS MODAL */}
      {selectedJobCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12161f] border border-white/15 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-tech uppercase text-amber-400 font-bold tracking-widest block">
                  Official Workshop Job Order
                </span>
                <h3 className="text-2xl font-mono font-extrabold text-white">
                  Job Card #{selectedJobCard.jobCardNumber}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Linked to Service Booking ID: <strong className="text-white font-mono">{selectedJobCard.bookingId}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedJobCard(null)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vehicle & Customer Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-black/40 border border-white/10 text-xs">
              <div>
                <span className="text-neutral-500 block uppercase font-tech text-[10px]">Customer</span>
                <strong className="text-white">{selectedJobCard.customerName}</strong>
                <span className="text-neutral-400 block font-mono text-[11px]">{selectedJobCard.customerPhone}</span>
              </div>
              <div>
                <span className="text-neutral-500 block uppercase font-tech text-[10px]">Vehicle</span>
                <strong className="text-white">{selectedJobCard.vehicleBrand} {selectedJobCard.vehicleModel}</strong>
                <span className="text-amber-400 block font-mono text-[11px]">{selectedJobCard.vehicleRegNumber}</span>
              </div>
              <div>
                <span className="text-neutral-500 block uppercase font-tech text-[10px]">Assigned Tech</span>
                <strong className="text-white">{selectedJobCard.assignedTechnicianName}</strong>
                <span className="text-neutral-400 block text-[11px]">ID: {selectedJobCard.assignedTechnicianId}</span>
              </div>
              <div>
                <span className="text-neutral-500 block uppercase font-tech text-[10px]">Service Bay</span>
                <strong className="text-white font-mono">{selectedJobCard.serviceBay}</strong>
                <span className="text-emerald-400 block uppercase font-tech text-[10px] font-bold">
                  Status: {selectedJobCard.jobStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Primary Work Description */}
            <div className="p-4 rounded-xl bg-black/20 border border-white/10 space-y-1">
              <span className="text-[10px] font-tech uppercase text-neutral-400 tracking-wider">Primary Scope & Customer Complaint</span>
              <p className="text-xs text-white font-medium">{selectedJobCard.customerComplaint}</p>
              {selectedJobCard.technicianDiagnosis && (
                <p className="text-xs text-neutral-400 italic mt-2">Diagnosis: "{selectedJobCard.technicianDiagnosis}"</p>
              )}
            </div>

            {/* Requisitioned Spares */}
            <div className="space-y-3">
              <h4 className="text-xs font-tech uppercase tracking-wider text-amber-400 font-bold">
                Requisitioned OEM Spares ({(selectedJobCard.partsRequired || []).length})
              </h4>
              <div className="overflow-x-auto border border-white/10 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/40 text-neutral-400 font-tech uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Part Name</th>
                      <th className="py-2.5 px-3">Qty</th>
                      <th className="py-2.5 px-3">Rate</th>
                      <th className="py-2.5 px-3">Part #</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-black/20">
                    {(selectedJobCard.partsRequired || []).map((p) => (
                      <tr key={p.id}>
                        <td className="py-2.5 px-3 text-white font-medium">{p.name}</td>
                        <td className="py-2.5 px-3 font-mono text-neutral-300">{p.quantity}</td>
                        <td className="py-2.5 px-3 font-mono text-neutral-400">₹{p.unitPrice.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 font-mono text-neutral-400">{p.partNumber || '-'}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-white">
                          ₹{(p.total || p.unitPrice * p.quantity).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Additional Work (if any) */}
            {selectedJobCard.additionalWork && selectedJobCard.additionalWork.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-tech uppercase tracking-wider text-purple-400 font-bold">
                  Additional Work Approvals ({selectedJobCard.additionalWork.length})
                </h4>
                <div className="space-y-2">
                  {selectedJobCard.additionalWork.map((w) => (
                    <div
                      key={w.id}
                      className="p-3 rounded-xl bg-black/30 border border-white/10 flex justify-between items-center text-xs"
                    >
                      <div>
                        <strong className="text-white block">{w.title}</strong>
                        <p className="text-neutral-400 text-[11px]">{w.description}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-[10px] font-tech uppercase font-bold px-2 py-0.5 rounded ${
                            w.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : w.status === 'rejected'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {w.status.replace(/_/g, ' ')}
                        </span>
                        <div className="font-mono font-bold text-white mt-1">
                          ₹{(w.partsCost + w.labourCost).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setSelectedJobCard(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-tech uppercase text-xs"
              >
                Close Job Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE HISTORY RECORD INSPECTION MODAL */}
      {selectedHistoryRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12161f] border border-white/15 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-tech uppercase text-amber-400 font-bold tracking-widest block">
                  Certified Archival Service Record
                </span>
                <h3 className="text-2xl font-mono font-extrabold text-white">
                  {selectedHistoryRecord.id}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Delivered on <strong className="text-white">{selectedHistoryRecord.date}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedHistoryRecord(null)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vehicle & Customer Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-black/40 border border-white/10 text-xs">
              <div>
                <span className="text-neutral-500 uppercase font-tech text-[10px] block">Vehicle</span>
                <strong className="text-white block">{selectedHistoryRecord.vehicleDetails}</strong>
                <span className="text-amber-400 font-mono text-[11px] font-bold">{selectedHistoryRecord.vehicleRegNumber}</span>
              </div>
              <div>
                <span className="text-neutral-500 uppercase font-tech text-[10px] block">Customer</span>
                <strong className="text-white block">{selectedHistoryRecord.customerName}</strong>
                <span className="text-neutral-400 font-mono text-[11px]">{selectedHistoryRecord.customerPhone}</span>
              </div>
              <div>
                <span className="text-neutral-500 uppercase font-tech text-[10px] block">Technician & Odometer</span>
                <strong className="text-white block">{selectedHistoryRecord.technicianName}</strong>
                <span className="text-neutral-300 font-mono text-[11px]">{selectedHistoryRecord.odometer.toLocaleString('en-IN')} KM</span>
              </div>
            </div>

            {/* Scope & Parts */}
            <div className="space-y-2">
              <span className="text-xs font-tech uppercase tracking-wider text-neutral-400 block">
                Executed Service Scope
              </span>
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 text-xs text-neutral-200">
                {selectedHistoryRecord.serviceType}
              </div>
            </div>

            {selectedHistoryRecord.partsReplaced && selectedHistoryRecord.partsReplaced.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-tech uppercase tracking-wider text-neutral-400 block">
                  OEM Parts Replaced & Documented
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedHistoryRecord.partsReplaced.map((part, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-neutral-200 font-mono flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{part}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Warranty & Cost Summary */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-300">
                <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Warranty: <strong>{selectedHistoryRecord.warrantyPeriod || '12 Months / 20,000 km'}</strong></span>
              </div>
              <div className="text-right">
                <span className="text-neutral-400 text-[10px] block uppercase font-tech">Total Invoice Amount</span>
                <strong className="text-lg font-mono font-bold text-white">
                  ₹{selectedHistoryRecord.totalCost.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setSelectedHistoryRecord(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-tech uppercase text-xs"
              >
                Close Audit Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD OEM PART MODAL */}
      {showAddPartModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12161f] border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg text-white">Add OEM Spares to Workshop Inventory</h3>
              </div>
              <button onClick={() => setShowAddPartModal(false)} className="text-neutral-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePart} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Part SKU / Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BRK-PAD-004"
                    value={newPartSku}
                    onChange={(e) => setNewPartSku(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Category</label>
                  <select
                    value={newPartCategory}
                    onChange={(e) => setNewPartCategory(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-tech uppercase"
                  >
                    <option value="fluids">Fluids & Lubricants</option>
                    <option value="filters">Filters</option>
                    <option value="brakes">Braking System</option>
                    <option value="suspension">Suspension & Steering</option>
                    <option value="electrical">Electrical & Batteries</option>
                    <option value="engine">Engine Mechanical</option>
                    <option value="tyres">Tyres & Wheels</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-tech uppercase text-neutral-400 mb-1">Part Full Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Motul 8100 X-cess Gen2 5W-40 Fully Synthetic Engine Oil"
                  value={newPartName}
                  onChange={(e) => setNewPartName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Brand / OEM Manufacturer</label>
                  <input
                    type="text"
                    value={newPartBrand}
                    onChange={(e) => setNewPartBrand(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Bin / Shelf Location</label>
                  <input
                    type="text"
                    value={newPartLocation}
                    onChange={(e) => setNewPartLocation(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Initial Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={newPartStock}
                    onChange={(e) => setNewPartStock(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Min Threshold</label>
                  <input
                    type="number"
                    min="1"
                    value={newPartMin}
                    onChange={(e) => setNewPartMin(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Unit Cost (₹)</label>
                  <input
                    type="number"
                    value={newPartCost}
                    onChange={(e) => setNewPartCost(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Sell Price (₹)</label>
                  <input
                    type="number"
                    value={newPartPrice}
                    onChange={(e) => setNewPartPrice(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPartModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-neutral-300 font-tech uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-black font-tech font-bold uppercase shadow"
                >
                  Add to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN CHAUFFEUR / DRIVER MODAL */}
      {driverModalRequest && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12161f] border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg text-white">Assign Valet Chauffeur</h3>
              </div>
              <button onClick={() => setDriverModalRequest(null)} className="text-neutral-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignDriverSubmit} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] font-tech uppercase text-neutral-400">Customer & Destination</span>
                <strong className="text-white block">{driverModalRequest.customerName}</strong>
                <p className="text-neutral-400 text-[11px]">{driverModalRequest.pickupAddress}</p>
                <span className="text-amber-400 font-mono text-[10px] block mt-1">
                  Vehicle: {driverModalRequest.vehicleInfo} • Slot: {driverModalRequest.date} ({driverModalRequest.time})
                </span>
              </div>

              <div>
                <label className="block font-tech uppercase text-neutral-400 mb-1">Chauffeur / Driver Name</label>
                <input
                  type="text"
                  required
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block font-tech uppercase text-neutral-400 mb-1">Driver Phone Number</label>
                <input
                  type="text"
                  required
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDriverModalRequest(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-neutral-300 font-tech uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-black font-tech font-bold uppercase shadow"
                >
                  Confirm & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE COUPON MODAL */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12161f] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-lg text-white">Create New Workshop Coupon</h3>
              <button
                onClick={() => setShowCouponModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-tech uppercase text-neutral-400 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE20"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat INR (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-tech uppercase text-neutral-400 mb-1">Min Order Value (INR)</label>
                <input
                  type="number"
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-neutral-300 font-tech uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-black font-tech font-bold uppercase shadow"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
