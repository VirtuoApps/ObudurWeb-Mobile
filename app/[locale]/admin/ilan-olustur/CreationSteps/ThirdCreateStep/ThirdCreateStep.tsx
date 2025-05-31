import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { useListingForm } from "../CreationSteps";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import GoBackButton from "../../GoBackButton/GoBackButton";

interface Language {
  _id: string;
  code: string;
  name: string;
  nativeName: string;
  isDefault: boolean;
}

interface PlaceSuggestion {
  description: string;
  placeId: string;
}

export default function ThirdCreateStep() {
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("tr");
  const [languages, setLanguages] = useState<Language[]>([
    {
      _id: "1",
      code: "tr",
      name: "Turkish",
      nativeName: "Türkçe",
      isDefault: true,
    },
    {
      _id: "2",
      code: "en",
      name: "English",
      nativeName: "English",
      isDefault: false,
    },
  ]);

  // Use context for form state and navigation
  const {
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
    setCurrentStep,
  } = useListingForm();

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

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCuWfmRQouyhfUcovYc33TeAvn5kZFeRTs",
  });

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
          )}&language=${selectedLanguage}`
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
  }, [searchInput, selectedLanguage]);

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
    setIsSearching(true);
    setShowSuggestions(false);

    try {
      // Get place details
      const response = await fetch(`/api/places/details?place_id=${placeId}`);

      const data = await response.json();

      if (data.status === "OK" && data.result) {
        const result = data.result;

        if (result.geometry && result.geometry.location) {
          const { lat, lng } = result.geometry.location;

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
            mapInstance.setCenter({ lat, lng });
            mapInstance.setZoom(16);
          }

          // Process address components
        }
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Function to update address fields from address components
  const updateAddressFromComponents = (addressComponents: any[]) => {
    // Extract country
    const countryComponent = addressComponents.find(
      (component: { types: string[]; long_name: string }) =>
        component.types.includes("country")
    );
    if (countryComponent) {
      setCountry((prev) => ({
        ...prev,
        tr: countryComponent.long_name,
        en: countryComponent.long_name,
      }));
    }

    // Extract city
    const cityComponent = addressComponents.find(
      (component: { types: string[]; long_name: string }) =>
        component.types.includes("locality")
    );
    if (cityComponent) {
      setCity((prev) => ({
        ...prev,
        tr: cityComponent.long_name,
        en: cityComponent.long_name,
      }));
    }

    // Extract state/district
    const districtComponent = addressComponents.find(
      (component: { types: string[]; long_name: string }) =>
        component.types.includes("administrative_area_level_2")
    );
    if (districtComponent) {
      setState((prev) => ({
        ...prev,
        tr: districtComponent.long_name,
        en: districtComponent.long_name,
      }));
    }

    // Extract street
    const streetComponent = addressComponents.find(
      (component: { types: string[]; long_name: string }) =>
        component.types.includes("route")
    );
    if (streetComponent) {
      setStreet((prev) => ({
        ...prev,
        tr: streetComponent.long_name,
        en: streetComponent.long_name,
      }));
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

  // Handle language-specific input changes for text fields
  const handleLanguageSpecificChange = (field: string, value: string) => {
    switch (field) {
      case "country":
        setCountry((prev) => ({
          ...prev,
          [selectedLanguage]: value,
        }));
        break;
      case "city":
        setCity((prev) => ({
          ...prev,
          [selectedLanguage]: value,
        }));
        break;
      case "state":
        setState((prev) => ({
          ...prev,
          [selectedLanguage]: value,
        }));
        break;
      case "street":
        setStreet((prev) => ({
          ...prev,
          [selectedLanguage]: value,
        }));
        break;
      default:
        break;
    }
  };

  // Get current language value for a field
  const getLanguageValue = (
    field: { [key: string]: string } | undefined
  ): string => {
    if (!field) return "";
    return field[selectedLanguage] || "";
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

    if (!street || !street.tr || !street.en) {
      newErrors.push("Lütfen sokak bilgisini Türkçe ve İngilizce olarak girin");
    }

    if (!buildingNo) {
      newErrors.push("Lütfen bina numarasını girin");
    }

    if (!postalCode) {
      newErrors.push("Lütfen posta kodunu girin");
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

  return (
    <div className="min-h-screen bg-[#ECEBF4] flex justify-center items-start p-4">
      <div className="w-full max-w-[1200px] rounded-2xl shadow-lg bg-white">
        <div className="flex flex-col md:flex-row p-10">
          {/* Left Info Panel - 30% width on desktop */}
          <div className="w-full md:w-[30%] mb-8 md:mb-0 md:pr-6 flex flex-col">
            <h1 className="text-2xl font-extrabold leading-tight text-[#362C75]">
              Adres bilgilerini girin.
            </h1>
            <div className="mt-4 text-base  text-[#595959] font-medium">
              <p className="leading-[140%]">
                İlan vereceğiniz mülkün kategorilerini belirtin.
                <br />
                <br />
                İlan Başlığı ve İlan Açıklaması için farklı dillerde yapacağınız
                girişler ilanın anlaşılırlığını artıracaktır gibi bir açıklama
                metni.
              </p>
            </div>
            <div className="mt-6">
              <div className="flex gap-2 flex-wrap">
                {languages.map((language) => (
                  <button
                    key={language._id}
                    type="button"
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full transition border border-[#6656AD] text-[#6656AD] ${
                      selectedLanguage === language.code
                        ? "bg-[#EBEAF1] "
                        : "bg-transparent "
                    }`}
                    onClick={() => setSelectedLanguage(language.code)}
                  >
                    {language.nativeName}
                  </button>
                ))}
              </div>
            </div>
            <GoBackButton handleBack={handleBack} step={3} totalSteps={5} />
          </div>

          {/* Right Form Panel - 70% width on desktop */}
          <div className="w-full md:w-[70%] md:pl-6">
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

            {/* Country and City */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="country"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Ülke {selectedLanguage === "en" ? "(English)" : "(Türkçe)"}
                </label>
                <input
                  type="text"
                  id="country"
                  value={getLanguageValue(country)}
                  onChange={(e) =>
                    handleLanguageSpecificChange("country", e.target.value)
                  }
                  className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                  placeholder={selectedLanguage === "en" ? "Country" : "Ülke"}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="city"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Şehir {selectedLanguage === "en" ? "(English)" : "(Türkçe)"}
                </label>
                <input
                  type="text"
                  id="city"
                  value={getLanguageValue(city)}
                  onChange={(e) =>
                    handleLanguageSpecificChange("city", e.target.value)
                  }
                  className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                  placeholder={selectedLanguage === "en" ? "City" : "Şehir"}
                />
              </div>
            </div>

            {/* State and Street */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="state"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  İlçe {selectedLanguage === "en" ? "(English)" : "(Türkçe)"}
                </label>
                <input
                  type="text"
                  id="state"
                  value={getLanguageValue(state)}
                  onChange={(e) =>
                    handleLanguageSpecificChange("state", e.target.value)
                  }
                  className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                  placeholder={selectedLanguage === "en" ? "District" : "İlçe"}
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="street"
                  className="font-semibold block mb-2 text-[#262626]"
                >
                  Sokak {selectedLanguage === "en" ? "(English)" : "(Türkçe)"}
                </label>
                <input
                  type="text"
                  id="street"
                  value={getLanguageValue(street)}
                  onChange={(e) =>
                    handleLanguageSpecificChange("street", e.target.value)
                  }
                  className="w-full h-12 rounded-lg border border-gray-300 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6656AD]/40 text-[#262626]"
                  placeholder={selectedLanguage === "en" ? "Street" : "Sokak"}
                />
              </div>
            </div>

            {/* Building No, Apartment No, and Postal Code */}
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

            {/* Google Maps Section */}
            <div className="mb-6">
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
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={14}
                    onClick={handleMapClick}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
                      streetViewControl: false,
                      mapTypeControl: false,
                    }}
                  >
                    <Marker
                      position={center}
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
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <p>Harita yükleniyor...</p>
                  </div>
                )}
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

            {/* Step navigation buttons */}
            <div className="mt-10 flex flex-col sm:flex-row justify-end items-center">
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
      </div>
    </div>
  );
}
