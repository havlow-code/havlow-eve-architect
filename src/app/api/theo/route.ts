// src/app/api/theo/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

type DetectedType = "books" | "lyrics" | "services" | "products" | "unknown";

function detectType(prompt: string): DetectedType {
  const p = prompt.toLowerCase();
  if (/(lyric|lyrics|song|verse|chorus|hook|rap)/.test(p)) return "lyrics";
  if (/(book|ebook|manuscript|novel|chapter|kdp|amazon)/.test(p)) return "books";
  if (/(service|client|freelance|offer|upwork|editing|proofread)/.test(p)) return "services";
  if (/(template|bundle|pack|kit|download|digital product)/.test(p)) return "products";
  return "unknown";
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    name: "THEO",
    status: "online",
    message: "THEO is awake and listening.",
  });
}

// Main THEO endpoint
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const prompt = String(body?.prompt ?? "").trim();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not set in the environment." },
        { status: 500 }
      );
    }

    const detectedType = detectType(prompt);

    const systemPrompt = `
You are THEO (Transformative Holistic Engine Operative), an AI strategist for creators.

Return ONLY valid JSON matching this exact structure:
{
  "detectedType": "books" | "lyrics" | "services" | "products" | "unknown",
  "confidence": "low" | "medium" | "high",
  "summary": "Brief assessment of the creator's situation",
  "recommendedProduct": "Primary product recommendation",
  "monetizationPaths": ["path1", "path2", "path3"],
  "pricingIdeas": ["pricing1", "pricing2"],
  "assetsNeeded": ["asset1", "asset2"],
  "nextActions": ["action1", "action2", "action3"],
  "scanFindings": ["finding1", "finding2", "finding3", "finding4", "finding5"],
  "architectureDecision": "Single sentence explaining the primary monetization strategy",
  "executionPlan": ["step1", "step2", "step3", "step4", "step5", "step6", "step7"],
  "funnel": {
    "leadMagnet": "Free offer to attract audience",
    "primaryCTA": "Main call to action",
    "emailSequenceSubjects": ["subject1", "subject2", "subject3"]
  }
}

Rules:
- Use Australian English when relevant
- Be practical, specific, and action-oriented
- No motivational fluff
- Focus on monetizing EXISTING assets, not creating new ones
- scanFindings should diagnose what they have and identify gaps
- architectureDecision should pick ONE primary path and justify it
- executionPlan should be time-bound and executable by a solo creator
`;

    // ✅ CORRECT: Use chat.completions.create (the real OpenAI API)
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // ✅ Valid model name
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Creator scenario:\n${prompt}\n\nDetectedType hint: ${detectedType}\n\nReturn the strategy JSON now.`,
        },
      ],
      response_format: { type: "json_object" }, // ✅ Forces JSON-only output
      temperature: 0.4,
      max_tokens: 2000,
    });

    // Parse the response
    const content = completion.choices[0]?.message?.content ?? "{}";
    const architect = JSON.parse(content);

    // Ensure detectedType is always present
    if (!architect.detectedType) {
      architect.detectedType = detectedType;
    }

    return NextResponse.json({ architect });
    
  } catch (err: any) {
    console.error("THEO route error:", err);
    
    // Return a helpful fallback response instead of just an error
    return NextResponse.json(
      {
        architect: {
          detectedType: "unknown",
          confidence: "low",
          summary: "THEO encountered an error. Please try again or contact support.",
          recommendedProduct: "Error Recovery Session",
          monetizationPaths: ["Retry with more specific details about existing assets"],
          pricingIdeas: ["N/A"],
          assetsNeeded: ["Clear description of what you've already created"],
          nextActions: ["Refresh the page and try again", "Check if your prompt describes existing creative work"],
          scanFindings: ["Error occurred during processing", "Unable to analyze at this time"],
          architectureDecision: "System error - please retry",
          executionPlan: ["Retry submission", "Contact support if error persists"],
          funnel: {
            leadMagnet: "N/A",
            primaryCTA: "Try Again",
            emailSequenceSubjects: ["N/A"]
          }
        }
      },
      { status: 200 } // Return 200 so UI can display the fallback gracefully
    );
  }
}