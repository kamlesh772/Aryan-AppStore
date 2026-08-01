import React, { useState } from 'react';
import { 
  ShieldCheck, Plus, Edit3, Trash2, RefreshCw, Search, 
  Sparkles, Lock, KeyRound, ExternalLink, Eye, EyeOff, CheckCircle2
} from 'lucide-react';
import { AppItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { togglePublishAppService } from '../services/appService';

interface AdminPageProps {
  apps: AppItem[];
  onOpenAddModal: () => void;
  onOpenEditModal: (app: AppItem) => void;
  onDeleteApp: (id: string) => Promise<void>;
  onSeedApps: () => Promise<void>;
  onRefreshApps: () => Promise<void>;
  onSelectApp: (app: AppItem) => void;
  openLoginModal: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  apps,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteApp,
  onSeedApps,
  onRefreshApps,
  onSelectApp,
  openLoginModal
}) => {
  const { isAdmin, logout } = useAuth();
  const [searchFilter, setSearchFilter] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  if (!isAdmin) {
    return (
      <div className="bg-[#12161F] border border-gray-800 rounded-3xl p-10 md:p-16 text-center max-w-lg mx-auto my-12 space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-3xl bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center mx-auto shadow-lg">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Admin Authentication Required</h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            Log in as administrator to manage the store catalog, add new apps, edit metadata, or publish/unpublish entries.
          </p>
        </div>

        <div className="p-3 bg-[#1A1F2B] border border-gray-800 rounded-2xl text-xs text-gray-400">
          Demo Admin Passcode: <code className="text-green-400 font-bold font-mono">admin123</code>
        </div>

        <button
          onClick={openLoginModal}
          className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-full shadow-lg shadow-green-500/20 transition-all text-sm flex items-center justify-center gap-2"
        >
          <KeyRound className="w-4 h-4" />
          <span>Login to Admin Dashboard</span>
        </button>
      </div>
    );
  }

  const filteredApps = apps.filter((app) => {
    const q = searchFilter.toLowerCase();
    return !q || app.name.toLowerCase().includes(q) || app.packageName.toLowerCase().includes(q) || app.developer.toLowerCase().includes(q);
  });

  const totalDownloads = apps.reduce((sum, a) => sum + (a.downloadCount || 0), 0);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this app from Firestore?')) {
      setDeletingId(id);
      await onDeleteApp(id);
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (app: AppItem) => {
    setTogglingId(app.id);
    await togglePublishAppService(app.id, !!app.isPublished);
    await onRefreshApps();
    setTogglingId(null);
  };

  const handleSeed = async () => {
    if (window.confirm('This will seed initial open-source apps into Firestore if missing. Proceed?')) {
      setSeeding(true);
      await onSeedApps();
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Admin Header */}
      <div className="bg-[#12161F] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-0.5 rounded-full border border-green-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Mode Active
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Store Catalog Management
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time synchronization powered by Firebase Firestore
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenAddModal}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-extrabold px-4 py-2.5 rounded-full shadow-lg shadow-green-500/20 transition-all text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New App</span>
          </button>

          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center justify-center gap-1.5 bg-[#1A1F2B] hover:bg-gray-800 text-gray-300 border border-gray-800 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-colors"
            title="Seed initial apps into Firestore"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin text-green-400' : ''}`} />
            <span className="hidden md:inline">{seeding ? 'Seeding...' : 'Seed Apps'}</span>
          </button>

          <button
            onClick={logout}
            className="bg-[#1A1F2B] hover:bg-rose-950 text-rose-400 border border-gray-800 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Admin Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#12161F] border border-gray-800 rounded-2xl p-4">
          <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Apps</div>
          <div className="text-2xl font-extrabold text-white mt-1">{apps.length}</div>
        </div>

        <div className="bg-[#12161F] border border-gray-800 rounded-2xl p-4">
          <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider font-mono">Published</div>
          <div className="text-2xl font-extrabold text-green-400 mt-1">{apps.filter(a => a.isPublished !== false).length}</div>
        </div>

        <div className="bg-[#12161F] border border-gray-800 rounded-2xl p-4">
          <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider font-mono">Unpublished</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{apps.filter(a => a.isPublished === false).length}</div>
        </div>

        <div className="bg-[#12161F] border border-gray-800 rounded-2xl p-4">
          <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Downloads</div>
          <div className="text-2xl font-extrabold text-teal-400 mt-1">{totalDownloads.toLocaleString()}</div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#12161F] border border-gray-800 rounded-3xl p-6 space-y-4 shadow-xl overflow-hidden">
        
        {/* Table Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search catalog by title, package or developer..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-[#1A1F2B] border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-green-500"
          />
        </div>

        {/* Apps Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">App Info</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">License</th>
                <th className="py-3 px-3">Version</th>
                <th className="py-3 px-3">Downloads</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-[#1A1F2B]/50 transition-colors">
                  
                  {/* App Info */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={app.iconUrl} 
                        alt={app.name} 
                        className="w-10 h-10 rounded-xl object-cover bg-[#0A0C10] border border-gray-800 flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://img.icons8.com/color/512/android-os.png';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-white flex items-center gap-1.5 truncate">
                          <span className="truncate">{app.name}</span>
                          {app.featured && (
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" title="Featured" />
                          )}
                        </div>
                        <div className="text-[10px] text-gray-400 truncate font-mono">{app.packageName}</div>
                      </div>
                    </div>
                  </td>

                  {/* Status Toggle Badge */}
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleTogglePublish(app)}
                      disabled={togglingId === app.id}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                        app.isPublished !== false
                          ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30'
                      }`}
                      title="Click to toggle published / unpublished status"
                    >
                      {app.isPublished !== false ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Unpublished</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3">
                    <span className="bg-[#1A1F2B] border border-gray-800 text-gray-300 px-2 py-0.5 rounded font-semibold">
                      {app.category}
                    </span>
                  </td>

                  {/* License */}
                  <td className="py-3 px-3">
                    <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded font-semibold">
                      {app.license}
                    </span>
                  </td>

                  {/* Version */}
                  <td className="py-3 px-3 font-mono text-gray-300">
                    v{app.version} ({app.size})
                  </td>

                  {/* Downloads */}
                  <td className="py-3 px-3 font-bold text-green-400">
                    {(app.downloadCount || 0).toLocaleString()}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectApp(app)}
                        className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
                        title="View Details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onOpenEditModal(app)}
                        className="p-1.5 text-gray-400 hover:text-green-400 rounded-lg hover:bg-gray-800"
                        title="Edit App"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(app.id)}
                        disabled={deletingId === app.id}
                        className="p-1.5 text-gray-400 hover:text-rose-400 rounded-lg hover:bg-gray-800"
                        title="Delete App"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
