import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Download, Star, ShieldCheck, CheckCircle2, 
  ExternalLink, Code, Globe, MessageSquare, Send, Sparkles, X, ChevronRight, ChevronLeft, Heart
} from 'lucide-react';
import { AppItem, AppReview } from '../types';
import { useDownloads } from '../context/DownloadContext';
import { useAuth } from '../context/AuthContext';
import { getReviewsService, addReviewService } from '../services/appService';

interface AppDetailsPageProps {
  app: AppItem;
  allApps: AppItem[];
  onBack: () => void;
  onSelectApp: (app: AppItem) => void;
}

export const AppDetailsPage: React.FC<AppDetailsPageProps> = ({
  app,
  allApps,
  onBack,
  onSelectApp
}) => {
  const { startDownload } = useDownloads();
  const { favorites, toggleFavorite, user } = useAuth();
  const [reviews, setReviews] = useState<AppReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // New review form
  const [userName, setUserName] = useState(user?.displayName || '');
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const isFav = favorites.includes(app.id);

  useEffect(() => {
    let mounted = true;
    async function fetchReviews() {
      setLoadingReviews(true);
      const revs = await getReviewsService(app.id);
      if (mounted) {
        setReviews(revs);
        setLoadingReviews(false);
      }
    }
    fetchReviews();
    return () => { mounted = false; };
  }, [app.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim() || !userName.trim()) return;

    setSubmittingReview(true);
    const newRev = await addReviewService(
      app.id,
      {
        userName: userName.trim(),
        userAvatar: user?.photoURL || '',
        userId: user?.uid,
        rating: userRating,
        comment: userComment.trim()
      },
      app
    );

    setReviews([newRev, ...reviews]);
    setSubmittingReview(false);
    setReviewSuccess(true);
    setUserComment('');
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  const relatedApps = allApps
    .filter((a) => a.id !== app.id && (a.category === app.category || a.license === app.license))
    .slice(0, 3);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-green-400 font-semibold text-sm transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Store</span>
      </button>

      {/* Main App Header Box */}
      <div className="bg-[#12161F] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            
            {/* App Icon */}
            <div className="relative flex-shrink-0">
              <img 
                src={app.iconUrl} 
                alt={app.name} 
                className="w-20 h-20 md:w-24 md:h-24 rounded-3xl object-cover bg-[#1A1F2B] border border-gray-800 shadow-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://img.icons8.com/color/512/android-os.png';
                }}
              />
              {app.isVerified && (
                <span className="absolute -bottom-1 -right-1 bg-[#0A0C10] rounded-full p-1 text-green-400 shadow-md" title="Verified Open Source">
                  <CheckCircle2 className="w-5 h-5 fill-green-500/20 text-green-400" />
                </span>
              )}
            </div>

            {/* Info */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-green-500/10 text-green-400 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-green-500/30">
                  {app.license}
                </span>
                <span className="bg-[#1A1F2B] text-gray-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-gray-700">
                  {app.category}
                </span>
                {app.isPublished === false && (
                  <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    Unpublished Draft
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                {app.name}
              </h1>

              <p className="text-xs md:text-sm text-gray-300 font-medium">
                Developer: <strong className="text-green-400">{app.developer}</strong>
              </p>

              <p className="text-xs text-gray-400 font-mono">
                Package: {app.packageName}
              </p>
            </div>
          </div>

          {/* Download & Favorite Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 w-full">
              <button
                onClick={() => startDownload(app)}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-black font-extrabold px-6 py-3.5 rounded-2xl shadow-xl shadow-green-500/20 transition-all active:scale-95 text-sm"
              >
                <Download className="w-5 h-5" />
                <span>Download APK ({app.size})</span>
              </button>

              <button
                onClick={() => toggleFavorite(app.id)}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isFav 
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' 
                    : 'bg-[#1A1F2B] border-gray-800 text-gray-400 hover:text-white'
                }`}
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <span className="text-[11px] text-gray-400 text-center md:text-right font-medium">
              Free & Direct Mirror • No Google Play required
            </span>
          </div>

        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-gray-800 text-center">
          <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-3">
            <div className="flex items-center justify-center gap-1 text-amber-400 font-extrabold text-lg">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{(app.rating || 5.0).toFixed(1)}</span>
            </div>
            <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
              {reviews.length || app.reviewCount || 1} Reviews
            </div>
          </div>

          <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-3">
            <div className="font-extrabold text-white text-lg">
              {(app.downloadCount || 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
              Downloads
            </div>
          </div>

          <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-3">
            <div className="font-extrabold text-green-400 text-lg">
              v{app.version}
            </div>
            <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
              Latest Version
            </div>
          </div>

          <div className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-3">
            <div className="font-extrabold text-gray-200 text-lg">
              {app.minAndroid}
            </div>
            <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
              Min Android
            </div>
          </div>
        </div>

      </div>

      {/* Screenshots Gallery Carousel */}
      {app.screenshots && app.screenshots.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-400" />
            <span>App Screenshots</span>
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-800">
            {app.screenshots.map((src, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxIndex(idx)}
                className="flex-shrink-0 w-64 md:w-80 h-44 md:h-52 rounded-2xl overflow-hidden border border-gray-800 hover:border-green-500/50 cursor-pointer shadow-lg transition-transform hover:scale-102 bg-[#12161F]"
              >
                <img 
                  src={src} 
                  alt={`${app.name} screenshot ${idx + 1}`} 
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && app.screenshots && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button 
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => setLightboxIndex((lightboxIndex - 1 + app.screenshots.length) % app.screenshots.length)}
            className="absolute left-4 text-white p-2 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <img 
            src={app.screenshots[lightboxIndex]} 
            alt="Screenshot preview"
            className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl object-contain"
          />

          <button 
            onClick={() => setLightboxIndex((lightboxIndex + 1) % app.screenshots.length)}
            className="absolute right-4 text-white p-2 rounded-full bg-gray-800 hover:bg-gray-700"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* App Overview & What's New */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Description & Changelog */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Full Description */}
          <div className="bg-[#12161F] border border-gray-800 rounded-3xl p-6 space-y-3">
            <h2 className="text-lg font-extrabold text-white">About this app</h2>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
              {app.fullDescription}
            </p>
          </div>

          {/* Changelog */}
          {app.changelog && (
            <div className="bg-[#12161F] border border-gray-800 rounded-3xl p-6 space-y-2">
              <h2 className="text-base font-extrabold text-green-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>What's New in Version {app.version}</span>
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line font-mono">
                {app.changelog}
              </p>
            </div>
          )}

          {/* User Reviews Section */}
          <div className="bg-[#12161F] border border-gray-800 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-400" />
                <span>User Ratings & Reviews</span>
              </h2>
              <span className="text-xs text-gray-400 font-semibold">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
            </div>

            {/* Review Form */}
            <form onSubmit={handleReviewSubmit} className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-gray-200">Submit Your Review</h3>

              {reviewSuccess && (
                <div className="p-2.5 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-xs font-semibold">
                  ✓ Review submitted! Saved to Firestore.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-[#0A0C10] border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1">Star Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="p-1 focus:outline-none"
                      >
                        <Star className={`w-5 h-5 ${star <= userRating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 mb-1">Comment *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Share your experience with this app..."
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  className="w-full bg-[#0A0C10] border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-green-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittingReview ? 'Posting...' : 'Post Review'}</span>
              </button>
            </form>

            {/* Existing Reviews List */}
            <div className="space-y-3">
              {loadingReviews ? (
                <p className="text-xs text-gray-400">Loading reviews...</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{rev.userName}</span>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {rev.comment}
                    </p>
                    <div className="text-[10px] text-gray-500 font-medium">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* Right Column: Technical Specifications & Links */}
        <div className="space-y-6">
          
          <div className="bg-[#12161F] border border-gray-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>App Information</span>
            </h2>

            <dl className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Package Name</dt>
                <dd className="text-white font-mono">{app.packageName}</dd>
              </div>

              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">License</dt>
                <dd className="text-green-400 font-semibold">{app.license}</dd>
              </div>

              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Version</dt>
                <dd className="text-white font-semibold">{app.version}</dd>
              </div>

              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Download Size</dt>
                <dd className="text-white">{app.size}</dd>
              </div>

              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Min Android</dt>
                <dd className="text-white">{app.minAndroid}</dd>
              </div>

              <div className="flex justify-between border-b border-gray-800 pb-2">
                <dt className="text-gray-400">Updated</dt>
                <dd className="text-white">{new Date(app.updatedAt).toLocaleDateString()}</dd>
              </div>
            </dl>

            {/* External Links */}
            <div className="pt-2 space-y-2">
              {app.sourceCodeUrl && (
                <a
                  href={app.sourceCodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full bg-[#1A1F2B] hover:bg-gray-800 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-gray-200 font-semibold transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-green-400" />
                    Source Code Repository
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </a>
              )}

              {app.developerWebsite && (
                <a
                  href={app.developerWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full bg-[#1A1F2B] hover:bg-gray-800 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-gray-200 font-semibold transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-400" />
                    Developer Website
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                </a>
              )}
            </div>

            {/* Permissions List */}
            {app.permissions && app.permissions.length > 0 && (
              <div className="pt-2">
                <h3 className="text-xs font-bold text-gray-300 mb-2">Required Permissions</h3>
                <div className="flex flex-wrap gap-1.5">
                  {app.permissions.map((perm) => (
                    <span key={perm} className="bg-[#1A1F2B] border border-gray-800 text-gray-400 text-[10px] font-mono px-2 py-0.5 rounded">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Related Apps Row */}
      {relatedApps.length > 0 && (
        <section className="space-y-3 pt-4">
          <h2 className="text-lg font-extrabold text-white">Similar Open Source Apps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedApps.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectApp(rel)}
                className="bg-[#12161F] hover:border-gray-600 border border-gray-800 rounded-2xl p-4 cursor-pointer transition-all flex items-center gap-3"
              >
                <img 
                  src={rel.iconUrl} 
                  alt={rel.name} 
                  className="w-12 h-12 rounded-xl object-cover bg-[#1A1F2B] border border-gray-800"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://img.icons8.com/color/512/android-os.png';
                  }}
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-white truncate">{rel.name}</h3>
                  <p className="text-xs text-gray-400 truncate">{rel.developer}</p>
                  <span className="text-[10px] text-green-400 font-semibold">{rel.license}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
