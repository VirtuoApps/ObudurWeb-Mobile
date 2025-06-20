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
  const [showTypeWarning, setShowTypeWarning] = useState(false);

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
    if (!selectedPropertyType) {
      setShowTypeWarning(true);
      setTimeout(() => setShowTypeWarning(false), 2000);
      return;
    }
    setSelectedCategory(category);
    setIsOpen(false);
    buttonRef.current?.click();
  };

  // Emlak tipi x ile sıfırlanırsa kategori de sıfırlansın
  useEffect(() => {
    if (!selectedPropertyType && selectedCategory) {
      setSelectedCategory(null);
    }
  }, [selectedPropertyType]);

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
    <div>
      <GeneralSelect
        selectedItem={selectedCategory}
        onSelect={handleCategorySelect}
        options={categories}
        defaultText={t("category")}
        extraClassName={`min-w-[180px] transition-all duration-300 ${selectedCategory ? "text-[#262626]" : "text-[#8c8c8c]"} ${selectedPropertyType ? "hover:text-[#595959]" : ""}`}
        customTextColor={true}
        popoverExtraClassName="max-w-[250px]"
        maxHeight="300"
        disabled={!selectedPropertyType}
      />
      {showTypeWarning && (
        <div className="text-xs text-[#EF1A28] mt-1">Önce emlak tipi seçmelisiniz.</div>
      )}
    </div>
  );
}
