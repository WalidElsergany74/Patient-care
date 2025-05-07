// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Cairo, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

import { Locale } from "@/i18n.config";
import NextAuthSessionProvider from "@/providers/NextAuthSessionProvider";
import { Directions, Languages } from "@/constants";


export async function generateStaticParams() {
  return [{ locale: Languages.ARABIC }, { locale: Languages.ENGLISH }];
}

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "700", "800"],
  subsets: ["latin"],
});

const cairo = Cairo({
  weight: ["400", "500", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PatientCare",
    template: "PatientCare - %s",
  },
  description:
    "Easily book medical appointments with top doctors through the PatientCare platform.",
};


export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const locale = (await params).locale;

  return (
    <html
      lang={locale}
      dir={locale === Languages.ARABIC ? Directions.RTL : Directions.LTR}
    >
      <body
        className={`bg-white ${
          locale === Languages.ARABIC ? cairo.className : poppins.className
        }`}
      >
        <NextAuthSessionProvider>
          <Toaster position="top-right" />
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
