"use client";

import { useState } from "react";
import AnalizSonucu from "./components/AnalizSonucu";
import AnamnezForm from "./components/AnamnezForm";
import FinalRapor from "./components/FinalRapor";

// ── Types ────────────────────────────────────────────────────────────────────

type GirisTipi = "tanita" | "manuel" | null;
type Hedef = "yag_yakimi" | "kas_kazanimi" | "enerji_performans" | "genel_saglik" | null;
type Adim = 1 | 2 | 3 | 4;

interface TanitaOlcum {
  vucutYagOrani: string;
  kasMiktarKg: string;
  kemikKitlesiKg: string;
  vucutSuOrani: string;
  viseralYagSkoru: string;
  bmi: string;
  bmr: string;
}

interface ManuelOlcum {
  boy: string;
  kilo: string;
  yas: string;
  cinsiyet: "erkek" | "kadin" | "";
  belCevresi: string;
  kalkaCevresi: string;
  gogusСevresi: string;
  aktiviteSeviyesi: string;
}

// ── Sabit veriler ─────────────────────────────────────────────────────────────

const AKTIVITE_SEVIYELERI = [
  { value: "sedanter", label: "Sedanter — Masa başı iş, egzersiz yok" },
  { value: "hafif_aktif", label: "Hafif aktif — Haftada 1-3 gün hafif egzersiz" },
  { value: "orta_aktif", label: "Orta aktif — Haftada 3-5 gün orta egzersiz" },
  { value: "cok_aktif", label: "Çok aktif — Haftada 6-7 gün yoğun egzersiz" },
  { value: "asiri_aktif", label: "Aşırı aktif — Günde iki antrenman veya fiziksel iş" },
];

const HEDEFLER = [
  { value: "yag_yakimi", label: "Yağ Yakımı", emoji: "🔥", desc: "Vücut yağ oranını düşür, kas koru" },
  { value: "kas_kazanimi", label: "Kas Kazanımı", emoji: "💪", desc: "Kas kitlesi artır, güçlen" },
  { value: "enerji_performans", label: "Enerji & Performans", emoji: "⚡", desc: "Günlük enerjiyi ve atletik performansı artır" },
  { value: "genel_saglik", label: "Genel Sağlık & Uzun Ömür", emoji: "🌱", desc: "Sağlıklı yaş, biyobelirteçleri optimize et" },
];

// ── Stil sabitleri ────────────────────────────────────────────────────────────

