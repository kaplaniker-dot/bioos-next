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
  const { olcumler, analizSonucu, anamnezCevaplari, hedef } = body;

  const tuber = loadKnowledge("tuber-rehberi.txt");
  const besinTablosu = loadKnowledge("besin-tablosu.txt");
  const eksiklikler = loadKnowledge("eksiklikler.txt");

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const systemPrompt = `Sen Türkiye'de çalışan uzman bir diyetisyen ve sporcu beslenmesi uzmanısın. Türk mutfağını, Türkiye'deki yaygın besin eksikliklerini ve TÜBER beslenme rehberini biliyorsun. Türkçe yanıt ver.

TÜBER Referans Değerleri:
${tuber}

Türkiye Besin Tablosu:
${besinTablosu}

Türkiye'de Yaygın Eksiklikler:
${eksiklikler}`;

  const userMessage = `Aşağıdaki verilere dayanarak bu kişi için kapsamlı bir beslenme değerlendirmesi ve kişisel plan oluştur.

Ölçüm verileri:
${JSON.stringify(olcumler, null, 2)}

Ölçüm analiz sonucu:
${JSON.stringify(analizSonucu, null, 2)}

Anamnez cevapları:
${JSON.stringify(anamnezCevaplari, null, 2)}

Kullanıcı hedefi: ${hedef}

Yanıtını SADECE şu JSON formatında ver:
{
  "kisiBilgisi": {
    "ozet": "2-3 cümle kişi profili özeti",
    "gucluYonler": ["madde1", "madde2"],
    "riskler": ["madde1", "madde2"],
    "oncelikliMudahale": ["madde1", "madde2", "madde3"]
  },
  "enerjiHedefi": {
    "bmr": 0,
    "tdee": 0,
    "gunlukKalori": 0,
    "aciklama": "hesaplama ve hedef açıklaması"
  },
  "makroDagilimi": {
    "protein": { "gram": 0, "yuzde": 0, "aciklama": "neden bu kadar" },
    "karbonhidrat": { "gram": 0, "yuzde": 0, "aciklama": "neden bu kadar" },
    "yag": { "gram": 0, "yuzde": 0, "aciklama": "neden bu kadar" }
  },
  "kritikMikroBesинler": [
    {
      "ad": "vitamin/mineral adı",
      "oncelik": "yuksek|orta|dusuk",
      "neden": "neden önemli, mevcut durumu",
      "gunlukHedef": "mg/mcg/IU miktarı",
      "kaynaklar": ["besin1", "besin2", "besin3"],
      "takviyeOneri": "gerekiyorsa takviye önerisi"
    }
  ],
  "kacinilacakBesinler": [
    {
      "besin": "besin adı",
      "neden": "kişiye özel neden"
    }
  ],
  "turkMutfagiOnerileri": [
    {
      "yemek": "yemek adı",
      "neden": "neden önerildiği",
      "sıklık": "haftada kaç kez"
    }
  ],
  "pratikIpuclari": ["ipucu1", "ipucu2", "ipucu3", "ipucu4", "ipucu5"]
}`;

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 6000,
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
