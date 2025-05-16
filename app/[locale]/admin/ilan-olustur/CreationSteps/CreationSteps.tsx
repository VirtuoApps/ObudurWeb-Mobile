"use client";

import React, { useState, createContext, useContext } from "react";
import FirstCreateStep from "./FirstCreateStep/FirstCreateStep";
import SecondCreateStep from "./SecondCreateStep/SecondCreateStep";

// Define the multilingual text interface
export interface MultilangText {
  [key: string]: string;
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
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
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
  currentStep: 1,
  setCurrentStep: () => {},
});

// Custom hook to use the context
export const useListingForm = () => useContext(ListingFormContext);

export default function CreationSteps() {
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

  const [currentStep, setCurrentStep] = useState(1);

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
    currentStep,
    setCurrentStep,
  };

  return (
    <ListingFormContext.Provider value={contextValue}>
      {currentStep === 1 && <FirstCreateStep />}
      {currentStep === 2 && <SecondCreateStep />}
    </ListingFormContext.Provider>
  );
}
