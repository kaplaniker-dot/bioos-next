import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { olcumler, analizSonucu, anamnezCevaplari, hedef } = body;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemPrompt = `Sen Türkiye'de çalışan uzman bir diyetisyen ve sporcu beslenmesi uzmanısın. Türk mutfağını, TÜBER beslenme rehberini ve Türkiye'deki yaygın eksiklikleri (D vitamini, B12, demir, magnezyum) biliyorsun. Yanıtını her zaman geçerli JSON formatında ver, başka metin ekleme. Türkçe yanıt ver.`;

  const userMessage = `Beslenme raporu oluştur. Hedef: ${hedef}

Ölçümler: ${JSON.stringify(olcumler)}
Analiz: ${JSON.stringify(analizSonucu)}
Anamnez: ${JSON.stringify(anamnezCevaplari)}

YALNIZCA bu JSON'u döndür, kısa tut (her string max 80 karakter, her array max 3 eleman):
{"kisiBilgisi":{"ozet":"string","gucluYonler":["a","b"],"riskler":["a","b"],"oncelikliMudahale":["a","b","c"]},"enerjiHedefi":{"bmr":0,"tdee":0,"gunlukKalori":0,"aciklama":"string"},"makroDagilimi":{"protein":{"gram":0,"yuzde":0,"aciklama":"string"},"karbonhidrat":{"gram":0,"yuzde":0,"aciklama":"string"},"yag":{"gram":0,"yuzde":0,"aciklama":"string"}},"kritikMikroBesinler":[{"ad":"string","oncelik":"yuksek","neden":"string","gunlukHedef":"string","kaynaklar":["a","b"],"takviyeOneri":"string"}],"kacinilacakBesinler":[{"besin":"string","neden":"string"}],"turkMutfagiOnerileri":[{"yemek":"string","neden":"string","sıklık":"string"}],"pratikIpuclari":["a","b","c"]}`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2000,
    messages: [{ role: "user", content: userMessage }],
    system: systemPrompt,
  });

  const content = message.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ error: "Yanıt alınamadı" }, { status: 500 });
  }

  try {
    const codeBlock = content.text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = codeBlock ? codeBlock[1].trim() : content.text.match(/\{[\s\S]*\}/)?.[0] || content.text;
    const parsed = JSON.parse(jsonStr);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Degerlendirme API error:", err);
    return NextResponse.json({ error: "Yanıt işlenemedi", detail: String(err) }, { status: 500 });
  }
}
