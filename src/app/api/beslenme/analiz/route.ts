import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";
import { join } from "path";

function loadKnowledge(file: string): string {
  try {
    return readFileSync(join(process.cwd(), "data/knowledge", file), "utf-8");
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { olcumler, hedef } = body;

  const tuber = loadKnowledge("tuber-rehberi.txt");
  const eksiklikler = loadKnowledge("eksiklikler.txt");

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemPrompt = `Sen Türkiye'de çalışan uzman bir diyetisyen ve sporcu beslenmesi uzmanısın. Türk mutfağını, Türkiye'deki yaygın besin eksikliklerini (D vitamini, B12, demir, magnezyum) ve TÜBER beslenme rehberini biliyorsun. Verilen ölçüm değerlerini Türkiye sağlık bakanlığı ve WHO referans aralıklarıyla karşılaştır. Türkçe yanıt ver.

TÜBER Referans Değerleri:
${tuber}

Türkiye'de Yaygın Eksiklikler:
${eksiklikler}`;

  const userMessage = `Kullanıcının vücut ölçüm verileri ve hedefi aşağıdadır. Her değeri referans aralıkla karşılaştır, riskli alanları tespit et ve kısa bir genel değerlendirme yaz.

Ölçüm verileri:
${JSON.stringify(olcumler, null, 2)}

Kullanıcı hedefi: ${hedef}

Yanıtını SADECE şu JSON formatında ver (başka hiçbir şey yazma):
{
  "genelDegerlendirme": "2-3 cümle genel özet",
  "degerler": [
    {
      "ad": "değer adı",
      "deger": "kullanıcının değeri",
      "referans": "normal aralık",
      "durum": "normal|dikkat|risk",
      "yorum": "kısa yorum"
    }
  ],
  "oncelikliMudahale": ["madde1", "madde2", "madde3"],
  "gucluyonler": ["madde1", "madde2"]
}`;

  const message = await client.messages.create({
    model: "claude-opus-4-5",
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
    console.error("Analiz API error:", err);
    return NextResponse.json({ error: "Yanıt işlenemedi", detail: String(err) }, { status: 500 });
  }
}
