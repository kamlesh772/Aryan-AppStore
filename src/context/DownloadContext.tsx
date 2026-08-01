import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppItem, DownloadHistoryItem } from '../types';
import { incrementDownloadService } from '../services/appService';

interface DownloadContextType {
  downloads: DownloadHistoryItem[];
  activeDownload: DownloadHistoryItem | null;
  startDownload: (app: AppItem) => void;
  clearHistory: () => void;
  removeDownload: (id: string) => void;
  activeCount: number;
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'aryan_appstore_downloads';

export const DownloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [downloads, setDownloads] = useState<DownloadHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeDownload, setActiveDownload] = useState<DownloadHistoryItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(downloads));
    } catch (e) {
      console.warn('Could not save downloads to local storage', e);
    }
  }, [downloads]);

  const startDownload = (app: AppItem) => {
    const downloadId = `dl-${Date.now()}`;
    const newDownloadItem: DownloadHistoryItem = {
      id: downloadId,
      appId: app.id,
      appName: app.name,
      appIcon: app.iconUrl,
      version: app.version,
      size: app.size,
      downloadUrl: app.downloadUrl,
      timestamp: new Date().toISOString(),
      status: 'downloading',
      progress: 5
    };

    setActiveDownload(newDownloadItem);
    setDownloads((prev) => [newDownloadItem, ...prev]);

    // Fire & forget increment in Firestore
    incrementDownloadService(app.id);

    // Simulate progress and trigger download
    let currentProgress = 5;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 25) + 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);

        // Mark completed
        setDownloads((prev) =>
          prev.map((item) =>
            item.id === downloadId
              ? { ...item, status: 'completed', progress: 100 }
              : item
          )
        );
        setActiveDownload(null);

        // Trigger real link download in browser
        triggerFileDownload(app.downloadUrl, `${app.packageName || app.id}-v${app.version}.apk`);
      } else {
        setDownloads((prev) =>
          prev.map((item) =>
            item.id === downloadId
              ? { ...item, progress: currentProgress }
              : item
          )
        );
      }
    }, 300);
  };

  const triggerFileDownload = (url: string, filename: string) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.warn('Direct file download fallback opening tab:', err);
      window.open(url, '_blank');
    }
  };

  const clearHistory = () => {
    setDownloads([]);
  };

  const removeDownload = (id: string) => {
    setDownloads((prev) => prev.filter((item) => item.id !== id));
  };

  const activeCount = downloads.filter((d) => d.status === 'downloading').length;

  return (
    <DownloadContext.Provider value={{
      downloads,
      activeDownload,
      startDownload,
      clearHistory,
      removeDownload,
      activeCount
    }}>
      {children}
    </DownloadContext.Provider>
  );
};

export const useDownloads = () => {
  const context = useContext(DownloadContext);
  if (!context) {
    throw new Error('useDownloads must be used within a DownloadProvider');
  }
  return context;
};
