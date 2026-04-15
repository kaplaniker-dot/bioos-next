"use client";

interface Deger {
  ad: string;
  deger: string;
  referans: string;
  durum: "normal" | "dikkat" | "risk";
  yorum: string;
}

interface AnalizSonucProps {
  sonuc: {
    genelDegerlendirme?: string;
    degerler?: Deger[];
    oncelikliMudahale?: string[];
    gucluyonler?: string[];
  };
  yukleniyor: boolean;
  onDevam: () => void;
}

const DURUM_RENK = {
  normal: { bg: "#DCFCE7", text: "#166534", border: "#86EFAC" },
  dikkat: { bg: "#FEF3C7", text: "#92400E", border: "#FCD34D" },
  risk: { bg: "#FEE2E2", text: "#991B1B", border: "#FCA5A5" },
};

const DURUM_ETIKET = {
  normal: "Normal",
  dikkat: "Dikkat",
  risk: "Risk",
};

export default function AnalizSonucu({ sonuc, yukleniyor, onDevam }: AnalizSonucProps) {
  return (
    <div>
      {/* Genel değerlendirme */}
      {sonuc.genelDegerlendirme && (
        <div style={{
          background: "linear-gradient(135deg, #E0F2FE 0%, #CCFBF1 100%)",
          border: "1px solid #A5C8C5", borderRadius: 14, padding: 24, marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0F766E", marginBottom: 10 }}>
            Genel Değerlendirme
          </div>
          <p style={{ fontSize: 15, color: "#0F172A", lineHeight: 1.7, margin: 0 }}>
            {sonuc.genelDegerlendirme}
          </p>
        </div>
      )}

      {/* Değerler tablosu */}
      {sonuc.degerler && sonuc.degerler.length > 0 && (
        <div style={{ background: "#FFFFFF", border: "1px solid #A5C8C5", borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #E2E8F0" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Ölçüm Değerlendirmesi</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Değer", "Ölçümünüz", "Referans", "Durum", "Yorum"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#64748B", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sonuc.degerler.map((d, i) => {
                  const renk = DURUM_RENK[d.durum] || DURUM_RENK.normal;
                  return (
                    <tr key={i} style={{ borderTop: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{d.ad}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "var(--font-dm-mono), monospace", color: "#334155" }}>{d.deger}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748B" }}>{d.referans}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          display: "inline-block", padding: "3px 10px", borderRadius: 999,
                          fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
                          background: renk.bg, color: renk.text, border: `1px solid ${renk.border}`,
                        }}>
                          {DURUM_ETIKET[d.durum] || d.durum}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{d.yorum}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* İki kolon: Güçlü yönler + Öncelikli müdahale */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        {sonuc.gucluyonler && sonuc.gucluyonler.length > 0 && (
          <div style={{ background: "#DCFCE7", border: "1px solid #86EFAC", borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 12, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              ✓ Güçlü Yönler
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {sonuc.gucluyonler.map((m, i) => (
                <li key={i} style={{ fontSize: 13, color: "#166534", lineHeight: 1.6, padding: "2px 0" }}>• {m}</li>
              ))}
            </ul>
          </div>
        )}
        {sonuc.oncelikliMudahale && sonuc.oncelikliMudahale.length > 0 && (
          <div style={{ background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#92400E", marginBottom: 12, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              ⚡ Öncelikli Müdahale
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {sonuc.oncelikliMudahale.map((m, i) => (
                <li key={i} style={{ fontSize: 13, color: "#92400E", lineHeight: 1.6, padding: "2px 0" }}>• {m}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
          Sonraki adımda sana özel anamnez formu oluşturulacak.
        </p>
        <button
          onClick={onDevam}
          disabled={yukleniyor}
          style={{
            background: "#0D9488", color: "#fff", border: "none", borderRadius: 10,
            padding: "13px 28px", fontSize: 14, fontWeight: 600, cursor: yukleniyor ? "not-allowed" : "pointer",
            fontFamily: "inherit", opacity: yukleniyor ? 0.6 : 1,
            display: "flex", alignItems: "center", gap: 8,
          }}
        >
          {yukleniyor ? (
            <>
              <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              Form oluşturuluyor...
            </>
          ) : (
            "Anamnez Formuna Geç →"
          )}
        </button>
      </div>
    </div>
  );
}
