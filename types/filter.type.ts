export type FilterType = {
  listingType: string | null;
  state: string | null;
  propertyType: string | null;
  roomAsText: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  roomCount?: number | null;
  bathroomCount?: number | null;
  minProjectArea?: number | null;
  maxProjectArea?: number | null;
};
