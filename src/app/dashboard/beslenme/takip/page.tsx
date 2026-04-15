"use client";

import { useState, useEffect } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type OgunTipi = "kahvalti" | "ogle" | "aksam" | "ara_ogun";

interface Yiyecek {
  id: string;
  ad: string;
  porsiyon: number;
  birim: string;
  kalori: number;
  protein: number;
  karb: number;
  yag: number;
}

interface Ogun {
  tip: OgunTipi;
  yiyecekler: Yiyecek[];
}

interface GunVerisi {
  tarih: string;
  ogunler: Ogun[];
}

// ── Sabit veriler ─────────────────────────────────────────────────────────────

const OGUN_ETIKET: Record<OgunTipi, { label: string; emoji: string; renk: string }> = {
  kahvalti: { label: "Kahvaltı", emoji: "🌅", renk: "#FEF3C7" },
  ogle: { label: "Öğle Yemeği", emoji: "☀️", renk: "#E0F2FE" },
  aksam: { label: "Akşam Yemeği", emoji: "🌙", renk: "#EDE9FE" },
  ara_ogun: { label: "Ara Öğün", emoji: "🍎", renk: "#DCFCE7" },
};

const OGUN_SIRASI: OgunTipi[] = ["kahvalti", "ogle", "aksam", "ara_ogun"];

// Hedef değerler (localStorage'dan veya default)
const DEFAULT_HEDEF = { kalori: 2000, protein: 150, karb: 200, yag: 67 };

// ── Yardımcı ──────────────────────────────────────────────────────────────────

function bugunStr() {
  return new Date().toISOString().split("T")[0];
}

function ogunToplam(ogun: Ogun) {
  return ogun.yiyecekler.reduce(
    (acc, y) => ({ kalori: acc.kalori + y.kalori, protein: acc.protein + y.protein, karb: acc.karb + y.karb, yag: acc.yag + y.yag }),
    { kalori: 0, protein: 0, karb: 0, yag: 0 }
  );
}

function gunToplam(ogunler: Ogun[]) {
  return ogunler.reduce(
    (acc, o) => { const t = ogunToplam(o); return { kalori: acc.kalori + t.kalori, protein: acc.protein + t.protein, karb: acc.karb + t.karb, yag: acc.yag + t.yag }; },
    { kalori: 0, protein: 0, karb: 0, yag: 0 }
  );
}

function uid() {
  return Math.random().toString(36).slice(2);
}

// ── İlerleme çubuğu ───────────────────────────────────────────────────────────

function ProgressBar({ mevcut, hedef, label, renk }: { mevcut: number; hedef: number; label: string; renk: string }) {
  const yuzde = Math.min(100, Math.round((mevcut / hedef) * 100));
  const asim = mevcut > hedef;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>{label}</span>
        <span style={{ fontSize: 12, fontFamily: "var(--font-dm-mono), monospace", color: asim ? "#DC2626" : "#64748B" }}>
          {Math.round(mevcut)} / {hedef}
        </span>
      </div>
      <div style={{ height: 8, background: "#E2E8F0", borderRadius: 999, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 999, transition: "width 0.4s ease",
          width: `${yuzde}%`,
          background: asim ? "#EF4444" : yuzde > 80 ? renk : yuzde > 50 ? renk : renk,
          opacity: asim ? 1 : yuzde > 80 ? 1 : 0.7,
        }} />
      </div>
      <div style={{ fontSize: 10, color: asim ? "#DC2626" : yuzde >= 90 ? "#059669" : "#94A3B8", marginTop: 3, textAlign: "right" }}>
        {asim ? `${Math.round(mevcut - hedef)} fazla` : `%${yuzde}`}
      </div>
    </div>
  );
}

// ── Ana bileşen ────────────────────────────────────────────────────────────────

