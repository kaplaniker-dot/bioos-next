"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const avatars = [
  { src: "https://placehold.co/28x28/0D9488/white?text=A", alt: "A" },
  { src: "https://placehold.co/28x28/059669/white?text=M", alt: "M" },
  { src: "https://placehold.co/28x28/0284C7/white?text=S", alt: "S" },
  { src: "https://placehold.co/28x28/D97706/white?text=E", alt: "E" },
];

const trustBadges = [
  "Kredi kartı gerekmez",
  "14 gün ücretsiz",
  "İstediğin zaman iptal",
];

export default function CTA() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches || !contentRef.current) return;
    const el = contentRef.current;
    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.transition = "opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)";

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.style.opacity = "1";
        el.style.transform = "none";
        io.disconnect();
      }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section style={{
      padding: "120px 32px",
      textAlign: "center",
      background: "linear-gradient(150deg,#CFFAFE 0%,#CCFBF1 45%,#D1FAE5 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 70% 60% at 50% 110%,rgba(2,132,199,0.1),transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 100, height: 2,
        background: "linear-gradient(90deg,transparent,#0D9488,transparent)",
      }} />

      {/* Decorative background text */}
      <div className="font-display" style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        fontSize: 320, fontWeight: 300,
        color: "rgba(13,148,136,0.04)",
        lineHeight: 1, pointerEvents: "none",
        userSelect: "none", whiteSpace: "nowrap",
      }}>
        BioOS
      </div>

      <div ref={contentRef} style={{ maxWidth: 660, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <span className="section-label" style={{ justifyContent: "center", marginBottom: 28 }}>
          Başlamaya hazır mısın?
        </span>

        <h2 className="font-display" style={{
          fontWeight: 400, fontSize: "clamp(38px,5vw,60px)",
          letterSpacing: "-1px", color: "#0F172A", margin: "0 0 24px", lineHeight: 1.05,
        }}>
          Biyolojinin seni<br />sınırlamasına izin verme.
        </h2>

        {/* Social proof pill */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 14,
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(13,148,136,0.2)",
          borderRadius: 100, padding: "10px 20px", marginBottom: 36,
        }}>
          <div style={{ display: "flex", marginRight: 4 }}>
            {avatars.map((a, i) => (
              <Image
                key={a.alt}
                src={a.src} alt={a.alt} width={28} height={28}
                style={{
                  borderRadius: "50%",
                  border: "2px solid white",
                  marginLeft: i === 0 ? 0 : -6,
                }}
              />
            ))}
          </div>
          <div style={{ width: 1, height: 20, background: "rgba(13,148,136,0.25)" }} />
          <span style={{ fontSize: 13, fontWeight: 500, color: "#0F172A" }}>
            2.400+ kullanıcı aktif
          </span>
          <span style={{ color: "#D97706", fontSize: 13 }}>★★★★★</span>
        </div>

        <div style={{ marginBottom: 28 }}>
          <a
            href="#"
            className="btn-primary"
            style={{
              fontSize: 17, padding: "16px 36px",
              animation: "ctaGlow 2.5s ease-in-out infinite",
            }}
          >
            Ücretsiz Hesap Oluştur →
          </a>
        </div>

        {/* Trust badges */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 20, flexWrap: "wrap",
        }}>
          {trustBadges.map((badge, i) => (
            <div key={badge} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {i > 0 && (
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#A5C8C5" }} />
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#059669", fontSize: 14 }}>✓</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#475569" }}>{badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
