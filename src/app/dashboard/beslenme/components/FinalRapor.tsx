"use client";

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
    kisiBilgisi?: {
      ozet: string;
      gucluYonler: string[];
      riskler: string[];
      oncelikliMudahale: string[];
    };
    enerjiHedefi?: {
      bmr: number;
      tdee: number;
      gunlukKalori: number;
      aciklama: string;
    };
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

const MAKRO_RENK = {
  protein: { bg: "#DBEAFE", text: "#1E40AF", bar: "#3B82F6" },
  karbonhidrat: { bg: "#FEF3C7", text: "#92400E", bar: "#F59E0B" },
  yag: { bg: "#FCE7F3", text: "#9D174D", bar: "#EC4899" },
};

const ONCELIK_RENK = {
  yuksek: { bg: "#FEE2E2", text: "#991B1B", label: "Yüksek" },
  orta: { bg: "#FEF3C7", text: "#92400E", label: "Orta" },
  dusuk: { bg: "#DCFCE7", text: "#166534", label: "Düşük" },
};

export default function FinalRapor({ rapor }: FinalRaporProps) {
  function yazdir() {
    window.print();
  }

  return (
    <div>
      {/* Rapor başlık */}
      <div style={{
        background: "linear-gradient(135deg, #0F172A 0%, #134E4A 100%)",
        borderRadius: 16, padding: 32, marginBottom: 20, color: "#fff",
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5EEAD4", marginBottom: 8 }}>
            BioOS Beslenme Raporu
          </div>
          <h2 style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: 28, fontWeight: 400, margin: "0 0 8px", letterSpacing: "-0.3px",
          }}>
            Kişisel Analiz Sonuçları
          </h2>
          <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>
            {new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <button
          onClick={yazdir}
          style={{
            background: "rgba(255,255,255,0.1)", color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10,
            padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          PDF İndir ↓
        </button>
      </div>

      {/* Kişi özeti */}
      {rapor.kisiBilgisi && (
        <div style={{ background: "#FFFFFF", border: "1px solid #A5C8C5", borderRadius: 14, padding: 24, marginBottom: 16 }}>
          <SectionTitle>Kişisel Profil</SectionTitle>
          <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.7, marginBottom: 16 }}>
            {rapor.kisiBilgisi.ozet}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <MiniListe baslik="✓ Güçlü Yönler" renkBg="#DCFCE7" renkText="#166534" maddeler={rapor.kisiBilgisi.gucluYonler} />
            <MiniListe baslik="⚠ Riskler" renkBg="#FEF3C7" renkText="#92400E" maddeler={rapor.kisiBilgisi.riskler} />
            <MiniListe baslik="⚡ Öncelikli Müdahale" renkBg="#EDE9FE" renkText="#5B21B6" maddeler={rapor.kisiBilgisi.oncelikliMudahale} />
          </div>
        </div>
      )}

      {/* Enerji hedefi */}
      {rapor.enerjiHedefi && (
        <div style={{ background: "#FFFFFF", border: "1px solid #A5C8C5", borderRadius: 14, padding: 24, marginBottom: 16 }}>
          <SectionTitle>Günlük Enerji Hedefi</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
            {[
              { label: "BMR (Bazal Metabolizma)", value: rapor.enerjiHedefi.bmr, unit: "kcal" },
              { label: "TDEE (Toplam Enerji)", value: rapor.enerjiHedefi.tdee, unit: "kcal" },
              { label: "Günlük Hedef", value: rapor.enerjiHedefi.gunlukKalori, unit: "kcal", vurgu: true },
            ].map((k) => (
              <div key={k.label} style={{
                background: k.vurgu ? "linear-gradient(135deg, #E0F2FE, #CCFBF1)" : "#F8FAFC",
                border: `1px solid ${k.vurgu ? "#0D9488" : "#E2E8F0"}`,
                borderRadius: 12, padding: 20, textAlign: "center",
              }}>
                <div style={{ fontSize: 11, color: "#64748B", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>{k.label}</div>
                <div style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: 28, fontWeight: 500, color: k.vurgu ? "#0F766E" : "#0F172A",
                }}>
                  {k.value}
                  <span style={{ fontSize: 13, color: "#94A3B8" }}> {k.unit}</span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#64748B", margin: 0, lineHeight: 1.6 }}>{rapor.enerjiHedefi.aciklama}</p>
        </div>
      )}

      {/* Makro dağılımı */}
      {rapor.makroDagilimi && (
        <div style={{ background: "#FFFFFF", border: "1px solid #A5C8C5", borderRadius: 14, padding: 24, marginBottom: 16 }}>
          <SectionTitle>Makro Besin Dağılımı</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {(["protein", "karbonhidrat", "yag"] as const).map((m) => {
              const d = rapor.makroDagilimi![m];
              const renk = MAKRO_RENK[m];
              const etiket = { protein: "Protein", karbonhidrat: "Karbonhidrat", yag: "Yağ" }[m];
              return (
                <div key={m} style={{ background: renk.bg, borderRadius: 12, padding: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: renk.text, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{etiket}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                    <span style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 28, fontWeight: 500, color: renk.text }}>{d.gram}</span>
                    <span style={{ fontSize: 13, color: renk.text, opacity: 0.7 }}>g</span>
                    <span style={{ fontSize: 14, color: renk.text, opacity: 0.7, marginLeft: 4 }}>(%{d.yuzde})</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(0,0,0,0.1)", borderRadius: 999, marginBottom: 10, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${d.yuzde}%`, background: renk.bar, borderRadius: 999 }} />
                  </div>
                  <p style={{ fontSize: 12, color: renk.text, opacity: 0.8, margin: 0, lineHeight: 1.5 }}>{d.aciklama}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Kritik mikro besinler */}
      {rapor.kritikMikroBesinler && rapor.kritikMikroBesinler.length > 0 && (
        <div style={{ background: "#FFFFFF", border: "1px solid #A5C8C5", borderRadius: 14, padding: 24, marginBottom: 16 }}>
          <SectionTitle>Kritik Mikro Besinler</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {rapor.kritikMikroBesinler.map((mb, i) => {
              const renk = ONCELIK_RENK[mb.oncelik] || ONCELIK_RENK.orta;
              return (
                <div key={i} style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{mb.ad}</span>
                      <span style={{ fontSize: 12, color: "#64748B", marginLeft: 8 }}>{mb.gunlukHedef}</span>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
                      background: renk.bg, color: renk.text,
                    }}>
                      {renk.label} Öncelik
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "#475569", margin: "0 0 10px", lineHeight: 1.6 }}>{mb.neden}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: mb.takviyeOneri ? 10 : 0 }}>
                    {mb.kaynaklar.map((k, ki) => (
                      <span key={ki} style={{ fontSize: 12, background: "#F1F5F9", color: "#334155", padding: "3px 10px", borderRadius: 999 }}>
                        {k}
                      </span>
                    ))}
                  </div>
                  {mb.takviyeOneri && (
                    <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 8, padding: "8px 12px" }}>
                      <span style={{ fontSize: 12, color: "#166534" }}>💊 Takviye: {mb.takviyeOneri}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Kaçınılacak besinler + Türk mutfağı önerileri */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {rapor.kacinilacakBesinler && rapor.kacinilacakBesinler.length > 0 && (
          <div style={{ background: "#FFFFFF", border: "1px solid #A5C8C5", borderRadius: 14, padding: 24 }}>
            <SectionTitle>Kaçınılacak Besinler</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {rapor.kacinilacakBesinler.map((b, i) => (
                <div key={i} style={{ background: "#FEF2F2", borderRadius: 10, padding: "10px 14px" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#991B1B", marginBottom: 3 }}>✗ {b.besin}</div>
                  <div style={{ fontSize: 12, color: "#7F1D1D", lineHeight: 1.5 }}>{b.neden}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {rapor.turkMutfagiOnerileri && rapor.turkMutfagiOnerileri.length > 0 && (
          <div style={{ background: "#FFFFFF", border: "1px solid #A5C8C5", borderRadius: 14, padding: 24 }}>
            <SectionTitle>Türk Mutfağından Öneriler</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {rapor.turkMutfagiOnerileri.map((t, i) => (
                <div key={i} style={{ background: "#F0FDF4", borderRadius: 10, padding: "10px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}>✓ {t.yemek}</span>
                    <span style={{ fontSize: 11, color: "#166534", background: "#DCFCE7", padding: "2px 8px", borderRadius: 999 }}>{t.sıklık}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#14532D", lineHeight: 1.5 }}>{t.neden}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pratik ipuçları */}
      {rapor.pratikIpuclari && rapor.pratikIpuclari.length > 0 && (
        <div style={{ background: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)", border: "1px solid #BAE6FD", borderRadius: 14, padding: 24, marginBottom: 20 }}>
          <SectionTitle>Pratik İpuçları</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {rapor.pratikIpuclari.map((ip, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#fff", borderRadius: 8, padding: "10px 14px" }}>
                <span style={{ color: "#0284C7", fontWeight: 700, flexShrink: 0, fontSize: 14 }}>{i + 1}.</span>
                <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.5 }}>{ip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alt butonlar */}
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <a href="/dashboard/beslenme/takip" style={{
          background: "#0D9488", color: "#fff", textDecoration: "none",
          borderRadius: 10, padding: "13px 24px", fontSize: 14, fontWeight: 600,
          display: "inline-flex", alignItems: "center", gap: 8,
        }}>
          Diyet Takibine Başla →
        </a>
      </div>

      <style>{`
        @media print {
          nav, button, a[href] { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
      {children}
    </h3>
  );
}

function MiniListe({ baslik, renkBg, renkText, maddeler }: { baslik: string; renkBg: string; renkText: string; maddeler: string[] }) {
  return (
    <div style={{ background: renkBg, borderRadius: 10, padding: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: renkText, marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>{baslik}</div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {maddeler?.map((m, i) => (
          <li key={i} style={{ fontSize: 12, color: renkText, lineHeight: 1.6, padding: "1px 0" }}>• {m}</li>
        ))}
      </ul>
    </div>
  );
}
