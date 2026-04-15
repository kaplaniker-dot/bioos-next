"use client";

import { useState, useEffect } from "react";

// ── Sabit anamnez soruları (klinik standart) ──────────────────────────────────

const SORULAR = [
  {
    id: "ogun_sayisi",
    kategori: "Beslenme Düzeni",
    soru: "Günde kaç öğün yiyorsun?",
    tip: "radio" as const,
    secenekler: ["1-2 öğün", "3 öğün", "4-5 öğün", "Düzensiz yiyorum"],
  },
  {
    id: "kahvalti",
    kategori: "Beslenme Düzeni",
    soru: "Kahvaltı alışkanlığın nasıl?",
    tip: "radio" as const,
    secenekler: ["Her gün yaparım", "Bazen yaparım", "Nadiren yaparım", "Hiç yapmam"],
  },
  {
    id: "gece_yeme",
    kategori: "Beslenme Düzeni",
    soru: "Gece geç saatlerde yemek yeme alışkanlığın var mı?",
    tip: "radio" as const,
    secenekler: ["Hayır", "Bazen (haftada 1-2)", "Sık sık (haftada 3+)", "Neredeyse her gece"],
  },
  {
    id: "disarida_yeme",
    kategori: "Beslenme Düzeni",
    soru: "Dışarıda / hazır yemek yeme sıklığın nedir?",
    tip: "radio" as const,
    secenekler: ["Neredeyse hiç", "Haftada 1-2 kez", "Haftada 3-4 kez", "Neredeyse her gün"],
  },
  {
    id: "et_tuketimi",
    kategori: "Besin Tercihleri",
    soru: "Et ve hayvansal ürün tüketiminiz nasıl?",
    tip: "radio" as const,
    secenekler: ["Her gün et/tavuk/balık yerim", "Haftada 2-3 kez yerim", "Nadiren yerim", "Vejeteryan/Veganism"],
  },
  {
    id: "sebze_meyve",
    kategori: "Besin Tercihleri",
    soru: "Günlük sebze ve meyve tüketiminiz?",
    tip: "radio" as const,
    secenekler: ["Her öğünde sebze/meyve yerim", "Günde 1-2 porsiyon", "Haftada birkaç kez", "Çok az tüketirim"],
  },
  {
    id: "sut_urunleri",
    kategori: "Besin Tercihleri",
    soru: "Süt ürünleri tüketiminiz (süt, yoğurt, peynir)?",
    tip: "radio" as const,
    secenekler: ["Her gün tüketirim", "Haftada 2-3 kez", "Nadiren", "Hiç tüketmem / intoleransım var"],
  },
  {
    id: "su_tuketimi",
    kategori: "İçecek & Hidrasyon",
    soru: "Günlük su tüketiminiz ne kadar?",
    tip: "radio" as const,
    secenekler: ["1 litreden az", "1-2 litre", "2-3 litre", "3 litreden fazla"],
  },
  {
    id: "cay_kahve",
    kategori: "İçecek & Hidrasyon",
    soru: "Günlük çay ve kahve tüketiminiz?",
    tip: "radio" as const,
    secenekler: ["İçmem", "1-2 bardak/fincan", "3-5 bardak/fincan", "5'ten fazla"],
  },
  {
    id: "sindirim",
    kategori: "Sağlık & Sindirim",
    soru: "Sindirim sistemi şikayetiniz var mı?",
    tip: "radio" as const,
    secenekler: ["Hayır, sorun yok", "Ara sıra şişkinlik/gaz", "Sık sık mide sorunları", "Kronik sindirim problemi"],
  },
  {
    id: "alerji",
    kategori: "Sağlık & Sindirim",
    soru: "Besin alerjisi veya intoleransınız var mı?",
    tip: "radio" as const,
    secenekler: ["Hayır", "Laktoz intoleransı", "Gluten intoleransı / Çölyak", "Diğer alerji/intolerans"],
  },
  {
    id: "kronik_hastalik",
    kategori: "Sağlık & Sindirim",
    soru: "Kronik hastalık veya düzenli ilaç kullanımınız var mı?",
    tip: "radio" as const,
    secenekler: ["Hayır", "Diyabet / İnsülin direnci", "Tiroid hastalığı", "Diğer kronik hastalık"],
  },
  {
    id: "uyku",
    kategori: "Yaşam Tarzı",
    soru: "Ortalama uyku süreniz?",
    tip: "radio" as const,
    secenekler: ["5 saatten az", "5-6 saat", "7-8 saat", "9 saatten fazla"],
  },
  {
    id: "stres",
    kategori: "Yaşam Tarzı",
    soru: "Günlük stres seviyenizi nasıl tanımlarsınız?",
    tip: "radio" as const,
    secenekler: ["Düşük — sakin bir yaşam", "Orta — yönetilebilir stres", "Yüksek — sık stres", "Çok yüksek — kronik stres"],
  },
  {
    id: "takviye",
    kategori: "Yaşam Tarzı",
    soru: "Şu an düzenli takviye kullanıyor musunuz?",
    tip: "radio" as const,
    secenekler: ["Hayır", "Vitamin D / B12", "Multivitamin", "Protein tozu / Spor takviyeleri"],
  },
];

// ── Bileşen ───────────────────────────────────────────────────────────────────

interface AnamnezFormProps {
  yukleniyor: boolean;
  onGonder: (cevaplar: Record<string, string>) => void;
}

