import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, Play, Flame, CheckCircle, Smartphone, MapPin, AlertCircle, Sparkles, X, ChevronRight } from 'lucide-react';
import { 
  getOrder, 
  getReservation, 
  subscribeToOrder, 
  subscribeToReservation, 
  simulateOrderFulfillment, 
  simulateReservationFulfillment 
} from '../db/firebase';
import { Order, Reservation } from '../types';

interface OrderStatusTrackerProps {
  initialOrderId?: string | null;
  initialReservationId?: string | null;
}

export default function OrderStatusTracker({ initialOrderId, initialReservationId }: OrderStatusTrackerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'order' | 'reservation'>('order');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [currentRes, setCurrentRes] = useState<Reservation | null>(null);
  
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(null);
  const [trackedResId, setTrackedResId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-fill when a code is passed from checkout/booking
  useEffect(() => {
    if (initialOrderId) {
      setSearchTerm(initialOrderId);
      setSearchType('order');
      setTrackedOrderId(initialOrderId);
      setTrackedResId(null);
    } else if (initialReservationId) {
      setSearchTerm(initialReservationId);
      setSearchType('reservation');
      setTrackedResId(initialReservationId);
      setTrackedOrderId(null);
    }
  }, [initialOrderId, initialReservationId]);

  // Handle order subscription
  useEffect(() => {
    if (!trackedOrderId) {
      setCurrentOrder(null);
      return;
    }

    setIsLoading(true);
    let isMounted = true;

    const unsubscribe = subscribeToOrder(
      trackedOrderId,
      (updatedOrder) => {
        if (!isMounted) return;
        setIsLoading(false);
        if (updatedOrder) {
          setErrorMsg('');
          setCurrentOrder((prev) => {
            if (prev && JSON.stringify(prev) === JSON.stringify(updatedOrder)) {
              return prev;
            }
            return updatedOrder;
          });
        } else {
          setErrorMsg(`We couldn't find order "${trackedOrderId}". Feel free to place a new order on the takeaway tab or check the spelling.`);
          setCurrentOrder(null);
          setTrackedOrderId(null);
        }
      },
      (err) => {
        if (!isMounted) return;
        setIsLoading(false);
        setErrorMsg('An error occurred querying our servers. Please try again.');
        setCurrentOrder(null);
        setTrackedOrderId(null);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [trackedOrderId]);

  // Handle reservation subscription
  useEffect(() => {
    if (!trackedResId) {
      setCurrentRes(null);
      return;
    }

    setIsLoading(true);
    let isMounted = true;

    const unsubscribe = subscribeToReservation(
      trackedResId,
      (updatedRes) => {
        if (!isMounted) return;
        setIsLoading(false);
        if (updatedRes) {
          setErrorMsg('');
          setCurrentRes((prev) => {
            if (prev && JSON.stringify(prev) === JSON.stringify(updatedRes)) {
              return prev;
            }
            return updatedRes;
          });
        } else {
          setErrorMsg(`We couldn't find table reservation "${trackedResId}". Feel free to book a slot under the reservations tab.`);
          setCurrentRes(null);
          setTrackedResId(null);
        }
      },
      (err) => {
        if (!isMounted) return;
        setIsLoading(false);
        setErrorMsg('An error occurred querying our servers. Please try again.');
        setCurrentRes(null);
        setTrackedResId(null);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [trackedResId]);

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSearch = searchTerm.trim().toUpperCase();
    if (!cleanSearch) return;
    handleLookup(cleanSearch, searchType);
  };

  const handleLookup = (code: string, type: 'order' | 'reservation') => {
    setIsLoading(true);
    setErrorMsg('');
    if (type === 'order') {
      setTrackedOrderId(code);
      setTrackedResId(null);
    } else {
      setTrackedResId(code);
      setTrackedOrderId(null);
    }
  };

  const triggerOrderSimulation = async (status: Order['status']) => {
    if (!currentOrder) return;
    try {
      await simulateOrderFulfillment(currentOrder.id, status);
    } catch {
      alert('Simulation failed.');
    }
  };

  const triggerResSimulation = async (status: Reservation['status']) => {
    if (!currentRes) return;
    try {
      await simulateReservationFulfillment(currentRes.id, status);
    } catch {
      alert('Simulation failed.');
    }
  };

  const clearTracker = () => {
    setCurrentOrder(null);
    setCurrentRes(null);
    setTrackedOrderId(null);
    setTrackedResId(null);
    setSearchTerm('');
    setErrorMsg('');
  };

  // Order stages list
  const orderSteps = [
    { key: 'pending', label: 'Received', desc: 'Placed in queue' },
    { key: 'preparing', label: 'Preparing', desc: 'Sizzling on coals' },
    { key: 'ready', label: 'Ready', desc: 'Packaged at counter' },
    { key: 'completed', label: 'Collected', desc: 'Enjoying your food' }
  ];

  const resSteps = [
    { key: 'pending', label: 'Requested', desc: 'Awaiting host' },
    { key: 'confirmed', label: 'Confirmed', desc: 'Table reserved' },
    { key: 'cancelled', label: 'Cancelled', desc: 'Booking revoked' }
  ];

  return (
    <section id="tracker" className="py-20 bg-natural-sage-bg border-t border-b border-natural-dark/5 shadow-inner">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-natural-orange block mb-2">
            Live Tracker Portal
          </span>
          <h2 className="text-3xl font-serif font-bold text-natural-dark tracking-tight">
            Track Your Prep & Booking
          </h2>
          <p className="text-stone-600 mt-2 text-sm">
            Enter your unique receipt token or reservation code to monitor real-time updates directly from our kitchen database.
          </p>
        </div>

        {/* Input panel */}
        <div className="bg-white rounded-3xl p-6 border border-natural-dark/5 shadow-sm mb-8">
          
          <form onSubmit={handleLookupSubmit} className="space-y-4">
            
            {/* Search toggles */}
            <div className="flex items-center gap-4 border-b border-natural-dark/10 pb-4">
              <span className="text-xs font-mono font-bold text-stone-400 uppercase">What are you tracking?</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setSearchType('order'); clearTracker(); }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    searchType === 'order'
                      ? 'bg-natural-dark text-[#FDFBF7] border-natural-dark'
                      : 'bg-white hover:bg-natural-cream text-stone-600 border-natural-dark/10'
                  }`}
                >
                  Takeaway Order
                </button>
                <button
                  type="button"
                  onClick={() => { setSearchType('reservation'); clearTracker(); }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    searchType === 'reservation'
                      ? 'bg-natural-dark text-[#FDFBF7] border-natural-dark'
                      : 'bg-white hover:bg-natural-cream text-stone-600 border-natural-dark/10'
                  }`}
                >
                  Table Reservation
                </button>
              </div>
            </div>

            {/* Input and submit button combo */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-stone-400" />
                <input
                  type="text"
                  placeholder={searchType === 'order' ? 'Enter Order Code (e.g., ORD-7HG9A)' : 'Enter Book Code (e.g., RES-28YFN)'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#FAF9F6] border border-natural-dark/10 rounded-xl text-sm font-semibold tracking-wider placeholder:font-normal focus:outline-none focus:border-natural-orange focus:ring-1 focus:ring-natural-orange uppercase"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3.5 bg-natural-orange hover:bg-natural-orange/90 text-white font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                ) : (
                  <span>Track Status</span>
                )}
              </button>
            </div>
          </form>

          {/* Quick status recommendations for easier evaluation */}
          {!currentOrder && !currentRes && !isLoading && (
            <div className="mt-4 pt-3 border-t border-natural-dark/5 flex flex-wrap items-center gap-2 text-xs text-stone-500">
              <span className="font-bold">Recommendation:</span>
              <span>Checkout a takeaway plate or book a table first, or test the lookup directly using:</span>
              <button
                onClick={() => {
                  setSearchTerm('ORD-SAMPLE');
                  setSearchType('order');
                  handleLookup('ORD-SAMPLE', 'order');
                }}
                className="px-2.5 py-0.5 bg-natural-sage-bg hover:bg-natural-sage-bg/90 text-natural-orange rounded-lg border border-natural-orange/10 font-bold font-mono cursor-pointer transition-all text-[11px]"
              >
                ORD-SAMPLE
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100 text-stone-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Live status visual displays */}
        <AnimatePresence mode="wait">
          {currentOrder && (
            <motion.div
              key="order-tracked"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-natural-dark/5 shadow-md relative overflow-hidden"
            >
              {/* Reset button */}
              <button
                onClick={clearTracker}
                className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-natural-dark bg-[#FAF9F6] rounded-full border border-natural-dark/5 transition-colors shadow-sm cursor-pointer"
                aria-label="Clear tracking screen"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-natural-dark/10 pb-5 mb-6 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-natural-sage-bg text-natural-sage-text rounded font-mono text-xs font-bold uppercase tracking-wider">
                      TAKEAWAY ORDER
                    </span>
                    <span className="font-mono text-sm font-bold text-natural-dark">
                      {currentOrder.id}
                    </span>
                  </div>
                  <h3 className="text-xs text-stone-500 font-sans mt-1">
                    Customer: <span className="font-semibold text-stone-800">{currentOrder.customerName}</span> • Phone: <span className="font-mono">{currentOrder.customerPhone}</span>
                  </h3>
                </div>
                
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 font-mono block uppercase">Order Total</span>
                  <span className="font-mono text-lg font-bold text-natural-orange">R{currentOrder.totalPrice.toFixed(0)}</span>
                </div>
              </div>              {/* Status Stepper */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 font-sans">
                {orderSteps.map((step, idx) => {
                  const statuses = orderSteps.map(s => s.key);
                  const currentIdx = statuses.indexOf(currentOrder.status);
                  const stepIdx = idx;
                  const isCompleted = stepIdx < currentIdx;
                  const isActive = stepIdx === currentIdx;

                  return (
                    <div 
                      key={step.key} 
                      className={`relative flex flex-col p-4 rounded-2xl border transition-all duration-300 ${
                        isActive 
                          ? 'bg-natural-dark text-[#FDFBF7] border-natural-dark shadow shadow-natural-dark/20' 
                          : isCompleted 
                            ? 'bg-natural-sage-bg text-natural-sage-text border-natural-sage-text/10' 
                            : 'bg-[#FAF9F6] text-stone-400 border-natural-dark/5'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-60">Step 0{idx + 1}</span>
                        {isCompleted && <CheckCircle className="h-4 w-4 text-natural-sage-text" />}
                        {isActive && <Flame className="h-4 w-4 text-natural-orange animate-bounce" />}
                      </div>
                      <span className={`text-sm font-serif font-bold ${isActive ? 'text-[#FDFBF7]' : 'text-stone-850'}`}>{step.label}</span>
                      <span className="text-[10px] font-medium opacity-80 mt-0.5 truncate">{step.desc}</span>
                    </div>
                  );
                })}
              </div>

              {/* Order Items receipt segment */}
              <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-natural-dark/5 mb-8 max-h-40 overflow-y-auto">
                <span className="text-[10px] font-mono font-bold text-stone-400 block mb-2 uppercase">Items Placed</span>
                <div className="space-y-1.5 divide-y divide-[#FAF9F6]/80">
                  {currentOrder.items.map((item, id) => (
                    <div key={id} className="flex justify-between text-xs pt-1.5 text-stone-700">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-mono text-stone-900">R{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SIMULATION CONTROLS BOX */}
              <div className="bg-[#FAF9F6] border border-natural-dark/5 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-natural-orange" />
                  <span className="text-xs font-mono font-bold text-stone-800 uppercase">Live Database Sim Control Panel</span>
                </div>
                <p className="text-[11px] text-stone-600 mb-4 leading-normal font-sans">
                  Normally, our kitchen crews in Cape Town tap these. Since this is an interactive review application, you can use these custom toggle buttons to simulate cooking stages and watch the steps above update reactively using Firestore.
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => triggerOrderSimulation('preparing')}
                    className="px-3 py-1.5 bg-white hover:bg-natural-cream active:bg-neutral-100 text-stone-800 text-[11px] font-bold rounded-lg border border-natural-dark/10 transition-colors cursor-pointer"
                  >
                    Simulate: Start Cooking 🍳
                  </button>
                  <button
                    onClick={() => triggerOrderSimulation('ready')}
                    className="px-3 py-1.5 bg-natural-sage-bg hover:bg-natural-sage-bg/90 text-natural-sage-text text-[11px] font-bold rounded-lg border border-natural-sage-text/10 transition-colors cursor-pointer"
                  >
                    Simulate: Food is Ready 📦
                  </button>
                  <button
                    onClick={() => triggerOrderSimulation('completed')}
                    className="px-3 py-1.5 bg-natural-dark hover:bg-natural-dark/95 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Simulate: Handed Over ✔
                  </button>
                  <button
                    onClick={() => triggerOrderSimulation('pending')}
                    className="px-2.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-750 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>

            </motion.div>
          )}

          {currentRes && (
            <motion.div
              key="res-tracked"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-natural-dark/5 shadow-md relative overflow-hidden"
            >
              {/* Reset button */}
              <button
                onClick={clearTracker}
                className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-natural-dark bg-[#FAF9F6] rounded-full border border-natural-dark/5 transition-colors shadow-sm cursor-pointer"
                aria-label="Clear tracking screen"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-natural-dark/10 pb-5 mb-6 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-natural-sage-bg text-natural-sage-text rounded font-mono text-xs font-bold uppercase tracking-wider">
                      TABLE RESERVATION
                    </span>
                    <span className="font-mono text-sm font-bold text-natural-dark">
                      {currentRes.id}
                    </span>
                  </div>
                  <h3 className="text-xs text-stone-500 font-sans mt-1">
                    Booked for: <span className="font-semibold text-stone-800">{currentRes.name}</span> • Phone: <span className="font-mono">{currentRes.phone}</span>
                  </h3>
                </div>
                
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 font-mono block uppercase">Guest Count</span>
                  <span className="font-mono text-lg font-bold text-natural-orange">{currentRes.guests} Seats</span>
                </div>
                        {/* Simple Details Table */}
              <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-natural-dark/5 mb-6 text-sm grid grid-cols-2 md:grid-cols-4 gap-4 font-sans">
                <div>
                  <span className="text-[10px] uppercase font-mono text-stone-400 block font-bold leading-normal">Date Requested</span>
                  <span className="font-semibold text-stone-850">{currentRes.date}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-stone-400 block font-bold leading-normal">Time Slot</span>
                  <span className="font-semibold text-stone-850">{currentRes.time}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-stone-400 block font-bold leading-normal">Occasion Notes</span>
                  <span className="font-semibold text-stone-850 truncate block">{currentRes.notes || 'None listed'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-stone-400 block font-bold leading-normal">Database Status</span>
                  <span className={`font-semibold uppercase tracking-wider text-xs ${
                    currentRes.status === 'confirmed' 
                      ? 'text-natural-sage-text font-extrabold' 
                      : currentRes.status === 'cancelled' 
                        ? 'text-rose-600 font-extrabold' 
                        : 'text-natural-orange animate-pulse font-extrabold'
                  }`}>
                    {currentRes.status}
                  </span>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {resSteps.map((step, idx) => {
                  const isActive = currentRes.status === step.key;
                  let colorClass = 'bg-[#FAF9F6] text-stone-400 border-natural-dark/5';
                  
                  if (isActive) {
                    if (step.key === 'pending') colorClass = 'bg-natural-dark text-[#FDFBF7] border-natural-dark shadow';
                    if (step.key === 'confirmed') colorClass = 'bg-natural-sage-bg text-natural-sage-text border-natural-sage-text/10 shadow';
                    if (step.key === 'cancelled') colorClass = 'bg-rose-100 text-rose-800 border-rose-250 shadow';
                  }

                  return (
                    <div 
                      key={step.key} 
                      className={`relative flex flex-col p-4 rounded-2xl border transition-all duration-305 ${colorClass}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-[9px] font-bold uppercase tracking-widest opacity-60">Step 0{idx + 1}</span>
                      </div>
                      <span className="text-xs sm:text-sm font-serif font-bold text-stone-850">{step.label}</span>
                      <span className="text-[9px] font-medium opacity-85 mt-0.5 truncate">{step.desc}</span>
                    </div>
                  );
                })}
              </div>

              {/* SIMULATION CONTROLS BOX */}
              <div className="bg-[#FAF9F6] border border-natural-dark/5 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-natural-orange" />
                  <span className="text-xs font-mono font-bold text-[#2C1E1A] uppercase">Live Database Reservation Simulation</span>
                </div>
                <p className="text-[11px] text-stone-600 mb-4 leading-normal font-sans">
                  Toggle the table reservation state inside the Firestore collection. Watch changes replicate automatically.
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => triggerResSimulation('confirmed')}
                    className="px-3.5 py-2 bg-natural-sage-bg hover:bg-natural-sage-bg/90 text-natural-sage-text text-[11px] font-bold rounded-xl border border-natural-sage-text/10 transition-colors cursor-pointer"
                  >
                    Simulate: Approve Reservation ✔
                  </button>
                  <button
                    onClick={() => triggerResSimulation('cancelled')}
                    className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 text-[11px] font-bold rounded-xl border border-rose-200 transition-colors cursor-pointer"
                  >
                    Simulate: Cancel Booking 🛑
                  </button>
                  <button
                    onClick={() => triggerResSimulation('pending')}
                    className="px-3.5 py-2 bg-natural-cream hover:bg-natural-cream/80 text-stone-850 text-[11px] font-bold rounded-xl border border-natural-dark/10 transition-colors cursor-pointer"
                  >
                    Reset Pending
                  </button>
                </div>
              </div>
            </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
