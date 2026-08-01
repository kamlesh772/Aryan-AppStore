import React, { useState, useEffect } from 'react';
import { X, Save, ShieldCheck, Upload, Check, Globe, Code, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { AppItem, AppCategory, AppLicense } from '../types';
import { CATEGORIES_LIST } from '../data/initialApps';

interface AdminAppModalProps {
  isOpen: boolean;
  appToEdit?: AppItem | null;
  onClose: () => void;
  onSave: (appData: any, isEdit: boolean) => Promise<void>;
}

export const AdminAppModal: React.FC<AdminAppModalProps> = ({
  isOpen,
  appToEdit,
  onClose,
  onSave
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    packageName: '',
    developer: '',
    developerWebsite: '',
    sourceCodeUrl: '',
    category: 'Utilities' as AppCategory,
    version: '1.0.0',
    size: '15 MB',
    license: 'GPL-3.0' as AppLicense,
    minAndroid: 'Android 6.0+',
    iconUrl: '',
    screenshots: '',
    shortDescription: '',
    fullDescription: '',
    changelog: '',
    downloadUrl: '',
    featured: false,
    isVerified: true,
    isPublished: true,
    permissions: 'INTERNET, WRITE_EXTERNAL_STORAGE'
  });

  useEffect(() => {
    if (appToEdit) {
      setFormData({
        name: appToEdit.name || '',
        packageName: appToEdit.packageName || '',
        developer: appToEdit.developer || '',
        developerWebsite: appToEdit.developerWebsite || '',
        sourceCodeUrl: appToEdit.sourceCodeUrl || '',
        category: appToEdit.category || 'Utilities',
        version: appToEdit.version || '1.0.0',
        size: appToEdit.size || '15 MB',
        license: appToEdit.license || 'GPL-3.0',
        minAndroid: appToEdit.minAndroid || 'Android 6.0+',
        iconUrl: appToEdit.iconUrl || '',
        screenshots: appToEdit.screenshots ? appToEdit.screenshots.join('\n') : '',
        shortDescription: appToEdit.shortDescription || '',
        fullDescription: appToEdit.fullDescription || '',
        changelog: appToEdit.changelog || '',
        downloadUrl: appToEdit.downloadUrl || '',
        featured: !!appToEdit.featured,
        isVerified: appToEdit.isVerified !== undefined ? appToEdit.isVerified : true,
        isPublished: appToEdit.isPublished !== undefined ? appToEdit.isPublished : true,
        permissions: appToEdit.permissions ? appToEdit.permissions.join(', ') : 'INTERNET'
      });
    } else {
      setFormData({
        name: '',
        packageName: '',
        developer: '',
        developerWebsite: '',
        sourceCodeUrl: '',
        category: 'Utilities',
        version: '1.0.0',
        size: '15 MB',
        license: 'GPL-3.0',
        minAndroid: 'Android 6.0+',
        iconUrl: 'https://img.icons8.com/color/512/android-os.png',
        screenshots: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=1200&q=80',
        shortDescription: '',
        fullDescription: '',
        changelog: 'Initial store release.',
        downloadUrl: '',
        featured: false,
        isVerified: true,
        isPublished: true,
        permissions: 'INTERNET, WRITE_EXTERNAL_STORAGE'
      });
    }
  }, [appToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle Icon File Upload
  const handleIconFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, iconUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Screenshot File Upload
  const handleScreenshotFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileList = Array.from(files) as File[];
      fileList.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          setFormData(prev => ({
            ...prev,
            screenshots: prev.screenshots ? `${prev.screenshots}\n${dataUrl}` : dataUrl
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const screenshotsArray = formData.screenshots
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const permissionsArray = formData.permissions
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      screenshots: screenshotsArray.length ? screenshotsArray : ['https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=1200&q=80'],
      permissions: permissionsArray
    };

    try {
      await onSave(payload, !!appToEdit);
      onClose();
    } catch (err) {
      console.error('Error saving app:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#12161F] border border-gray-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-gray-800 pb-4 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {appToEdit ? 'Edit App Metadata' : 'Add New App to Firestore'}
            </h3>
            <p className="text-xs text-gray-400">Configure APK download URL, screenshots, and publish status</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">App Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Signal Messenger"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#1A1F2B] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Package Name *</label>
              <input
                type="text"
                required
                placeholder="org.thoughtcrime.securesms"
                value={formData.packageName}
                onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                className="w-full bg-[#1A1F2B] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as AppCategory })}
                className="w-full bg-[#1A1F2B] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
              >
                {CATEGORIES_LIST.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">License *</label>
              <select
                value={formData.license}
                onChange={(e) => setFormData({ ...formData, license: e.target.value as AppLicense })}
                className="w-full bg-[#1A1F2B] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
              >
                <option value="GPL-3.0">GPL-3.0</option>
                <option value="MIT">MIT</option>
                <option value="Apache-2.0">Apache-2.0</option>
                <option value="BSD-3-Clause">BSD-3-Clause</option>
                <option value="MPL-2.0">MPL-2.0</option>
                <option value="AGPL-3.0">AGPL-3.0</option>
                <option value="Custom Free License">Custom Free License</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Version *</label>
              <input
                type="text"
                required
                placeholder="1.0.0"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="w-full bg-[#1A1F2B] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Size *</label>
              <input
                type="text"
                required
                placeholder="18.5 MB"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full bg-[#1A1F2B] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Developer *</label>
              <input
                type="text"
                required
                placeholder="Developer / Org Name"
                value={formData.developer}
                onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                className="w-full bg-[#1A1F2B] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Min Android</label>
              <input
                type="text"
                placeholder="Android 6.0+"
                value={formData.minAndroid}
                onChange={(e) => setFormData({ ...formData, minAndroid: e.target.value })}
                className="w-full bg-[#1A1F2B] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Save Direct APK Download URL *</label>
            <input
              type="url"
              required
              placeholder="https://github.com/org/repo/releases/download/v1.0/app.apk"
              value={formData.downloadUrl}
              onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
              className="w-full bg-[#1A1F2B] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 font-mono text-xs"
            />
          </div>

          {/* App Icon Upload / URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-300">Upload Icon or Enter Icon URL *</label>
            <div className="flex items-center gap-3">
              {formData.iconUrl && (
                <img 
                  src={formData.iconUrl} 
                  alt="Icon Preview" 
                  className="w-10 h-10 rounded-xl object-cover border border-gray-800 bg-[#1A1F2B]"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://img.icons8.com/color/512/android-os.png'; }}
                />
              )}
              <input
                type="text"
                required
                placeholder="Icon URL (e.g. https://domain.com/icon.png)"
                value={formData.iconUrl}
                onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                className="flex-1 bg-[#1A1F2B] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-green-500"
              />
              <label className="bg-[#1A1F2B] hover:bg-gray-800 border border-gray-800 text-gray-300 text-xs font-bold px-3 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5 text-green-400" />
                <span>Upload</span>
                <input type="file" accept="image/*" onChange={handleIconFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Screenshots Upload / URLs */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-300">Upload Screenshots or Enter URLs (One per line)</label>
              <label className="text-xs text-green-400 hover:underline cursor-pointer flex items-center gap-1 font-semibold">
                <Upload className="w-3.5 h-3.5" />
                <span>Add Local Screenshot Files</span>
                <input type="file" accept="image/*" multiple onChange={handleScreenshotFileUpload} className="hidden" />
              </label>
            </div>
            <textarea
              rows={2}
              placeholder="https://example.com/screenshot1.png&#10;https://example.com/screenshot2.png"
              value={formData.screenshots}
              onChange={(e) => setFormData({ ...formData, screenshots: e.target.value })}
              className="w-full bg-[#1A1F2B] border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-green-500 font-mono"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Short Description *</label>
            <input
              type="text"
              required
              placeholder="Brief tagline overview"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full bg-[#1A1F2B] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Full Description *</label>
            <textarea
              required
              rows={3}
              placeholder="Detailed app features and technical notes..."
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              className="w-full bg-[#1A1F2B] border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
            ></textarea>
          </div>

          {/* Toggles: Published, Featured, Verified */}
          <div className="flex flex-wrap items-center gap-6 pt-2 bg-[#1A1F2B] p-3 rounded-2xl border border-gray-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 rounded text-green-500 focus:ring-green-500 bg-[#0A0C10] border-gray-800"
              />
              <span className="text-xs font-bold text-white flex items-center gap-1">
                {formData.isPublished ? <Eye className="w-3.5 h-3.5 text-green-400" /> : <EyeOff className="w-3.5 h-3.5 text-amber-400" />}
                <span>Published (Visible to Store Users)</span>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded text-green-500 focus:ring-green-500 bg-[#0A0C10] border-gray-800"
              />
              <span className="text-xs font-semibold text-gray-300">Feature on Hero Banner</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isVerified}
                onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                className="w-4 h-4 rounded text-green-500 focus:ring-green-500 bg-[#0A0C10] border-gray-800"
              />
              <span className="text-xs font-semibold text-gray-300">Verified Open Source</span>
            </label>
          </div>

          <div className="pt-4 border-t border-gray-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-gray-400 hover:text-white font-semibold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-400 text-black font-extrabold px-6 py-2.5 rounded-xl shadow-lg shadow-green-500/20 text-sm transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving to Firestore...' : appToEdit ? 'Update App' : 'Publish App'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
