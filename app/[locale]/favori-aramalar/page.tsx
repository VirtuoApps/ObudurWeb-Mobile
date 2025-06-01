import Header from "../admin/Header/Header";
import Footer from "../resident/[slug]/Footer/Footer";
import HeaderSection from "./HeaderSection/HeaderSection";

export default function FavoriAramalarPage() {
  return (
    <div className="w-full">
      <Header />

      <div className="w-full bg-[#ebeaf1] min-h-screen">
        <HeaderSection />
      </div>

      <Footer />
    </div>
  );
}
