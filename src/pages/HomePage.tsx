import React, { useState } from 'react';
import { Sparkles, TrendingUp, Sparkle, Code, ShieldCheck, ArrowRight, Search } from 'lucide-react';
import { AppItem, AppCategory } from '../types';
import { AppCard } from '../components/AppCard';
import { AppCardHorizontal } from '../components/AppCardHorizontal';
import { CATEGORIES_LIST } from '../data/initialApps';

interface HomePageProps {
  apps: AppItem[];
  onSelectApp: (app: AppItem) => void;
  onSelectCategory: (category: AppCategory) => void;
  onNavigateTab: (tab: string) => void;
  onOpenSubmitModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  apps,
  onSelectApp,
  onSelectCategory,
  onNavigateTab,
  onOpenSubmitModal
}) => {
  const featuredApps = apps.filter(a => a.featured);
  const heroApp = featuredApps.length > 0 ? featuredApps[0] : apps[0];

  const topDownloadedApps = [...apps].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 6);
  const newApps = [...apps].filter(a => a.isNew || new Date(a.createdAt).getTime() > Date.now() - 60*24*60*60*1000).slice(0, 6);
  const utilityApps = apps.filter(a => a.category === 'Utilities' || a.category === 'Developer & Tools').slice(0, 4);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Featured Hero Banner */}
      {heroApp && (
        <section className="relative pt-2">
          <AppCardHorizontal app={heroApp} onSelectApp={onSelectApp} />
        </section>
      )}

      {/* Quick Category Chips */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Sparkle className="w-5 h-5 text-green-400" />
            <span>Popular Categories</span>
          </h2>
          <button 
            onClick={() => onNavigateTab('categories')}
            className="text-xs font-bold text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors"
          >
            <span>View All ({CATEGORIES_LIST.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES_LIST.slice(0, 4).map((cat) => {
            const count = apps.filter(a => a.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group relative bg-[#12161F] border border-gray-800 hover:border-gray-600 rounded-2xl p-3.5 transition-all duration-200 text-left flex items-center gap-3 shadow-sm"
              >
                <div className={`w-10 h-10 rounded-xl ${cat.bgGradient} flex items-center justify-center font-bold text-sm flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  {cat.name.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-xs text-white truncate group-hover:text-green-400">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {count} {count === 1 ? 'app' : 'apps'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Top Downloads Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span>Top Downloaded Apps</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Most popular verified open-source applications</p>
          </div>
          <button 
            onClick={() => onNavigateTab('search')}
            className="text-xs font-bold text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors"
          >
            <span>Explore Store</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topDownloadedApps.map((app) => (
            <AppCard key={app.id} app={app} onSelectApp={onSelectApp} />
          ))}
        </div>
      </section>

      {/* Submit Open Source App CTA Banner */}
      <section className="bg-gradient-to-r from-green-950/60 via-[#12161F] to-green-950/60 border border-green-500/30 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30">
            <Code className="w-3.5 h-3.5" />
            <span>Developer Hub</span>
          </span>
          <h2 className="text-2xl font-extrabold text-white">
            Are you an Android Developer?
          </h2>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
            Publish your open-source Android app to Aryan App Store for free. Reach users looking for verified, privacy-friendly APKs without restrictive app store fees.
          </p>
        </div>

        <button
          onClick={onOpenSubmitModal}
          className="flex-shrink-0 bg-green-500 hover:bg-green-400 text-black font-extrabold px-6 py-3 rounded-full shadow-lg shadow-green-500/20 transition-all active:scale-95 text-sm flex items-center gap-2"
        >
          <Code className="w-4 h-4" />
          <span>Submit Your App</span>
        </button>
      </section>

      {/* New & Updated Releases */}
      {newApps.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>New & Updated Releases</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Freshly published APK builds</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newApps.map((app) => (
              <AppCard key={app.id} app={app} onSelectApp={onSelectApp} />
            ))}
          </div>
        </section>
      )}

      {/* Tools & Utilities Highlight */}
      {utilityApps.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Developer & Power Utilities</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Terminals, file managers, and system tools</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {utilityApps.map((app) => (
              <AppCard key={app.id} app={app} onSelectApp={onSelectApp} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
