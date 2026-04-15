"use client";

import { useEffect, useState } from "react";

interface Deger {
  ad: string;
  deger: string;
  referans: string;
  durum: "normal" | "dikkat" | "risk";
  yorum: string;
}

interface AnalizSonucProps {
  sonuc: {
    genelDegerlendirme?: string;
    degerler?: Deger[];
    oncelikliMudahale?: string[];
    gucluyonler?: string[];
  };
  yukleniyor: boolean;
  onDevam: () => void;
  sadeceBilgi?: boolean;
}

const DURUM = {
  normal: { bg: "#DCFCE7", text: "#166534", border: "#86EFAC", accent: "#22C55E", ikon: "✓", etiket: "Normal" },
  dikkat: { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D", accent: "#F59E0B", ikon: "⚠", etiket: "Dikkat" },
  risk:   { bg: "#FEE2E2", text: "#991B1B", border: "#FCA5A5", accent: "#EF4444", ikon: "!", etiket: "Önlem Al" },
};

function useCountUp(target: number, delay: number = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let start = 0;
      const step = target / 40;
      const interval = setInterval(() => {
        start += step;
        if (start >= target) { setVal(target); clearInterval(interval); }
        else setVal(Math.round(start));
      }, 20);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay]);
  return val;
}

function DegerKart({ d, index }: { d: Deger; index: number }) {
  const [visible, setVisible] = useState(false);
  const renk = DURUM[d.durum] || DURUM.normal;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 120);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div style={{
      background: "#FFFFFF",
      borderLeft: `4px solid ${renk.accent}`,
      borderTop: "1px solid #E2E8F0",
      borderRight: "1px solid #E2E8F0",
      borderBottom: "1px solid #E2E8F0",
      borderRadius: "0 12px 12px 0",
      padding: "16px 20px",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: "opacity 0.35s ease, transform 0.35s ease",
      cursor: "default",
    }}
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{d.ad}</span>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
              background: renk.bg, color: renk.text,
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <span>{renk.ikon}</span> {renk.etiket}
            </span>
          </div>
          <p style={{ fontSize: 12, color: "#475569", margin: 0, lineHeight: 1.6 }}>{d.yorum}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 16, fontWeight: 600, color: renk.accent }}>
            {d.deger}
          </div>
          <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>{d.referans}</div>
        </div>
      </div>
    </div>
  );
}

export default function AnalizSonucu({ sonuc, yukleniyor, onDevam, sadeceBilgi }: AnalizSonucProps) {
  const [headerVisible, setHeaderVisible] = useState(false);
  const normalSayisi = sonuc.degerler?.filter(d => d.durum === "normal").length || 0;
  const dikkatSayisi = sonuc.degerler?.filter(d => d.durum === "dikkat").length || 0;
  const riskSayisi = sonuc.degerler?.filter(d => d.durum === "risk").length || 0;

  const normalCount = useCountUp(normalSayisi, 300);
  const dikkatCount = useCountUp(dikkatSayisi, 450);
  const riskCount = useCountUp(riskSayisi, 600);

  useEffect(() => {
    const t = setTimeout(() => setHeaderVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      {/* Özet sayaçlar */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20,
        opacity: headerVisible ? 1 : 0, transform: headerVisible ? "translateY(0)" : "translateY(-10px)",
        transition: "opacity 0.4s, transform 0.4s",
      }}>
        {[
          { label: "Normal", count: normalCount, renk: "#22C55E", bg: "#DCFCE7" },
          { label: "Dikkat", count: dikkatCount, renk: "#F59E0B", bg: "#FEF3C7" },
          { label: "Önlem Al", count: riskCount, renk: "#EF4444", bg: "#FEE2E2" },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "16px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 32, fontWeight: 600, color: s.renk }}>{s.count}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: s.renk, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Genel değerlendirme */}
      {sonuc.genelDegerlendirme && (
        <div style={{
          background: "linear-gradient(135deg, #E0F2FE 0%, #CCFBF1 100%)",
          borderLeft: "4px solid #0D9488",
          borderTop: "1px solid #A5C8C5", borderRight: "1px solid #A5C8C5", borderBottom: "1px solid #A5C8C5",
          borderRadius: "0 12px 12px 0", padding: 20, marginBottom: 20,
          opacity: headerVisible ? 1 : 0, transition: "opacity 0.5s 0.2s",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0F766E", marginBottom: 8 }}>
            Genel Değerlendirme
          </div>
          <p style={{ fontSize: 14, color: "#0F172A", lineHeight: 1.7, margin: 0 }}>
            {sonuc.genelDegerlendirme}
          </p>
        </div>
      )}

      {/* Değerler */}
      {sonuc.degerler && sonuc.degerler.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
            Ölçüm Değerlendirmesi
          </div>
          {sonuc.degerler.map((d, i) => <DegerKart key={i} d={d} index={i} />)}
        </div>
      )}

      {/* separator */}
      <div style={{ height: 1, background: "#E2E8F0", margin: "24px 0" }} />

      {/* Güçlü yönler + Öncelikli müdahale */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        {sonuc.gucluyonler && sonuc.gucluyonler.length > 0 && (
          <div style={{ background: "#F0FDF4", borderLeft: "4px solid #22C55E", borderTop: "1px solid #86EFAC", borderRight: "1px solid #86EFAC", borderBottom: "1px solid #86EFAC", borderRadius: "0 12px 12px 0", padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#166534", marginBottom: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              ✓ Güçlü Yönler
            </div>
            {sonuc.gucluyonler.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0", borderBottom: i < sonuc.gucluyonler!.length - 1 ? "1px solid #DCFCE7" : "none" }}>
                <span style={{ color: "#22C55E", fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 13, color: "#166534", lineHeight: 1.5 }}>{m}</span>
              </div>
            ))}
          </div>
        )}
        {sonuc.oncelikliMudahale && sonuc.oncelikliMudahale.length > 0 && (
          <div style={{ background: "#FFFBEB", borderLeft: "4px solid #F59E0B", borderTop: "1px solid #FCD34D", borderRight: "1px solid #FCD34D", borderBottom: "1px solid #FCD34D", borderRadius: "0 12px 12px 0", padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#92400E", marginBottom: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              ⚡ Öncelikli Müdahale
            </div>
            {sonuc.oncelikliMudahale.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0", borderBottom: i < sonuc.oncelikliMudahale!.length - 1 ? "1px solid #FEF3C7" : "none" }}>
                <span style={{ color: "#F59E0B", fontWeight: 700, flexShrink: 0 }}>→</span>
                <span style={{ fontSize: 13, color: "#92400E", lineHeight: 1.5 }}>{m}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {!sadeceBilgi && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
            Sonraki adımda sana özel anamnez formu oluşturulacak.
          </p>
          <button
            onClick={onDevam}
            disabled={yukleniyor}
            style={{
              background: "#0D9488", color: "#fff", border: "none", borderRadius: 10,
              padding: "13px 28px", fontSize: 14, fontWeight: 600,
              cursor: yukleniyor ? "not-allowed" : "pointer", fontFamily: "inherit",
              opacity: yukleniyor ? 0.6 : 1, display: "flex", alignItems: "center", gap: 8,
            }}
          >
            {yukleniyor ? (
              <>
                <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                Form oluşturuluyor...
              </>
            ) : "Anamnez Formuna Geç →"}
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
