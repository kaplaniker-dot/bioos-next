"use client";

import { useEffect, useState, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);

interface MikroBesin {
  ad: string;
  oncelik: "yuksek" | "orta" | "dusuk";
  neden: string;
  gunlukHedef: string;
  kaynaklar: string[];
  takviyeOneri: string;
}

interface FinalRaporProps {
  rapor: {
    kisiBilgisi?: { ozet: string; gucluYonler: string[]; riskler: string[]; oncelikliMudahale: string[] };
    enerjiHedefi?: { bmr: number; tdee: number; gunlukKalori: number; aciklama: string };
    makroDagilimi?: {
      protein: { gram: number; yuzde: number; aciklama: string };
      karbonhidrat: { gram: number; yuzde: number; aciklama: string };
      yag: { gram: number; yuzde: number; aciklama: string };
    };
    kritikMikroBesinler?: MikroBesin[];
    kacinilacakBesinler?: { besin: string; neden: string }[];
    turkMutfagiOnerileri?: { yemek: string; neden: string; sıklık: string }[];
    pratikIpuclari?: string[];
  };
}

const ONCELIK = {
  yuksek: { bg: "#FEE2E2", text: "#991B1B", label: "Yüksek" },
  orta:   { bg: "#FEF3C7", text: "#92400E", label: "Orta" },
  dusuk:  { bg: "#DCFCE7", text: "#166534", label: "Düşük" },
};

function useCountUp(target: number, delay = 0, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    const t = setTimeout(() => {
      const steps = 50;
      const increment = target / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) { setVal(target); clearInterval(interval); }
        else setVal(Math.round(current));
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay, duration]);
  return val;
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.4s ease, transform 0.4s ease" }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 20, height: 2, background: "#0D9488", borderRadius: 1 }} />
      {children}
    </div>
  );
}

function Card({ children, accent, delay = 0 }: { children: React.ReactNode; accent?: string; delay?: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#FFFFFF",
          borderLeft: accent ? `4px solid ${accent}` : "none",
          border: accent ? undefined : "1px solid #E2E8F0",
          borderTop: accent ? "1px solid #E2E8F0" : undefined,
          borderRight: accent ? "1px solid #E2E8F0" : undefined,
          borderBottom: accent ? "1px solid #E2E8F0" : undefined,
          borderRadius: accent ? "0 14px 14px 0" : 14,
          padding: 24, marginBottom: 0,
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.08)" : "none",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
      >
        {children}
      </div>
    </FadeIn>
  );
}

