import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div style={{ minHeight: "100vh", background: "#F4FAFA" }}>

      {/* Dashboard Navbar */}
      <nav style={{
        background: "rgba(244,250,250,0.9)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid #A5C8C5",
        padding: "0 32px",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: 1160, margin: "0 auto",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", height: 64,
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "#141414", borderRadius: 8, padding: "6px 10px",
          }}>
            <span style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 14, fontWeight: 500, color: "#F4FAFA",
            }}>
              Bio<span style={{ color: "#FBBF24" }}>OS</span>
            </span>
            <span style={{
              display: "inline-block", width: 8, height: 14,
              background: "#D97706", borderRadius: 1,
              animation: "cursorBlink 1.1s step-end infinite",
            }} />
          </div>
          <UserButton />
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "64px 32px" }}>

        {/* Welcome */}
        <div style={{ marginBottom: 48 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#CCFBF1", color: "#0F766E",
            fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
            textTransform: "uppercase", padding: "5px 12px",
            borderRadius: 999, marginBottom: 16,
          }}>
            Dashboard
          </span>
          <h1 style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontWeight: 400, fontSize: "clamp(32px,4vw,48px)",
            letterSpacing: "-1px", color: "#0F172A",
            margin: "0 0 12px", lineHeight: 1.1,
          }}>
            Merhaba, {user?.firstName || "Kullanıcı"}.
          </h1>
          <p style={{ fontSize: 16, color: "#475569", margin: 0 }}>
            Biyolojik verilerini analiz etmeye hazır mısın?
          </p>
        </div>

        {/* Metric cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20, marginBottom: 40,
        }}>
          {[
            { label: "KAD", value: "—", unit: "ms", color: "#059669", note: "Veri bekleniyor" },
            { label: "Uyku Skoru", value: "—", unit: "/100", color: "#D97706", note: "Veri bekleniyor" },
            { label: "VO2 Max", value: "—", unit: "", color: "#0284C7", note: "Veri bekleniyor" },
            { label: "Enerji Skoru", value: "—", unit: "/100", color: "#0D9488", note: "Veri bekleniyor" },
          ].map((m) => (
            <div key={m.label} style={{
              background: "#FFFFFF", border: "1px solid #A5C8C5",
              borderRadius: 14, padding: 24,
            }}>
              <div style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 9, letterSpacing: 2,
                textTransform: "uppercase", color: "#94A3B8", marginBottom: 10,
              }}>
                {m.label}
              </div>
              <div style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 32, fontWeight: 500, color: "#0F172A", lineHeight: 1,
              }}>
                {m.value}
                <span style={{ fontSize: 14, color: "#94A3B8" }}>{m.unit}</span>
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: "#94A3B8" }}>{m.note}</div>
            </div>
          ))}
        </div>

        {/* Upload CTA */}
        <div style={{
          background: "linear-gradient(135deg, #E0F2FE 0%, #CCFBF1 100%)",
          border: "1px solid #A5C8C5", borderRadius: 16,
          padding: "40px 36px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: 24,
        }}>
          <div>
            <h2 style={{
              fontFamily: "var(--font-cormorant), Georgia, serif",
              fontWeight: 400, fontSize: 26, color: "#0F172A",
              margin: "0 0 8px", letterSpacing: "-0.3px",
            }}>
              İlk kan tahlilini yükle
            </h2>
            <p style={{ fontSize: 14, color: "#475569", margin: 0, lineHeight: 1.6 }}>
              PDF olarak yükle, 15 dakikada kişisel analiz hazır.
            </p>
          </div>
          <button style={{
            background: "#0D9488", color: "#fff",
            border: "none", borderRadius: 10,
            padding: "13px 24px", fontSize: 14, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
          }}>
            Tahlil Yükle →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
