import { killKernelBrowser } from "@/lib/kernel/utils";

// Common handler for both GET and POST requests
async function handleKillDesktop(request: Request) {
  // Enable CORS to ensure this works across all browsers

  const { searchParams } = new URL(request.url);
  const sandboxId = searchParams.get("sandboxId");

  console.log(`Kill browser request received via ${request.method} for ID: ${sandboxId}`);

  if (!sandboxId) {
    return new Response("No sandboxId provided", { status: 400 });
  }

  try {
    await killKernelBrowser(sandboxId);
    return new Response("Browser killed successfully", { status: 200 });
  } catch (error) {
    console.error(`Failed to kill browser with ID: ${sandboxId}`, error);
    return new Response("Failed to kill browser", { status: 500 });
  }
}

// Handle POST requests
export async function POST(request: Request) {
  return handleKillDesktop(request);
}