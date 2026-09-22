export type FrameworkType = 'playwright-sync' | 'playwright-async' | 'selenium';

export type BrowserEngine = 'chromium' | 'firefox' | 'webkit';

export type WaitUntilOption = 'domcontentloaded' | 'load' | 'commit';

export type PostRedirectAction = 'wait_then_close' | 'keep_open_until_enter' | 'keep_open_indefinitely';

export interface ScriptConfig {
  framework: FrameworkType;
  startUrl: string;
  destUrl: string;
  waitDurationMs: number;
  browserEngine: BrowserEngine;
  headless: boolean;
  waitUntil: WaitUntilOption;
  postRedirectAction: PostRedirectAction;
  postRedirectWaitSec: number;
  slowMoMs: number;
  viewportWidth: number;
  viewportHeight: number;
}

export interface SimulationStep {
  id: string;
  timeOffsetMs: number;
  label: string;
  type: 'info' | 'nav' | 'wait' | 'success';
}
