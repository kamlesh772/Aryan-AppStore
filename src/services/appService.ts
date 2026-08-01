import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  query, 
  orderBy, 
  increment,
  writeBatch,
  where
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { AppItem, AppReview, CategoryInfo, UserProfile } from '../types';
import { INITIAL_APPS, CATEGORIES_LIST } from '../data/initialApps';

const APPS_COLLECTION = 'apps';
const CATEGORIES_COLLECTION = 'categories';
const REVIEWS_SUBCOLLECTION = 'reviews';
const DOWNLOADS_COLLECTION = 'downloads';
const USERS_COLLECTION = 'users';

// Fetch categories from Firestore
export async function getCategoriesService(): Promise<CategoryInfo[]> {
  try {
    const snap = await getDocs(collection(db, CATEGORIES_COLLECTION));
    if (snap.empty) {
      console.log('Seeding initial categories to Firestore...');
      const batch = writeBatch(db);
      for (const cat of CATEGORIES_LIST) {
        const ref = doc(db, CATEGORIES_COLLECTION, cat.id);
        batch.set(ref, cat);
      }
      await batch.commit();
      return CATEGORIES_LIST;
    }
    const categories: CategoryInfo[] = [];
    snap.forEach((docSnap) => {
      categories.push(docSnap.data() as CategoryInfo);
    });
    return categories;
  } catch (err) {
    console.warn('Using local categories list as fallback:', err);
    return CATEGORIES_LIST;
  }
}

// Fetch apps from Firestore. Options: includeUnpublished for admin view
export async function getAppsService(includeUnpublished: boolean = false): Promise<AppItem[]> {
  try {
    const querySnapshot = await getDocs(collection(db, APPS_COLLECTION));
    if (querySnapshot.empty) {
      console.log('Firestore apps collection empty. Auto-seeding initial apps...');
      await seedInitialAppsService();
      
      // Try fetching again after seed
      try {
        const reSnap = await getDocs(collection(db, APPS_COLLECTION));
        if (!reSnap.empty) {
          const seededApps: AppItem[] = [];
          reSnap.forEach((docSnap) => {
            const data = docSnap.data() as AppItem;
            const appItem: AppItem = {
              ...data,
              id: docSnap.id,
              isPublished: data.isPublished !== undefined ? data.isPublished : true,
            };
            if (includeUnpublished || appItem.isPublished !== false) {
              seededApps.push(appItem);
            }
          });
          if (seededApps.length > 0) {
            return seededApps.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          }
        }
      } catch (reErr) {
        console.warn('Failed to refetch after seed, using local initial apps:', reErr);
      }

      return INITIAL_APPS.map(a => ({ ...a, isPublished: true }));
    }
    
    const apps: AppItem[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as AppItem;
      const appItem: AppItem = {
        ...data,
        id: docSnap.id,
        isPublished: data.isPublished !== undefined ? data.isPublished : true,
      };
      
      if (includeUnpublished || appItem.isPublished !== false) {
        apps.push(appItem);
      }
    });
    
    // Sort by createdAt descending
    return apps.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } catch (err) {
    console.warn('Error querying Firestore apps collection, using initial open-source apps fallback:', err);
    return INITIAL_APPS.map(a => ({ ...a, isPublished: true }));
  }
}

// Seed initial open-source apps into Firestore
export async function seedInitialAppsService(): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const app of INITIAL_APPS) {
      const appRef = doc(db, APPS_COLLECTION, app.id);
      batch.set(appRef, {
        ...app,
        isPublished: true,
        createdAt: app.createdAt || new Date().toISOString(),
        updatedAt: app.updatedAt || new Date().toISOString()
      });
    }
    await batch.commit();
    console.log('Successfully seeded 20 initial apps into Firestore!');
  } catch (err) {
    console.warn('Error seeding apps into Firestore:', err);
  }
}

// Add new application item
export async function addAppService(newApp: Omit<AppItem, 'id' | 'createdAt' | 'updatedAt' | 'downloadCount' | 'rating' | 'reviewCount'>): Promise<AppItem> {
  const now = new Date().toISOString();
  const id = newApp.packageName 
    ? newApp.packageName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() 
    : `app-${Date.now()}`;
  
  const fullApp: AppItem = {
    ...newApp,
    id,
    downloadCount: 0,
    rating: 5.0,
    reviewCount: 1,
    isPublished: newApp.isPublished !== undefined ? newApp.isPublished : true,
    createdAt: now,
    updatedAt: now
  };

  try {
    await setDoc(doc(db, APPS_COLLECTION, id), fullApp);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${APPS_COLLECTION}/${id}`);
  }
  return fullApp;
}

// Update existing app item
export async function updateAppService(id: string, updatedFields: Partial<AppItem>): Promise<void> {
  const now = new Date().toISOString();
  const dataToUpdate = {
    ...updatedFields,
    updatedAt: now
  };

  try {
    const appRef = doc(db, APPS_COLLECTION, id);
    await updateDoc(appRef, dataToUpdate);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${APPS_COLLECTION}/${id}`);
  }
}

