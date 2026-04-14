"use client";

import { useEffect, useRef } from "react";

const stats = [
  {
    target: 40,
    prefix: "+",
    suffix: "%",
    color: "#D97706",
    desc: "Kullanıcıların ilk 3 ayda raporladığı enerji ve performans artışı",
    divider: false,
  },
  {
    target: 15,
    prefix: "",
    suffix: " dk",
    color: "#0284C7",
    desc: "İlk analizin tamamlanma süresi. Kan tahlilini yükle, planın hazır.",
    divider: true,
  },
  {
    target: 91,
    prefix: "%",
    suffix: "",
    color: "#059669",
    desc: "Haftalık beslenme planına uyum oranı — otomatik güncelleme sayesinde",
    divider: true,
  },
];

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function Stats() {
  const numRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggered = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const els = numRefs.current.filter(Boolean) as HTMLDivElement[];

    const io = new IntersectionObserver(
      (entries) => {
        if (triggered.current) return;
        const visible = entries.some((e) => e.isIntersecting);
        if (!visible) return;
        triggered.current = true;
        io.disconnect();

        els.forEach((el, i) => {
          const s = stats[i];
          let start: number | null = null;
          const duration = 1400;

          const step = (ts: number) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const eased = easeOutCubic(progress);
            const val = Math.round(eased * s.target);
            el.textContent = s.prefix + val + s.suffix;
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.3 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section
      style={{
        padding: "96px 32px",
        background: "linear-gradient(135deg,#E0F2FE 0%,#CCFBF1 100%)",
        borderTop: "1px solid #A5C8C5",
        borderBottom: "1px solid #A5C8C5",
      }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                borderLeft: s.divider ? "1px solid #A5C8C5" : undefined,
                paddingLeft: s.divider ? 48 : undefined,
              }}
            >
              <div
                ref={(el) => { numRefs.current[i] = el; }}
                className="font-display"
                style={{
                  fontWeight: 400,
                  fontSize: "clamp(48px,5vw,64px)",
                  color: s.color,
                  letterSpacing: "-2px",
                  lineHeight: 1,
                }}
              >
                {s.prefix + s.target + s.suffix}
              </div>
              <div style={{ width: 32, height: 2, background: s.color, margin: "12px 0" }} />
              <p style={{ fontSize: 15, fontWeight: 400, color: "#334155", lineHeight: 1.7, margin: 0 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
        }
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .stats-grid > div {
            border-left: none !important;
            padding-left: 0 !important;
            border-top: 1px solid #A5C8C5;
            padding-top: 32px;
          }
          .stats-grid > div:first-child {
            border-top: none;
            padding-top: 0;
          }
        }
      `}</style>
    </section>
  );
}
