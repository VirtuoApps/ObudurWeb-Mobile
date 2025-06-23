import { ChevronRightIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { GetCity, GetCountries, GetState } from "react-country-state-city";
import { GoogleMap, Marker } from "@react-google-maps/api";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import GeneralSelect from "../../../../../components/GeneralSelect/GeneralSelect";
import GoBackButton from "../../GoBackButton/GoBackButton";
import { useGoogleMaps } from "../../../../../contexts/GoogleMapsContext";
import { useListingForm } from "../CreationSteps";

interface PlaceSuggestion {
  description: string;
  placeId: string;
}

export default function ThirdCreateStep() {
  const locale = useLocale();
  const t = useTranslations("adminCreation.step3");
  const tCommon = useTranslations("common");
  const [errors, setErrors] = useState<string[]>([]);
  const [errorFields, setErrorFields] = useState<Set<string>>(new Set());
  const formPanelRef = useRef<HTMLDivElement>(null);

  // Use context for form state and navigation
  const {
    entranceType,
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
    adaNo,
    setAdaNo,
    parselNo,
    setParselNo,
    buildingNo,
    setBuildingNo,
    apartmentNo,
    setApartmentNo,
    postalCode,
    setPostalCode,
    coordinates,
    setCoordinates,
    setCurrentStep,
  } = useListingForm();

  // Country-State-City states
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null
  );
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [statesList, setStatesList] = useState<any[]>([]);
  const [citiesList, setCitiesList] = useState<any[]>([]);

  // State for pending auto-selection from Google Places
  const [pendingCountryName, setPendingCountryName] = useState<string>("");
  const [pendingStateName, setPendingStateName] = useState<string>("");
  const [pendingCityName, setPendingCityName] = useState<string>("");

  // Google Maps settings
  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  // Center the map on the selected coordinates
  const center = {
    lat: coordinates[1],
    lng: coordinates[0],
  };

  const { isLoaded } = useGoogleMaps();

  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMapInstance(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMapInstance(null);
  }, []);

  // Handle street input change - auto-fill both languages
  const handleStreetChange = useCallback(
    (value: string) => {
      setStreet({
        tr: value,
        en: value,
      });
    },
    [setStreet]
  );

  // Handle neighborhood change
  const handleNeighborhoodChange = useCallback(
    (value: string) => {
      setNeighborhood({
        tr: value,
        en: value,
      });
    },
    [setNeighborhood]
  );

  // Auto-selection functions (don't clear dependent values)
  const autoSelectCountry = useCallback(
    (selectedCountry: any) => {
      setSelectedCountryId(selectedCountry.id);
      setCountry({
        tr: selectedCountry.name,
        en: selectedCountry.name,
      });
      // Don't clear dependent selections for auto-selection
    },
    [setCountry]
  );

  const autoSelectState = useCallback(
    (selectedState: any) => {
      setSelectedStateId(selectedState.id);
      setState({
        tr: selectedState.name,
        en: selectedState.name,
      });
      // Don't clear dependent selections for auto-selection
    },
    [setState]
  );

  const autoSelectCity = useCallback(
    (selectedCity: any) => {
      setSelectedCityId(selectedCity.id);
      setCity({
        tr: selectedCity.name,
        en: selectedCity.name,
      });
    },
    [setCity]
  );

  // Handle functions for user interactions (clear dependent selections)
  const handleCountrySelect = useCallback(
    (selectedCountry: any) => {
      setSelectedCountryId(selectedCountry.id);
      setCountry({
        tr: selectedCountry.name,
        en: selectedCountry.name,
      });
      // Clear dependent selections
      setSelectedStateId(null);
      setSelectedCityId(null);
      setState({ tr: "", en: "" });
      setCity({ tr: "", en: "" });
    },
    [setCountry, setState, setCity]
  );

  const handleStateSelect = useCallback(
    (selectedState: any) => {
      setSelectedStateId(selectedState.id);
      setState({
        tr: selectedState.name,
        en: selectedState.name,
      });
      // Clear dependent selections
      setSelectedCityId(null);
      setCity({ tr: "", en: "" });
    },
    [setState, setCity]
  );

  const handleCitySelect = useCallback(
    (selectedCity: any) => {
      setSelectedCityId(selectedCity.id);
      setCity({
        tr: selectedCity.name,
        en: selectedCity.name,
      });
    },
    [setCity]
  );

  useEffect(() => {
    const scrollToTop = () => {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (formPanelRef.current) {
        formPanelRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    scrollToTop();
  }, []);

  // Load countries on component mount
  useEffect(() => {
    GetCountries().then((result) => {
      const newCountriesList = result.map((country: any) => {
        if (locale === "tr" && country.name === "Turkey") {
          return { ...country, name: "Türkiye", originalName: "Turkey" };
        }
        return country;
      });
      setCountriesList(newCountriesList);
    });
  }, [locale]);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountryId) {
      GetState(selectedCountryId).then((result) => {
        setStatesList(result);
        setCitiesList([]); // Clear cities when country changes
        // Don't clear selectedStateId and selectedCityId here - it interferes with auto-selection
        // These are cleared by user interactions in handleCountrySelect when needed
      });
    } else {
      setStatesList([]);
      setCitiesList([]);
    }
  }, [selectedCountryId]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedCountryId && selectedStateId) {
      GetCity(selectedCountryId, selectedStateId).then((result) => {
        const selectedState = statesList.find((s) => s.id === selectedStateId);
        if (selectedState) {
          const filteredCities = result.filter(
            (city: any) =>
              city.name.toLowerCase() !== selectedState.name.toLowerCase()
          );
          setCitiesList(filteredCities);
        } else {
          setCitiesList(result);
        }
        // Don't clear selectedCityId here - it interferes with auto-selection
        // This is cleared by user interactions in handleStateSelect when needed
      });
    } else {
      setCitiesList([]);
    }
  }, [selectedCountryId, selectedStateId, statesList]);

  // Auto-select country when countries list is loaded and we have a pending country
  useEffect(() => {
    if (countriesList.length > 0 && pendingCountryName) {
      const matchingCountry = countriesList.find(
        (c) =>
          c.name.toLowerCase() === pendingCountryName.toLowerCase() ||
          c.originalName?.toLowerCase() === pendingCountryName.toLowerCase()
      );
      if (matchingCountry) {
        autoSelectCountry(matchingCountry);
        setPendingCountryName("");
      }
    }
  }, [countriesList, pendingCountryName, autoSelectCountry]);

  // Auto-select state when states list is loaded and we have a pending state
  useEffect(() => {
    if (statesList.length > 0 && pendingStateName) {
      const matchingState = statesList.find(
        (s) => s.name.toLowerCase() === pendingStateName.toLowerCase()
      );
      if (matchingState) {
        autoSelectState(matchingState);
        setPendingStateName("");
      }
    }
  }, [statesList, pendingStateName, autoSelectState]);

  // Auto-select city when cities list is loaded and we have a pending city
  useEffect(() => {
    if (citiesList.length > 0 && pendingCityName) {
      const matchingCity = citiesList.find(
        (c) => c.name.toLowerCase() === pendingCityName.toLowerCase()
      );
      if (matchingCity) {
        autoSelectCity(matchingCity);
        setPendingCityName("");
      }
    }
  }, [citiesList, pendingCityName, autoSelectCity]);

  // Auto-select existing country on mount/update
  useEffect(() => {
    if (countriesList.length > 0 && country?.tr && !selectedCountryId) {
      const matchingCountry = countriesList.find(
        (c) =>
          c.name.toLowerCase() === country.tr.toLowerCase() ||
          c.originalName?.toLowerCase() === country.tr.toLowerCase() ||
          c.name.toLowerCase() === country.en.toLowerCase() ||
          c.originalName?.toLowerCase() === country.en.toLowerCase()
      );
      if (matchingCountry) {
        autoSelectCountry(matchingCountry);
      }
    }
  }, [countriesList, country, selectedCountryId, autoSelectCountry]);

  // Auto-select existing state on mount/update
  useEffect(() => {
    if (
      statesList.length > 0 &&
      state?.tr &&
      !selectedStateId &&
      selectedCountryId
    ) {
      const matchingState = statesList.find(
        (s) =>
          s.name.toLowerCase() === state.tr.toLowerCase() ||
          s.name.toLowerCase() === state.en.toLowerCase()
      );
      if (matchingState) {
        autoSelectState(matchingState);
      }
    }
  }, [statesList, state, selectedStateId, selectedCountryId, autoSelectState]);

  // Auto-select existing city on mount/update
  useEffect(() => {
    if (
      citiesList.length > 0 &&
      city?.tr &&
      !selectedCityId &&
      selectedStateId
    ) {
      const matchingCity = citiesList.find(
        (c) =>
          c.name.toLowerCase() === city.tr.toLowerCase() ||
          c.name.toLowerCase() === city.en.toLowerCase()
      );
      if (matchingCity) {
        autoSelectCity(matchingCity);
      }
    }
  }, [citiesList, city, selectedCityId, selectedStateId, autoSelectCity]);

  // Default to Turkey if no country is selected
  useEffect(() => {
    if (countriesList.length > 0 && !country?.tr && !selectedCountryId) {
      const turkey = countriesList.find(
        (c) =>
          c.name.toLowerCase() === "turkey" ||
          c.originalName?.toLowerCase() === "turkey"
      );
      if (turkey) {
        handleCountrySelect(turkey);
      }
    }
  }, [countriesList, country, selectedCountryId, handleCountrySelect]);

  // Update map center when coordinates change
  useEffect(() => {
    if (mapInstance && coordinates && coordinates.length === 2) {
      console.log("Updating map center to:", {
        lat: coordinates[1],
        lng: coordinates[0],
      });
      mapInstance.setCenter({ lat: coordinates[1], lng: coordinates[0] });
    }
  }, [coordinates, mapInstance]);

  // Fetch suggestions as user types
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchInput.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Debounce the search request
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/places/autocomplete?input=${encodeURIComponent(
            searchInput
          )}&language=${locale}`
        );

        const data = await response.json();

        console.log(data);

        if (data.status === "OK" && data.predictions) {
          const newSuggestions = data.predictions.map((prediction: any) => ({
            description: prediction.description,
            placeId: prediction.place_id,
          }));
          setSuggestions(newSuggestions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", JSON.stringify(error));
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // 300ms delay to reduce API calls

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchInput, locale]);

  // Handle clicking outside suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to handle suggestion selection
  const handleSelectSuggestion = async (placeId: string) => {
    console.log("Selected placeId:", placeId);
    setIsSearching(true);
    setShowSuggestions(false);

    try {
      // Get place details
      const response = await fetch(`/api/places/details?place_id=${placeId}`);

      console.log("API Response status:", response.status);
      const data = await response.json();
      console.log("API Response data:", data);

      if (data.status === "OK" && data.result) {
        const result = data.result;
        console.log("Place result:", result);

        if (result.geometry && result.geometry.location) {
          const { lat, lng } = result.geometry.location;
          console.log("Coordinates:", { lat, lng });

          // Update coordinates
          setCoordinates([lng, lat]);

          // Update search input with the selected suggestion
          const selectedSuggestion = suggestions.find(
            (s) => s.placeId === placeId
          );
          if (selectedSuggestion) {
            setSearchInput(selectedSuggestion.description);
          }

          // Center the map on the found location
          if (mapInstance) {
            console.log("Map instance exists, centering map");
            mapInstance.setCenter({ lat, lng });
            mapInstance.setZoom(16);
          } else {
            console.log("Map instance is null!");
          }

          // Process address components
          if (result.address_components) {
            updateAddressFromComponents(result.address_components);
          }
        } else {
          console.error("No geometry/location in result:", result);
        }
      } else {
        console.error("API response not OK or no result:", data);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Update the updateAddressFromComponents function
  const updateAddressFromComponents = (addressComponents: any[]) => {
    // Debug: Log address components to see what types we get
    console.log(
      "Address components:",
      addressComponents.map((comp) => ({
        name: comp.long_name,
        types: comp.types,
      }))
    );
    console.log(
      "Address components:",
      addressComponents.map((comp) => ({
        name: comp.long_name,
        types: comp.types,
      }))
    );
    // Extract country
    const countryComponent = addressComponents.find(
      (component: { types: string[]; long_name: string }) =>
        component.types.includes("country")
    );
    if (countryComponent) {
      // Find matching country in the list
      const matchingCountry = countriesList.find(
        (c) =>
          c.name.toLowerCase() === countryComponent.long_name.toLowerCase() ||
          c.originalName?.toLowerCase() ===
            countryComponent.long_name.toLowerCase()
      );
      if (matchingCountry) {
        autoSelectCountry(matchingCountry);
      } else {
        // Set pending country for auto-selection when list loads
        setPendingCountryName(countryComponent.long_name);
        setCountry({
          tr: countryComponent.long_name,
          en: countryComponent.long_name,
        });
      }
    }

    // Extract state/province (Şehir) - Türkiye için administrative_area_level_1 kullanılır
    const stateComponent = addressComponents.find(
      (component: { types: string[]; long_name: string }) =>
        component.types.includes("administrative_area_level_1")
    );
    if (stateComponent) {
      setPendingStateName(stateComponent.long_name);
      setState({
        tr: stateComponent.long_name,
        en: stateComponent.long_name,
      });
    }

    // Extract city/district (İlçe) - Türkiye için administrative_area_level_2 veya locality kullanılır
    const cityComponent = addressComponents.find(
      (component: { types: string[]; long_name: string }) =>
        component.types.includes("administrative_area_level_2") ||
        component.types.includes("locality") ||
        component.types.includes("sublocality_level_1")
    );
    if (cityComponent) {
      setPendingCityName(cityComponent.long_name);
      setCity({
        tr: cityComponent.long_name,
        en: cityComponent.long_name,
      });
    }

    // Extract neighborhood - Türkiye için çeşitli sublocality türleri denenecek
    const neighborhoodComponent = addressComponents.find(
      (component: { types: string[]; long_name: string }) =>
        component.types.includes("administrative_area_level_4")
    );
    if (neighborhoodComponent) {
      setNeighborhood({
        tr: neighborhoodComponent.long_name,
        en: neighborhoodComponent.long_name,
      });
    }

    // Extract street
    const streetComponent = addressComponents.find(
      (component: { types: string[]; long_name: string }) =>
        component.types.includes("route")
    );
    if (streetComponent) {
      setStreet({
        tr: streetComponent.long_name,
        en: streetComponent.long_name,
      });
    }

    // Extract postal code
    const postalCodeComponent = addressComponents.find(
      (component: { types: string[]; long_name: string }) =>
        component.types.includes("postal_code")
    );
    if (postalCodeComponent) {
      setPostalCode(postalCodeComponent.long_name);
    }

    // Extract building number
    const buildingNumberComponent = addressComponents.find(
      (component: { types: string[]; long_name: string }) =>
        component.types.includes("street_number")
    );
    if (buildingNumberComponent) {
      setBuildingNo(buildingNumberComponent.long_name);
    }
  };

  // Function to search for a location using the Geocoding API
  const searchLocation = async () => {
    if (!searchInput) return;

    setIsSearching(true);
    try {
      // Use the Geocoding API directly
      const response = await fetch(
        `/api/places/geocode?address=${encodeURIComponent(searchInput)}`
      );

      const data = await response.json();

      if (data.status === "OK" && data.results && data.results.length > 0) {
        const result = data.results[0];
        const { lat, lng } = result.geometry.location;

        // Update coordinates
        setCoordinates([lng, lat]);

        // Center the map on the found location
        if (mapInstance) {
          mapInstance.setCenter({ lat, lng });
          mapInstance.setZoom(16);
        }

        // Try to extract address components
        if (result.address_components) {
          updateAddressFromComponents(result.address_components);
        }
      } else {
        // Handle geocoding error
        console.error("Geocoding API Error:", data.status);
      }
    } catch (error) {
      console.error("Error searching location:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle marker position change
  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setCoordinates([lng, lat]);

      // Perform reverse geocoding to get address details
      try {
        const response = await fetch(
          `/api/places/geocode?latlng=${lat},${lng}`
        );

        const data = await response.json();

        if (data.status === "OK" && data.results && data.results.length > 0) {
          const result = data.results[0];

          // Update address components from reverse geocoding result
          if (result.address_components) {
            updateAddressFromComponents(result.address_components);
          }
        }
      } catch (error) {
        console.error("Error reverse geocoding location:", error);
      }
    }
  };

  // Helper function to get error styling for fields
  const getFieldErrorClass = (fieldName: string): string => {
    return errorFields.has(fieldName)
      ? "border-[#EF1A28] focus:border-[#EF1A28] focus:ring-[#EF1A28]/40"
      : "border-gray-300 focus:border-[#6656AD] focus:ring-[#6656AD]/40";
  };

  // Validate all required fields
  const validateFields = () => {
    const newErrors: string[] = [];
    const newErrorFields = new Set<string>();

    if (!country || !country.tr || !country.en) {
      newErrors.push(t("validation.countryRequired"));
      newErrorFields.add("country");
    }

    if (!city || !city.tr || !city.en) {
      newErrors.push(t("validation.districtRequired"));
      newErrorFields.add("city");
    }

    if (!state || !state.tr || !state.en) {
      newErrors.push(t("validation.provinceRequired"));
      newErrorFields.add("state");
    }

    if (!neighborhood || !neighborhood.tr || !neighborhood.en) {
      newErrors.push(t("validation.neighborhoodRequired"));
      newErrorFields.add("neighborhood");
    }

    if (!street || !street.tr || !street.en) {
      newErrors.push(t("validation.streetRequired"));
      newErrorFields.add("street");
    }

    // Conditional validation based on entrance type
    if (entranceType?.tr === "Arsa") {
      // For land, require adaNo and parselNo
      if (!adaNo) {
        newErrors.push(t("validation.adaNoRequired"));
        newErrorFields.add("adaNo");
      }
      if (!parselNo) {
        newErrors.push(t("validation.parselNoRequired"));
        newErrorFields.add("parselNo");
      }
    } else {
      // For other types, require buildingNo and postalCode
      // if (!buildingNo) {
      //   newErrors.push(t("validation.buildingNoRequired"));
      //   newErrorFields.add("buildingNo");
      // }
      // if (!postalCode) {
      //   newErrors.push(t("validation.postalCodeRequired"));
      //   newErrorFields.add("postalCode");
      // }
    }

    if (!coordinates || coordinates.length !== 2) {
      newErrors.push(t("validation.coordinatesRequired"));
      newErrorFields.add("coordinates");
    }

    setErrors(newErrors);
    setErrorFields(newErrorFields);
    return newErrors.length === 0;
  };

  // Handle form submission to next step
  const handleContinue = () => {
    // Clear previous errors
    setErrors([]);
    setErrorFields(new Set());

    // Validate all fields
    const isValid = validateFields();

    if (isValid) {
      // Log current form data
      console.log({
        country,
        city,
        state,
        street,
        adaNo,
        parselNo,
        buildingNo,
        apartmentNo,
        postalCode,
        coordinates,
      });

      // Move to the next step
      setCurrentStep(4);
    } else {
      // Scroll form panel to top to see errors
      if (formPanelRef.current) {
        formPanelRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Handle going back to previous step
  const handleBack = () => {
    setCurrentStep(2);
  };

  // Get current selected country object
  const getSelectedCountry = () => {
    if (!selectedCountryId) return null;
    return countriesList.find((c) => c.id === selectedCountryId) || null;
  };

  // Get current selected state object
  const getSelectedState = () => {
    if (!selectedStateId) return null;
    return statesList.find((s) => s.id === selectedStateId) || null;
  };

  // Get current selected city object
  const getSelectedCity = () => {
    if (!selectedCityId) return null;
    return citiesList.find((c) => c.id === selectedCityId) || null;
  };

  return (
    <div className="bg-[#ECEBF4] flex justify-center items-start p-4 py-6 ">
      <div className="w-full max-w-[1200px] rounded-2xl shadow-lg bg-white h-full">
        <div className="flex flex-col md:flex-row h-[inherit] md:h-[73vh]  2xl:h-[73vh]">
          {/* Left Info Panel - 30% width on desktop */}
          <div className="w-full md:w-[30%] mb-8 md:mb-0 md:p-6 hidden flex-col md:flex justify-between">
            <div className="">
              <h1 className="text-2xl font-extrabold leading-tight text-[#362C75]">
                {t("title")}
              </h1>
              <div className="mt-4 text-base text-[#595959] font-medium">
                <p className="leading-[140%]">{t("description")}</p>
              </div>
            </div>
          </div>

          {/* Right Form Panel - 70% width on desktop */}
          <div
            ref={formPanelRef}
            // className="w-full md:w-[70%] overflow-auto md:border-l md:border-[#F0F0F0] h-full"
            className="flex-1 h-full flex flex-col"
          >
            <div className="p-6 flex-1 overflow-auto md:border-l border-[#F0F0F0]">
              {/* Errors display */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <XCircleIcon
                        className="h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {t("fixErrors")}
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <ul className="list-disc pl-5 space-y-1">
                          {errors.map((error) => (
                            <li key={error}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <label
                htmlFor="address"
                className="font-semibold block mb-2 text-[#262626]"
              >
                {t("mapLocationSelect")}
              </label>

              {/* Search Input with Autocomplete */}
              <div className="relative mb-6 ">
                <div className="flex">
                  <div className="relative flex-grow" ref={searchInputRef}>
                    {" "}
                    <input
                      type="text"
                      id="address"
                      placeholder={tCommon("addressSearchPlaceholder")}
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full h-[56px] pl-4 pr-4 rounded-[16px] border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626] text-[14px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          searchLocation();
                        }
                      }}
                      onFocus={() => {
                        if (suggestions.length > 0) {
                          setShowSuggestions(true);
                        }
                      }}
                    />
                    {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div> */}
                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-[16px] shadow-lg z-10 max-h-60 overflow-y-auto py-2">
                        {suggestions.map((suggestion) => (
                          <div
                            key={suggestion.placeId}
                            className="flex flex-row gap-2 items-center hover:bg-gray-100 px-4 cursor-pointer"
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.0001 18C10.0001 18 16.261 12.4348 16.261 8.26087C16.261 4.80309 13.4579 2 10.0001 2C6.54234 2 3.73926 4.80309 3.73926 8.26087C3.73926 12.4348 10.0001 18 10.0001 18Z"
                                stroke="#262626"
                                strokeWidth="1.2"
                                strokeLinecap="square"
                              />
                              <path
                                d="M12.0004 8.00013C12.0004 9.1047 11.105 10.0001 10.0004 10.0001C8.89581 10.0001 8.00038 9.1047 8.00038 8.00013C8.00038 6.89556 8.89581 6.00013 10.0004 6.00013C11.105 6.00013 12.0004 6.89556 12.0004 8.00013Z"
                                stroke="#262626"
                                strokeWidth="1.2"
                                strokeLinecap="square"
                              />
                            </svg>
                            <div
                              className="py-2 text-gray-800 text-[12px]"
                              onClick={() =>
                                handleSelectSuggestion(suggestion.placeId)
                              }
                            >
                              {suggestion.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Country and Province */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="country"
                    className="font-semibold block mb-2 text-[#262626]"
                  >
                    {t("country")}
                  </label>
                  <GeneralSelect
                    selectedItem={getSelectedCountry()}
                    onSelect={handleCountrySelect}
                    options={countriesList}
                    defaultText={t("selectCountry")}
                    extraClassName={`w-full h-[56px] rounded-[16px] border ${
                      errorFields.has("country")
                        ? "border-[#EF1A28]"
                        : "border-gray-300"
                    }`}
                    popoverMaxWidth="400"
                    maxHeight="200"
                    popoverExtraClassName="w-auto max-w-[420px]"
                  />
                </div>

                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="state"
                    className="font-semibold block mb-2 text-[#262626]"
                  >
                    {t("province")}
                  </label>
                  <GeneralSelect
                    selectedItem={getSelectedState()}
                    onSelect={handleStateSelect}
                    options={statesList}
                    defaultText={t("selectProvince")}
                    extraClassName="w-full h-[56px] rounded-[16px] border border-gray-300"
                    popoverMaxWidth="400"
                    maxHeight="200"
                    popoverExtraClassName="w-auto max-w-[420px]"
                  />
                </div>
              </div>

              {/* District, Neighborhood and Street */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="w-full sm:w-1/3">
                  <label
                    htmlFor="city"
                    className="font-semibold block mb-2 text-[#262626]"
                  >
                    {t("district")}
                  </label>
                  <GeneralSelect
                    selectedItem={getSelectedCity()}
                    onSelect={handleCitySelect}
                    options={citiesList}
                    defaultText={t("selectDistrict")}
                    extraClassName="w-full h-[56px] rounded-[16px] border border-gray-300"
                    popoverMaxWidth="200"
                    maxHeight="200"
                    popoverExtraClassName="w-auto max-w-[280px]"
                  />
                </div>

                <div className="w-full sm:w-1/3">
                  <label
                    htmlFor="neighborhood"
                    className="font-semibold block mb-2 text-[#262626]"
                  >
                    {t("neighborhood")}
                  </label>
                  <input
                    type="text"
                    id="neighborhood"
                    value={neighborhood?.tr || ""}
                    onChange={(e) => handleNeighborhoodChange(e.target.value)}
                    className={`w-full h-[56px] rounded-[16px] border px-4 placeholder-gray-400 focus:outline-none focus:ring-2 text-[#262626] text-[14px] ${getFieldErrorClass(
                      "neighborhood"
                    )}`}
                    placeholder={t("neighborhood")}
                  />
                </div>

                <div className="w-full sm:w-1/3">
                  <label
                    htmlFor="street"
                    className="font-semibold block mb-2 text-[#262626]"
                  >
                    {t("street")}
                  </label>
                  <input
                    type="text"
                    id="street"
                    value={street?.tr || ""}
                    onChange={(e) => handleStreetChange(e.target.value)}
                    className={`w-full h-[56px] rounded-[16px] border px-4 placeholder-gray-400 focus:outline-none focus:ring-2 text-[#262626] text-[14px] ${getFieldErrorClass(
                      "street"
                    )}`}
                    placeholder={t("street")}
                  />
                </div>
              </div>

              {/* Building / Parcel information conditional */}
              {entranceType?.tr === "Arsa" ? (
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="adaNo"
                      className="font-semibold block mb-2 text-[#262626]"
                    >
                      {t("adaNo")}
                    </label>
                    <input
                      type="text"
                      id="adaNo"
                      value={adaNo}
                      onChange={(e) => setAdaNo(e.target.value)}
                      className={`w-full h-[56px] rounded-[16px] border px-4 placeholder-gray-400 focus:outline-none focus:ring-2 text-[#262626] text-[14px] ${getFieldErrorClass(
                        "adaNo"
                      )}`}
                      placeholder={t("adaNo")}
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="parselNo"
                      className="font-semibold block mb-2 text-[#262626]"
                    >
                      {t("parselNo")}
                    </label>
                    <input
                      type="text"
                      id="parselNo"
                      value={parselNo}
                      onChange={(e) => setParselNo(e.target.value)}
                      className={`w-full h-[56px] rounded-[16px] border px-4 placeholder-gray-400 focus:outline-none focus:ring-2 text-[#262626] text-[14px] ${getFieldErrorClass(
                        "parselNo"
                      )}`}
                      placeholder={t("parselNo")}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="w-full sm:w-1/3">
                    <label
                      htmlFor="buildingNo"
                      className="font-semibold block mb-2 text-[#262626]"
                    >
                      {t("buildingNo")}
                    </label>
                    <input
                      type="text"
                      id="buildingNo"
                      value={buildingNo}
                      onChange={(e) => setBuildingNo(e.target.value)}
                      className={`w-full h-[56px] rounded-[16px] border px-4 placeholder-gray-400 focus:outline-none focus:ring-2 text-[#262626] text-[14px] ${getFieldErrorClass(
                        "buildingNo"
                      )}`}
                      placeholder={t("buildingNo")}
                    />
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label
                      htmlFor="apartmentNo"
                      className="font-semibold block mb-2 text-[#262626]"
                    >
                      {t("apartmentNo")}
                    </label>
                    <input
                      type="text"
                      id="apartmentNo"
                      value={apartmentNo}
                      onChange={(e) => setApartmentNo(e.target.value)}
                      className="w-full h-[56px] rounded-[16px] border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626] text-[14px]"
                      placeholder={t("apartmentNoPlaceholder")}
                    />
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label
                      htmlFor="postalCode"
                      className="font-semibold block mb-2 text-[#262626]"
                    >
                      {t("postalCode")}
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className={`w-full h-[56px] rounded-[16px] border px-4 placeholder-gray-400 focus:outline-none focus:ring-2 text-[#262626] text-[14px] ${getFieldErrorClass(
                        "postalCode"
                      )}`}
                      placeholder={t("postalCode")}
                    />
                  </div>
                </div>
              )}

              {isLoaded ? (
                <div className="space-y-8">
                  {/* Map Section */}
                  <div>
                    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-300">
                      <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={12}
                        onClick={handleMapClick}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                        options={{
                          streetViewControl: false,
                          mapTypeControl: false,
                        }}
                      >
                        <Marker
                          position={{
                            lat: coordinates[1],
                            lng: coordinates[0],
                          }}
                          draggable={true}
                          onDragEnd={async (e) => {
                            if (e.latLng) {
                              const lat = e.latLng.lat();
                              const lng = e.latLng.lng();
                              setCoordinates([lng, lat]);

                              // Perform reverse geocoding to get address details
                              try {
                                const response = await fetch(
                                  `/api/places/geocode?latlng=${lat},${lng}`
                                );

                                const data = await response.json();

                                if (
                                  data.status === "OK" &&
                                  data.results &&
                                  data.results.length > 0
                                ) {
                                  const result = data.results[0];

                                  // Update address components from reverse geocoding result
                                  if (result.address_components) {
                                    updateAddressFromComponents(
                                      result.address_components
                                    );
                                  }
                                }
                              } catch (error) {
                                console.error(
                                  "Error reverse geocoding location:",
                                  error
                                );
                              }
                            }
                          }}
                        />
                      </GoogleMap>
                    </div>

                    <div className="mt-2 text-sm grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">{t("latitude")}</span>{" "}
                        {coordinates[1].toFixed(6)}
                      </div>
                      <div>
                        <span className="font-medium">{t("longitude")}</span>{" "}
                        {coordinates[0].toFixed(6)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>Loading Map...</div>
              )}
            </div>

            {/* Step counter and continue button */}
          </div>
        </div>

        <div className=" flex flex-col sm:flex-row justify-between items-center p-6">
          <GoBackButton handleBack={handleBack} step={3} totalSteps={6} />
          <button
            type="button"
            onClick={handleContinue}
            className="w-full sm:w-auto bg-[#5E5691] hover:bg-[#5349a0] text-white font-semibold px-8 py-3 rounded-xl inline-flex items-center justify-center gap-2 transition"
          >
            {t("continue")}
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
