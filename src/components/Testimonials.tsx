"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function Testimonials() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const els = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    els.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "scale(0.95)";
      el.style.transition = `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`;
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

  const hoverIn = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 12px 32px rgba(13,148,136,0.1)";
  };
  const hoverOut = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "none";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <section style={{ padding: "96px 32px" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <span className="section-label">Kullanıcı Deneyimleri</span>
          <h2 className="font-display" style={{
            fontWeight: 400, fontSize: "clamp(32px,4vw,44px)",
            letterSpacing: "-0.5px", color: "#0F172A", margin: 0, lineHeight: 1.1,
          }}>
            Gerçek sonuçlar,<br />gerçek insanlar
          </h2>
        </div>

        <div className="testimonial-grid">

          {/* Card 1 — large */}
          <div
            ref={(el) => { cardRefs.current[0] = el; }}
            onMouseOver={hoverIn}
            onMouseOut={hoverOut}
            style={{
              background: "#E8F7F5", border: "1px solid #A5C8C5", borderRadius: 16,
              padding: 36, display: "flex", flexDirection: "column",
              justifyContent: "space-between", gap: 24,
              transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div>
              <div className="font-display" style={{ fontSize: 32, color: "#D97706", lineHeight: 1, marginBottom: 16 }}>"</div>
              <p className="font-display" style={{
                fontWeight: 600, fontSize: 20, color: "#0F172A", lineHeight: 1.6, margin: 0,
              }}>
                Yıllardır yorgunluk ve konsantrasyon sorunuyla yaşıyordum. Doktorlar &lsquo;değerlerin normal&rsquo; diyordu. BioOS analizi ferritin düzeyimin optimal aralığın altında olduğunu ve D vitamini emilimimin yetersiz kaldığını gösterdi. 6 hafta içinde fark ettim.
              </p>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              paddingTop: 20, borderTop: "1px solid #A5C8C5",
            }}>
              <Image
                src="https://placehold.co/44x44/E8E3DB/6B6560?text=AK"
                alt="Ayşe K." width={44} height={44}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#0F172A" }}>Ayşe K.</div>
                <div style={{ fontSize: 12, color: "#475569" }}>İstanbul</div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Card 2 — stat mini */}
            <div
              ref={(el) => { cardRefs.current[1] = el; }}
              onMouseOver={hoverIn}
              onMouseOut={hoverOut}
              style={{
                background: "#F4FAFA", border: "1px solid #A5C8C5", borderRadius: 16,
                padding: 28, display: "grid", gridTemplateColumns: "80px 1fr",
                gap: 20, alignItems: "start",
                transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <div style={{
                background: "#E8F7F5", border: "1px solid #A5C8C5",
                borderRadius: 12, padding: 16, textAlign: "center",
              }}>
                <div className="font-display" style={{ fontWeight: 500, fontSize: 36, color: "#D97706", lineHeight: 1 }}>%34</div>
              </div>
              <div>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 12px" }}>
                  &ldquo;VO2 Max değerimde 12 haftada bu artışı sağladım. BioOS&apos;un egzersiz ve beslenme entegrasyonu olmadan bu mümkün olmazdı.&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Image
                    src="https://placehold.co/32x32/E8E3DB/6B6560?text=MT"
                    alt="Mert T." width={32} height={32}
                    style={{ borderRadius: "50%" }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#0F172A" }}>Mert T.</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>İzmir</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div
              ref={(el) => { cardRefs.current[2] = el; }}
              onMouseOver={hoverIn}
              onMouseOut={hoverOut}
              style={{
                background: "#D1FAE5", border: "1px solid #059669",
                borderRadius: 16, padding: 28,
                transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <div className="font-display" style={{ fontSize: 28, color: "#059669", lineHeight: 1, marginBottom: 12 }}>"</div>
              <p className="font-display" style={{
                fontWeight: 600, fontSize: 18, color: "#0F172A", lineHeight: 1.6, margin: "0 0 20px",
              }}>
                Diyetisyen ve kişisel antrenörle çalışıyordum ama verilerim hiç bir arada değerlendirilmiyordu. BioOS her şeyi tek platforma taşıdı. Artık antrenörüme BioOS raporumu gönderiyorum, çok daha verimli çalışıyoruz.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Image
                  src="https://placehold.co/36x36/B3EDD4/1A6E4F?text=SA"
                  alt="Selin A." width={36} height={36}
                  style={{ borderRadius: "50%" }}
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#0F172A" }}>Selin A.</div>
                  <div style={{ fontSize: 11, color: "#064E3B" }}>Ankara</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .testimonial-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 768px) {
          .testimonial-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
