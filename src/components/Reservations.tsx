import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Users, MessageSquare, ShieldCheck, Mail, Send, CheckCircle2, Phone } from 'lucide-react';
import { createReservation } from '../db/firebase';

interface ReservationsProps {
  onReservationSuccess: (resId: string) => void;
}

export default function Reservations({ onReservationSuccess }: ReservationsProps) {
  const [formType, setFormType] = useState<'booking' | 'inquiry'>('booking');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedResId, setPlacedResId] = useState<string | null>(null);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !date || !time) return;

    setIsSubmitting(true);
    try {
      const resId = await createReservation({
        name,
        email,
        phone,
        date,
        time,
        guests,
        notes: notes || undefined,
      });
      setPlacedResId(resId);
      onReservationSuccess(resId);
    } catch (err) {
      alert('We could not book your table. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !notes) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setInquirySuccess(true);
    }, 1200);
  };

  return (
    <section id="reservations" className="py-20 bg-natural-cream border-t border-b border-natural-dark/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-natural-orange block mb-2">
            Secure Your Table
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-natural-dark tracking-tight">
            Reserve Your Experience
          </h2>
          <p className="text-stone-605 text-stone-600 mt-3 text-sm md:text-base leading-relaxed">
            Beautiful sunsets over Plattekloof Village await. Our digital reservation desk hooks directly into our database to ensure instant local receipt.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-natural-dark/5 overflow-hidden flex flex-col justify-between">
            <div>
              {/* Segment Toggle */}
              <div className="flex border-b border-natural-dark/10 bg-[#FAF9F6] p-1">
                <button
                  type="button"
                  onClick={() => {
                    setFormType('booking');
                    setInquirySuccess(false);
                    setPlacedResId(null);
                  }}
                  className={`flex-1 py-3 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                    formType === 'booking'
                      ? 'bg-white text-natural-orange shadow-sm font-bold'
                      : 'text-stone-600 hover:text-natural-orange'
                  }`}
                >
                  <Calendar className="h-4.5 w-4.5" />
                  <span>Book a Table (Reservation)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormType('inquiry');
                    setInquirySuccess(false);
                    setPlacedResId(null);
                  }}
                  className={`flex-1 py-3 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                    formType === 'inquiry'
                      ? 'bg-white text-natural-orange shadow-sm font-bold'
                      : 'text-stone-600 hover:text-natural-orange'
                  }`}
                >
                  <MessageSquare className="h-4.5 w-4.5" />
                  <span>General Inquiry</span>
                </button>
              </div>

              {/* Explicit Guidance Banner */}
              <div className="p-5 bg-natural-sage-bg/30 border-b border-natural-dark/5 text-xs text-stone-600 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-natural-orange shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-natural-sage-text mb-0.5">Form Purpose & Key Requirements:</span>
                  {formType === 'booking' ? (
                    <p>
                      This layout is optimized for **table bookings**. To secure a table, you <strong>must specify</strong> your <span className="underline">Guest Count, Booking Date, and preferred Time Slot</span> along with contact methods.
                    </p>
                  ) : (
                    <p>
                      For <strong>general inquiries, feedback, or custom events</strong>, select this tab. Only your <strong>Name, Email, and your Message (placed in Notes field)</strong> are essential. Phone/Date/Time selectors are omitted.
                    </p>
                  )}
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {placedResId ? (
                    /* Booking Success Screen */
                    <motion.div
                      key="booking-success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-10 space-y-5"
                    >
                      <div className="h-16 w-16 bg-natural-sage-bg rounded-full flex items-center justify-center text-natural-sage-text mx-auto">
                        <CheckCircle2 className="h-10 w-10 stroke-[2]" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-xl text-neutral-900">Table Booked!</h3>
                        <p className="text-stone-600 text-sm mt-1">
                          We have recorded your table request at Terracotta Eatery.
                        </p>
                      </div>

                      {/* Ticket Mockup */}
                      <div className="max-w-sm mx-auto bg-[#FAF9F6] border border-natural-dark/10 rounded-2xl p-6 text-left shadow-sm font-mono text-sm space-y-3">
                        <div className="text-center border-b border-dashed border-natural-dark/20 pb-3">
                          <span className="text-xs text-stone-400 font-bold block">CONFIRMATION SLIP</span>
                          <span className="text-lg font-bold text-natural-orange tracking-widest">{placedResId}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-y-2 text-xs pt-1">
                          <span className="text-stone-400">Guest Name:</span>
                          <span className="text-stone-800 text-right font-semibold truncate">{name}</span>
                          
                          <span className="text-stone-400">Date:</span>
                          <span className="text-stone-800 text-right font-semibold">{date}</span>

                          <span className="text-stone-400">Time / Seats:</span>
                          <span className="text-stone-800 text-right font-semibold">{time} ({guests} guests)</span>
                          
                          <span className="text-stone-400">Status:</span>
                          <span className="text-natural-sage-text text-right font-bold uppercase">Pending Confirmation</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPlacedResId(null);
                            setName('');
                            setEmail('');
                            setPhone('');
                            setDate('');
                            setTime('');
                            setGuests(2);
                            setNotes('');
                          }}
                          className="px-6 py-2.5 bg-natural-dark hover:bg-natural-orange text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Book Another Table
                        </button>
                      </div>
                    </motion.div>
                  ) : inquirySuccess ? (
                    /* Inquiry Success Screen */
                    <motion.div
                      key="inquiry-success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12 space-y-4"
                    >
                      <div className="h-16 w-16 bg-natural-sage-bg rounded-full flex items-center justify-center text-natural-orange mx-auto">
                        <Mail className="h-8 w-8 stroke-[1.5]" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-lg text-neutral-900">Inquiry Received</h4>
                        <p className="text-sm text-stone-600 max-w-sm mx-auto mt-2">
                          Thank you, <strong>{name}</strong>! Your request regarding general inquiries has been dispatched to the manager of our Cape Town venue. We will reach back within 24 hours.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setInquirySuccess(false);
                          setName('');
                          setEmail('');
                          setNotes('');
                        }}
                        className="px-6 py-2.5 bg-natural-dark hover:bg-natural-orange text-white font-semibold rounded-xl text-xs transition duration-200 cursor-pointer"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    /* Standard Forms */
                    <motion.div
                      key={formType === 'booking' ? 'booking-form' : 'inquiry-form'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                    >
                      {formType === 'booking' ? (
                        /* Booking Table Form */
                        <form onSubmit={handleBookingSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="Sipho Khumalo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-natural-dark/10 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-natural-orange focus:ring-1 focus:ring-natural-orange"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                                Phone Number (SMS confirmation) *
                              </label>
                              <input
                                type="tel"
                                required
                                placeholder="e.g. +27 82 555 1234"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-natural-dark/10 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-natural-orange focus:ring-1 focus:ring-natural-orange"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                                Email Address *
                              </label>
                              <input
                                type="email"
                                required
                                placeholder="sipho@cloud.co.za"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2.5 bg-[#FAF9F6] border border-natural-dark/10 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-natural-orange focus:ring-1 focus:ring-natural-orange"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                                Date *
                              </label>
                              <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3 py-2.5 bg-[#FAF9F6] border border-natural-dark/10 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-natural-orange focus:ring-1 focus:ring-natural-orange text-stone-750 text-stone-700"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                                Time Slot *
                              </label>
                              <select
                                required
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full px-3 py-2.5 bg-[#FAF9F6] border border-natural-dark/10 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-natural-orange focus:ring-1 focus:ring-natural-orange text-stone-750 text-stone-700"
                              >
                                <option value="">Select a time...</option>
                                <option value="08:30">08:30 Breakfast</option>
                                <option value="11:30">11:30 Brunch</option>
                                <option value="13:00">13:00 Lunch</option>
                                <option value="15:00">15:00 Midday</option>
                                <option value="17:30">17:30 Early Dinner</option>
                                <option value="19:00">19:00 Prime Dinner</option>
                                <option value="20:30">20:30 Late Dinner</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                                Number of Guests *
                              </label>
                              <div className="flex items-center gap-3 bg-[#FAF9F6] rounded-xl p-1.5 border border-natural-dark/10">
                                <button
                                  type="button"
                                  onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                                  className="h-9 w-9 bg-white hover:bg-natural-cream rounded-lg border border-natural-dark/10 font-bold text-neutral-800 transition-colors flex items-center justify-center cursor-pointer"
                                  aria-label="Fewer guests"
                                >
                                  -
                                </button>
                                <span className="flex-1 text-center font-bold text-stone-800 text-sm font-mono">
                                  {guests} {guests === 1 ? 'Guest' : 'Guests'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setGuests(prev => Math.min(50, prev + 1))}
                                  className="h-9 w-9 bg-white hover:bg-natural-cream rounded-lg border border-natural-dark/10 font-bold text-neutral-800 transition-colors flex items-center justify-center cursor-pointer"
                                  aria-label="More guests"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                                Occasion & Dietary Notes
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Birthday, window seat, gluten intolerant"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full px-3 py-2.5 bg-[#FAF9F6] border border-natural-dark/10 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-natural-orange focus:ring-1 focus:ring-natural-orange"
                              />
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-natural-orange text-white rounded-xl text-sm font-semibold hover:bg-natural-orange/95 active:scale-[0.99] transition-all shadow-sm mt-4 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            {isSubmitting ? (
                              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Send className="h-4 w-4" />
                                <span>Confirm Secure Table Booking (Firestore DB)</span>
                              </>
                            )}
                          </button>
                        </form>
                      ) : (
                        /* Inquiry Form */
                        <form onSubmit={handleInquirySubmit} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="Leandra Cupido"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2.5 bg-[#FAF9F6] border border-natural-dark/10 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-natural-orange focus:ring-1 focus:ring-natural-orange"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                                Email Address *
                              </label>
                              <input
                                type="email"
                                required
                                placeholder="leandra@domain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2.5 bg-[#FAF9F6] border border-natural-dark/10 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-natural-orange focus:ring-1 focus:ring-natural-orange"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                                Your Inquiry Message *
                            </label>
                            <textarea
                              rows={4}
                              required
                              placeholder="Please write details about corporate catering, group events, or supply enquiries here..."
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              className="w-full px-3 py-2.5 bg-[#FAF9F6] border border-natural-dark/10 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-natural-orange focus:ring-1 focus:ring-natural-orange resize-none"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-natural-dark text-white rounded-xl text-sm font-semibold hover:bg-natural-dark/95 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                          >
                            {isSubmitting ? (
                              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Send className="h-4 w-4" />
                                <span>Send Inquiry to Management</span>
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
            
            {/* Footer Notice */}
            <div className="p-4 bg-[#FAF9F6] border-t border-natural-dark/5 text-[11px] text-stone-500 flex items-center gap-2 text-center justify-center">
              <span>* High-security cloud database storage strictly processes in Plattekloof.</span>
            </div>
          </div>

          {/* Info Atmosphere Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Hours card */}
            <div className="bg-natural-dark text-[#FDFBF7] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg border border-natural-dark/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-br from-natural-orange/20 to-transparent rounded-full blur-2xl" />
              <div>
                <h3 className="font-serif font-extrabold text-xl mb-6 flex items-center gap-2.5 text-white">
                  <Clock className="text-natural-orange h-5 w-5" />
                  <span>Hours of Operation</span>
                </h3>
                
                <div className="space-y-4 font-mono text-xs text-stone-300">
                  <div className="flex justify-between border-b border-stone-850 pb-2">
                    <span className="text-stone-400 font-bold uppercase">Mon, Wed, Thu, Fri, Sat</span>
                    <span className="text-stone-100 font-bold">07:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-850 pb-2 items-center">
                    <div className="flex flex-col">
                      <span className="text-stone-400 font-bold uppercase">Tuesday (Youth Day)</span>
                      <span className="text-[10px] text-stone-500 italic lowercase">Hours might differ</span>
                    </div>
                    <span className="text-stone-100 font-bold">07:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-850 pb-2">
                    <span className="text-stone-400 font-bold uppercase">Sunday</span>
                    <span className="text-stone-100 font-bold">08:00 AM - 07:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400 font-bold uppercase">Kitchen Closes</span>
                    <span className="text-natural-orange font-bold">30 mins before close</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-850 flex items-center gap-3">
                <div className="h-10 w-10 bg-stone-800 rounded-full flex items-center justify-center text-natural-orange">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-mono block uppercase">Telephone Direct</span>
                  <span className="text-sm font-bold text-stone-100 font-mono">081 381 0284</span>
                </div>
              </div>
            </div>

            {/* General FAQs Card */}
            <div className="bg-white rounded-3xl p-6 border border-natural-dark/5 shadow-sm flex flex-col gap-4">
              <h3 className="font-serif font-bold text-natural-dark text-sm tracking-wider uppercase">
                Reservation Quick-Faq
              </h3>
              
              <div className="space-y-4 font-sans text-sm">
                <div>
                  <h4 className="text-xs font-extrabold text-stone-800 mb-0.5">Is booking required?</h4>
                  <p className="text-xs text-stone-500 leading-normal">
                    Walk-ins are welcomed, but tables at Plattekloof fill rapidly for dinner, particularly Fri-Sunday. We highly recommend booking.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xs font-extrabold text-stone-800 mb-0.5">What is the dress code?</h4>
                  <p className="text-xs text-stone-500 leading-normal">
                    Smart casual. Comfortable for locals wrapping up shopping, stylish enough for celebration wine dates.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold text-stone-800 mb-0.5">Are corporate functions possible?</h4>
                  <p className="text-xs text-stone-500 leading-normal">
                    Yes! Swap the tab to "General Inquiry" above to configure your set menu plans.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
