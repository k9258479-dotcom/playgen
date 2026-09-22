import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Sparkles, Terminal, BookOpen, Layers } from 'lucide-react';
import { ScriptConfig, FrameworkType } from '../types';
import { generatePythonScript, generateRequirementsTxt } from '../utils/codeGenerator';

interface Props {
  config: ScriptConfig;
  onChangeFramework: (framework: FrameworkType) => void;
}

export const CodeViewer: React.FC<Props> = ({ config, onChangeFramework }) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedRequirements, setCopiedRequirements] = useState(false);
  const [activeTab, setActiveTab] = useState<'script' | 'requirements'>('script');

  const pythonCode = generatePythonScript(config);
  const requirementsTxt = generateRequirementsTxt(config.framework);

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(pythonCode);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleCopyRequirements = async () => {
    try {
      await navigator.clipboard.writeText(requirementsTxt);
      setCopiedRequirements(true);
      setTimeout(() => setCopiedRequirements(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleDownloadPy = () => {
    const filename = config.framework.includes('playwright') ? 'playwright_redirect.py' : 'selenium_redirect.py';
    const blob = new Blob([pythonCode], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadRequirements = () => {
    const blob = new Blob([requirementsTxt], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'requirements.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-2xl backdrop-blur-xl">
      {/* Top Header & Framework Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-base sm:text-lg">
              Buong Python Code & Dependencies
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pumili sa pagitan ng Playwright (Inirerekomenda) at Selenium WebDriver.
          </p>
        </div>

        {/* Framework Selection Pills */}
        <div className="flex flex-wrap items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => onChangeFramework('playwright-sync')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              config.framework === 'playwright-sync'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Playwright (Sync)
            <span className="text-[10px] bg-slate-900/80 px-1.5 py-0.2 rounded text-cyan-200 ml-0.5 hidden sm:inline">
              Best
            </span>
          </button>

          <button
            onClick={() => onChangeFramework('playwright-async')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              config.framework === 'playwright-async'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Playwright (Async)
          </button>

          <button
            onClick={() => onChangeFramework('selenium')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              config.framework === 'selenium'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Selenium
          </button>
        </div>
      </div>

      {/* Code / Requirements Toggle & Action Buttons */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('script')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'script'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            {config.framework.includes('playwright') ? 'playwright_redirect.py' : 'selenium_redirect.py'}
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'requirements'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            requirements.txt
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'script' ? (
            <>
              <button
                id="copy-code-btn"
                onClick={handleCopyScript}
                className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shadow-md"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5 text-slate-950" />}
                <span>{copiedScript ? 'Nakopya na!' : 'Kopyahin ang Code'}</span>
              </button>
              <button
                onClick={handleDownloadPy}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer border border-slate-700"
                title="I-download ang .py file"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">I-download</span> .py
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCopyRequirements}
                className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
              >
                {copiedRequirements ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5 text-slate-950" />}
                <span>{copiedRequirements ? 'Nakopya na!' : 'Kopyahin'}</span>
              </button>
              <button
                onClick={handleDownloadRequirements}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>requirements.txt</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Code Display Frame with Line Numbers */}
      <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs">
        <div className="p-4 overflow-x-auto max-h-[440px] scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {activeTab === 'script' ? (
            <pre className="text-slate-300 leading-relaxed font-mono">
              <code>
                {pythonCode.split('\n').map((line, idx) => {
                  const isComment = line.trim().startsWith('#') || line.trim().startsWith('"""') || line.trim().startsWith('*');
                  const isImport = line.startsWith('import ') || line.startsWith('from ');
                  const isFunction = line.includes('def ') || line.includes('async def ');
                  const isPageAction = line.includes('page.goto') || line.includes('page.wait_for_timeout') || line.includes('driver.get');

                  return (
                    <div key={idx} className="table-row hover:bg-slate-900/60">
                      <span className="table-cell select-none pr-4 text-slate-600 text-right w-8 text-[11px]">
                        {idx + 1}
                      </span>
                      <span
                        className={`table-cell whitespace-pre ${
                          isComment
                            ? 'text-slate-500 italic'
                            : isImport
                            ? 'text-purple-400'
                            : isFunction
                            ? 'text-blue-300 font-semibold'
                            : isPageAction
                            ? 'text-cyan-300 font-medium'
                            : line.includes('print(')
                            ? 'text-amber-300'
                            : 'text-slate-200'
                        }`}
                      >
                        {line}
                      </span>
                    </div>
                  );
                })}
              </code>
            </pre>
          ) : (
            <pre className="text-slate-300 leading-relaxed p-2 font-mono">
              <code>{requirementsTxt}</code>
            </pre>
          )}
        </div>
      </div>

      {/* Key Architectural Tip */}
      <div className="mt-4 p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl flex items-start gap-3 text-xs text-slate-300">
        <BookOpen className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-cyan-300 font-semibold">Pro-tip sa Playwright:</strong> Gamitin ang{' '}
          <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300 font-mono">page.wait_for_timeout(1000)</code> sa halip na{' '}
          <code className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 font-mono">time.sleep(1)</code>. Ang{' '}
          <code className="text-cyan-300">wait_for_timeout</code> ay integrated sa internal event loop ng Playwright kaya hindi ito nagba-block ng asynchronous DOM updates o network events habang naghihintay.
        </div>
      </div>
    </div>
  );
};
