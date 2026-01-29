"use client";

export default function CinematicOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[90]">
      {/* vignette */}
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.25)_55%,rgba(0,0,0,0.55)_100%)]" />

      {/* grain */}
      <div className="absolute inset-0 opacity-[0.12] mix-blend-overlay grain" />
    </div>
  );
}
