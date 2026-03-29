"use client";

export default function MoonIcon({ size = 220 }: { size?: number }) {
  return (
    <div
      className="relative select-none"
      style={{ width: size, height: size }}
    >
      {/* Outer glow rings */}
      <div
        className="absolute inset-0 rounded-full animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Orbiting star */}
      <div
        className="absolute"
        style={{
          width: 8,
          height: 8,
          top: "50%",
          left: "50%",
          marginTop: -4,
          marginLeft: -4,
          animation: "orbit 8s linear infinite",
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            background: "#c084fc",
            borderRadius: "50%",
            boxShadow: "0 0 10px #c084fc",
          }}
        />
      </div>

      {/* SVG Moon */}
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", animation: "moonFloat 6s ease-in-out infinite" }}
        className="drop-shadow-[0_0_30px_rgba(168,85,247,0.7)]"
      >
        <defs>
          <radialGradient id="moonFill" cx="38%" cy="38%" r="65%">
            <stop offset="0%" stopColor="#f3e8ff" />
            <stop offset="30%" stopColor="#d8b4fe" />
            <stop offset="65%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6b21a8" />
          </radialGradient>
          <radialGradient id="craterGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.25)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <filter id="moonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Moon body */}
        <circle cx="105" cy="100" r="78" fill="url(#moonFill)" filter="url(#moonGlow)" />

        {/* Cut-out circle to create crescent */}
        <circle cx="138" cy="88" r="66" fill="#09030f" />

        {/* Craters for detail */}
        <circle cx="75" cy="85" r="8" fill="url(#craterGrad)" opacity="0.5" />
        <circle cx="60" cy="115" r="5" fill="url(#craterGrad)" opacity="0.4" />
        <circle cx="90" cy="130" r="6" fill="url(#craterGrad)" opacity="0.35" />
        <circle cx="68" cy="65" r="4" fill="url(#craterGrad)" opacity="0.3" />

        {/* Highlight shimmer on crescent edge */}
        <path
          d="M 55 48 Q 30 100 55 155"
          stroke="rgba(243,232,255,0.5)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          filter="url(#softGlow)"
        />

        {/* Small stars around */}
        <circle cx="160" cy="45" r="2.5" fill="#e9d5ff" filter="url(#softGlow)"
          style={{ animation: "starTwinkle 2.5s ease-in-out infinite" }} />
        <circle cx="172" cy="130" r="2" fill="#c084fc" filter="url(#softGlow)"
          style={{ animation: "starTwinkle 3.2s ease-in-out infinite 0.5s" }} />
        <circle cx="148" cy="165" r="1.5" fill="#a855f7" filter="url(#softGlow)"
          style={{ animation: "starTwinkle 2.8s ease-in-out infinite 1s" }} />
        <circle cx="40" cy="40" r="2" fill="#ddd6fe" filter="url(#softGlow)"
          style={{ animation: "starTwinkle 3.5s ease-in-out infinite 0.8s" }} />
        <circle cx="28" cy="155" r="1.5" fill="#c4b5fd" filter="url(#softGlow)"
          style={{ animation: "starTwinkle 2.2s ease-in-out infinite 1.5s" }} />
      </svg>
    </div>
  );
}
