import { useState, useEffect, useRef } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useTranslations } from "next-intl";

type GeneralSelectProps = {
  selectedItem: any;
  onSelect: (item: any) => void;
  options: any[];
  defaultText: string;
  extraClassName?: string;
  popoverMaxWidth?: string;
};

export default function GeneralSelect({
  selectedItem,
  onSelect,
  options,
  defaultText,
  extraClassName,
  popoverMaxWidth,
}: GeneralSelectProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const t = useTranslations("propertyTypes");

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
              className={`${
                isOpen ? "bg-[#F5F5F5]" : ""
              } flex items-center justify-between text-gray-700 px-3 py-3 text-sm ${extraClassName} cursor-pointer rounded-[16px] outline-none `}
            >
              <div className="flex items-center">
                <span className="truncate">
                  {selectedItem ? selectedItem.name : defaultText}
                </span>
              </div>
              <img
                src="/chevron-down.png"
                className={`w-[24px] h-[24px] ${isOpen ? "rotate-180" : ""}`}
              />
            </PopoverButton>

            <PopoverPanel
              className={`absolute left-1/2 z-50 mt-2 flex w-screen  -translate-x-1/2 px-4 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in `}
              style={{
                maxWidth: popoverMaxWidth ? `${popoverMaxWidth}px` : "200px",
              }}
            >
              <div className="w-full  flex-auto overflow-hidden rounded-[16px] bg-white text-sm/6 shadow-2xl border border-[#D9D9D9] ring-1 ring-gray-900/5 ">
                <div className="">
                  {options.map((option) => (
                    <div
                      key={option.name}
                      className="group relative flex items-center gap-x-6 rounded-lg p-4 py-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        buttonRef.current?.click();
                        onSelect(option);
                      }}
                    >
                      <div>
                        <div className="font-normal text-[#595959]">
                          {option.name}
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