export default function FinalRapor({ rapor }: FinalRaporProps) {
  const bmr = useCountUp(rapor.enerjiHedefi?.bmr || 0, 400);
  const tdee = useCountUp(rapor.enerjiHedefi?.tdee || 0, 600);
  const kalori = useCountUp(rapor.enerjiHedefi?.gunlukKalori || 0, 800);

  const makro = rapor.makroDagilimi;
  const donutData = makro ? {
    labels: ["Protein", "Karbonhidrat", "Yağ"],
    datasets: [{
      data: [makro.protein.yuzde, makro.karbonhidrat.yuzde, makro.yag.yuzde],
      backgroundColor: ["#3B82F6", "#F59E0B", "#EC4899"],
      borderWidth: 0,
      hoverOffset: 6,
    }],
  } : null;

  return (
    <div>
      {/* Başlık */}
      <FadeIn delay={0}>
        <div style={{
          background: "linear-gradient(135deg, #0F172A 0%, #134E4A 100%)",
          borderRadius: 16, padding: "28px 32px", marginBottom: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#5EEAD4", marginBottom: 8 }}>
              BioOS Beslenme Raporu
            </div>
            <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: 26, fontWeight: 400, margin: "0 0 4px", color: "#fff", letterSpacing: "-0.3px" }}>
              Kişisel Analiz Sonuçları
            </h2>
            <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>
              {new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <button onClick={() => window.print()} style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            PDF ↓
          </button>
        </div>
      </FadeIn>

      {/* Kişi profili */}
      {rapor.kisiBilgisi && (
        <FadeIn delay={150}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 14, padding: 24, marginBottom: 16 }}>
            <SectionTitle>Kişisel Profil</SectionTitle>
            <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, marginBottom: 16 }}>{rapor.kisiBilgisi.ozet}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div style={{ background: "#F0FDF4", borderLeft: "3px solid #22C55E", borderRadius: "0 10px 10px 0", padding: "14px 16px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#166534", marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>✓ Güçlü</div>
                {rapor.kisiBilgisi.gucluYonler?.map((m, i) => <div key={i} style={{ fontSize: 12, color: "#166534", lineHeight: 1.6 }}>• {m}</div>)}
              </div>
              <div style={{ background: "#FFF7ED", borderLeft: "3px solid #F59E0B", borderRadius: "0 10px 10px 0", padding: "14px 16px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#92400E", marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>⚠ Riskler</div>
                {rapor.kisiBilgisi.riskler?.map((m, i) => <div key={i} style={{ fontSize: 12, color: "#92400E", lineHeight: 1.6 }}>• {m}</div>)}
              </div>
              <div style={{ background: "#EDE9FE", borderLeft: "3px solid #8B5CF6", borderRadius: "0 10px 10px 0", padding: "14px 16px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#5B21B6", marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>⚡ Öncelik</div>
                {rapor.kisiBilgisi.oncelikliMudahale?.map((m, i) => <div key={i} style={{ fontSize: 12, color: "#5B21B6", lineHeight: 1.6 }}>• {m}</div>)}
              </div>
            </div>
          </div>
        </FadeIn>
      )}

      <div style={{ height: 1, background: "#F1F5F9", margin: "8px 0 20px" }} />

      {/* Enerji + Makro */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* Kalori sayaçlar */}
        {rapor.enerjiHedefi && (
          <FadeIn delay={300}>
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 14, padding: 24, height: "100%" }}>
              <SectionTitle>Günlük Enerji</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "BMR", val: bmr, renk: "#94A3B8" },
                  { label: "TDEE", val: tdee, renk: "#0EA5E9" },
                  { label: "Günlük Hedef", val: kalori, renk: "#0D9488", vurgu: true },
                ].map(k => (
                  <div key={k.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: k.vurgu ? "12px 14px" : "8px 0", background: k.vurgu ? "#CCFBF1" : "transparent", borderRadius: k.vurgu ? 10 : 0 }}>
                    <span style={{ fontSize: 13, color: k.vurgu ? "#0F766E" : "#64748B", fontWeight: k.vurgu ? 700 : 400 }}>{k.label}</span>
                    <span style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: k.vurgu ? 20 : 16, fontWeight: 600, color: k.renk }}>
                      {k.val} <span style={{ fontSize: 11, color: "#94A3B8" }}>kcal</span>
                    </span>
                  </div>
                ))}
              </div>
              {rapor.enerjiHedefi.aciklama && (
                <p style={{ fontSize: 12, color: "#64748B", margin: "14px 0 0", lineHeight: 1.6, borderTop: "1px solid #F1F5F9", paddingTop: 12 }}>
                  {rapor.enerjiHedefi.aciklama}
                </p>
              )}
            </div>
          </FadeIn>
        )}

        {/* Donut chart */}
        {donutData && (
          <FadeIn delay={450}>
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 14, padding: 24, height: "100%" }}>
              <SectionTitle>Makro Dağılımı</SectionTitle>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 120, height: 120, flexShrink: 0 }}>
                  <Doughnut data={donutData} options={{ cutout: "65%", plugins: { tooltip: { enabled: true }, legend: { display: false } }, animation: { animateRotate: true, duration: 1200 } }} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                  {(["protein", "karbonhidrat", "yag"] as const).map((m) => {
                    const d = makro![m];
                    const renk = { protein: "#3B82F6", karbonhidrat: "#F59E0B", yag: "#EC4899" }[m];
                    const ad = { protein: "Protein", karbonhidrat: "Karb.", yag: "Yağ" }[m];
                    return (
                      <div key={m}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: renk }} />
                            <span style={{ fontSize: 12, color: "#334155", fontWeight: 600 }}>{ad}</span>
                          </div>
                          <span style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 12, color: renk }}>{d.gram}g</span>
                        </div>
                        <div style={{ height: 4, background: "#F1F5F9", borderRadius: 999, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${d.yuzde}%`, background: renk, borderRadius: 999, transition: "width 1s ease" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 16, paddingTop: 14, borderTop: "1px solid #F1F5F9" }}>
                {(["protein", "karbonhidrat", "yag"] as const).map(m => (
                  <p key={m} style={{ fontSize: 11, color: "#94A3B8", margin: 0, lineHeight: 1.5 }}>
                    <strong style={{ color: "#64748B" }}>{ { protein: "Protein", karbonhidrat: "Karbonhidrat", yag: "Yağ" }[m]}:</strong> {makro![m].aciklama}
                  </p>
                ))}
              </div>
            </div>
          </FadeIn>
        )}
      </div>

      <div style={{ height: 1, background: "#F1F5F9", margin: "8px 0 20px" }} />

      {/* Kritik mikro besinler */}
      {rapor.kritikMikroBesinler && rapor.kritikMikroBesinler.length > 0 && (
        <FadeIn delay={600}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 14, padding: 24, marginBottom: 16 }}>
            <SectionTitle>Kritik Mikro Besinler</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {rapor.kritikMikroBesinler.map((mb, i) => {
                const renk = ONCELIK[mb.oncelik] || ONCELIK.orta;
                const accentRenk = { yuksek: "#EF4444", orta: "#F59E0B", dusuk: "#22C55E" }[mb.oncelik];
                return (
                  <div key={i} style={{ borderLeft: `4px solid ${accentRenk}`, borderTop: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0", borderRadius: "0 12px 12px 0", padding: "14px 18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{mb.ad}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: renk.bg, color: renk.text }}>{renk.label}</span>
                      </div>
                      <span style={{ fontSize: 12, fontFamily: "var(--font-dm-mono), monospace", color: "#64748B" }}>{mb.gunlukHedef}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#475569", margin: "0 0 10px", lineHeight: 1.6 }}>{mb.neden}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: mb.takviyeOneri ? 8 : 0 }}>
                      {mb.kaynaklar?.map((k, ki) => <span key={ki} style={{ fontSize: 11, background: "#F8FAFC", color: "#475569", padding: "3px 10px", borderRadius: 999, border: "1px solid #E2E8F0" }}>{k}</span>)}
                    </div>
                    {mb.takviyeOneri && <div style={{ background: "#F0FDF4", borderRadius: 8, padding: "7px 12px", fontSize: 12, color: "#166534" }}>💊 {mb.takviyeOneri}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      )}

      {/* Kaçınılacak + Türk mutfağı */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {rapor.kacinilacakBesinler && rapor.kacinilacakBesinler.length > 0 && (
          <FadeIn delay={750}>
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 14, padding: 24 }}>
              <SectionTitle>Kaçınılacak Besinler</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {rapor.kacinilacakBesinler.map((b, i) => (
                  <div key={i} style={{ borderLeft: "3px solid #EF4444", background: "#FEF2F2", borderRadius: "0 8px 8px 0", padding: "10px 14px" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#991B1B", marginBottom: 2 }}>✗ {b.besin}</div>
                    <div style={{ fontSize: 11, color: "#7F1D1D", lineHeight: 1.5 }}>{b.neden}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}
        {rapor.turkMutfagiOnerileri && rapor.turkMutfagiOnerileri.length > 0 && (
          <FadeIn delay={850}>
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 14, padding: 24 }}>
              <SectionTitle>Türk Mutfağından Öneriler</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {rapor.turkMutfagiOnerileri.map((t, i) => (
                  <div key={i} style={{ borderLeft: "3px solid #22C55E", background: "#F0FDF4", borderRadius: "0 8px 8px 0", padding: "10px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}>✓ {t.yemek}</span>
                      <span style={{ fontSize: 10, color: "#166534", background: "#DCFCE7", padding: "2px 8px", borderRadius: 999 }}>{t.sıklık}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#14532D", lineHeight: 1.5 }}>{t.neden}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        )}
      </div>

      {/* Pratik ipuçları */}
      {rapor.pratikIpuclari && rapor.pratikIpuclari.length > 0 && (
        <FadeIn delay={950}>
          <div style={{ background: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)", border: "1px solid #BAE6FD", borderRadius: 14, padding: 24, marginBottom: 20 }}>
            <SectionTitle>Pratik İpuçları</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {rapor.pratikIpuclari.map((ip, i) => (
                <div key={i} style={{ display: "flex", gap: 10, background: "#fff", borderRadius: 10, padding: "12px 14px", borderLeft: "3px solid #0EA5E9" }}>
                  <span style={{ color: "#0284C7", fontWeight: 700, flexShrink: 0, fontFamily: "var(--font-dm-mono), monospace", fontSize: 13 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.5 }}>{ip}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      <FadeIn delay={1050}>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <a href="/dashboard/beslenme/takip" style={{ background: "#0D9488", color: "#fff", textDecoration: "none", borderRadius: 10, padding: "13px 24px", fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8 }}>
            Diyet Takibine Başla →
          </a>
        </div>
      </FadeIn>

      <style>{`
        @media print { nav, button, a[href] { display: none !important; } body { background: white !important; } }
      `}</style>
    </div>
  );
}
