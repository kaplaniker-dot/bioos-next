"use client";

import { useState, useEffect, useRef } from "react";
import { useModal } from "@/context/ModalContext";

type State = "idle" | "loading" | "success" | "exists" | "error";

export default function WaitlistModal() {
  const { isOpen, close } = useModal();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setState("idle");
      setEmail("");
      setErrorMsg("");
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Bir hata oluştu.");
        setState("error");
      } else if (data.message === "already_exists") {
        setState("exists");
      } else {
        setState("success");
      }
    } catch {
      setErrorMsg("Bağlantı hatası. Lütfen tekrar dene.");
      setState("error");
    }
  }

  if (!isOpen) return null;

  return (
    <div
      ref={backdropRef}
      onClick={(e) => { if (e.target === backdropRef.current) close(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(15,23,42,0.55)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div style={{
        width: "100%", maxWidth: 480,
        background: "#FFFFFF",
        border: "1px solid #A5C8C5",
        borderRadius: 20,
        padding: "40px 40px 36px",
        position: "relative",
        boxShadow: "0 8px 16px rgba(15,23,42,0.06), 0 32px 64px rgba(13,148,136,0.12)",
        animation: "slideUp 0.25s cubic-bezier(0.16,1,0.3,1)",
      }}>

        {/* Close button */}
        <button
          onClick={close}
          aria-label="Kapat"
          style={{
            position: "absolute", top: 16, right: 16,
            width: 32, height: 32, borderRadius: "50%",
            background: "#F1F5F9", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#E2E8F0")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#F1F5F9")}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <line x1="1" y1="1" x2="11" y2="11" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="11" y1="1" x2="1" y2="11" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {state === "success" ? (
          /* ── Success state ── */
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "linear-gradient(135deg,#CCFBF1,#D1FAE5)",
              border: "1px solid #A5C8C5",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="font-display" style={{
              fontWeight: 400, fontSize: 28, color: "#0F172A",
              margin: "0 0 12px", letterSpacing: "-0.5px",
            }}>
              Listeye eklendin!
            </h2>
            <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: "0 0 28px" }}>
              BioOS erken erişim açıldığında seni haberdar edeceğiz.
            </p>
            <button onClick={close} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Tamam
            </button>
          </div>
        ) : state === "exists" ? (
          /* ── Already exists ── */
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "#E0F2FE", border: "1px solid #A5C8C5",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#0284C7" strokeWidth="1.5" />
                <path d="M12 8v5" stroke="#0284C7" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="12" cy="15.5" r="0.75" fill="#0284C7" />
              </svg>
            </div>
            <h2 className="font-display" style={{
              fontWeight: 400, fontSize: 28, color: "#0F172A",
              margin: "0 0 12px", letterSpacing: "-0.5px",
            }}>
              Zaten kayıtlısın
            </h2>
            <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, margin: "0 0 28px" }}>
              Bu email adresiyle daha önce listeye eklendin. Haber bekliyoruz!
            </p>
            <button onClick={close} className="btn-outline" style={{ width: "100%", justifyContent: "center" }}>
              Tamam
            </button>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <span className="section-label" style={{ marginBottom: 12 }}>Erken Erişim</span>
              <h2 className="font-display" style={{
                fontWeight: 400, fontSize: 30, color: "#0F172A",
                margin: "0 0 10px", letterSpacing: "-0.5px", lineHeight: 1.1,
              }}>
                Biyolojini optimize etmeye hazır mısın?
              </h2>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>
                Waitlist&apos;e katıl — erken erişim açıldığında ilk sen haberdar ol.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setState("idle"); setErrorMsg(""); }}
                  placeholder="email@adresin.com"
                  required
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    fontSize: 15,
                    border: `1.5px solid ${state === "error" ? "#EF4444" : "#A5C8C5"}`,
                    borderRadius: 10,
                    outline: "none",
                    background: "#F8FAFC",
                    color: "#0F172A",
                    fontFamily: "inherit",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0D9488";
                    e.target.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.1)";
                    e.target.style.background = "#FFFFFF";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = state === "error" ? "#EF4444" : "#A5C8C5";
                    e.target.style.boxShadow = "none";
                    e.target.style.background = "#F8FAFC";
                  }}
                />
                {state === "error" && errorMsg && (
                  <p style={{ fontSize: 12, color: "#EF4444", margin: "6px 0 0", paddingLeft: 4 }}>
                    {errorMsg}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={state === "loading"}
                className="btn-primary"
                style={{ justifyContent: "center", opacity: state === "loading" ? 0.7 : 1 }}
              >
                {state === "loading" ? (
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: "spin 0.8s linear infinite" }}>
                      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                      <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Kaydediliyor…
                  </span>
                ) : "Waitlist'e Katıl →"}
              </button>
            </form>

            {/* Trust row */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 16, marginTop: 20, flexWrap: "wrap",
            }}>
              {["Ücretsiz", "Spam yok", "İstediğin zaman çık"].map((t, i) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {i > 0 && <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#A5C8C5", display: "inline-block" }} />}
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ color: "#059669", fontSize: 12 }}>✓</span>
                    <span style={{ fontSize: 12, color: "#94A3B8" }}>{t}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
