"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import FirstCreateStep from "./FirstCreateStep/FirstCreateStep";
import SecondCreateStep from "./SecondCreateStep/SecondCreateStep";
import ThirdCreateStep from "./ThirdCreateStep/ThirdCreateStep";
import FourthCreateStep from "./FourthCreateStep/FourthCreateStep";
import FifthCreateStep from "./FifthCreateStep/FifthCreateStep";

// Define the multilingual text interface
export interface MultilangText {
  [key: string]: string;
}

// Define the hotel data interface
export interface HotelData {
  _id: string;
  no: number;
  face: string;
  slug: string;
  title: MultilangText;
  description: MultilangText;
  country: MultilangText;
  city: MultilangText;
  state: MultilangText;
  street: MultilangText;
  buildingNo: string;
  apartmentNo: string;
  postalCode: string;
  floorCount: number;
  price: { amount: number; currency: string }[];
  images: string[];
  roomAsText: string;
  projectArea: number;
  totalSize: number;
  buildYear: number;
  kitchenType: MultilangText;
  roomCount: number;
  bathroomCount: number;
  balconyCount: number;
  bedRoomCount: number;
  housingType: MultilangText;
  entranceType: MultilangText;
  listingType: MultilangText;
  featureIds: string[];
  distances: { typeId: string; value: number }[];
  location: {
    type: string;
    coordinates: [number, number];
  };
  documents: string[];
  video: string;
}

// Define the context type
type ListingFormContextType = {
  listingType: MultilangText;
  setListingType: React.Dispatch<React.SetStateAction<MultilangText>>;
  entranceType: MultilangText;
  setEntranceType: React.Dispatch<React.SetStateAction<MultilangText>>;
  housingType: MultilangText;
  setHousingType: React.Dispatch<React.SetStateAction<MultilangText>>;
  title: MultilangText;
  setTitle: React.Dispatch<React.SetStateAction<MultilangText>>;
  description: MultilangText;
  setDescription: React.Dispatch<React.SetStateAction<MultilangText>>;
  price: { amount: number; currency: string }[];
  setPrice: React.Dispatch<
    React.SetStateAction<{ amount: number; currency: string }[]>
  >;
  projectArea: number;
  setProjectArea: React.Dispatch<React.SetStateAction<number>>;
  totalSize: number;
  setTotalSize: React.Dispatch<React.SetStateAction<number>>;
  roomCount: number;
  setRoomCount: React.Dispatch<React.SetStateAction<number>>;
  bathroomCount: number;
  setBathroomCount: React.Dispatch<React.SetStateAction<number>>;
  bedRoomCount: number;
  setBedRoomCount: React.Dispatch<React.SetStateAction<number>>;
  floorCount: number;
  setFloorCount: React.Dispatch<React.SetStateAction<number>>;
  buildYear: number;
  setBuildYear: React.Dispatch<React.SetStateAction<number>>;
  kitchenType: MultilangText;
  setKitchenType: React.Dispatch<React.SetStateAction<MultilangText>>;
  // Orientation (facade)
  orientation: string;
  setOrientation: React.Dispatch<React.SetStateAction<string>>;
  // Address fields
  country: MultilangText;
  setCountry: React.Dispatch<React.SetStateAction<MultilangText>>;
  city: MultilangText;
  setCity: React.Dispatch<React.SetStateAction<MultilangText>>;
  state: MultilangText;
  setState: React.Dispatch<React.SetStateAction<MultilangText>>;
  street: MultilangText;
  setStreet: React.Dispatch<React.SetStateAction<MultilangText>>;
  buildingNo: string;
  setBuildingNo: React.Dispatch<React.SetStateAction<string>>;
  apartmentNo: string;
  setApartmentNo: React.Dispatch<React.SetStateAction<string>>;
  postalCode: string;
  setPostalCode: React.Dispatch<React.SetStateAction<string>>;
  coordinates: [number, number];
  setCoordinates: React.Dispatch<React.SetStateAction<[number, number]>>;
  // Feature IDs
  featureIds: string[];
  setFeatureIds: React.Dispatch<React.SetStateAction<string[]>>;
  // Distances
  distances: { typeId: string; value: number }[];
  setDistances: React.Dispatch<
    React.SetStateAction<{ typeId: string; value: number }[]>
  >;
  // Distance editing
  newDistanceTypeId: string;
  setNewDistanceTypeId: React.Dispatch<React.SetStateAction<string>>;
  newDistanceValue: string;
  setNewDistanceValue: React.Dispatch<React.SetStateAction<string>>;
  editingDistanceId: string | null;
  setEditingDistanceId: React.Dispatch<React.SetStateAction<string | null>>;
  editingDistanceValue: string;
  setEditingDistanceValue: React.Dispatch<React.SetStateAction<string>>;
  // Images and video fields
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  video: string;
  setVideo: React.Dispatch<React.SetStateAction<string>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  // Update mode
  isUpdate: boolean;
  hotelId: string | null;
};

