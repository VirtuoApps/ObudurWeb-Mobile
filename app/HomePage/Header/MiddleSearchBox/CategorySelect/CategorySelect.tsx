import { useState, useEffect, useRef } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { TagIcon } from "@heroicons/react/24/outline";
import { useTranslations, useLocale } from "next-intl";
import { FilterOptions } from "@/types/filter-options.type";
import GeneralSelect from "@/app/components/GeneralSelect/GeneralSelect";

type CategorySelectProps = {
  selectedCategory?: any | null;
  setSelectedCategory?: (category: any) => void;
  filterOptions: FilterOptions;
};

export default function CategorySelect({
  selectedCategory = null,
  setSelectedCategory = () => {},
  filterOptions,
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const t = useTranslations("categories");

  const handleCategorySelect = (category: (typeof categories)[0]) => {
    setSelectedCategory(category);
    setIsOpen(false);
    buttonRef.current?.click();
  };

  const categories = filterOptions.roomAsText.map((category) => ({
    name: category,
    href: "#",
  }));

  return (
    <GeneralSelect
      selectedItem={selectedCategory}
      onSelect={handleCategorySelect}
      options={categories}
      defaultText={t("category")}
      extraClassName="min-w-[150px]"
    />
  );
}
