import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Minus, Plus, Trash2, X, CreditCard, Send, CheckCircle } from 'lucide-react';
import { CartItem } from '../types';
import { createOrder } from '../db/firebase';

interface TakeawayCartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export default function TakeawayCart({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderSuccess,
}: TakeawayCartProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const packagingFee = subtotal > 0 ? 15 : 0; // standard packaging
  const total = subtotal + packagingFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!name || !email || !phone) return;

    setIsSubmitting(true);
    try {
      const orderId = await createOrder({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        items: cart,
        totalPrice: total,
        notes: notes || undefined,
      });

      setPlacedOrderId(orderId);
      onClearCart();
      onOrderSuccess(orderId);
    } catch (err) {
      alert('We could not place your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950 z-50 cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#FAF9F6] shadow-2xl z-50 flex flex-col h-full border-l border-natural-dark/10"
          >
            {/* Header */}
            <div className="p-6 bg-white border-b border-natural-dark/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-natural-orange" />
                <h2 className="text-lg font-serif font-bold text-natural-dark">Your Takeaway Cart</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-natural-cream text-stone-500 transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {placedOrderId ? (
                /* Success Screen */
                <div className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-4 font-sans">
                  <div className="h-16 w-16 bg-natural-sage-bg rounded-full flex items-center justify-center text-natural-sage-text">
                    <CheckCircle className="h-10 w-10 stroke-[2.25]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-extrabold text-xl text-natural-dark text-center">
                      Order Placed Successfully!
                    </h3>
                    <p className="text-sm text-stone-600 mt-1">
                      Your takeaway is being shared with our kitchen in Plattekloof.
                    </p>
                  </div>
                  
                  {/* Order Receipt Card */}
                  <div className="w-full bg-white border border-natural-dark/5 rounded-2xl p-5 text-left font-mono shadow-sm">
                    <div className="flex justify-between border-b border-natural-dark/10 pb-2 mb-2 text-xs text-stone-500">
                      <span>TERRACOTTA EATERY</span>
                      <span>TAKEAWAY</span>
                    </div>
                    <div className="text-sm font-bold text-stone-900 mb-1 flex justify-between">
                      <span>Order Number:</span>
                      <span className="text-natural-orange tracking-wider font-extrabold">{placedOrderId}</span>
                    </div>
                    <div className="text-xs text-stone-500">
                      Status: <span className="text-natural-orange font-bold uppercase text-xs">Received & Preparing</span>
                    </div>
                    <div className="mt-3 text-xs text-stone-500 border-t border-dashed border-natural-dark/20 pt-2 flex justify-between font-semibold">
                      <span>Pay at Counter:</span>
                      <span className="text-sm text-stone-800">R{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-500">
                    Use our live status widget on the homepage to track the preparation progress in real-time!
                  </p>

                  <button
                    onClick={() => {
                      setPlacedOrderId(null);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setNotes('');
                      onClose();
                    }}
                    className="w-full py-3 bg-natural-orange text-white rounded-xl text-sm font-semibold hover:bg-natural-orange/90 transition-colors shadow-sm cursor-pointer"
                  >
                    Keep Browsing Menu
                  </button>
                </div>
              ) : cart.length === 0 ? (
                /* Empty Cart */
                <div className="flex flex-col items-center justify-center text-center py-20 px-2 space-y-4 font-sans">
                  <div className="h-20 w-20 bg-natural-cream rounded-full flex items-center justify-center text-stone-400">
                    <ShoppingBag className="h-10 w-10 stroke-[1.25]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-natural-dark text-base">Your cart is empty</h3>
                    <p className="text-xs text-stone-500 max-w-xs mt-1">
                      Choose some delicious Karoo chops, wood-fired sourdough pizza, or malva pudding to place your order!
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 bg-natural-dark hover:bg-natural-orange text-white text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer shadow-sm"
                  >
                    Browse Local Curries & Chops
                  </button>
                </div>
              ) : (
                /* Cart Items List */
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-stone-400">
                      Order Summary ({cart.length} item{cart.length > 1 ? 's' : ''})
                    </h3>
                    <div className="divide-y divide-natural-dark/5 bg-white rounded-2xl shadow-sm border border-natural-dark/5 overflow-hidden">
                      {cart.map((item) => (
                        <div key={item.id} className="p-4 flex items-center justify-between gap-3 text-sm">
                          <div className="flex-1 min-w-0 font-sans">
                            <span className="block font-semibold text-neutral-900 truncate">
                              {item.name}
                            </span>
                            <span className="text-xs text-stone-500">
                              R{item.price} each
                            </span>
                          </div>
                          
                          {/* Item quantity controls */}
                          <div className="flex items-center gap-1.5 bg-natural-cream rounded-xl p-1 border border-natural-dark/10">
                            <button
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="p-1 rounded-lg hover:bg-white text-stone-600 transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-5 text-center font-mono text-xs font-semibold text-stone-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="p-1 rounded-lg hover:bg-white text-stone-600 transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Price and Delete */}
                          <div className="text-right flex items-center gap-3 font-sans">
                            <span className="font-mono font-semibold text-neutral-900">
                              R{(item.price * item.quantity).toFixed(0)}
                            </span>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-natural-cream transition-colors cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Information Form */}
                  <form onSubmit={handleSubmitOrder} className="space-y-4">
                    <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-stone-400 pt-2">
                      Collection Details (Plattekloof Point)
                    </h3>
                    
                    <div className="bg-white rounded-2xl p-5 border border-natural-dark/5 shadow-sm space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sipho Nkosi"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-natural-dark/10 rounded-xl text-sm bg-natural-cream focus:bg-white focus:outline-none focus:border-natural-orange focus:ring-1 focus:ring-natural-orange"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. sipho@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-natural-dark/10 rounded-xl text-sm bg-natural-cream focus:bg-white focus:outline-none focus:border-natural-orange focus:ring-1 focus:ring-natural-orange"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="e.g. +27 82 123 4567"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3.5 py-2.5 border border-natural-dark/10 rounded-xl text-sm bg-natural-cream focus:bg-white focus:outline-none focus:border-natural-orange focus:ring-1 focus:ring-natural-orange"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                          Special Chef instructions (Optional)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. sauce on the side, well-done steak, extra hot curry..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-[#2C1E1A]/10 rounded-xl text-sm bg-natural-cream focus:bg-white focus:outline-none focus:border-natural-orange focus:ring-1 focus:ring-natural-orange resize-none"
                        />
                      </div>
                    </div>

                    {/* Fees & Totals Card */}
                    <div className="bg-natural-cream rounded-2xl p-4 border border-natural-dark/5 font-mono text-xs text-stone-600 space-y-2">
                      <div className="flex justify-between">
                        <span>Items Subtotal:</span>
                        <span className="font-semibold text-stone-800">R{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Eatery Eco-Packaging:</span>
                        <span className="font-semibold text-stone-800">R{packagingFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-natural-dark/10 pt-2 text-sm font-bold text-stone-900">
                        <span>ESTIMATED TOTAL:</span>
                        <span className="text-natural-orange">R{total.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-500 pt-1">
                        <CreditCard className="h-3 w-3 text-natural-orange" />
                        <span>Payment will be processed at counter when collecting.</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 bg-natural-orange text-white font-semibold rounded-xl hover:bg-natural-orange/95 transition-all shadow-sm flex items-center justify-center gap-2 text-sm disabled:bg-stone-400 group cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending to Plattekloof...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                          <span>Place Takeaway Order • R{total.toFixed(0)}</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
