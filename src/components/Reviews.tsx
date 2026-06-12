import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  Check, 
  Sparkles, 
  Plus, 
  X, 
  ChevronDown, 
  Filter, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { createReview, subscribeToReviews, simulateReviewReply } from '../db/firebase';
import { Review } from '../types';

// Let's seed the exact real Google reviews provided by the user
const GOOGLE_SEED_REVIEWS: Review[] = [
  {
    id: 'SEED-1',
    name: 'Louis Van Staden',
    rating: 5,
    comment: 'Beautiful new restaurant. Food and service was great. One of my new favourite breakfast spots.',
    tags: ['eggs benedict', 'Breakfast'],
    mealType: 'Breakfast',
    ownerResponse: "Thank you for your kind feedback, Louis! We can't wait to welcome you back for another great breakfast experience soon!",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // a month ago
    isSeed: true
  },
  {
    id: 'SEED-2',
    name: 'Tamzin Petersen',
    rating: 5,
    comment: 'Great experience! My boyfriend and I arrived and were greeted by a staff member that was serving another customer, common decency. She made the time to pause and say hello to let us in. The hostess guided us to our table and we were served with excellence.',
    tags: ['the menu', 'décor'],
    mealType: 'Dinner',
    ownerResponse: 'Thank you so much for this amazing review. We look forward to seeing you again real soon.',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // a month ago
    isSeed: true
  },
  {
    id: 'SEED-3',
    name: 'Werner Gerber',
    rating: 4,
    comment: 'There is definite potential, but still quite a few kinks to iron out. We visited on a rainy Sunday and, unfortunately, the coffee machine was already struggling, but the food is promising.',
    tags: ['potential', 'the menu'],
    mealType: 'Breakfast',
    ownerResponse: 'Hi there, thank you for the detailed and honest feedback. We sincerely apologise for the delays and the issues you experienced during your visit. Unfortunately, we did have an unexpected coffee machine issue that day, but we understand the frustration.',
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    isSeed: true
  },
  {
    id: 'SEED-4',
    name: 'Jason Phillip',
    rating: 5,
    comment: 'Awesome experience here!!! Attended the event of 20 people over here, everything was perfect, food, aesthetics and staff service!! catering for halaal was probably one of the best decision they could have made.',
    tags: ['halal', 'décor'],
    mealType: 'Lunch',
    ownerResponse: 'Hi Jason, thank you so much for your wonderful review! We’re absolutely delighted to hear everything was perfect.',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    isSeed: true
  },
  {
    id: 'SEED-5',
    name: 'Caleb Zeeman',
    rating: 5,
    comment: 'I will admit, I was concerned when I saw that Greens was changing hands, but I am glad to say the fears were unfounded! Most of the original staff is still there, and the food is as good as ever! The menu is quite a bit smaller than before.',
    tags: ['the menu'],
    mealType: 'Lunch',
    ownerResponse: 'Thank you so much for the support and kind feedback! We’re really happy to hear that you’ve still had a great experience with us and that the team and food have continued to deliver. Looking forward to welcoming you back again soon!',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    isSeed: true
  },
  {
    id: 'SEED-6',
    name: 'JJ Engelbrecht',
    rating: 5,
    comment: 'Spotless and Clean dining area, lovely outside area. The effort and planning that goes into the meals shows in every plate.',
    tags: ['décor'],
    mealType: 'Lunch',
    ownerResponse: 'Thank you so much for the kind words and support! It means a lot to our team to hear such positive feedback. Hope to welcome you back again soon.',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    isSeed: true
  },
  {
    id: 'SEED-7',
    name: 'Carolann Rutter',
    rating: 4,
    comment: 'Popped in to see the new Terracotta this morning for coffee. Vibe good, music a bit too loud for my liking and not tasteful music playing. Music Not accompanying the setting. Coffee cappuccinos itself were perfect.',
    tags: ['décor', 'potential'],
    mealType: 'Breakfast',
    ownerResponse: 'Hi there, thank you for the honest feedback. I’m glad you enjoyed the vibe overall. I completely understand your comments regarding the music and service, and I’ll definitely address it with the team.',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    isSeed: true
  },
  {
    id: 'SEED-8',
    name: 'Sempre Espresso',
    rating: 5,
    comment: 'Absolutely delicious. Pulled lamb brioche. Nice atmosphere too and great staff.',
    tags: ['lamb', 'brioche', 'décor'],
    mealType: 'Lunch',
    ownerResponse: 'Hi Sempre, Thank you so much for the lovely review! We’re so happy to hear you enjoyed the lamb brioche.',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks ago
    isSeed: true
  },
  {
    id: 'SEED-9',
    name: 'Nabila',
    rating: 5,
    comment: 'Lovely service and good food. So happy that they have catered to a halal diet.',
    tags: ['halal'],
    mealType: 'Dinner',
    ownerResponse: 'Hi Nabila, Thank you so much for your lovely 5-star review! We’re delighted to hear that you liked our options.',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    isSeed: true
  },
  {
    id: 'SEED-10',
    name: 'Amber Bierman',
    rating: 5,
    comment: 'What a beautiful space! The design is really something special. Friendly staff and delicious breakfast. Highly recommend.',
    tags: ['décor', 'Breakfast'],
    mealType: 'Breakfast',
    ownerResponse: 'Hi Amber, Thank you so much for the lovely review! We’re thrilled to hear you enjoyed the space!',
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    isSeed: true
  },
  {
    id: 'SEED-11',
    name: 'Steve Roberts',
    rating: 3,
    comment: 'My 1st time at terracotta, very disappointed. A very small menu unless you like Macon lamb. You advertise a traditional Benedict - I have never heard of Macon lamb on an eggs benedict.',
    tags: ['eggs benedict', 'lamb', 'the menu'],
    mealType: 'Breakfast',
    ownerResponse: 'Hi Steve, Thank you for taking the time to share your feedback. We’re truly sorry to hear that the Macon lamb twist on our benedict wasn’t to your liking.',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    isSeed: true
  },
  {
    id: 'SEED-12',
    name: 'Robyn Cook',
    rating: 5,
    comment: 'Terracotta is a refreshing addition to Cape Town’s dining scene and an instant standout for anyone who loves Mediterranean cuisine. From the moment you walk in, the atmosphere sets the tone. The decor is warm, stylish, and thoughtfully put together.',
    tags: ['mediterranean', 'décor'],
    mealType: 'Dinner',
    ownerResponse: 'Thank you so much for your positive feedback! We look forward to welcoming you back soon!',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    isSeed: true
  },
  {
    id: 'SEED-13',
    name: 'Edie Hutchison',
    rating: 5,
    comment: 'We went here for our May book club meet up and everyone had a wonderful time! It was super easy to book, the waitstaff were attentive and friendly, the coffee was divine and the food was delicious! I had the Creamy Tomato Toast.',
    tags: ['the menu', 'Breakfast'],
    mealType: 'Breakfast',
    ownerResponse: 'Hi Edie, Thank you so much for your wonderful review! We were delighted to host your book club meeting.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // a week ago
    isSeed: true
  }
];

