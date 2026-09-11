import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Wrench,
  Car,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Plus,
  Package,
  Camera,
  Send,
  ShieldCheck,
  ChevronRight,
  ClipboardCheck,
  Zap,
  Activity,
  User,
  Check
} from 'lucide-react';
import { JobCard, JobStatus, InventoryPart, InspectionReport } from '../types';
import { JobCardService } from '../services/jobCardService';
import { InventoryService } from '../services/inventoryService';
import { StorageService, STORAGE_KEYS } from '../services/storageService';
import { AuthService } from '../services/authService';
import { NotificationService } from '../services/notificationService';
import { AuditService } from '../services/auditService';

export const TechnicianDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId?: string }>();

  const [activeTab, setActiveTab] = useState<'jobs' | 'job-detail' | 'inspection' | 'parts' | 'bay'>('jobs');
  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobCard | null>(null);
  const [inventory, setInventory] = useState<InventoryPart[]>([]);

  // Technician Form States
  const [diagText, setDiagText] = useState('');
  const [labourDesc, setLabourDesc] = useState('');
  const [labourHours, setLabourHours] = useState(1);
  const [labourRate, setLabourRate] = useState(900);

  // Parts Request State
  const [selectedPartId, setSelectedPartId] = useState('');
  const [partQty, setPartQty] = useState(1);

  // Additional Work Request State
  const [showAddWorkModal, setShowAddWorkModal] = useState(false);
  const [addWorkDesc, setAddWorkDesc] = useState('');
  const [addWorkPartsCost, setAddWorkPartsCost] = useState(2500);
  const [addWorkLabourCost, setAddWorkLabourCost] = useState(1200);

  // Photo Upload State
  const [photoUrlInput, setPhotoUrlInput] = useState('');

  // DVI (Digital Vehicle Inspection) State
  const [dviCategories, setDviCategories] = useState([
    { name: 'Engine System & Mounts', status: 'pass', note: 'Idling smooth, oil condition nominal' },
    { name: 'Transmission & Clutch', status: 'pass', note: 'Shifts crisp, fluid level standard' },
    { name: 'Braking Hardware & Rotors', status: 'attention', note: 'Front pads at 4mm wear limit' },
    { name: 'Suspension & Bushings', status: 'pass', note: 'Struts intact, no hydraulic weep' },
    { name: 'Steering & Alignment', status: 'pass', note: 'Centering accurate, zero play' },
    { name: 'Tyres & Tread Depth', status: 'pass', note: '5.2mm tread remaining across all 4' },
    { name: 'Battery Health & Cranking', status: 'pass', note: '12.6V static, 14.1V alternator charging' },
    { name: 'Air Conditioning / HVAC', status: 'attention', note: 'Cabin filter shows dust saturation' },
    { name: 'Cooling System & Radiator', status: 'pass', note: 'Coolant boiling point test passed' },
    { name: 'Fluids & Lubricants', status: 'pass', note: 'Brake fluid moisture < 1.5%' },
    { name: 'Electrical & Onboard Sensors', status: 'pass', note: 'ECU scan returns zero active DTC codes' },
    { name: 'Exterior Lighting & Glass', status: 'pass', note: 'Bi-LED projectors aligned to spec' },
    { name: 'Underbody & Exhaust Integrity', status: 'pass', note: 'Exhaust hangers tight, no rust' }
  ]);
  const [dviSaved, setDviSaved] = useState(false);

  const loadData = () => {
    const all = JobCardService.getAllJobCards();
    setJobCards(all);
    setInventory(InventoryService.getAllParts());

    if (jobId) {
      const found = all.find((j) => j.id === jobId || j.jobCardNumber === jobId);
      if (found) {
        setSelectedJob(found);
        setActiveTab('job-detail');
      }
    } else if (all.length > 0 && !selectedJob) {
      setSelectedJob(all[0]);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, [jobId]);

  const handleSelectJob = (job: JobCard) => {
    setSelectedJob(job);
    setActiveTab('job-detail');
  };

  const handleStatusChange = (status: JobStatus) => {
    if (!selectedJob) return;
    const updated = JobCardService.updateJobStatus(selectedJob.id, status, `Technician updated status to ${status}`);
    if (updated) {
      setSelectedJob(updated);
      loadData();
      AuditService.log({
        userId: 'user-tech1',
        userName: 'Rahul Sharma',
        userRole: 'technician',
        action: 'UPDATE_JOB_STATUS',
        entity: 'JobCard',
        entityId: updated.jobCardNumber,
        newValue: status
      });
    }
  };

  const handleSaveDiagnosis = () => {
    if (!selectedJob || !diagText.trim()) return;
    const updated = JobCardService.addTechnicianDiagnosis(selectedJob.id, diagText);
    if (updated) {
      setSelectedJob(updated);
      setDiagText('');
      loadData();
    }
  };

  const handleAddLabour = () => {
    if (!selectedJob || !labourDesc.trim()) return;
    const total = labourHours * labourRate;
    const updated = JobCardService.addLabourToJob(selectedJob.id, {
      id: `lab-${Date.now()}`,
      description: labourDesc,
      hours: labourHours,
      ratePerHour: labourRate,
      total
    });
    if (updated) {
      setSelectedJob(updated);
      setLabourDesc('');
      loadData();
    }
  };

  const handleAddPartToJob = () => {
    if (!selectedJob || !selectedPartId) return;
    const part = inventory.find((p) => p.id === selectedPartId);
    if (!part) return;

    // Deduct/reserve from inventory
    InventoryService.reserveStock(part.id, partQty);

    const res = JobCardService.addPartToJob(selectedJob.id, {
      id: `jc-part-${Date.now()}`,
      inventoryPartId: part.id,
      partNumber: part.partNumber,
      name: part.name,
      quantity: partQty,
      unitPrice: part.sellingPrice,
      total: part.sellingPrice * partQty
    });

    if (res && res.jobCard) {
      setSelectedJob(res.jobCard);
      setSelectedPartId('');
      setPartQty(1);
      loadData();
    }
  };

  const handleRequestAdditionalWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !addWorkDesc.trim()) return;

    const updated = JobCardService.requestAdditionalWork(selectedJob.id, {
      description: addWorkDesc,
      partsCost: Number(addWorkPartsCost),
      labourCost: Number(addWorkLabourCost)
    });

    if (updated) {
      setSelectedJob(updated);
      setShowAddWorkModal(false);
      setAddWorkDesc('');
      loadData();
    }
  };

  const handleAddPhoto = () => {
    if (!selectedJob || !photoUrlInput.trim()) return;
    const updated = JobCardService.addPhoto(selectedJob.id, photoUrlInput.trim());
    if (updated) {
      setSelectedJob(updated);
      setPhotoUrlInput('');
      loadData();
    }
  };

  const handleCompleteJob = () => {
    if (!selectedJob) return;
    if (window.confirm(`Confirm completion of Job #${selectedJob.jobCardNumber}? This will finalize the bill and notify the customer for vehicle collection.`)) {
      const res = JobCardService.completeJob(selectedJob.id);
      if (res) {
        setSelectedJob(res.jobCard);
        loadData();
      }
    }
  };

  const handleSaveDvi = () => {
    setDviSaved(true);
    NotificationService.notifyUser(
      selectedJob ? selectedJob.customerEmail : 'user-vikram',
      'Digital Vehicle Inspection (DVI) Complete',
      `The master technician has finalized the 13-point mechanical inspection for your vehicle. Health Score: 92%.`,
      'success'
    );
    setTimeout(() => setDviSaved(false), 3000);
  };

  const healthScore = Math.round(
    (dviCategories.filter((c) => c.status === 'pass').length / dviCategories.length) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Workspace Header */}
      <div className="bg-[#12161f] border border-cyan-500/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Wrench className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-display font-extrabold text-white tracking-tight">
                Master Technician Terminal
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                Bay 01 Active
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Logged in: <strong className="text-white">Rahul Sharma</strong> (Master Diagnostics & Engine Calibration)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-right">
            <span className="text-[10px] font-tech uppercase text-neutral-400 block">Queue Status</span>
            <span className="text-base font-bold text-white font-mono">
              {jobCards.filter((j) => j.jobStatus !== 'COMPLETED').length} Active Jobs
            </span>
          </div>
          <button
            onClick={() => {
              AuthService.logout();
              navigate('/login');
            }}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-tech uppercase border border-white/10"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-1">
        {[
          { id: 'jobs', label: `Assigned Job Cards (${jobCards.length})`, icon: Wrench },
          { id: 'job-detail', label: 'Active Job Card Execution', icon: Activity },
          { id: 'inspection', label: 'Digital Vehicle Inspection (DVI)', icon: ClipboardCheck },
          { id: 'parts', label: 'Workshop Parts Catalog', icon: Package },
          { id: 'bay', label: 'Bay Telemetry & Diagnostics', icon: Zap }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 font-tech text-xs uppercase tracking-wider border-b-2 transition-all shrink-0 ${
                isActive
                  ? 'border-cyan-400 text-white font-bold bg-white/5'
                  : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-neutral-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ASSIGNED JOBS LIST */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Technician Job Queue</h2>
            <span className="text-xs text-neutral-400">Select any job card to begin diagnostic or execution</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobCards.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => handleSelectJob(job)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-cyan-950/20 border-cyan-500/50 shadow-lg shadow-cyan-950/50'
                      : 'bg-[#12161f] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">{job.jobCardNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-tech font-bold uppercase tracking-wider ${
                        job.jobStatus === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : job.jobStatus === 'APPROVAL_PENDING'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-cyan-500/20 text-cyan-300'
                      }`}
                    >
                      {job.jobStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">
                      {job.vehicleBrand} {job.vehicleModel}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                      <span className="font-mono text-neutral-300">{job.vehicleRegNumber}</span>
                      <span>•</span>
                      <span>{job.serviceBay}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs text-neutral-300 space-y-1">
                    <span className="text-[10px] font-tech uppercase text-neutral-400 block">Customer Complaint</span>
                    <p className="line-clamp-2 italic text-neutral-400">{job.customerComplaint}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="text-neutral-400">Owner: {job.customerName}</span>
                    <span className="font-tech text-cyan-400 font-bold flex items-center gap-1">
                      Execute Job <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE JOB CARD EXECUTION */}
      {activeTab === 'job-detail' && selectedJob && (
        <div className="space-y-6">
          {/* Active Job Hero Bar */}
          <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-400 text-xs font-bold">{selectedJob.jobCardNumber}</span>
                <span className="text-neutral-500">•</span>
                <span className="text-xs text-neutral-400">Bay: {selectedJob.serviceBay}</span>
                <span className="text-neutral-500">•</span>
                <span className="text-xs text-neutral-400">Check-in: {selectedJob.checkInDate}</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                {selectedJob.vehicleBrand} {selectedJob.vehicleModel} ({selectedJob.vehicleVariant})
              </h2>
              <p className="text-xs text-neutral-400">
                Owner: <strong className="text-white">{selectedJob.customerName}</strong> • Phone: {selectedJob.customerPhone} • Reg: <strong className="font-mono text-white">{selectedJob.vehicleRegNumber}</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowAddWorkModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-tech font-bold uppercase tracking-wider flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Request Extra Work Approval</span>
              </button>

              <button
                onClick={handleCompleteJob}
                disabled={selectedJob.jobStatus === 'COMPLETED'}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-tech font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finalize & Complete Job</span>
              </button>
            </div>
          </div>

          {/* Workflow Stage Transitions */}
          <div className="bg-[#12161f] border border-white/10 rounded-2xl p-5 space-y-3">
            <span className="text-xs font-tech uppercase tracking-wider text-neutral-400 block">
              Workshop Stage Progression
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {[
                { status: 'VEHICLE_RECEIVED', label: 'Received' },
                { status: 'ASSIGNED', label: 'Assigned' },
                { status: 'DIAGNOSIS', label: 'Diagnosis' },
                { status: 'APPROVAL_PENDING', label: 'Approval Req' },
                { status: 'WORK_IN_PROGRESS', label: 'In Progress' },
                { status: 'QUALITY_CHECK', label: 'Quality Test' },
                { status: 'READY_FOR_DELIVERY', label: 'Ready Delivery' },
                { status: 'COMPLETED', label: 'Completed' }
              ].map((step) => {
                const isCurrent = selectedJob.jobStatus === step.status;
                return (
                  <button
                    key={step.status}
                    onClick={() => handleStatusChange(step.status as JobStatus)}
                    className={`p-2.5 rounded-xl border text-center font-tech text-[11px] uppercase tracking-wider transition-all flex flex-col items-center gap-1.5 ${
                      isCurrent
                        ? 'bg-cyan-500 text-black border-cyan-400 font-bold shadow-lg shadow-cyan-500/30'
                        : 'bg-black/30 border-white/5 text-neutral-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current opacity-80" />
                    <span className="leading-tight">{step.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Diagnosis & Labour Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Diagnosis & Notes */}
            <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">Technician Diagnostics & Fault Log</h3>
                <span className="text-[11px] font-tech text-cyan-400">OBD-II LIVE LINKED</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
                <span className="text-neutral-400 text-[10px] font-tech uppercase">Current Diagnosis Finding</span>
                <p className="text-white font-mono">{selectedJob.technicianDiagnosis || 'Pending evaluation...'}</p>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-tech uppercase text-neutral-400 block">
                  Update Technical Diagnosis Note
                </label>
                <textarea
                  rows={3}
                  value={diagText}
                  onChange={(e) => setDiagText(e.target.value)}
                  placeholder="Record observed play in suspension arm, rotor thickness measurement, ECU error code..."
                  className="w-full rounded-xl bg-black/40 border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={handleSaveDiagnosis}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold uppercase text-xs"
                >
                  Save Diagnosis to Job Card
                </button>
              </div>

              {/* Internal Notes History */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-tech uppercase text-neutral-400 block">
                  Internal Workshop Audit Notes ({selectedJob.notes?.length || 0})
                </span>
                <div className="space-y-1 max-h-32 overflow-y-auto pr-2 text-[11px] font-mono text-neutral-300">
                  {(selectedJob.notes || []).map((n, i) => (
                    <div key={i} className="p-2 rounded bg-black/20 border border-white/5">
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Labour Hours Tracker */}
            <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">Labour & Workshop Operations</h3>
                <span className="text-[11px] font-tech text-emerald-400">BILLABLE LABOUR</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {(selectedJob.labour || []).map((l) => (
                  <div key={l.id} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-white block">{l.description}</strong>
                      <span className="text-neutral-400 text-[11px]">{l.hours} hrs @ ₹{l.ratePerHour}/hr</span>
                    </div>
                    <strong className="font-mono text-white text-sm">₹{l.total.toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-3">
                <span className="text-[11px] font-tech uppercase text-neutral-300 block">Add Workshop Operation</span>
                <input
                  type="text"
                  value={labourDesc}
                  onChange={(e) => setLabourDesc(e.target.value)}
                  placeholder="e.g. Brake Caliper Ultrasonic Cleaning & Lube"
                  className="w-full rounded-xl bg-black/40 border border-white/10 p-2.5 text-xs text-white"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      value={labourHours}
                      onChange={(e) => setLabourHours(Number(e.target.value))}
                      className="w-full rounded-xl bg-black/40 border border-white/10 p-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">Rate/Hr (₹)</label>
                    <input
                      type="number"
                      value={labourRate}
                      onChange={(e) => setLabourRate(Number(e.target.value))}
                      className="w-full rounded-xl bg-black/40 border border-white/10 p-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddLabour}
                  className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-tech font-bold uppercase text-xs"
                >
                  Append Labour Operation
                </button>
              </div>
            </div>
          </div>

          {/* Parts Requisition for this Job */}
          <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="font-bold text-white text-base">Allocated Spare Parts</h3>
                <p className="text-xs text-neutral-400">Directly synchronized with TORQX Warehouse inventory</p>
              </div>
              <span className="text-xs font-mono text-cyan-400">
                {selectedJob.partsRequired?.length || 0} Parts Attached
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Existing parts */}
              <div className="space-y-2">
                {(selectedJob.partsRequired || []).length === 0 ? (
                  <div className="p-4 rounded-xl bg-black/30 border border-dashed border-white/10 text-center text-xs text-neutral-500">
                    No spare parts billed to this job card yet. Select from inventory below.
                  </div>
                ) : (
                  (selectedJob.partsRequired || []).map((p, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white block">{p.partName}</strong>
                        <span className="text-neutral-400 text-[11px] font-mono">
                          SKU: {p.partNumber} • Qty: {p.quantity} × ₹{p.unitPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <strong className="text-white font-mono">₹{p.total.toLocaleString('en-IN')}</strong>
                    </div>
                  ))
                )}
              </div>

              {/* Add part form */}
              <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
                <span className="text-[11px] font-tech uppercase text-neutral-300 block">Attach Warehouse Part</span>
                <select
                  value={selectedPartId}
                  onChange={(e) => setSelectedPartId(e.target.value)}
                  className="w-full rounded-xl bg-black/50 border border-white/10 p-2.5 text-xs text-white"
                >
                  <option value="">-- Select Inventory Part --</option>
                  {inventory.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name} ({inv.partNumber}) - ₹{inv.sellingPrice} [Stock: {inv.stockQuantity}]
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-3">
                  <div className="w-1/3">
                    <label className="text-[10px] text-neutral-400 block mb-1">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={partQty}
                      onChange={(e) => setPartQty(Math.max(1, Number(e.target.value)))}
                      className="w-full rounded-xl bg-black/50 border border-white/10 p-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="w-2/3 pt-4">
                    <button
                      type="button"
                      onClick={handleAddPartToJob}
                      className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold uppercase text-xs flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Issue Part to Bay</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Work Discovered / Customer Approvals */}
          <div className="bg-[#12161f] border border-amber-500/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Additional Work Discovered & Customer Approvals</h3>
              </div>
              <button
                onClick={() => setShowAddWorkModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-tech font-bold uppercase"
              >
                + Add Discovered Fault
              </button>
            </div>

            {(selectedJob.additionalWork || []).length === 0 ? (
              <p className="text-xs text-neutral-400">No unexpected faults reported on this vehicle.</p>
            ) : (
              <div className="space-y-3">
                {(selectedJob.additionalWork || []).map((work) => (
                  <div key={work.id} className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <strong className="text-white text-sm block">{work.description}</strong>
                      <div className="text-neutral-400 text-[11px] flex gap-3">
                        <span>Parts: ₹{work.partsCost.toLocaleString('en-IN')}</span>
                        <span>Labour: ₹{work.labourCost.toLocaleString('en-IN')}</span>
                        <span>GST: ₹{work.gst.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <strong className="text-base font-mono text-white">
                        ₹{work.total.toLocaleString('en-IN')}
                      </strong>
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-tech font-bold uppercase ${
                          work.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : work.status === 'rejected'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                        }`}
                      >
                        {work.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Photo Attachments */}
          <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Repair Documentation & Photos</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={photoUrlInput}
                onChange={(e) => setPhotoUrlInput(e.target.value)}
                placeholder="Enter image URL or inspect photo link..."
                className="flex-1 rounded-xl bg-black/40 border border-white/10 p-2.5 text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-tech font-bold uppercase text-xs flex items-center gap-1.5"
              >
                <Camera className="w-4 h-4" />
                <span>Attach Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(selectedJob.photos && selectedJob.photos.length > 0 ? selectedJob.photos : [
                'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80'
              ]).map((photo, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden border border-white/10 aspect-video">
                  <img src={photo} alt="Inspection proof" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] text-neutral-300 font-mono">
                    Bay Photo #{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DIGITAL VEHICLE INSPECTION (DVI) */}
      {activeTab === 'inspection' && (
        <div className="space-y-6">
          <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-tech font-bold uppercase text-cyan-400">
                  Standard 13-Point DVI Protocol
                </span>
                <span className="text-neutral-500">•</span>
                <span className="text-xs text-neutral-300">
                  Target: {selectedJob?.vehicleBrand} {selectedJob?.vehicleModel} ({selectedJob?.vehicleRegNumber})
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">
                Vehicle Health Score: <span className="font-mono text-cyan-400">{healthScore}%</span>
              </h2>
              <p className="text-xs text-neutral-400">
                Calibrated diagnostics checklist delivered straight to customer portal.
              </p>
            </div>

            <button
              onClick={handleSaveDvi}
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold uppercase text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/30"
            >
              <Check className="w-4 h-4" />
              <span>{dviSaved ? 'Report Dispatched to Customer!' : 'Dispatch Customer Health Report'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dviCategories.map((cat, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#12161f] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-white text-xs font-medium">{cat.name}</strong>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...dviCategories];
                        copy[idx].status = 'pass';
                        setDviCategories(copy);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-tech uppercase ${
                        cat.status === 'pass'
                          ? 'bg-emerald-500 text-black font-bold'
                          : 'bg-white/5 text-neutral-400 hover:bg-white/10'
                      }`}
                    >
                      Good
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...dviCategories];
                        copy[idx].status = 'attention';
                        setDviCategories(copy);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-tech uppercase ${
                        cat.status === 'attention'
                          ? 'bg-amber-500 text-black font-bold'
                          : 'bg-white/5 text-neutral-400 hover:bg-white/10'
                      }`}
                    >
                      Attention
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...dviCategories];
                        copy[idx].status = 'urgent';
                        setDviCategories(copy);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-tech uppercase ${
                        cat.status === 'urgent'
                          ? 'bg-red-500 text-white font-bold'
                          : 'bg-white/5 text-neutral-400 hover:bg-white/10'
                      }`}
                    >
                      Urgent
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={cat.note}
                  onChange={(e) => {
                    const copy = [...dviCategories];
                    copy[idx].note = e.target.value;
                    setDviCategories(copy);
                  }}
                  className="w-full rounded-lg bg-black/40 border border-white/10 p-2 text-[11px] text-neutral-300 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: WORKSHOP PARTS INVENTORY */}
      {activeTab === 'parts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Workshop Parts Requisition Catalog</h2>
            <span className="text-xs text-neutral-400">Direct warehouse reserve & issue</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-[#12161f] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400">{item.partNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      item.stockQuantity <= item.minStock
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    Stock: {item.stockQuantity}
                  </span>
                </div>
                <h4 className="text-white font-bold text-sm">{item.name}</h4>
                <p className="text-[11px] text-neutral-400">Category: {item.category}</p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="font-mono text-white">₹{item.sellingPrice.toLocaleString('en-IN')}</span>
                  <span className="text-neutral-500 text-[10px]">Bin: {item.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: BAY STATUS & TELEMETRY */}
      {activeTab === 'bay' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#12161f] border border-white/10 space-y-1">
              <span className="text-xs font-tech uppercase text-neutral-400">Active Bay Station</span>
              <h3 className="text-2xl font-bold text-white font-tech">Bay 01 - Diagnostics</h3>
              <p className="text-xs text-emerald-400">Hydraulic lift: Calibrated • OBD: Online</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#12161f] border border-white/10 space-y-1">
              <span className="text-xs font-tech uppercase text-neutral-400">Shift Elapsed</span>
              <h3 className="text-2xl font-bold text-white font-tech">5 hrs 20 mins</h3>
              <p className="text-xs text-neutral-400">Scheduled: 09:00 AM - 06:30 PM</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#12161f] border border-white/10 space-y-1">
              <span className="text-xs font-tech uppercase text-neutral-400">Quality Pass Rate</span>
              <h3 className="text-2xl font-bold text-cyan-400 font-tech">99.2%</h3>
              <p className="text-xs text-neutral-400">Zero customer returns (Last 90 days)</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REQUEST EXTRA WORK APPROVAL */}
      {showAddWorkModal && selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12161f] border border-amber-500/40 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg text-white">Request Customer Approval</h3>
              </div>
              <button onClick={() => setShowAddWorkModal(false)} className="text-neutral-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestAdditionalWork} className="space-y-4 text-xs">
              <div>
                <label className="block font-tech uppercase text-neutral-400 mb-1">Discovered Defect / Work</label>
                <textarea
                  rows={2}
                  required
                  value={addWorkDesc}
                  onChange={(e) => setAddWorkDesc(e.target.value)}
                  placeholder="e.g. Front Right Lower Control Arm Bushing ruptured during test"
                  className="w-full rounded-xl bg-black/40 border border-white/10 p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Spare Parts Cost (₹)</label>
                  <input
                    type="number"
                    value={addWorkPartsCost}
                    onChange={(e) => setAddWorkPartsCost(Number(e.target.value))}
                    className="w-full rounded-xl bg-black/40 border border-white/10 p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Labour Charge (₹)</label>
                  <input
                    type="number"
                    value={addWorkLabourCost}
                    onChange={(e) => setAddWorkLabourCost(Number(e.target.value))}
                    className="w-full rounded-xl bg-black/40 border border-white/10 p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal:</span>
                  <span className="font-mono">₹{(Number(addWorkPartsCost) + Number(addWorkLabourCost)).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>GST (18%):</span>
                  <span className="font-mono">₹{Math.round((Number(addWorkPartsCost) + Number(addWorkLabourCost)) * 0.18).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-1 border-t border-white/10">
                  <span>Customer Estimate:</span>
                  <span className="font-mono text-amber-400">
                    ₹{Math.round((Number(addWorkPartsCost) + Number(addWorkLabourCost)) * 1.18).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddWorkModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-neutral-300 font-tech uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-tech font-bold uppercase shadow-lg shadow-amber-500/30 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Quote to Customer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
