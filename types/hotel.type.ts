export interface MultilingualText {
  tr: string;
  en: string;
}

export interface Price {
  amount: number;
  currency: string;
}

export interface Distance {
  typeId: string;
  value: number;
}

export interface GeoPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface Hotel {
  _id: string;
  no: number;
  slug: string;
  title: MultilingualText;
  description: MultilingualText;
  address: MultilingualText;
  price: Price[];
  images: string[];
  roomAsText: string;
  projectArea: number;
  totalSize: number;
  buildYear: number;
  architect: string;
  kitchenType: MultilingualText;
  roomCount: number;
  bathroomCount: number;
  balconyCount: number;
  bedRoomCount: number;
  floorType: MultilingualText;
  housingType: MultilingualText;
  entranceType: MultilingualText;
  listingType: MultilingualText;
  featureIds: string[];
  face?: string;
  distances: Distance[];
  location: GeoPoint;
  city: MultilingualText;
  country: MultilingualText;
  state: MultilingualText;
  street: MultilingualText;
  buildingNo: string;
  apartmentNo: string;
  postalCode: string;
  documents: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
