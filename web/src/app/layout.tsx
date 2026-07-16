import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import { SiteShell } from "@/components/navigation/site-shell";
import { Analytics } from "@/components/platform/analytics";
import "./globals.css";

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Bricolage_Grotesque({
  variable: "--font-display-family",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://promogamesbr.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PromoGames — notícias, análises e promoções",
    template: "%s | PromoGames",
  },
  description:
    "Notícias, análises, guias e promoções para quem vive PlayStation, Xbox, Nintendo e PC.",
  applicationName: "PromoGames",
  creator: "PromoGames",
  publisher: "PromoGames",
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "PromoGames",
    title: "PromoGames — notícias, análises e promoções",
    description: "Notícias, análises, guias e promoções para quem vive videogames.",
    url: "/",
  },
  twitter: { card: "summary_large_image", site: "@PromoGamesBR" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <SiteShell>
          <main id="conteudo">{children}</main>
        </SiteShell>
        <Analytics />
      </body>
    </html>
  );
}
