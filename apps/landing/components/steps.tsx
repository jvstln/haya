export function Steps() {
  return (
    <section className="section" id="how">
      <div className="container">
        <div className="section-head">
          <div className="section-eyebrow">04 · How it works</div>
          <h2>
            Three steps. <em>Zero meetings.</em>
          </h2>
        </div>
        <div className="steps">
          <div className="step">
            <div className="num">01 / CONNECT</div>
            <h4>Point Haya at your URL</h4>
            <p>
              Or install the SDK in 30 seconds. Works with any stack — React,
              Vue, plain HTML.
            </p>
            <div className="step-art">
              <StepArtConnect />
            </div>
          </div>
          <div className="step">
            <div className="num">02 / SCAN</div>
            <h4>The audit runs itself</h4>
            <p>
              Vision models, heuristic checks, and session replay correlate to
              surface the issues that actually move metrics.
            </p>
            <div className="step-art">
              <StepArtScan />
            </div>
          </div>
          <div className="step">
            <div className="num">03 / SHIP</div>
            <h4>Merge the fix</h4>
            <p>
              Haya opens a PR with code-aware patches. You review, you ship.
              Onward.
            </p>
            <div className="step-art">
              <StepArtShip />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepArtConnect() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        fontFamily: "Geist Mono, monospace",
        fontSize: 12,
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(167,139,250,0.22)",
          borderRadius: 8,
          padding: "10px 14px",
          color: "#a78bfa",
          boxShadow: "0 0 24px rgba(139,92,246,0.2)",
        }}
      >
        <span style={{ color: "#6b6688" }}>$</span> haya audit{" "}
        <span style={{ color: "#34d399" }}>https://acme.com</span>
        <span
          className="caret"
          style={{
            display: "inline-block",
            width: 7,
            height: 14,
            background: "#a78bfa",
            marginLeft: 4,
            verticalAlign: "middle",
            animation: "blink 1s steps(2) infinite",
          }}
        ></span>
      </div>
    </div>
  );
}

function StepArtScan() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 12,
        borderRadius: 6,
        overflow: "hidden",
        background: "#f4f3f8",
      }}
    >
      <div
        style={{
          padding: 8,
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gap: 3,
        }}
      >
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 8,
              background: i % 3 === 0 ? "#c0bdca" : "#d4d2dc",
              borderRadius: 1,
            }}
          ></div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 36,
          background:
            "linear-gradient(180deg, transparent, rgba(139,92,246,0.5), rgba(167,139,250,1))",
          animation: "scanmini 2.4s ease-in-out infinite",
        }}
      ></div>
    </div>
  );
}

function StepArtShip() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: 14,
        fontFamily: "Geist Mono, monospace",
        fontSize: 11,
      }}
    >
      <div style={{ color: "#a78bfa", marginBottom: 6 }}>
        + pr/3471 · fix(checkout): a11y
      </div>
      <div style={{ color: "#34d399" }}>+ aria-label="Card number"</div>
      <div style={{ color: "#34d399" }}>+ autocomplete="cc-number"</div>
      <div style={{ color: "#f87171" }}>- &lt;input type="text"</div>
      <div
        style={{
          marginTop: 10,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 10px",
          borderRadius: 999,
          background: "rgba(52,211,153,0.15)",
          color: "#34d399",
          fontSize: 10,
        }}
      >
        ● Merged · 3m ago
      </div>
    </div>
  );
}
