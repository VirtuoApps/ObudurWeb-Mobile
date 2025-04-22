import { NextIntlClientProvider } from "next-intl";
import { Geist_Mono } from "next/font/google";
import "../globals.css";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      <body className={`${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