const S = {
  page: {
    minHeight: "100vh",
    background: "#F4FAFA",
  } as React.CSSProperties,
  nav: {
    background: "rgba(244,250,250,0.92)",
    backdropFilter: "blur(16px)",
    borderBottom: "1px solid #A5C8C5",
    padding: "0 32px",
    position: "sticky" as const,
    top: 0,
    zIndex: 50,
  },
  navInner: {
    maxWidth: 1160,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 64,
  },
  container: {
    maxWidth: 760,
    margin: "0 auto",
    padding: "48px 24px 80px",
  },
  card: {
    background: "#FFFFFF",
    border: "1px solid #A5C8C5",
    borderRadius: 16,
    padding: 32,
    marginBottom: 24,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#334155",
    marginBottom: 6,
    letterSpacing: "0.02em",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #A5C8C5",
    borderRadius: 8,
    fontSize: 14,
    color: "#0F172A",
    background: "#F8FAFC",
    outline: "none",
  } as React.CSSProperties,
  btn: {
    background: "#0D9488",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "13px 28px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background 0.2s",
  } as React.CSSProperties,
  btnOutline: {
    background: "transparent",
    color: "#0D9488",
    border: "1px solid #0D9488",
    borderRadius: 10,
    padding: "12px 24px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  } as React.CSSProperties,
};

// ── Adım göstergesi ───────────────────────────────────────────────────────────

function AdimGostergesi({ aktif }: { aktif: Adim }) {
  const adimlar = [
    { no: 1, label: "Ölçümler" },
    { no: 2, label: "Analiz" },
    { no: 3, label: "Anamnez" },
    { no: 4, label: "Rapor" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 40 }}>
      {adimlar.map((a, i) => (
        <div key={a.no} style={{ display: "flex", alignItems: "center", flex: i < adimlar.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: a.no < aktif ? "#0D9488" : a.no === aktif ? "#0D9488" : "#E2E8F0",
              color: a.no <= aktif ? "#fff" : "#94A3B8",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700,
              border: a.no === aktif ? "3px solid #99F6E4" : "none",
              transition: "all 0.3s",
            }}>
              {a.no < aktif ? "✓" : a.no}
            </div>
            <span style={{ fontSize: 11, color: a.no <= aktif ? "#0D9488" : "#94A3B8", fontWeight: 500, whiteSpace: "nowrap" }}>
              {a.label}
            </span>
          </div>
          {i < adimlar.length - 1 && (
            <div style={{
              flex: 1, height: 2, margin: "0 8px",
              background: a.no < aktif ? "#0D9488" : "#E2E8F0",
              marginBottom: 22,
              transition: "background 0.3s",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Ana bileşen ────────────────────────────────────────────────────────────────

export default function BeslenmePage() {
  const [adim, setAdim] = useState<Adim>(1);
  const [girisTipi, setGirisTipi] = useState<GirisTipi>(null);
  const [hedef, setHedef] = useState<Hedef>(null);
  const [tanitaOlcum, setTanitaOlcum] = useState<TanitaOlcum>({
    vucutYagOrani: "", kasMiktarKg: "", kemikKitlesiKg: "",
    vucutSuOrani: "", viseralYagSkoru: "", bmi: "", bmr: "",
  });
  const [manuelOlcum, setManuelOlcum] = useState<ManuelOlcum>({
    boy: "", kilo: "", yas: "", cinsiyet: "", belCevresi: "",
    kalkaCevresi: "", gogusСevresi: "", aktiviteSeviyesi: "",
  });
  const [yukleniyor, setYukleniyor] = useState(false);
  const [analizSonucu, setAnalizSonucu] = useState<Record<string, unknown> | null>(null);
  const [anamnezFormu, setAnamnezFormu] = useState<Record<string, unknown> | null>(null);
  const [finalRapor, setFinalRapor] = useState<Record<string, unknown> | null>(null);

  async function analizYap() {
    if (!hedef) return;
    setYukleniyor(true);
    try {
      const olcumler = girisTipi === "tanita" ? { tip: "tanita", ...tanitaOlcum } : { tip: "manuel", ...manuelOlcum };
      const res = await fetch("/api/beslenme/analiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ olcumler, hedef }),
      });
      const data = await res.json();
      setAnalizSonucu(data);
      setAdim(2);
    } catch (e) {
      console.error(e);
    } finally {
      setYukleniyor(false);
    }
  }

  async function anamnezOlustur() {
    setYukleniyor(true);
    try {
      const res = await fetch("/api/beslenme/anamnez", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analizSonucu, hedef }),
      });
      const data = await res.json();
      setAnamnezFormu(data);
      setAdim(3);
    } catch (e) {
      console.error(e);
    } finally {
      setYukleniyor(false);
    }
  }

  async function finalDegerlendirme(cevaplar: Record<string, string>) {
    setYukleniyor(true);
    try {
      const olcumler = girisTipi === "tanita" ? { tip: "tanita", ...tanitaOlcum } : { tip: "manuel", ...manuelOlcum };
      const res = await fetch("/api/beslenme/degerlendirme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ olcumler, analizSonucu, anamnezCevaplari: cevaplar, hedef }),
      });
      const data = await res.json();
      setFinalRapor(data);
      setAdim(4);
    } catch (e) {
      console.error(e);
    } finally {
      setYukleniyor(false);
    }
  }

  const canProceed = hedef && girisTipi && (
    girisTipi === "tanita"
      ? tanitaOlcum.vucutYagOrani && tanitaOlcum.kasMiktarKg && tanitaOlcum.bmi && tanitaOlcum.bmr
      : manuelOlcum.boy && manuelOlcum.kilo && manuelOlcum.yas && manuelOlcum.cinsiyet && manuelOlcum.aktiviteSeviyesi
  );

  return (
    <div style={S.page}>
      {/* Navbar */}
      <nav style={S.nav}>
        <div style={S.navInner}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href="/dashboard" style={{ color: "#94A3B8", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              ← Dashboard
            </a>
            <span style={{ color: "#A5C8C5" }}>|</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>Beslenme Modülü</span>
          </div>
          <a href="/dashboard/beslenme/takip" style={{
            background: "#CCFBF1", color: "#0F766E",
            fontSize: 13, fontWeight: 600, padding: "7px 14px",
            borderRadius: 8, textDecoration: "none",
          }}>
            Diyet Takibi →
          </a>
        </div>
      </nav>

      <div style={S.container}>
        {/* Başlık */}
        <div style={{ marginBottom: 40 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#CCFBF1", color: "#0F766E",
            fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
            textTransform: "uppercase", padding: "5px 12px",
            borderRadius: 999, marginBottom: 16,
          }}>
            Beslenme Analizi
          </span>
          <h1 style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontWeight: 400, fontSize: "clamp(28px,4vw,40px)",
            letterSpacing: "-0.5px", color: "#0F172A",
            margin: "0 0 10px", lineHeight: 1.1,
          }}>
            Kişisel Beslenme Planın
          </h1>
          <p style={{ fontSize: 15, color: "#475569", margin: 0 }}>
            Ölçümlerini gir, yapay zeka sana özel plan oluştursun.
          </p>
        </div>

        <AdimGostergesi aktif={adim} />

        {/* ADIM 1 */}
        {adim === 1 && (
          <div>
            {/* Hedef Seçimi */}
            <div style={S.card}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16, margin: "0 0 16px" }}>
                Hedefin nedir?
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {HEDEFLER.map((h) => (
                  <button
                    key={h.value}
                    onClick={() => setHedef(h.value as Hedef)}
                    style={{
                      background: hedef === h.value ? "#CCFBF1" : "#F8FAFC",
                      border: `2px solid ${hedef === h.value ? "#0D9488" : "#E2E8F0"}`,
                      borderRadius: 12, padding: "16px 14px",
                      cursor: "pointer", textAlign: "left",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{h.emoji}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{h.label}</div>
                    <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.4 }}>{h.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Giriş Tipi Seçimi */}
            <div style={S.card}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 16px" }}>
                Ölçüm yöntemi
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: girisTipi ? 24 : 0 }}>
                {[
                  { value: "tanita", label: "Tanita Ölçümü", desc: "Vücut analiz cihazı ile ölçüm", icon: "📊" },
                  { value: "manuel", label: "Manuel Giriş", desc: "Boy, kilo ve vücut ölçüleri", icon: "✏️" },
                ].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setGirisTipi(t.value as GirisTipi)}
                    style={{
                      background: girisTipi === t.value ? "#CCFBF1" : "#F8FAFC",
                      border: `2px solid ${girisTipi === t.value ? "#0D9488" : "#E2E8F0"}`,
                      borderRadius: 12, padding: "20px 16px",
                      cursor: "pointer", textAlign: "left",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 8 }}>{t.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{t.label}</div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>{t.desc}</div>
                  </button>
                ))}
              </div>

              {/* Tanita Formu */}
              {girisTipi === "tanita" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[
                    { key: "vucutYagOrani", label: "Vücut Yağ Oranı (%)" },
                    { key: "kasMiktarKg", label: "Kas Kitlesi (kg)" },
                    { key: "kemikKitlesiKg", label: "Kemik Kitlesi (kg)" },
                    { key: "vucutSuOrani", label: "Vücut Su Oranı (%)" },
                    { key: "viseralYagSkoru", label: "Viseral Yağ Skoru" },
                    { key: "bmi", label: "BMI" },
                    { key: "bmr", label: "Bazal Metabolizma (kcal)" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label style={S.label}>{f.label}</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        value={tanitaOlcum[f.key as keyof TanitaOlcum]}
                        onChange={(e) => setTanitaOlcum(prev => ({ ...prev, [f.key]: e.target.value }))}
                        style={S.input}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Manuel Form */}
              {girisTipi === "manuel" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <label style={S.label}>Boy (cm) *</label>
                      <input type="number" placeholder="175" value={manuelOlcum.boy}
                        onChange={(e) => setManuelOlcum(p => ({ ...p, boy: e.target.value }))} style={S.input} />
                    </div>
                    <div>
                      <label style={S.label}>Kilo (kg) *</label>
                      <input type="number" placeholder="75" value={manuelOlcum.kilo}
                        onChange={(e) => setManuelOlcum(p => ({ ...p, kilo: e.target.value }))} style={S.input} />
                    </div>
                    <div>
                      <label style={S.label}>Yaş *</label>
                      <input type="number" placeholder="30" value={manuelOlcum.yas}
                        onChange={(e) => setManuelOlcum(p => ({ ...p, yas: e.target.value }))} style={S.input} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={S.label}>Cinsiyet *</label>
                    <div style={{ display: "flex", gap: 12 }}>
                      {[{ v: "erkek", l: "Erkek" }, { v: "kadin", l: "Kadın" }].map(c => (
                        <button key={c.v} onClick={() => setManuelOlcum(p => ({ ...p, cinsiyet: c.v as "erkek" | "kadin" }))}
                          style={{
                            flex: 1, padding: "10px", borderRadius: 8, cursor: "pointer",
                            background: manuelOlcum.cinsiyet === c.v ? "#CCFBF1" : "#F8FAFC",
                            border: `2px solid ${manuelOlcum.cinsiyet === c.v ? "#0D9488" : "#E2E8F0"}`,
                            fontSize: 14, fontWeight: 600, color: "#0F172A",
                          }}>
                          {c.l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                    {[
                      { key: "belCevresi", label: "Bel Çevresi (cm)" },
                      { key: "kalkaCevresi", label: "Kalça Çevresi (cm)" },
                      { key: "gogusСevresi", label: "Göğüs Çevresi (cm)" },
                    ].map(f => (
                      <div key={f.key}>
                        <label style={S.label}>{f.label} <span style={{ color: "#94A3B8", fontWeight: 400 }}>(opsiyonel)</span></label>
                        <input type="number" placeholder="—" value={manuelOlcum[f.key as keyof ManuelOlcum]}
                          onChange={(e) => setManuelOlcum(p => ({ ...p, [f.key]: e.target.value }))} style={S.input} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label style={S.label}>Aktivite Seviyesi *</label>
                    <select value={manuelOlcum.aktiviteSeviyesi}
                      onChange={(e) => setManuelOlcum(p => ({ ...p, aktiviteSeviyesi: e.target.value }))}
                      style={{ ...S.input, cursor: "pointer" }}>
                      <option value="">Seçiniz...</option>
                      {AKTIVITE_SEVIYELERI.map(a => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Analiz Butonu */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={analizYap}
                disabled={!canProceed || yukleniyor}
                style={{
                  ...S.btn,
                  opacity: canProceed && !yukleniyor ? 1 : 0.4,
                  cursor: canProceed && !yukleniyor ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", gap: 8, fontSize: 15,
                }}
              >
                {yukleniyor ? (
                  <>
                    <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    Analiz yapılıyor...
                  </>
                ) : (
                  "Analiz Yap →"
                )}
              </button>
            </div>
          </div>
        )}

        {/* ADIM 2 */}
        {adim === 2 && analizSonucu && (
          <AnalizSonucu
            sonuc={analizSonucu}
            yukleniyor={yukleniyor}
            onDevam={anamnezOlustur}
          />
        )}

        {/* ADIM 3 */}
        {adim === 3 && anamnezFormu && (
          <AnamnezForm
            form={anamnezFormu}
            yukleniyor={yukleniyor}
            onGonder={finalDegerlendirme}
          />
        )}

        {/* ADIM 4 */}
        {adim === 4 && finalRapor && (
          <FinalRapor rapor={finalRapor} />
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input:focus, select:focus {
          border-color: #0D9488 !important;
          box-shadow: 0 0 0 3px rgba(13,148,136,0.15);
        }
      `}</style>
    </div>
  );
}
