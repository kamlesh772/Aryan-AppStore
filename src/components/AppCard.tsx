import React from 'react';
import { Star, Download, CheckCircle2, Heart } from 'lucide-react';
import { AppItem } from '../types';
import { useDownloads } from '../context/DownloadContext';
import { useAuth } from '../context/AuthContext';

interface AppCardProps {
  app: AppItem;
  onSelectApp: (app: AppItem) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onSelectApp }) => {
  const { startDownload } = useDownloads();
  const { favorites, toggleFavorite } = useAuth();

  const isFav = favorites.includes(app.id);

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    startDownload(app);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(app.id);
  };

  return (
    <div 
      onClick={() => onSelectApp(app)}
      className="bg-[#12161F] border border-gray-800 p-4 rounded-2xl hover:border-gray-600 transition-all cursor-pointer group flex flex-col justify-between shadow-md relative"
    >
      <div>
        {/* App Header (Icon, Title, Developer, Favorite Button) */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="relative flex-shrink-0">
              <img 
                src={app.iconUrl} 
                alt={app.name} 
                className="w-12 h-12 rounded-xl object-cover bg-[#1A1F2B] border border-gray-800 shadow-md group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://img.icons8.com/color/512/android-os.png';
                }}
              />
              {app.isVerified && (
                <span className="absolute -bottom-1 -right-1 bg-[#0A0C10] rounded-full p-0.5 text-green-400" title="Verified Open Source">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-green-500/20 text-green-400" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-white truncate group-hover:text-green-400 transition-colors">
                {app.name}
              </h3>
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {app.developer}
              </p>
              
              {/* Meta Tags */}
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <span className="inline-block bg-[#1A1F2B] text-gray-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-gray-700/60">
                  {app.category}
                </span>
                <span className="inline-block bg-green-500/10 text-green-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-green-500/20">
                  {app.license}
                </span>
                {app.isPublished === false && (
                  <span className="inline-block bg-amber-500/20 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                    Draft
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Favorite heart button */}
          <button
            onClick={handleFavoriteClick}
            className={`p-1.5 rounded-xl border transition-all ${
              isFav 
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' 
                : 'bg-[#1A1F2B] border-gray-800 text-gray-500 hover:text-gray-300'
            }`}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Short Description */}
        <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
          {app.shortDescription}
        </p>
      </div>

      {/* Card Footer (Rating, Version/Size, Action) */}
      <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{(app.rating || 5.0).toFixed(1)}</span>
          </div>
          <span className="text-gray-600">•</span>
          <span className="font-mono text-[10px] text-gray-400">v{app.version}</span>
          <span className="text-gray-600">•</span>
          <span className="text-[11px] text-gray-400">{app.size}</span>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownloadClick}
          className="flex items-center gap-1.5 bg-green-500 text-black hover:bg-green-400 font-bold px-3 py-1.5 rounded-xl text-xs shadow-md transition-all active:scale-95 group-hover:shadow-green-500/20"
          title="Download APK"
        >
          <Download className="w-3.5 h-3.5" />
          <span>APK</span>
        </button>
      </div>
    </div>
  );
};
