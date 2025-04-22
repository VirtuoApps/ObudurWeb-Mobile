import { redirect } from "next/navigation";
import Image from "next/image";
import HomePage from "./HomePage/HomePage";

// Default home page redirects to the default locale
export default function Home() {
  redirect("/en");
}
