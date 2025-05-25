export interface LocalizedText {
  tr: string;
  en: string;
}

export interface Location {
  country: LocalizedText;
  cities: LocalizedText[];
  states?: LocalizedText[];
}

export interface StateInfo {
  tr: string;
  en: string;
  cityOfTheState: LocalizedText;
  countryOfTheState: LocalizedText;
}

export interface Feature {
  _id: string;
  name: LocalizedText;
  iconUrl: string;
  featureType: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FilterOptions {
  city: LocalizedText[];
  country: LocalizedText[];
  housingType: LocalizedText[];
  floorType: LocalizedText[];
  roomAsText: string[];
  locations: Location[];
  state: StateInfo[];
  roomCount: number[];
  bathroomCount: number[];
  interiorFeatures: Feature[];
  outsideFeatures: Feature[];
  generalFeatures: Feature[];
  accessibilityFeatures: Feature[];
}
