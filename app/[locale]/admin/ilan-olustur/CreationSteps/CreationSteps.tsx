"use client";

import React, { useState, createContext, useContext } from "react";
import FirstCreateStep from "./FirstCreateStep/FirstCreateStep";

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
    currentStep,
    setCurrentStep,
  };

  return (
    <ListingFormContext.Provider value={contextValue}>
      {currentStep === 1 && <FirstCreateStep />}
    </ListingFormContext.Provider>
  );
}
