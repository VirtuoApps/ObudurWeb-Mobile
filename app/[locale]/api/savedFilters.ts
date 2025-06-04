import axiosInstance from "@/axios";

export interface Feature {
  _id: string;
  name: string;
  iconUrl: string;
  featureType: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Location {
  name: string;
  description: string;
  coordinates: [number, number];
}

export interface SavedFilter {
  _id?: string;
  filterName: string;
  userId: string;
  enableNotifications: boolean;
  enableMailNotifications: boolean;
  listingType: string | null;
  state: string | null;
  propertyType: string | null;
  propertyTypeId: string | null;
  roomAsText: string | null;
  categoryId: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  roomCount: number | null;
  bathroomCount: number | null;
  minProjectArea: number | null;
  maxProjectArea: number | null;
  interiorFeatureIds: string[] | null;
  exteriorFeatureIds: string[] | null;
  accessibilityFeatureIds: string[] | null;
  faceFeatureIds: string[] | null;
  locationFeatureIds: string[] | null;
  isNewSelected: boolean | null;
  isOnePlusOneSelected: boolean | null;
  isTwoPlusOneSelected: boolean | null;
  isThreePlusOneSelected: boolean | null;
  selectedFeatures: Feature[];
  selectedLocation: Location | null;
  createdAt?: string;
  updatedAt?: string;
  resultCount: number;
}

export const savedFiltersApi = {
  getMySavedFilters: async (): Promise<SavedFilter[]> => {
    try {
      const response = await axiosInstance.get<SavedFilter[]>(
        "/saved-filters/mine"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching saved filters:", error);
      throw error;
    }
  },

  updateSavedFilter: async (
    filterId: string,
    updateData: any
  ): Promise<SavedFilter> => {
    try {
      const response = await axiosInstance.patch<SavedFilter>(
        `/saved-filters/mine/${filterId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating saved filter:", error);
      throw error;
    }
  },

  deleteSavedFilter: async (filterId: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/saved-filters/mine/${filterId}`);
    } catch (error) {
      console.error("Error deleting saved filter:", error);
      throw error;
    }
  },
};
