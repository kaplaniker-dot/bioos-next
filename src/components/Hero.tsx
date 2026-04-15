"use client";

import { useRef } from "react";
import { useModal } from "@/context/ModalContext";
import { usePostHog } from "@/components/PostHogProvider";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

const chartData = {
  labels: ["Hf 1", "Hf 2", "Hf 3", "Hf 4", "Hf 5", "Hf 6", "Hf 7", "Hf 8"],
  datasets: [
    {
      data: [62, 65, 63, 70, 68, 75, 78, 82],
      borderColor: "#0D9488",
      backgroundColor: "rgba(13,148,136,0.07)",
      borderWidth: 2,
      pointRadius: 3,
      pointBackgroundColor: "#0D9488",
      pointBorderColor: "#F4FAFA",
      pointBorderWidth: 2,
      tension: 0.4,
      fill: true,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#0F172A",
      titleColor: "#94A3B8",
      bodyColor: "#F4FAFA",
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { family: "DM Mono", size: 9 }, color: "#94A3B8" },
      border: { display: false },
    },
    y: {
      grid: { color: "#D5EEEB" },
      ticks: { font: { family: "DM Mono", size: 9 }, color: "#94A3B8" },
      border: { display: false },
    },
  },
} as const;

const sidebarItems = ["Kan Tahlili", "Beslenme", "Egzersiz", "Grafikler"];

const bloodTests = [
  { label: "B12",        value: "890 pg/mL", status: "İyi",    bg: "#D1FAE5", border: "#059669", textColor: "#064E3B" },
  { label: "D Vitamini", value: "42 ng/mL",  status: "Normal", bg: "#E0F2FE", border: "#A5C8C5", textColor: "#0369A1" },
  { label: "Demir",      value: "68 µg/dL",  status: "Düşük",  bg: "#FEF3C7", border: "#D97706", textColor: "#92400E" },
];

const bullets = [
  { color: "#D97706", text: "Kan tahlilini yükle, 15 dk'da plan hazır" },
  { color: "#059669", text: "Beslenme, egzersiz ve takviye tek ekosistemde" },
  { color: "#0284C7", text: "Veriler birbiriyle konuşur, plan kendini günceller" },
];

const heroStats = [
  { value: "+40%",  label: "Enerji artışı",    color: "#D97706" },
  { value: "%91",   label: "Plan uyum oranı",  color: "#059669" },
  { value: "15 dk", label: "İlk analiz",       color: "#0284C7" },
];

