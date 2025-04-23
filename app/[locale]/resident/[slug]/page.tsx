import GeneralInfo from "./GeneralInfo/GeneralInfo";
import Header from "./Header/Header";
import Images from "./Images/Images";

export default function ResidentPage() {
  return (
    <>
      <Header />
      <Images />
      <div className="flex md:flex-row flex-col">
        <div className="md:w-8/12 w-full">
          <GeneralInfo />
        </div>

        <div className="md:w-4/12 w-full"></div>
      </div>
    </>
  );
}
