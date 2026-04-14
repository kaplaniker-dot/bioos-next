"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    num: "01",
    title: "Verini Yükle",
    bullets: [
      "Kan tahlili sonuçlarını PDF veya manuel olarak gir",
      "Tanita veya benzeri cihaz ölçümlerini ekle",
      "Geçmiş sağlık bilgilerini, ilaç ve takviyelerini tanımla",
      "Sakatlık veya kısıtlamalarını sisteme bildir",
    ],
    result: "BioOS tüm verilerini birleştirerek benzersiz biyolojik profilini oluşturur.",
  },
  {
    num: "02",
    title: "AI Analiz Eder",
    bullets: [
      "Biyobelirteçlerin referans aralıklarla karşılaştırılır",
      "Eksiklikler, riskler ve öncelikler tespit edilir",
      "Beslenme ve takviye ihtiyaçları hesaplanır",
      "Egzersiz kapasiten ve kısıtlamaların değerlendirilir",
    ],
    result: "Saat içinde, sana özel kapsamlı bir sağlık analizi hazır olur.",
  },
  {
    num: "03",
    title: "Planını Takip Et",
    bullets: [
      "Haftalık güncellenen kişisel beslenme planı",
      "Sakatlık geçmişine göre özelleştirilmiş egzersiz programı",
      "Hangi değerlerin neden kritik olduğunu öğren",
      "Canlı grafiklerle ilerlemeyi haftalık izle",
    ],
    result: "Verilerini platforma bağladıkça sistem sürekli öğrenir ve planı geliştirir.",
  },
];

export default function HowItWorks() {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const els = rowRefs.current.filter(Boolean) as HTMLDivElement[];
    els.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      el.style.transition = `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`;
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
      id="nasil-calisir"
      style={{ padding: "96px 32px", borderTop: "1px solid #A5C8C5" }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <span className="section-label">Süreç</span>
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
            Nasıl Çalışır?
          </h2>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {steps.map((step, i) => (
            <div
              key={step.num}
              ref={(el) => { rowRefs.current[i] = el; }}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr",
                gap: 48,
                padding: "56px 0",
                borderTop: "1px solid #A5C8C5",
                borderBottom: i === steps.length - 1 ? "1px solid #A5C8C5" : undefined,
              }}
            >
              {/* Step number */}
              <div>
                <div
                  className="font-display"
                  style={{
                    fontWeight: 300,
                    fontSize: 56,
                    color: "#D97706",
                    lineHeight: 1,
                    letterSpacing: "-1px",
                  }}
                >
                  {step.num}
                </div>
              </div>

              {/* Content */}
              <div className="step-inner">
                <div>
                  <h3
                    className="font-display"
                    style={{
                      fontWeight: 400,
                      fontSize: 28,
                      color: "#0F172A",
                      margin: "0 0 24px",
                      letterSpacing: "-0.3px",
                    }}
                  >
                    {step.title}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {step.bullets.map((b) => (
                      <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{ color: "#059669", fontSize: 14, fontWeight: 500, marginTop: 2 }}>✓</span>
                        <span style={{ fontSize: 15, fontWeight: 500, color: "#0F172A", lineHeight: 1.6 }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Result box */}
                <div
                  style={{
                    background: "#E8F7F5",
                    border: "1px solid #A5C8C5",
                    borderLeft: "3px solid #D97706",
                    borderRadius: 12,
                    padding: 24,
                  }}
                >
                  <p style={{ fontSize: 15, fontWeight: 400, color: "#334155", lineHeight: 1.7, margin: 0 }}>
                    {step.result}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        .step-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .step-inner { grid-template-columns: 1fr !important; gap: 24px !important; }
          section#nasil-calisir > div > div > div {
            grid-template-columns: 48px 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
