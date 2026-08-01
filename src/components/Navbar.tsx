import React from 'react';
import { Search, Download, ShieldCheck, Smartphone, Sparkles } from 'lucide-react';
import { usePWA } from '../context/PWAContext';
import { useDownloads } from '../context/DownloadContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAdminModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openAdminModal,
  searchQuery,
  setSearchQuery
}) => {
  const { canInstall, isInstalled, promptInstall } = usePWA();
  const { activeCount, downloads } = useDownloads();
  const { isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#12161F] border-b border-gray-800 px-6 py-3 shrink-0 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <button 
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3 text-left group focus:outline-none shrink-0"
        >
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-green-500/20">
            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm-2 18H9v-2h6v2zm3-4H6V5h12v10z"/></svg>
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-0.5">
              <span>Aryan</span><span className="text-green-500">App</span><span>Store</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-medium -mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Free & Open Source APKs
            </p>
          </div>
        </button>

        {/* Desktop Search Bar Input */}
        <div className="hidden md:flex flex-1 max-w-xl mx-6 relative">
          <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-500 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search open-source apps..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentTab !== 'search') setCurrentTab('search');
            }}
            className="w-full bg-[#1A1F2B] border border-gray-700 rounded-full py-2 pl-10 pr-10 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* PWA Install Button */}
          {!isInstalled && (
            <button
              onClick={promptInstall}
              className="hidden sm:flex items-center gap-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
              title="Install App Store PWA"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Install PWA</span>
            </button>
          )}

          {/* Downloads Manager Header Button */}
          <button
            onClick={() => setCurrentTab('downloads')}
            className={`relative p-2 rounded-xl border transition-all ${
              currentTab === 'downloads'
                ? 'bg-green-500/20 border-green-500/50 text-green-400'
                : 'bg-[#1A1F2B] border-gray-800 text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
            title="Download Manager"
          >
            <Download className="w-5 h-5" />
            {activeCount > 0 ? (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 text-black font-bold text-[10px] flex items-center justify-center animate-bounce">
                {activeCount}
              </span>
            ) : downloads.length > 0 ? (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-400"></span>
            ) : null}
          </button>

          {/* Admin Button */}
          <button
            onClick={openAdminModal}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isAdmin
                ? 'bg-green-500 text-black border-green-400 font-bold shadow-md shadow-green-500/20'
                : 'bg-[#1A1F2B] border-gray-800 text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${isAdmin ? 'text-black' : 'text-green-500'}`} />
            <span className="hidden sm:inline uppercase tracking-wider text-[11px] font-bold">{isAdmin ? 'Admin Panel' : 'Admin'}</span>
          </button>

        </div>

      </div>
    </header>
  );
};
