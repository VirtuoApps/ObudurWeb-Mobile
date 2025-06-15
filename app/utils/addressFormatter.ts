import { Hotel, MultilingualText } from "@/types/hotel.type";

/**
 * Formats a hotel address using detailed address components
 * @param hotel - Hotel object containing address fields
 * @param language - Language code for localization
 * @returns Formatted address string
 */
export const formatAddress = (
  hotel: {
    street: MultilingualText;
    buildingNo: string;
    apartmentNo: string;
    city: MultilingualText;
    state: MultilingualText;
    postalCode: string;
    country: MultilingualText;
  },
  language: string = "en"
) => {
  const parts = [];
  console.log(hotel);

  // Helper function to get localized text
  const getLocalizedText = (textObj: any) => {
    return textObj && textObj[language] ? textObj[language] : textObj?.en || "";
  };

  // il
  if (hotel.state) parts.push(getLocalizedText(hotel.state));
  // ilce
  if (hotel.city) parts.push(getLocalizedText(hotel.city));
  // sokak
  if (hotel.street) parts.push(getLocalizedText(hotel.street));

  return parts.filter(Boolean).join(", ");
};
