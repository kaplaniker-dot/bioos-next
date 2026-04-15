import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(13,148,136,0.09) 0%, transparent 70%), #F4FAFA",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 16px",
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "#141414", borderRadius: 8, padding: "6px 10px",
        }}>
          <span style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 14, fontWeight: 500, color: "#F4FAFA", letterSpacing: "0.02em",
          }}>
            Bio<span style={{ color: "#FBBF24" }}>OS</span>
          </span>
          <span style={{
            display: "inline-block", width: 8, height: 14,
            background: "#D97706", borderRadius: 1,
            animation: "cursorBlink 1.1s step-end infinite",
          }} />
        </div>
      </div>

      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#0D9488",
            colorBackground: "#FFFFFF",
            colorText: "#0F172A",
            colorTextSecondary: "#475569",
            colorInputBackground: "#F8FAFC",
            colorInputText: "#0F172A",
            borderRadius: "10px",
            fontFamily: "DM Sans, system-ui, sans-serif",
          },
          elements: {
            card: {
              boxShadow: "0 8px 16px rgba(15,23,42,0.06), 0 32px 64px rgba(13,148,136,0.08)",
              border: "1px solid #A5C8C5",
            },
            headerTitle: {
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 400,
              fontSize: "28px",
              letterSpacing: "-0.5px",
            },
            formButtonPrimary: {
              backgroundColor: "#0D9488",
              "&:hover": { backgroundColor: "#0F766E" },
            },
            footerActionLink: { color: "#0D9488" },
            identityPreviewEditButton: { color: "#0D9488" },
          },
        }}
      />

      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
