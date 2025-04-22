import { useState, useEffect, useRef } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { HomeIcon } from "@heroicons/react/24/outline";

export const propertyTypes = [
  { name: "Konut", description: "Ev, Daire, Villa", href: "#" },
  { name: "İş Yeri", description: "Ofis, Dükkan, Depo", href: "#" },
  { name: "Arsa", description: "Tarla, Bahçe, Arazi", href: "#" },
];

type PropertyTypeProps = {
  selectedPropertyType?: (typeof propertyTypes)[0] | null;
  setSelectedPropertyType?: (propertyType: (typeof propertyTypes)[0]) => void;
};

export default function PropertyType({
  selectedPropertyType = null,
  setSelectedPropertyType = () => {},
}: PropertyTypeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handlePropertyTypeSelect = (
    propertyType: (typeof propertyTypes)[0]
  ) => {
    setSelectedPropertyType(propertyType);
    setIsOpen(false);
    buttonRef.current?.click();
  };

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
              className="flex items-center justify-between text-gray-700 px-3 py-1.5 text-sm min-w-[120px]"
            >
              <div className="flex items-center">
                <HomeIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">
                  {selectedPropertyType
                    ? selectedPropertyType.name
                    : "Emlak Tipi"}
                </span>
              </div>
              <ChevronDownIcon className="h-4 w-4 ml-2" />
            </PopoverButton>

            <PopoverPanel className="absolute left-1/2 z-10 mt-2 flex w-screen max-w-xs -translate-x-1/2 px-4 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
              <div className="w-full max-w-md flex-auto overflow-hidden rounded-xl bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5">
                <div className="p-4">
                  {propertyTypes.map((propertyType) => (
                    <div
                      key={propertyType.name}
                      className="group relative flex gap-x-6 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handlePropertyTypeSelect(propertyType)}
                    >
                      <div className="mt-1 flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <HomeIcon
                          className="h-5 w-5 text-gray-600 group-hover:text-indigo-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {propertyType.name}
                        </div>
                        <p className="mt-1 text-gray-600">
                          {propertyType.description}
                        </p>
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
