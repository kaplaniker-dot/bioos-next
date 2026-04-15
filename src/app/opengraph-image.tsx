import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BioOS — Biyolojik İşletim Sistemi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #E0F2FE 0%, #CCFBF1 50%, #D1FAE5 100%)",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 400, height: 400, borderRadius: "50%",
          background: "rgba(13,148,136,0.08)", display: "flex",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: -60,
          width: 300, height: 300, borderRadius: "50%",
          background: "rgba(2,132,199,0.07)", display: "flex",
        }} />

        {/* Logo pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#141414", borderRadius: 10,
          padding: "10px 18px", marginBottom: 32,
        }}>
          <span style={{ fontSize: 22, fontWeight: 500, color: "#F4FAFA", letterSpacing: 1 }}>
            Bio<span style={{ color: "#FBBF24" }}>OS</span>
          </span>
          <div style={{ width: 10, height: 18, background: "#D97706", borderRadius: 2 }} />
        </div>

        {/* Heading */}
        <div style={{
          fontSize: 64, fontWeight: 300, color: "#0F172A",
          letterSpacing: -2, lineHeight: 1.05, textAlign: "center",
          maxWidth: 800, display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          <span>Biyolojini anla,</span>
          <span>hayatını tasarla.</span>
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 20, color: "#475569", marginTop: 24,
          textAlign: "center", maxWidth: 640, lineHeight: 1.6,
          display: "flex",
        }}>
          Yapay zeka destekli kişiselleştirilmiş sağlık optimizasyonu
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: 48, marginTop: 48,
          borderTop: "1px solid rgba(165,200,197,0.5)", paddingTop: 36,
        }}>
          {[
            { value: "+40%", label: "Enerji artışı", color: "#D97706" },
            { value: "15 dk", label: "İlk analiz", color: "#0284C7" },
            { value: "%91", label: "Plan uyum oranı", color: "#059669" },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 400, color: s.color, letterSpacing: -1 }}>{s.value}</span>
              <span style={{ fontSize: 14, color: "#64748B" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
