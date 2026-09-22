import React, { useState, useEffect } from 'react';
import { CodeViewer } from './components/CodeViewer';
import { InteractiveSimulator } from './components/InteractiveSimulator';
import { ConfigPanel } from './components/ConfigPanel';
import { InstallationGuide } from './components/InstallationGuide';
import { LinkGenerator } from './components/LinkGenerator';
import { AutoRedirectRunner } from './components/AutoRedirectRunner';
import { ScriptConfig, FrameworkType } from './types';
import {
  Code2,
  Tv,
  Settings,
  Terminal,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Bot,
  Link as LinkIcon,
  Play
} from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<ScriptConfig>({
    framework: 'playwright-sync',
    startUrl: 'https://www.smdc.com',
    destUrl: 'https://www.y8.com',
    waitDurationMs: 1000,
    browserEngine: 'chromium',
    headless: false,
    waitUntil: 'domcontentloaded',
    postRedirectAction: 'keep_open_until_enter',
    postRedirectWaitSec: 5,
    slowMoMs: 50,
    viewportWidth: 1280,
    viewportHeight: 800,
  });

  const [activeView, setActiveView] = useState<'all' | 'link' | 'code' | 'simulator' | 'guide'>('all');
  const [showRunnerModal, setShowRunnerModal] = useState<boolean>(false);

  // Check URL params on initial load (e.g. ?run=1&start=...&dest=...&delay=1000)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const shouldRun = params.get('run') === '1';
      const customStart = params.get('start');
      const customDest = params.get('dest');
      const customDelay = params.get('delay');

      if (customStart || customDest || customDelay) {
        setConfig((prev) => ({
          ...prev,
          startUrl: customStart || prev.startUrl,
          destUrl: customDest || prev.destUrl,
          waitDurationMs: customDelay ? parseInt(customDelay, 10) : prev.waitDurationMs,
        }));
      }

      if (shouldRun) {
        setShowRunnerModal(true);
      }
    } catch (e) {
      console.error('URL params parse error:', e);
    }
  }, []);

  const handleConfigUpdate = (updated: Partial<ScriptConfig>) => {
    setConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleFrameworkChange = (framework: FrameworkType) => {
    setConfig((prev) => ({ ...prev, framework }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Auto Redirect Runner Modal (Kapag binuksan ang generated link) */}
      {showRunnerModal && (
        <AutoRedirectRunner
          startUrl={config.startUrl}
          destUrl={config.destUrl}
          delayMs={config.waitDurationMs}
          onClose={() => setShowRunnerModal(false)}
        />
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-2 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg text-white tracking-tight">
                  Playwright Browser Automator
                </h1>
                <span className="text-[10px] bg-cyan-950 text-cyan-400 font-mono px-2 py-0.5 rounded-full border border-cyan-800/40 hidden sm:inline-block">
                  Python + 1-Link
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                SMDC → 1000ms delay → Y8.com automated redirect generator
              </p>
            </div>
          </div>

          {/* View Mode Filters */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveView('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                activeView === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Lahat
            </button>
            <button
              onClick={() => setActiveView('link')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'link'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              Generate Link
            </button>
            <button
              onClick={() => setActiveView('code')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'code'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Python Code
            </button>
            <button
              onClick={() => setActiveView('simulator')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'simulator'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              Simulator
            </button>
            <button
              onClick={() => setActiveView('guide')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'guide'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Install Guide
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Step Flow Ribbon */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider bg-slate-950 px-2 py-1 rounded border border-slate-800">
              Target Flow
            </span>

            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>1. {config.startUrl.replace('https://', '')}</span>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />

            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-amber-800/40 text-amber-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>2. Maghintay ng {config.waitDurationMs}ms (1s)</span>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />

            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-emerald-800/40 text-emerald-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>3. Lilipat sa {config.destUrl.replace('https://', '')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setShowRunnerModal(true)}
              className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer shadow"
            >
              <Play className="w-3 h-3 fill-current" />
              Subukan ang 1-Link
            </button>
            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded font-semibold text-[11px]">
              Visible Browser
            </span>
          </div>
        </div>

        {/* 1-Link Generator Section */}
        {(activeView === 'all' || activeView === 'link') && (
          <LinkGenerator
            config={config}
            onUpdateConfig={handleConfigUpdate}
            onTriggerRunner={() => setShowRunnerModal(true)}
          />
        )}

        {/* View Switcher Sections */}
        {(activeView === 'all' || activeView === 'simulator') && (
          <InteractiveSimulator config={config} />
        )}

        {(activeView === 'all' || activeView === 'code') && (
          <CodeViewer config={config} onChangeFramework={handleFrameworkChange} />
        )}

        {(activeView === 'all' || activeView === 'guide') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <InstallationGuide framework={config.framework} />
            </div>
            <div className="lg:col-span-5">
              <ConfigPanel config={config} onChange={handleConfigUpdate} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Binuo gamit ang Playwright & Selenium para sa automated browser workflows. May kasamang 1-Link redirect generator.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Playwright Python Sync / Async</span>
            <span>•</span>
            <span>1-Link Web Runner</span>
            <span>•</span>
            <span>Selenium WebDriver</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
