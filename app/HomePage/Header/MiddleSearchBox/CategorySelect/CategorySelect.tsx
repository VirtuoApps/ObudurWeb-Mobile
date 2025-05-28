import { useState, useEffect, useRef } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { TagIcon } from "@heroicons/react/24/outline";
import { useTranslations, useLocale } from "next-intl";
import { FilterOptions, HotelCategory } from "@/types/filter-options.type";
import GeneralSelect from "@/app/components/GeneralSelect/GeneralSelect";
import axiosInstance from "@/axios";

type CategorySelectProps = {
  selectedCategory?: any | null;
  setSelectedCategory?: (category: any) => void;
  filterOptions: FilterOptions;
  selectedPropertyType?: any | null;
  setSelectedPropertyType?: (propertyType: any) => void;
};

// Type for API response
interface CategoryApiResponse {
  _id: string;
  name: Record<string, string>;
  hotelTypeId: string;
  type: {
    _id: string;
    name: Record<string, string>;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function CategorySelect({
  selectedCategory = null,
  setSelectedCategory = () => {},
  filterOptions,
  selectedPropertyType = null,
  setSelectedPropertyType = () => {},
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<CategoryApiResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const locale = useLocale();
  const t = useTranslations("categories");

  // Fetch all categories when component mounts or when property type is not selected
  useEffect(() => {
    const fetchAllCategories = async () => {
      if (selectedPropertyType) return; // Don't fetch if property type is selected

      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          "/admin/hotel-categories/all-options"
        );
        setAllCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setAllCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCategories();
  }, [selectedPropertyType]);

  const handleCategorySelect = (category: (typeof categories)[0]) => {
    setSelectedCategory(category);

    // If property type is not selected and we have category's hotel type info,
    // automatically select the property type
    if (!selectedPropertyType && category.originalData?.type) {
      const hotelType = category.originalData.type;

      const formattedHotelType = {
        _id: hotelType._id,
        name:
          (hotelType.name as any)[locale] ||
          hotelType.name.tr ||
          hotelType.name.en,
        href: "#",
        originalData: hotelType,
      };
      setSelectedPropertyType(formattedHotelType);
    }

    setIsOpen(false);
    buttonRef.current?.click();
  };

  // Determine which categories to show
  const categories = selectedPropertyType?.originalData?.categories
    ? // If property type is selected, show only its categories
      selectedPropertyType.originalData.categories.map(
        (category: HotelCategory) => ({
          _id: category._id,
          name:
            (category.name as any)[locale] ||
            category.name.tr ||
            category.name.en ||
            `Category ${category._id.slice(-4)}`,
          href: "#",
          originalData: category,
        })
      )
    : // If no property type is selected, show all categories from API
      allCategories.map((category: CategoryApiResponse) => ({
        _id: category._id,
        name:
          (category.name as any)[locale] ||
          category.name.tr ||
          category.name.en ||
          `Category ${category._id.slice(-4)}`,
        href: "#",
        originalData: category,
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
