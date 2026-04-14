"use client";

import { useEffect, useRef } from "react";

const cards = [
  {
    tag: { label: "Performans", bg: "#FEF3C7", border: "#D97706", text: "#92400E" },
    title: "Sporcu ve Performans Meraklıları",
    desc: "VO2 Max'ını artırmak, toparlanmayı hızlandırmak ve pik performansa ulaşmak isteyenler için.",
    bullets: [
      "Egzersiz kapasitesi ve toparlanma analizi",
      "Antrenman öncesi/sonrası beslenme rehberi",
      "Uyku kalitesi ve HRV optimizasyonu",
      "Takviye ve hidrasyon protokolleri",
    ],
    stat: { value: "%23", color: "#D97706", desc: "Haftalık antrenmandan daha fazla verim aldığını raporlayan kullanıcılar." },
    statBg: "#F4FAFA",
    cardBg: "#E8F7F5",
    cta: { label: "Keşfet", variant: "primary" },
  },
  {
    tag: { label: "Uzun Ömür", bg: "#D1FAE5", border: "#059669", text: "#064E3B" },
    title: "Sağlığını Uzun Vadede Yönetmek İsteyenler",
    desc: "Kan değerlerini anlamak, yaşam kalitesini artırmak ve erken önlem almak isteyenler için.",
    bullets: [
      "Kapsamlı kan tahlili yorumlama",
      "Kişiselleştirilmiş beslenme ve diyet planı",
      "Vitamin ve mineral eksikliği tespiti",
      "Doktora gitmeden önce ne sormalısın rehberi",
    ],
    stat: { value: "%78", color: "#059669", desc: "İlk 30 günde en az bir kritik eksikliği fark ettiğini bildiren kullanıcılar." },
    statBg: "#E8F7F5",
    cardBg: "#F4FAFA",
    cta: { label: "Başla", variant: "outline" },
  },
];

export default function TargetAudience() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const els = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    els.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "scale(0.95)";
      el.style.transition = `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`;
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "none";
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="ozellikler"
      style={{ padding: "96px 32px", background: "#F4FAFA" }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <span className="section-label">Kim İçin</span>
          <h2
            className="font-display"
            style={{
              fontWeight: 400,
              fontSize: "clamp(32px,4vw,44px)",
              letterSpacing: "-0.5px",
              color: "#0F172A",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Sağlığını ciddiye alanlar için
          </h2>
        </div>

        {/* Cards */}
        <div className="audience-grid">
          {cards.map((card, i) => (
            <div
              key={card.title}
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{
                background: card.cardBg,
                border: "1px solid #A5C8C5",
                borderRadius: 16,
                padding: 36,
                display: "flex",
                flexDirection: "column",
                gap: 24,
                transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(13,148,136,0.13)";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "none";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              {/* Top */}
              <div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: card.tag.bg, border: `1px solid ${card.tag.border}`,
                  borderRadius: 100, padding: "4px 12px", marginBottom: 16,
                }}>
                  <span className="font-mono-brand" style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: card.tag.text }}>
                    {card.tag.label}
                  </span>
                </div>
                <h3 className="font-display" style={{
                  fontWeight: 400, fontSize: 26, color: "#0F172A",
                  margin: "0 0 10px", letterSpacing: "-0.3px",
                }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>
                  {card.desc}
                </p>
              </div>

              {/* Inner grid */}
              <div className="card-inner">
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "#0F172A", letterSpacing: "0.3px", marginBottom: 12 }}>
                    Ne Sunar
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {card.bullets.map((b) => (
                      <div key={b} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <span style={{ color: "#059669", fontSize: 13, marginTop: 1 }}>✓</span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#0F172A", lineHeight: 1.5 }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{
                  background: card.statBg,
                  border: "1px solid #A5C8C5",
                  borderRadius: 12,
                  padding: 18,
                }}>
                  <div className="font-display" style={{
                    fontWeight: 500, fontSize: 36, color: card.stat.color, lineHeight: 1,
                  }}>
                    {card.stat.value}
                  </div>
                  <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.6, margin: "8px 0 0" }}>
                    {card.stat.desc}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div>
                <a
                  href="#"
                  className={card.cta.variant === "primary" ? "btn-primary" : "btn-outline"}
                  style={{ fontSize: 13, padding: "9px 20px" }}
                >
                  {card.cta.label}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .audience-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .card-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 900px) {
          .audience-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .card-inner { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
