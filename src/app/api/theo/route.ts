import { NextResponse } from "next/server";

// ✅ Sanity GET: visit /api/theo in the browser to confirm THEO is alive
export async function GET() {
  return NextResponse.json({
    name: "THEO",
    status: "online",
    message: "THEO is awake and listening.",
  });
}

// ✅ Main brain POST: UI will call this with { prompt: "..." }
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing 'prompt' in request body." },
        { status: 400 }
      );
    }

    // If you already built the real THEO brain elsewhere,
    // this is where you'd call it and return the result.
    // For now, we return a clean, predictable shape so the UI can't break.
    return NextResponse.json({
      ok: true,
      architect: {
        detectedType: "unknown",
        confidence: "low",
        summary: "THEO received your prompt. Wire the brain here next.",
        recommendedProduct: "N/A",
        monetizationPaths: [],
        pricingIdeas: [],
        assetsNeeded: [],
        nextActions: ["Connect this route to the THEO brain logic."],
        scanFindings: ["Prompt received successfully."],
        architectureDecision: "UI → /api/theo POST → return architect JSON",
        executionPlan: ["Add OpenAI call", "Return SCAN/ARCHITECT/EXECUTE fields"],
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
