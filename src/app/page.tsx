"use client";

import { useMemo, useState } from "react";

type TheoArchitectResponse = {
  detectedType?: string;
  confidence?: "low" | "medium" | "high";
  summary?: string;
  recommendedProduct?: string;
  monetizationPaths?: string[];
  pricingIdeas?: string[];
  assetsNeeded?: string[];
  nextActions?: string[];

  // THEO's visible reasoning
  scanFindings?: string[];
  architectureDecision?: string;
  executionPlan?: string[];

  funnel?: {
    leadMagnet?: string;
    primaryCTA?: string;
    emailSequenceSubjects?: string[];
  };
};

export default function Page() {
  const [prompt, setPrompt] = useState(
    "I'm a musician with 50 unreleased tracks, a YouTube channel with 200 subscribers, and a Patreon with 3 supporters. I want to make $2,000/month but I keep starting new projects instead of finishing old ones."
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TheoArchitectResponse | null>(null);

  const canRun = useMemo(() => prompt.trim().length >= 10 && !loading, [prompt, loading]);

  async function runTHEO() {
    if (!canRun) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/theo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      // Handle API errors
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong.");
        return;
      }

      // Extract architect response
      const architect = data?.architect ?? null;

      if (!architect) {
        setError("No response returned from THEO.");
        return;
      }

      setResult(architect);
    } catch (e: any) {
      setError(e?.message ?? "Failed to connect to THEO.");
    } finally {
      setLoading(false);
    }
  }

  function Pill({ children }: { children: React.ReactNode }) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 10px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.06)",
          fontSize: 12,
          color: "rgba(255,255,255,0.85)",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
    );
  }

  function Card({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <section
        style={{
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <div style={{ fontSize: 12, letterSpacing: 0.8, opacity: 0.8, marginBottom: 10 }}>
          {title.toUpperCase()}
        </div>
        {children}
      </section>
    );
  }

  function List({ items }: { items?: string[] }) {
    if (!items || items.length === 0) return <div style={{ opacity: 0.7 }}>—</div>;
    return (
      <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
        {items.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(1200px 600px at 50% 0%, rgba(255,255,255,0.08), transparent 60%), #05060a",
        color: "white",
        padding: "40px 18px",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        {/* Header */}
        <header style={{ marginBottom: 18 }}>
          <h1 style={{ margin: 0, fontSize: 36, letterSpacing: -0.6 }}>Havlow Eve Architect</h1>
          <p style={{ marginTop: 10, marginBottom: 0, opacity: 0.8, lineHeight: 1.5 }}>
            Paste a creator scenario. THEO returns a structured plan (SCAN → ARCHITECT → EXECUTE).
          </p>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Pill>THEO: Transformative Holistic Engine Operative</Pill>
            <Pill>Endpoint: /api/theo</Pill>
            {result?.detectedType && <Pill>Detected: {result.detectedType}</Pill>}
            {result?.confidence && <Pill>Confidence: {result.confidence}</Pill>}
          </div>
        </header>

        {/* Input Section */}
        <section
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.03)",
            borderRadius: 18,
            padding: 16,
            marginBottom: 18,
          }}
        >
          <label style={{ display: "block", fontSize: 12, opacity: 0.8, marginBottom: 8 }}>
            Creator scenario (10+ characters)
          </label>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            spellCheck={false}
            placeholder="Describe your existing creative assets, audience, and revenue goals..."
            style={{
              width: "100%",
              resize: "vertical",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.04)",
              color: "white",
              padding: 14,
              fontSize: 14,
              lineHeight: 1.5,
              outline: "none",
              fontFamily: "inherit",
            }}
          />

          <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={runTHEO}
              disabled={!canRun}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.18)",
                background: canRun ? "rgba(59,130,246,0.9)" : "rgba(255,255,255,0.08)",
                color: "white",
                cursor: canRun ? "pointer" : "not-allowed",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {loading ? "Running THEO…" : "Generate Strategy"}
            </button>

            <button
              onClick={() => {
                setPrompt(
                  "I have 12 published Amazon KDP books, 30 draft manuscripts, and 3 YouTube channels. I want to earn $1,500/month using what I already made, but I get overwhelmed and jump between projects."
                );
                setResult(null);
                setError(null);
              }}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.06)",
                color: "white",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Load example prompt
            </button>

            <div style={{ opacity: 0.7, fontSize: 12 }}>
              Tip: The more "inventory" you provide, the sharper THEO gets.
            </div>
          </div>

          {error && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 12,
                border: "1px solid rgba(239,68,68,0.35)",
                background: "rgba(239,68,68,0.12)",
                color: "rgba(255,255,255,0.92)",
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              <strong>Error:</strong> {error}
            </div>
          )}
        </section>

        {/* Results Section */}
        {result ? (
          <div style={{ display: "grid", gap: 14 }}>
            {/* Strategic Assessment */}
            <Card title="Strategic Assessment">
              <div style={{ fontSize: 16, lineHeight: 1.6 }}>
                {result.summary || "No summary provided"}
              </div>
            </Card>

            {/* SCAN */}
            <Card title="SCAN">
              <List items={result.scanFindings || result.assetsNeeded} />
            </Card>

            {/* ARCHITECT */}
            <Card title="ARCHITECT">
              <div style={{ marginBottom: 14, fontSize: 15, lineHeight: 1.6 }}>
                <strong style={{ display: "block", marginBottom: 6, opacity: 0.8 }}>Decision:</strong>
                {result.architectureDecision || "No decision provided"}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8, letterSpacing: 0.5 }}>
                    MONETIZATION PATHS
                  </div>
                  <List items={result.monetizationPaths} />
                </div>
                <div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8, letterSpacing: 0.5 }}>
                    PRICING IDEAS
                  </div>
                  <List items={result.pricingIdeas} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8, letterSpacing: 0.5 }}>
                  RECOMMENDED PRODUCT
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.5 }}>
                  {result.recommendedProduct || "—"}
                </div>
              </div>
            </Card>

            {/* EXECUTE */}
            <Card title="EXECUTE">
              <List items={result.executionPlan || result.nextActions} />
            </Card>

            {/* FUNNEL */}
            <Card title="Funnel">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8, letterSpacing: 0.5 }}>
                    LEAD MAGNET
                  </div>
                  <div style={{ lineHeight: 1.5 }}>{result.funnel?.leadMagnet || "—"}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8, letterSpacing: 0.5 }}>
                    PRIMARY CTA
                  </div>
                  <div style={{ lineHeight: 1.5 }}>{result.funnel?.primaryCTA || "—"}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8, letterSpacing: 0.5 }}>
                    EMAIL SEQUENCE
                  </div>
                  <List items={result.funnel?.emailSequenceSubjects} />
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div
            style={{
              opacity: 0.65,
              fontSize: 14,
              lineHeight: 1.6,
              textAlign: "center",
              padding: "40px 20px",
            }}
          >
            No output yet. Paste a scenario and click <strong>Generate Strategy</strong>.
          </div>
        )}

        {/* Footer */}
        <footer style={{ marginTop: 32, opacity: 0.55, fontSize: 12, textAlign: "center" }}>
          Built by Havlow Eve Press • THEO runs SCAN → ARCHITECT → EXECUTE • Your API key stays server-side.
        </footer>
      </div>
    </main>
  );
}