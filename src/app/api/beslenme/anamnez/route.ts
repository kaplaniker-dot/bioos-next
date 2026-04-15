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
  const { analizSonucu, hedef } = body;

  const tuber = loadKnowledge("tuber-rehberi.txt");

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemPrompt = `Sen Türkiye'de çalışan uzman bir diyetisyen ve sporcu beslenmesi uzmanısın. Klinik beslenme anamnezi konusunda deneyimlisin. Türkçe yanıt ver.

TÜBER Referans Değerleri (bağlam için):
${tuber}`;

  const userMessage = `Aşağıdaki kişinin ölçüm analiz sonuçlarına göre ona özel bir beslenme anamnez formu oluştur.

Analiz sonucu:
${JSON.stringify(analizSonucu, null, 2)}

Kullanıcı hedefi: ${hedef}

Form şu kategorileri içersin: beslenme alışkanlıkları, sindirim sistemi, uyku, stres, su tüketimi, takviye kullanımı, geçmiş hastalıklar, ilaç kullanımı, besin alerjileri ve intoleransları, günlük rutin. Ölçüm sonuçlarındaki riskli alanlara göre ek sorular ekle. Sorular profesyonel ve klinik düzeyde olsun.

Yanıtını SADECE şu JSON formatında ver:
{
  "kategoriler": [
    {
      "baslik": "Kategori Adı",
      "sorular": [
        {
          "id": "benzersiz_id",
          "soru": "Soru metni?",
          "tip": "text|radio|checkbox|number|select",
          "secenekler": ["seçenek1", "seçenek2"],
          "zorunlu": true
        }
      ]
    }
  ]
}

"tip" açıklaması:
- "text": Açık metin cevabı
- "radio": Tek seçim (secenekler zorunlu)
- "checkbox": Çoklu seçim (secenekler zorunlu)
- "number": Sayısal değer
- "select": Dropdown seçim (secenekler zorunlu)
"secenekler" sadece radio, checkbox ve select tiplerinde kullan, text ve number için boş dizi [].`;

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 4000,
    messages: [{ role: "user", content: userMessage }],
    system: systemPrompt,
  });

  const content = message.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ error: "Yanıt alınamadı" }, { status: 500 });
  }

  try {
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content.text);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Yanıt işlenemedi", raw: content.text }, { status: 500 });
  }
}
