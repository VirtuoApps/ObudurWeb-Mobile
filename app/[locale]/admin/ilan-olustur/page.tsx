import CreationSteps from "./CreationSteps/CreationSteps";
import Header from "../Header/Header";
import SimpleHeader from "@/app/components/SimpleHeader/SimpleHeader";
import { unstable_noStore as noStore } from "next/cache";

export default async function AdminHome() {
  // Disable caching at the page level
  noStore();

  return (
    <>
      <SimpleHeader />
      <CreationSteps />
    </>
  );
}
