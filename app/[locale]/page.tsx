import { Feature } from "@/types/feature.type";
import { FilterOptions } from "@/types/filter-options.type";
import HomePage from "../HomePage/HomePage";
import { Hotel } from "@/types/hotel.type";
import axiosInstance from "../../axios";
import { unstable_noStore as noStore } from "next/cache";

export default async function Home() {
  // Disable caching at the page level
  noStore();

  const allFeaturesResponse = await axiosInstance.get("/features/all-options");

  const features = allFeaturesResponse.data as Feature[];

  const hotelsResponse = await axiosInstance.get("/hotels");

  const hotels = hotelsResponse.data as Hotel[];

  const filterOptionsResponse = await axiosInstance.get(
    "/hotels/filter-options"
  );

  const allQuickFiltersResponse = await axiosInstance.get(
    "/features/all-quick-filters"
  );

  const filterOptions = filterOptionsResponse.data as FilterOptions;

  return (
    <>
      <HomePage
        features={features}
        hotels={hotels}
        filterOptions={filterOptions}
        allQuickFilters={allQuickFiltersResponse.data as Feature[]}
        isDefaultSale={false}
      />
    </>
  );
}
