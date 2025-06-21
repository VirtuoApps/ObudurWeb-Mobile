"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import FirstCreateStep from "./FirstCreateStep/FirstCreateStep";
import SecondCreateStep from "./SecondCreateStep/SecondCreateStep";
import ThirdCreateStep from "./ThirdCreateStep/ThirdCreateStep";
import FourthCreateStep from "./FourthCreateStep/FourthCreateStep";
import FifthCreateStep from "./FifthCreateStep/FifthCreateStep";
import SixthCreateStep from "./SixthCreateStep/SixthCreateStep";
import SecondCreateStepForHouse from "./SecondCreateStep/SecondCreateStepForHouse/SecondCreateStepForHouse";
import SecondCreateStepForWork from "./SecondCreateStep/SecondCreateStepForWork/SecondCreateStepForWork";
import SecondCreateStepForLand from "./SecondCreateStep/SecondCreateStepForLand/SecondCreateStepForLand";

// Define the multilingual text interface
export interface MultilangText {
  [key: string]: string;
}

// Define the hotel data interface
export interface HotelData {
  _id: string;
  no: number;
  faces: string[];
  slug: string;
  title: MultilangText;
  description: MultilangText;
  country: MultilangText;
  city: MultilangText;
  state: MultilangText;
  neighborhood?: MultilangText;
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
  // New fields
  exchangeable?: boolean;
  creditEligible?: boolean;
  buildingAge?: number;
  isFurnished?: boolean;
  dues?: { amount: number; currency: string }[];
  usageStatus?: MultilangText;
  deedStatus?: MultilangText;
  heatingType?: MultilangText;
  source?: MultilangText;
  generalFeatures?: MultilangText;
  zoningStatus?: MultilangText;
  featureIds: string[];
  infrastructureFeatureIds?: string[];
  viewIds?: string[];
  distances: { typeId: string; value: number }[];
  location: {
    type: string;
    coordinates: [number, number];
  };
  documents: { name: MultilangText; file: string }[];
  video: string;
  // Land specific fields
  adaNo?: string;
  parselNo?: string;
  // Floor position
  floorPosition?: MultilangText;
}

// Define the context type
type ListingFormContextType = {
  listingType: MultilangText | null;
  setListingType: React.Dispatch<React.SetStateAction<MultilangText | null>>;
  entranceType: MultilangText | null;
  setEntranceType: React.Dispatch<React.SetStateAction<MultilangText | null>>;
  housingType: MultilangText | null;
  setHousingType: React.Dispatch<React.SetStateAction<MultilangText | null>>;
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
  // New fields
  exchangeable: boolean;
  setExchangeable: React.Dispatch<React.SetStateAction<boolean>>;
  creditEligible: string;
  setCreditEligible: React.Dispatch<React.SetStateAction<string>>;
  buildingAge: number;
  setBuildingAge: React.Dispatch<React.SetStateAction<number>>;
  isFurnished: boolean;
  setIsFurnished: React.Dispatch<React.SetStateAction<boolean>>;
  dues: { amount: number; currency: string }[];
  setDues: React.Dispatch<
    React.SetStateAction<{ amount: number; currency: string }[]>
  >;
  usageStatus: Map<string, string>;
  setUsageStatus: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  deedStatus: Map<string, string>;
  setDeedStatus: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  heatingType: MultilangText;
  setHeatingType: React.Dispatch<React.SetStateAction<MultilangText>>;
  source: MultilangText;
  setSource: React.Dispatch<React.SetStateAction<MultilangText>>;
  generalFeatures: Map<string, string>;
  setGeneralFeatures: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  zoningStatus: Map<string, string>;
  setZoningStatus: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  // Orientation (facade)
  faces: string[];
  setFaces: React.Dispatch<React.SetStateAction<string[]>>;
  // Infrastructure Feature IDs
  infrastructureFeatureIds: string[];
  setInfrastructureFeatureIds: React.Dispatch<React.SetStateAction<string[]>>;
  // View IDs
  viewIds: string[];
  setViewIds: React.Dispatch<React.SetStateAction<string[]>>;
  // Address fields
  country: MultilangText;
  setCountry: React.Dispatch<React.SetStateAction<MultilangText>>;
  city: MultilangText;
  setCity: React.Dispatch<React.SetStateAction<MultilangText>>;
  state: MultilangText;
  setState: React.Dispatch<React.SetStateAction<MultilangText>>;
  neighborhood: MultilangText;
  setNeighborhood: React.Dispatch<React.SetStateAction<MultilangText>>;
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
  // Documents
  documents: { name: MultilangText; file: string }[];
  setDocuments: React.Dispatch<
    React.SetStateAction<{ name: MultilangText; file: string }[]>
  >;
  // Land specific fields (Arsa)
  adaNo: string;
  setAdaNo: React.Dispatch<React.SetStateAction<string>>;
  parselNo: string;
  setParselNo: React.Dispatch<React.SetStateAction<string>>;
  // Floor position
  floorPosition: MultilangText;
  setFloorPosition: React.Dispatch<React.SetStateAction<MultilangText>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  // Update mode
  isUpdate: boolean;
  hotelId: string | null;
};

