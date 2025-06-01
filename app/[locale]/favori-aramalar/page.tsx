import Header from "../admin/Header/Header";
import Footer from "../resident/[slug]/Footer/Footer";
import FilterBox from "./FilterBox/FilterBox";
import HeaderSection from "./HeaderSection/HeaderSection";

export default function FavoriAramalarPage() {
  return (
    <div className="w-full">
      <Header />

      <div className="w-full bg-[#ebeaf1] min-h-screen">
        <HeaderSection />
        <div className="w-full fled flex-row flex-wrap max-w-[1440px] mx-auto">
          <FilterBox />
        </div>
      </div>

      <Footer />
    </div>
  );
}
