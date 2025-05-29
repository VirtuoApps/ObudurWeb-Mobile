import { unstable_noStore as noStore } from "next/cache";
import { Feature } from "@/types/feature.type";
import { Hotel } from "@/types/hotel.type";
import { FilterOptions } from "@/types/filter-options.type";
import HomePage from "@/app/HomePage/HomePage";
import axiosInstance from "@/axios";

export default async function kiralik() {
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
        isDefaultRent={true}
      />
    </>
  );
}
