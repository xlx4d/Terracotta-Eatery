import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingBag, MapPin, Calendar, Clock } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onTabChange: (tab: 'home' | 'menu' | 'reservations' | 'takeaway' | 'tracker' | 'reviews' | 'contact') => void;
  currentTab: string;
}

export default function Navbar({ cartCount, onOpenCart, onTabChange, currentTab }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Our Menu' },
    { id: 'reservations', label: 'Reservations' },
    { id: 'takeaway', label: 'Takeaway' },
    { id: 'tracker', label: 'Track Order' },
    { id: 'reviews', label: 'Guest Reviews' },
    { id: 'contact', label: 'Location & Hours' },
  ];

  const handleNavClick = (id: 'home' | 'menu' | 'reservations' | 'takeaway' | 'tracker' | 'reviews' | 'contact') => {
    onTabChange(id);
    setIsOpen(false);
    
    // Smooth scroll to segment or section if it is on the same page
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav id="navbar" className="sticky top-0 z-50 bg-natural-cream/95 backdrop-blur-md border-b border-natural-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="h-9 w-9 bg-natural-orange rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-serif font-bold text-xs uppercase italic">TE</span>
            </div>
            <div>
              <span className="block font-sans font-extrabold tracking-tight text-lg text-natural-dark uppercase">
                Terracotta Eatery
              </span>
              <span className="block text-[10px] font-mono text-natural-orange tracking-widest uppercase font-bold">
                Plattekloof Village
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id as any)}
                className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  currentTab === item.id
                    ? 'text-natural-orange bg-natural-sage-bg/40 font-extrabold shadow-sm'
                    : 'text-natural-dark/80 hover:text-natural-orange hover:bg-natural-cream/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Utility Tag for Desktop */}
            <div className="hidden lg:flex items-center text-xs font-mono bg-natural-sage-bg text-natural-sage-text px-3 py-1.5 rounded-full gap-1.5 font-bold uppercase">
              <MapPin className="h-3 w-3 text-natural-sage-text" />
              <span>Plattekloof Point</span>
            </div>

            {/* Shopping Cart button */}
            <button
              id="cart-button"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full text-natural-dark hover:text-natural-orange hover:bg-natural-sage-bg/30 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-6 w-6 stroke-[1.75]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-natural-orange text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-natural-cream animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 rounded-full text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-stone-200 bg-white"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as any)}
                  className={`block w-full text-left px-4 py-3 rounded-lg text-base font-bold transition-colors ${
                    currentTab === item.id
                      ? 'text-natural-orange bg-natural-sage-bg/30 font-extrabold'
                      : 'text-natural-dark/90 hover:text-natural-orange hover:bg-natural-cream/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 px-4 border-t border-natural-dark/10 flex flex-col gap-2 font-mono text-xs text-natural-dark/60 font-bold uppercase">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-natural-orange" />
                  <span>Plattekloof Shopping Centre</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-natural-orange" />
                  <span>Mon - Sun: 08:00 - 22:00</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