export default function AnamnezForm({ yukleniyor, onGonder }: AnamnezFormProps) {
  const [aktifIndex, setAktifIndex] = useState(0);
  const [cevaplar, setCevaplar] = useState<Record<string, string>>({});
  const [animating, setAnimating] = useState(false);

  const aktif = SORULAR[aktifIndex];
  const toplamSoru = SORULAR.length;
  const sonSoru = aktifIndex === toplamSoru - 1;
  const cevaplandi = Object.keys(cevaplar).filter(k => cevaplar[k]).length;

  useEffect(() => {
    setAnimating(false);
  }, [aktifIndex]);

  function ilerle(deger: string) {
    setCevaplar(p => ({ ...p, [aktif.id]: deger }));
    if (!sonSoru) {
      setAnimating(true);
      setTimeout(() => {
        setAktifIndex(i => i + 1);
        setAnimating(false);
      }, 180);
    }
  }

  function geri() {
    if (aktifIndex > 0) {
      setAnimating(true);
      setTimeout(() => {
        setAktifIndex(i => i - 1);
        setAnimating(false);
      }, 180);
    }
  }

  function gonder() {
    onGonder(cevaplar);
  }

  const mevcutCevap = cevaplar[aktif.id];
  const ilerlemeYuzde = ((aktifIndex + 1) / toplamSoru) * 100;

  return (
    <div>
      {/* Progress bar */}
      <div style={{ background: "#FFFFFF", border: "1px solid #A5C8C5", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{aktif.kategori}</span>
          </div>
          <span style={{ fontSize: 13, fontFamily: "var(--font-dm-mono), monospace", color: "#64748B" }}>
            {aktifIndex + 1} / {toplamSoru}
          </span>
        </div>
        <div style={{ height: 6, background: "#E2E8F0", borderRadius: 999, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 999,
            background: "linear-gradient(90deg, #0D9488, #5EEAD4)",
            width: `${ilerlemeYuzde}%`,
            transition: "width 0.4s ease",
          }} />
        </div>
        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 5 }}>
          {cevaplandi} soru cevaplandı
        </div>
      </div>

      {/* Soru kartı */}
      <div style={{
        background: "#FFFFFF", border: "1px solid #A5C8C5", borderRadius: 16,
        padding: "32px 28px", marginBottom: 20,
        opacity: animating ? 0 : 1,
        transform: animating ? "translateX(16px)" : "translateX(0)",
        transition: "opacity 0.18s ease, transform 0.18s ease",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 28 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
            background: "#CCFBF1", color: "#0F766E",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700,
          }}>
            {aktifIndex + 1}
          </div>
          <h2 style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontSize: "clamp(18px,2.5vw,22px)", fontWeight: 400,
            color: "#0F172A", margin: 0, lineHeight: 1.35, letterSpacing: "-0.3px",
          }}>
            {aktif.soru}
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {aktif.secenekler.map((s) => {
            const secili = mevcutCevap === s;
            return (
              <button
                key={s}
                onClick={() => ilerle(s)}
                style={{
                  textAlign: "left", padding: "15px 20px", borderRadius: 12,
                  cursor: "pointer", fontFamily: "inherit", fontSize: 14,
                  fontWeight: secili ? 600 : 400,
                  color: secili ? "#C2410C" : "#334155",
                  background: secili ? "#FFF7ED" : "#F8FAFC",
                  border: `2px solid ${secili ? "#E05C25" : "#E2E8F0"}`,
                  transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 12,
                }}
                onMouseEnter={e => { if (!secili) (e.currentTarget as HTMLButtonElement).style.borderColor = "#A5C8C5"; }}
                onMouseLeave={e => { if (!secili) (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0"; }}
              >
                <span style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                  border: `2px solid ${secili ? "#E05C25" : "#CBD5E1"}`,
                  background: secili ? "#E05C25" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s",
                }}>
                  {secili && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                </span>
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigasyon */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={geri}
          disabled={aktifIndex === 0}
          style={{
            background: "transparent", color: "#64748B",
            border: "1px solid #E2E8F0", borderRadius: 10,
            padding: "11px 20px", fontSize: 14, fontWeight: 600,
            cursor: aktifIndex === 0 ? "not-allowed" : "pointer",
            fontFamily: "inherit", opacity: aktifIndex === 0 ? 0.3 : 1,
          }}
        >
          ← Geri
        </button>

        {/* Dot göstergesi */}
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {SORULAR.map((_, i) => (
            <div key={i} style={{
              width: i === aktifIndex ? 18 : 5, height: 5, borderRadius: 999,
              background: i < aktifIndex ? "#0D9488" : i === aktifIndex ? "#E05C25" : "#E2E8F0",
              transition: "all 0.3s",
            }} />
          ))}
        </div>

        {sonSoru && mevcutCevap ? (
          <button
            onClick={gonder}
            disabled={yukleniyor}
            style={{
              background: "#0D9488", color: "#fff", border: "none",
              borderRadius: 10, padding: "13px 28px", fontSize: 14,
              fontWeight: 600, cursor: yukleniyor ? "not-allowed" : "pointer",
              fontFamily: "inherit", opacity: yukleniyor ? 0.6 : 1,
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            {yukleniyor ? (
              <>
                <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                Rapor oluşturuluyor...
              </>
            ) : "Raporu Oluştur →"}
          </button>
        ) : (
          <button
            disabled={!mevcutCevap}
            onClick={() => mevcutCevap && ilerle(mevcutCevap)}
            style={{
              background: mevcutCevap ? "#0F172A" : "#E2E8F0",
              color: mevcutCevap ? "#fff" : "#94A3B8",
              border: "none", borderRadius: 10, padding: "11px 22px",
              fontSize: 14, fontWeight: 600,
              cursor: mevcutCevap ? "pointer" : "not-allowed",
              fontFamily: "inherit",
            }}
          >
            Sonraki →
          </button>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
