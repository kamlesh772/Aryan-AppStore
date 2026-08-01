import React from 'react';
import { Smartphone, X, Download, ShieldCheck } from 'lucide-react';
import { usePWA } from '../context/PWAContext';

export const PWAInstallBanner: React.FC = () => {
  const { isInstalled, promptInstall, dismissPrompt, showBanner } = usePWA();

  if (isInstalled || !showBanner) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-[#0f172a] to-emerald-950 border-b border-emerald-500/30 px-4 py-3 relative shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 text-emerald-400">
            <Smartphone className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Get the Aryan App Store PWA</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.2 rounded-full border border-emerald-500/30">Native Experience</span>
            </h4>
            <p className="text-xs text-slate-300 hidden sm:block">
              Install on your device home screen for instant access, offline catalog browsing & fast updates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={promptInstall}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs shadow-md transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install Now</span>
          </button>
          
          <button
            onClick={dismissPrompt}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
