import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from ".";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the locale is supported
  const validLocale = locales.includes(locale as any) ? locale : defaultLocale;

  return {
    messages: (await import(`../../languages/${validLocale}.json`)).default,
    locale: validLocale as string,
  };
});
