import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/context/ModalContext";
import WaitlistModal from "@/components/WaitlistModal";
import PostHogProvider from "@/components/PostHogProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Suspense } from "react";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = "https://bioos-p719odc5s-kaplaniker-4437s-projects.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BioOS — Biyolojini Optimize Et",
    template: "%s | BioOS",
  },
  description:
    "Kan tahlilinden beslenme planına, egzersizden uzun ömre — yapay zeka ile kişiselleştirilmiş sağlık optimizasyonu. Tüm veriler birbiriyle konuşur.",
  keywords: [
    "sağlık optimizasyonu",
    "kan tahlili analizi",
    "yapay zeka sağlık",
    "beslenme planı",
    "biyobelirteç",
    "longevity",
    "biohacking",
    "kişisel sağlık",
    "BioOS",
  ],
  authors: [{ name: "BioOS" }],
  creator: "BioOS",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: "BioOS",
    title: "BioOS — Biyolojini Optimize Et",
    description:
      "Kan tahlilinden beslenme planına, egzersizden uzun ömre — yapay zeka ile kişiselleştirilmiş sağlık optimizasyonu.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BioOS — Biyolojik İşletim Sistemi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BioOS — Biyolojini Optimize Et",
    description:
      "Kan tahlilinden beslenme planına, egzersizden uzun ömre — yapay zeka ile kişiselleştirilmiş sağlık optimizasyonu.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <ClerkProvider>
          <Suspense>
            <PostHogProvider>
              <ModalProvider>
                {children}
                <WaitlistModal />
              </ModalProvider>
            </PostHogProvider>
          </Suspense>
        </ClerkProvider>
      </body>
    </html>
  );
}
