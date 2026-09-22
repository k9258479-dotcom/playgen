import React, { useState, useEffect } from 'react';
import {
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
  Download,
  Sparkles,
  Share2,
  Clock,
  ArrowRight,
  Globe,
  FileCode,
  QrCode
} from 'lucide-react';
import { ScriptConfig } from '../types';

interface Props {
  config: ScriptConfig;
  onUpdateConfig: (updated: Partial<ScriptConfig>) => void;
  onTriggerRunner: () => void;
}

export const LinkGenerator: React.FC<Props> = ({ config, onUpdateConfig, onTriggerRunner }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedDataUri, setCopiedDataUri] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Generate web app runner link
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-i5rkwgtlwxyvqkbumzan3u-881980043485.asia-east1.run.app';
  const queryParams = new URLSearchParams({
    run: '1',
    start: config.startUrl,
    dest: config.destUrl,
    delay: String(config.waitDurationMs),
  });
  const generatedSingleLink = `${currentOrigin}/?${queryParams.toString()}`;

  // Generate pure standalone HTML code for redirect file showing authentic SMDC layout
  const standaloneHtmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SMDC - The Good Guys | SM Development Corporation</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background-color: #001733; color: #ffffff; min-height: 100vh; display: flex; flex-direction: column; }
    
    /* Sticky Top Notification Bar */
    .redirect-bar {
      position: sticky; top: 0; z-index: 9999;
      background: #090d16; border-bottom: 2px solid #f59e0b;
      padding: 10px 20px; display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5); font-size: 13px;
    }
    .redirect-info { display: flex; align-items: center; gap: 10px; }
    .timer-pill { background: #1e293b; color: #fbbf24; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-family: monospace; border: 1px solid #d97706; }
    .dest-btn { background: #10b981; color: #022c22; text-decoration: none; font-weight: bold; padding: 6px 12px; border-radius: 6px; font-size: 12px; }

    /* SMDC Header */
    .smdc-header { background: #002244; border-bottom: 1px solid #1e3a8a; }
    .smdc-topbar { padding: 6px 24px; font-size: 11px; color: #93c5fd; display: flex; justify-content: space-between; border-bottom: 1px solid #0f2d59; }
    .smdc-nav { max-width: 1200px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; }
    .logo-box { display: flex; align-items: center; gap: 12px; }
    .logo-badge { background: #f59e0b; color: #002244; font-weight: 900; font-size: 22px; padding: 2px 10px; border-radius: 4px; letter-spacing: -1px; }
    .logo-text { border-left: 1px solid #1e40af; padding-left: 12px; }
    .logo-tag { font-size: 13px; font-weight: 700; letter-spacing: 1px; color: white; display: block; }
    .logo-sub { font-size: 10px; color: #93c5fd; display: block; }
    .nav-links { display: flex; gap: 20px; font-size: 13px; font-weight: 500; }
    .nav-links a { color: #e2e8f0; text-decoration: none; }
    .inquire-btn { background: #f59e0b; color: #0f172a; font-weight: bold; border: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; cursor: pointer; }

    /* SMDC Hero */
    .smdc-hero { padding: 48px 24px; max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; align-items: center; }
    .hero-tag { display: inline-block; background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); padding: 4px 12px; border-radius: 50px; font-size: 11px; margin-bottom: 16px; }
    .hero-title { font-size: 42px; font-weight: 800; line-height: 1.15; margin-bottom: 16px; }
    .hero-title span { color: #f59e0b; }
    .hero-desc { font-size: 14px; color: #cbd5e1; line-height: 1.6; margin-bottom: 24px; }
    
    /* Search Box */
    .search-card { background: #002244; border: 1px solid #1e3a8a; padding: 18px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
    .search-card select, .search-card button { padding: 10px; border-radius: 6px; border: 1px solid #1e3a8a; background: #001733; color: white; font-size: 12px; }
    .search-card button { background: #f59e0b; color: #020617; font-weight: bold; border: none; cursor: pointer; }

    /* Condo Card */
    .condo-card { background: linear-gradient(180deg, #002d5e 0%, #001b38 100%); border: 1px solid #2563eb; border-radius: 16px; padding: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .condo-preview { height: 180px; background: linear-gradient(135deg, #0f172a, #1e3a8a); border-radius: 10px; padding: 16px; display: flex; flex-direction: column; justify-content: flex-end; margin-bottom: 16px; }

    /* Footer */
    .smdc-footer { margin-top: auto; background: #001024; border-top: 1px solid #0f2d59; padding: 20px; text-align: center; font-size: 11px; color: #64748b; }
  </style>
</head>
<body>

  <!-- Top Sticky Automation Status -->
  <div class="redirect-bar">
    <div class="redirect-info">
      <strong>SMDC Site Nakabukas</strong>
      <span>•</span>
      <span>Awtomatikong lilipat sa <b style="color: #34d399;">${config.destUrl}</b> pagkatapos ng 1 segundo:</span>
      <span class="timer-pill" id="countdown">${config.waitDurationMs}ms</span>
    </div>
    <a href="${config.destUrl}" class="dest-btn">Buksan agad ang Y8 &rarr;</a>
  </div>

  <!-- SMDC Official Header -->
  <header class="smdc-header">
    <div class="smdc-topbar">
      <span>Hotline: +63 (2) 8858-0300 &bull; SM Prime Real Estate Developer</span>
      <span>Official Portal &bull; Buyer's Guide</span>
    </div>
    <div class="smdc-nav">
      <div class="logo-box">
        <div class="logo-badge">SMDC</div>
        <div class="logo-text">
          <span class="logo-tag">THE GOOD GUYS</span>
          <span class="logo-sub">SM Development Corporation</span>
        </div>
      </div>
      <nav class="nav-links">
        <a href="#">Properties</a>
        <a href="#">Locations</a>
        <a href="#">Promos</a>
        <a href="#">360° Tours</a>
      </nav>
      <button class="inquire-btn">Inquire Now</button>
    </div>
  </header>

  <!-- SMDC Hero Section -->
  <main class="smdc-hero">
    <div>
      <span class="hero-tag">&#10024; Premier Resort-Style Living</span>
      <h1 class="hero-title">Step Into Your Dream Home with <span>SMDC</span></h1>
      <p class="hero-desc">
        Experience integrated communities with masterplanned luxury residences, lush landscaping, and direct access to SM Malls across Metro Manila and key provinces.
      </p>

      <div class="search-card">
        <div style="font-weight: 600; font-size: 12px; margin-bottom: 10px; color: #e2e8f0;">Maghanap ng SMDC Condominium</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px;">
          <select><option>Mall of Asia Complex, Pasay</option><option>Makati City</option><option>Quezon City</option></select>
          <select><option>Pre-Selling Condos</option><option>Ready For Occupancy (RFO)</option></select>
          <button>Search</button>
        </div>
      </div>
    </div>

    <div>
      <div class="condo-card">
        <div class="condo-preview">
          <div style="background: rgba(0,0,0,0.6); padding: 4px 8px; border-radius: 4px; font-size: 10px; color: #fbbf24; width: fit-content; margin-bottom: 6px;">Featured Property</div>
          <h3 style="font-size: 20px; font-weight: bold;">Sail Residences</h3>
          <p style="font-size: 11px; color: #94a3b8;">Mall of Asia Complex, Pasay City</p>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #cbd5e1;">
          <span>Starts at <b>&#8369;18,500/month</b></span>
          <span style="color: #38bdf8;">View Details &rarr;</span>
        </div>
      </div>
    </div>
  </main>

  <footer class="smdc-footer">
    &copy; 2026 SM Development Corporation (SMDC). All rights reserved. Redirecting to Y8...
  </footer>

  <script>
    let remaining = ${config.waitDurationMs};
    const timerElem = document.getElementById('countdown');
    const interval = setInterval(() => {
      remaining -= 50;
      if (remaining <= 0) {
        clearInterval(interval);
        timerElem.innerText = "0ms - Lilipat na...";
        // Awtomatikong lilipat sa parehong tab patungo sa Y8.com
        window.location.replace("${config.destUrl}");
      } else {
        timerElem.innerText = remaining + "ms";
      }
    }, 50);
  </script>
</body>
</html>`;

  // Data URI for instant browser address bar opening
  const dataUriLink = `data:text/html;charset=utf-8,${encodeURIComponent(standaloneHtmlCode)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedSingleLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyDataUri = async () => {
    try {
      await navigator.clipboard.writeText(dataUriLink);
      setCopiedDataUri(true);
      setTimeout(() => setCopiedDataUri(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([standaloneHtmlCode], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smdc_to_y8_redirect.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-cyan-950/40 border border-cyan-500/30 rounded-2xl p-4 lg:p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <LinkIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-base sm:text-lg flex items-center gap-2">
              Generated Single Link (Isang Link na Bubuksan)
              <span className="text-[11px] bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-2 py-0.5 rounded-full shadow-sm">
                Ready to Open
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Sa pamamagitan ng nag-iisang link na ito, kapag binuksan sa browser ay <strong className="text-amber-300">makikita muna ang buong SMDC website</strong> (header, logo, search bar, at condo properties), magbibilang nang eksaktong 1 segundo, at awtomatikong lilipat sa Y8.
          </p>
        </div>

        {/* Action button to test immediately */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerRunner}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-emerald-950/50"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Subukan / Buksan ang Link Ngayon</span>
          </button>
        </div>
      </div>

      {/* Primary Generated URL Display Box */}
      <div className="bg-slate-950 border border-cyan-500/40 rounded-xl p-3 sm:p-4 mb-4 shadow-inner">
        <div className="flex items-center justify-between gap-2 mb-2 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            I-share o Buksan ang URL na Ito sa Anumang Browser:
          </span>
          <span className="text-[11px] text-cyan-400 font-mono">
            Auto-Executes: SMDC → 1000ms → Y8
          </span>
        </div>

        {/* Input box with full URL */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 break-all select-all flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="truncate">{generatedSingleLink}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              id="copy-generated-link-btn"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs transition cursor-pointer shadow"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Nakopya na!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kopyahin ang Link</span>
                </>
              )}
            </button>

            <a
              href={generatedSingleLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition flex items-center justify-center border border-slate-700"
              title="Buksan sa Bagong Tab"
            >
              <ExternalLink className="w-4 h-4 text-cyan-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Visual Sequence of What the Single Link Does */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-semibold text-slate-200">Hakbang 1: Pag-click ng Link</span>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded font-mono">0ms</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Lalabas agad sa buong screen ang opisyal na SMDC website (navy blue header, "The Good Guys", at luxury condos).
          </p>
        </div>

        <div className="bg-slate-950/80 border border-amber-900/40 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-300 mb-1">
            <span className="font-semibold flex items-center gap-1 text-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Hakbang 2: 1-Segundong Delay
            </span>
            <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded font-mono">1000ms</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Maghihintay nang eksaktong 1,000 milliseconds habang nakabukas at naglo-load ang SMDC.
          </p>
        </div>

        <div className="bg-slate-950/80 border border-emerald-900/40 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-300 mb-1">
            <span className="font-semibold text-emerald-200">Hakbang 3: Auto-Redirect</span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono">Parehong Tab</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Pagpatak ng ika-1 segundo, kusa nitong ililipat ang buong tab papunta sa {config.destUrl.replace('https://', '')}.
          </p>
        </div>
      </div>

      {/* Alternative Formats: 1-Click HTML File & Data URI */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadHtml}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition cursor-pointer border border-slate-700"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>I-download ang 1-Click .html File</span>
          </button>

          <button
            onClick={handleCopyDataUri}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition cursor-pointer border border-slate-700"
          >
            {copiedDataUri ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileCode className="w-3.5 h-3.5 text-amber-400" />}
            <span>{copiedDataUri ? 'Nakopya ang Data URI!' : 'Kopyahin bilang Data URI Bookmark'}</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400">
          Maaari mo ring i-bookmark o i-share ang link na ito sa sinuman.
        </div>
      </div>
    </div>
  );
};
