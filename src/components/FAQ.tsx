"use client";

import { useState, useRef, useEffect } from "react";

const items = [
  {
    q: "Kan tahlilimi nasıl yükleyebilirim?",
    a: "Kan tahlili sonuçlarınızı PDF formatında yükleyebilir veya manuel olarak değerleri girebilirsiniz. Sistem, çoğu Türk laboratuvarının çıktı formatını otomatik olarak tanır.",
  },
  {
    q: "Hangi cihazlar destekleniyor?",
    a: "Tanita vücut ölçüm cihazları, Garmin, Apple Watch ve çoğu Bluetooth tabanlı sağlık cihazı desteklenmektedir. Cihaz listesi düzenli olarak genişletilmektedir.",
  },
  {
    q: "Verilerim güvende mi?",
    a: "Tüm sağlık verileriniz AES-256 şifreleme ile korunur ve yalnızca sizin erişiminize açıktır. Verileriniz asla üçüncü taraflarla paylaşılmaz veya satılmaz.",
  },
  {
    q: "Doktorum yerine mi geçiyor?",
    a: "Hayır. BioOS bir tıbbi tanı veya tedavi aracı değildir. Doktorunuzla daha verimli görüşmeler yapmanız için verilerinizi anlamlandırmanıza yardımcı olur. Ciddi bulgular için mutlaka hekiminize danışın.",
  },
  {
    q: "Planım ne sıklıkla güncelleniyor?",
    a: "Beslenme ve egzersiz planınız her hafta otomatik olarak güncellenir. Yeni bir tahlil yüklediğinizde veya vücut ölçümleriniz değiştiğinde plan anında yeniden optimize edilir.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches || !ref.current) return;
    const el = ref.current;
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${index * 0.07}s, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${index * 0.07}s`;

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.style.opacity = "1";
        el.style.transform = "none";
        io.disconnect();
      }
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, [index]);

  return (
    <div ref={ref} style={{ borderBottom: "1px solid #A5C8C5" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%", background: "none", border: "none", textAlign: "left",
          cursor: "pointer", padding: "20px 0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontSize: 16, fontWeight: 500, color: open ? "#0D9488" : "#0F172A",
          transition: "color 0.2s", fontFamily: "inherit",
        }}
      >
        {q}
        <span style={{
          width: 20, height: 20, border: "1.5px solid #A5C8C5", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          transition: "border-color 0.2s, transform 0.3s",
          transform: open ? "rotate(45deg)" : "none",
          borderColor: open ? "#0D9488" : "#A5C8C5",
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <line x1="5" y1="1" x2="5" y2="9" stroke={open ? "#0D9488" : "#475569"} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="1" y1="5" x2="9" y2="5" stroke={open ? "#0D9488" : "#475569"} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div style={{
        maxHeight: open ? 400 : 0,
        overflow: "hidden",
        transition: "max-height 0.35s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <p style={{ paddingBottom: 20, color: "#475569", fontSize: 15, lineHeight: 1.7, margin: 0 }}>
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section style={{
      padding: "96px 32px",
      background: "#E8F7F5",
      borderTop: "1px solid #A5C8C5",
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: 56 }}>
          <span className="section-label">Sık Sorulan Sorular</span>
          <h2 className="font-display" style={{
            fontWeight: 400, fontSize: "clamp(32px,4vw,44px)",
            letterSpacing: "-0.5px", color: "#0F172A", margin: 0, lineHeight: 1.1,
          }}>
            Aklına takılanlar
          </h2>
        </div>
        <div>
          {items.map((item, i) => (
            <FAQItem key={item.q} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
