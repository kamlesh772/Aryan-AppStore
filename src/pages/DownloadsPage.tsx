import React from 'react';
import { Download, Trash2, CheckCircle2, Smartphone, AlertTriangle, ArrowRight, RefreshCw, FolderDown } from 'lucide-react';
import { useDownloads } from '../context/DownloadContext';

export const DownloadsPage: React.FC = () => {
  const { downloads, activeDownload, clearHistory, removeDownload, startDownload } = useDownloads();

  const completedDownloads = downloads.filter((d) => d.status === 'completed');
  const activeDownloads = downloads.filter((d) => d.status === 'downloading');

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-[#12161F] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-2 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
            <Download className="w-7 h-7 text-green-400" />
            <span>Download Manager</span>
          </h1>
          <p className="text-sm text-gray-300">
            Track active APK downloads and manage your offline installation history.
          </p>
        </div>

        {downloads.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 bg-[#1A1F2B] hover:bg-gray-800 text-gray-400 hover:text-rose-400 border border-gray-800 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Active Downloads Section */}
      {activeDownloads.length > 0 && (
        <section className="bg-gradient-to-r from-green-950/60 via-[#12161F] to-[#12161F] border border-green-500/40 rounded-3xl p-6 space-y-4 shadow-xl">
          <h2 className="text-lg font-extrabold text-green-400 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Active Downloads ({activeDownloads.length})</span>
          </h2>

          <div className="space-y-3">
            {activeDownloads.map((item) => (
              <div key={item.id} className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.appIcon} 
                      alt={item.appName} 
                      className="w-10 h-10 rounded-xl object-cover bg-[#0A0C10] border border-gray-800"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-white">{item.appName}</h3>
                      <p className="text-xs text-gray-400">v{item.version} • {item.size}</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-green-400">{item.progress}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#0A0C10] rounded-full h-2 overflow-hidden border border-gray-800">
                  <div 
                    className="bg-green-500 h-full rounded-full transition-all duration-300 ease-out shadow-lg shadow-green-500/50"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed Downloads List */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <FolderDown className="w-5 h-5 text-green-400" />
          <span>Completed Downloads ({completedDownloads.length})</span>
        </h2>

        {completedDownloads.length > 0 ? (
          <div className="space-y-3">
            {completedDownloads.map((item) => (
              <div 
                key={item.id}
                className="bg-[#12161F] border border-gray-800 hover:border-gray-600 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img 
                    src={item.appIcon} 
                    alt={item.appName} 
                    className="w-12 h-12 rounded-2xl object-cover bg-[#1A1F2B] border border-gray-800 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://img.icons8.com/color/512/android-os.png';
                    }}
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-white truncate">{item.appName}</h3>
                    <p className="text-xs text-gray-400 truncate">
                      Version {item.version} • {item.size}
                    </p>
                    <span className="text-[10px] text-gray-500">
                      Downloaded {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center gap-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Redownload</span>
                  </a>

                  <button
                    onClick={() => removeDownload(item.id)}
                    className="p-2 text-gray-400 hover:text-rose-400 rounded-xl hover:bg-gray-800 transition-colors"
                    title="Remove from list"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#12161F] border border-gray-800 rounded-3xl p-10 text-center space-y-3">
            <FolderDown className="w-10 h-10 text-gray-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No downloaded APKs yet</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              APKs you download from Aryan App Store will appear here for easy access and re-downloading.
            </p>
          </div>
        )}
      </section>

      {/* Illustrated Installation Guide */}
      <section className="bg-[#12192b] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <span>How to Install APKs on Android (Side-loading)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Follow these simple steps if Android blocks installation from browser or file manager:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 relative">
            <span className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center justify-center">1</span>
            <h3 className="font-bold text-xs text-white">Download APK</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tap 'Download APK' on any app in Aryan App Store to save the binary to your downloads folder.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 relative">
            <span className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center justify-center">2</span>
            <h3 className="font-bold text-xs text-white">Open File Manager</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Open your Android device File Manager or Browser Downloads panel and tap the downloaded file.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 relative">
            <span className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center justify-center">3</span>
            <h3 className="font-bold text-xs text-white">Allow Unknown Apps</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If prompted, tap 'Settings' and enable "Allow installation from this source".
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 relative">
            <span className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center justify-center">4</span>
            <h3 className="font-bold text-xs text-white">Confirm Install</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tap 'Install'. Once completed, launch your new app directly from your app drawer!
            </p>
          </div>

        </div>

      </section>

    </div>
  );
};
