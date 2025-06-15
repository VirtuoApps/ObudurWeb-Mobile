import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { useListingForm } from "../CreationSteps";
import { GoogleMap, Marker } from "@react-google-maps/api";
import GoBackButton from "../../GoBackButton/GoBackButton";
import { useGoogleMaps } from "../../../../../contexts/GoogleMapsContext";
import { GetCountries, GetState, GetCity } from "react-country-state-city";
import GeneralSelect from "../../../../../components/GeneralSelect/GeneralSelect";
import { useLocale } from "next-intl";

interface PlaceSuggestion {
  description: string;
  placeId: string;
}

export default function ThirdCreateStep() {
  const locale = useLocale();
  const [errors, setErrors] = useState<string[]>([]);

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
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<number | null>(null);
  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [statesList, setStatesList] = useState<any[]>([]);
  const [citiesList, setCitiesList] = useState<any[]>([]);
  const [neighborhoodsList, setNeighborhoodsList] = useState<any[]>([]);

  // State for pending auto-selection from Google Places
  const [pendingCountryName, setPendingCountryName] = useState<string>("");
  const [pendingStateName, setPendingStateName] = useState<string>("");
  const [pendingCityName, setPendingCityName] = useState<string>("");
  const [pendingNeighborhoodName, setPendingNeighborhoodName] = useState<string>("");

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
      // Don't clear dependent selections for auto-selection
    },
    [setCity]
  );

  const autoSelectNeighborhood = useCallback(
    (selectedNeighborhood: any) => {
      setSelectedNeighborhoodId(selectedNeighborhood.id);
      setNeighborhood({
        tr: selectedNeighborhood.name,
        en: selectedNeighborhood.name,
      });
    },
    [setNeighborhood]
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
      setSelectedNeighborhoodId(null);
      setState({ tr: "", en: "" });
      setCity({ tr: "", en: "" });
      setNeighborhood({ tr: "", en: "" });
    },
    [setCountry, setState, setCity, setNeighborhood]
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
      setSelectedNeighborhoodId(null);
      setCity({ tr: "", en: "" });
      setNeighborhood({ tr: "", en: "" });
    },
    [setState, setCity, setNeighborhood]
  );

  const handleCitySelect = useCallback(
    (selectedCity: any) => {
      setSelectedCityId(selectedCity.id);
      setCity({
        tr: selectedCity.name,
        en: selectedCity.name,
      });
      // Clear dependent selections
      setSelectedNeighborhoodId(null);
      setNeighborhood({ tr: "", en: "" });
    },
    [setCity, setNeighborhood]
  );

  const handleNeighborhoodSelect = useCallback(
    (selectedNeighborhood: any) => {
      setSelectedNeighborhoodId(selectedNeighborhood.id);
      setNeighborhood({
        tr: selectedNeighborhood.name,
        en: selectedNeighborhood.name,
      });
    },
    [setNeighborhood]
  );

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
        setNeighborhoodsList([]); // Clear neighborhoods when country changes
        // Don't clear selectedStateId and selectedCityId here - it interferes with auto-selection
        // These are cleared by user interactions in handleCountrySelect when needed
      });
    } else {
      setStatesList([]);
      setCitiesList([]);
      setNeighborhoodsList([]);
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
        setNeighborhoodsList([]); // Clear neighborhoods when state changes
        // Don't clear selectedCityId here - it interferes with auto-selection
        // This is cleared by user interactions in handleStateSelect when needed
      });
    } else {
      setCitiesList([]);
      setNeighborhoodsList([]);
    }
  }, [selectedCountryId, selectedStateId, statesList]);

  // Load neighborhoods when city changes (mock data for now since react-country-state-city doesn't support neighborhoods)
  useEffect(() => {
    if (selectedCountryId && selectedStateId && selectedCityId) {
      // Since react-country-state-city doesn't provide neighborhoods, we'll create a mock neighborhood list
      // In a real application, you would fetch this from your own API or a service that provides neighborhood data
      const selectedCity = citiesList.find((c) => c.id === selectedCityId);
      if (selectedCity) {
        // Create mock neighborhoods based on the city name
        const mockNeighborhoods = [
          { id: 1, name: `${selectedCity.name} Merkez` },
          { id: 2, name: `${selectedCity.name} 1. Mahalle` },
          { id: 3, name: `${selectedCity.name} 2. Mahalle` },
          { id: 4, name: `${selectedCity.name} 3. Mahalle` },
          { id: 5, name: `${selectedCity.name} 4. Mahalle` },
        ];
        setNeighborhoodsList(mockNeighborhoods);
      }
    } else {
      setNeighborhoodsList([]);
    }
  }, [selectedCountryId, selectedStateId, selectedCityId, citiesList]);

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

  // Auto-select neighborhood when neighborhoods list is loaded and we have a pending neighborhood
  useEffect(() => {
    if (neighborhoodsList.length > 0 && pendingNeighborhoodName) {
      const matchingNeighborhood = neighborhoodsList.find(
        (n) => n.name.toLowerCase() === pendingNeighborhoodName.toLowerCase()
      );
      if (matchingNeighborhood) {
        autoSelectNeighborhood(matchingNeighborhood);
        setPendingNeighborhoodName("");
      }
    }
  }, [neighborhoodsList, pendingNeighborhoodName, autoSelectNeighborhood]);

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

  // Auto-select existing neighborhood on mount/update
  useEffect(() => {
    if (
      neighborhoodsList.length > 0 &&
      neighborhood?.tr &&
      !selectedNeighborhoodId &&
      selectedCityId
    ) {
      const matchingNeighborhood = neighborhoodsList.find(
        (n) =>
          n.name.toLowerCase() === neighborhood.tr.toLowerCase() ||
          n.name.toLowerCase() === neighborhood.en.toLowerCase()
      );
      if (matchingNeighborhood) {
        autoSelectNeighborhood(matchingNeighborhood);
      }
    }
  }, [neighborhoodsList, neighborhood, selectedNeighborhoodId, selectedCityId, autoSelectNeighborhood]);

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

    // Extract state/district
    const districtComponent = addressComponents.find(
      (component: { types: string[]; long_name: string }) =>
        component.types.includes("administrative_area_level_1") ||
        component.types.includes("administrative_area_level_2")
    );
    if (districtComponent) {
      setPendingStateName(districtComponent.long_name);
      setState({
        tr: districtComponent.long_name,
        en: districtComponent.long_name,
      });
    }

    // Extract city
    const cityComponent = addressComponents.find(
      (component: { types: string[]; long_name: string }) =>
        component.types.includes("locality") ||
        component.types.includes("administrative_area_level_3")
    );
    if (cityComponent) {
      setPendingCityName(cityComponent.long_name);
      setCity({
        tr: cityComponent.long_name,
        en: cityComponent.long_name,
      });
    }

    // Extract neighborhood
    const neighborhoodComponent = addressComponents.find(
      (component: { types: string[]; long_name: string }) =>
        component.types.includes("sublocality") ||
        component.types.includes("sublocality_level_1")
    );
    if (neighborhoodComponent) {
      setPendingNeighborhoodName(neighborhoodComponent.long_name);
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
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setCoordinates([lng, lat]);
    }
  };

  // Validate all required fields
  const validateFields = () => {
    const newErrors: string[] = [];

    if (!country || !country.tr || !country.en) {
      newErrors.push("Lütfen ülke bilgisini Türkçe ve İngilizce olarak girin");
    }

    if (!city || !city.tr || !city.en) {
      newErrors.push("Lütfen şehir bilgisini Türkçe ve İngilizce olarak girin");
    }

    if (!state || !state.tr || !state.en) {
      newErrors.push("Lütfen ilçe bilgisini Türkçe ve İngilizce olarak girin");
    }

    if (!neighborhood || !neighborhood.tr || !neighborhood.en) {
      newErrors.push(
        "Lütfen mahalle bilgisini Türkçe ve İngilizce olarak girin"
      );
    }

    if (!street || !street.tr || !street.en) {
      newErrors.push("Lütfen sokak bilgisini Türkçe ve İngilizce olarak girin");
    }

    // Conditional validation based on entrance type
    if (entranceType?.tr === "Arsa") {
      // For land, require adaNo and parselNo
      if (!adaNo) {
        newErrors.push("Lütfen ada numarasını girin");
      }
      if (!parselNo) {
        newErrors.push("Lütfen parsel numarasını girin");
      }
    } else {
      // For other types, require buildingNo and postalCode
      if (!buildingNo) {
        newErrors.push("Lütfen bina numarasını girin");
      }

      if (!postalCode) {
        newErrors.push("Lütfen posta kodunu girin");
      }
    }

    if (!coordinates || coordinates.length !== 2) {
      newErrors.push("Lütfen haritadan konum seçin");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle form submission to next step
  const handleContinue = () => {
    // Clear previous errors
    setErrors([]);

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
      // Scroll to top to see errors
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  // Get current selected neighborhood object
  const getSelectedNeighborhood = () => {
    if (!selectedNeighborhoodId) return null;
    return neighborhoodsList.find((n) => n.id === selectedNeighborhoodId) || null;
  };

  return (
    <div className="min-h-screen bg-[#ECEBF4] flex justify-center items-start p-4">
      <div className="w-full max-w-[1200px] rounded-2xl shadow-lg bg-white">
        <div className="flex flex-col md:flex-row p-10">
          {/* Left Info Panel */}
          <div className="w-full md:w-[30%] mb-8 md:mb-0 md:pr-6 flex flex-col">
            <h1 className="text-2xl font-extrabold leading-tight text-[#362C75]">
              İlanın konumunu belirtin.
            </h1>
            <div className="mt-4 text-base text-[#595959] font-medium">
              <p className="leading-[140%]">
                Bu adımda, mülkünüzün adres bilgilerini ve harita üzerindeki
                konumunu doğru bir şekilde işaretleyin. Konum bilgisi,
                potansiyel alıcılar ve kiracılar için en önemli kriterlerden
                biridir.
              </p>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="w-full md:w-[70%] md:pl-6 h-auto md:h-[67vh]  2xl:h-[73vh] overflow-auto border-l border-[#F0F0F0]">
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
                      Lütfen aşağıdaki hataları düzeltin:
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Country and Province */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="country"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  {locale === "tr" ? "Ülke" : "Country"}
                </label>
                <GeneralSelect
                  selectedItem={getSelectedCountry()}
                  onSelect={handleCountrySelect}
                  options={countriesList}
                  defaultText={
                    locale === "en" ? "Select Country" : "Ülke Seçin"
                  }
                  extraClassName="w-full h-12 border border-gray-300"
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
                  {locale === "tr" ? "Şehir" : "Province"}
                </label>
                <GeneralSelect
                  selectedItem={getSelectedState()}
                  onSelect={handleStateSelect}
                  options={statesList}
                  defaultText={
                    locale === "en" ? "Select Province" : "Şehir Seçin"
                  }
                  extraClassName="w-full h-12 border border-gray-300"
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
                  {locale === "tr" ? "İlçe" : "District"}
                </label>
                <GeneralSelect
                  selectedItem={getSelectedCity()}
                  onSelect={handleCitySelect}
                  options={citiesList}
                  defaultText={
                    locale === "en" ? "Select District" : "İlçe Seçin"
                  }
                  extraClassName="w-full h-12 border border-gray-300"
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
                  {locale === "tr" ? "Mahalle" : "Neighborhood"}
                </label>
                <GeneralSelect
                  selectedItem={getSelectedNeighborhood()}
                  onSelect={handleNeighborhoodSelect}
                  options={neighborhoodsList}
                  defaultText={
                    locale === "en" ? "Select Neighborhood" : "Mahalle Seçin"
                  }
                  extraClassName="w-full h-12 border border-gray-300"
                  popoverMaxWidth="200"
                  maxHeight="200"
                  popoverExtraClassName="w-auto max-w-[280px]"
                />
              </div>

              <div className="w-full sm:w-1/3">
                <label
                  htmlFor="street"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  {locale === "tr" ? "Sokak" : "Street"}
                </label>
                <input
                  type="text"
                  id="street"
                  value={street?.tr || ""}
                  onChange={(e) => handleStreetChange(e.target.value)}
                  className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                  placeholder={locale === "en" ? "Street" : "Sokak"}
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
                    Ada No
                  </label>
                  <input
                    type="text"
                    id="adaNo"
                    value={adaNo}
                    onChange={(e) => setAdaNo(e.target.value)}
                    className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                    placeholder="Ada No"
                  />
                </div>
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="parselNo"
                    className="font-semibold block mb-2 text-[#262626]"
                  >
                    Parsel No
                  </label>
                  <input
                    type="text"
                    id="parselNo"
                    value={parselNo}
                    onChange={(e) => setParselNo(e.target.value)}
                    className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                    placeholder="Parsel No"
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
                    Bina No
                  </label>
                  <input
                    type="text"
                    id="buildingNo"
                    value={buildingNo}
                    onChange={(e) => setBuildingNo(e.target.value)}
                    className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                    placeholder="Bina No"
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <label
                    htmlFor="apartmentNo"
                    className="font-semibold block mb-2 text-[#262626]"
                  >
                    Daire No
                  </label>
                  <input
                    type="text"
                    id="apartmentNo"
                    value={apartmentNo}
                    onChange={(e) => setApartmentNo(e.target.value)}
                    className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                    placeholder="Daire No (opsiyonel)"
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <label
                    htmlFor="postalCode"
                    className="font-semibold block mb-2 text-[#262626]"
                  >
                    Posta Kodu
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                    placeholder="Posta Kodu"
                  />
                </div>
              </div>
            )}

            {isLoaded ? (
              <div className="space-y-8">
                {/* Map Section */}
                <div>
                  <label className="font-semibold block mb-2 text-[#262626]">
                    Haritada Konum Seçin
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    Konumu bulmak için arama yapabilir veya harita üzerinde
                    tıklayarak tam konumu belirleyebilirsiniz.
                  </p>

                  {/* Search Input with Autocomplete */}
                  <div className="relative mb-2">
                    <div className="flex">
                      <div className="relative flex-grow" ref={searchInputRef}>
                        <input
                          type="text"
                          placeholder="Adres ara..."
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          className="w-full h-12 pl-10 pr-4 rounded-l-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
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
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                            {suggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                                onClick={() =>
                                  handleSelectSuggestion(suggestion.placeId)
                                }
                              >
                                {suggestion.description}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={searchLocation}
                        disabled={isSearching}
                        className="h-12 px-4 bg-[#6656AD] text-white rounded-r-lg hover:bg-[#5349a0] transition"
                      >
                        {isSearching ? "Aranıyor..." : "Ara"}
                      </button>
                    </div>
                  </div>

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
                        position={{ lat: coordinates[1], lng: coordinates[0] }}
                        draggable={true}
                        onDragEnd={(e) => {
                          if (e.latLng) {
                            const lat = e.latLng.lat();
                            const lng = e.latLng.lng();
                            setCoordinates([lng, lat]);
                          }
                        }}
                      />
                    </GoogleMap>
                  </div>

                  <div className="mt-2 text-sm grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Enlem:</span>{" "}
                      {coordinates[1].toFixed(6)}
                    </div>
                    <div>
                      <span className="font-medium">Boylam:</span>{" "}
                      {coordinates[0].toFixed(6)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>Loading Map...</div>
            )}
          </div>
        </div>
        <div className=" flex flex-col sm:flex-row justify-between items-center p-6">
          <GoBackButton handleBack={handleBack} step={3} totalSteps={6} />
          <button
            type="button"
            onClick={handleContinue}
            className="w-full sm:w-auto bg-[#6656AD] hover:bg-[#5349a0] text-white font-semibold px-8 py-3 rounded-xl inline-flex items-center justify-center gap-2 transition"
          >
            Devam Et
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
