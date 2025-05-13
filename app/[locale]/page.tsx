import HomePage from "../HomePage/HomePage";
import axiosInstance from "../../axios";
import { unstable_noStore as noStore } from "next/cache";
import { Feature } from "@/types/feature.type";
import { Hotel } from "@/types/hotel.type";

export default async function Home() {
  // Disable caching at the page level
  noStore();

  const featuresResponse = await axiosInstance.get("/features/general");

  const features = featuresResponse.data as Feature[];

  const hotelsResponse = await axiosInstance.get("/hotels");

  const hotels = hotelsResponse.data as Hotel[];

  return (
    <>
      <HomePage features={features} hotels={hotels} />
    </>
  );
}
