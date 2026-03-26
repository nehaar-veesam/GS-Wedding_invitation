/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Heart, 
  Music, 
  Utensils, 
  ChevronDown,
  Sparkles,
  Flower2
} from 'lucide-react';

// Use URL() so TypeScript doesn't need special static-asset module resolution.
// Vite will still bundle the image correctly.
const gopalImg = new URL('../photos/Gopal-web.jpg', import.meta.url).toString();
const sravyaImg = new URL('../photos/Sravya-web.jpg', import.meta.url).toString();

// --- Components ---

const PetalRain = () => {
  const [petals, setPetals] = useState<{ id: number; left: number; delay: number; duration: number; size: number }[]>([]);

  useEffect(() => {
    const newPetals = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 10,
      size: 10 + Math.random() * 20,
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{ y: -50, x: `${petal.left}vw`, rotate: 0, opacity: 0 }}
          animate={{ 
            y: '110vh', 
            x: `${petal.left + (Math.random() * 20 - 10)}vw`,
            rotate: 360,
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear"
          }}
          style={{ width: petal.size, height: petal.size }}
          className="absolute"
        >
          <Flower2 className="text-deep-red/30 fill-deep-red/20 w-full h-full" />
        </motion.div>
      ))}
    </div>
  );
};

const CurtainReveal = ({ onReveal }: { onReveal: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    onReveal();
  };

  return (
    <div 
      className={`curtain-container ${isOpen ? 'curtain-open' : ''}`} 
      onClick={handleOpen}
      style={{ pointerEvents: isOpen ? 'none' : 'auto' }}
    >
      <div className="curtain-panel left flex flex-col items-end justify-center pr-12">
        <motion.div
          animate={{ x: [0, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)]"
        >
          <Sparkles className="text-gold w-10 h-10" />
        </motion.div>
      </div>
      <div className="curtain-panel right flex flex-col items-start justify-center pl-12">
        <motion.div
          animate={{ x: [0, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)]"
        >
          <Sparkles className="text-gold w-10 h-10" />
        </motion.div>
      </div>
      
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.1 }}
            className="absolute inset-0 z-[110] flex flex-col items-center justify-center pointer-events-none px-4"
          >
            <div className="text-center bg-black/20 backdrop-blur-sm p-12 rounded-full border border-gold/20">
              <div className="mb-6 font-display text-soft-gold text-4xl tracking-[0.6em] drop-shadow-2xl">
                INVITATION
              </div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-gold font-sans text-sm tracking-[0.4em] uppercase"
              >
                Tap to Open
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Curtain Rod */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/60 to-transparent z-[105]" />
    </div>
  );
};

