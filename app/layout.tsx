import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import Providers from "./providers";
import { LanguageProvider } from "@/components/language-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Divyajyoti | Astrology, Property, ONLINE SHOPPING & Business",
  description:
    "Divyajyoti brings astrology, learning, property and private business services together in one simple experience.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <LanguageProvider>
            <SiteHeader />

            {children}

            <SiteFooter />
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}