import React, { useState, useEffect } from 'react';
import { useRental } from '../context/RentalContext';
import { 
  ShieldCheck, 
  Car, 
  MapPin, 
  Navigation, 
  Lock, 
  Unlock, 
  Power, 
  Radio, 
  Wifi, 
  RefreshCw, 
  FileText, 
  Users, 
  DollarSign, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  LogOut, 
  ExternalLink, 
  Search, 
  ChevronRight, 
  SlidersHorizontal, 
  Calendar, 
  Phone, 
  Mail, 
  Eye, 
  RotateCcw,
  Sparkles,
  Download,
  Building2,
  Check,
  Fuel,
  BatteryMedium,
  Gauge
} from 'lucide-react';
import { AdminDashboardTab, Car as CarType, ClientInquiry } from '../types/rental';
import { ADMIN_EMAIL, ADMIN_PHONE } from '../services/adminNotificationService';

export const AdminDispatcherScreen: React.FC = () => {
  const { 
    cars, 
    reservations, 
    adminUser, 
    registeredClients, 
    transactions, 
    inquiries, 
    adminDashboardTab, 
    setAdminDashboardTab, 
    logoutAdmin, 
    switchToClientView, 
    toggleCarLock, 
    toggleCarEngine, 
    remoteUpdateCarState, 
    updateInquiryStatus, 
    forceDispatcherSync, 
    lastCloudSyncTimestamp, 
    isRealtimeSaving,
    returnStations,
    teleportCarToStation
  } = useRental();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCarDetail, setSelectedCarDetail] = useState<CarType | null>(null);
  const [inquiryNotes, setInquiryNotes] = useState<{ [id: string]: string }>({});
  const [liveClock, setLiveClock] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setLiveClock(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Summary calculations
  const totalRevenue = transactions
    .filter(t => t.status === 'paid')
    .reduce((acc, t) => acc + t.amount, 0);

  const activeReservationsCount = reservations.filter(r => r.status === 'active').length;
  const pendingInquiriesCount = inquiries.filter(i => i.status === 'sent_to_admin').length;
  const availableCarsCount = cars.filter(c => c.isAvailable).length;

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      admin: adminUser,
      cars,
      reservations,
      transactions,
      inquiries,
      registeredClients
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ALBETH_DISPATCH_AUDIT_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#141417] text-white overflow-hidden select-none">
      {/* Top Dispatcher Header */}
      <header className="shrink-0 bg-[#1C1C22] border-b border-amber-400/30 px-4 py-3 shadow-md z-30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center p-1 shrink-0">
              <img 
                src="/car_assets/albeth_logo_transparent.png" 
                alt="ALBETH" 
                className="w-full h-full object-contain filter drop-shadow-[0_1px_4px_rgba(255,255,255,0.7)]" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-wide text-white uppercase">
                  Dispatcher Command Center
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-neutral-950 uppercase">
                  Central Hub
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live GPS
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Officer: <strong className="text-amber-300">{adminUser.name}</strong> • <span className="font-mono">{ADMIN_EMAIL}</span> • San Sebastian, Samar (Region 8)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Live Time & Sync Status */}
            <div className="text-right hidden md:block">
              <div className="text-xs font-mono font-bold text-amber-300">{liveClock}</div>
              <div className="text-[10px] text-neutral-400 flex items-center gap-1 justify-end">
                {isRealtimeSaving ? (
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Saving...
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Auto-Synced ({lastCloudSyncTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => forceDispatcherSync()}
              title="Force Real-Time Cloud Sync"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 text-amber-400 ${isRealtimeSaving ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={switchToClientView}
              className="px-3 py-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Client App</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-colors"
              title="Logout from Dispatcher Hub"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dispatch Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-3 border-t border-white/5 mt-3">
          {[
            { id: 'overview', label: 'Command Hub', icon: ShieldCheck, badge: null },
            { id: 'fleet', label: 'Fleet Telemetry', icon: Car, badge: `${cars.length} Units` },
            { id: 'bookings', label: 'Bookings & Keys', icon: Calendar, badge: activeReservationsCount ? `${activeReservationsCount} Active` : null },
            { id: 'gps', label: 'Region 8 GPS Map', icon: Navigation, badge: 'Live' },
            { id: 'inquiries', label: 'Client Inquiries', icon: MessageSquare, badge: pendingInquiriesCount ? `${pendingInquiriesCount} New` : null },
            { id: 'transactions', label: 'Transactions & Ledger', icon: DollarSign, badge: `₱${(totalRevenue / 1000).toFixed(1)}k` },
            { id: 'clients', label: 'Registered Clients', icon: Users, badge: `${registeredClients.length}` },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = adminDashboardTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminDashboardTab(tab.id as AdminDashboardTab)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  isActive
                    ? 'bg-amber-400 text-neutral-950 shadow-md shadow-amber-400/20'
                    : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                    isActive ? 'bg-neutral-950 text-amber-300' : 'bg-white/10 text-neutral-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 pb-20">
        {/* OVERVIEW TAB */}
        {adminDashboardTab === 'overview' && (
          <div className="space-y-4">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-[#1C1C22] border border-white/5 space-y-1">
                <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Available Fleet</span>
                  <Car className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono-numbers">
                  {availableCarsCount} <span className="text-xs font-normal text-neutral-400">/ {cars.length}</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Ready across Samar-Leyte Hubs
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#1C1C22] border border-white/5 space-y-1">
                <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Active Bookings</span>
                  <Calendar className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono-numbers">
                  {activeReservationsCount}
                </div>
                <div className="text-[10px] text-neutral-400">
                  {reservations.length} total client reservations logged
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#1C1C22] border border-white/5 space-y-1">
                <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Gross Collection</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-400 font-mono-numbers">
                  ₱{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-neutral-400">
                  Philippine Peso (₱) real-time ledger
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#1C1C22] border border-white/5 space-y-1">
                <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Client Inquiries</span>
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono-numbers">
                  {inquiries.length}
                </div>
                <div className="text-[10px] text-amber-300 font-semibold truncate">
                  Auto-dispatched to {ADMIN_EMAIL}
                </div>
              </div>
            </div>

            {/* Quick Fleet Remote Command Bar */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#202028] via-[#1A1A22] to-[#17171C] border border-amber-400/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase text-amber-400 tracking-wider">
                    Quick Fleet Status & Remote Override
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Real-time lock, engine kill-switch, and return depot placement for Region 8 fleet
                  </p>
                </div>
                <button
                  onClick={() => setAdminDashboardTab('fleet')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  View Details &gt;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {cars.map(car => (
                  <div 
                    key={car.id} 
                    className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 hover:border-amber-400/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-white truncate">{car.model}</h4>
                        <span className="text-[10px] font-mono font-semibold text-neutral-400">{car.plateNumber}</span>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                        car.isAvailable ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {car.isAvailable ? 'AVAILABLE' : 'RENTED'}
                      </span>
                    </div>

                    <div className="text-[10px] text-neutral-300 flex items-center gap-2">
                      <span>Fuel: {car.currentGps.fuelPercent}%</span>
                      <span>•</span>
                      <span>Odo: {car.currentGps.odometerKm} km</span>
                    </div>

                    <div className="text-[10px] text-neutral-400 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">{car.currentGps.address}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={() => toggleCarLock(car.id)}
                        className={`py-1 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors ${
                          car.currentGps.isLocked
                            ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                        }`}
                      >
                        {car.currentGps.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        <span>{car.currentGps.isLocked ? 'Locked' : 'Unlocked'}</span>
                      </button>

                      <button
                        onClick={() => toggleCarEngine(car.id)}
                        className={`py-1 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors ${
                          car.currentGps.engineOn
                            ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                            : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        <span>{car.currentGps.engineOn ? 'Engine ON' : 'Engine OFF'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Live Activity Stream (Split Column) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent Inquiries Card */}
              <div className="p-4 rounded-2xl bg-[#1C1C22] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">Recent Client Inquiries</h3>
                  </div>
                  <button 
                    onClick={() => setAdminDashboardTab('inquiries')}
                    className="text-[11px] text-amber-400 font-bold hover:underline"
                  >
                    View All ({inquiries.length})
                  </button>
                </div>

                <div className="space-y-2">
                  {inquiries.slice(0, 3).map(inq => (
                    <div key={inq.id} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{inq.clientName}</span>
                        <span className="text-[10px] text-neutral-400">{new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-[11px] text-amber-300 font-semibold">{inq.inquiryType} • {inq.carModel || 'Fleet Unit'}</p>
                      <p className="text-[11px] text-neutral-300 line-clamp-2">{inq.message}</p>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
                        <span>Tel: {inq.clientPhone}</span>
                        <span className="text-emerald-400 font-bold">Auto-sent to Allan</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Financial Transactions Card */}
              <div className="p-4 rounded-2xl bg-[#1C1C22] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">Recent Payments & Collections</h3>
                  </div>
                  <button 
                    onClick={() => setAdminDashboardTab('transactions')}
                    className="text-[11px] text-emerald-400 font-bold hover:underline"
                  >
                    Ledger ({transactions.length})
                  </button>
                </div>

                <div className="space-y-2">
                  {transactions.slice(0, 3).map(tx => (
                    <div key={tx.id} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{tx.clientName}</div>
                        <div className="text-[10px] text-neutral-400">
                          {tx.bookingCode ? `${tx.bookingCode} • ` : ''}{tx.paymentMethod} • {new Date(tx.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-emerald-400 font-mono-numbers">
                          +₱{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <span className="text-[9px] uppercase font-bold text-emerald-500">PAID</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Action Footer Bar */}
            <div className="p-3.5 rounded-2xl bg-[#1A1A20] border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Samar-Leyte Central Operations Active</span>
                <span>•</span>
                <span className="text-neutral-300">HQ: San Sebastian, Samar</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportData}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Export Dispatch Audit (.JSON)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FLEET TELEMETRY TAB */}
        {adminDashboardTab === 'fleet' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-white">Fleet Telemetry & Unit Override</h2>
                <p className="text-xs text-neutral-400">
                  Full status monitor of all 4 official ALBETH vehicles in Region 8
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">4 Registered Units</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cars.map(car => (
                <div 
                  key={car.id} 
                  className="p-4 rounded-2xl bg-[#1C1C22] border border-white/10 space-y-3.5 shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={car.image} 
                        alt={car.model} 
                        className="w-16 h-12 rounded-xl object-cover border border-white/10" 
                      />
                      <div>
                        <h3 className="text-sm font-black text-white">{car.model}</h3>
                        <p className="text-xs text-neutral-400">{car.category} • {car.transmission}</p>
                        <span className="text-xs font-mono text-amber-400 font-bold">{car.plateNumber}</span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      car.isAvailable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {car.isAvailable ? 'AVAILABLE' : 'ACTIVE RENTAL'}
                    </span>
                  </div>

                  {/* Telemetry Gauge Bar */}
                  <div className="grid grid-cols-3 gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5 text-center text-xs">
                    <div>
                      <div className="text-[10px] text-neutral-400 flex items-center justify-center gap-1">
                        <Fuel className="w-3 h-3 text-amber-400" /> Fuel
                      </div>
                      <div className="font-bold text-white font-mono-numbers">{car.currentGps.fuelPercent}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-400 flex items-center justify-center gap-1">
                        <BatteryMedium className="w-3 h-3 text-emerald-400" /> Battery
                      </div>
                      <div className="font-bold text-white font-mono-numbers">{car.currentGps.batteryPercent}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-400 flex items-center justify-center gap-1">
                        <Gauge className="w-3 h-3 text-blue-400" /> Speed
                      </div>
                      <div className="font-bold text-white font-mono-numbers">{car.currentGps.speedKmH} km/h</div>
                    </div>
                  </div>

                  {/* GPS Location Bar */}
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <MapPin className="w-3.5 h-3.5" /> GPS Coordinates
                      </span>
                      <span className="font-mono text-[10px]">{car.currentGps.lat.toFixed(4)}, {car.currentGps.lng.toFixed(4)}</span>
                    </div>
                    <p className="text-neutral-200 text-xs truncate font-medium">{car.currentGps.address}</p>
                  </div>

                  {/* Remote Dispatcher Controls */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs font-bold">
                    <button
                      onClick={() => toggleCarLock(car.id)}
                      className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
                        car.currentGps.isLocked 
                          ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30' 
                          : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                      }`}
                    >
                      {car.currentGps.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      <span>{car.currentGps.isLocked ? 'Unlock Unit' : 'Lock Unit'}</span>
                    </button>

                    <button
                      onClick={() => toggleCarEngine(car.id)}
                      className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
                        car.currentGps.engineOn 
                          ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30' 
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-white/10'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{car.currentGps.engineOn ? 'Kill Engine' : 'Start Engine'}</span>
                    </button>

                    <button
                      onClick={() => teleportCarToStation(car.id, 'st-san-sebastian')}
                      className="py-2 px-3 rounded-xl bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border border-amber-400/30 flex items-center justify-center gap-1.5 transition-colors col-span-2 sm:col-span-1"
                      title="Recall vehicle to San Sebastian Samar HQ Terminal"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Recall to HQ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOOKINGS & DISPATCHES TAB */}
        {adminDashboardTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-white">Client Reservations & Key Dispatches</h2>
                <p className="text-xs text-neutral-400">
                  Monitor all past, active, and upcoming rentals across Samar & Leyte
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400">{reservations.length} Bookings Total</span>
            </div>

            {reservations.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#1C1C22] border border-white/5 text-center space-y-2">
                <Calendar className="w-10 h-10 text-neutral-500 mx-auto" />
                <h4 className="text-sm font-bold text-neutral-300">No Reservations Currently Recorded</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  When clients book vehicles through the app, they will appear here with live GPS dispatch controls and payment summaries.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reservations.map(res => (
                  <div 
                    key={res.id} 
                    className="p-4 rounded-2xl bg-[#1C1C22] border border-white/5 space-y-3 shadow-md"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          res.status === 'active' ? 'bg-emerald-400 animate-ping' : res.status === 'completed' ? 'bg-neutral-400' : 'bg-red-400'
                        }`} />
                        <div>
                          <span className="text-xs font-mono font-bold text-amber-400">{res.bookingCode}</span>
                          <h4 className="text-sm font-bold text-white">{res.car.model}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          res.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {res.status === 'active' ? 'ACTIVE ON ROAD' : res.status}
                        </span>
                        <span className="text-xs font-black text-emerald-400 font-mono-numbers">
                          ₱{res.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-neutral-300">
                      <div>
                        <span className="text-[10px] text-neutral-500 block">Renter / Client</span>
                        <strong className="text-white">{res.userName}</strong>
                        <div className="text-[11px] text-amber-300 font-mono">{res.userPhone}</div>
                      </div>

                      <div>
                        <span className="text-[10px] text-neutral-500 block">Rental Window</span>
                        <div>{new Date(res.pickupDateTime).toLocaleDateString()} to {new Date(res.returnDateTime).toLocaleDateString()}</div>
                        <div className="text-[11px] text-neutral-400">{res.totalHours} hrs ({res.rateType})</div>
                      </div>

                      <div>
                        <span className="text-[10px] text-neutral-500 block">Pickup & Return Station</span>
                        <div className="truncate">{res.pickupStationName}</div>
                        <div className="text-[10px] text-emerald-400 truncate">Return: {res.returnStationName}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LIVE GPS MAP TAB */}
        {adminDashboardTab === 'gps' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-white">Region 8 Fleet GPS Telemetry Hub</h2>
                <p className="text-xs text-neutral-400">
                  Live satellite telemetry coordinates across Samar, Leyte, and Biliran
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-emerald-400">All 4 Sensors Active</span>
              </div>
            </div>

            {/* Simulated Live GPS Map Graphic */}
            <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-white/10 bg-[#0F172A] shadow-inner flex flex-col justify-between p-4">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative z-10 flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-xs space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Samar-Leyte Central Geofence</span>
                  </div>
                  <div className="text-[10px] text-neutral-300">
                    Primary Route: Maharlika Highway (AH26) • San Juanico Corridor
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-black/70 border border-white/10 text-[10px] font-mono text-neutral-300">
                  GPS Server: 124.9653°E, 11.7142°N
                </div>
              </div>

              {/* Vehicle Markers on simulated regional grid */}
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {cars.map((car, idx) => (
                  <div 
                    key={car.id} 
                    className="p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-amber-400/40 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white truncate text-[11px]">{car.brand}</span>
                      <span className={`w-2 h-2 rounded-full ${car.currentGps.engineOn ? 'bg-emerald-400 animate-ping' : 'bg-neutral-500'}`} />
                    </div>
                    <div className="text-[10px] font-mono text-amber-300 font-bold">{car.plateNumber}</div>
                    <div className="text-[9px] text-neutral-400 truncate">{car.currentGps.address}</div>
                    <div className="flex items-center justify-between text-[9px] text-neutral-300 pt-0.5">
                      <span>{car.currentGps.speedKmH} km/h</span>
                      <span>{car.currentGps.fuelPercent}% Fuel</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Return Stations List */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Authorized Region 8 Return Hubs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {returnStations.map(station => (
                  <div key={station.id} className="p-3 rounded-xl bg-[#1C1C22] border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>{station.name}</span>
                      </div>
                      <div className="text-[11px] text-neutral-400">{station.address}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      {station.availableBays} Bays Free
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CLIENT INQUIRIES TAB */}
        {adminDashboardTab === 'inquiries' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-white">Client Inquiries & Occasions Booking</h2>
                <p className="text-xs text-neutral-400">
                  Quotations, event packages, and custom requests auto-dispatched to <strong className="text-amber-300 font-mono">{ADMIN_EMAIL}</strong>
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400">{inquiries.length} Inquiries</span>
            </div>

            <div className="space-y-3">
              {inquiries.map(inq => (
                <div key={inq.id} className="p-4 rounded-2xl bg-[#1C1C22] border border-white/10 space-y-3 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-neutral-950 uppercase">
                        {inq.inquiryType}
                      </span>
                      <h3 className="text-sm font-black text-white mt-1">{inq.clientName}</h3>
                    </div>

                    <div className="text-right text-xs">
                      <div className="text-neutral-400">{new Date(inq.createdAt).toLocaleString()}</div>
                      <span className="text-[10px] font-bold text-emerald-400">
                        {inq.status === 'sent_to_admin' ? '✓ Auto-dispatched to Allan Pacoma' : inq.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-500 block">Contact Phone & Email</span>
                      <a href={`tel:${inq.clientPhone}`} className="text-amber-300 font-bold hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {inq.clientPhone}
                      </a>
                      {inq.clientEmail && <div className="text-[11px] text-neutral-400 truncate">{inq.clientEmail}</div>}
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-500 block">Requested Vehicle / Target</span>
                      <div className="font-bold text-white">{inq.carModel || 'Any Available Fleet Unit'}</div>
                      {inq.preferredDate && <div className="text-[11px] text-neutral-300">Dates: {inq.preferredDate}</div>}
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-500 block">Destination / Region 8 Scope</span>
                      <div className="text-neutral-200">{inq.destinationOrScope || 'Samar & Leyte Inter-Town'}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-neutral-200 leading-relaxed">
                    <strong>Message:</strong> "{inq.message}"
                  </div>

                  {inq.adminNotes && (
                    <div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/20 text-xs text-amber-300">
                      <strong>Dispatcher Note:</strong> {inq.adminNotes}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add dispatcher note or quotation status..."
                      value={inquiryNotes[inq.id] || ''}
                      onChange={e => setInquiryNotes({ ...inquiryNotes, [inq.id]: e.target.value })}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                    <button
                      onClick={() => {
                        if (inquiryNotes[inq.id]) {
                          updateInquiryStatus(inq.id, 'sent_to_admin', inquiryNotes[inq.id]);
                          setInquiryNotes({ ...inquiryNotes, [inq.id]: '' });
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-colors shrink-0"
                    >
                      Save Note
                    </button>
                    <a
                      href={`tel:${inq.clientPhone.replace(/[^0-9+]/g, '')}`}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition-colors flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRANSACTIONS & FINANCIAL LEDGER TAB */}
        {adminDashboardTab === 'transactions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-white">Financial Transactions Ledger</h2>
                <p className="text-xs text-neutral-400">
                  Real-time revenue collections, GCash, Maya, and cash payments in Philippine Peso (₱)
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block">Total Volume</span>
                <span className="text-lg font-black text-emerald-400 font-mono-numbers">
                  ₱{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#1C1C22] border border-white/10 overflow-hidden shadow-md">
              <div className="p-3 border-b border-white/5 flex items-center justify-between text-xs text-neutral-400 font-bold">
                <span>Transaction Record</span>
                <span>Payment & Amount (₱)</span>
              </div>

              <div className="divide-y divide-white/5">
                {transactions.map(tx => (
                  <div key={tx.id} className="p-3.5 hover:bg-white/5 transition-colors flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{tx.clientName}</span>
                        <span className="text-[10px] font-mono text-neutral-400">{tx.id}</span>
                      </div>
                      <div className="text-[11px] text-neutral-300">
                        {tx.carModel ? `${tx.carModel} • ` : ''}{tx.notes || tx.type.replace(/_/g, ' ')}
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {new Date(tx.timestamp).toLocaleString()} • Client Tel: {tx.clientPhone}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-black text-emerald-400 font-mono-numbers">
                        ₱{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-[10px] font-bold text-amber-300">{tx.paymentMethod}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REGISTERED CLIENTS TAB */}
        {adminDashboardTab === 'clients' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-white">Registered Clients & Profile Logins</h2>
                <p className="text-xs text-neutral-400">
                  Client accounts registered in Region 8 with verified LTO Driver Licenses & login timestamps
                </p>
              </div>
              <span className="text-xs font-bold text-amber-400">{registeredClients.length} Verified Clients</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {registeredClients.map(client => (
                <div key={client.id} className="p-4 rounded-2xl bg-[#1C1C22] border border-white/10 space-y-2.5 shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{client.name}</h4>
                      <p className="text-xs text-neutral-400">{client.email}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300">
                      VERIFIED
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-neutral-300">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-500">Mobile:</span>
                      <strong className="text-amber-300 font-mono">{client.phone}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-500">LTO License:</span>
                      <span className="font-mono text-emerald-400">{client.driverLicense}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-500">Address:</span>
                      <span className="text-neutral-300">{client.address}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-500">
                    <span>Registered: {new Date(client.registeredAt).toLocaleDateString()}</span>
                    <span className="text-amber-400 font-bold">{client.totalBookings} Bookings</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
