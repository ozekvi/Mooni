"use client";

interface MoonImageProps {
  size?: number;
  className?: string;
}

export default function MoonImage({ size = 200, className }: MoonImageProps) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "inline-block",
        filter: "drop-shadow(0 0 40px rgba(120,40,220,0.8)) drop-shadow(0 0 80px rgba(100,20,200,0.4))",
        animation: "moonFloat 6s ease-in-out infinite",
      }}
    >
      {/* Outer glow ring */}
      <div style={{
        position: "absolute",
        inset: -20,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(100,20,220,0.15) 0%, transparent 70%)",
        animation: "pulseGlow 3s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      <img
        src="/moon.png"
        alt="Mooni crescent"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          userSelect: "none",
          pointerEvents: "none",
        }}
        draggable={false}
      />
    </div>
  );
}
