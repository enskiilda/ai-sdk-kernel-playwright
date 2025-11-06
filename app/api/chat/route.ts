import { createMistral } from "@ai-sdk/mistral";
import { streamText, UIMessage } from "ai";
import { killKernelBrowser } from "@/lib/kernel/utils";
import { 
  browserNavigateTool, 
  browserActTool, 
  browserExtractTool, 
  screenshotTool, 
  bashTool, 
  waitTool 
} from "@/lib/kernel/tool";
import { prunedMessages } from "@/lib/utils";

// ⚠️ HARDCODED API KEY - DO NOT MODIFY ⚠️
const MISTRAL_API_KEY = "IsQUzMEo39yTJHR0F7zORJguIMm62vhX";

// Allow streaming responses up to 300 seconds
export const maxDuration = 300;

export async function POST(req: Request) {
  const { messages, sandboxId }: { messages: UIMessage[]; sandboxId: string } =
    await req.json();
  try {
    const result = streamText({
      model: createMistral({
        apiKey: MISTRAL_API_KEY,
      })("mistral-medium-2508"),
      system:
        "You are a helpful assistant with access to a web browser powered by Playwright and Kernel. " +
        "You can navigate to websites, interact with pages, and extract information. " +
        "Available tools: " +
        "- browserNavigate: Navigate to a URL " +
        "- browserAct: Perform actions on the page using natural language descriptions (e.g., 'click the login button', 'fill email with test@example.com') " +
        "- browserExtract: Extract text content from the page " +
        "- screenshot: Take a screenshot of the current page " +
        "- bash: Execute JavaScript code in the browser console " +
        "- wait: Wait for a specified duration " +
        "Be sure to wait after navigation for pages to load. " +
        "Use clear descriptions for actions like 'click the submit button' or 'type hello@example.com in the email field'.",
      messages: prunedMessages(messages),
      tools: {
        browserNavigate: browserNavigateTool(sandboxId),
        browserAct: browserActTool(sandboxId),
        browserExtract: browserExtractTool(sandboxId),
        screenshot: screenshotTool(sandboxId),
        bash: bashTool(sandboxId),
        wait: waitTool(),
      },
      maxSteps: 10,
    });

    // Create response stream
    const response = result.toTextStreamResponse({
      // @ts-expect-error eheljfe
      getErrorMessage(error) {
        console.error(error);
        return error;
      },
    });

    return response;
  } catch (error) {
    console.error("Chat API error:", error);
    await killKernelBrowser(sandboxId); // Force cleanup on error
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