export default function TakipPage() {
  const [seciliTarih, setSeciliTarih] = useState(bugunStr());
  const [gunVerileri, setGunVerileri] = useState<Record<string, GunVerisi>>({});
  const [hedef] = useState(DEFAULT_HEDEF);
  const [yiyecekEklemeModal, setYiyecekEklemeModal] = useState<{ ogunTip: OgunTipi } | null>(null);
  const [yeniYiyecek, setYeniYiyecek] = useState({ ad: "", porsiyon: "1", birim: "porsiyon", kalori: "", protein: "", karb: "", yag: "" });

  // localStorage'dan yükle
  useEffect(() => {
    const kaydedilen = localStorage.getItem("bioos_takip");
    if (kaydedilen) {
      try { setGunVerileri(JSON.parse(kaydedilen)); } catch { /* ignore */ }
    }
  }, []);

  function kaydet(yeniVeri: Record<string, GunVerisi>) {
    setGunVerileri(yeniVeri);
    localStorage.setItem("bioos_takip", JSON.stringify(yeniVeri));
  }

  function gunVerisi(): GunVerisi {
    return gunVerileri[seciliTarih] || { tarih: seciliTarih, ogunler: OGUN_SIRASI.map(tip => ({ tip, yiyecekler: [] })) };
  }

  function yiyecekEkle() {
    if (!yiyecekEklemeModal || !yeniYiyecek.ad) return;
    const veri = gunVerisi();
    const ogunIdx = veri.ogunler.findIndex(o => o.tip === yiyecekEklemeModal.ogunTip);
    const yiyecek: Yiyecek = {
      id: uid(),
      ad: yeniYiyecek.ad,
      porsiyon: parseFloat(yeniYiyecek.porsiyon) || 1,
      birim: yeniYiyecek.birim,
      kalori: parseFloat(yeniYiyecek.kalori) || 0,
      protein: parseFloat(yeniYiyecek.protein) || 0,
      karb: parseFloat(yeniYiyecek.karb) || 0,
      yag: parseFloat(yeniYiyecek.yag) || 0,
    };
    const yeniOgunler = [...veri.ogunler];
    if (ogunIdx >= 0) {
      yeniOgunler[ogunIdx] = { ...yeniOgunler[ogunIdx], yiyecekler: [...yeniOgunler[ogunIdx].yiyecekler, yiyecek] };
    } else {
      yeniOgunler.push({ tip: yiyecekEklemeModal.ogunTip, yiyecekler: [yiyecek] });
    }
    kaydet({ ...gunVerileri, [seciliTarih]: { ...veri, ogunler: yeniOgunler } });
    setYiyecekEklemeModal(null);
    setYeniYiyecek({ ad: "", porsiyon: "1", birim: "porsiyon", kalori: "", protein: "", karb: "", yag: "" });
  }

  function yiyecekSil(ogunTip: OgunTipi, yiyecekId: string) {
    const veri = gunVerisi();
    const yeniOgunler = veri.ogunler.map(o =>
      o.tip === ogunTip ? { ...o, yiyecekler: o.yiyecekler.filter(y => y.id !== yiyecekId) } : o
    );
    kaydet({ ...gunVerileri, [seciliTarih]: { ...veri, ogunler: yeniOgunler } });
  }

  const veri = gunVerisi();
  const toplam = gunToplam(veri.ogunler);

  // Son 7 günü hesapla
  const haftalikVeri = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const tarih = d.toISOString().split("T")[0];
    const g = gunVerileri[tarih];
    const kal = g ? gunToplam(g.ogunler).kalori : 0;
    return { tarih, kal, label: d.toLocaleDateString("tr-TR", { weekday: "short" }) };
  });
  const maxKal = Math.max(...haftalikVeri.map(d => d.kal), hedef.kalori);

  const inputS: React.CSSProperties = {
    width: "100%", padding: "9px 12px", border: "1px solid #A5C8C5",
    borderRadius: 8, fontSize: 13, color: "#0F172A", background: "#F8FAFC",
    outline: "none", fontFamily: "inherit",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F4FAFA" }}>
      {/* Navbar */}
      <nav style={{ background: "rgba(244,250,250,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid #A5C8C5", padding: "0 32px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href="/dashboard/beslenme" style={{ color: "#94A3B8", fontSize: 13, textDecoration: "none" }}>← Beslenme</a>
            <span style={{ color: "#A5C8C5" }}>|</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>Diyet Takibi</span>
          </div>
          <input
            type="date"
            value={seciliTarih}
            onChange={(e) => setSeciliTarih(e.target.value)}
            max={bugunStr()}
            style={{ ...inputS, width: "auto", fontSize: 14, cursor: "pointer" }}
          />
        </div>
      </nav>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>

          {/* Sol: Öğünler */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 400, fontSize: 28, letterSpacing: "-0.5px", color: "#0F172A", margin: "0 0 4px" }}>
                  {seciliTarih === bugunStr() ? "Bugün" : new Date(seciliTarih + "T12:00:00").toLocaleDateString("tr-TR", { day: "numeric", month: "long" })}
                </h1>
                <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
                  {Math.round(toplam.kalori)} / {hedef.kalori} kcal
                </p>
              </div>
            </div>

            {OGUN_SIRASI.map((tip) => {
              const ogun = veri.ogunler.find(o => o.tip === tip) || { tip, yiyecekler: [] };
              const ogunT = ogunToplam(ogun);
              const meta = OGUN_ETIKET[tip];
              return (
                <div key={tip} style={{ background: "#FFFFFF", border: "1px solid #A5C8C5", borderRadius: 14, marginBottom: 16, overflow: "hidden" }}>
                  {/* Öğün başlık */}
                  <div style={{ padding: "14px 20px", background: meta.renk, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{meta.emoji}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{meta.label}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {ogunT.kalori > 0 && (
                        <span style={{ fontSize: 12, fontFamily: "var(--font-dm-mono), monospace", color: "#64748B" }}>
                          {Math.round(ogunT.kalori)} kcal
                        </span>
                      )}
                      <button
                        onClick={() => setYiyecekEklemeModal({ ogunTip: tip })}
                        style={{ background: "#0D9488", color: "#fff", border: "none", borderRadius: 7, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                      >
                        + Ekle
                      </button>
                    </div>
                  </div>

                  {/* Yiyecekler */}
                  <div style={{ padding: ogun.yiyecekler.length > 0 ? "4px 0" : "16px 20px" }}>
                    {ogun.yiyecekler.length === 0 ? (
                      <p style={{ fontSize: 13, color: "#94A3B8", margin: 0, textAlign: "center" }}>Henüz eklenmedi</p>
                    ) : (
                      ogun.yiyecekler.map((y) => (
                        <div key={y.id} style={{ padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F8FAFC" }}>
                          <div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{y.ad}</span>
                            <span style={{ fontSize: 12, color: "#94A3B8", marginLeft: 8 }}>{y.porsiyon} {y.birim}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div style={{ display: "flex", gap: 12 }}>
                              <MacroChip label="kal" value={Math.round(y.kalori)} renk="#0F172A" />
                              <MacroChip label="P" value={Math.round(y.protein)} renk="#3B82F6" />
                              <MacroChip label="K" value={Math.round(y.karb)} renk="#F59E0B" />
                              <MacroChip label="Y" value={Math.round(y.yag)} renk="#EC4899" />
                            </div>
                            <button onClick={() => yiyecekSil(tip, y.id)} style={{ background: "none", border: "none", color: "#FCA5A5", cursor: "pointer", fontSize: 16, padding: "2px 4px" }}>✕</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sağ: Özet panel */}
          <div style={{ position: "sticky", top: 80 }}>
            {/* Günlük özet */}
            <div style={{ background: "#FFFFFF", border: "1px solid #A5C8C5", borderRadius: 14, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Günlük Özet</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <ProgressBar mevcut={toplam.kalori} hedef={hedef.kalori} label="Kalori" renk="#0D9488" />
                <ProgressBar mevcut={toplam.protein} hedef={hedef.protein} label="Protein (g)" renk="#3B82F6" />
                <ProgressBar mevcut={toplam.karb} hedef={hedef.karb} label="Karbonhidrat (g)" renk="#F59E0B" />
                <ProgressBar mevcut={toplam.yag} hedef={hedef.yag} label="Yağ (g)" renk="#EC4899" />
              </div>

              {/* Kalan kalori */}
              <div style={{ marginTop: 20, padding: "14px", background: toplam.kalori > hedef.kalori ? "#FEF2F2" : "#F0FDF4", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: toplam.kalori > hedef.kalori ? "#991B1B" : "#166534", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
                  {toplam.kalori > hedef.kalori ? "Aşım" : "Kalan Kalori"}
                </div>
                <div style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 28, fontWeight: 500, color: toplam.kalori > hedef.kalori ? "#DC2626" : "#059669" }}>
                  {Math.abs(Math.round(hedef.kalori - toplam.kalori))}
                  <span style={{ fontSize: 14, color: "#94A3B8" }}> kcal</span>
                </div>
              </div>
            </div>

            {/* Haftalık grafik */}
            <div style={{ background: "#FFFFFF", border: "1px solid #A5C8C5", borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Son 7 Gün</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
                {haftalikVeri.map((g) => {
                  const yukseklik = maxKal > 0 ? Math.max(4, (g.kal / maxKal) * 72) : 4;
                  const asim = g.kal > hedef.kalori;
                  const bugun = g.tarih === seciliTarih;
                  return (
                    <div key={g.tarih} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
                      onClick={() => setSeciliTarih(g.tarih)} title={`${g.kal} kcal`}>
                      <div style={{ fontSize: 9, color: "#94A3B8", fontFamily: "var(--font-dm-mono), monospace" }}>{g.kal > 0 ? Math.round(g.kal) : ""}</div>
                      <div style={{
                        width: "100%", borderRadius: 4,
                        height: yukseklik,
                        background: asim ? "#FCA5A5" : bugun ? "#0D9488" : "#A5C8C5",
                        cursor: "pointer", transition: "all 0.2s",
                        border: bugun ? "2px solid #0F766E" : "none",
                      }} />
                      <div style={{ fontSize: 10, color: bugun ? "#0D9488" : "#94A3B8", fontWeight: bugun ? 700 : 400 }}>{g.label}</div>
                    </div>
                  );
                })}
              </div>
              {/* Hedef çizgisi işareti */}
              <div style={{ marginTop: 10, fontSize: 11, color: "#94A3B8", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-block", width: 16, height: 2, background: "#0D9488", borderRadius: 1 }} />
                Hedef: {hedef.kalori} kcal
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yiyecek ekleme modal */}
      {yiyecekEklemeModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={(e) => { if (e.target === e.currentTarget) setYiyecekEklemeModal(null); }}>
          <div style={{ background: "#FFFFFF", borderRadius: 16, padding: 28, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                {OGUN_ETIKET[yiyecekEklemeModal.ogunTip].emoji} {OGUN_ETIKET[yiyecekEklemeModal.ogunTip].label} — Yiyecek Ekle
              </h3>
              <button onClick={() => setYiyecekEklemeModal(null)} style={{ background: "none", border: "none", fontSize: 20, color: "#94A3B8", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 5 }}>Yiyecek Adı *</label>
                <input value={yeniYiyecek.ad} onChange={(e) => setYeniYiyecek(p => ({ ...p, ad: e.target.value }))} placeholder="örn: Yulaf ezmesi" style={inputS} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 5 }}>Porsiyon</label>
                  <input type="number" value={yeniYiyecek.porsiyon} onChange={(e) => setYeniYiyecek(p => ({ ...p, porsiyon: e.target.value }))} style={inputS} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 5 }}>Birim</label>
                  <select value={yeniYiyecek.birim} onChange={(e) => setYeniYiyecek(p => ({ ...p, birim: e.target.value }))} style={{ ...inputS, cursor: "pointer" }}>
                    {["porsiyon", "gram", "ml", "adet", "dilim", "kase", "bardak", "yemek kaşığı"].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 5 }}>Kalori (kcal)</label>
                <input type="number" value={yeniYiyecek.kalori} onChange={(e) => setYeniYiyecek(p => ({ ...p, kalori: e.target.value }))} placeholder="0" style={inputS} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[
                  { key: "protein", label: "Protein (g)" },
                  { key: "karb", label: "Karbonhidrat (g)" },
                  { key: "yag", label: "Yağ (g)" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 5 }}>{f.label}</label>
                    <input type="number" value={yeniYiyecek[f.key as keyof typeof yeniYiyecek]}
                      onChange={(e) => setYeniYiyecek(p => ({ ...p, [f.key]: e.target.value }))} placeholder="0" style={inputS} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button onClick={() => setYiyecekEklemeModal(null)} style={{ flex: 1, background: "#F8FAFC", color: "#64748B", border: "1px solid #E2E8F0", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                İptal
              </button>
              <button onClick={yiyecekEkle} disabled={!yeniYiyecek.ad} style={{ flex: 2, background: "#0D9488", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 600, cursor: yeniYiyecek.ad ? "pointer" : "not-allowed", fontFamily: "inherit", opacity: yeniYiyecek.ad ? 1 : 0.5 }}>
                Öğüne Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        input[type=date]::-webkit-calendar-picker-indicator { cursor: pointer; }
        input:focus, select:focus { border-color: #0D9488 !important; box-shadow: 0 0 0 3px rgba(13,148,136,0.15); }
        @media (max-width: 768px) {
          .takip-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function MacroChip({ label, value, renk }: { label: string; value: number; renk: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 9, color: "#94A3B8", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 12, fontWeight: 500, color: renk }}>{value}</div>
    </div>
  );
}