// Create the context with default values
export const ListingFormContext = createContext<ListingFormContextType>({
  listingType: null,
  setListingType: () => {},
  entranceType: null,
  setEntranceType: () => {},
  housingType: null,
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
  // New fields defaults
  exchangeable: false,
  setExchangeable: () => {},
  creditEligible: "",
  setCreditEligible: () => {},
  buildingAge: 0,
  setBuildingAge: () => {},
  isFurnished: false,
  setIsFurnished: () => {},
  dues: [],
  setDues: () => {},
  usageStatus: new Map<string, string>(),
  setUsageStatus: () => {},
  deedStatus: new Map<string, string>(),
  setDeedStatus: () => {},
  heatingType: { tr: "", en: "" },
  setHeatingType: () => {},
  source: { tr: "", en: "" },
  setSource: () => {},
  generalFeatures: new Map<string, string>(),
  setGeneralFeatures: () => {},
  zoningStatus: new Map<string, string>(),
  setZoningStatus: () => {},
  // Orientation (facade)
  faces: [],
  setFaces: () => {},
  // Infrastructure Feature IDs
  infrastructureFeatureIds: [],
  setInfrastructureFeatureIds: () => {},
  // View IDs
  viewIds: [],
  setViewIds: () => {},
  // Address fields defaults
  country: { tr: "", en: "" },
  setCountry: () => {},
  city: { tr: "", en: "" },
  setCity: () => {},
  state: { tr: "", en: "" },
  setState: () => {},
  neighborhood: { tr: "", en: "" },
  setNeighborhood: () => {},
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
  // Documents default
  documents: [],
  setDocuments: () => {},
  // Land specific fields (Arsa)
  adaNo: "",
  setAdaNo: () => {},
  parselNo: "",
  setParselNo: () => {},
  // Floor position default
  floorPosition: { tr: "", en: "" },
  setFloorPosition: () => {},
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
  const [listingType, setListingType] = useState<MultilangText | null>(null);
  const [entranceType, setEntranceType] = useState<MultilangText | null>(null);
  const [housingType, setHousingType] = useState<MultilangText | null>(null);
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
  const [roomCount, setRoomCount] = useState<number>(-1);
  const [bathroomCount, setBathroomCount] = useState<number>(-1);
  const [bedRoomCount, setBedRoomCount] = useState<number>(-1);
  const [floorCount, setFloorCount] = useState<number>(0);
  const [buildYear, setBuildYear] = useState<number>(0);
  const [kitchenType, setKitchenType] = useState<MultilangText>({
    tr: "",
    en: "",
  });

  // New fields state
  const [exchangeable, setExchangeable] = useState<boolean>(false);
  const [creditEligible, setCreditEligible] = useState<any>("");
  const [buildingAge, setBuildingAge] = useState<number>(-1);
  const [isFurnished, setIsFurnished] = useState<boolean>(false);
  const [dues, setDues] = useState<{ amount: number; currency: string }[]>([]);
  const [usageStatus, setUsageStatus] = useState<Map<string, string>>(
    new Map<string, string>()
  );
  const [deedStatus, setDeedStatus] = useState<Map<string, string>>(
    new Map<string, string>()
  );
  const [heatingType, setHeatingType] = useState<MultilangText>({
    tr: "",
    en: "",
  });
  const [source, setSource] = useState<MultilangText>({ tr: "", en: "" });
  const [generalFeatures, setGeneralFeatures] = useState(
    new Map<string, string>()
  );
  const [zoningStatus, setZoningStatus] = useState(new Map<string, string>());

  // New state for ThirdCreateStep - Address fields
  const [country, setCountry] = useState<MultilangText>({ tr: "", en: "" });
  const [city, setCity] = useState<MultilangText>({ tr: "", en: "" });
  const [state, setState] = useState<MultilangText>({ tr: "", en: "" });
  const [neighborhood, setNeighborhood] = useState<MultilangText>({
    tr: "",
    en: "",
  });
  const [street, setStreet] = useState<MultilangText>({ tr: "", en: "" });
  const [buildingNo, setBuildingNo] = useState<string>("");
  const [apartmentNo, setApartmentNo] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [coordinates, setCoordinates] = useState<[number, number]>([
    30.805, 36.855,
  ]); // [long, lat] format

  // New state for FourthCreateStep - Features
  const [featureIds, setFeatureIds] = useState<string[]>([]);

  console.log({
    creditEligible,
  });

  // New state for FourthCreateStep - Infrastructure Features
  const [infrastructureFeatureIds, setInfrastructureFeatureIds] = useState<
    string[]
  >(hotelData?.infrastructureFeatureIds || []);

  // New state for FourthCreateStep - Views
  const [viewIds, setViewIds] = useState<string[]>(hotelData?.viewIds || []);

  // New state for FourthCreateStep - Distances
  const [distances, setDistances] = useState<
    { typeId: string; value: number }[]
  >(hotelData?.distances || []);

  // New state for FourthCreateStep - Distance editing
  const [newDistanceTypeId, setNewDistanceTypeId] = useState<string>("");
  const [newDistanceValue, setNewDistanceValue] = useState<string>("");
  const [editingDistanceId, setEditingDistanceId] = useState<string | null>(
    null
  );
  const [editingDistanceValue, setEditingDistanceValue] = useState<string>("");

  const [currentStep, setCurrentStep] = useState(1);

  // Orientation state
  const [faces, setFaces] = useState<string[]>(hotelData?.faces || []);

  // Images and video states
  const [images, setImages] = useState<string[]>(hotelData?.images || []);
  const [video, setVideo] = useState<string>(hotelData?.video || "");

  // Documents state
  const [documents, setDocuments] = useState<
    { name: MultilangText; file: string }[]
  >(hotelData?.documents || []);

  // Land specific fields (Arsa)
  const [adaNo, setAdaNo] = useState<string>(hotelData?.adaNo || "");
  const [parselNo, setParselNo] = useState<string>(hotelData?.parselNo || "");

  // Floor position state
  const [floorPosition, setFloorPosition] = useState<MultilangText>(
    hotelData?.floorPosition || { tr: "", en: "" }
  );

  // Set hotelId from hotelData if in update mode
  const hotelId = isUpdate && hotelData ? hotelData._id : null;

  // Add scroll to top effect when step changes
  useEffect(() => {
    const scrollToTop = () => {
      // Check if we're on mobile/tablet (responsive design)
      const isMobile = window.innerWidth < 768; // md breakpoint

      if (isMobile) {
        // On mobile, scroll the window to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // On desktop, also scroll window (individual components will handle their form panels)
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    scrollToTop();
  }, [currentStep]);

  // Effect to initialize form with hotel data when in update mode
  useEffect(() => {
    if (isUpdate && hotelData) {
      // First step data
      setListingType(hotelData.listingType || null);
      setEntranceType(hotelData.entranceType || null);
      setHousingType(hotelData.housingType || null);
      setTitle(hotelData.title || { tr: "", en: "" });
      setDescription(hotelData.description || { tr: "", en: "" });

      // Second step data
      setPrice(hotelData.price || []);
      setProjectArea(hotelData.projectArea || 0);
      setTotalSize(hotelData.totalSize || 0);
      setRoomCount(hotelData.roomCount || -1);
      setBathroomCount(hotelData.bathroomCount || -1);
      setBedRoomCount(hotelData.bedRoomCount || -1);
      setFloorCount(hotelData.floorCount || 0);
      setBuildYear(hotelData.buildYear || 0);
      setKitchenType(hotelData.kitchenType || { tr: "", en: "" });

      // New fields
      if (hotelData.exchangeable !== undefined) {
        setExchangeable(hotelData.exchangeable);
      }
      if (hotelData.creditEligible !== undefined) {
        setCreditEligible(hotelData.creditEligible);
      }
      if (hotelData.buildingAge !== undefined) {
        setBuildingAge(hotelData.buildingAge);
      }
      if (hotelData.isFurnished !== undefined) {
        setIsFurnished(hotelData.isFurnished);
      }
      if (hotelData.dues) {
        setDues(hotelData.dues);
      }
      if (hotelData.usageStatus) {
        setUsageStatus(new Map(Object.entries(hotelData.usageStatus)));
      }
      if (hotelData.deedStatus) {
        setDeedStatus(new Map(Object.entries(hotelData.deedStatus)));
      }
      if (hotelData.heatingType) {
        setHeatingType(hotelData.heatingType);
      }
      if (hotelData.source) {
        setSource(hotelData.source);
      }
      if (hotelData.generalFeatures) {
        setGeneralFeatures(new Map(Object.entries(hotelData.generalFeatures)));
      }
      if (hotelData.zoningStatus) {
        setZoningStatus(new Map(Object.entries(hotelData.zoningStatus)));
      }

      // Set infrastructure feature IDs
      if (hotelData.infrastructureFeatureIds) {
        setInfrastructureFeatureIds(hotelData.infrastructureFeatureIds);
      }

      // Set view IDs
      if (hotelData.viewIds) {
        setViewIds(hotelData.viewIds);
      }

      // Set orientation (face)
      setFaces(hotelData.faces || []);

      // Third step data - Address
      setCountry(hotelData.country || { tr: "", en: "" });
      setCity(hotelData.city || { tr: "", en: "" });
      setState(hotelData.state || { tr: "", en: "" });
      setNeighborhood(hotelData.neighborhood || { tr: "", en: "" });
      setStreet(hotelData.street || { tr: "", en: "" });
      setBuildingNo(hotelData.buildingNo || "");
      setApartmentNo(hotelData.apartmentNo || "");
      setPostalCode(hotelData.postalCode || "");

      // Set coordinates if available
      if (hotelData.location && hotelData.location.coordinates) {
        setCoordinates(hotelData.location.coordinates as [number, number]);
      }

      // Land specific fields
      if (hotelData.adaNo) {
        setAdaNo(hotelData.adaNo);
      }
      if (hotelData.parselNo) {
        setParselNo(hotelData.parselNo);
      }

      // Floor position
      if (hotelData.floorPosition) {
        setFloorPosition(hotelData.floorPosition);
      }

      // Fourth step data
      setFeatureIds(hotelData.featureIds || []);
      setDistances(hotelData.distances || []);

      // Fifth step data
      setImages(hotelData.images || []);
      setVideo(hotelData.video || "");

      // Documents data
      if (hotelData.documents && Array.isArray(hotelData.documents)) {
        setDocuments(hotelData.documents);
      }
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
    // New fields
    exchangeable,
    setExchangeable,
    creditEligible,
    setCreditEligible,
    buildingAge,
    setBuildingAge,
    isFurnished,
    setIsFurnished,
    dues,
    setDues,
    usageStatus,
    setUsageStatus,
    deedStatus,
    setDeedStatus,
    heatingType,
    setHeatingType,
    source,
    setSource,
    generalFeatures,
    setGeneralFeatures,
    zoningStatus,
    setZoningStatus,
    // Add orientation to context
    faces,
    setFaces,
    // Add infrastructure features to context
    infrastructureFeatureIds,
    setInfrastructureFeatureIds,
    // Add view IDs to context
    viewIds,
    setViewIds,
    // Address fields
    country,
    setCountry,
    city,
    setCity,
    state,
    setState,
    neighborhood,
    setNeighborhood,
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
    // Documents
    documents,
    setDocuments,
    // Land specific fields (Arsa)
    adaNo,
    setAdaNo,
    parselNo,
    setParselNo,
    // Floor position
    floorPosition,
    setFloorPosition,
    currentStep,
    setCurrentStep,
    // Update mode
    isUpdate,
    hotelId,
  };

  return (
    <ListingFormContext.Provider value={contextValue}>
      {currentStep === 1 && <FirstCreateStep />}
      {currentStep === 2 && (
        <>
          {entranceType?.tr === "Konut" && <SecondCreateStepForHouse />}
          {entranceType?.tr === "İş Yeri" && <SecondCreateStepForWork />}
          {entranceType?.tr === "Arsa" && <SecondCreateStepForLand />}
        </>
      )}
      {currentStep === 3 && <ThirdCreateStep />}
      {currentStep === 4 && <FourthCreateStep />}
      {currentStep === 5 && <FifthCreateStep />}
      {currentStep === 6 && <SixthCreateStep />}
    </ListingFormContext.Provider>
  );
}
