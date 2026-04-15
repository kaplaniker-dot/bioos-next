import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { olcumler, anamnezCevaplari, hedef } = body;

  const systemPrompt = `Sen uzman bir Türk diyetisyenisin. TÜBER ve WHO referans değerlerini biliyorsun. Kısa, net, klinik Türkçe yanıt ver.`;

  const userMessage = `Kişi bilgileri:
Ölçümler: ${JSON.stringify(olcumler)}
Anamnez: ${JSON.stringify(anamnezCevaplari)}
Hedef: ${hedef}

Bu kişi için beslenme analizi ve raporu oluştur.`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 3000,
      system: systemPrompt,
      tools: [
        {
          name: "beslenme_raporu",
          description: "Kişiye özel beslenme analizi ve raporu",
          input_schema: {
            type: "object" as const,
            properties: {
              analiz: {
                type: "object",
                properties: {
                  genelDegerlendirme: { type: "string" },
                  degerler: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        ad: { type: "string" },
                        deger: { type: "string" },
                        referans: { type: "string" },
                        durum: { type: "string", enum: ["normal", "dikkat", "risk"] },
                        yorum: { type: "string" },
                      },
                      required: ["ad", "deger", "referans", "durum", "yorum"],
                    },
                  },
                  gucluyonler: { type: "array", items: { type: "string" } },
                  oncelikliMudahale: { type: "array", items: { type: "string" } },
                },
                required: ["genelDegerlendirme", "degerler", "gucluyonler", "oncelikliMudahale"],
              },
              rapor: {
                type: "object",
                properties: {
                  kisiBilgisi: {
                    type: "object",
                    properties: {
                      ozet: { type: "string" },
                      gucluYonler: { type: "array", items: { type: "string" } },
                      riskler: { type: "array", items: { type: "string" } },
                      oncelikliMudahale: { type: "array", items: { type: "string" } },
                    },
                    required: ["ozet", "gucluYonler", "riskler", "oncelikliMudahale"],
                  },
                  enerjiHedefi: {
                    type: "object",
                    properties: {
                      bmr: { type: "number" },
                      tdee: { type: "number" },
                      gunlukKalori: { type: "number" },
                      aciklama: { type: "string" },
                    },
                    required: ["bmr", "tdee", "gunlukKalori", "aciklama"],
                  },
                  makroDagilimi: {
                    type: "object",
                    properties: {
                      protein: {
                        type: "object",
                        properties: { gram: { type: "number" }, yuzde: { type: "number" }, aciklama: { type: "string" } },
                        required: ["gram", "yuzde", "aciklama"],
                      },
                      karbonhidrat: {
                        type: "object",
                        properties: { gram: { type: "number" }, yuzde: { type: "number" }, aciklama: { type: "string" } },
                        required: ["gram", "yuzde", "aciklama"],
                      },
                      yag: {
                        type: "object",
                        properties: { gram: { type: "number" }, yuzde: { type: "number" }, aciklama: { type: "string" } },
                        required: ["gram", "yuzde", "aciklama"],
                      },
                    },
                    required: ["protein", "karbonhidrat", "yag"],
                  },
                  kritikMikroBesinler: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        ad: { type: "string" },
                        oncelik: { type: "string", enum: ["yuksek", "orta", "dusuk"] },
                        neden: { type: "string" },
                        gunlukHedef: { type: "string" },
                        kaynaklar: { type: "array", items: { type: "string" } },
                        takviyeOneri: { type: "string" },
                      },
                      required: ["ad", "oncelik", "neden", "gunlukHedef", "kaynaklar", "takviyeOneri"],
                    },
                  },
                  kacinilacakBesinler: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        besin: { type: "string" },
                        neden: { type: "string" },
                      },
                      required: ["besin", "neden"],
                    },
                  },
                  turkMutfagiOnerileri: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        yemek: { type: "string" },
                        neden: { type: "string" },
                        sıklık: { type: "string" },
                      },
                      required: ["yemek", "neden", "sıklık"],
                    },
                  },
                  pratikIpuclari: { type: "array", items: { type: "string" } },
                },
                required: ["kisiBilgisi", "enerjiHedefi", "makroDagilimi", "kritikMikroBesinler", "kacinilacakBesinler", "turkMutfagiOnerileri", "pratikIpuclari"],
              },
            },
            required: ["analiz", "rapor"],
          },
        },
      ],
      tool_choice: { type: "tool" as const, name: "beslenme_raporu" },
      messages: [{ role: "user", content: userMessage }],
    });

    const toolUse = response.content.find(c => c.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      return NextResponse.json({ error: "Rapor oluşturulamadı" }, { status: 500 });
    }

    return NextResponse.json(toolUse.input);
  } catch (err) {
    console.error("Rapor API error:", err);
    return NextResponse.json({ error: "Rapor oluşturulamadı", detail: String(err) }, { status: 500 });
  }
}
