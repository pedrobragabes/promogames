import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import { SiteShell } from "@/components/navigation/site-shell";
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
      </body>
    </html>
  );
}
