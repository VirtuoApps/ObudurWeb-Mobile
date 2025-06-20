import { Metadata } from "next";
import "./globals.css";
import AuthCheck from "./components/AuthCheck/AuthCheck";
import { ReduxProvider } from "./providers/ReduxProvider";
import SignupEmailVerifySendPopup from "./components/SignupEMailVerifySendPopup/SignupEmailVerifySendPopup";

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
