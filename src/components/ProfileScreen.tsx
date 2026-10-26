import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import { 
  User, 
  Wallet, 
  ShieldCheck, 
  PhoneCall, 
  CreditCard, 
  MapPin, 
  Award, 
  Key, 
  HelpCircle, 
  LogOut, 
  Check, 
  ChevronRight,
  ExternalLink,
  Building2,
  Download,
  Smartphone,
  Wifi,
  RefreshCw,
  Mail,
  MessageSquare,
  History,
  Send,
  UserPlus,
  LogIn,
  Radio
} from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { 
  ADMIN_EMAIL, 
  ADMIN_NAME, 
  ADMIN_PHONE, 
  getAdminDispatchLogs, 
  createAdminMailtoUrl 
} from '../services/adminNotificationService';

export const ProfileScreen: React.FC = () => {
  const { 
    currentUser, 
    reservations, 
    setActiveScreen, 
    logoutClient, 
    isLoggedIn,
    openInquiryModal,
    setIsInstallModalOpen 
  } = useRental();
  const [showTopUpToast, setShowTopUpToast] = useState(false);
  const [showDispatchLogs, setShowDispatchLogs] = useState(false);
  const { isOnline, isSyncing, syncNow } = useOnlineStatus();

  const handleTopUp = () => {
    currentUser.walletBalance += 5000;
    setShowTopUpToast(true);
    setTimeout(() => setShowTopUpToast(false), 2500);
  };

  const dispatchLogs = getAdminDispatchLogs();
  const isGuest = !isLoggedIn || currentUser.name === 'Client Guest';

  const mailtoAdmin = createAdminMailtoUrl(
    `[ALBETH TRANSPORT] Direct Inquiry from ${currentUser.name || 'Client'}`,
    `Hello Allan,\n\nI am contacting you from the ALBETH TRANSPORT Client App regarding car rental bookings in Region 8.\n\nFrom: ${currentUser.name} (${currentUser.phone || 'Phone not provided'})\nEmail: ${currentUser.email || ''}`
  );

  return (
    <div className="flex flex-col h-full bg-[#17171A] text-white overflow-y-auto pb-28">
      {/* Top Banner */}
      <div className="p-6 bg-gradient-to-b from-[#24242B] to-[#17171A] border-b border-white/5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-400 shadow-xl"
            />
            <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#17171A] ${isGuest ? 'bg-amber-400' : 'bg-emerald-500'}`} />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">{currentUser.name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-neutral-950 uppercase">
                {isGuest ? 'GUEST' : 'CLIENT'}
              </span>
            </div>
            <p className="text-xs text-neutral-400">{currentUser.email || 'Email: Unregistered'}</p>
            <p className="text-xs text-amber-300 font-mono">{currentUser.phone || 'Mobile: Not Set'}</p>
          </div>
        </div>

        {/* Member Tier Card in PHP */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-black/40 to-neutral-900 border border-amber-400/30 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>{currentUser.membershipTier}</span>
            </div>
            <div className="text-2xl font-black text-white font-mono-numbers">
              ₱{currentUser.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-neutral-400">
              Region 8 Rental Balance • {currentUser.points} ALBETH Reward Points
            </div>
          </div>

          {isGuest ? (
            <button
              onClick={() => setActiveScreen('onboarding')}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          ) : (
            <button
              onClick={handleTopUp}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-all shadow-md active:scale-95"
            >
              + Top Up ₱5,000
            </button>
          )}
        </div>

        {showTopUpToast && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold text-center animate-fadeIn">
            ✓ Added ₱5,000.00 to ALBETH Client Balance!
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Admin Email Notifications & Dispatch Terminal */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#202029] via-[#1D1D24] to-[#18181F] border border-amber-400/40 shadow-lg space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black text-amber-400 uppercase tracking-wide">Admin Dispatch Active</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-neutral-300">
                  Target Admin: <strong className="text-white font-mono">{ADMIN_EMAIL}</strong>
                </p>
              </div>
            </div>

            <span className="text-[10px] bg-amber-400 text-neutral-950 px-2 py-0.5 rounded font-black">
              {ADMIN_NAME}
            </span>
          </div>

          <p className="text-[11px] text-neutral-300 leading-relaxed">
            All client unit bookings, vehicle inquiries, and newly registered accounts are automatically dispatched to Admin <strong>{ADMIN_NAME}</strong> at <strong className="text-amber-300 font-mono">{ADMIN_EMAIL}</strong> with instant delivery logs.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => openInquiryModal()}
              className="py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Inquiry to Allan</span>
            </button>

            <a
              href={mailtoAdmin}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>Direct Email</span>
            </a>
          </div>

          <button
            onClick={() => setActiveScreen('admin-dashboard')}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400/20 via-amber-400/30 to-amber-400/20 hover:from-amber-400/30 hover:to-amber-400/40 border border-amber-400/40 text-amber-300 text-xs font-black flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Open Central Dispatcher Command Hub &gt;</span>
          </button>

          {/* Dispatch Logs Trigger */}
          <div className="pt-1 border-t border-white/10">
            <button
              onClick={() => setShowDispatchLogs(!showDispatchLogs)}
              className="w-full text-left flex items-center justify-between text-[11px] text-neutral-400 hover:text-amber-300 transition-colors py-1"
            >
              <div className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Transmission Audit Log ({dispatchLogs.length} events logged)</span>
              </div>
              <span className="text-amber-400 font-bold">{showDispatchLogs ? 'Hide ▲' : 'View ▼'}</span>
            </button>

            {showDispatchLogs && (
              <div className="mt-2 space-y-2 max-h-52 overflow-y-auto pr-1">
                {dispatchLogs.length === 0 ? (
                  <p className="text-[11px] text-neutral-500 py-2 text-center">
                    No transmissions logged yet. New bookings, inquiries, and client registrations will appear here.
                  </p>
                ) : (
                  dispatchLogs.map((log) => (
                    <div 
                      key={log.id}
                      className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[11px]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300">{log.type.replace(/_/g, ' ')}</span>
                        <span className="text-[10px] text-neutral-400">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-neutral-300 text-[10px]">{log.summary}</p>
                      <div className="flex items-center justify-between text-[9px] text-neutral-400 pt-0.5">
                        <span>Recipient: {log.recipient}</span>
                        <span className="text-emerald-400 font-bold">✓ Logged & Dispatched</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Business Office & Operating Scope */}
        <div className="p-4 rounded-2xl bg-[#202025] border border-amber-400/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>ALBETH TRANSPORT Headquarters</span>
            </div>
            <div className="bg-transparent flex items-center">
              <img src="/car_assets/albeth_logo_transparent.png" alt="ALBETH" className="h-5 w-auto object-contain filter drop-shadow-[0_1px_4px_rgba(255,255,255,0.6)]" />
            </div>
          </div>
          <div className="text-xs text-neutral-200">
            <strong>Business Office:</strong> San Sebastian, Samar, Region 8, Eastern Visayas
          </div>
          <div className="text-[11px] text-amber-300 font-bold">
            ALBETH TRANSPORT (Cars for any occasions)
          </div>
          <div className="text-[11px] text-neutral-400 leading-relaxed">
            Authorized car rental operations across all points of <strong>Region 8 (Eastern Visayas)</strong> including Samar, Northern Samar, Eastern Samar, Leyte, Southern Leyte, and Biliran.
          </div>
        </div>

        {/* Verification Status */}
        <div className="p-4 rounded-2xl bg-[#202025] border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Philippine Driver License:</span>
            <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              {currentUser.driverLicense || 'Register license upon rental'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Registered Municipality:</span>
            <span className="font-semibold text-white">{currentUser.address}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Total Completed Rentals:</span>
            <span className="font-bold text-amber-400 font-mono-numbers">
              {currentUser.totalTrips + reservations.filter(r => r.status === 'completed').length} Trips in Region 8
            </span>
          </div>
        </div>

        {/* Mobile App (.APK) & Real-Time Online Sync Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#252530] to-[#1C1C24] border border-amber-500/30 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Mobile App & Auto-Sync</h3>
                <p className="text-[11px] text-neutral-400">Android .APK installer & PWA offline cache</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {isOnline ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Synced Online
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Offline Mode
                </span>
              )}
            </div>
          </div>

          <p className="text-[11px] text-neutral-300 leading-relaxed">
            Whenever connected online, ALBETH TRANSPORT automatically updates fleet availability, syncs reservations, and refreshes app code seamlessly in the background without needing manual reinstallations.
          </p>

          <div className="flex items-center gap-2 pt-0.5">
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition-all active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              <span>Install App on Phone</span>
            </button>

            <button
              onClick={syncNow}
              disabled={isSyncing || !isOnline}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors disabled:opacity-50"
              title="Force sync with San Sebastian Central Hub"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        {/* 24/7 Roadside Assistance Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/15 to-neutral-900 border border-red-500/30 space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <PhoneCall className="w-4 h-4 animate-pulse" />
            <span>24/7 Samar-Leyte Roadside Assistance</span>
          </div>
          <p className="text-xs text-neutral-300">
            Rapid response for fuel drops, tire change, mechanical dispatch, and GPS assistance across all provincial routes in Region 8.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <a
              href={`tel:${ADMIN_PHONE.replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-red-600/80 hover:bg-red-500 px-3 py-2 rounded-xl transition-colors shadow"
            >
              <span>Smart / Globe: {ADMIN_PHONE}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Settings Links */}
        <div className="space-y-1 rounded-2xl bg-[#202025] border border-white/5 overflow-hidden">
          {[
            { icon: CreditCard, label: 'Payment Options (GCash / Maya / Card)', sub: 'Philippine Peso (₱) Accepted' },
            { icon: Key, label: 'Digital Mobile Key Permissions', sub: 'Active for Assigned Units' },
            { icon: MapPin, label: 'Main Return Hub', sub: 'San Sebastian, Samar (HQ Terminal)' },
            { icon: HelpCircle, label: 'Region 8 Rental Terms & Conditions', sub: 'Self-Drive & Chauffeur Rules' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-amber-400">
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{item.label}</div>
                  <div className="text-[10px] text-neutral-400">{item.sub}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            </div>
          ))}
        </div>

        {/* Logout / Switch Account */}
        <div className="pt-2">
          <button
            onClick={logoutClient}
            className="w-full py-3 rounded-2xl bg-white/5 hover:bg-red-500/20 text-neutral-300 hover:text-red-300 text-xs font-bold flex items-center justify-center gap-2 border border-white/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>{isGuest ? 'Client Login / Register Portal' : 'Switch Account / Back to Onboarding Portal'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
