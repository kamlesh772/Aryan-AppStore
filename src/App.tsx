import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { PWAProvider, usePWA } from './context/PWAContext';
import { DownloadProvider, useDownloads } from './context/DownloadContext';
import { AppItem, AppCategory } from './types';
import { getAppsService, addAppService, updateAppService, deleteAppService, seedInitialAppsService } from './services/appService';
import { INITIAL_APPS } from './data/initialApps';
import { Compass, Grid, Download as DownloadIcon, Info, ShieldCheck, Search as SearchIcon, Smartphone, RefreshCw, Database } from 'lucide-react';

import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { DeveloperSubmitModal } from './components/DeveloperSubmitModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminAppModal } from './components/AdminAppModal';

import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AppDetailsPage } from './pages/AppDetailsPage';
import { DownloadsPage } from './pages/DownloadsPage';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';

function DesktopSidebar({
  currentTab,
  setCurrentTab,
  openAdminModal
}: {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAdminModal: () => void;
}) {
  const { promptInstall, isInstalled } = usePWA();
  const { activeCount } = useDownloads();

  const navItems = [
    { id: 'home', label: 'Discover', icon: Compass },
    { id: 'search', label: 'Search & Explore', icon: SearchIcon },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'downloads', label: 'Downloads', icon: DownloadIcon, badge: activeCount > 0 ? activeCount : null },
    { id: 'about', label: 'About Store', icon: Info },
  ];

  return (
    <nav className="hidden lg:flex w-64 bg-[#0F131A] border-r border-gray-800 p-5 flex-col gap-1.5 shrink-0 min-h-[calc(100vh-57px)]">
      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-3 mb-1">
        Navigation
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              isActive
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </div>
            {item.badge ? (
              <span className="bg-green-500 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            ) : null}
          </button>
        );
      })}

      <button
        onClick={openAdminModal}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all mt-2 ${
          currentTab === 'admin'
            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
            : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
        }`}
      >
        <ShieldCheck className="w-4 h-4 text-green-400" />
        <span>Admin Panel</span>
      </button>

      {/* PWA Promo Card in Sidebar */}
      {!isInstalled && (
        <div className="mt-auto p-4 bg-[#12161F] border border-gray-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-extrabold text-white">
            <Smartphone className="w-4 h-4 text-green-400" />
            <span>PWA Support</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-tight">
            Install Aryan App Store on your home screen for quick offline access.
          </p>
          <button 
            onClick={promptInstall}
            className="w-full py-2 bg-green-500 hover:bg-green-400 text-black rounded-xl text-xs font-bold transition-all shadow-md shadow-green-500/20"
          >
            Install App Store
          </button>
        </div>
      )}
    </nav>
  );
}

function AppContent() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loadingApps, setLoadingApps] = useState<boolean>(true);

  // Navigation
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Modals
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  const [isAdminAppModalOpen, setIsAdminAppModalOpen] = useState<boolean>(false);
  const [appToEdit, setAppToEdit] = useState<AppItem | null>(null);
  const [isDeveloperSubmitModalOpen, setIsDeveloperSubmitModalOpen] = useState<boolean>(false);

  // Fetch apps on mount with fail-safe timeout
  const refreshApps = async () => {
    setLoadingApps(true);

    const timer = setTimeout(() => {
      console.warn('App fetch timeout reached. Loading default open-source catalog...');
      setApps(INITIAL_APPS.map(a => ({ ...a, isPublished: true })));
      setLoadingApps(false);
    }, 3500);

    try {
      const data = await getAppsService();
      clearTimeout(timer);
      if (data && data.length > 0) {
        setApps(data);
      } else {
        setApps(INITIAL_APPS.map(a => ({ ...a, isPublished: true })));
      }
    } catch (err) {
      clearTimeout(timer);
      console.error('Failed to load apps, applying fallback:', err);
      setApps(INITIAL_APPS.map(a => ({ ...a, isPublished: true })));
    } finally {
      clearTimeout(timer);
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    refreshApps();
  }, []);

  // Handlers
  const handleSelectApp = (app: AppItem) => {
    setSelectedApp(app);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToStore = () => {
    setSelectedApp(null);
  };

  const handleSelectCategory = (cat: AppCategory) => {
    setSelectedCategory(cat);
    setCurrentTab('search');
    setSelectedApp(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    setSelectedApp(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAddModal = () => {
    setAppToEdit(null);
    setIsAdminAppModalOpen(true);
  };

  const handleOpenEditModal = (app: AppItem) => {
    setAppToEdit(app);
    setIsAdminAppModalOpen(true);
  };

  const handleSaveApp = async (appData: any, isEdit: boolean) => {
    if (isEdit && appToEdit) {
      await updateAppService(appToEdit.id, appData);
    } else {
      await addAppService(appData);
    }
    await refreshApps();
  };

  const handleDeleteApp = async (id: string) => {
    await deleteAppService(id);
    await refreshApps();
  };

  const handleSeedApps = async () => {
    await seedInitialAppsService();
    await refreshApps();
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-gray-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        openAdminModal={() => setIsAdminLoginModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* PWA Install Callout Banner */}
      <PWAInstallBanner />

      {/* Main Body Layout with Desktop Sidebar */}
      <div className="flex flex-1 w-full max-w-7xl mx-auto">
        <DesktopSidebar
          currentTab={currentTab}
          setCurrentTab={handleTabChange}
          openAdminModal={() => setIsAdminLoginModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 min-w-0">
          {loadingApps ? (
            <div className="py-24 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-green-500/30 border-t-green-400 animate-spin mx-auto"></div>
              <p className="text-sm font-semibold text-gray-400">Loading Aryan App Store catalog...</p>
            </div>
          ) : apps.length === 0 ? (
            <div className="py-20 text-center space-y-5 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-800/80 rounded-2xl flex items-center justify-center mx-auto text-green-400 border border-gray-700">
                <Database className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">No Applications Found</h2>
                <p className="text-xs text-gray-400 mt-1">
                  The store database is currently empty. You can seed the catalog with 20 curated open-source apps or retry fetching.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleSeedApps}
                  className="px-4 py-2.5 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-green-500/20"
                >
                  <Database className="w-4 h-4" />
                  <span>Seed 20 FOSS Apps</span>
                </button>
                <button
                  onClick={refreshApps}
                  className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-2 border border-gray-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry Connection</span>
                </button>
              </div>
            </div>
          ) : selectedApp ? (
            <AppDetailsPage
              app={selectedApp}
              allApps={apps}
              onBack={handleBackToStore}
              onSelectApp={handleSelectApp}
            />
          ) : (
            <>
              {currentTab === 'home' && (
                <HomePage
                  apps={apps}
                  onSelectApp={handleSelectApp}
                  onSelectCategory={handleSelectCategory}
                  onNavigateTab={handleTabChange}
                  onOpenSubmitModal={() => setIsDeveloperSubmitModalOpen(true)}
                />
              )}

              {currentTab === 'search' && (
                <SearchPage
                  apps={apps}
                  onSelectApp={handleSelectApp}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              )}

              {currentTab === 'categories' && (
                <CategoriesPage
                  apps={apps}
                  onSelectCategory={handleSelectCategory}
                  onSelectApp={handleSelectApp}
                />
              )}

              {currentTab === 'downloads' && (
                <DownloadsPage />
              )}

              {currentTab === 'about' && (
                <AboutPage
                  onOpenSubmitModal={() => setIsDeveloperSubmitModalOpen(true)}
                />
              )}

              {currentTab === 'admin' && (
                <AdminPage
                  apps={apps}
                  onOpenAddModal={handleOpenAddModal}
                  onOpenEditModal={handleOpenEditModal}
                  onDeleteApp={handleDeleteApp}
                  onSeedApps={handleSeedApps}
                  onSelectApp={handleSelectApp}
                  openLoginModal={() => setIsAdminLoginModalOpen(true)}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        openAdminModal={() => setIsAdminLoginModalOpen(true)}
      />

      {/* Modals */}
      <DeveloperSubmitModal
        isOpen={isDeveloperSubmitModalOpen}
        onClose={() => setIsDeveloperSubmitModalOpen(false)}
      />

      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccess={() => {
          setCurrentTab('admin');
          setSelectedApp(null);
        }}
      />

      <AdminAppModal
        isOpen={isAdminAppModalOpen}
        appToEdit={appToEdit}
        onClose={() => setIsAdminAppModalOpen(false)}
        onSave={handleSaveApp}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PWAProvider>
        <DownloadProvider>
          <AppContent />
        </DownloadProvider>
      </PWAProvider>
    </AuthProvider>
  );
}
