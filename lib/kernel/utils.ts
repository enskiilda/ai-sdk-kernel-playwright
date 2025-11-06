import Kernel from '@onkernel/sdk';
import { chromium, Browser, Page } from 'playwright';

// ⚠️ HARDCODED API KEYS - DO NOT MODIFY ⚠️
const KERNEL_API_KEY = "sk_86c00c13-daa2-4096-bfb7-705261b458cc.Tu6J1SLMnfZG3FDkG4iBK6mkiENa2a92q3DLVgvtjIE";
export const MISTRAL_API_KEY = "IsQUzMEo39yTJHR0F7zORJguIMm62vhX";

// Store active browser sessions
interface BrowserSession {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  kernel: any;
  browser: Browser;
  page: Page;
}

const activeBrowsers = new Map<string, BrowserSession>();

export const getResolution = () => ({ x: 1024, y: 768 });

/**
 * Get or create a Kernel browser with Playwright
 */
export const getKernelBrowser = async (id?: string): Promise<BrowserSession> => {
  try {
    // If ID provided, try to reuse existing session
    if (id && activeBrowsers.has(id)) {
      const session = activeBrowsers.get(id);
      if (session) {
        return session;
      }
    }

    // Create new Kernel instance with hardcoded API key
    const kernel = new Kernel({ apiKey: KERNEL_API_KEY });

    // Create a new browser session with stealth mode
    const kernelBrowser = await kernel.browsers.create({ stealth: true });

    console.log("Live view url: ", kernelBrowser.browser_live_view_url);

    // Connect Playwright to Kernel browser via CDP
    const browser = await chromium.connectOverCDP(kernelBrowser.cdp_ws_url);
    const contexts = browser.contexts();
    const context = contexts[0] || await browser.newContext();
    const pages = context.pages();
    const page = pages[0] || await context.newPage();

    const sessionId = kernelBrowser.session_id;
    const session: BrowserSession = { kernel: kernelBrowser, browser, page };
    
    // Store the session
    activeBrowsers.set(sessionId, session);

    return session;
  } catch (error) {
    console.error("Error in getKernelBrowser:", error);
    throw error;
  }
};

export const getKernelBrowserURL = async (id?: string) => {
  try {
    const session = await getKernelBrowser(id);
    const liveViewUrl = session.kernel.browser_live_view_url;

    return { streamUrl: liveViewUrl, id: session.kernel.session_id };
  } catch (error) {
    console.error("Error in getKernelBrowserURL:", error);
    throw error;
  }
};

export const killKernelBrowser = async (id: string) => {
  try {
    const session = activeBrowsers.get(id);
    if (session) {
      await session.browser.close();
      
      // Create a temporary Kernel instance to delete the browser
      const kernel = new Kernel({ apiKey: KERNEL_API_KEY });
      await kernel.browsers.deleteByID(id);
      
      activeBrowsers.delete(id);
    }
  } catch (error) {
    console.error("Error in killKernelBrowser:", error);
    throw error;
  }
};
