import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "waitlist.json");

function readList(): { email: string; date: string }[] {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(FILE_PATH)) return [];
    return JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function writeList(list: { email: string; date: string }[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(list, null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Geçerli bir email girin." }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalized)) {
      return NextResponse.json({ error: "Geçerli bir email girin." }, { status: 400 });
    }

    const list = readList();
    if (list.some((e) => e.email === normalized)) {
      return NextResponse.json({ message: "already_exists" }, { status: 200 });
    }

    list.push({ email: normalized, date: new Date().toISOString() });
    writeList(list);

    console.log(`[waitlist] New signup: ${normalized}`);
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (err) {
    console.error("[waitlist] Error:", err);
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}

export async function GET() {
  const list = readList();
  return NextResponse.json({ count: list.length, emails: list });
}
