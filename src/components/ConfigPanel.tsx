import React from 'react';
import { Sliders, Globe, Clock, Monitor, Eye, Settings2, PlayCircle } from 'lucide-react';
import { ScriptConfig, BrowserEngine, WaitUntilOption, PostRedirectAction } from '../types';

interface Props {
  config: ScriptConfig;
  onChange: (updated: Partial<ScriptConfig>) => void;
}

export const ConfigPanel: React.FC<Props> = ({ config, onChange }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
        <Sliders className="w-5 h-5 text-cyan-400" />
        <div>
          <h3 className="font-bold text-slate-100 text-base">I-configure ang Script Parameters</h3>
          <p className="text-xs text-slate-400">
            Awtomatikong mag-a-update ang Python code at ang live simulator ayon sa mga setting dito.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            1. Unang Website (Start URL)
          </label>
          <input
            type="text"
            value={config.startUrl}
            onChange={(e) => onChange({ startUrl: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 transition"
            placeholder="https://www.smdc.com"
          />
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Preset:</span>
            <button
              onClick={() => onChange({ startUrl: 'https://www.smdc.com' })}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              https://www.smdc.com
            </button>
          </div>
        </div>

        {/* Destination URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            2. Pangalawang Website (Destination URL)
          </label>
          <input
            type="text"
            value={config.destUrl}
            onChange={(e) => onChange({ destUrl: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg px-3 py-2 text-xs font-mono text-emerald-300 transition"
            placeholder="https://www.y8.com"
          />
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Preset:</span>
            <button
              onClick={() => onChange({ destUrl: 'https://www.y8.com' })}
              className="text-emerald-400 hover:underline cursor-pointer"
            >
              https://www.y8.com
            </button>
          </div>
        </div>

        {/* Wait Duration */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              3. Tagal ng Paghihintay (Milliseconds)
            </label>
            <span className="text-xs font-mono text-amber-300 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {config.waitDurationMs} ms ({(config.waitDurationMs / 1000).toFixed(1)}s)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min="200"
              max="10000"
              step="100"
              value={config.waitDurationMs}
              onChange={(e) => onChange({ waitDurationMs: Number(e.target.value) })}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-500">Presets:</span>
            {[
              { label: '500ms', val: 500 },
              { label: '1000ms (1s default)', val: 1000 },
              { label: '2000ms (2s)', val: 2000 },
              { label: '3000ms (3s)', val: 3000 },
            ].map((p) => (
              <button
                key={p.val}
                onClick={() => onChange({ waitDurationMs: p.val })}
                className={`px-2 py-0.5 rounded text-[10px] transition cursor-pointer ${
                  config.waitDurationMs === p.val
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Browser Choice & Visibility */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-purple-400" />
            4. Browser Engine & Mode
          </label>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={config.browserEngine}
              onChange={(e) => onChange({ browserEngine: e.target.value as BrowserEngine })}
              className="bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-slate-200"
            >
              <option value="chromium">Chromium / Chrome</option>
              <option value="firefox">Firefox</option>
              <option value="webkit">WebKit (Safari engine)</option>
            </select>

            <button
              type="button"
              onClick={() => onChange({ headless: !config.headless })}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                !config.headless
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{!config.headless ? 'Visible (Headful)' : 'Hidden (Headless)'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Naka-set sa <strong>Visible mode (headless=False)</strong> alinsunod sa kahilingan mo para makikita mo ang pagbukas ng browser.
          </p>
        </div>

        {/* Navigation Wait Strategy */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5 text-blue-400" />
            5. Playwright Navigation Event (wait_until)
          </label>
          <select
            value={config.waitUntil}
            onChange={(e) => onChange({ waitUntil: e.target.value as WaitUntilOption })}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-slate-200"
          >
            <option value="domcontentloaded">domcontentloaded (Mabilis & Ligtas sa mabagal na net)</option>
            <option value="commit">commit (Agad na maghintay habang nagda-download pa ang site)</option>
            <option value="load">load (Maghintay munang matapos ang buong page bago ang 1s timer)</option>
          </select>
        </div>

        {/* Post-redirect Action */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <PlayCircle className="w-3.5 h-3.5 text-rose-400" />
            6. Pagkatapos Makalipat sa Y8
          </label>
          <select
            value={config.postRedirectAction}
            onChange={(e) => onChange({ postRedirectAction: e.target.value as PostRedirectAction })}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-slate-200"
          >
            <option value="keep_open_until_enter">Panatilihing bukas (Pindutin ang ENTER sa terminal para isara)</option>
            <option value="wait_then_close">Maghintay ng 5 segundo bago kusang isara</option>
            <option value="keep_open_indefinitely">Huwag isara ang browser (page.pause)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
