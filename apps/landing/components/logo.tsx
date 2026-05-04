/* Haya petal/sunburst logo */
export function HayaMark({ size = 26, animate = false }) {
  const petals = [];
  const count = 18;
  for (let i = 0; i < count; i++) {
    const angle = (360 / count) * i;
    petals.push(
      <ellipse
        key={i}
        cx="50"
        cy="22"
        rx="3.2"
        ry="14"
        fill="url(#petalGrad)"
        transform={`rotate(${angle} 50 50)`}
      />,
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        animation: animate ? "spin-slow 30s linear infinite" : "none",
        filter: "drop-shadow(0 0 6px rgba(139,92,246,0.6))",
      }}
    >
      <defs>
        <linearGradient id="petalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="55%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      {petals}
    </svg>
  );
}