// Create the context with default values
export const ListingFormContext = createContext<ListingFormContextType>({
  listingType: { tr: "Satılık", en: "For Sale" },
  setListingType: () => {},
  entranceType: { tr: "Ev", en: "House" },
  setEntranceType: () => {},
  housingType: { tr: "Villa", en: "Villa" },
  setHousingType: () => {},
  title: { tr: "", en: "" },
  setTitle: () => {},
  description: { tr: "", en: "" },
  setDescription: () => {},
  price: [],
  setPrice: () => {},
  projectArea: 0,
  setProjectArea: () => {},
  totalSize: 0,
  setTotalSize: () => {},
  roomCount: 0,
  setRoomCount: () => {},
  bathroomCount: 0,
  setBathroomCount: () => {},
  bedRoomCount: 0,
  setBedRoomCount: () => {},
  floorCount: 0,
  setFloorCount: () => {},
  buildYear: 0,
  setBuildYear: () => {},
  kitchenType: { tr: "", en: "" },
  setKitchenType: () => {},
  // Orientation
  orientation: "",
  setOrientation: () => {},
  // Address fields defaults
  country: { tr: "", en: "" },
  setCountry: () => {},
  city: { tr: "", en: "" },
  setCity: () => {},
  state: { tr: "", en: "" },
  setState: () => {},
  street: { tr: "", en: "" },
  setStreet: () => {},
  buildingNo: "",
  setBuildingNo: () => {},
  apartmentNo: "",
  setApartmentNo: () => {},
  postalCode: "",
  setPostalCode: () => {},
  coordinates: [30.805, 36.855],
  setCoordinates: () => {},
  // Feature IDs default
  featureIds: [],
  setFeatureIds: () => {},
  // Distances default
  distances: [],
  setDistances: () => {},
  // Distance editing default
  newDistanceTypeId: "",
  setNewDistanceTypeId: () => {},
  newDistanceValue: "",
  setNewDistanceValue: () => {},
  editingDistanceId: null,
  setEditingDistanceId: () => {},
  editingDistanceValue: "",
  setEditingDistanceValue: () => {},
  // Images and video fields default
  images: [],
  setImages: () => {},
  video: "",
  setVideo: () => {},
  currentStep: 1,
  setCurrentStep: () => {},
  // Update mode defaults
  isUpdate: false,
  hotelId: null,
});

// Custom hook to use the context
export const useListingForm = () => useContext(ListingFormContext);

interface CreationStepsProps {
  isUpdate?: boolean;
  hotelData?: HotelData;
}

