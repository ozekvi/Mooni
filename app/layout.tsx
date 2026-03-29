import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Mooni Services — Rise of Kingdoms",
  description: "Premium Rise of Kingdoms services. Power leveling, gem farming, alliance support and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Raleway:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "var(--font-raleway, 'Raleway', sans-serif)" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
