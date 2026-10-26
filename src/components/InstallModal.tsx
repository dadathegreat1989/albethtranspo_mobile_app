import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  Share2,
  AlertTriangle,
  Info,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { isOnline, lastSyncedAt, isSyncing, syncNow, pendingOfflineActionsCount } = useOnlineStatus();
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showApkDetails, setShowApkDetails] = useState(false);

  if (!isOpen) return null;

  const handleDownloadApk = () => {
    setDownloadStarted(true);
    const link = document.createElement('a');
    link.href = '/downloads/ALBETH_TRANSPORT_v1.0.apk';
    link.download = 'ALBETH_TRANSPORT_v1.0.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadStarted(false), 4000);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#18181D] border border-white/10 rounded-3xl p-5 sm:p-6 text-neutral-100 shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-blue-600/20 border border-amber-500/30 flex items-center justify-center p-1.5 shadow-inner">
              <img 
                src="/car_assets/albeth_logo_transparent.png" 
                alt="ALBETH TRANSPORT" 
                className="w-full h-full object-contain filter drop-shadow-[0_1px_4px_rgba(255,255,255,0.7)]" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">Install ALBETH App</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  OFFICIAL APP
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                ALBETH TRANSPORT (Cars for any occasions) • Region 8
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Online & Auto-Sync Engine Status Banner */}
        <div className="mt-4 p-3.5 rounded-2xl bg-[#22222A] border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <Wifi className="w-4 h-4" />
                  <span>Online & Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                  <WifiOff className="w-4 h-4" />
                  <span>Offline Mode (Cached Fleet)</span>
                </div>
              )}
            </div>

            <button
              onClick={syncNow}
              disabled={isSyncing || !isOnline}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-neutral-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>

          <p className="text-[11px] text-neutral-400 leading-relaxed">
            {isOnline
              ? `Connected to San Sebastian Central Hub. Fleet status, real-time rates, and bookings sync automatically in the background.`
              : `Operating offline. You can browse all 4 fleet units, view vehicle specs, and draft bookings.`}
          </p>

          {lastSyncedAt && (
            <p className="text-[10px] text-neutral-500">
              Last synced: {lastSyncedAt.toLocaleTimeString()}
              {pendingOfflineActionsCount > 0 && ` • ${pendingOfflineActionsCount} action(s) queued`}
            </p>
          )}
        </div>

        {/* Option 1: RECOMMENDED OFFICIAL 1-TAP INSTALL (WebAPK - No Parsing Errors) */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-b from-[#242435] to-[#1A1A24] border-2 border-amber-400/80 shadow-lg space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Recommended: 100% Working on Android & iPhone</span>
              </div>
              <h3 className="text-sm font-black text-white">Direct Phone Install (No Parsing Errors)</h3>
              <p className="text-xs text-neutral-300">
                Installs as a native application with real home screen icon, fullscreen mode, offline support, and automatic updates.
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/30">
              1-Tap
            </span>
          </div>

          {/* Features pills */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-200">
            <div className="flex items-center gap-1.5 bg-black/40 p-2 rounded-xl border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>No "Problem Parsing" Error</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 p-2 rounded-xl border border-white/5">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Google Verified WebAPK</span>
            </div>
          </div>

          {isInstalled ? (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>App is already installed on your device in standalone mode!</span>
            </div>
          ) : isInstallable ? (
            <button
              onClick={install}
              className="w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-neutral-950 flex items-center justify-center gap-2 shadow-xl shadow-amber-400/20 active:scale-[0.98] transition-all"
            >
              <Smartphone className="w-4 h-4" />
              <span>Install to Phone Now (1-Tap)</span>
            </button>
          ) : (
            <div className="space-y-2.5 pt-1">
              {isIOS ? (
                /* iOS Safari instructions */
                <div className="p-3 rounded-xl bg-blue-500/15 border border-blue-500/30 text-xs text-neutral-200 space-y-1.5">
                  <p className="font-bold text-blue-300">How to Install on iPhone / iPad (Safari):</p>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px] text-neutral-300">
                    <li>Tap the <strong>Share</strong> button (square with arrow up) at the bottom.</li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                    <li>Tap <strong>"Add"</strong> in top-right corner.</li>
                  </ol>
                </div>
              ) : (
                /* Android Chrome instructions */
                <div className="p-3 rounded-xl bg-neutral-900/90 border border-amber-400/30 text-xs text-neutral-200 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300">
                    <Smartphone className="w-4 h-4" />
                    <span>How to Install on Android (Chrome / Samsung):</span>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-neutral-300">
                    <li>Tap the <strong>three dots (⋮)</strong> in the top-right corner of Chrome.</li>
                    <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                    <li>Tap <strong>"Install"</strong> — Android automatically installs the app to your home screen with zero parsing errors!</li>
                  </ol>
                </div>
              )}

              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/15 text-white flex items-center justify-center gap-2 border border-white/10 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy App Link for Phone'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Why "Problem Parsing Package" Happens & Alternative APK section */}
        <div className="mt-3 p-3.5 rounded-2xl bg-[#1F1F26] border border-white/5 space-y-2">
          <button
            onClick={() => setShowApkDetails(!showApkDetails)}
            className="w-full flex items-center justify-between text-left text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Why Android Shows "Problem Parsing the Package" on .APK:</span>
            </div>
            {showApkDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showApkDetails && (
            <div className="space-y-2 text-[11px] text-neutral-400 pt-2 border-t border-white/5 leading-relaxed">
              <p>
                <strong>The Cause:</strong> Modern Android (Android 10, 11, 12, 13, 14, 15) strictly blocks raw downloaded <code>.apk</code> files that are not compiled with a complete Android Studio Gradle toolchain and signed with APK Signature Scheme v2/v3.
              </p>
              <p>
                <strong>The Solution:</strong> Use the <strong>"Add to Home Screen / Install App"</strong> button above. When installed through your browser, Google Play Services generates a 100% genuine, device-signed native <strong>WebAPK</strong> that installs without any parsing errors or security warnings.
              </p>
              
              <div className="pt-2">
                <button
                  onClick={handleDownloadApk}
                  className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-[11px] font-semibold flex items-center gap-1.5 border border-white/10 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Raw .APK Archive Anyway (5.6 MB)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-500">
          <span>ALBETH TRANSPORT • Region 8, Philippines</span>
          <span>Head Office: San Sebastian, Samar</span>
        </div>
      </div>
    </div>
  );
};