export default function Hero() {
  const mockupRef = useRef<HTMLDivElement>(null);
  const { open } = useModal();
  const ph = usePostHog();

  const handleMouseOver = () => {
    if (!mockupRef.current) return;
    mockupRef.current.style.transform = "perspective(1600px) rotateX(0deg) translateY(-4px)";
    mockupRef.current.style.boxShadow =
      "0 2px 4px rgba(15,23,42,0.04),0 20px 48px rgba(15,23,42,0.13),0 48px 80px rgba(13,148,136,0.14)";
  };
  const handleMouseOut = () => {
    if (!mockupRef.current) return;
    mockupRef.current.style.transform = "perspective(1600px) rotateX(2.5deg)";
    mockupRef.current.style.boxShadow =
      "0 2px 4px rgba(15,23,42,0.04),0 12px 32px rgba(15,23,42,0.09),0 32px 64px rgba(13,148,136,0.1)";
  };

  return (
    <section
      style={{
        padding: "72px 32px 88px",
        background:
          "radial-gradient(ellipse 80% 50% at 50% -10%,rgba(13,148,136,0.09) 0%,transparent 70%),#F4FAFA",
      }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>

        {/* Label */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span className="section-label" style={{ justifyContent: "center" }}>
            Biyolojik İşletim Sistemi
          </span>
        </div>

        {/* Mockup wrapper */}
        <div style={{ position: "relative", marginBottom: 80 }}>

          {/* Glow */}
          <div style={{
            position: "absolute", inset: "-32px -48px",
            background: "radial-gradient(ellipse 60% 50% at 50% 50%,rgba(13,148,136,0.13),transparent 70%)",
            pointerEvents: "none", zIndex: 0,
          }} />

          {/* Badge — top right */}
          <div style={{
            position: "absolute", top: -18, right: 48, zIndex: 10,
            background: "#0F172A", borderRadius: 100, padding: "8px 18px",
            display: "inline-flex", alignItems: "center", gap: 7,
            boxShadow: "0 8px 24px rgba(15,23,42,0.22)",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#059669", display: "inline-block", boxShadow: "0 0 6px rgba(5,150,105,0.8)" }} />
            <span className="font-mono-brand" style={{ fontSize: 11, fontWeight: 500, color: "#F4FAFA", letterSpacing: "0.5px" }}>
              Analiz hazır
            </span>
          </div>

          {/* Badge — bottom left */}
          <div style={{
            position: "absolute", bottom: -18, left: 48, zIndex: 10,
            background: "#F4FAFA", border: "1px solid #A5C8C5", borderRadius: 12,
            padding: "10px 16px", display: "inline-flex", alignItems: "center", gap: 10,
            boxShadow: "0 8px 24px rgba(15,23,42,0.1)",
          }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className="font-mono-brand" style={{ fontSize: 13, fontWeight: 500, color: "#0D9488", lineHeight: 1 }}>↑ 12%</span>
              <span style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>Bu hafta</span>
            </div>
            <div style={{ width: 1, height: 28, background: "#A5C8C5" }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: "#0F172A", lineHeight: 1.3 }}>Enerji skoru</span>
              <span style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>kişisel rekor</span>
            </div>
          </div>

          {/* Dashboard mockup card */}
          <div
            ref={mockupRef}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            style={{
              position: "relative", zIndex: 1,
              background: "linear-gradient(135deg,#E0F2FE 0%,#CCFBF1 55%,#D1FAE5 100%)",
              border: "1.5px solid rgba(13,148,136,0.35)", borderRadius: 20,
              padding: 28, overflow: "hidden",
              boxShadow: "0 2px 4px rgba(15,23,42,0.04),0 12px 32px rgba(15,23,42,0.09),0 32px 64px rgba(13,148,136,0.1)",
              transform: "perspective(1600px) rotateX(2.5deg)",
              transition: "transform 0.4s ease, box-shadow 0.4s ease",
            }}
          >
            {/* Top shine */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 1,
              background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.9) 50%,transparent 100%)",
            }} />

            <div className="hero-mockup-grid">
              {/* Sidebar */}
              <div className="hero-mockup-sidebar" style={{
                background: "#F4FAFA", border: "1px solid #A5C8C5",
                borderRadius: 12, padding: "20px 16px",
              }}>
                <div className="font-mono-brand" style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#94A3B8", marginBottom: 16 }}>
                  Menü
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ padding: "8px 12px", borderRadius: 8, background: "#D97706", color: "#fff", fontSize: 12, fontWeight: 500 }}>
                    Dashboard
                  </div>
                  {sidebarItems.map((item) => (
                    <div key={item} style={{ padding: "8px 12px", borderRadius: 8, color: "#475569", fontSize: 12, cursor: "pointer" }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Center */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="hero-metric-cards">
                  {/* KAD */}
                  <div className="metric-card">
                    <div className="font-mono-brand" style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#94A3B8", marginBottom: 8 }}>KAD</div>
                    <div className="font-mono-brand" style={{ fontSize: 28, fontWeight: 500, color: "#0F172A", lineHeight: 1 }}>
                      72 <span style={{ fontSize: 12, color: "#94A3B8" }}>ms</span>
                    </div>
                    <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669", display: "inline-block" }} />
                      <span style={{ fontSize: 10, color: "#059669", fontWeight: 500 }}>↑ Optimal</span>
                    </div>
                  </div>
                  {/* Uyku */}
                  <div className="metric-card">
                    <div className="font-mono-brand" style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#94A3B8", marginBottom: 8 }}>Uyku</div>
                    <div className="font-mono-brand" style={{ fontSize: 28, fontWeight: 500, color: "#0F172A", lineHeight: 1 }}>
                      91 <span style={{ fontSize: 12, color: "#94A3B8" }}>/100</span>
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <div style={{ height: 3, background: "#C8E8E5", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ width: "91%", height: "100%", background: "#D97706", borderRadius: 2 }} />
                      </div>
                    </div>
                  </div>
                  {/* VO2 Max */}
                  <div className="metric-card">
                    <div className="font-mono-brand" style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#94A3B8", marginBottom: 8 }}>VO2 Max</div>
                    <div className="font-mono-brand" style={{ fontSize: 28, fontWeight: 500, color: "#0F172A", lineHeight: 1 }}>58.4</div>
                    <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0284C7", display: "inline-block" }} />
                      <span style={{ fontSize: 10, color: "#0284C7", fontWeight: 500 }}>Üst Dilim</span>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div style={{ background: "#F4FAFA", border: "1px solid #A5C8C5", borderRadius: 12, padding: 16, flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: "#0F172A" }}>Son 8 Hafta</div>
                    <div className="font-mono-brand" style={{ fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: "#94A3B8" }}>Enerji Skoru</div>
                  </div>
                  <Line data={chartData} options={chartOptions} height={80} />
                </div>
              </div>

              {/* Blood test panel */}
              <div className="hero-mockup-bloodtest" style={{ background: "#F4FAFA", border: "1px solid #A5C8C5", borderRadius: 12, padding: 16 }}>
                <div className="font-mono-brand" style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#94A3B8", marginBottom: 14 }}>
                  Kan Tahlili
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {bloodTests.map((t) => (
                    <div key={t.label} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 12px", background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8,
                    }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#0F172A" }}>{t.label}</div>
                        <div className="font-mono-brand" style={{ fontSize: 10, color: "#475569", marginTop: 1 }}>{t.value}</div>
                      </div>
                      <span style={{ fontSize: 10, color: t.textColor, fontWeight: 500, background: "#F4FAFA", padding: "3px 8px", borderRadius: 100 }}>
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Title block */}
        <div className="hero-title-grid">
          <div>
            <h1 className="font-display" style={{
              fontWeight: 400, fontSize: "clamp(44px,5vw,64px)", lineHeight: 1.02,
              letterSpacing: "-1.5px", color: "#0F172A", margin: "0 0 22px",
            }}>
              Biyolojini anla,<br />hayatını tasarla.
            </h1>
            <p style={{ fontSize: 18, fontWeight: 500, color: "#334155", lineHeight: 1.7, maxWidth: 480, margin: "0 0 32px" }}>
              Kan tahlilinden beslenme planına, egzersizden uzun ömre — yapay zeka ile kişiselleştirilmiş sağlık optimizasyonu. Tüm veriler birbiriyle konuşur.
            </p>
            <button onClick={() => { ph?.capture("cta_clicked", { location: "hero" }); open(); }} className="btn-primary">Ücretsiz Hesap Oluştur →</button>
          </div>

          <div style={{ paddingTop: 6 }}>
            <p style={{ fontSize: 15, fontWeight: 400, color: "#475569", lineHeight: 1.8, margin: "0 0 28px" }}>
              BioOS, sağlık verilerini anlamlı eyleme dönüştürür. Hangi besinlerden kaçınacağını, hangi egzersizleri yapacağını ve neden yapacağını bilimsel olarak gösterir.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {bullets.map((b) => (
                <div key={b.text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: b.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#0F172A" }}>{b.text}</span>
                </div>
              ))}
            </div>
            <div className="hero-stats-row">
              {heroStats.map((s, i) => (
                <div key={s.label} style={{ display: "contents" }}>
                  {i > 0 && <div className="stats-sep" style={{ width: 1, background: "#A5C8C5" }} />}
                  <div>
                    <div className="font-mono-brand" style={{ fontSize: 22, fontWeight: 500, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: "#94A3B8", marginTop: 4, letterSpacing: "0.3px" }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .hero-mockup-grid {
          display: grid;
          grid-template-columns: 180px 1fr 220px;
          gap: 16px;
          min-height: 300px;
        }
        .hero-title-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 72px;
          align-items: start;
        }
        .hero-stats-row {
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid #A5C8C5;
          display: flex;
          gap: 28px;
        }
        .metric-card {
          background: #F4FAFA;
          border: 1px solid #A5C8C5;
          border-radius: 12px;
          padding: 16px;
        }
        .hero-metric-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        @media (max-width: 900px) {
          .hero-mockup-grid { grid-template-columns: 1fr !important; }
          .hero-mockup-sidebar { display: none !important; }
          .hero-mockup-bloodtest { display: none !important; }
          .hero-title-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 600px) {
          .hero-metric-cards { grid-template-columns: 1fr !important; }
          .hero-stats-row { flex-direction: column !important; gap: 12px !important; }
          .stats-sep { display: none !important; }
        }
      `}</style>
    </section>
  );
}
