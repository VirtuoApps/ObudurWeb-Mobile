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
        <SimpleHeader showBackButton showFavoriteButton />
      </div>
      <div className="block md:hidden w-full sticky top-0 bg-white z-10 py-3">
        <MenuItems />
      </div>
      <div className="md:pt-[80px]">
        <div id="images-section">
          <Images />
        </div>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-0">
          <div className="flex md:flex-row flex-col items-start mt-[16px] md:mt-[80px] justify-between">
            <div className="md:max-w-[952px] w-full pr-6 lg:pr-0">
              <GeneralInfo />
              <div id="descriptions-section" className="my-[24px] md:my-[72px]">
                <Descriptions />
              </div>
              <div className="border-b border-gray-200"></div>
              <div id="details-section" className="my-[24px] md:my-[72px]">
                <Details />
              </div>
              <div className="border-b border-gray-200"></div>
              <div id="features-section">
                <FeaturesEquipment />
              </div>
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

            <div className="md:max-w-[362px] w-full pl-6 lg:pl-0 mt-8 md:mt-0 sticky top-[104px] z-20">
              <ContactBox hotelData={hotelData} />
            </div>
          </div>
        </div>
        <div className="block md:hidden pb-24">
          <Footer />
        </div>
        <div className="hidden md:block">
          <Footer />
        </div>
      </div>
    </ClientWrapper>
  );
}
