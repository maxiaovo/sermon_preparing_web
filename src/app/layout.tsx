import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "小故事讲道预备 — 讲道预备助手",
  description: "小故事教会的AI引导讲道预备平台，通过智慧的提问帮助你深入思考神的话语。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-stone-50 text-stone-800 font-sans">
        {children}
        <footer className="text-center py-4 text-xs text-stone-400">
          小故事教会 · 开发者 游乐园司机
        </footer>
      </body>
    </html>
  );
}
