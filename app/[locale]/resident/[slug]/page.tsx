import axiosInstance from "@/axios";
import ContactBox from "./ContactBox/ContactBox";
import Descriptions from "./Descriptions/Descriptions";
import Details from "./Details/Details";
import FeaturesEquipment from "./Features/Features";
import Footer from "./Footer/Footer";
import GeneralInfo from "./GeneralInfo/GeneralInfo";
import Header from "./Header/Header";
import Images from "./Images/Images";
import Location from "./Location/Location";
import PanoramicView from "./PanoramicView/PanoramicView";
import PlansAndDocumentation from "./PlansAndDocumentation/PlansAndDocumentation";
import ClientWrapper from "./ClientWrapper";
import NotFound from "../../not-found";
import SimpleHeader from "@/app/components/SimpleHeader/SimpleHeader";
import MenuItems from "./Header/MenuItems/MenuItems";

// Types for API response
interface LocalizedText {
  tr: string;
  en: string;
}

interface Price {
  amount: number;
  currency: string;
}

interface Feature {
  _id: string;
  name: LocalizedText;
  iconUrl: string;
  featureType: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Distance {
  _id: string;
  name: Record<string, string>;
  iconUrl: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  value: number;
  typeId?: string;
}

interface LocationPoint {
  type: string;
  coordinates: number[];
}

interface HotelDetails {
  _id: string;
  no: number;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  address: LocalizedText;
  price: Price[];
  images: string[];
  roomAsText: string;
  projectArea: number;
  totalSize: number;
  buildYear: number;
  architect: string;
  kitchenType: LocalizedText;
  roomCount: number;
  bathroomCount: number;
  balconyCount: number;
  bedRoomCount: number;
  floorType: LocalizedText;
  housingType: LocalizedText;
  entranceType: LocalizedText;
  listingType: LocalizedText;
  featureIds: string[];
  distances: { typeId: string; value: number }[];
  location: LocationPoint;
  documents: {
    name: LocalizedText;
    file: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  city: LocalizedText;
  country: LocalizedText;
  floorCount: number;
  state: LocalizedText;
  street: LocalizedText;
  buildingNo: string;
  apartmentNo: string;
  postalCode: string;
  video: string;
  isPublished: boolean;
}

interface PopulatedData {
  generalFeatures: Feature[];
  insideFeatures: Feature[];
  outsideFeatures: Feature[];
  quickFilters: Feature[];
  distances: Distance[];
}

interface HotelResponse {
  hotelDetails: HotelDetails;
  populatedData: PopulatedData;
}

// Export these interfaces for use in other components
export type {
  LocalizedText,
  Price,
  Feature,
  Distance,
  LocationPoint,
  HotelDetails,
  PopulatedData,
  HotelResponse,
};

export default async function ResidentPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const currentLocale = locale || "en";

  const hotelDataResponse = await axiosInstance.get(`hotels/${slug}`);
  const hotelData: HotelResponse = hotelDataResponse.data;

  if (!hotelData.hotelDetails.isPublished) {
    return <NotFound />;
  }

  const video = hotelData.hotelDetails.video;

  return (
    <ClientWrapper hotelData={hotelData} locale={currentLocale}>
      <Header />
      <div className="w-full block md:hidden">
        <SimpleHeader showBackButton />
      </div>
      <div className="block md:hidden w-full">
        <MenuItems />
      </div>
      <div className="md:pt-[80px]">
        <Images />
        <div className="flex md:flex-row flex-col items-start mt-12">
          <div className="md:w-[70%] w-full">
            <GeneralInfo />
            <Descriptions />
            <Details />
            <FeaturesEquipment />
            {video && <PanoramicView video={video} />}
            <Location />
            {hotelData.hotelDetails.documents.length > 0 && (
              <PlansAndDocumentation
                documents={hotelData.hotelDetails.documents}
              />
            )}
          </div>

          <div className="md:w-[30%] w-full p-4 pt-2">
            <ContactBox hotelData={hotelData} />
          </div>
        </div>

        <div className="md:w-[70%] w-full mx-auto">
          <Footer customClassName="w-full max-w-full px-6" />
        </div>
      </div>
    </ClientWrapper>
  );
}
