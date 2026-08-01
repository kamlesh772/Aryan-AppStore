import React from 'react';
import { Grid, ArrowRight, Layers, Sparkle } from 'lucide-react';
import { AppItem, AppCategory } from '../types';
import { CATEGORIES_LIST } from '../data/initialApps';
import { AppCard } from '../components/AppCard';

interface CategoriesPageProps {
  apps: AppItem[];
  onSelectCategory: (category: AppCategory) => void;
  onSelectApp: (app: AppItem) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  apps,
  onSelectCategory,
  onSelectApp
}) => {
  return (
    <div className="space-y-8 pb-16">
      
      {/* Categories Header */}
      <div className="bg-[#12161F] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-2 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
          <Grid className="w-7 h-7 text-green-400" />
          <span>App Categories</span>
        </h1>
        <p className="text-sm text-gray-300">
          Browse open-source Android apps curated by category and domain purpose.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORIES_LIST.map((category) => {
          const categoryApps = apps.filter((a) => a.category === category.id);
          return (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="group bg-[#12161F] border border-gray-800 hover:border-gray-600 rounded-3xl p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-2xl ${category.bgGradient} flex items-center justify-center font-extrabold text-base border border-gray-800 shadow-md group-hover:scale-105 transition-transform`}>
                    {category.name.slice(0, 2)}
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-[#1A1F2B] border border-gray-800 px-2.5 py-1 rounded-full">
                    {categoryApps.length} {categoryApps.length === 1 ? 'App' : 'Apps'}
                  </span>
                </div>

                <h2 className="text-lg font-extrabold text-white group-hover:text-green-400 transition-colors">
                  {category.name}
                </h2>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">
                  {category.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-800 flex items-center justify-between text-xs font-bold text-green-400">
                <span>Browse Category</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Spotlight Lists */}
      <div className="space-y-8 pt-4">
        {CATEGORIES_LIST.slice(0, 3).map((category) => {
          const catApps = apps.filter(a => a.category === category.id).slice(0, 3);
          if (!catApps.length) return null;

          return (
            <section key={category.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>{category.name} Highlights</span>
                </h3>
                <button
                  onClick={() => onSelectCategory(category.id)}
                  className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>See all {category.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {catApps.map((app) => (
                  <AppCard key={app.id} app={app} onSelectApp={onSelectApp} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

    </div>
  );
};
