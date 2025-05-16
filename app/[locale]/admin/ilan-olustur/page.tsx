import { unstable_noStore as noStore } from "next/cache";
import Header from "../Header/Header";

export default async function AdminHome() {
  // Disable caching at the page level
  noStore();

  return (
    <>
      <Header />
    </>
  );
}
