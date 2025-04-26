import ContactBox from "./ContactBox/ContactBox";
import Descriptions from "./Descriptions/Descriptions";
import Details from "./Details/Details";
import FeaturesEquipment from "./Features/Features";
import GeneralInfo from "./GeneralInfo/GeneralInfo";
import Header from "./Header/Header";
import Images from "./Images/Images";
import Location from "./Location/Location";
import PanoramicView from "./PanoramicView/PanoramicView";

export default function ResidentPage() {
  return (
    <>
      <Header />
      <Images />
      <div className="flex md:flex-row flex-col items-start mt-12">
        <div className="md:w-[70%] w-full">
          <GeneralInfo />
          <Descriptions />
          <Details />
          <FeaturesEquipment />
          <PanoramicView />
          <Location />
        </div>

        <div className="md:w-[30%] w-full p-4 pt-2">
          <ContactBox />
        </div>
      </div>
    </>
  );
}
