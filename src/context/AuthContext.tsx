import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInAnonymously, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { UserProfile } from '../types';
import { 
  getUserProfileService, 
  createOrUpdateUserProfileService, 
  toggleUserFavoriteService 
} from '../services/appService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  favorites: string[];
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, displayName?: string) => Promise<void>;
  loginAsDemoAdmin: (passcode: string) => boolean;
  toggleFavorite: (appId: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isDemoAdmin, setIsDemoAdmin] = useState<boolean>(() => {
    return localStorage.getItem('aryan_appstore_admin') === 'true';
  });
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('aryan_appstore_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch or initialize user profile in Firestore
        let profile = await getUserProfileService(currentUser.uid);
        const isAdminUser = currentUser.email === 'aryanjain772@gmail.com' || isDemoAdmin;
        
        if (!profile) {
          profile = {
            uid: currentUser.uid,
            email: currentUser.email || 'user@example.com',
            displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
            photoURL: currentUser.photoURL || '',
            role: isAdminUser ? 'admin' : 'user',
            favorites: favorites,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await createOrUpdateUserProfileService(profile);
        } else if (profile.favorites && profile.favorites.length > 0) {
          setFavorites(profile.favorites);
          localStorage.setItem('aryan_appstore_favorites', JSON.stringify(profile.favorites));
        }
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isDemoAdmin]);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Google Auth Error:', err);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = async (email: string, pass: string, displayName?: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    const newProfile: UserProfile = {
      uid: res.user.uid,
      email: res.user.email || email,
      displayName: displayName || email.split('@')[0],
      role: email === 'aryanjain772@gmail.com' ? 'admin' : 'user',
      favorites: favorites,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await createOrUpdateUserProfileService(newProfile);
    setUserProfile(newProfile);
  };

  const loginAsDemoAdmin = (passcode: string): boolean => {
    if (passcode === 'admin123' || passcode === 'aryan123' || passcode === 'admin') {
      setIsDemoAdmin(true);
      localStorage.setItem('aryan_appstore_admin', 'true');
      return true;
    }
    return false;
  };

  const toggleFavorite = async (appId: string) => {
    const updated = await toggleUserFavoriteService(user?.uid || '', appId, favorites);
    setFavorites(updated);
    localStorage.setItem('aryan_appstore_favorites', JSON.stringify(updated));
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        favorites: updated
      });
    }
  };

  const logout = async () => {
    setIsDemoAdmin(false);
    localStorage.removeItem('aryan_appstore_admin');
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const isAdmin = isDemoAdmin || userProfile?.role === 'admin' || user?.email === 'aryanjain772@gmail.com';

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      isAdmin,
      loading,
      favorites,
      loginWithGoogle,
      loginWithEmail,
      registerWithEmail,
      loginAsDemoAdmin,
      toggleFavorite,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
