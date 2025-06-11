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
  source?: LocalizedText;
  generalFeatures?: LocalizedText;
  deedStatus?: LocalizedText;
  zoningStatus?: LocalizedText;
  heatingType?: LocalizedText;
  usageStatus?: LocalizedText;
  adaNo?: string;
  parselNo?: string;
  exchangeable?: boolean;
  creditEligible?: any;
  buildingAge?: number;
  isFurnished?: boolean;
  dues?: any;
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
        <div className="max-w-[1472px] mx-auto px-6">
          <div className="flex md:flex-row flex-col items-start mt-12">
            <div className="md:w-[70%] w-full md:pr-6">
              <GeneralInfo />
              <Descriptions />
              <Details />
              <FeaturesEquipment />
              {video && <PanoramicView video={video} />}
              <Location />
              <PlansAndDocumentation
                documents={hotelData.hotelDetails.documents}
              />
            </div>

            <div className="md:w-[30%] w-full md:pl-6 mt-8 md:mt-0">
              <ContactBox hotelData={hotelData} />
            </div>
          </div>
        </div>
        <Footer
          customMaxWidth="max-w-[1472px]"
          customPadding="md:px-10 px-6"
          fullWidthTopBorder={true}
          fullWidthBottomBorder={true}
          fullWidthStripe={true}
        />
      </div>
    </ClientWrapper>
  );
}
