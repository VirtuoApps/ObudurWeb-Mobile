import { useState, useEffect, useRef } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { TagIcon } from "@heroicons/react/24/outline";
import { useTranslations, useLocale } from "next-intl";
import { FilterOptions } from "@/types/filter-options.type";

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
    <Popover className="relative">
      {({ open }) => {
        useEffect(() => {
          if (open !== isOpen) {
            setIsOpen(open);
          }
        }, [open, isOpen]);

        return (
          <>
            <PopoverButton
              ref={buttonRef}
              className="flex items-center justify-between text-gray-700 px-3 py-1.5 text-sm min-w-[120px] cursor-pointer"
            >
              <div className="flex items-center">
                <span className="truncate">
                  {selectedCategory ? selectedCategory.name : t("category")}
                </span>
              </div>
              <ChevronDownIcon className="h-4 w-4 ml-2" />
            </PopoverButton>

            <PopoverPanel className="absolute left-1/2 z-20 mt-2 flex w-screen max-w-xs -translate-x-1/2 px-4 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
              <div className="w-full max-w-md flex-auto overflow-hidden rounded-xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className="group relative flex items-center gap-x-6 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleCategorySelect(category)}
                    >
                      <div className="mt-1 flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <TagIcon
                          className="h-5 w-5 text-gray-600 group-hover:text-indigo-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {category.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverPanel>
          </>
        );
      }}
    </Popover>
  );
}
