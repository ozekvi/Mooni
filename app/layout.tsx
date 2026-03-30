import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cinzel, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300","400","500","600","700","800"],
  variable: "--font-plus",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400","600","700","800","900"],
  variable: "--font-cinzel",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400","500","600","700"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mooni Services — Rise of Kingdoms",
  description: "Premium Rise of Kingdoms services. Fog exploring, gem farming",
  keywords: ["Rise of Kingdoms", "RoK services", "Fog exploring", "gems farming", "mooni"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "Mooni Services",
    description: "Premium Rise of Kingdoms services",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakarta.variable} ${cinzel.variable} ${spaceGrotesk.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
