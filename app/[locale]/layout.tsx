import "../globals.css";
import "../components/nprogress/nprogress.css";

import { Geist_Mono, Kumbh_Sans } from "next/font/google";

import FavoritesProvider from "../providers/FavoritesProvider";
import { GoogleMapsProvider } from "../contexts/GoogleMapsContext";
import { NProgressProvider } from "../components/nprogress";
import { NextIntlClientProvider } from "next-intl";
import { ReduxProvider } from "../providers/ReduxProvider";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kumbhSans = Kumbh_Sans({
  variable: "--font-kumbh-sans",
  subsets: ["latin"],
});

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;

  const t = await getTranslations({ locale, namespace: "header" });

  return {
    title: t("title"),
    description: "Multi-language property search",
    viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no",
    other: {
      'format-detection': 'telephone=no',
      'msapplication-tap-highlight': 'no',
    }
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale;

  let messages;

  try {
    messages = (await import(`../../languages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css"
          rel="stylesheet"
          type="text/css"
        />
      </head>
      <body
        className={`${geistMono.variable} ${kumbhSans.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ReduxProvider>
            <FavoritesProvider>
              <GoogleMapsProvider>
                {children}
                <NProgressProvider />
              </GoogleMapsProvider>
            </FavoritesProvider>
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
