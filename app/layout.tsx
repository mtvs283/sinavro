import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "시나브로",
  description: "단어 퍼즐게임",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
