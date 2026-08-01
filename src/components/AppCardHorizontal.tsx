import React from 'react';
import { Star, Download, ShieldCheck, Sparkles } from 'lucide-react';
import { AppItem } from '../types';
import { useDownloads } from '../context/DownloadContext';

interface AppCardHorizontalProps {
  app: AppItem;
  onSelectApp: (app: AppItem) => void;
}

export const AppCardHorizontal: React.FC<AppCardHorizontalProps> = ({ app, onSelectApp }) => {
  const { startDownload } = useDownloads();

  return (
    <div 
      onClick={() => onSelectApp(app)}
      className="group relative w-full bg-gradient-to-br from-green-900/40 via-[#12161F] to-[#0A0C10] border border-green-500/30 hover:border-green-500/60 rounded-3xl p-6 md:p-10 transition-all duration-300 hover:shadow-2xl hover:shadow-green-950/40 cursor-pointer overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
    >
      <div className="flex-1 z-10 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-green-500 text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-md inline-block shadow-sm tracking-wider">
            App of the week
          </span>
          <span className="text-gray-400 text-xs font-semibold">{app.category}</span>
          <span className="text-gray-600">•</span>
          <span className="text-green-400 text-xs font-mono font-semibold">{app.license}</span>
        </div>

        <h2 className="text-2xl md:text-4xl font-bold text-white group-hover:text-green-400 transition-colors">
          {app.name}
        </h2>

        <p className="text-gray-300 text-sm max-w-xl leading-relaxed line-clamp-2">
          {app.shortDescription}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-400 font-medium pt-1">
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-4 h-4 fill-amber-400" />
            {app.rating.toFixed(1)}
          </span>
          <span>•</span>
          <span className="font-mono text-gray-300">v{app.version}</span>
          <span>•</span>
          <span>{app.size}</span>
          <span>•</span>
          <span>{app.downloadCount.toLocaleString()} downloads</span>
        </div>

        <div className="flex items-center gap-3 pt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              startDownload(app);
            }}
            className="px-6 py-2.5 bg-green-500 text-black rounded-full font-bold hover:bg-green-400 hover:scale-105 transition-all text-sm flex items-center gap-2 shadow-lg shadow-green-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Install Now</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectApp(app);
            }}
            className="px-5 py-2.5 bg-white/10 text-white rounded-full font-bold backdrop-blur-md hover:bg-white/20 transition-all text-sm"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Hero Right Floating Graphic Box */}
      <div className="hidden md:flex items-center justify-center relative flex-shrink-0">
        <div className="w-40 h-40 lg:w-48 lg:h-48 bg-[#1A1F2B] rounded-3xl rotate-12 shadow-2xl flex items-center justify-center border border-gray-700 group-hover:rotate-6 transition-transform duration-500">
          <div className="w-28 h-28 lg:w-32 lg:h-32 bg-green-500/20 rounded-2xl flex items-center justify-center overflow-hidden">
            <img 
              src={app.iconUrl} 
              alt={app.name} 
              className="w-20 h-20 lg:w-24 lg:h-24 object-cover rounded-xl shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://img.icons8.com/color/512/android-os.png';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
