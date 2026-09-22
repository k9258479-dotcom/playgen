import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Pause, Globe, Lock, ShieldCheck, Terminal, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { ScriptConfig } from '../types';

interface Props {
  config: ScriptConfig;
}

interface LogEntry {
  timestamp: string;
  type: 'system' | 'nav' | 'timer' | 'success';
  message: string;
}

export const InteractiveSimulator: React.FC<Props> = ({ config }) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [stage, setStage] = useState<'idle' | 'opening' | 'smdc' | 'waiting' | 'redirecting' | 'y8' | 'completed'>('idle');
  const [currentUrl, setCurrentUrl] = useState<string>('about:blank');
  const [tabTitle, setTabTitle] = useState<string>('New Tab');
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [countdownRemainingMs, setCountdownRemainingMs] = useState<number>(config.waitDurationMs);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  const addLog = (type: LogEntry['type'], message: string) => {
    const now = new Date();
    const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')}`;
    setLogs((prev) => [...prev, { timestamp: timeStr, type, message }]);
  };

  const resetSimulator = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setStage('idle');
    setCurrentUrl('about:blank');
    setTabTitle('New Tab');
    setElapsedMs(0);
    setCountdownRemainingMs(config.waitDurationMs);
    setLogs([]);
  };

  const startSimulation = () => {
    resetSimulator();
    setIsRunning(true);
    setLogs([]);

    // Step 1: Open browser
    setStage('opening');
    addLog('system', `Inilulunsad ang ${config.browserEngine} browser (visible mode)...`);

    const openDelay = 600 / speedMultiplier;
    setTimeout(() => {
      // Step 2: Navigate to startUrl (SMDC)
      setStage('smdc');
      setCurrentUrl(config.startUrl);
      setTabTitle('SMDC Properties | The Good Guys');
      addLog('nav', `page.goto("${config.startUrl}") - Naglalayag patungo sa SMDC site...`);

      const loadDelay = 700 / speedMultiplier;
      setTimeout(() => {
        // Step 3: Wait 1000ms
        setStage('waiting');
        addLog('timer', `page.wait_for_timeout(${config.waitDurationMs}) - Naghihintay nang eksaktong ${config.waitDurationMs}ms...`);

        const startTime = Date.now();
        const duration = config.waitDurationMs / speedMultiplier;
        const intervalMs = 25;

        const countInterval = setInterval(() => {
          const elapsed = (Date.now() - startTime) * speedMultiplier;
          const remaining = Math.max(0, config.waitDurationMs - elapsed);
          setCountdownRemainingMs(Math.round(remaining));
          setElapsedMs(Math.round(elapsed));

          if (elapsed >= config.waitDurationMs) {
            clearInterval(countInterval);
            // Step 4: Redirect to Y8
            setStage('redirecting');
            addLog('nav', `1000ms natapos! page.goto("${config.destUrl}") - Lumilipat sa parehong tab...`);

            const redirectDelay = 500 / speedMultiplier;
            setTimeout(() => {
              setStage('y8');
              setCurrentUrl(config.destUrl);
              setTabTitle('Free Games Online at Y8.com');
              addLog('success', `Matagumpay na nakarating sa ${config.destUrl}!`);

              setTimeout(() => {
                setStage('completed');
                addLog('system', 'Simulation tapos na.');
                setIsRunning(false);
              }, 1200 / speedMultiplier);
            }, redirectDelay);
          }
        }, intervalMs);
      }, loadDelay);
    }, openDelay);
  };

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollTop = logsEndRef.current.scrollHeight;
    }
  }, [logs]);

  // Clean on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-semibold text-slate-100 text-base lg:text-lg">
              Live Browser Execution Simulator
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/50 font-mono">
              {config.browserEngine}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Panoorin ang visual simulation ng pagbukas ng SMDC, 1 segundong countdown, at paglipat sa Y8.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Speed control */}
          <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setSpeedMultiplier(0.5)}
              className={`px-2 py-1 rounded transition ${speedMultiplier === 0.5 ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="0.5x Slow motion"
            >
              0.5x
            </button>
            <button
              onClick={() => setSpeedMultiplier(1)}
              className={`px-2 py-1 rounded transition ${speedMultiplier === 1 ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="1x Normal speed"
            >
              1.0x
            </button>
            <button
              onClick={() => setSpeedMultiplier(2)}
              className={`px-2 py-1 rounded transition ${speedMultiplier === 2 ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title="2x Fast forward"
            >
              2.0x
            </button>
          </div>

          <button
            id="run-simulation-btn"
            onClick={startSimulation}
            disabled={isRunning}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-lg shadow-emerald-950/40 transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {stage === 'idle' ? 'Patakbuhin ang Simulation' : 'Ulitin muli'}
          </button>

          {isRunning && (
            <button
              onClick={resetSimulator}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition cursor-pointer"
              title="I-reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Realistic Browser Window Frame */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
        {/* Browser Top Bar & Tab */}
        <div className="bg-slate-900 px-3 pt-2.5 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {/* Window control buttons */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>

            {/* Active Single Tab */}
            <div className="flex items-center gap-2 bg-slate-950 text-slate-200 px-3 py-1.5 rounded-t-lg border-t border-x border-slate-800 text-xs font-medium max-w-[260px] truncate shadow-inner">
              <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{tabTitle}</span>
              {stage === 'waiting' && (
                <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </div>
          </div>

          {/* Browser Address Bar / Omnibox */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1 text-slate-500">
              <button className="p-1 hover:text-slate-300 text-xs rounded">←</button>
              <button className="p-1 hover:text-slate-300 text-xs rounded">→</button>
              <button className="p-1 hover:text-slate-300 text-xs rounded">↻</button>
            </div>

            <div className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-mono text-slate-300">
              <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="text-slate-500">https://</span>
              <span className="text-cyan-300 font-medium">
                {currentUrl === 'about:blank' ? 'about:blank' : currentUrl.replace('https://', '')}
              </span>

              {stage === 'waiting' && (
                <div className="ml-auto flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[11px] font-sans font-semibold border border-amber-500/40">
                  <Clock className="w-3 h-3 animate-spin" />
                  <span>NAGHIHINTAY: {countdownRemainingMs}ms</span>
                </div>
              )}
              {stage === 'y8' && (
                <div className="ml-auto flex items-center gap-1 text-emerald-400 text-[11px] font-sans font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Redirect Successful!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Browser Content Area Viewport */}
        <div className="relative min-h-[300px] sm:min-h-[340px] bg-slate-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          {stage === 'idle' && (
            <div className="max-w-md p-6 rounded-xl border border-slate-800/80 bg-slate-900/40">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3 text-cyan-400">
                <Globe className="w-6 h-6" />
              </div>
              <h4 className="text-slate-200 font-semibold text-sm mb-1">Nakahandang Patakbuhin</h4>
              <p className="text-xs text-slate-400 mb-4">
                I-click ang &quot;Patakbuhin ang Simulation&quot; para makita ang live browser workflow:
                <br />
                <span className="text-cyan-400 font-mono text-[11px]">smdc.com</span> →{' '}
                <span className="text-amber-400 font-mono text-[11px]">1000ms delay</span> →{' '}
                <span className="text-emerald-400 font-mono text-[11px]">y8.com</span>
              </p>
              <button
                onClick={startSimulation}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg cursor-pointer transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Simulan ang Demo
              </button>
            </div>
          )}

          {stage === 'opening' && (
            <div className="flex flex-col items-center gap-3 animate-fade-in">
              <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono text-slate-300">
                Lumalunsad ang Chromium window (1280x800)...
              </p>
            </div>
          )}

          {/* SMDC SITE VISUAL MOCKUP */}
          {(stage === 'smdc' || stage === 'waiting' || stage === 'redirecting') && (
            <div className="w-full h-full flex flex-col animate-fade-in text-left">
              {/* SMDC mock header */}
              <div className="bg-[#00264d] text-white p-3 rounded-lg flex items-center justify-between border border-blue-900/60 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="font-extrabold tracking-widest text-lg text-amber-400 flex items-center gap-1.5">
                    <span className="bg-amber-400 text-[#00264d] text-xs font-black px-1.5 py-0.5 rounded">SMDC</span>
                    <span className="text-xs font-semibold tracking-normal text-slate-200">The Good Guys</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-300 hidden sm:flex">
                  <span className="hover:text-amber-300 cursor-pointer">Properties</span>
                  <span className="hover:text-amber-300 cursor-pointer">Locations</span>
                  <span className="hover:text-amber-300 cursor-pointer">Virtual Tours</span>
                  <span className="bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded text-[10px]">Inquire Now</span>
                </div>
              </div>

              {/* SMDC mock banner with timer overlay */}
              <div className="relative mt-3 rounded-lg overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 p-6 flex flex-col justify-center">
                <div className="max-w-md">
                  <span className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                    Official Residential Showcase
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    Your Dream Home in Prime Locations
                  </h2>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    Resort-styled living and premier condominium developments across Metro Manila and surrounding hubs.
                  </p>
                </div>

                {/* The 1000ms Countdown Indicator Box */}
                {stage === 'waiting' && (
                  <div className="mt-4 p-3 bg-amber-950/70 border border-amber-500/60 rounded-lg flex items-center justify-between gap-4 backdrop-blur-md">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-300">
                        <Clock className="w-4 h-4 animate-spin" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                          Hakbang 3: Naghihintay ng 1000ms (1 segundo)
                        </div>
                        <div className="text-[11px] text-amber-300/80">
                          Naka-load ang SMDC site habang tumatakbo ang timer
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-mono font-bold text-amber-300">
                        {countdownRemainingMs} <span className="text-xs font-sans">ms</span>
                      </div>
                      <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-amber-400 transition-all duration-75"
                          style={{ width: `${Math.min(100, (elapsedMs / config.waitDurationMs) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {stage === 'redirecting' && (
                  <div className="mt-4 p-3 bg-cyan-950/70 border border-cyan-500/60 rounded-lg flex items-center justify-center gap-2 text-cyan-300 font-medium text-xs">
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span>Lumilipat ang parehong tab patungo sa Y8.com...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Y8 SITE VISUAL MOCKUP */}
          {(stage === 'y8' || stage === 'completed') && (
            <div className="w-full h-full flex flex-col animate-fade-in text-left">
              {/* Y8 Header */}
              <div className="bg-[#1f2128] text-white p-3 rounded-lg flex items-center justify-between border border-slate-800 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-br from-red-600 to-rose-700 font-black text-xl px-2.5 py-0.5 rounded text-white tracking-tight shadow">
                    Y8
                  </div>
                  <span className="text-xs font-bold text-slate-300 tracking-wide">GAMES</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">🎮 Action</span>
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">🏎️ Driving</span>
                  <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">🕹️ 2 Player</span>
                  <span className="px-2.5 py-1 rounded bg-red-600 text-white font-semibold">Play Now</span>
                </div>
              </div>

              {/* Y8 Games Grid Mock */}
              <div className="mt-3 p-4 bg-slate-900/90 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    🔥 Popular Games on Y8
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">Redirect Successful (Same Tab)</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {[
                    { title: 'Slope', tag: '3D Runner', bg: 'from-cyan-900 to-blue-950' },
                    { title: 'Moto X3M', tag: 'Racing', bg: 'from-amber-900 to-orange-950' },
                    { title: 'Bad Ice-Cream', tag: 'Arcade', bg: 'from-sky-900 to-cyan-950' },
                    { title: 'Fireboy & Watergirl', tag: 'Co-op', bg: 'from-rose-900 to-red-950' },
                  ].map((game, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-lg bg-gradient-to-br ${game.bg} border border-slate-700/60 flex flex-col justify-between h-20 shadow`}
                    >
                      <span className="text-[10px] text-slate-300">{game.tag}</span>
                      <div className="font-semibold text-xs text-white truncate">{game.title}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Success Banner */}
              <div className="mt-3 p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-lg flex items-center justify-between text-xs text-emerald-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Eksaktong nasunod ang 4 na hakbang ng Playwright script!
                </span>
                <span className="font-mono text-[11px] text-emerald-400/90">
                  Target: {config.destUrl}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Synchronized Terminal Output */}
      <div className="mt-4 bg-slate-950 rounded-xl border border-slate-800 p-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[11px]">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Python Execution Console Output</span>
          </div>
          <span className="text-slate-500">Live Stdout</span>
        </div>

        <div
          ref={logsEndRef}
          className="h-28 overflow-y-auto space-y-1.5 pr-2 select-text scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
        >
          {logs.length === 0 ? (
            <p className="text-slate-600 italic">Pindutin ang &quot;Patakbuhin ang Simulation&quot; para makita ang live execution logs dito...</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-slate-600 text-[10px] shrink-0">{log.timestamp}</span>
                <span
                  className={
                    log.type === 'system'
                      ? 'text-slate-400'
                      : log.type === 'nav'
                      ? 'text-cyan-300'
                      : log.type === 'timer'
                      ? 'text-amber-300'
                      : 'text-emerald-400 font-semibold'
                  }
                >
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
