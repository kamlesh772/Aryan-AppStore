import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Star, Download, X } from 'lucide-react';
import { AppItem, AppCategory, AppLicense } from '../types';
import { AppCard } from '../components/AppCard';
import { CATEGORIES_LIST } from '../data/initialApps';

interface SearchPageProps {
  apps: AppItem[];
  onSelectApp: (app: AppItem) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  apps,
  onSelectApp,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory
}) => {
  const [selectedLicense, setSelectedLicense] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'name'>('popular');

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      // Query search
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        app.name.toLowerCase().includes(query) ||
        app.developer.toLowerCase().includes(query) ||
        app.packageName.toLowerCase().includes(query) ||
        app.shortDescription.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query);

      // Category filter
      const matchesCategory = !selectedCategory || selectedCategory === 'All' || app.category === selectedCategory;

      // License filter
      const matchesLicense = selectedLicense === 'All' || app.license === selectedLicense;

      return matchesSearch && matchesCategory && matchesLicense;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.downloadCount - a.downloadCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [apps, searchQuery, selectedCategory, selectedLicense, sortBy]);

  const licensesList = ['All', 'GPL-3.0', 'MIT', 'Apache-2.0', 'AGPL-3.0', 'BSD-3-Clause'];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Search Header */}
      <div className="bg-[#12161F] border border-gray-800 rounded-3xl p-5 md:p-6 space-y-4 shadow-xl">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-green-400" />
          <span>Search & Filter Apps</span>
        </h1>

        {/* Big Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by app title, package, developer or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1A1F2B] border border-gray-700 rounded-2xl pl-12 pr-10 py-3.5 text-base text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-800">
          
          {/* Category Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full md:w-auto">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1 flex-shrink-0">
              <Filter className="w-3.5 h-3.5 text-green-400" />
              Category:
            </span>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                !selectedCategory || selectedCategory === 'All'
                  ? 'bg-green-500 text-black font-bold'
                  : 'bg-[#1A1F2B] border border-gray-800 text-gray-300 hover:bg-gray-800'
              }`}
            >
              All
            </button>
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-green-500 text-black font-bold'
                    : 'bg-[#1A1F2B] border border-gray-800 text-gray-300 hover:bg-gray-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-green-400" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#1A1F2B] border border-gray-700 text-white rounded-xl text-xs font-semibold px-3 py-1.5 focus:outline-none focus:border-green-500"
            >
              <option value="popular">Most Downloaded</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Added</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>

        </div>

        {/* License Filter Row */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-gray-800">
          <span className="text-xs font-bold text-gray-400 flex-shrink-0">License:</span>
          {licensesList.map((lic) => (
            <button
              key={lic}
              onClick={() => setSelectedLicense(lic)}
              className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                selectedLicense === lic
                  ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                  : 'bg-[#1A1F2B] text-gray-400 hover:text-gray-200 border border-transparent'
              }`}
            >
              {lic}
            </button>
          ))}
        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing <strong className="text-white">{filteredApps.length}</strong> matching apps</span>
        {(searchQuery || selectedCategory || selectedLicense !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory(null);
              setSelectedLicense('All');
            }}
            className="text-emerald-400 hover:underline font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* App Grid */}
      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} onSelectApp={onSelectApp} />
          ))}
        </div>
      ) : (
        <div className="bg-[#12192b] border border-slate-800/80 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No apps found matching your query</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try searching for terms like "video", "terminal", "privacy", "F-Droid", or clear filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory(null);
              setSelectedLicense('All');
            }}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
};
