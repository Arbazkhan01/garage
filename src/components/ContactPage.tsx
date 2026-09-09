import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, CheckCircle2 } from 'lucide-react';
import { BRAND_INFO } from '../data/automotiveData';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setPhone('');
      setMessage('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-tech font-bold uppercase tracking-widest text-[#ff5500] px-3 py-1 rounded bg-[#ff5500]/10 border border-[#ff5500]/25">
          Reach Our Service Engineers
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-wide">
          Contact TORQX AUTOCARE
        </h1>
        <p className="text-sm sm:text-base text-neutral-400">
          Have an inquiry, custom modification request, or need emergency roadside support in Pune?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Card */}
        <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Baner Workshop Hub</h3>
            <p className="text-xs text-neutral-400">
              Direct access from Bangalore-Pune Highway (NH 48).
            </p>
          </div>

          <div className="space-y-4 text-xs text-neutral-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#ff5500] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">Workshop Address</strong>
                <p>{BRAND_INFO.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#ff5500] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">Direct Telephone</strong>
                <a href={`tel:${BRAND_INFO.phoneRaw}`} className="hover:text-white font-mono">
                  {BRAND_INFO.phoneDisplay}
                </a>
                <span className="text-[10px] text-neutral-500 block">24/7 Roadside Assistance hotline</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">WhatsApp Service Advisor</strong>
                <a
                  href={`https://wa.me/${BRAND_INFO.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-mono"
                >
                  +{BRAND_INFO.whatsappNumber}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#ff5500] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">Service Inquiries Email</strong>
                <a href={`mailto:${BRAND_INFO.email}`} className="hover:text-white">
                  {BRAND_INFO.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#ff5500] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">Operating Hours</strong>
                <p>Monday – Saturday: 8:00 AM – 8:00 PM</p>
                <p>Sunday: 9:00 AM – 4:00 PM (Emergency Diagnostics only)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white">Send Us a Direct Message</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Our lead technical advisor will respond within 30 minutes during business hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-white text-base">Inquiry Dispatched Successfully</h4>
              <p className="text-xs">Thank you! An engineer has been assigned to your query.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#ff5500] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-tech uppercase text-neutral-400 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98221 44556"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white font-mono focus:border-[#ff5500] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-tech uppercase text-neutral-400 mb-1">Message / Vehicle Model / Issue</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your vehicle model, symptoms, or service package of interest..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-[#ff5500] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-tech font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff5500]/25 transition-all"
              >
                Transmit Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
