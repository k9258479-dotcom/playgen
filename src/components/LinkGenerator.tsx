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

  // Generate pure standalone HTML code for redirect file
  const standaloneHtmlCode = `<!DOCTYPE html>
<html lang="tl">
<head>
  <meta charset="UTF-8">
  <title>Browser Redirect: SMDC to Y8</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: system-ui, sans-serif; background: #020617; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .box { background: #0f172a; border: 1px solid #1e293b; padding: 2rem; border-radius: 1rem; max-width: 460px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    .timer { font-size: 2rem; font-weight: bold; color: #fbbf24; margin: 1rem 0; font-family: monospace; }
    .url { color: #38bdf8; word-break: break-all; font-size: 0.9rem; }
    .btn { background: #0284c7; color: white; padding: 0.6rem 1.2rem; border-radius: 0.5rem; text-decoration: none; display: inline-block; margin-top: 1rem; font-weight: 600; }
  </style>
</head>
<body>
  <div class="box">
    <h2>1-Link Browser Automator</h2>
    <p>1. Binuksan ang: <span class="url">${config.startUrl}</span></p>
    <p>2. Naghihintay ng eksaktong <strong>${config.waitDurationMs}ms (1 segundo)</strong>...</p>
    <div class="timer" id="countdown">${config.waitDurationMs}ms</div>
    <p>3. Lilipat sa: <span class="url">${config.destUrl}</span></p>
  </div>
  <script>
    let remaining = ${config.waitDurationMs};
    const timerElem = document.getElementById('countdown');
    const interval = setInterval(() => {
      remaining -= 50;
      if (remaining <= 0) {
        clearInterval(interval);
        timerElem.innerText = "Redirecting now...";
        // Awtomatikong lilipat sa Y8.com
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
            Sa pamamagitan ng nag-iisang link na ito, kapag binuksan sa browser ay kusa nitong susundin ang daloy: bubuksan ang SMDC, magbibilang ng 1 segundo, at awtomatikong lilipat sa Y8.
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
            Bubuksan ang browser tab at maglo-load ang unang website ({config.startUrl.replace('https://', '')}).
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
