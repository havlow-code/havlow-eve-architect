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

  // New “visible thinking” fields (if you added them)
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

      // If your API returns { error: "..." }
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong.");
        return;
      }

      // Your API returns { architect: ... }
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
          <li key={`${x}-${i}`}>{x}</li>
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
        <header style={{ marginBottom: 18 }}>
          <h1 style={{ margin: 0, fontSize: 36, letterSpacing: -0.6 }}>Havlow Eve Architect</h1>
          <p style={{ marginTop: 10, marginBottom: 0, opacity: 0.8, lineHeight: 1.5 }}>
            Paste a creator scenario. THEO returns a structured plan (SCAN → ARCHITECT → EXECUTE).
          </p>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Pill>THEO: Transformative Holistic Engine Operative</Pill>
            <Pill>Endpoint: /api/theo</Pill>
            {result?.detectedType ? <Pill>Detected: {result.detectedType}</Pill> : null}
            {result?.confidence ? <Pill>Confidence: {result.confidence}</Pill> : null}
          </div>
        </header>

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
              }}
            >
              Load example prompt
            </button>

            <div style={{ opacity: 0.7, fontSize: 12 }}>
              Tip: The more “inventory” you provide, the sharper THEO gets.
            </div>
          </div>

          {error ? (
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
              {error}
            </div>
          ) : null}
        </section>

        {result ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 14 }}>
            <div style={{ gridColumn: "span 12" }}>
              <Card title="Strategic Assessment">
                <div style={{ fontSize: 16, lineHeight: 1.6 }}>
                  {result.summary ?? "—"}
                </div>
              </Card>
            </div>

            <div style={{ gridColumn: "span 12" }}>
              <Card title="SCAN">
                <List items={result.scanFindings ?? result.assetsNeeded} />
              </Card>
            </div>

            <div style={{ gridColumn: "span 12" }}>
              <Card title="ARCHITECT">
                <div style={{ marginBottom: 10, opacity: 0.9 }}>
                  <strong>Decision:</strong>{" "}
                  {result.architectureDecision ?? "—"}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 12 }}>
                  <div style={{ gridColumn: "span 6" }}>
                    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Monetization Paths</div>
                    <List items={result.monetizationPaths} />
                  </div>
                  <div style={{ gridColumn: "span 6" }}>
                    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Pricing Ideas</div>
                    <List items={result.pricingIdeas} />
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Recommended Product</div>
                  <div style={{ fontSize: 15 }}>{result.recommendedProduct ?? "—"}</div>
                </div>
              </Card>
            </div>

            <div style={{ gridColumn: "span 12" }}>
              <Card title="EXECUTE">
                <List items={result.executionPlan ?? result.nextActions} />
              </Card>
            </div>

            <div style={{ gridColumn: "span 12" }}>
              <Card title="Funnel">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 12 }}>
                  <div style={{ gridColumn: "span 4" }}>
                    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Lead Magnet</div>
                    <div>{result.funnel?.leadMagnet ?? "—"}</div>
                  </div>
                  <div style={{ gridColumn: "span 4" }}>
                    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Primary CTA</div>
                    <div>{result.funnel?.primaryCTA ?? "—"}</div>
                  </div>
                  <div style={{ gridColumn: "span 4" }}>
                    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Email Sequence Subjects</div>
                    <List items={result.funnel?.emailSequenceSubjects} />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div style={{ opacity: 0.65, fontSize: 13, lineHeight: 1.6 }}>
            No output yet. Paste a scenario and click <strong>Generate Strategy</strong>.
          </div>
        )}

        <footer style={{ marginTop: 28, opacity: 0.55, fontSize: 12 }}>
          Built by Havlow Eve Press • THEO runs SCAN → ARCHITECT → EXECUTE • Your API key stays server-side.
        </footer>
      </div>
    </main>
  );
}
