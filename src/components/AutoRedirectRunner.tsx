import React, { useState, useEffect } from 'react';
import {
  Clock,
  ArrowRight,
  ExternalLink,
  Globe,
  RotateCcw,
  X,
  Search,
  Building,
  Phone,
  MapPin,
  Sparkles,
  ShieldCheck,
  Pause,
  Play
} from 'lucide-react';

interface Props {
  startUrl: string;
  destUrl: string;
  delayMs: number;
  onClose: () => void;
  autoExecuteRedirect?: boolean;
}

export const AutoRedirectRunner: React.FC<Props> = ({
  startUrl,
  destUrl,
  delayMs,
  onClose,
  autoExecuteRedirect = true,
}) => {
  const [remainingMs, setRemainingMs] = useState<number>(delayMs);
  const [phase, setPhase] = useState<'showing_smdc' | 'redirecting' | 'redirected'>('showing_smdc');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // Countdown timer for the exact delay (1000ms)
  useEffect(() => {
    if (isPaused || phase !== 'showing_smdc') return;

    const interval = 25;
    const timer = setInterval(() => {
      setRemainingMs((prev) => {
        const next = prev - interval;
        if (next <= 0) {
          clearInterval(timer);
          setPhase('redirecting');
          return 0;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, phase]);

  // Immediately redirect to destUrl without displaying any popup or modal
  useEffect(() => {
    if (phase === 'redirecting') {
      if (autoExecuteRedirect) {
        try {
          if (window.top && window.top !== window) {
            window.top.location.href = destUrl;
          } else {
            window.location.href = destUrl;
          }
        } catch (e) {
          window.location.href = destUrl;
        }
      }
    }
  }, [phase, autoExecuteRedirect, destUrl]);

  const handleRestart = () => {
    setRemainingMs(delayMs);
    setPhase('showing_smdc');
    setIsPaused(false);
  };

  const progressPercent = Math.max(0, Math.min(100, ((delayMs - remainingMs) / delayMs) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-[#001c3d] text-slate-100 flex flex-col overflow-y-auto animate-fade-in font-sans selection:bg-amber-400 selection:text-slate-900">
      {/* FLOATING TOP CONTROL & COUNTDOWN STATUS BAR */}
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-amber-500/30 px-3 sm:px-6 py-2.5 shadow-2xl flex flex-wrap items-center justify-between gap-3">
        {/* Left: Active automation step indicator */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
            <Clock className={`w-4 h-4 ${phase === 'showing_smdc' && !isPaused ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {phase === 'showing_smdc' ? 'Nasa SMDC Site Ka Ngayon' : 'Lumilipat na sa Y8...'}
              </span>
              <span className="text-[10px] bg-blue-900/80 text-cyan-300 px-2 py-0.5 rounded font-mono border border-blue-700/50">
                1000ms Countdown
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <span>Pagkalipas ng 1 segundo, kusa itong lilipat sa</span>
              <strong className="text-emerald-400 font-mono">y8.com</strong>
            </div>
          </div>
        </div>

        {/* Center: Live Millisecond Timer & Progress Bar */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl min-w-[200px] sm:min-w-[260px]">
          <div className="flex-1">
            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
              <span className="text-slate-400">Oras na natitira:</span>
              <span className="text-amber-300 font-bold">{remainingMs} ms</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-75"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition cursor-pointer"
            title={isPaused ? 'I-resume' : 'I-pause muna'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
          </button>
        </div>

        {/* Right: Actions (Direct redirect, Restart, Close) */}
        <div className="flex items-center gap-2">
          <a
            href={destUrl}
            target="_top"
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-lg shadow-emerald-950/40"
          >
            <span>Diretso sa Y8</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleRestart}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs transition border border-slate-800 cursor-pointer"
            title="Ulitin ang 1s Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs transition border border-slate-800 cursor-pointer"
            title="Bumalik sa Dashboard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ACTUAL AUTHENTIC SMDC.COM WEBSITE INTERFACE */}
      <div className="flex-1 flex flex-col bg-[#001733]">
        {/* SMDC Official Header Bar */}
        <div className="bg-[#002244] text-white border-b border-blue-900/60 shadow-lg">
          {/* Top micro bar */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-between text-[11px] text-blue-200/80 border-b border-blue-900/40">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-amber-400" />
                <span>Hotline: +63 (2) 8858-0300</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Official Real Estate Developer of SM Prime</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hover:text-white cursor-pointer">Buyer&apos;s Guide</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">Investor Portal</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold cursor-pointer">International Sales</span>
            </div>
          </div>

          {/* Main SMDC Navbar */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-amber-400 text-[#002244] font-black tracking-tighter text-xl px-2.5 py-0.5 rounded shadow">
                SMDC
              </div>
              <div className="border-l border-blue-800 pl-3">
                <span className="text-sm font-semibold tracking-wide text-white block leading-tight">
                  THE GOOD GUYS
                </span>
                <span className="text-[10px] text-blue-300 block">
                  SM Development Corporation
                </span>
              </div>
            </div>

            {/* Nav links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-200">
              <a href="#properties" className="hover:text-amber-400 transition">Properties</a>
              <a href="#locations" className="hover:text-amber-400 transition">Locations</a>
              <a href="#promos" className="hover:text-amber-400 transition">Promos & Offers</a>
              <a href="#virtualtours" className="hover:text-amber-400 transition">360° Virtual Tours</a>
              <a href="#corporate" className="hover:text-amber-400 transition">About SM Prime</a>
            </nav>

            {/* Inquire Button */}
            <div className="flex items-center gap-3">
              <button className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition shadow-md">
                Inquire Now
              </button>
            </div>
          </div>
        </div>

        {/* SMDC HERO BANNER SECTION */}
        <section className="relative min-h-[480px] bg-gradient-to-r from-[#001733] via-[#002855] to-[#001733] flex items-center border-b border-blue-900/50 overflow-hidden">
          {/* Subtle architectural background texture pattern */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-300 px-3 py-1 rounded-full text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Premier Residential Living in Prime Locations</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Step Into Your Dream Home with <span className="text-amber-400">SMDC</span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Discover resort-styled amenities, integrated commercial retail hubs, and complete masterplanned communities strategically situated beside SM Malls and transport terminals.
              </p>

              {/* Property Search Box on Hero */}
              <div className="bg-[#002244]/95 border border-blue-800/80 p-4 rounded-xl shadow-2xl backdrop-blur-md max-w-xl mt-4">
                <div className="text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-amber-400" />
                  <span>Find Your Ideal Property</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-[#001733] border border-blue-800 text-slate-200 rounded-lg px-2.5 py-2"
                  >
                    <option value="all">Lahat ng Lokasyon</option>
                    <option value="pasay">Mall of Asia, Pasay</option>
                    <option value="makati">Makati City</option>
                    <option value="qc">Quezon City</option>
                    <option value="taguig">Taguig / BGC vicinity</option>
                  </select>

                  <select className="bg-[#001733] border border-blue-800 text-slate-200 rounded-lg px-2.5 py-2">
                    <option>Pre-Selling Condos</option>
                    <option>Ready for Occupancy (RFO)</option>
                    <option>Rent-to-Own Deals</option>
                  </select>

                  <button className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-3 py-2 rounded-lg transition flex items-center justify-center gap-1">
                    <Search className="w-3.5 h-3.5" />
                    <span>Maghanap</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Featured Condo Showcase Card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-b from-[#002c5c] to-[#001f40] border border-blue-700/60 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Featured Development
                  </span>
                  <span className="text-xs font-mono text-cyan-300">Mall of Asia Complex</span>
                </div>

                <div className="h-44 bg-gradient-to-tr from-blue-950 via-slate-900 to-sky-900 rounded-xl border border-blue-800/80 p-4 flex flex-col justify-end relative overflow-hidden">
                  <div className="absolute top-3 right-3 bg-slate-950/80 text-[10px] text-amber-300 px-2 py-1 rounded font-semibold border border-amber-500/30">
                    Grand Pools & Cabanas
                  </div>
                  <h3 className="text-xl font-bold text-white mb-0.5">Sail Residences</h3>
                  <p className="text-xs text-slate-300">Resort luxury living right by Manila Bay</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-[#001733] rounded-lg border border-blue-900">
                    <span className="text-[10px] text-slate-400 block">Starting Price</span>
                    <span className="font-bold text-amber-300 text-sm">₱6.8M - ₱14M</span>
                  </div>
                  <div className="p-2 bg-[#001733] rounded-lg border border-blue-900">
                    <span className="text-[10px] text-slate-400 block">Monthly Amortization</span>
                    <span className="font-bold text-emerald-400 text-sm">starts at ₱18,500/mo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SMDC SHOWCASE RESIDENTIAL DEVELOPMENTS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Popular SMDC Properties</h2>
              <p className="text-xs text-slate-400">Piliin ang pinakamagandang lokasyon para sa iyong pamilya o investment.</p>
            </div>
            <div className="text-xs text-amber-400 font-semibold cursor-pointer hidden sm:block">
              View All 40+ Projects →
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Gold Residences',
                location: 'Parañaque / Across NAIA Terminal 1',
                desc: 'Gold standard lifestyle with luxurious hotel-like lobbies and underground walkways.',
                tag: 'Pre-Selling',
                gradient: 'from-amber-950/40 to-slate-900',
              },
              {
                title: 'Glam Residences',
                location: 'EDSA, Quezon City (Near GMA-Kamuning MRT)',
                desc: 'Hollywood-inspired luxury in the heart of Northern Quezon City’s triangle park.',
                tag: 'Ready for Occupancy',
                gradient: 'from-blue-950/40 to-slate-900',
              },
              {
                title: 'Air Residences',
                location: 'Ayala Avenue Extension, Makati City',
                desc: 'Walking distance to premier corporate offices, fine dining, and premier retail hubs.',
                tag: 'Prime Location',
                gradient: 'from-cyan-950/40 to-slate-900',
              },
            ].map((prop, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border border-blue-800/60 bg-gradient-to-b ${prop.gradient} flex flex-col justify-between hover:border-amber-400/50 transition`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Building className="w-3.5 h-3.5" />
                      {prop.title}
                    </span>
                    <span className="text-[10px] bg-blue-900 text-blue-200 px-2 py-0.5 rounded font-mono">
                      {prop.tag}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 flex items-center gap-1 mb-1.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{prop.location}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{prop.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-blue-900/60 flex items-center justify-between text-xs">
                  <span className="text-amber-300 font-semibold">View Units</span>
                  <span className="text-blue-400">Request Brochure →</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SMDC FOOTER */}
        <footer className="mt-auto bg-[#001226] border-t border-blue-900/80 py-6 px-4 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-400">SMDC</span>
              <span>© 2026 SM Development Corporation. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 text-slate-500 text-[11px]">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Use</span>
              <span>•</span>
              <span>HLURB / DHSUD Licenses</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
