import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.93, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.93, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#11151e] border border-white/12 p-6 sm:p-8 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#ff5500]/15 text-[#ff5500] flex items-center justify-center">
              {type === 'privacy' ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white">
                {type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
              </h3>
              <p className="text-xs font-tech text-neutral-400">TORQX AUTOCARE • Effective 2026</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
            {type === 'privacy' ? (
              <>
                <p>
                  At <strong>TORQX AUTOCARE</strong>, we respect your privacy regarding any vehicle telematics, contact details, or service history collected during appointment scheduling and vehicle intake.
                </p>
                <h4 className="text-white font-tech font-bold uppercase text-xs pt-2">1. Information We Collect</h4>
                <p>
                  We collect your name, contact phone number, email address, vehicle identification number (VIN/chassis if provided), vehicle make, model, registration number, and mechanical fault descriptions solely to schedule service appointments and provide diagnostic inspection reports.
                </p>
                <h4 className="text-white font-tech font-bold uppercase text-xs pt-2">2. How We Use Data</h4>
                <p>
                  Your information is utilized solely for customer service notifications (SMS/WhatsApp updates), itemized service estimations, parts warranty tracking, and scheduled maintenance reminders. We never sell or distribute your private contact records to third-party telemarketers.
                </p>
                <h4 className="text-white font-tech font-bold uppercase text-xs pt-2">3. Storage & Security</h4>
                <p>
                  All digital work orders and OBD diagnostic logs are stored within encrypted databases protected by industry-standard access controls.
                </p>
              </>
            ) : (
              <>
                <p>
                  These Terms and Conditions govern automobile service reservations, diagnostic procedures, parts replacements, and warranty coverage at <strong>TORQX AUTOCARE</strong>.
                </p>
                <h4 className="text-white font-tech font-bold uppercase text-xs pt-2">1. Estimates & Approvals</h4>
                <p>
                  All repair estimations provided after OBD diagnosis and 40-point vehicle intake must be approved by the vehicle owner or authorized representative before work commences. Any unforeseen mechanical discoveries will be communicated with photo/video proof for explicit client consent.
                </p>
                <h4 className="text-white font-tech font-bold uppercase text-xs pt-2">2. Warranty Coverage</h4>
                <p>
                  Our standard workmanship warranty covers installed genuine parts and labor for 6 months or 10,000 km (whichever occurs first) from the date of handover, subject to normal operating conditions. Performance tuning, track day usage, or external collision damage is excluded from standard warranty terms.
                </p>
                <h4 className="text-white font-tech font-bold uppercase text-xs pt-2">3. Vehicle Intake & Valuables</h4>
                <p>
                  Customers are kindly requested to remove personal cash, electronics, and valuables prior to handing over the vehicle keys for service bay induction.
                </p>
              </>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-white/8 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-tech font-bold text-xs uppercase tracking-wider"
            >
              I Understand
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
