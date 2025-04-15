import React from "react";

type Property = {
  price: string;
};

export default function HomeDetailsPopup({
  selectedProperty,
}: {
  selectedProperty: Property;
}) {
  return (
    <div>
      <h2 className="text-black">Property Details</h2>
      <p className="text-black">Price: {selectedProperty.price}</p>
    </div>
  );
}
