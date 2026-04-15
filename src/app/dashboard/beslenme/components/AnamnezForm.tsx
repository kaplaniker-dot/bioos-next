"use client";

import { useState, useEffect } from "react";

interface Soru {
  id: string;
  soru: string;
  tip: "text" | "radio" | "checkbox" | "number" | "select";
  secenekler: string[];
  zorunlu: boolean;
}

interface Kategori {
  baslik: string;
  sorular: Soru[];
}

interface AnamnezFormProps {
  form: { kategoriler?: Kategori[] };
  yukleniyor: boolean;
  onGonder: (cevaplar: Record<string, string>) => void;
}

export default function AnamnezForm({ form, yukleniyor, onGonder }: AnamnezFormProps) {
  const kategoriler = form.kategoriler || [];
  // Tüm soruları düz liste yap
  const tumSorular: { soru: Soru; kategoriBaslik: string }[] = kategoriler.flatMap(k =>
    k.sorular.map(s => ({ soru: s, kategoriBaslik: k.baslik }))
  );
  const toplamSoru = tumSorular.length;

  const [aktifIndex, setAktifIndex] = useState(0);
  const [cevaplar, setCevaplar] = useState<Record<string, string>>({});
  const [girdi, setGirdi] = useState("");
  const [animating, setAnimating] = useState(false);

  const aktif = tumSorular[aktifIndex];
  const cevaplandi = Object.keys(cevaplar).filter(k => cevaplar[k]).length;

  // Soru değişince girdiyi sıfırla
  useEffect(() => {
    setGirdi(cevaplar[aktif?.soru.id] || "");
  }, [aktifIndex]);

  function ilerle(deger?: string) {
    const id = aktif.soru.id;
    const value = deger ?? girdi;
    if (value) setCevaplar(p => ({ ...p, [id]: value }));

    if (aktifIndex < toplamSoru - 1) {
      setAnimating(true);
      setTimeout(() => {
        setAktifIndex(i => i + 1);
        setAnimating(false);
      }, 200);
    }
  }

  function geri() {
    if (aktifIndex > 0) {
      setAnimating(true);
      setTimeout(() => {
        setAktifIndex(i => i - 1);
        setAnimating(false);
      }, 200);
    }
  }

  function gonder() {
    const id = aktif.soru.id;
    if (girdi) setCevaplar(p => ({ ...p, [id]: girdi }));
    onGonder({ ...cevaplar, ...(girdi ? { [id]: girdi } : {}) });
  }

  if (!aktif) return null;

  const sonSoru = aktifIndex === toplamSoru - 1;
  const mevcutCevap = cevaplar[aktif.soru.id];

  return (
    <div>
      {/* Progress */}
      <div style={{ background: "#FFFFFF", border: "1px solid #A5C8C5", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
            {aktif.kategoriBaslik}
          </span>
          <span style={{ fontSize: 13, color: "#64748B", fontFamily: "var(--font-dm-mono), monospace" }}>
            {aktifIndex + 1} / {toplamSoru}
          </span>
        </div>
        <div style={{ height: 6, background: "#E2E8F0", borderRadius: 999, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 999,
            background: "linear-gradient(90deg, #0D9488, #5EEAD4)",
            width: `${((aktifIndex + 1) / toplamSoru) * 100}%`,
            transition: "width 0.4s ease",
          }} />
        </div>
        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 6 }}>
          {cevaplandi} soru cevaplandı
        </div>
      </div>

      {/* Soru kartı */}
      <div style={{
        background: "#FFFFFF", border: "1px solid #A5C8C5", borderRadius: 16,
        padding: 32, marginBottom: 20,
        opacity: animating ? 0 : 1,
        transform: animating ? "translateX(20px)" : "translateX(0)",
        transition: "opacity 0.2s, transform 0.2s",
      }}>
        {/* Soru numarası + başlık */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 28 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "#CCFBF1", color: "#0F766E",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, flexShrink: 0,
          }}>
            {aktifIndex + 1}
          </div>
          <h2 style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 400,
            color: "#0F172A", margin: 0, lineHeight: 1.3, letterSpacing: "-0.3px",
          }}>
            {aktif.soru.soru}
          </h2>
        </div>

        {/* Cevap alanı */}
        {(aktif.soru.tip === "radio" || aktif.soru.tip === "select") && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {aktif.soru.secenekler.map((s) => {
              const secili = mevcutCevap === s;
              return (
                <button
                  key={s}
                  onClick={() => { setCevaplar(p => ({ ...p, [aktif.soru.id]: s })); setTimeout(() => ilerle(s), 300); }}
                  style={{
                    textAlign: "left", padding: "16px 20px", borderRadius: 12, cursor: "pointer",
                    border: `2px solid ${secili ? "#E05C25" : "#E2E8F0"}`,
                    background: secili ? "#FEF3EE" : "#F8FAFC",
                    fontFamily: "inherit", fontSize: 14, fontWeight: secili ? 600 : 400,
                    color: secili ? "#E05C25" : "#334155",
                    transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 12,
                  }}
                >
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    border: `2px solid ${secili ? "#E05C25" : "#CBD5E1"}`,
                    background: secili ? "#E05C25" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {secili && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                  </span>
                  {s}
                </button>
              );
            })}
          </div>
        )}

        {aktif.soru.tip === "checkbox" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {aktif.soru.secenekler.map((s) => {
              const seciliList = (mevcutCevap || "").split("||").filter(Boolean);
              const secili = seciliList.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => {
                    const yeni = secili ? seciliList.filter(x => x !== s) : [...seciliList, s];
                    setCevaplar(p => ({ ...p, [aktif.soru.id]: yeni.join("||") }));
                  }}
                  style={{
                    textAlign: "left", padding: "14px 18px", borderRadius: 12, cursor: "pointer",
                    border: `2px solid ${secili ? "#E05C25" : "#E2E8F0"}`,
                    background: secili ? "#FEF3EE" : "#F8FAFC",
                    fontFamily: "inherit", fontSize: 14, fontWeight: secili ? 600 : 400,
                    color: secili ? "#E05C25" : "#334155", transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 12,
                  }}
                >
                  <span style={{
                    width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                    border: `2px solid ${secili ? "#E05C25" : "#CBD5E1"}`,
                    background: secili ? "#E05C25" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {secili && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
                  </span>
                  {s}
                </button>
              );
            })}
          </div>
        )}

        {(aktif.soru.tip === "text") && (
          <textarea
            value={girdi}
            onChange={e => setGirdi(e.target.value)}
            placeholder="Cevabınızı yazın..."
            rows={3}
            autoFocus
            style={{
              width: "100%", padding: "14px 16px", border: "2px solid #A5C8C5",
              borderRadius: 12, fontSize: 14, color: "#0F172A", background: "#F8FAFC",
              outline: "none", fontFamily: "inherit", resize: "vertical", lineHeight: 1.6,
            }}
          />
        )}

        {aktif.soru.tip === "number" && (
          <input
            type="number"
            value={girdi}
            onChange={e => setGirdi(e.target.value)}
            placeholder="0"
            autoFocus
            style={{
              width: "100%", padding: "14px 16px", border: "2px solid #A5C8C5",
              borderRadius: 12, fontSize: 18, color: "#0F172A", background: "#F8FAFC",
              outline: "none", fontFamily: "var(--font-dm-mono), monospace",
            }}
          />
        )}
      </div>

      {/* Navigasyon */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={geri}
          disabled={aktifIndex === 0}
          style={{
            background: "transparent", color: "#64748B", border: "1px solid #E2E8F0",
            borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: 600,
            cursor: aktifIndex === 0 ? "not-allowed" : "pointer", fontFamily: "inherit",
            opacity: aktifIndex === 0 ? 0.4 : 1,
          }}
        >
          ← Geri
        </button>

        <div style={{ display: "flex", gap: 6 }}>
          {tumSorular.map((_, i) => (
            <div key={i} style={{
              width: i === aktifIndex ? 20 : 6, height: 6, borderRadius: 999,
              background: i < aktifIndex ? "#0D9488" : i === aktifIndex ? "#E05C25" : "#E2E8F0",
              transition: "all 0.3s",
            }} />
          ))}
        </div>

        {sonSoru ? (
          <button
            onClick={gonder}
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
                Rapor hazırlanıyor...
              </>
            ) : "Raporu Oluştur →"}
          </button>
        ) : (
          <button
            onClick={() => ilerle()}
            style={{
              background: "#0F172A", color: "#fff", border: "none", borderRadius: 10,
              padding: "13px 24px", fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Sonraki →
          </button>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        textarea:focus, input:focus { border-color: #0D9488 !important; box-shadow: 0 0 0 3px rgba(13,148,136,0.12); }
      `}</style>
    </div>
  );
}
