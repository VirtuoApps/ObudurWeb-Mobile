import { useState, useEffect, useRef } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useTranslations, useLocale } from "next-intl";
import { FilterOptions } from "@/types/filter-options.type";
import GeneralSelect from "@/app/components/GeneralSelect/GeneralSelect";

type PropertyTypeProps = {
  selectedPropertyType?: any | null;
  setSelectedPropertyType?: (propertyType: any) => void;
  filterOptions: FilterOptions;
};

export default function PropertyType({
  selectedPropertyType = null,
  setSelectedPropertyType = () => {},
  filterOptions,
}: PropertyTypeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const locale = useLocale();

  const propertyTypes = filterOptions.housingType.map((propertyType) => ({
    name: (propertyType as any)[locale],
    href: "#",
  }));

  const handlePropertyTypeSelect = (
    propertyType: (typeof propertyTypes)[0]
  ) => {
    setSelectedPropertyType(propertyType);
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
      extraClassName="min-w-[150px]"
      popoverMaxWidth="250"
    />
  );
}
