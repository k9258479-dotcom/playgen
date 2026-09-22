import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, ExternalLink, Globe, CheckCircle2, RotateCcw, X, AlertTriangle } from 'lucide-react';

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
  const [phase, setPhase] = useState<'opening_smdc' | 'waiting_timer' | 'redirecting_y8' | 'done'>('opening_smdc');
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    // Phase 1: Opening SMDC
    const t1 = setTimeout(() => {
      setPhase('waiting_timer');
    }, 400);

    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== 'waiting_timer' || isPaused) return;

    const interval = 25;
    const timer = setInterval(() => {
      setRemainingMs((prev) => {
        const next = prev - interval;
        if (next <= 0) {
          clearInterval(timer);
          setPhase('redirecting_y8');
          return 0;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [phase, isPaused]);

  useEffect(() => {
    if (phase === 'redirecting_y8') {
      const t = setTimeout(() => {
        setPhase('done');
        if (autoExecuteRedirect) {
          // Check if we are inside an iframe; if so, open in top window or navigate
          try {
            window.top!.location.href = destUrl;
          } catch (e) {
            window.location.href = destUrl;
          }
        }
      }, 700);
      return () => clearTimeout(t);
    }
  }, [phase, autoExecuteRedirect, destUrl]);

  const handleRestart = () => {
    setRemainingMs(delayMs);
    setPhase('opening_smdc');
    setIsPaused(false);
    setTimeout(() => {
      setPhase('waiting_timer');
    }, 400);
  };

  const progressPercent = Math.max(0, Math.min(100, ((delayMs - remainingMs) / delayMs) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative overflow-hidden animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          title="Isara ang Runner"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-cyan-400 tracking-wider uppercase font-mono">
              Live Generated Link Execution
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Awtomatikong Redirect Runner
            </h2>
          </div>
        </div>

        {/* Stepper Status Box */}
        <div className="space-y-4 mb-6">
          {/* Step 1: SMDC */}
          <div
            className={`p-3.5 rounded-xl border transition flex items-center justify-between ${
              phase === 'opening_smdc' || phase === 'waiting_timer'
                ? 'bg-blue-950/40 border-blue-500/50 text-blue-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center border border-blue-500/40">
                1
              </span>
              <div>
                <div className="font-semibold text-xs text-white">Binuksan ang SMDC</div>
                <div className="text-[11px] text-cyan-400 font-mono">{startUrl}</div>
              </div>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono">
              Loaded
            </span>
          </div>

          {/* Step 2: 1-Second Timer */}
          <div
            className={`p-4 rounded-xl border transition flex flex-col gap-2 ${
              phase === 'waiting_timer'
                ? 'bg-amber-950/40 border-amber-500/60 text-amber-200 shadow-lg shadow-amber-950/30'
                : phase === 'redirecting_y8' || phase === 'done'
                ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                : 'bg-slate-950/40 border-slate-850 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center border border-amber-500/40">
                  2
                </span>
                <div>
                  <div className="font-semibold text-xs text-white">
                    Naghihintay nang Eksaktong 1 Segundo (1000ms)
                  </div>
                  <div className="text-[11px] text-amber-300/80">
                    Habang nakabukas ang site bago ilipat ang tab...
                  </div>
                </div>
              </div>

              <div className="text-right font-mono font-bold text-lg text-amber-300">
                {remainingMs} <span className="text-xs font-sans">ms</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-75"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Step 3: Y8 Redirect */}
          <div
            className={`p-3.5 rounded-xl border transition flex items-center justify-between ${
              phase === 'redirecting_y8' || phase === 'done'
                ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-200 shadow-lg shadow-emerald-950/30 animate-pulse'
                : 'bg-slate-950/40 border-slate-850 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/40">
                3
              </span>
              <div>
                <div className="font-semibold text-xs text-white">
                  {phase === 'done' ? 'Nailipat na sa Y8!' : 'Lilipat sa Parehong Tab: Y8'}
                </div>
                <div className="text-[11px] text-emerald-400 font-mono">{destUrl}</div>
              </div>
            </div>

            {phase === 'done' ? (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Tagumpay!
              </span>
            ) : (
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                Paparating...
              </span>
            )}
          </div>
        </div>

        {/* Action Controls & Direct Navigation */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulitin Muli</span>
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              {isPaused ? 'I-resume' : 'I-pause'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={destUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow"
            >
              <span>Buksan ang Y8.com Ngayon</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
