"use client";

const links = ["Gizlilik", "Kullanım Koşulları", "İletişim", "Blog"];

export default function Footer() {
  return (
    <footer style={{
      background: "#E8F7F5",
      borderTop: "1px solid #A5C8C5",
      padding: "48px 32px 32px",
    }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>

        {/* Top row */}
        <div className="footer-grid">
          {/* Logo + tagline */}
          <div>
            <div style={{ marginBottom: 12 }}>
              <div className="bioos-logo-pill" style={{ display: "inline-flex" }}>
                <span className="bioos-logo-text">
                  Bio<span className="os">OS</span>
                </span>
                <span className="bioos-logo-cursor" />
              </div>
              <span className="bioos-logo-sub">Biological OS</span>
            </div>
            <p style={{
              fontSize: 13, color: "#475569", lineHeight: 1.6,
              maxWidth: 260, margin: 0,
            }}>
              Biyolojinizi anlayın, optimize edin ve her gün en iyi versiyonunuz olun.
            </p>
          </div>

          {/* Nav links */}
          <div className="footer-links">
            {links.map((label) => (
              <a
                key={label}
                href="#"
                style={{
                  fontSize: 13, color: "#475569",
                  textDecoration: "none", transition: "color 0.2s",
                }}
                onMouseOver={(e) => ((e.target as HTMLAnchorElement).style.color = "#0F172A")}
                onMouseOut={(e) => ((e.target as HTMLAnchorElement).style.color = "#475569")}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ borderTop: "1px solid #A5C8C5", paddingTop: 24 }}>
          <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>
            © 2026 BioOS. Tüm hakları saklıdır.
          </p>
        </div>
      </div>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 48px;
          align-items: start;
          margin-bottom: 40px;
        }
        .footer-links {
          display: flex;
          gap: 32px;
          align-items: center;
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .footer-links { flex-wrap: wrap; gap: 16px !important; }
        }
      `}</style>
    </footer>
  );
}
