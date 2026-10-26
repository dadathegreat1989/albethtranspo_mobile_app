import React, { useState } from 'react';
import { useRental } from '../context/RentalContext';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  MapPin, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  X,
  LogIn,
  UserPlus,
  Download,
  Radio,
  Key,
  AlertCircle
} from 'lucide-react';
import { ADMIN_EMAIL } from '../services/adminNotificationService';

export const OnboardingScreen: React.FC = () => {
  const { 
    setActiveScreen, 
    setActiveTab, 
    loginClient, 
    registerClient, 
    loginAdmin, 
    currentUser 
  } = useRental();
  const [authMode, setAuthMode] = useState<'presentation' | 'login' | 'register' | 'admin-login'>('presentation');

  // Client Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Client Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('+63 ');
  const [regEmail, setRegEmail] = useState('');
  const [regLicense, setRegLicense] = useState('');
  const [regAddress, setRegAddress] = useState('San Sebastian, Samar');
  const [regPassword, setRegPassword] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // Admin / Dispatcher Login form state
  const [adminEmail, setAdminEmail] = useState('allanpacoma@gmail.com');
  const [adminPassword, setAdminPassword] = useState('admin888');
  const [adminLoading, setAdminLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStartDirect = () => {
    setActiveScreen('main');
    setActiveTab('fleet');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoginLoading(true);
    try {
      await loginClient(loginIdentifier, loginPassword);
      setActiveScreen('main');
      setActiveTab('fleet');
    } catch (err: any) {
      setErrorMsg('Login failed. Please verify credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setAdminLoading(true);
    try {
      await loginAdmin(adminEmail, adminPassword);
    } catch (err: any) {
      setErrorMsg(err.message || 'Dispatcher login failed. Please check credentials.');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!regName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!regPhone.trim() || regPhone.length < 8) {
      setErrorMsg('Please provide a valid Philippine mobile number');
      return;
    }
    if (!regLicense.trim()) {
      setErrorMsg("Please enter your Philippine Driver's License number");
      return;
    }

    setRegLoading(true);
    try {
      await registerClient({
        name: regName,
        phone: regPhone,
        email: regEmail || `${regName.toLowerCase().replace(/\s+/g, '')}@client.ph`,
        driverLicense: regLicense,
        address: regAddress
      });
      setActiveScreen('main');
      setActiveTab('fleet');
    } catch (err: any) {
      setErrorMsg('Registration failed. Please check your details.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-[#18181D] text-white overflow-hidden select-none">
      {/* Top Graphic Area with Mitsubishi Mirage G4 image and cinematic gradient */}
      <div className="relative flex-[1.4] w-full min-h-[260px] overflow-hidden bg-neutral-950">
        <img
          src="/car_assets/mirage_g4_onboard.jpg"
          alt="ALBETH TRANSPORT Fleet"
          className="w-full h-full object-cover object-center transform scale-105 hover:scale-110 transition-transform duration-1000 opacity-90"
        />

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#18181D] via-[#18181D]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

        {/* Floating Top Badge with San Sebastian Samar HQ & Region 8 */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wide uppercase text-amber-300">
              San Sebastian, Samar Hub
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-neutral-300 text-[11px] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Region 8 Fleet</span>
          </div>
        </div>

        {/* Central Slogan Overlay */}
        <div className="absolute bottom-4 left-6 right-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/90 text-neutral-950 text-[10px] font-extrabold uppercase tracking-widest shadow-md">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>Region 8 (Samar & Leyte)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md mt-1.5">
            ALBETH TRANSPORT
          </h2>
          <p className="text-xs text-amber-300 font-semibold drop-shadow">
            (Cars for any occasions) • San Sebastian, Samar
          </p>
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="relative flex-1 bg-[#18181D] px-6 pt-3 pb-6 flex flex-col justify-between overflow-y-auto">
        {/* PRESENTATION MODE: Client Login, Register, Dispatcher Portal, and Explore */}
        {authMode === 'presentation' && (
          <div className="flex flex-col justify-between h-full space-y-3">
            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Self-Drive & Chauffeur <br />
                <span className="text-amber-400">Cars for Any Occasions</span>
              </h1>
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed max-w-sm">
                Rent vehicles across Region 8 (Any Point) with real-time GPS return tracking and central dispatch.
              </p>
            </div>

            {/* Portal Action Buttons */}
            <div className="pt-1 space-y-2">
              {/* Client Login & Create Account */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAuthMode('login')}
                  className="py-3 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <LogIn className="w-4 h-4 text-amber-400" />
                  <span>Client Login</span>
                </button>

                <button
                  onClick={() => setAuthMode('register')}
                  className="py-3 px-3 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  <span>Create Account</span>
                </button>
              </div>

              {/* Central Admin / Dispatcher Login (Directly Under Client Login) */}
              <button
                onClick={() => setAuthMode('admin-login')}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#22222E] via-[#2A2A38] to-[#22222E] hover:border-amber-400 border border-amber-400/40 text-amber-300 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md group"
              >
                <Radio className="w-4 h-4 text-amber-400 group-hover:animate-pulse" />
                <span>Admin & Central Dispatcher Portal (Monitor Fleet & GPS)</span>
              </button>

              <button
                onClick={handleStartDirect}
                className="group w-full h-11 bg-white hover:bg-neutral-100 active:scale-[0.98] text-neutral-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all"
              >
                <span>Explore Fleet & Standard Rates</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-400 pt-1">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>LTO Verified</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>San Sebastian Hub</span>
                </div>
                <span>•</span>
                <span>Rates in PHP (₱)</span>
              </div>

              {/* ALBETH TRANSPORT Official Transparent Logo */}
              <div className="pt-1 pb-1 flex flex-col items-center justify-center">
                <div className="bg-transparent flex items-center justify-center hover:scale-105 transition-transform">
                  <img
                    src="/car_assets/albeth_logo_transparent.png"
                    alt="ALBETH TRANSPORT (Cars for any occasions)"
                    className="h-14 sm:h-16 w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(255,255,255,0.75)]"
                  />
                </div>
                <p className="text-[11px] font-extrabold text-amber-400 mt-1 tracking-wide text-center">
                  ALBETH TRANSPORT (Cars for any occasions)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CLIENT LOGIN PORTAL */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="h-full flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white">Client Login</h3>
                  <p className="text-xs text-neutral-400">Access your ALBETH bookings & GPS keys</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthMode('presentation')}
                  className="p-1.5 rounded-full bg-white/10 text-neutral-300 hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-300">
                    Email or Philippine Mobile (+63)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={e => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. 0917XXXXXXX or client@email.ph"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{loginLoading ? 'Signing in...' : 'Sign In as Client'}</span>
              </button>

              <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="hover:text-white"
                >
                  New Client? <span className="text-amber-400 font-bold underline">Create Account</span>
                </button>
                <button
                  type="button"
                  onClick={handleStartDirect}
                  className="hover:text-neutral-200"
                >
                  Browse as Guest &gt;
                </button>
              </div>

              {/* Dedicated Dispatcher Switch Under Client Login */}
              <div className="pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setAuthMode('admin-login')}
                  className="w-full py-2.5 rounded-xl bg-[#23232E] hover:bg-[#2A2A38] border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Radio className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin & Dispatcher Login (Allan Pacoma) &gt;</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ADMIN / DISPATCHER LOGIN PORTAL */}
        {authMode === 'admin-login' && (
          <form onSubmit={handleAdminLoginSubmit} className="h-full flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <h3 className="text-base sm:text-lg font-black text-amber-400 uppercase tracking-wide">
                      Dispatcher Command Login
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-300">
                    Real-time fleet monitor, GPS telemetry, bookings & transactions
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthMode('presentation')}
                  className="p-1.5 rounded-full bg-white/10 text-neutral-300 hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Info banner */}
              <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 space-y-1 text-xs">
                <div className="font-bold text-amber-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Authorized Central Dispatcher Credentials</span>
                </div>
                <p className="text-[11px] text-neutral-300">
                  Officer: <strong>Allan Pacoma</strong> ({ADMIN_EMAIL}) • HQ San Sebastian, Samar
                </p>
              </div>

              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-300">
                    Dispatcher Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={e => setAdminEmail(e.target.value)}
                      placeholder="allanpacoma@gmail.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-300">
                    Dispatcher Security PIN / Password
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={e => setAdminPassword(e.target.value)}
                      placeholder="admin888"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={adminLoading}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-neutral-950 font-black text-xs shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Radio className="w-4 h-4" />
                <span>{adminLoading ? 'Authenticating...' : 'Enter Dispatcher Command Center'}</span>
              </button>

              <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="hover:text-amber-300 font-semibold"
                >
                  &lt; Back to Client Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdminEmail('allanpacoma@gmail.com');
                    setAdminPassword('admin888');
                  }}
                  className="text-[10px] text-amber-400/80 hover:text-amber-300 underline"
                >
                  Fill Default Allan Credentials
                </button>
              </div>
            </div>
          </form>
        )}

        {/* CLIENT REGISTRATION PORTAL */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="h-full flex flex-col justify-between space-y-2.5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">Create Client Account</h3>
                  <p className="text-[11px] text-neutral-400">Rent vehicles across Region 8 (Any Point)</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthMode('presentation')}
                  className="p-1.5 rounded-full bg-white/10 text-neutral-300 hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {errorMsg && (
                <div className="p-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-[11px] font-semibold">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-neutral-300">Client Full Name *</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="e.g. Juan Dela Cruz"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-neutral-300">Philippine Mobile *</label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    placeholder="+63 917XXXXXXX"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-neutral-300">Email Address</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="client@email.ph"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-neutral-300">LTO Driver License *</label>
                  <input
                    type="text"
                    value={regLicense}
                    onChange={e => setRegLicense(e.target.value)}
                    placeholder="N01-XX-XXXXXX"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 uppercase font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-semibold text-neutral-300">Municipality / City (Region 8)</label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={e => setRegAddress(e.target.value)}
                  placeholder="San Sebastian, Catbalogan, Tacloban..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-[10px] text-amber-300 leading-snug">
                Upon registration, your account details are automatically sent to Admin Allan Pacoma ({ADMIN_EMAIL}) and logged in the Central Dispatcher console.
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                <span>{regLoading ? 'Registering...' : 'Register Account & Rent in Region 8'}</span>
              </button>

              <div className="flex items-center justify-between text-xs text-neutral-400">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="hover:text-white"
                >
                  Already have an account? <span className="text-amber-400 font-bold underline">Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('admin-login')}
                  className="hover:text-amber-300 text-[11px]"
                >
                  Dispatcher Login &gt;
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
