import { getKernelBrowserURL } from "@/lib/kernel/utils";

export async function POST(req: Request) {
  try {
    const { sandboxId } = await req.json();
    const result = await getKernelBrowserURL(sandboxId);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to get browser URL:", error);
    return new Response(JSON.stringify({ error: "Failed to get browser URL" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
