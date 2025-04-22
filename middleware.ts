import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // A list of all locales that are supported
  locales: ["en", "tr"],

  // If this locale is matched, pathname will remain unchanged
  defaultLocale: "en",

  // Paths that don't require locale detection
  localePrefix: "as-needed",
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