const ScratchCircle = ({ value, onReveal }: { value: string; onReveal: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasRevealedRef = useRef(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas dimensions to match display size for 1:1 pixel mapping
    canvas.width = 120;
    canvas.height = 120;

    // Fill with solid gold
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(0, 0, 120, 120);
    
    // Add decorative pattern
    ctx.strokeStyle = '#800000';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 120, Math.random() * 120);
      ctx.lineTo(Math.random() * 120, Math.random() * 120);
      ctx.stroke();
    }
    
    // Add text
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = '#800000';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH', 60, 55);
    ctx.fillText('HERE', 60, 75);

    // Reset alpha for scratching
    ctx.globalAlpha = 1.0;
  }, []);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || hasRevealedRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    // Check progress
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) transparent++;
    }
    
    if (transparent / (pixels.length / 4) > 0.45) {
      if (!hasRevealedRef.current) {
        hasRevealedRef.current = true;
        setIsRevealed(true);
        onReveal();
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing) scratch(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDrawing) {
      const touch = e.touches[0];
      scratch(touch.clientX, touch.clientY);
    }
  };

  return (
    <div className="scratch-circle-container">
      <div className="scratch-value">{value}</div>
      <AnimatePresence>
        {!isRevealed && (
          <motion.canvas
            ref={canvasRef}
            className="scratch-canvas"
            onMouseDown={(e) => { setIsDrawing(true); scratch(e.clientX, e.clientY); }}
            onMouseUp={() => setIsDrawing(false)}
            onMouseLeave={() => setIsDrawing(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={(e) => { setIsDrawing(true); const touch = e.touches[0]; scratch(touch.clientX, touch.clientY); }}
            onTouchEnd={() => setIsDrawing(false)}
            onTouchMove={handleTouchMove}
            exit={{ opacity: 0, scale: 1.4, filter: 'blur(15px)' }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ScratchDate = () => {
  const [revealedCount, setRevealedCount] = useState(0);
  const isAllRevealed = revealedCount >= 3;
  const weddingMonthIndex = 3; // April (0-based)
  const weddingDayOfMonth = 1;
  const weddingYear = 2026;

  const calcDaysToGo = () => {
    // IST is UTC+05:30 (no DST). Compute "midnight" in IST using epoch math,
    // so the result is consistent even if the user is in another timezone.
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // 19,800,000
    const DAY_MS = 24 * 60 * 60 * 1000;

    const nowUTC = Date.now();

    // Convert current time to "IST clock" by adding offset, then floor to IST midnight.
    const istNow = nowUTC + IST_OFFSET_MS;
    const istMidnightEpoch = Math.floor(istNow / DAY_MS) * DAY_MS;
    const nowMidnightUTC = istMidnightEpoch - IST_OFFSET_MS;

    // Target date at IST midnight -> convert that IST midnight to UTC epoch.
    const targetISTMidnightUTC =
      Date.UTC(weddingYear, weddingMonthIndex, weddingDayOfMonth, 0, 0, 0, 0) - IST_OFFSET_MS;

    const diffDays = Math.round((targetISTMidnightUTC - nowMidnightUTC) / DAY_MS);
    return Math.max(0, diffDays);
  };

  const [daysToGo, setDaysToGo] = useState<number>(calcDaysToGo);

  const handleReveal = () => setRevealedCount(prev => prev + 1);

  useEffect(() => {
    // Refresh countdown periodically in case the user keeps the tab open.
    const id = window.setInterval(() => setDaysToGo(calcDaysToGo()), 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto py-12 px-4 bg-maroon/5 rounded-[3rem] border-2 border-gold/20 shadow-xl overflow-hidden">
      <div className="text-center mb-12">
        <h3 className="font-display text-2xl text-maroon tracking-widest">SAVE THE DATE</h3>
        <p className="text-gold font-serif italic">Erase the circles to reveal our auspicious day</p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12">
        <div className="flex flex-col items-center gap-4">
          <ScratchCircle value="1" onReveal={handleReveal} />
          <span className="text-xs font-display text-gold tracking-widest">DAY</span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <ScratchCircle value="April" onReveal={handleReveal} />
          <span className="text-xs font-display text-gold tracking-widest">MONTH</span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <ScratchCircle value="2026" onReveal={handleReveal} />
          <span className="text-xs font-display text-gold tracking-widest">YEAR</span>
        </div>
      </div>

      <AnimatePresence>
        {isAllRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="h-px w-32 bg-gold/30 mx-auto mb-6" />
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="font-display text-4xl md:text-7xl text-maroon tracking-[0.1em] mb-4 flex items-center justify-center"
            >
              APRIL 1<span className="text-xl md:text-3xl self-start mt-2 md:mt-4 ml-1">st</span> 2026
            </motion.div>
            <p className="font-serif italic text-gold text-lg mt-4">
              {daysToGo} day{daysToGo === 1 ? '' : 's'} to go...
            </p>
            <Sparkles className="text-gold mx-auto mt-6 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SectionTitle = ({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) => (
  <div className="text-center mb-16 relative">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="inline-block"
    >
      <h2 className="text-4xl md:text-5xl font-display text-maroon mb-2">{children}</h2>
      <div className="flex items-center justify-center gap-4">
        <div className="h-[2px] w-12 bg-gold/50" />
        <Flower2 className="text-gold w-6 h-6" />
        <div className="h-[2px] w-12 bg-gold/50" />
      </div>
      {subtitle && <p className="mt-4 font-serif italic text-gold text-lg">{subtitle}</p>}
    </motion.div>
  </div>
);

const App: React.FC = () => {
  const [isOpened, setIsOpened] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const venueAddress = "Simba Resorts, Near Pendurthi Fly Over, Kothavalasa Road, Visakhapatnam";
  const directionsUrl = "https://maps.app.goo.gl/L9ngQW4KH8qbDku69";
  const heroBgImg = new URL('../photos/bg.jpg', import.meta.url).toString();

  return (
    <div className={`min-h-screen font-sans selection:bg-gold/30 ${!isOpened ? 'h-screen overflow-hidden' : ''}`}>
      <CurtainReveal onReveal={() => setIsOpened(true)} />

      <motion.div
        initial={{ opacity: 1 }}
        className="w-full"
      >
        <PetalRain />

          {/* Hero Section */}
          <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Blurred background image layer */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${heroBgImg})`,
                filter: 'blur(4px) brightness(1.24) contrast(0.95) saturate(1.1)',
                transform: 'scale(1.08)',
              }}
            />
            {/* Warm overlay: light + golden for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-cream/70 via-cream/35 to-cream/25" />
            <div className="absolute inset-0 bg-gold/10" />
            
            <motion.div 
              style={{ opacity }}
              className="relative z-10 text-center px-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="mb-8"
              >
                <div className="w-32 h-32 md:w-48 md:h-48 mx-auto relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-gold/40 rounded-full"
                  />
                  <div className="absolute inset-4 border border-maroon/20 rounded-full flex items-center justify-center">
                    <Heart className="text-maroon w-12 h-12 fill-maroon/10" />
                  </div>
                </div>
              </motion.div>

              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="font-display text-deep-red text-xl md:text-2xl tracking-[0.4em] mb-6 drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
              >
                INVITING FOR THE WEDDING OF
              </motion.p>

              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-6xl md:text-9xl font-display text-maroon mb-8 leading-tight drop-shadow-[0_4px_12px_rgba(128,0,0,0.35)]"
              >
                Gopal{' '}
                <span className="text-soft-gold font-script text-5xl md:text-7xl block md:inline drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
                  &
                </span>{' '}
                Sravya
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-px h-24 bg-gradient-to-b from-gold to-transparent" />
                <ChevronDown className="text-gold animate-bounce" />
              </motion.div>
            </motion.div>
          </section>

          {/* Scratch Reveal Section */}
          <section className="py-24 px-4 bg-white relative overflow-hidden">
            <div className="max-w-4xl mx-auto">
              <SectionTitle subtitle="A moment in time, a lifetime of memories">The Auspicious Date</SectionTitle>
              <ScratchDate />
            </div>
          </section>

          {/* Couple Section */}
          <section className="py-24 px-4 bg-cream relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 opacity-5 mandala-rotate">
              <img src="https://www.transparentpng.com/download/mandala/mandala-free-download-transparent-10.png" alt="mandala" className="w-full h-full" />
            </div>
            
            <div className="max-w-6xl mx-auto">
              <SectionTitle>The Groom & Bride</SectionTitle>
              
              <div className="grid md:grid-cols-2 gap-16 items-center">
                {/* Groom */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="relative inline-block mb-12">
                    <div className="royal-frame">
                      <div className="w-64 h-80 md:w-80 md:h-96 overflow-hidden relative z-0">
                        <img 
                          src={gopalImg}
                          alt="Groom" 
                          className="w-full h-full object-cover transition-all duration-700"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-maroon text-soft-gold rounded-full flex items-center justify-center border-4 border-gold shadow-2xl z-10">
                      <span className="font-display text-3xl">G</span>
                    </div>
                  </div>
                  <h3 className="text-5xl font-display text-maroon mb-4 tracking-wider">Gopal</h3>
                  <div className="space-y-2">
                    <p className="font-serif italic text-gold text-xl">Son of</p>
                    <p className="font-display text-maroon text-lg leading-relaxed">
                      Sri. Sigireddy Venkata Rameswara Rao<br />
                      & <br />
                      Smt. Anantha Rama Lakshmi Devi
                    </p>
                  </div>
                </motion.div>

                {/* Bride */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="relative inline-block mb-12">
                    <div className="royal-frame">
                      <div className="w-64 h-80 md:w-80 md:h-96 overflow-hidden relative z-0">
                        <img 
                          src={sravyaImg}
                          alt="Bride" 
                          className="w-full h-full object-cover transition-all duration-700"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-maroon text-soft-gold rounded-full flex items-center justify-center border-4 border-gold shadow-2xl z-10">
                      <span className="font-display text-3xl">S</span>
                    </div>
                  </div>
                  <h3 className="text-5xl font-display text-maroon mb-4 tracking-wider">Jaya Sravya</h3>
                  <div className="space-y-2">
                    <p className="font-serif italic text-gold text-xl">Daughter of</p>
                    <p className="font-display text-maroon text-lg leading-relaxed">
                    Sri. Routhu Ravi Sangha Maheswara Rao <br />
                    & <br />
                    Smt. Rama Devi
                  </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Events Section */}
          <section className="py-24 px-4 bg-white relative">
            <div className="max-w-5xl mx-auto">
              <SectionTitle subtitle="Traditional rituals and celebrations">The Wedding Day</SectionTitle>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Sumuhurtham",
                    time: "Wednesday, April 1st | 09:44 PM",
                    icon: Clock,
                  },
                  {
                    title: "Venue",
                    time: venueAddress,
                    icon: MapPin,
                  },
                  {
                    title: "Dinner",
                    time: "7:00 PM onwards at Marriage Venue",
                    icon: Utensils,
                  }
                ].map((event, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    className="p-8 rounded-3xl bg-cream border border-gold/20 text-center hover:shadow-xl transition-shadow group"
                  >
                    <div className="w-16 h-16 mx-auto mb-6 bg-maroon rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <event.icon className="text-soft-gold w-8 h-8" />
                    </div>
                    <h4 className="text-2xl font-display text-maroon mb-2">{event.title}</h4>
                    <p className="text-gold font-serif italic mb-4">{event.time}</p>
                    {/* <p className="text-gray-600 text-sm">{event.desc}</p> */}
                  </motion.div>
                ))}
              </div>

              <div className="mt-16 text-center">
                <motion.a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex no-underline px-8 py-4 bg-maroon text-soft-gold rounded-full font-display tracking-widest shadow-lg items-center gap-3"
                >
                  <MapPin className="w-5 h-5" />
                  GET DIRECTIONS
                </motion.a>
              </div>
            </div>
          </section>

          {/* Blessings Section */}
          <section className="py-24 px-4 bg-maroon text-soft-gold relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-96 h-96 mandala-rotate">
                <img src="https://www.transparentpng.com/download/mandala/mandala-free-download-transparent-10.png" alt="mandala" className="w-full h-full" />
              </div>
              <div className="absolute bottom-0 right-0 w-96 h-96 mandala-rotate">
                <img src="https://www.transparentpng.com/download/mandala/mandala-free-download-transparent-10.png" alt="mandala" className="w-full h-full" />
              </div>
            </div>

            <div className="max-w-3xl mx-auto text-center relative z-10">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
              >
                <Sparkles className="w-12 h-12 mx-auto mb-8 text-gold" />
                <h2 className="text-4xl md:text-6xl font-display mb-8">Blessings</h2>
                <p className="text-xl md:text-2xl font-serif italic mb-12 leading-relaxed">
                  "Your presence and blessings are the most precious gifts we could receive as we begin our new journey together."
                </p>
                <div className="flex items-center justify-center gap-6">
                  <div className="h-px w-16 bg-gold/50" />
                  <Heart className="text-gold fill-gold/20" />
                  <div className="h-px w-16 bg-gold/50" />
                </div>
                <p className="mt-12 font-display tracking-[0.3em] text-sm">WITH LOVE, GOPAL & SRAVYA</p>
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-8 text-center bg-cream border-t border-gold/10">
            <p className="text-maroon/60 font-serif italic">Created with love by Nehaar</p>
          </footer>
        </motion.div>
    </div>
  );
};

export default App;
