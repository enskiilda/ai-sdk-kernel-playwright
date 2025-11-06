import { tool } from "ai";
import { z } from "zod";
import { getKernelBrowser } from "./utils";

const wait = async (seconds: number) => {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

export const resolution = { x: 1024, y: 768 };

/**
 * Browser navigation tool
 */
export const browserNavigateTool = (sessionId?: string) =>
  tool({
    description: "Navigate to a URL in the browser",
    parameters: z.object({
      url: z.string().describe("The URL to navigate to"),
    }),
    execute: async ({ url }) => {
      const session = await getKernelBrowser(sessionId);
      await session.page.goto(url, { waitUntil: 'domcontentloaded' });
      return `Navigated to ${url}`;
    },
  });

/**
 * Browser action tool - performs actions using Playwright
 */
export const browserActTool = (sessionId?: string) =>
  tool({
    description: "Perform an action on the current page. Provide a clear description of what to do (e.g., 'click the login button', 'fill email field with test@example.com')",
    parameters: z.object({
      action: z.string().describe("Description of the action to perform"),
    }),
    execute: async ({ action }) => {
      const session = await getKernelBrowser(sessionId);
      
      // Simple action parsing - you can enhance this with AI-based element detection
      const lowerAction = action.toLowerCase();
      
      if (lowerAction.includes('click')) {
        // Extract what to click
        const match = action.match(/click (?:on |the )?(.+)/i);
        if (match) {
          const target = match[1];
          // Try to find and click the element
          try {
            await session.page.click(`text=${target}`, { timeout: 5000 });
            return `Clicked on: ${target}`;
          } catch {
            // Try as selector
            await session.page.click(target);
            return `Clicked on: ${target}`;
          }
        }
      } else if (lowerAction.includes('type') || lowerAction.includes('fill')) {
        // Extract what to type and where
        const match = action.match(/(?:type|fill) ['"](.+)['"] (?:in|into) (?:the )?(.+)/i);
        if (match) {
          const [, text, field] = match;
          try {
            await session.page.fill(`text=${field}`, text, { timeout: 5000 });
            return `Filled "${text}" into ${field}`;
          } catch {
            await session.page.fill(field, text);
            return `Filled "${text}" into ${field}`;
          }
        }
      } else if (lowerAction.includes('scroll')) {
        if (lowerAction.includes('down')) {
          await session.page.evaluate(() => window.scrollBy(0, window.innerHeight));
          return 'Scrolled down';
        } else if (lowerAction.includes('up')) {
          await session.page.evaluate(() => window.scrollBy(0, -window.innerHeight));
          return 'Scrolled up';
        }
      }
      
      return `Action "${action}" completed (best effort)`;
    },
  });

/**
 * Browser extraction tool - extracts text content
 */
export const browserExtractTool = (sessionId?: string) =>
  tool({
    description: "Extract information from the current page",
    parameters: z.object({
      instruction: z.string().describe("What information to extract"),
    }),
    execute: async () => {
      const session = await getKernelBrowser(sessionId);
      
      // Get page content
      const text = await session.page.textContent('body') || '';
      
      // Return the text content - AI will process it based on instruction
      return `Page content (${text.length} chars):\n${text.substring(0, 2000)}${text.length > 2000 ? '...' : ''}`;
    },
  });

/**
 * Screenshot tool
 */
export const screenshotTool = (sessionId?: string) =>
  tool({
    description: "Take a screenshot of the current browser page",
    parameters: z.object({}),
    execute: async () => {
      const session = await getKernelBrowser(sessionId);
      const screenshot = await session.page.screenshot();
      const base64Data = screenshot.toString('base64');
      
      return {
        type: "image" as const,
        data: base64Data,
      };
    },
  });

/**
 * Bash/JavaScript execution tool
 */
export const bashTool = (sessionId?: string) =>
  tool({
    description: "Execute JavaScript code in the browser console",
    parameters: z.object({
      command: z.string().describe("JavaScript code to execute"),
    }),
    execute: async ({ command }) => {
      const session = await getKernelBrowser(sessionId);
      
      try {
        const result = await session.page.evaluate((code) => {
          try {
            return String(eval(code));
          } catch (e) {
            return `Error: ${e}`;
          }
        }, command);
        
        return result || "(Code executed successfully with no output)";
      } catch (error) {
        console.error("JavaScript execution failed:", error);
        if (error instanceof Error) {
          return `Error executing code: ${error.message}`;
        } else {
          return `Error executing code: ${String(error)}`;
        }
      }
    },
  });

/**
 * Wait tool
 */
export const waitTool = () =>
  tool({
    description: "Wait for a specified number of seconds",
    parameters: z.object({
      seconds: z.number().describe("Number of seconds to wait (max 10)"),
    }),
    execute: async ({ seconds }) => {
      const actualDuration = Math.min(seconds, 10);
      await wait(actualDuration);
      return `Waited for ${actualDuration} seconds`;
    },
  });
