import React from 'react';
import { Home, Search, Grid, Download, Info, Shield } from 'lucide-react';
import { useDownloads } from '../context/DownloadContext';
import { useAuth } from '../context/AuthContext';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAdminModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  openAdminModal
}) => {
  const { activeCount } = useDownloads();
  const { isAdmin } = useAuth();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'downloads', label: 'Downloads', icon: Download, badge: activeCount > 0 ? activeCount : null },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#12161F] border-t border-gray-800 px-2 py-1.5 lg:hidden shadow-lg">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`relative flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
                isActive ? 'text-green-400 font-bold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-green-400' : ''}`} />
                {tab.badge ? (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-green-500 text-black text-[9px] font-extrabold flex items-center justify-center">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-0.5"></span>
              )}
            </button>
          );
        })}

        {/* Admin Quick Tab */}
        <button
          onClick={openAdminModal}
          className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
            currentTab === 'admin' ? 'text-green-400 font-bold' : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Shield className={`w-5 h-5 ${isAdmin ? 'text-green-400' : ''}`} />
          <span className="text-[10px] mt-1">{isAdmin ? 'Admin' : 'Login'}</span>
        </button>
      </div>
    </nav>
  );
};
