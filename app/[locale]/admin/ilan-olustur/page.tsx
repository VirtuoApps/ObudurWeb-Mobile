import { unstable_noStore as noStore } from "next/cache";
import Header from "../Header/Header";
import CreationSteps from "./CreationSteps/CreationSteps";

export default async function AdminHome() {
  // Disable caching at the page level
  noStore();

  return (
    <>
      <Header />
      <CreationSteps />
    </>
  );
}
