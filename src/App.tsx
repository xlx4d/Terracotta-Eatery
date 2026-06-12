import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  MapPin, 
  Calendar, 
  Plus, 
  ChevronRight, 
  Utensils, 
  Compass, 
  Star, 
  Mail, 
  Phone, 
  Instagram, 
  Facebook, 
  Clock, 
  ThumbsUp, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

import Navbar from './components/Navbar';
import TakeawayCart from './components/TakeawayCart';
import Reservations from './components/Reservations';
import OrderStatusTracker from './components/OrderStatusTracker';
import Reviews from './components/Reviews';
import { MENU_ITEMS } from './data/menu';
import { CartItem, MenuItem } from './types';

export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);

  useEffect(() => {
    async function loadMenu() {
      try {
        const response = await fetch('/api/menu');
        if (response.ok) {
          const fetchedMenu = await response.json();
          if (Array.isArray(fetchedMenu) && fetchedMenu.length > 0) {
            setMenuItems(fetchedMenu);
          }
        }
      } catch (error) {
        console.error('Failed to fetch menu from server API:', error);
      }
    }
    loadMenu();
  }, []);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'starters' | 'mains' | 'desserts' | 'drinks'>('all');
  const [currentTab, setCurrentTab] = useState<'home' | 'menu' | 'reservations' | 'takeaway' | 'tracker' | 'reviews' | 'contact'>('home');
  
  const [activeTrackerOrderId, setActiveTrackerOrderId] = useState<string | null>(null);
  const [activeTrackerReservationId, setActiveTrackerReservationId] = useState<string | null>(null);

  // Cart total calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.id === item.id);
      if (existing) {
        return prevCart.map((c) => 
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prevCart, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
    
    // Quick little visual animation for floating cart
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prevCart) => 
      prevCart.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const scrollToAnchor = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOrderSubmitted = (orderId: string) => {
    setActiveTrackerOrderId(orderId);
    setActiveTrackerReservationId(null);
    setCurrentTab('tracker');
    setTimeout(() => {
      scrollToAnchor('tracker');
    }, 100);
  };

  const handleReservationSubmitted = (resId: string) => {
    setActiveTrackerReservationId(resId);
    setActiveTrackerOrderId(null);
    setCurrentTab('tracker');
    setTimeout(() => {
      scrollToAnchor('tracker');
    }, 100);
  };

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-natural-cream text-natural-dark font-sans selection:bg-natural-sage-bg selection:text-natural-sage-text">
      
      {/* Dynamic Header Utility Panel */}
      <div className="bg-natural-dark text-natural-cream/90 text-[10px] sm:text-xs py-2 px-6 flex justify-between items-center font-mono border-b border-natural-dark/10 tracking-widest uppercase font-bold">
        <div className="flex items-center gap-4 mx-auto sm:mx-0">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-natural-orange" />
            <span>Open Daily: 08:00 - 22:00</span>
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-natural-orange" />
            <span>Plattekloof Village Centre, Cape Town</span>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span>Call: 081 381 0284</span>
        </div>
      </div>

      {/* Navigation */}
      <Navbar 
        cartCount={cartCount} 
        onOpenCart={() => setIsCartOpen(true)}
        onTabChange={(tab) => {
          if (tab === 'takeaway') {
            setCurrentTab('menu');
            scrollToAnchor('menu');
            setIsCartOpen(true);
          } else {
            setCurrentTab(tab as any);
            scrollToAnchor(tab);
          }
        }}
        currentTab={currentTab}
      />

      {/* Hero Section */}
      <header id="home" className="relative bg-stone-900 border-b border-stone-855 min-h-[550px] flex items-center overflow-hidden">
        {/* Background Image overlay with warm terracotta vignette */}
        <div className="absolute inset-0 z-0">
          <img 
            ref={(el) => {
              if (el) el.referrerPolicy = "no-referrer";
            }}
            src="/src/assets/images/terracotta_hero_1781223338355.jpg" 
            alt="Terracotta Eatery Interior" 
            className="w-full h-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-natural-orange/10 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-[#FDFBF7]">
          <div className="max-w-2xl space-y-6">
            
            {/* Quick local badge */}
            <div className="inline-block px-3 py-1 bg-natural-sage-bg text-natural-sage-text text-xs font-extrabold uppercase tracking-widest rounded-md w-fit">
              Plattekloof Village, Cape Town
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif tracking-tight leading-[1.15] text-white">
              Fresh Flavours, <br className="hidden sm:inline" />
              <span className="italic text-natural-orange">Local Comfort,</span> <br />
              Every Visit
            </h1>

            <p className="text-stone-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Discover authentic dining at Terracotta Eatery in Plattekloof Village. Dine in, take away, or order online—quality food made simple.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setCurrentTab('reservations');
                  scrollToAnchor('reservations');
                }}
                className="px-8 py-4 bg-natural-orange hover:bg-natural-orange/95 text-white font-sans font-extrabold rounded-xl text-sm transition-all shadow-lg hover:shadow-xl text-center cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>Reserve Your Table Now</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => {
                  setCurrentTab('menu');
                  scrollToAnchor('menu');
                }}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-sans font-semibold rounded-xl text-sm transition-all text-center cursor-pointer"
              >
                Order Online Today
              </button>
            </div>

            {/* Microcopy specifications */}
            <div className="pt-4 flex items-center gap-6 text-[11px] font-mono text-stone-400">
              <div className="flex items-center gap-1.5">
                <Utensils className="h-3 w-3 text-amber-500" />
                <span>R200–R300 Target Price</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Compass className="h-3 w-3 text-amber-500" />
                <span>Next to Plattekloof Shopping Center</span>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Signature Dishes Grid (Bento Layout) */}
      <section id="signature" className="py-20 bg-natural-cream border-b border-natural-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-natural-orange block mb-2">
              Culinary Accents
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-natural-dark tracking-tight">
              House Specialties & Signatures
            </h2>
            <p className="mt-2 text-natural-dark/70 text-sm md:text-base">
              These three plates capture the rustic terracotta warmth of our kitchen. Made fresh with regional Cape-sourced organic produce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Signature 1 */}
            <div className="bg-white rounded-3xl border border-natural-dark/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="h-56 relative overflow-hidden bg-stone-100">
                  <img 
                    ref={(el) => {
                      if (el) el.referrerPolicy = "no-referrer";
                    }}
                    loading="lazy"
                    src="/src/assets/images/dish_lamb_chop_1781223352655.jpg" 
                    alt="Plattekloof Flame-Grilled Lamb Chops" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-natural-orange text-white px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider">
                    Our No.1 Favorite
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-sans font-bold text-lg text-neutral-900 leading-tight">
                      Flame-Grilled Lamb Chops
                    </h3>
                    <span className="font-serif font-bold text-[#E2725B] text-lg">R240</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    Three double-rib local Karoo chops rubbed in deep terracotta clays and dry spices, flame-charred to medium. Serves with minted house pesto.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 border-t border-natural-dark/5 flex justify-between items-center bg-natural-cream/30">
                <span className="text-[10px] font-mono text-stone-400">Preparation: 20 Mins</span>
                <button
                  onClick={() => handleAddToCart(menuItems.find((m) => m.id === 'm1') || MENU_ITEMS.find((m) => m.id === 'm1')!)}
                  className="px-3.5 py-1.5 bg-natural-dark hover:bg-natural-orange text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Add to Takeaway
                </button>
              </div>
            </div>

            {/* Signature 2 */}
            <div className="bg-white rounded-3xl border border-natural-dark/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="h-56 relative overflow-hidden bg-stone-100">
                  <img 
                    ref={(el) => {
                      if (el) el.referrerPolicy = "no-referrer";
                    }}
                    loading="lazy"
                    src="/src/assets/images/dish_wood_pizza_1781223369034.jpg" 
                    alt="Wood-Fired Mozzarella Sourdough Pizza" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#2C1E1A] text-white px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider">
                    Sourdough Clay Oven
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-sans font-bold text-lg text-neutral-900 leading-tight">
                      Wood-Fired Buffalo Mozzarella Pizza
                    </h3>
                    <span className="font-serif font-bold text-[#E2725B] text-lg">R180</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    Rustic sourdough bases high-fired in our red brick oven. Blistered crusts topped with crushed local heirloom tomatoes and thick melting rounds of buffalo mozzarella.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 border-t border-natural-dark/5 flex justify-between items-center bg-natural-cream/30">
                <span className="text-[10px] font-mono text-stone-400">Preparation: 12 Mins</span>
                <button
                  onClick={() => handleAddToCart(menuItems.find((m) => m.id === 'm2') || MENU_ITEMS.find((m) => m.id === 'm2')!)}
                  className="px-3.5 py-1.5 bg-natural-dark hover:bg-natural-orange text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Add to Takeaway
                </button>
              </div>
            </div>

            {/* Signature 3 */}
            <div className="bg-white rounded-3xl border border-natural-dark/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="h-56 relative overflow-hidden bg-stone-100">
                  <img 
                    ref={(el) => {
                      if (el) el.referrerPolicy = "no-referrer";
                    }}
                    loading="lazy"
                    src="/src/assets/images/dish_malva_pudding_1781223382661.jpg" 
                    alt="Cape Malva Pudding" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-natural-dark text-white px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider">
                    Traditional dessert
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-sans font-bold text-lg text-neutral-900 leading-tight">
                      Warm Cape Malva Pudding
                    </h3>
                    <span className="font-serif font-bold text-[#E2725B] text-lg">R85</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    Baked fresh apricot sponge pudding soaked in traditional hot caramel syrup, resting in custom earthenware, poured with rich, cold vanilla custard.
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0 border-t border-natural-dark/5 flex justify-between items-center bg-natural-cream/30">
                <span className="text-[10px] font-mono text-stone-400">Preparation: 10 Mins</span>
                <button
                  onClick={() => handleAddToCart(menuItems.find((m) => m.id === 'd1') || MENU_ITEMS.find((m) => m.id === 'd1')!)}
                  className="px-3.5 py-1.5 bg-natural-dark hover:bg-natural-orange text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Add to Takeaway
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-natural-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-natural-dark/5 flex flex-col lg:flex-row items-center gap-12 shadow-sm">
            
            <div className="lg:w-1/2 space-y-6">
              <span className="text-xs font-mono font-bold tracking-widest text-natural-orange uppercase block">
                Our Story & Philosophy
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-natural-dark tracking-tight leading-tight">
                Authentic Cape Dining Made Warm and Inviting
              </h2>
              
              <div className="space-y-4 text-stone-600 text-sm sm:text-base leading-relaxed">
                <p>
                  Terracotta Eatery was established in Cape Town's scenic Plattekloof Village to bring locals a comforting, modern approach to casual dining. Combining the rustic, organic atmosphere of handmade terracotta earthenware clay pottery with fresh regional ingredients, we strike a perfect balance between comfort and visual style.
                </p>
                <p>
                  We strive to serve the local community with competitive pricing (<strong className="text-[#2C1E1A]">R200–R300 per person</strong>), making first-rate steaks, wood-fired artisan pizza, and rich Cape curries accessible to families, couples, and shopping precinct visitors.
                </p>
                <p>
                  With expansive vistas over Cape Town and prompt online table bookings and takeaway collection channels, we guarantee a seamless experience from screen to plate.
                </p>
              </div>

              {/* Bento Trust Stats */}
              <div className="pt-6 border-t border-natural-dark/10 grid grid-cols-3 gap-4 text-center font-mono">
                <div>
                  <span className="block text-2xl font-extrabold text-[#E2725B]">4.7★</span>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Google Maps</span>
                </div>
                <div>
                  <span className="block text-2xl font-extrabold text-[#E2725B]">100%</span>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Certified Beef</span>
                </div>
                <div>
                  <span className="block text-2xl font-extrabold text-[#E2725B]">Plattekloof</span>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Locally Rooted</span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              {/* Mosaic Bento Image Stack */}
              <div className="bg-natural-sage-bg/30 rounded-2xl p-4 sm:p-6 border border-natural-dark/5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-[#FAF9F6] h-40 rounded-xl overflow-hidden shadow-sm">
                      <img 
                        ref={(el) => {
                          if (el) el.referrerPolicy = "no-referrer";
                        }}
                        loading="lazy"
                        src="/src/assets/images/dish_wood_pizza_1781223369034.jpg" 
                        alt="Pizza dough cooking" 
                        className="w-full h-full object-cover hover:scale-105 duration-300"
                      />
                    </div>
                    <div className="bg-[#2C1E1A] text-white p-5 rounded-xl border border-stone-850 text-xs font-mono flex flex-col justify-between h-36">
                      <Star className="text-amber-450 h-5 w-5 text-natural-orange" />
                      <p className="italic font-sans text-[11px] leading-relaxed">"The flame-grilled Karoo lamb chops have a crust that is simple yet unmatched."</p>
                      <span className="text-cream/50 font-bold">- Cape Town Foodie</span>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="bg-natural-orange p-6 rounded-xl text-white flex flex-col justify-between h-36">
                      <span className="font-bold text-[10px] uppercase font-mono tracking-widest text-white/80">Venue Capacity</span>
                      <p className="text-2xl font-extrabold font-serif">50 Seats</p>
                      <span className="text-[10px]">Indoors & Scenic Deck</span>
                    </div>
                    <div className="bg-white h-40 rounded-xl overflow-hidden border border-natural-dark/5">
                      <img 
                        ref={(el) => {
                          if (el) el.referrerPolicy = "no-referrer";
                        }}
                        loading="lazy"
                        src="/src/assets/images/terracotta_hero_1781223338355.jpg" 
                        alt="Terracotta interior context" 
                        className="w-full h-full object-cover hover:scale-105 duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Menu Area */}
      <section id="menu" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-natural-orange block mb-2">
              Our Complete Menu
            </span>
            <h2 className="text-3xl font-serif font-extrabold text-natural-dark tracking-tight">
              Explore Our Authentic Plates
            </h2>
            <p className="text-stone-600 text-sm mt-3">
              Add any item directly to your takeaway order shopping cart. Order online for instant kitchen receipt and coordinate pickup at Plattekloof Village.
            </p>
          </div>

          {/* Category Selector Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-10 pb-4 border-b border-natural-dark/10">
            {([
              { id: 'all', label: 'All Dishes' },
              { id: 'starters', label: 'Starters' },
              { id: 'mains', label: 'Mains & Meat' },
              { id: 'desserts', label: 'Sweet Finishes' },
              { id: 'drinks', label: 'Wines & Beverages' }
            ] as const).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider border transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-natural-orange text-white border-natural-orange shadow-md font-extrabold'
                    : 'bg-[#FAF9F6] text-natural-dark/70 border-natural-dark/10 hover:bg-natural-cream'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Food Items List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-3xl p-5 border border-natural-dark/5 flex gap-4 md:gap-5 justify-between shadow-sm relative group hover:border-natural-dark/15 hover:shadow-md transition-all duration-250"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-sans font-bold text-base sm:text-lg text-neutral-900">
                      {item.name}
                    </h3>
                    {item.tag && (
                      <span className="px-2.5 py-0.5 bg-[#F2E8CF] text-[#606C38] text-[9px] font-mono font-extrabold rounded-md uppercase tracking-wider shrink-0">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-550 text-stone-500 leading-relaxed max-w-sm">
                    {item.description}
                  </p>
                  <p className="font-serif text-[#E2725B] text-sm sm:text-base font-extrabold">
                    R{item.price.toFixed(0)}
                  </p>
                </div>

                <div className="flex flex-col justify-between items-end gap-3 shrink-0">
                  {/* Thumbnail if present */}
                  {item.image ? (
                    <div className="h-16 w-16 rounded-xl overflow-hidden bg-stone-200 border border-stone-200/60 shadow-sm hidden sm:block">
                      <img 
                        ref={(el) => {
                          if (el) el.referrerPolicy = "no-referrer";
                        }}
                        loading="lazy"
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-xl bg-orange-100/40 border border-dashed border-orange-200 hidden sm:flex items-center justify-center text-orange-400">
                      <Utensils className="h-5 w-5" />
                    </div>
                  )}

                  <button
                    onClick={() => handleAddToCart(item)}
                    className="p-2 sm:px-3 sm:py-1.5 bg-natural-orange/10 hover:bg-natural-orange text-natural-orange hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    aria-label={`Add ${item.name} to order`}
                  >
                    <Plus className="h-4 w-4 shrink-0 font-extrabold" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Prompt to order */}
          <div className="mt-14 p-6 bg-natural-sage-bg/30 rounded-3xl border border-natural-dark/5 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="font-sans font-bold text-neutral-900 text-sm">Need food packaged in a hurry for coworkers?</h4>
              <p className="text-xs text-stone-500 mt-0.5">Simply fill up your cart, checkout locally, and pay at the Village counter.</p>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-5 py-2.5 bg-natural-orange hover:bg-natural-orange/90 text-white font-sans font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer shrink-0"
            >
              Open Takeaway Checkout ({cartCount} Items)
            </button>
          </div>

        </div>
      </section>

      {/* Online Order Tracker Portal */}
      <OrderStatusTracker 
        initialOrderId={activeTrackerOrderId} 
        initialReservationId={activeTrackerReservationId} 
      />

      {/* Table Reservations Widget & Faq */}
      <Reservations 
        onReservationSuccess={handleReservationSubmitted} 
      />

      {/* Detailed Dining Options section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-natural-orange block mb-2">
              Flexible Formats
            </span>
            <h2 className="text-3xl font-serif font-extrabold text-natural-dark tracking-tight leading-normal">
              Dine In, Takeaway, or Custom Events
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Dine in */}
            <div className="bg-white border border-natural-dark/5 p-6 sm:p-10 rounded-3xl flex flex-col justify-between shadow-sm">
              <div>
                <span className="px-3 py-1 bg-natural-sage-bg text-natural-sage-text text-[10px] font-mono rounded-md font-bold uppercase tracking-wider block w-fit mb-4">
                  Scenic Deck
                </span>
                <h3 className="font-sans font-extrabold text-xl text-stone-900 mb-3">
                  Cape Town Dine-In Vibe
                </h3>
                <p className="text-xs sm:text-sm text-stone-605 text-stone-600 leading-relaxed mb-6">
                  Sit back at a table on our terrace overlooking the Parow/Plattekloof hills. Enjoy Table Mountain views, craft wine options, and warm terracotta pottery serving loops with dedicated service. Suitable for families, corporate lunches, or quiet dates.
                </p>
              </div>
              <button
                onClick={() => {
                  setCurrentTab('reservations');
                  scrollToAnchor('reservations');
                }}
                className="px-5 py-2.5 bg-natural-dark text-white text-xs font-bold rounded-xl w-fit hover:bg-natural-orange transition duration-200 shadow cursor-pointer font-sans"
              >
                Reserve Your Table Now
              </button>
            </div>

            {/* Takeaway */}
            <div className="bg-white border border-natural-dark/5 p-6 sm:p-10 rounded-3xl flex flex-col justify-between shadow-sm">
              <div>
                <span className="px-3 py-1 bg-natural-orange text-white text-[10px] font-mono rounded-md font-bold uppercase tracking-wider block w-fit mb-4">
                  Quick Collection
                </span>
                <h3 className="font-sans font-extrabold text-xl text-stone-900 mb-3">
                  Online Takeaway Pick-Up
                </h3>
                <p className="text-xs sm:text-sm text-stone-605 text-stone-600 leading-relaxed mb-6">
                  On the move in Plattekloof? Explore our menu, drop starters and entrees directly into your portable cart, and check out instantly. Track status from preparation steps till completion in our live portal, then swing by to collect your hot meal.
                </p>
              </div>
              <button
                onClick={() => {
                  setCurrentTab('menu');
                  scrollToAnchor('menu');
                }}
                className="px-5 py-2.5 bg-natural-orange text-white text-xs font-bold rounded-xl w-fit hover:bg-natural-orange/90 transition duration-200 shadow cursor-pointer font-sans"
              >
                Browse Menu & Takeaway
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Faq Section */}
      <section className="py-20 bg-natural-cream border-t border-b border-natural-dark/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-natural-orange block mb-2">
              Common Queries
            </span>
            <h2 className="text-3xl font-serif font-extrabold text-natural-dark tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            
            <div className="bg-white p-6 rounded-3xl border border-natural-dark/5 shadow-sm">
              <h3 className="font-sans font-extrabold text-stone-900 text-sm sm:text-base flex items-center gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-natural-orange" />
                <span>Where exactly is the Eatery located and is there parking?</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2.5 leading-relaxed">
                We are located at Shop 12 inside the Plattekloof Village Shopping Centre, Koeberg Road & Plattekloof Road, Plattekloof, Cape Town. There is plenty of secure, free open-air and basement shopping centre parking directly accessible.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-natural-dark/5 shadow-sm">
              <h3 className="font-sans font-extrabold text-stone-900 text-sm sm:text-base flex items-center gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-natural-orange" />
                <span>Is your menu Halal-friendly?</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2.5 leading-relaxed">
                Yes! All our poultry, lamb, and beef items are sourced strictly from certified Halal local suppliers. No pork or lard is stored or used in any of our culinary processes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-natural-dark/5 shadow-sm">
              <h3 className="font-sans font-extrabold text-stone-900 text-sm sm:text-base flex items-center gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-natural-orange" />
                <span>How does the live online order status tracker work?</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2.5 leading-relaxed">
                Our application integrates a real-time reactive Firestore database connection. When you checkout on this site, we generate a unique token (e.g. `ORD-XT7`). By plugging your token inside the live tracker above, you hook directly into the database status of your meal during frying and cooking! We've also added a demo simulation pane so you can test how the steps transition.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-natural-dark/5 shadow-sm">
              <h3 className="font-sans font-extrabold text-stone-900 text-sm sm:text-base flex items-center gap-2">
                <HelpCircle className="h-4.5 w-4.5 text-natural-orange" />
                <span>How can I cancel or amend a booking?</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2.5 leading-relaxed">
                To cancel your table reservation, search for your unique reservation reference ID under the tracker section. Once retrieved from our database, you will see a cancellation button to instantly free up the slot.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Guest Reviews Section */}
      <Reviews />

      {/* Location & Hours Section (Map Widget) */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-natural-orange block mb-2">
              Find Us
            </span>
            <h2 className="text-3xl font-serif font-extrabold text-natural-dark tracking-tight">
              Location & Contact Details
            </h2>
            <p className="text-stone-600 text-sm mt-3 font-sans">
              We look forward to serving you! Check out our address coordinates and exact coordinates in Cape Town.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Left Address panel */}
            <div className="lg:col-span-4 bg-white border border-natural-dark/5 p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-sm">
              <div className="space-y-6">
                
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-natural-orange mb-2">Location Address</h3>
                  <p className="font-sans font-extrabold text-natural-dark text-base leading-snug">
                    Shop 12, Plattekloof Village Shopping Centre,<br />
                    Koeberg Road & Plattekloof Road,<br />
                    Plattekloof, Cape Town, 7500
                  </p>
                  <span className="text-[11px] text-stone-500 font-mono block mt-1.5">• Conveniently situated next to Plattekloof Point hills.</span>
                </div>

                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-natural-orange mb-2">Direct Contact</h3>
                  <div className="space-y-2 text-sm font-semibold text-stone-800">
                    <p className="flex items-center gap-1.5 font-mono">
                      <Phone className="h-4 w-4 text-natural-orange shrink-0" />
                      <span>081 381 0284</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-natural-orange shrink-0" />
                      <span>hello@terracottaeatery.co.za</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Facebook className="h-4 w-4 text-natural-orange shrink-0" />
                      <a 
                        href="https://www.facebook.com/share/18YXPyuYwe/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-natural-orange transition-colors"
                      >
                        Terracotta Eatery
                      </a>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-natural-orange mb-2">Corporate Bookings</h3>
                  <p className="text-xs text-stone-500 leading-normal">
                    For groups larger than 12 or custom business catering, send us a secure inquiry from the reservations panel above.
                  </p>
                </div>

              </div>
              
              <div className="pt-6 border-t border-natural-dark/10 flex justify-between items-center text-xs text-stone-400 font-mono">
                <span>Terracotta Eatery™</span>
                <span>Est. Cape Town</span>
              </div>
            </div>

            {/* Right Map Image widget block */}
            <div className="lg:col-span-8 bg-stone-900 rounded-2xl overflow-hidden shadow-lg border border-stone-850 flex flex-col justify-between relative min-h-[380px]">
              
              {/* Mockup Map illustration */}
              <div className="absolute inset-0 bg-stone-950/60 z-0 flex items-center justify-center opacity-90">
                
                {/* Visual map styled beautifully in dark theme theme using Tailwind graphics */}
                <div className="relative h-full w-full bg-[#181515] p-6 flex flex-col justify-between overflow-hidden">
                  
                  {/* Grid lines mock */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none border border-stone-100/10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
                  
                  {/* Map Roads vectors */}
                  <div className="absolute top-1/2 left-0 right-0 h-6 bg-stone-700 rotate-2 opacity-50 z-10 flex items-center justify-center">
                    <span className="text-[9px] font-mono font-extrabold uppercase text-stone-400 tracking-widest">Plattekloof Road</span>
                  </div>
                  <div className="absolute top-0 bottom-0 left-1/3 w-6 bg-stone-700 -rotate-3 hover:bg-stone-600 cursor-help transition-all opacity-50 z-10 flex items-center justify-center">
                    <span className="text-[9px] font-mono font-extrabold uppercase text-stone-400 tracking-widest rotate-90">Koeberg Rd</span>
                  </div>
                  
                  {/* Plattekloof village block map marker */}
                  <div className="absolute top-[40%] left-[38%] z-20 flex flex-col items-center">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="h-10 w-10 bg-natural-orange rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white"
                    >
                      <MapPin className="h-5 w-5" />
                    </motion.div>
                    <div className="bg-stone-900 text-white rounded px-2 py-1 mt-1 text-[10px] font-mono font-bold whitespace-nowrap shadow border border-stone-800">
                      Terracotta Eatery (Shop 12)
                    </div>
                  </div>

                  <div className="absolute bottom-[20%] right-[10%] opacity-40 z-10">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">PAROW HILLS</span>
                  </div>

                  <div className="relative z-30 flex items-start justify-between">
                    <span className="text-[10px] font-mono text-stone-500 font-bold bg-stone-900/50 p-2 rounded uppercase tracking-wide">
                      Plattekloof Interactive Map Reference
                    </span>
                    <span className="text-[10px] font-mono text-stone-500 bg-stone-900/50 p-2 rounded uppercase font-bold text-right leading-none">
                      LAT: -33.8824<br />
                      LNG: 18.5739
                    </span>
                  </div>

                  <div className="relative z-35 bg-stone-900/90 text-[#FDFBF7] p-5 rounded-xl border border-stone-800 backdrop-blur-sm shadow flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                    <div className="text-left w-full">
                      <h4 className="text-xs font-mono font-extrabold tracking-wider uppercase text-natural-orange">Need precise directions?</h4>
                      <p className="text-[11px] text-stone-400 leading-normal mt-0.5">
                        We are situated in the shopping galleria directly behind the main Plattekloof Medi-Clinic center. Parking is accessible from either Plattekloof Road or Melkhout St.
                      </p>
                    </div>
                    <a 
                      href="https://maps.google.com/?q=Plattekloof+Village+Shopping+Centre+Cape+Town" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-natural-orange hover:bg-natural-orange/90 text-white text-[11px] font-mono font-extrabold rounded-lg tracking-wider transition-colors shrink-0 text-center uppercase"
                    >
                      Open in Maps
                    </a>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Footer Area */}
      <footer className="bg-stone-950 text-stone-400 py-16 border-t border-stone-900 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            
            {/* Column 1: Brand details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-natural-orange rounded-lg flex items-center justify-center font-bold text-white border border-natural-orange">
                  <span>TE</span>
                </div>
                <span className="font-serif font-bold text-lg text-white leading-none">Terracotta Eatery</span>
              </div>
              <p className="text-stone-500 text-xs leading-relaxed font-sans">
                Authentic, comforting Cape-centric dishes. Bringing the Parow and Plattekloof Village neighborhood quality wood-fired pizza and steaks in modern layout structures.
              </p>
              <div className="flex items-center gap-2 pt-2 text-stone-500 font-mono">
                <span>EST. 2026</span>
                <span>•</span>
                <span>Cape Town</span>
              </div>
            </div>

            {/* Column 2: Quick navigation callbacks. Avoid all '#' links! */}
            <div className="space-y-4">
              <h4 className="font-mono font-bold tracking-wider text-xs uppercase text-white">Eatery Nav</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button 
                    onClick={() => { setCurrentTab('home'); scrollToAnchor('navbar'); }} 
                    className="hover:text-natural-orange transition-colors cursor-pointer"
                  >
                    Main Home Welcome
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setCurrentTab('menu'); scrollToAnchor('menu'); }} 
                    className="hover:text-natural-orange transition-colors cursor-pointer"
                  >
                    Explore Food Menu
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setCurrentTab('reservations'); scrollToAnchor('reservations'); }} 
                    className="hover:text-natural-orange transition-colors cursor-pointer"
                  >
                    Table Booking & Inquiries
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setCurrentTab('tracker'); scrollToAnchor('tracker'); }} 
                    className="hover:text-natural-orange transition-colors cursor-pointer"
                  >
                    Live Status Monitor
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setCurrentTab('reviews'); scrollToAnchor('reviews'); }} 
                    className="hover:text-natural-orange transition-colors cursor-pointer"
                  >
                    Guest Reviews & Words
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Plattekloof specific */}
            <div className="space-y-4">
              <h4 className="font-mono font-bold tracking-wider text-xs uppercase text-white">Locals Corner</h4>
              <div className="space-y-2 text-xs text-stone-500 leading-normal">
                <p>Located easily within the Village precinct Shopping Centre, Parow.</p>
                <p>Secure open access and basement parking bays available free of charge.</p>
                <div className="flex gap-2 pt-2 text-stone-400 font-sans">
                  <a href="https://www.facebook.com/people/Terracotta-Eatery/100072375978236/?rdid=hyHkoSLapt4Ymnoy&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18YXPyuYwe%2F" target="_blank" rel="noopener noreferrer" className="hover:text-natural-orange" aria-label="Facebook">
                    <Facebook className="h-4.5 w-4.5" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-natural-orange" aria-label="Instagram">
                    <Instagram className="h-4.5 w-4.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Column 4: Contact links. Replaced raw links with mock alerts or secure pointers */}
            <div className="space-y-4">
              <h4 className="font-mono font-bold tracking-wider text-xs uppercase text-white">Privacy & Legal</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button 
                    onClick={() => alert("Our Privacy Policy explains how we store reservation and order checkout details on fabled-visitor-g67s8 Firebase servers securely. No commercial PII is sold.")}
                    className="hover:text-natural-orange transition-colors cursor-pointer text-left"
                  >
                    Eatery Privacy Safeguards
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => alert("Our Terms of Service govern table hold policies. Reserved tables are held coordinate for exactly 15 minutes past the slot choice.")}
                    className="hover:text-natural-orange transition-colors cursor-pointer text-left"
                  >
                    Table Booking Terms
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-12 pt-8 border-t border-stone-900 text-center font-mono text-[10px] text-stone-605 text-stone-600 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2026 Terracotta Eatery. Shop 12, Plattekloof Village Shopping Centre, Cape Town. All rights reserved.</p>
            <div className="flex gap-4">
              <span>Halaal Certified</span>
              <span>•</span>
              <span>Firestore Persisted</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Slideout Takeaway Cart Drawer */}
      <TakeawayCart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderSuccess={handleOrderSubmitted}
      />

    </div>
  );
}
