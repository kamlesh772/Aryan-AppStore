export type AppCategory = 
  | 'Utilities' 
  | 'Productivity' 
  | 'Media & Video' 
  | 'Games' 
  | 'Privacy & Security' 
  | 'Developer & Tools' 
  | 'Communication' 
  | 'Navigation & Maps';

export type AppLicense = 
  | 'GPL-3.0' 
  | 'GPL-2.0'
  | 'MIT' 
  | 'Apache-2.0' 
  | 'BSD-3-Clause' 
  | 'MPL-2.0' 
  | 'AGPL-3.0' 
  | 'Custom Free License';

export interface AppReview {
  id: string;
  appId?: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface AppItem {
  id: string;
  name: string;
  packageName: string;
  developer: string;
  developerWebsite?: string;
  sourceCodeUrl?: string;
  category: AppCategory;
  version: string;
  size: string; // e.g. "18.4 MB"
  license: AppLicense;
  minAndroid: string; // e.g. "Android 8.0+"
  iconUrl: string;
  screenshots: string[];
  shortDescription: string;
  fullDescription: string;
  changelog: string;
  downloadUrl: string; // Direct APK download link
  downloadCount: number;
  rating: number; // e.g. 4.8
  reviewCount: number;
  featured?: boolean;
  isNew?: boolean;
  isVerified?: boolean;
  isPublished?: boolean; // Publish / unpublish flag for admin
  permissions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryInfo {
  id: AppCategory;
  name: string;
  iconName: string;
  description: string;
  color: string;
  bgGradient: string;
}

export interface DownloadHistoryItem {
  id: string;
  appId: string;
  appName: string;
  appIcon?: string;
  version: string;
  size: string;
  downloadUrl?: string;
  timestamp: string;
  status: 'completed' | 'downloading' | 'failed';
  progress?: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'user';
  favorites: string[]; // array of app IDs
  createdAt: string;
  updatedAt: string;
}
