import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useTranslations, useLocale } from "next-intl";
import { FilterOptions, HotelType } from "@/types/filter-options.type";
import GeneralSelect from "@/app/components/GeneralSelect/GeneralSelect";
import axiosInstance from "@/axios";

type PropertyTypeProps = {
  selectedPropertyType?: any | null;
  setSelectedPropertyType?: (propertyType: any) => void;
  filterOptions: FilterOptions;
  setSelectedCategory?: (category: any) => void;
};

const PropertyType = forwardRef(function PropertyType(
  {
    selectedPropertyType = null,
    setSelectedPropertyType = () => {},
    filterOptions,
    setSelectedCategory = () => {},
  }: PropertyTypeProps,
  ref
) {
  const [isOpen, setIsOpen] = useState(false);
  const [hotelTypes, setHotelTypes] = useState<HotelType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const locale = useLocale();

  useImperativeHandle(ref, () => ({
    openPopover: () => setIsOpen(true),
  }));

  useEffect(() => {
    const fetchHotelTypes = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          "/admin/hotel-types/all-options"
        );
        setHotelTypes(response.data);
      } catch (error) {
        console.error("Error fetching hotel types:", error);
        setHotelTypes(filterOptions.hotelTypes || []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotelTypes();
  }, [filterOptions]);

  const propertyTypes = hotelTypes.map((hotelType) => ({
    _id: hotelType._id,
    name: (hotelType.name as any)[locale] || hotelType.name.tr,
    href: "#",
    originalData: hotelType,
  }));

  const handlePropertyTypeSelect = (
    propertyType: (typeof propertyTypes)[0]
  ) => {
    setSelectedPropertyType(propertyType);
    setSelectedCategory(null);
    setIsOpen(false);
    buttonRef.current?.click();
  };

  const t = useTranslations("propertyTypes");

  return (
    <GeneralSelect
      selectedItem={selectedPropertyType}
      onSelect={handlePropertyTypeSelect}
      options={propertyTypes}
      defaultText={t("propertyType")}
      extraClassName="min-w-[150px] text-[#8c8c8c] hover:text-[#595959] transition-all duration-300"
      popoverExtraClassName="max-w-[250px]"
      customTextColor={true}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      buttonRef={buttonRef}
    />
  );
});

export default PropertyType;
