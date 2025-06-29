import ClientWrapper from "./ClientWrapper";
import ContactBox from "./ContactBox/ContactBox";
import Descriptions from "./Descriptions/Descriptions";
import Details from "./Details/Details";
import FeaturesEquipment from "./Features/Features";
import Footer from "./Footer/Footer";
import FooterBottom from "./Footer/FooterBottom/FooterBottom";
import GeneralInfo from "./GeneralInfo/GeneralInfo";
import Header from "./Header/Header";
import Images from "./Images/Images";
import Location from "./Location/Location";
import MenuItems from "./Header/MenuItems/MenuItems";
import NotFound from "../../not-found";
import PanoramicView from "./PanoramicView/PanoramicView";
import PlansAndDocumentation from "./PlansAndDocumentation/PlansAndDocumentation";
import SimpleHeader from "@/app/components/SimpleHeader/SimpleHeader";
import axiosInstance from "@/axios";

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
  neighborhood: LocalizedText;
  street: LocalizedText;
  buildingNo: string;
  apartmentNo: string;
  postalCode: string;
  video: string;
  isPublished: boolean;
  floorPosition: {
    tr: string;
    en: string;
  };
}

interface PopulatedData {
  generalFeatures: Feature[];
  insideFeatures: Feature[];
  outsideFeatures: Feature[];
  quickFilters: Feature[];
  distances: Distance[];
  faces: Feature[];
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
      <div className="hidden xl:block">
        <Header />
      </div>
      <div className="w-full block xl:hidden">
        <SimpleHeader showBackButton showFavoriteButton />
      </div>
      <div className="block min-[1240px]:hidden w-full sticky top-0 bg-white z-10 py-3 md:px-4">
        <MenuItems />
      </div>
      <div className="min-[1240px]:pt-[80px]">
        <div id="images-section">
          <Images />
        </div>
        <div className="xl:max-w-[1472px] mx-auto mt-0  lg:-mt-12 xl:mt-0">
          <div className="flex lg:flex-row flex-col items-start mt-[16px] md:mt-[80px] justify-between px-4 gap-[32px]">
            <div className="xl:max-w-[952px] lg:max-w-[800px]">
              <GeneralInfo />
              <div id="descriptions-section" className="my-[24px] md:my-[72px]">
                <Descriptions />
              </div>
              <div className="border-b border-gray-200"></div>
              <div id="details-section" className="my-[24px] md:my-[72px]">
                <Details />
              </div>
              <div className="border-b border-gray-200"></div>
              {hotelData.hotelDetails.entranceType?.tr !== "Arsa" && (
                <>
                  <div id="features-section">
                    <FeaturesEquipment />
                  </div>
                  <div className="border-b border-gray-200"></div>
                </>
              )}
              {video && (
                <>
                  <div className="border-b border-gray-200"></div>
                  <div id="panoramic-section">
                    <PanoramicView video={video} />
                  </div>
                </>
              )}
              <div className="border-b border-gray-200"></div>
              <div id="location-section">
                <Location />
              </div>
              <div className="border-b border-gray-200"></div>
              <div id="plans-section">
                <PlansAndDocumentation
                  documents={hotelData.hotelDetails.documents}
                />
              </div>
            </div>

            <div className="lg:max-w-[342px] hidden lg:block w-full mt-8 md:mt-0 sticky top-[104px] z-20">
              <ContactBox hotelData={hotelData} />
            </div>
          </div>
        </div>
        <div className="block md:hidden">
          <Footer />
        </div>
        <div className="hidden md:block">
          <Footer />
        </div>
      </div>
    </ClientWrapper>
  );
}
