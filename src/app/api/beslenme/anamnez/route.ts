import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

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

  const userMessage = `Aşağıdaki ölçüm analiz sonuçlarına göre kişiye özel beslenme anamnez formu oluştur.

Analiz sonucu:
${JSON.stringify(analizSonucu, null, 2)}

Kullanıcı hedefi: ${hedef}

Kategoriler: beslenme alışkanlıkları, sindirim sistemi, uyku, stres, su tüketimi, takviye kullanımı, geçmiş hastalıklar, ilaç kullanımı, besin alerjileri, günlük rutin. Riskli alanlara göre ek sorular ekle.

Yanıtını YALNIZCA bu JSON formatında ver, markdown veya açıklama ekleme:
{"kategoriler":[{"baslik":"string","sorular":[{"id":"string","soru":"string","tip":"text|radio|checkbox|number|select","secenekler":[],"zorunlu":true}]}]}

Her kategoride 3-5 soru olsun. text ve number tipinde secenekler boş dizi [] olsun.`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4000,
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
