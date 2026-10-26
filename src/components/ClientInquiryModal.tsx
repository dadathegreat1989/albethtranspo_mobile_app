import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import { 
  X, 
  Send, 
  Mail, 
  Phone, 
  Car as CarIcon, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { ADMIN_EMAIL, ADMIN_PHONE, ADMIN_NAME, createAdminMailtoUrl } from '../services/adminNotificationService';

export const ClientInquiryModal: React.FC = () => {
  const { 
    isClientInquiryModalOpen, 
    setIsClientInquiryModalOpen, 
    inquiryTargetCar, 
    setInquiryTargetCar,
    currentUser,
    submitClientInquiry
  } = useRental();

  const [inquiryType, setInquiryType] = useState<'Unit Booking Availability' | 'Occasion / Event Rental' | 'Chauffeur / Driver Request' | 'Rate Quotation' | 'General Inquiry'>(
    inquiryTargetCar ? 'Unit Booking Availability' : 'General Inquiry'
  );
  const [clientName, setClientName] = useState(currentUser.name !== 'Client Guest' ? currentUser.name : '');
  const [clientPhone, setClientPhone] = useState(currentUser.phone || '');
  const [clientEmail, setClientEmail] = useState(currentUser.email || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [destinationOrScope, setDestinationOrScope] = useState('San Sebastian & Samar/Leyte (Region 8)');
  const [message, setMessage] = useState(
    inquiryTargetCar 
      ? `Hello Admin Allan, I would like to inquire about reserving the ${inquiryTargetCar.model} (Plate: ${inquiryTargetCar.plateNumber}) for an upcoming trip in Region 8.`
      : 'Hello Admin Allan, I would like to inquire about vehicle availability, special occasion rates, and booking arrangements for Region 8.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isClientInquiryModalOpen) return null;

  const handleClose = () => {
    setIsClientInquiryModalOpen(false);
    setInquiryTargetCar(null);
    setIsSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !message.trim()) {
      alert('Please provide your name, phone number, and message.');
      return;
    }

    try {
      setIsSubmitting(true);
      await submitClientInquiry({
        clientName,
        clientPhone,
        clientEmail,
        inquiryType,
        carId: inquiryTargetCar?.id,
        carModel: inquiryTargetCar?.model,
        preferredDate,
        destinationOrScope,
        message
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Inquiry could not be dispatched. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const mailtoLink = createAdminMailtoUrl(
    `[ALBETH TRANSPORT] ${inquiryType} - ${clientName}`,
    `Admin: ${ADMIN_NAME} (${ADMIN_EMAIL})\nFrom: ${clientName} (${clientPhone})\nEmail: ${clientEmail}\nTopic: ${inquiryType}\nUnit: ${inquiryTargetCar?.model || 'Fleet Unit'}\nDates: ${preferredDate}\nScope: ${destinationOrScope}\n\nMessage:\n${message}`
  );

  return (
    <div className="fixed inset-0 z-[2100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-[#19191E] border border-white/10 rounded-t-[32px] sm:rounded-[32px] p-5 sm:p-6 text-white shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                  Admin Dispatch
                </span>
                <span className="text-[10px] text-neutral-400">Region 8 (Samar-Leyte)</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                Client Inquiry & Booking Request
              </h3>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 rounded-full bg-white/10 text-neutral-400 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Recipient Notice Bar */}
        <div className="mt-3.5 p-3 rounded-2xl bg-neutral-900 border border-amber-400/20 text-xs text-neutral-300 flex items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="truncate">
              <span className="text-neutral-400">Auto-sent to Admin: </span>
              <strong className="text-amber-300 font-mono">{ADMIN_EMAIL}</strong>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold shrink-0">
            Active Hub
          </span>
        </div>

        {isSubmitted ? (
          <div className="py-8 space-y-4 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-black text-white">Inquiry Transmitted to Admin!</h4>
              <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
                Your message has been sent to Admin <strong>{ADMIN_NAME}</strong> at <strong className="text-amber-400 font-mono">{ADMIN_EMAIL}</strong>. Our dispatch team in San Sebastian, Samar will contact you via mobile.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <a
                href={mailtoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-2 border border-white/10 transition-colors"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Open in Email / Gmail</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>
              <button
                type="button"
                onClick={handleClose}
                className="py-3 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-extrabold transition-all shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            {/* Target Car Banner if inquiring on a specific unit */}
            {inquiryTargetCar && (
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={inquiryTargetCar.image} 
                    alt={inquiryTargetCar.model} 
                    className="w-12 h-9 object-contain rounded drop-shadow"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-white">{inquiryTargetCar.model}</h5>
                    <p className="text-[10px] text-neutral-400">
                      Plate: {inquiryTargetCar.plateNumber} • ₱{inquiryTargetCar.pricePerDay.toLocaleString()}/day
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-amber-400 text-neutral-950 px-2 py-0.5 rounded font-extrabold">
                  Selected Unit
                </span>
              </div>
            )}

            {/* Inquiry Topic */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-300">Inquiry Topic</label>
              <select
                value={inquiryType}
                onChange={(e) => setInquiryType(e.target.value as any)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                <option value="Unit Booking Availability" className="bg-[#19191E] text-white">Unit Booking Availability</option>
                <option value="Occasion / Event Rental" className="bg-[#19191E] text-white">Occasion / Event Rental (Wedding, Tours, Corporate)</option>
                <option value="Chauffeur / Driver Request" className="bg-[#19191E] text-white">Chauffeur / Driver Request</option>
                <option value="Rate Quotation" className="bg-[#19191E] text-white">Rate Quotation (Samar / Leyte / Biliran)</option>
                <option value="General Inquiry" className="bg-[#19191E] text-white">General Inquiry</option>
              </select>
            </div>

            {/* Client Contact Info */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-300">Your Full Name *</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Juan Dela Cruz"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-300">Philippine Mobile *</label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+63 9XX XXX XXXX"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-300">Email Address (Optional)</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-300">Target Date / Occasion</label>
                <input
                  type="text"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  placeholder="e.g. Nov 15-18, 2026 / Weekend"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Destination Scope */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-300">Destination / Travel Scope in Region 8</label>
              <input
                type="text"
                value={destinationOrScope}
                onChange={(e) => setDestinationOrScope(e.target.value)}
                placeholder="e.g. San Sebastian to Tacloban, Catbalogan, Guiuan, Ormoc..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* Detailed Message */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-300">Inquiry Message / Special Requests *</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide details about your rental occasion, number of passengers, preferred pickup location, or any questions..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none"
                required
              />
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center gap-2.5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-[0.98]"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmitting to Admin...' : 'Send Inquiry to Admin Email'}</span>
              </button>

              <a
                href={mailtoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-200 text-xs font-semibold flex items-center justify-center border border-white/10 transition-colors"
                title="Send via Email App directly"
              >
                <Mail className="w-4 h-4 text-amber-400" />
              </a>
            </div>

            <p className="text-[10px] text-neutral-400 text-center leading-tight">
              Inquiries are auto-transmitted directly to <strong>{ADMIN_EMAIL}</strong> & logged to the ALBETH TRANSPORT central dispatch terminal.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
