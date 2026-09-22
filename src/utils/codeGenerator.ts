import { ScriptConfig } from '../types';

export function generatePythonScript(config: ScriptConfig): string {
  const {
    framework,
    startUrl,
    destUrl,
    waitDurationMs,
    browserEngine,
    headless,
    waitUntil,
    postRedirectAction,
    postRedirectWaitSec,
  } = config;

  if (framework === 'playwright-sync') {
    let postCloseCode = '';
    if (postRedirectAction === 'wait_then_close') {
      postCloseCode = `        # 4. Hayaang nakabukas sandali (${postRedirectWaitSec} segundo) bago isara
        print(f"Mananatiling bukas ng {${postRedirectWaitSec}} segundo...")
        page.wait_for_timeout(${postRedirectWaitSec * 1000})
        browser.close()
        print("Tapos na ang automation!")`;
    } else if (postRedirectAction === 'keep_open_until_enter') {
      postCloseCode = `        # 4. Panatilihing bukas ang browser hanggang pindutin ng user ang Enter
        print("Nasa ${destUrl} na! Pindutin ang ENTER sa terminal para isara ang browser...")
        input("Press Enter to close browser: ")
        browser.close()
        print("Isinara na ang browser.")`;
    } else {
      postCloseCode = `        # 4. Panatilihing bukas (infinite loop o pause)
        print("Nasa ${destUrl} na! Hindi isasara ang browser.")
        page.pause() # O tanggalin ito kung gusto mong tuluyang iwanan`;
    }

    return `"""
Automated Browser Navigation gamit ang Playwright (Sync API)
Hakbang:
 1. Bubuksan ang browser (${browserEngine}, visible/headful).
 2. Pupunta sa "${startUrl}".
 3. Maghihintay ng eksaktong ${waitDurationMs}ms (${(waitDurationMs / 1000).toFixed(1)}s).
 4. Lilipat sa parehong tab patungo sa "${destUrl}".
"""

from playwright.sync_api import sync_playwright

def run_browser_automation():
    with sync_playwright() as p:
        # 1. Buksan ang browser (headless=${headless ? 'True' : 'False'} para kitang-kita ang bintana)
        print("Binubuksan ang ${browserEngine} browser...")
        browser = p.${browserEngine}.launch(
            headless=${headless ? 'True' : 'False'},
            slow_mo=${config.slowMoMs}
        )
        
        # Gumawa ng bagong browser context at tab/page
        context = browser.new_context(viewport={"width": ${config.viewportWidth}, "height": ${config.viewportHeight}})
        page = context.new_page()

        # 2. Pumunta sa unang website
        print(f"Maglalayag patungo sa: {${JSON.stringify(startUrl)}}")
        page.goto(${JSON.stringify(startUrl)}, wait_until=${JSON.stringify(waitUntil)})

        # 3. Maghintay nang eksaktong ${waitDurationMs} milliseconds (${waitDurationMs / 1000} segundo)
        # Tandaan: page.wait_for_timeout() ang opisyal at pinakaligtas na paraan sa Playwright
        print(f"Nakarating na! Maghihintay nang eksaktong ${waitDurationMs}ms habang naglo-load...")
        page.wait_for_timeout(${waitDurationMs})

        # 4. Lumipat sa parehong tab patungo sa pangalawang website
        print(f"Lilipat sa parehong tab patungo sa: {${JSON.stringify(destUrl)}}")
        page.goto(${JSON.stringify(destUrl)}, wait_until="domcontentloaded")

${postCloseCode}

if __name__ == "__main__":
    run_browser_automation()
`;
  }

  if (framework === 'playwright-async') {
    let postCloseCode = '';
    if (postRedirectAction === 'wait_then_close') {
      postCloseCode = `        # 4. Hayaang nakabukas sandali (${postRedirectWaitSec} segundo)
        print(f"Mananatiling bukas ng {${postRedirectWaitSec}} segundo...")
        await page.wait_for_timeout(${postRedirectWaitSec * 1000})
        await browser.close()
        print("Tapos na ang automation!")`;
    } else {
      postCloseCode = `        print("Nasa ${destUrl} na! Pindutin ang Enter sa terminal para isara...")
        input("Press Enter to close: ")
        await browser.close()`;
    }

    return `"""
Automated Browser Navigation gamit ang Playwright (Async API w/ asyncio)
"""

import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        print("Binubuksan ang ${browserEngine} browser...")
        browser = await p.${browserEngine}.launch(
            headless=${headless ? 'True' : 'False'},
            slow_mo=${config.slowMoMs}
        )
        page = await browser.new_page()

        # 1. Buksan ang unang site
        print(f"Maglalayag patungo sa: {${JSON.stringify(startUrl)}}")
        await page.goto(${JSON.stringify(startUrl)}, wait_until=${JSON.stringify(waitUntil)})

        # 2. Eksaktong ${waitDurationMs} milliseconds
        print(f"Maghihintay nang eksaktong ${waitDurationMs}ms...")
        await page.wait_for_timeout(${waitDurationMs})

        # 3. Lilipat sa parehong tab
        print(f"Lilipat sa: {${JSON.stringify(destUrl)}}")
        await page.goto(${JSON.stringify(destUrl)}, wait_until="domcontentloaded")

${postCloseCode}

if __name__ == "__main__":
    asyncio.run(main())
`;
  }

  // Selenium WebDriver
  let seleniumPostCode = '';
  if (postRedirectAction === 'wait_then_close') {
    seleniumPostCode = `    # 4. Manatiling bukas sandali
    print(f"Mananatiling bukas ng {${postRedirectWaitSec}} segundo...")
    time.sleep(${postRedirectWaitSec})
    driver.quit()
    print("Isinara na ang browser.")`;
  } else {
    seleniumPostCode = `    # 4. Panatilihing bukas hanggang mag-Enter
    print("Nasa ${destUrl} na! Pindutin ang ENTER sa terminal para isara...")
    input("Press Enter to close: ")
    driver.quit()`;
  }

  return `"""
Automated Browser Navigation gamit ang Selenium WebDriver
"""

import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options

def run_selenium_automation():
    print("Inihahanda ang Selenium Chrome driver...")
    options = Options()
    ${headless ? 'options.add_argument("--headless")' : '# Visible / Headful mode (default)'}
    options.add_argument("--start-maximized")

    # Awtomatikong ida-download ang tamang chromedriver gamit ang webdriver-manager
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    try:
        # 1. Buksan ang unang website
        print(f"Binubuksan ang: {${JSON.stringify(startUrl)}}")
        driver.get(${JSON.stringify(startUrl)})

        # 2. Maghintay ng eksaktong ${(waitDurationMs / 1000).toFixed(1)} segundo (${waitDurationMs}ms)
        print(f"Nakarating sa site! Naghihintay ng ${waitDurationMs / 1000} segundo...")
        time.sleep(${waitDurationMs / 1000})

        # 3. Lumipat sa parehong tab
        print(f"Lumilipat sa: {${JSON.stringify(destUrl)}}")
        driver.get(${JSON.stringify(destUrl)})

${seleniumPostCode}

    except Exception as e:
        print(f"Nagkaroon ng error: {e}")
        driver.quit()

if __name__ == "__main__":
    run_selenium_automation()
`;
}

export function generateRequirementsTxt(framework: string): string {
  if (framework.includes('playwright')) {
    return `# Requirements para sa Playwright Python Automation
playwright>=1.49.0
`;
  }
  return `# Requirements para sa Selenium Python Automation
selenium>=4.25.0
webdriver-manager>=4.0.2
`;
}

export function generateInstallCommands(framework: string): { title: string; cmd: string }[] {
  if (framework.includes('playwright')) {
    return [
      {
        title: '1. I-install ang Playwright library sa Python',
        cmd: 'pip install playwright',
      },
      {
        title: '2. I-install ang mga browser binaries (Chromium, Firefox, WebKit)',
        cmd: 'playwright install',
      },
      {
        title: '3. Patakbuhin ang script',
        cmd: 'python main.py',
      },
    ];
  }
  return [
    {
      title: '1. I-install ang Selenium at Webdriver Manager',
      cmd: 'pip install selenium webdriver-manager',
    },
    {
      title: '2. Patakbuhin ang script',
      cmd: 'python main.py',
    },
  ];
}
