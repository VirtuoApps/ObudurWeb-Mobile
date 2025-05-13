import { Metadata } from "next";
import "./globals.css";
import AuthCheck from "./components/AuthCheck/AuthCheck";
import { ReduxProvider } from "./providers/ReduxProvider";

export const metadata: Metadata = {
  title: "oBudur Website",
  description: "Find your place with oBudur",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The root layout should only pass children down
  // The html and body tags are handled by the locale layout
  return (
    <ReduxProvider>
      <AuthCheck />
      {children}
    </ReduxProvider>
  );
}