export default function CreationSteps({
  isUpdate = false,
  hotelData,
}: CreationStepsProps) {
  // All form states moved from FirstCreateStep
  const [listingType, setListingType] = useState<MultilangText>({
    tr: "Satılık",
    en: "For Sale",
  });
  const [entranceType, setEntranceType] = useState<MultilangText>({
    tr: "Ev",
    en: "House",
  });
  const [housingType, setHousingType] = useState<MultilangText>({
    tr: "Villa",
    en: "Villa",
  });
  const [title, setTitle] = useState<MultilangText>({
    tr: "",
    en: "",
  });
  const [description, setDescription] = useState<MultilangText>({
    tr: "",
    en: "",
  });

  // New state for SecondCreateStep
  const [price, setPrice] = useState<{ amount: number; currency: string }[]>(
    []
  );
  const [projectArea, setProjectArea] = useState<number>(0);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [roomCount, setRoomCount] = useState<number>(0);
  const [bathroomCount, setBathroomCount] = useState<number>(0);
  const [bedRoomCount, setBedRoomCount] = useState<number>(0);
  const [floorCount, setFloorCount] = useState<number>(0);
  const [buildYear, setBuildYear] = useState<number>(0);
  const [kitchenType, setKitchenType] = useState<MultilangText>({
    tr: "",
    en: "",
  });

  // New state for ThirdCreateStep - Address fields
  const [country, setCountry] = useState<MultilangText>({ tr: "", en: "" });
  const [city, setCity] = useState<MultilangText>({ tr: "", en: "" });
  const [state, setState] = useState<MultilangText>({ tr: "", en: "" });
  const [street, setStreet] = useState<MultilangText>({ tr: "", en: "" });
  const [buildingNo, setBuildingNo] = useState<string>("");
  const [apartmentNo, setApartmentNo] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [coordinates, setCoordinates] = useState<[number, number]>([
    30.805, 36.855,
  ]); // [long, lat] format

  // New state for FourthCreateStep - Features
  const [featureIds, setFeatureIds] = useState<string[]>([]);

  // New state for FourthCreateStep - Distances
  const [distances, setDistances] = useState<
    { typeId: string; value: number }[]
  >([]);

  // New state for FourthCreateStep - Distance editing
  const [newDistanceTypeId, setNewDistanceTypeId] = useState<string>("");
  const [newDistanceValue, setNewDistanceValue] = useState<string>("");
  const [editingDistanceId, setEditingDistanceId] = useState<string | null>(
    null
  );
  const [editingDistanceValue, setEditingDistanceValue] = useState<string>("");

  const [currentStep, setCurrentStep] = useState(1);

  // Orientation state
  const [orientation, setOrientation] = useState<string>("");

  // Images and video states
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string>("");

  // Set hotelId from hotelData if in update mode
  const hotelId = isUpdate && hotelData ? hotelData._id : null;

  // Effect to initialize form with hotel data when in update mode
  useEffect(() => {
    if (isUpdate && hotelData) {
      // First step data
      setListingType(hotelData.listingType);
      setEntranceType(hotelData.entranceType);
      setHousingType(hotelData.housingType);
      setTitle(hotelData.title);
      setDescription(hotelData.description);

      // Second step data
      setPrice(hotelData.price);
      setProjectArea(hotelData.projectArea);
      setTotalSize(hotelData.totalSize);
      setRoomCount(hotelData.roomCount);
      setBathroomCount(hotelData.bathroomCount);
      setBedRoomCount(hotelData.bedRoomCount);
      setFloorCount(hotelData.floorCount);
      setBuildYear(hotelData.buildYear);
      setKitchenType(hotelData.kitchenType);

      // Set orientation (face)
      setOrientation(hotelData.face);

      // Third step data - Address
      setCountry(hotelData.country);
      setCity(hotelData.city);
      setState(hotelData.state);
      setStreet(hotelData.street);
      setBuildingNo(hotelData.buildingNo);
      setApartmentNo(hotelData.apartmentNo);
      setPostalCode(hotelData.postalCode);

      // Set coordinates if available
      if (hotelData.location && hotelData.location.coordinates) {
        setCoordinates(hotelData.location.coordinates as [number, number]);
      }

      // Fourth step data
      setFeatureIds(hotelData.featureIds);
      setDistances(hotelData.distances);

      // Fifth step data
      setImages(hotelData.images);
      setVideo(hotelData.video);
    }
  }, [isUpdate, hotelData]);

  // Context value
  const contextValue = {
    listingType,
    setListingType,
    entranceType,
    setEntranceType,
    housingType,
    setHousingType,
    title,
    setTitle,
    description,
    setDescription,
    price,
    setPrice,
    projectArea,
    setProjectArea,
    totalSize,
    setTotalSize,
    roomCount,
    setRoomCount,
    bathroomCount,
    setBathroomCount,
    bedRoomCount,
    setBedRoomCount,
    floorCount,
    setFloorCount,
    buildYear,
    setBuildYear,
    kitchenType,
    setKitchenType,
    // Orientation
    orientation,
    setOrientation,
    // Address fields
    country,
    setCountry,
    city,
    setCity,
    state,
    setState,
    street,
    setStreet,
    buildingNo,
    setBuildingNo,
    apartmentNo,
    setApartmentNo,
    postalCode,
    setPostalCode,
    coordinates,
    setCoordinates,
    // Feature IDs
    featureIds,
    setFeatureIds,
    // Distances
    distances,
    setDistances,
    // Distance editing
    newDistanceTypeId,
    setNewDistanceTypeId,
    newDistanceValue,
    setNewDistanceValue,
    editingDistanceId,
    setEditingDistanceId,
    editingDistanceValue,
    setEditingDistanceValue,
    // Images and video fields
    images,
    setImages,
    video,
    setVideo,
    currentStep,
    setCurrentStep,
    // Update mode
    isUpdate,
    hotelId,
  };

  return (
    <ListingFormContext.Provider value={contextValue}>
      {currentStep === 1 && <FirstCreateStep />}
      {currentStep === 2 && <SecondCreateStep />}
      {currentStep === 3 && <ThirdCreateStep />}
      {currentStep === 4 && <FourthCreateStep />}
      {currentStep === 5 && <FifthCreateStep />}
    </ListingFormContext.Provider>
  );
}
