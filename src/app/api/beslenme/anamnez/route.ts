import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

function extractJSON(text: string): unknown {
  // Önce ```json ... ``` bloğunu dene
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) return JSON.parse(codeBlock[1].trim());
  // Sonra ilk { ... } bloğunu dene
  const braceMatch = text.match(/\{[\s\S]*\}/);
  if (braceMatch) return JSON.parse(braceMatch[0]);
  return JSON.parse(text);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { analizSonucu, hedef } = body;

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemPrompt = `Sen Türkiye'de çalışan uzman bir diyetisyen ve sporcu beslenmesi uzmanısın. Klinik beslenme anamnezi konusunda deneyimlisin. Yanıtını her zaman geçerli JSON formatında ver, başka hiçbir metin ekleme.`;

  const userMessage = `Beslenme anamnez formu oluştur. Kullanıcı hedefi: ${hedef}

Riskli alanlar: ${JSON.stringify((analizSonucu as {oncelikliMudahale?: string[]})?.oncelikliMudahale || [])}

TAM OLARAK 5 kategori, her kategoride TAM OLARAK 3 soru. Toplam 15 soru.

Kategoriler: Beslenme Alışkanlıkları, Sindirim ve Uyku, Su ve Takviye, Sağlık Geçmişi, Günlük Rutin

YALNIZCA geçerli JSON döndür:
{"kategoriler":[{"baslik":"string","sorular":[{"id":"k1s1","soru":"string","tip":"radio","secenekler":["A","B","C"],"zorunlu":true}]}]}

Kurallar: id benzersiz olsun (k1s1, k1s2 gibi), text/number tipinde secenekler:[] olsun, her kategoride tam 3 soru olsun.`;

  try {
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

    const parsed = extractJSON(content.text);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Anamnez API error:", err);
    return NextResponse.json({ error: "Yanıt işlenemedi", detail: String(err) }, { status: 500 });
  }
}
