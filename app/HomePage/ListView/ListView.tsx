import React from "react";
import ResidentBox from "./ResidentBox/ResidentBox";

export default function ListView() {
  const dummyData = [
    {
      id: 1,
      type: "forSale",
      isOptinable: true,
      residentTypeName: "Modern Villa",
      title: "Comfortable Villa in Green",
      price: "$1,420,000",
      bedCount: "4+1",
      floorCount: "2",
      area: "240m²",
      locationText: "814 E Highland Dr, Seattle, WA 98102",
      image: "/example-house.png",
      isFavorite: false,
    },
    {
      id: 2,
      type: "forRent",
      isOptinable: false,
      residentTypeName: "Lüks Daire",
      title: "Panoramic View Apartment",
      price: "$2,500/ay",
      bedCount: "3+1",
      floorCount: "12",
      area: "180m²",
      locationText: "235 Queen Anne Ave, Seattle, WA 98109",
      isFavorite: true,
    },
    {
      id: 3,
      type: "forSale",
      isOptinable: false,
      residentTypeName: "Bahçeli Ev",
      title: "Cozy Garden House",
      price: "$850,000",
      bedCount: "3+1",
      floorCount: "1",
      area: "160m²",
      locationText: "1234 Lake City Way, Seattle, WA 98125",
      isFavorite: false,
    },
    {
      id: 4,
      type: "forSale",
      isOptinable: true,
      residentTypeName: "Müstakil Ev",
      title: "Family Home with Pool",
      price: "$1,150,000",
      bedCount: "5+1",
      floorCount: "2",
      area: "320m²",
      locationText: "5678 Greenwood Ave, Seattle, WA 98103",
      isFavorite: false,
    },
    {
      id: 5,
      type: "forRent",
      isOptinable: false,
      residentTypeName: "Stüdyo Daire",
      title: "Downtown Studio Apartment",
      price: "$1,800/ay",
      bedCount: "1+0",
      floorCount: "8",
      area: "65m²",
      locationText: "910 Pike St, Seattle, WA 98101",
      isFavorite: true,
    },
    {
      id: 6,
      type: "forSale",
      isOptinable: false,
      residentTypeName: "Dubleks Daire",
      title: "Modern Duplex with Terrace",
      price: "$980,000",
      bedCount: "4+1",
      floorCount: "2",
      area: "210m²",
      locationText: "1122 Ballard Ave, Seattle, WA 98107",
      isFavorite: false,
    },
    {
      id: 7,
      type: "forRent",
      isOptinable: true,
      residentTypeName: "Rezidans",
      title: "Luxury Residence with Services",
      price: "$3,200/ay",
      bedCount: "2+1",
      floorCount: "18",
      area: "145m²",
      locationText: "3344 Bellevue Way, Bellevue, WA 98004",
      isFavorite: false,
    },
    {
      id: 8,
      type: "forSale",
      isOptinable: false,
      residentTypeName: "Villa",
      title: "Waterfront Villa with Dock",
      price: "$2,950,000",
      bedCount: "6+2",
      floorCount: "3",
      area: "480m²",
      locationText: "5566 Lake Washington Blvd, Kirkland, WA 98033",
      isFavorite: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white border border-t pt-7 px-2 pb-28">
      {dummyData.map((item) => (
        <ResidentBox
          key={item.id}
          type={item.type}
          isOptinable={item.isOptinable}
          residentTypeName={item.residentTypeName}
          title={item.title}
          price={item.price}
          bedCount={item.bedCount}
          floorCount={item.floorCount}
          area={item.area}
          locationText={item.locationText}
          image={item.image}
          isFavorite={item.isFavorite}
        />
      ))}
    </div>
  );
}