export default function Reviews() {
  const [dbReviews, setDbReviews] = useState<Review[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>(GOOGLE_SEED_REVIEWS);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtering & Sorting State
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');
  
  // Interactive Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: '',
    mealType: 'Breakfast' as 'Breakfast' | 'Lunch' | 'Dinner' | 'Other',
    selectedTags: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Live simulation interaction state
  const [replyReviewId, setReplyReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const handleAiGenerateResponse = async () => {
    const selectedReview = allReviews.find(r => r.id === replyReviewId);
    if (!selectedReview) return;
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/reviews/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedReview.name,
          rating: selectedReview.rating,
          comment: selectedReview.comment,
        }),
      });
      const data = await res.json();
      if (data.responseText) {
        setReplyText(data.responseText);
      }
    } catch (err) {
      console.error('AI Reply Drafting error:', err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Available Filter Tags from Google Analytics list
  const filterChips = [
    { id: 'All', label: 'All Reviews', count: 0 },
    { id: 'eggs benedict', label: 'Eggs Benedict', count: 4 },
    { id: 'brioche', label: 'Brioche', count: 2 },
    { id: 'décor', label: 'Décor', count: 3 },
    { id: 'halal', label: 'Halaal-friendly', count: 2 },
    { id: 'lamb', label: 'Macon Lamb', count: 4 },
    { id: 'mediterranean', label: 'Mediterranean', count: 2 },
    { id: 'the menu', label: 'The Menu', count: 4 },
    { id: 'potential', label: 'Potential', count: 3 },
  ];

  // Subscribe to real-time Firestore updates
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToReviews(
      (newData) => {
        setDbReviews(newData);
        setIsLoading(false);
      },
      (err) => {
        console.error('Failed to load reviews from Firestore, using fallback seed reviews.', err);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Merge local seeds with database reviews
  useEffect(() => {
    // filter out any duplicates if there's any overlaps, although seeds are distinct
    const merged = [...dbReviews, ...GOOGLE_SEED_REVIEWS];
    setAllReviews(merged);
  }, [dbReviews]);

  // Compute calculated statistics
  const totalCount = allReviews.length;
  const averageRating = (
    allReviews.reduce((sum, r) => sum + r.rating, 0) / (totalCount || 1)
  ).toFixed(1);

  const starPercentages = [5, 4, 3, 2, 1].map((star) => {
    const count = allReviews.filter((r) => Math.round(r.rating) === star).length;
    return {
      star,
      count,
      percentage: Math.round((count / (totalCount || 1)) * 100)
    };
  });

  // Filter and Sort the display reviews
  const filteredReviews = allReviews
    .filter((rev) => {
      if (selectedTag === 'All') return true;
      const t = selectedTag.toLowerCase();
      // Match keywords inside comment or tags array
      const matchesText = rev.comment.toLowerCase().includes(t);
      const matchesTags = rev.tags?.some((tag) => tag.toLowerCase() === t);
      return matchesText || matchesTags;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      if (sortBy === 'newest') {
        return dateB - dateA;
      } else if (sortBy === 'highest') {
        const diff = b.rating - a.rating;
        return diff !== 0 ? diff : dateB - dateA;
      } else {
        const diff = a.rating - b.rating;
        return diff !== 0 ? diff : dateB - dateA;
      }
    });

  // Handle Review Submission
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) {
      setSubmitError('Please fill in your name and comment before submitting.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const writeData = {
        name: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment,
        mealType: newReview.mealType,
        tags: newReview.selectedTags,
      };

      const docId = await createReview(writeData);
      setSubmitSuccess(`Thank you, ${newReview.name}! Your review has been saved securely to Firestore. reference reference ${docId}`);
      
      // Reset form
      setNewReview({
        name: '',
        rating: 5,
        comment: '',
        mealType: 'Breakfast',
        selectedTags: []
      });
      
      // Auto close modal shortly
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(null);
      }, 3000);

    } catch (err: any) {
      setSubmitError('An error occurred while saving your review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle dynamic tags on the creation form
  const handleToggleTagOnForm = (tagLabel: string) => {
    setNewReview((prev) => {
      const active = prev.selectedTags.includes(tagLabel);
      if (active) {
        return { ...prev, selectedTags: prev.selectedTags.filter((t) => t !== tagLabel) };
      } else {
        return { ...prev, selectedTags: [...prev.selectedTags, tagLabel] };
      }
    });
  };

  // Handle Simulated Owner Reply
  const handleOwnerReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyReviewId || !replyText.trim()) return;

    setIsReplying(true);
    try {
      await simulateReviewReply(replyReviewId, replyText);
      setReplyText('');
      setReplyReviewId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsReplying(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const formattedDate = (isoString?: string) => {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Recent / Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <section id="reviews" className="py-24 bg-[#FAF9F6] border-t border-natural-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-natural-orange block mb-2.5">
            Wall of Love & Guest Words
          </span>
          <h2 className="text-4xl font-serif font-extrabold text-natural-dark tracking-tight leading-none">
            What Plattekloof Thinks of Terracotta
          </h2>
          <p className="text-stone-600 text-sm mt-4 font-sans leading-relaxed">
            Real guest reviews pasted from our Cape Town Google Maps listing. Leave your feedback directly to help us grow.
          </p>
        </div>

        {/* Rating Metrics & Star Distribution Box */}
        <div className="bg-white rounded-3xl border border-natural-dark/5 p-6 sm:p-10 shadow-sm max-w-4xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Average circle display */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-natural-dark/10 pb-6 md:pb-0 md:pr-8">
            <span className="font-serif text-6xl font-extrabold text-[#2C1E1A]">{averageRating}</span>
            <div className="flex gap-1 my-2.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  className={`h-5 w-5 ${
                    s <= Math.round(parseFloat(averageRating))
                      ? 'fill-natural-orange text-natural-orange' 
                      : 'text-stone-200 fill-stone-100'
                  }`} 
                />
              ))}
            </div>
            <span className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider">
              Based on {totalCount} total reviews
            </span>
            
            <button
              id="btn-leave-review-main"
              onClick={() => setIsModalOpen(true)}
              className="mt-6 px-5 py-3 bg-natural-orange hover:bg-natural-orange/90 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow cursor-pointer font-sans"
            >
              <Plus className="h-4 w-4" />
              <span>Leave a Review</span>
            </button>
          </div>

          {/* Star bars and distribution */}
          <div className="md:col-span-8 space-y-2.5">
            <h3 className="text-xs font-mono font-bold text-[#2C1E1A] uppercase tracking-wider mb-4">Rating Breakdown</h3>
            {starPercentages.map((item) => (
              <div key={item.star} className="flex items-center gap-3 text-xs sm:text-sm">
                <span className="font-mono font-bold w-12 text-stone-500 text-left shrink-0">
                  {item.star} {item.star === 1 ? 'star' : 'stars'}
                </span>
                <div className="flex-1 h-2.5 bg-[#FAF9F6] rounded-full overflow-hidden border border-natural-dark/5">
                  <div 
                    className="h-full bg-natural-orange rounded-full transition-all duration-500" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-stone-400 w-10 text-right font-bold">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Live Filter Chips from real Google analytics tags listed by user */}
        <div className="mb-10 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3 text-stone-500 text-xs font-mono uppercase font-bold">
            <Filter className="h-3.5 w-3.5 text-natural-orange" />
            <span>Keyword Filters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterChips.map((chip) => {
              // Calculate actual dynamic count in current reviews list
              const actualCount = chip.id === 'All' 
                ? totalCount 
                : allReviews.filter(r => r.comment.toLowerCase().includes(chip.id.toLowerCase()) || r.tags?.some(t => t.toLowerCase() === chip.id.toLowerCase())).length;
              
              const isSelected = selectedTag === chip.id;

              return (
                <button
                  key={chip.id}
                  onClick={() => setSelectedTag(chip.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-sans font-bold transition-all border shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-natural-dark text-white border-natural-dark shadow-sm'
                      : 'bg-white text-stone-605 text-stone-600 border-natural-dark/5 hover:border-natural-dark/15 hover:bg-white'
                  }`}
                >
                  <span className="capitalize">{chip.label}</span>
                  <span className={`ml-1.5 font-mono text-[10px] ${isSelected ? 'text-white/80' : 'text-natural-orange font-bold'}`}>
                    ({actualCount || chip.count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sorting Toggles */}
        <div className="max-w-5xl mx-auto flex items-center justify-between pb-6 border-b border-natural-dark/10 mb-8 text-xs sm:text-sm text-stone-500 font-mono">
          <span className="font-bold uppercase tracking-wider text-stone-400">Showing {filteredReviews.length} reviews</span>
          <div className="flex items-center gap-2 font-bold uppercase">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-natural-dark/5 text-stone-850 px-2 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider cursor-pointer focus:outline-none focus:ring-1 focus:ring-natural-orange"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>
        </div>

        {/* Database load overlay if loading */}
        {isLoading ? (
          <div className="text-center py-20 max-w-md mx-auto space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-natural-orange mx-auto" />
            <p className="text-xs font-mono text-stone-400 uppercase tracking-widest animate-pulse">Syncing reviews from Firestore...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <AnimatePresence mode="popLayout">
              {filteredReviews.map((rev) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  key={rev.id}
                  id={`review-${rev.id}`}
                  className="bg-white border border-natural-dark/5 p-6 sm:p-8 rounded-3xl shadow-sm hover:border-natural-dark/15 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Review Header card details */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-natural-sage-bg/60 border border-natural-sage-text/10 rounded-full flex items-center justify-center text-natural-sage-text font-serif font-bold text-xs uppercase shadow-inner">
                          {getInitials(rev.name)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-sans font-extrabold text-stone-900 text-sm sm:text-base leading-none">
                              {rev.name}
                            </span>
                            {!rev.isSeed && (
                              <span className="px-1.5 py-0.5 bg-orange-100 text-natural-orange text-[8px] font-mono font-bold rounded uppercase tracking-wider shrink-0">
                                Real customer
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-wide block mt-1">
                            {rev.mealType || 'Meal type'}: {rev.isSeed ? 'Google Guide' : 'Eatery Guest'}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block bg-[#FAF9F6] px-2 py-1 rounded">
                        {formattedDate(rev.createdAt)}
                      </span>
                    </div>

                    {/* Star Rating display */}
                    <div className="flex gap-0.5 mb-3.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`h-4.5 w-4.5 ${
                            s <= rev.rating
                              ? 'fill-natural-orange text-natural-orange' 
                              : 'text-stone-200 fill-stone-100'
                          }`} 
                        />
                      ))}
                    </div>

                    {/* Review text */}
                    <p className="text-stone-605 text-stone-600 font-sans text-xs sm:text-sm leading-relaxed mb-4 whitespace-pre-line font-medium italic">
                      "{rev.comment}"
                    </p>

                    {/* Tags associated */}
                    {rev.tags && rev.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {rev.tags.map((tg) => (
                          <span 
                            key={tg} 
                            onClick={() => setSelectedTag(tg)}
                            className="px-2 py-0.5 bg-[#F2E8CF] text-[#606C38] hover:bg-[#606C38] hover:text-white transition-colors cursor-pointer text-[9px] font-mono font-bold rounded-md uppercase tracking-wider"
                          >
                            #{tg}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reply container or add response button */}
                  <div className="mt-4 pt-4 border-t border-natural-dark/5">
                    {rev.ownerResponse ? (
                      <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-natural-dark/5 text-[11px] sm:text-xs">
                        <div className="flex items-center gap-1.5 mb-1.5 text-natural-orange font-mono font-bold uppercase tracking-wider scale-95 origin-left">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Response from Owner</span>
                        </div>
                        <p className="text-stone-550 text-stone-500 leading-relaxed font-serif italic text-left">
                          "{rev.ownerResponse}"
                        </p>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            setReplyReviewId(rev.id);
                            setReplyText('');
                          }}
                          className="px-3.5 py-1.5 bg-natural-sage-bg/40 hover:bg-natural-sage-bg border border-natural-sage-text/10 text-natural-sage-text text-[10px] font-mono font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Sparkles className="h-3 w-3 text-natural-orange animate-pulse" />
                          <span>Simulate Owner Reply</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredReviews.length === 0 && (
              <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-natural-dark/5">
                <AlertCircle className="h-8 w-8 text-natural-orange mx-auto mb-2" />
                <p className="text-sm font-sans font-bold text-stone-800">No reviews found matching keyword "{selectedTag}".</p>
                <button
                  onClick={() => setSelectedTag('All')}
                  className="mt-3 text-xs font-mono font-bold text-natural-orange underline uppercase cursor-pointer"
                >
                  Clear filter and see all reviews
                </button>
              </div>
            )}
          </div>
        )}

        {/* Live Simulator Reply Drawer Modal */}
        <AnimatePresence>
          {replyReviewId && (
            <div className="fixed inset-0 z-55 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white border border-[#2C1E1A]/15 rounded-3xl shadow-xl w-full max-w-md p-6 relative"
              >
                <button 
                  onClick={() => setReplyReviewId(null)}
                  className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
                >
                  <X className="h-5 w-5" />
                </button>
                
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4.5 w-4.5 text-natural-orange" />
                  <h3 className="font-sans font-extrabold text-neutral-900 text-base uppercase font-mono tracking-wider">
                    Simulate Live Database reply
                  </h3>
                </div>
                
                <p className="text-[11px] text-stone-500 mb-4 leading-normal font-sans">
                  Instantly append an owner response to this document inside our Firestore collection. Watch changes replicate automatically.
                </p>

                <form onSubmit={handleOwnerReplySubmit} className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                        Your owner reply message
                      </label>
                      <button
                        type="button"
                        onClick={handleAiGenerateResponse}
                        disabled={isAiGenerating}
                        className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-[10px] font-mono font-bold rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <Sparkles className="h-3 w-3 text-purple-600 animate-pulse" />
                        <span>{isAiGenerating ? 'AI Drafting...' : 'AI Generate Reply'}</span>
                      </button>
                    </div>
                    <textarea
                      required
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="e.g., Thank you so much for the feedback! We will definitely look into the service speeds..."
                      className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-natural-orange"
                    />
                  </div>
                  
                  <div className="flex gap-2.5">
                    <button
                      type="submit"
                      disabled={isReplying}
                      className="flex-1 py-2.5 bg-natural-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-natural-orange transition duration-200 disabled:opacity-50 cursor-pointer text-center font-sans"
                    >
                      {isReplying ? 'Updating doc...' : 'Submit Response ✔'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyReviewId(null)}
                      className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-700 font-sans"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Create Review Slide-up Card Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-55 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="bg-white border border-[#2C1E1A]/10 rounded-3xl shadow-xl w-full max-w-lg p-6 sm:p-8 relative my-8"
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-50"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="mb-6 text-center sm:text-left">
                  <h3 className="font-serif font-extrabold text-[#2C1E1A] text-2xl tracking-tight leading-none mb-1.5">
                    Write an Honest Review
                  </h3>
                  <p className="text-xs text-stone-500 font-sans">
                    Tell us what you liked (or what we can improve!). Your response will persist to our Firestore database live.
                  </p>
                </div>

                {submitSuccess && (
                  <div className="p-4 bg-emerald-55 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 text-xs sm:text-sm mb-6 flex items-start gap-2.5">
                    <Check className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                    <span>{submitSuccess}</span>
                  </div>
                )}

                {submitError && (
                  <div className="p-4 bg-rose-50 text-rose-850 rounded-2xl border border-rose-100 text-xs sm:text-sm mb-6 flex items-start gap-2.5">
                    <X className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        value={newReview.name}
                        onChange={(e) => setNewReview((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Jean-Luc"
                        className="w-full text-xs font-sans border border-stone-200 bg-stone-50 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-natural-orange font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400 mb-1.5">
                        Meal Type Experience
                      </label>
                      <select
                        value={newReview.mealType}
                        onChange={(e) => setNewReview((prev) => ({ ...prev, mealType: e.target.value as any }))}
                        className="w-full text-xs font-sans border border-stone-200 bg-stone-50 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-natural-orange font-medium"
                      >
                        <option value="Breakfast">Breakfast & Coffee</option>
                        <option value="Lunch">Lunch & Social</option>
                        <option value="Dinner">Dinner & Steaks</option>
                        <option value="Other">Afternoon Cakes</option>
                      </select>
                    </div>
                  </div>

                  {/* Rating Selector */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400 mb-2">
                      Review Rating *
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview((prev) => ({ ...prev, rating: star }))}
                          className="p-1 cursor-pointer transition-transform active:scale-90"
                        >
                          <Star
                            className={`h-7 w-7 ${
                              star <= newReview.rating
                                ? 'fill-natural-orange text-natural-orange'
                                : 'text-stone-200 fill-stone-50'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-3 font-mono text-xs text-natural-orange font-bold uppercase">
                        {newReview.rating === 5 ? 'Excellent 🌟' : newReview.rating === 4 ? 'Very Good 👍' : newReview.rating === 3 ? 'Average' : newReview.rating === 2 ? 'Disappointing' : 'Poor'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400 mb-1.5">
                      Your Comments / Feedback *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={newReview.comment}
                      onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                      placeholder="Tell us about the pizza bases, the local service, or Macon details..."
                      className="w-full text-xs font-sans border border-stone-200 bg-stone-50 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-natural-orange leading-relaxed"
                    />
                  </div>

                  {/* Tag Association Selection */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400 mb-2">
                      Check associated keywords to tag
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {filterChips
                        .filter((c) => c.id !== 'All')
                        .map((chip) => {
                          const isChecked = newReview.selectedTags.includes(chip.id);
                          return (
                            <button
                              key={chip.id}
                              type="button"
                              onClick={() => handleToggleTagOnForm(chip.id)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest border transition-all cursor-pointer ${
                                isChecked
                                  ? 'bg-natural-orange border-natural-orange text-white font-bold'
                                  : 'bg-stone-50 text-stone-500 border-stone-200 hover:border-stone-300'
                              }`}
                            >
                              {chip.label}
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-natural-dark/15 flex gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-natural-orange text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-natural-orange/95 disabled:opacity-40 cursor-pointer text-center select-none font-sans"
                    >
                      {isSubmitting ? 'Posting to Firestore...' : 'Post Review ✔'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-3 bg-[#FAF9F6] border border-natural-dark/10 text-natural-dark text-xs font-bold rounded-xl font-sans"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
