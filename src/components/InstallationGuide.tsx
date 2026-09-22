import React, { useState } from 'react';
import { Terminal, Check, Copy, AlertCircle, HelpCircle, ShieldAlert, CheckCircle } from 'lucide-react';
import { generateInstallCommands } from '../utils/codeGenerator';

interface Props {
  framework: string;
}

export const InstallationGuide: React.FC<Props> = ({ framework }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const commands = generateInstallCommands(framework);

  const copyCommand = (cmd: string, index: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-800">
        <Terminal className="w-5 h-5 text-emerald-400" />
        <div>
          <h3 className="font-bold text-slate-100 text-base">
            Gabay sa Pag-install at Pagpapatakbo (Terminal Commands)
          </h3>
          <p className="text-xs text-slate-400">
            Sundin ang mga simpleng hakbang na ito sa iyong Command Prompt, PowerShell, o Terminal.
          </p>
        </div>
      </div>

      {/* Step-by-step commands */}
      <div className="space-y-3.5">
        {commands.map((step, idx) => (
          <div key={idx} className="bg-slate-950 rounded-xl p-3.5 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-200">{step.title}</span>
              <button
                onClick={() => copyCommand(step.cmd, idx)}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono transition cursor-pointer"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Nakopya!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Kopyahin</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-900 rounded-lg p-2.5 font-mono text-xs text-emerald-300 border border-slate-800 flex items-center justify-between">
              <code>{step.cmd}</code>
            </div>
          </div>
        ))}
      </div>

      {/* Critical Note for Playwright */}
      {framework.includes('playwright') ? (
        <div className="mt-4 p-3.5 bg-amber-950/30 border border-amber-500/40 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-300 block mb-1">
              Paalala: Huwag kalimutan ang &quot;playwright install&quot;!
            </strong>
            Hindi sapat ang <code className="text-amber-200 font-mono bg-slate-950 px-1 rounded">pip install playwright</code> lamang. Kailangan ding patakbuhin ang{' '}
            <code className="text-amber-200 font-mono bg-slate-950 px-1 rounded">playwright install</code> para mai-download ng Playwright ang opisyal na Chromium/Chrome browser engine.
          </div>
        </div>
      ) : (
        <div className="mt-4 p-3.5 bg-cyan-950/30 border border-cyan-500/40 rounded-xl flex items-start gap-3">
          <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-cyan-300 block mb-1">Awtomatikong ChromeDriver:</strong>
            Gamit ang <code className="text-cyan-200 font-mono bg-slate-950 px-1 rounded">webdriver-manager</code>, hindi mo na kailangang manu-manong maghanap o mag-download ng tamang bersyon ng chromedriver.exe. Awtomatiko itong iaakma sa bersyon ng iyong Google Chrome!
          </div>
        </div>
      )}

      {/* FAQ / Troubleshooting details */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          Mga Madalas Itanong (Troubleshooting FAQs)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-400">
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/60">
            <strong className="text-slate-200 block mb-1">
              Bakit mabilis mag-timeout ang SMDC website?
            </strong>
            Dahil mabigat at maraming video/image assets ang smdc.com. Kaya idinagdag natin ang{' '}
            <code className="text-cyan-300 font-mono">wait_until=&quot;domcontentloaded&quot;</code> para masiguradong hindi ito mag-e-error kahit mabagal ang loading ng mga banner.
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/60">
            <strong className="text-slate-200 block mb-1">
              Bakit biglang sumasara ang browser pagkalipat sa Y8?
            </strong>
            Kusang nagtatapos ang script sa Python kapag natapos ang code block. Para manatili itong bukas, may kasamang{' '}
            <code className="text-cyan-300 font-mono">input(&quot;Press Enter to close: &quot;)</code> o configurable wait timer sa ating code.
          </div>
        </div>
      </div>
    </div>
  );
};
