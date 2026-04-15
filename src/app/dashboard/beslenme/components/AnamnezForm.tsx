"use client";

import { useState } from "react";

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
  form: {
    kategoriler?: Kategori[];
  };
  yukleniyor: boolean;
  onGonder: (cevaplar: Record<string, string>) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid #A5C8C5",
  borderRadius: 8,
  fontSize: 14,
  color: "#0F172A",
  background: "#F8FAFC",
  outline: "none",
  fontFamily: "inherit",
};

export default function AnamnezForm({ form, yukleniyor, onGonder }: AnamnezFormProps) {
  const [cevaplar, setCevaplar] = useState<Record<string, string>>({});
  const [aktifKategori, setAktifKategori] = useState(0);

  const kategoriler = form.kategoriler || [];
  const toplamSoru = kategoriler.reduce((t, k) => t + k.sorular.length, 0);
  const cevaplanan = Object.keys(cevaplar).filter(k => cevaplar[k]).length;

  function setCevap(id: string, deger: string) {
    setCevaplar(prev => ({ ...prev, [id]: deger }));
  }

  function toggleCheckbox(id: string, secenek: string) {
    const mevcut = cevaplar[id] ? cevaplar[id].split("||") : [];
    const yeni = mevcut.includes(secenek)
      ? mevcut.filter(s => s !== secenek)
      : [...mevcut, secenek];
    setCevaplar(prev => ({ ...prev, [id]: yeni.join("||") }));
  }

  function renderSoru(soru: Soru) {
    switch (soru.tip) {
      case "text":
        return (
          <textarea
            value={cevaplar[soru.id] || ""}
            onChange={(e) => setCevap(soru.id, e.target.value)}
            placeholder="Cevabınızı yazın..."
            rows={2}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
          />
        );
      case "number":
        return (
          <input
            type="number"
            value={cevaplar[soru.id] || ""}
            onChange={(e) => setCevap(soru.id, e.target.value)}
            placeholder="0"
            style={inputStyle}
          />
        );
      case "radio":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {soru.secenekler.map((s) => (
              <label key={s} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input
                  type="radio"
                  name={soru.id}
                  value={s}
                  checked={cevaplar[soru.id] === s}
                  onChange={() => setCevap(soru.id, s)}
                  style={{ accentColor: "#0D9488", width: 16, height: 16 }}
                />
                <span style={{ fontSize: 14, color: "#334155" }}>{s}</span>
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {soru.secenekler.map((s) => {
              const secili = (cevaplar[soru.id] || "").split("||").includes(s);
              return (
                <label key={s} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={secili}
                    onChange={() => toggleCheckbox(soru.id, s)}
                    style={{ accentColor: "#0D9488", width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 14, color: "#334155" }}>{s}</span>
                </label>
              );
            })}
          </div>
        );
      case "select":
        return (
          <select
            value={cevaplar[soru.id] || ""}
            onChange={(e) => setCevap(soru.id, e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="">Seçiniz...</option>
            {soru.secenekler.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        );
      default:
        return null;
    }
  }

  return (
    <div>
      {/* İlerleme */}
      <div style={{ background: "#FFFFFF", border: "1px solid #A5C8C5", borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>Form İlerlemesi</span>
            <span style={{ fontSize: 13, color: "#64748B" }}>{cevaplanan}/{toplamSoru} soru</span>
          </div>
          <div style={{ height: 6, background: "#E2E8F0", borderRadius: 999, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 999,
              background: "linear-gradient(90deg, #0D9488, #5EEAD4)",
              width: `${toplamSoru > 0 ? (cevaplanan / toplamSoru) * 100 : 0}%`,
              transition: "width 0.4s ease",
            }} />
          </div>
        </div>
      </div>

      {/* Kategori sekmeleri */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {kategoriler.map((k, i) => (
          <button
            key={i}
            onClick={() => setAktifKategori(i)}
            style={{
              padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              cursor: "pointer", border: "1px solid",
              background: aktifKategori === i ? "#CCFBF1" : "#F8FAFC",
              borderColor: aktifKategori === i ? "#0D9488" : "#E2E8F0",
              color: aktifKategori === i ? "#0F766E" : "#64748B",
              fontFamily: "inherit",
            }}
          >
            {k.baslik}
          </button>
        ))}
      </div>

      {/* Aktif kategori soruları */}
      {kategoriler[aktifKategori] && (
        <div style={{ background: "#FFFFFF", border: "1px solid #A5C8C5", borderRadius: 14, padding: 28, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 24px" }}>
            {kategoriler[aktifKategori].baslik}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {kategoriler[aktifKategori].sorular.map((soru, si) => (
              <div key={soru.id}>
                <label style={{
                  display: "block", fontSize: 14, fontWeight: 600, color: "#334155",
                  marginBottom: 10, lineHeight: 1.5,
                }}>
                  {si + 1}. {soru.soru}
                  {soru.zorunlu && <span style={{ color: "#EF4444", marginLeft: 4 }}>*</span>}
                </label>
                {renderSoru(soru)}
              </div>
            ))}
          </div>

          {/* Kategori navigasyon */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, paddingTop: 20, borderTop: "1px solid #F1F5F9" }}>
            <button
              onClick={() => setAktifKategori(Math.max(0, aktifKategori - 1))}
              disabled={aktifKategori === 0}
              style={{
                background: "transparent", color: "#0D9488", border: "1px solid #0D9488",
                borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600,
                cursor: aktifKategori === 0 ? "not-allowed" : "pointer", fontFamily: "inherit",
                opacity: aktifKategori === 0 ? 0.4 : 1,
              }}
            >
              ← Önceki
            </button>
            {aktifKategori < kategoriler.length - 1 ? (
              <button
                onClick={() => setAktifKategori(aktifKategori + 1)}
                style={{
                  background: "#0D9488", color: "#fff", border: "none",
                  borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Sonraki →
              </button>
            ) : (
              <button
                onClick={() => onGonder(cevaplar)}
                disabled={yukleniyor}
                style={{
                  background: "#0D9488", color: "#fff", border: "none",
                  borderRadius: 10, padding: "13px 28px", fontSize: 14, fontWeight: 600,
                  cursor: yukleniyor ? "not-allowed" : "pointer", fontFamily: "inherit",
                  opacity: yukleniyor ? 0.6 : 1, display: "flex", alignItems: "center", gap: 8,
                }}
              >
                {yukleniyor ? (
                  <>
                    <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    Rapor hazırlanıyor...
                  </>
                ) : (
                  "Raporu Oluştur →"
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
