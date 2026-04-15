"use client";

import { useEffect, useRef, useState } from "react";
import { useModal } from "@/context/ModalContext";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { open } = useModal();

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const handler = () => {
      if (window.scrollY > 8) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      ref={navRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(244,250,250,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(165,200,197,0.4)",
        transition: "box-shadow 0.3s ease",
        padding: "0 32px",
      }}
    >
      <div
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        {/* Logo */}
        <div>
          <div className="bioos-logo-pill">
            <span className="bioos-logo-text">
              Bio<span className="os">OS</span>
            </span>
            <span className="bioos-logo-cursor" />
          </div>
          <span className="bioos-logo-sub">Biological OS</span>
        </div>

        {/* Desktop nav links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
          }}
          className="nav-links"
        >
          {["Nasıl Çalışır", "Özellikler", "Fiyatlar", "SSS"].map((label) => (
            <a
              key={label}
              href="#"
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#334155",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseOver={(e) =>
                ((e.target as HTMLAnchorElement).style.color = "#0D9488")
              }
              onMouseOut={(e) =>
                ((e.target as HTMLAnchorElement).style.color = "#334155")
              }
            >
              {label}
            </a>
          ))}
          <button
            onClick={open}
            className="btn-primary"
            style={{ fontSize: 14, padding: "10px 20px" }}
          >
            Ücretsiz Başla
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menü"
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
          }}
          className="hamburger-btn"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {menuOpen ? (
              <>
                <line x1="4" y1="4" x2="18" y2="18" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                <line x1="18" y1="4" x2="4" y2="18" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : (
              <>
                <line x1="3" y1="6"  x2="19" y2="6"  stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                <line x1="3" y1="11" x2="19" y2="11" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
                <line x1="3" y1="16" x2="19" y2="16" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            borderTop: "1px solid rgba(165,200,197,0.4)",
            padding: "16px 0 24px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {["Nasıl Çalışır", "Özellikler", "Fiyatlar", "SSS"].map((label) => (
            <a
              key={label}
              href="#"
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "#334155",
                textDecoration: "none",
                padding: "10px 0",
              }}
            >
              {label}
            </a>
          ))}
          <a
            href="#"
            className="btn-primary"
            style={{ marginTop: 8, textAlign: "center", justifyContent: "center" }}
          >
            Ücretsiz Başla
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hamburger-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