// Delete app item
export async function deleteAppService(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, APPS_COLLECTION, id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${APPS_COLLECTION}/${id}`);
  }
}

// Toggle published state
export async function togglePublishAppService(id: string, currentStatus: boolean): Promise<boolean> {
  const newStatus = !currentStatus;
  await updateAppService(id, { isPublished: newStatus });
  return newStatus;
}

// Increment app download count and record download event in downloads collection
export async function incrementDownloadService(appInput: AppItem | string, userId?: string): Promise<void> {
  const appId = typeof appInput === 'string' ? appInput : appInput.id;
  try {
    const appRef = doc(db, APPS_COLLECTION, appId);
    await updateDoc(appRef, {
      downloadCount: increment(1)
    });

    // Record in downloads collection
    const downloadRecord = {
      id: `dl-${Date.now()}`,
      appId: appId,
      appName: typeof appInput === 'string' ? 'Android App' : appInput.name,
      userId: userId || 'anonymous',
      version: typeof appInput === 'string' ? '1.0' : appInput.version,
      size: typeof appInput === 'string' ? 'APK' : appInput.size,
      timestamp: new Date().toISOString()
    };
    await setDoc(doc(db, DOWNLOADS_COLLECTION, downloadRecord.id), downloadRecord);
  } catch (err) {
    console.warn('Could not record download in Firestore:', err);
  }
}

// Fetch reviews for an app
export async function getReviewsService(appId: string): Promise<AppReview[]> {
  try {
    const reviewsRef = collection(db, APPS_COLLECTION, appId, REVIEWS_SUBCOLLECTION);
    const q = query(reviewsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const reviews: AppReview[] = [];
    querySnapshot.forEach((docSnap) => {
      reviews.push({
        id: docSnap.id,
        ...docSnap.data()
      } as AppReview);
    });
    
    if (reviews.length === 0) {
      return [
        {
          id: 'rev-default-1',
          appId,
          userName: 'FOSS Enthusiast',
          rating: 5,
          comment: 'Clean open-source build! Works smoothly without any ads or telemetry.',
          createdAt: new Date().toISOString()
        }
      ];
    }
    return reviews;
  } catch (err) {
    return [
      {
        id: 'rev-default-1',
        appId,
        userName: 'FOSS Enthusiast',
        rating: 5,
        comment: 'Clean open-source build! Works smoothly without any ads or telemetry.',
        createdAt: new Date().toISOString()
      }
    ];
  }
}

// Submit a new review
export async function addReviewService(appId: string, review: Omit<AppReview, 'id' | 'createdAt'>, currentApp: AppItem): Promise<AppReview> {
  const now = new Date().toISOString();
  const reviewData = {
    ...review,
    appId,
    createdAt: now
  };

  try {
    const reviewsRef = collection(db, APPS_COLLECTION, appId, REVIEWS_SUBCOLLECTION);
    const docRef = await addDoc(reviewsRef, reviewData);
    
    // Recalculate rating
    const currentCount = currentApp.reviewCount || 1;
    const currentRating = currentApp.rating || 5.0;
    const newCount = currentCount + 1;
    const newRating = Number((((currentRating * currentCount) + review.rating) / newCount).toFixed(1));

    // Update parent app doc
    const appRef = doc(db, APPS_COLLECTION, appId);
    await updateDoc(appRef, {
      rating: newRating,
      reviewCount: newCount
    });

    return {
      id: docRef.id,
      ...reviewData
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${APPS_COLLECTION}/${appId}/reviews`);
    return {
      id: `rev-${Date.now()}`,
      ...reviewData
    };
  }
}

// User Profile & Favorites Management
export async function getUserProfileService(uid: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    return null;
  }
}

export async function createOrUpdateUserProfileService(profile: UserProfile): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, profile.uid);
    await setDoc(userRef, profile, { merge: true });
  } catch (err) {
    console.warn('Error updating user profile in Firestore:', err);
  }
}

export async function toggleUserFavoriteService(uid: string, appId: string, currentFavorites: string[]): Promise<string[]> {
  const exists = currentFavorites.includes(appId);
  const updatedFavorites = exists
    ? currentFavorites.filter(id => id !== appId)
    : [...currentFavorites, appId];

  if (uid) {
    try {
      const userRef = doc(db, USERS_COLLECTION, uid);
      await updateDoc(userRef, {
        favorites: updatedFavorites,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Failed to persist user favorites to Firestore:', err);
    }
  }
  return updatedFavorites;
}
