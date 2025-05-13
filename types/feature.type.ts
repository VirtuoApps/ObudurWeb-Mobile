export interface FeatureName {
  tr: string;
  en: string;
}

export type FeatureCategory = "general" | "outside" | "inside";

export interface Feature {
  _id: string;
  name: FeatureName;
  iconUrl: string;
  featureType: FeatureCategory;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
