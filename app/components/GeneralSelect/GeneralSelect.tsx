import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";

import { useTranslations } from "next-intl";

type GeneralSelectProps = {
  selectedItem: any;
  onSelect: (item: any) => void;
  options: any[];
  defaultText: string;
  extraClassName?: string;
  popoverMaxWidth?: string;
  popoverMaxWidthMobile?: string;
  maxHeight?: string;
  customTextColor?: boolean;
  popoverExtraClassName?: string;
  disabled?: boolean;
  showClearButton?: boolean;
};

export default function GeneralSelect({
  selectedItem,
  onSelect,
  options,
  defaultText,
  extraClassName,
  popoverMaxWidth,
  popoverMaxWidthMobile,
  maxHeight,
  customTextColor,
  popoverExtraClassName,
  disabled = false,
  showClearButton = true,
}: GeneralSelectProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchStringRef = useRef("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const t = useTranslations("propertyTypes");

  useEffect(() => {
    if (!isOpen) {
      searchStringRef.current = "";
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      setHighlightedIndex(-1);
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.length > 1) {
        return; // Ignore keys like Shift, Enter, etc.
      }
      event.preventDefault();

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchStringRef.current += event.key.toLowerCase();

      searchTimeoutRef.current = setTimeout(() => {
        searchStringRef.current = "";
      }, 1000); // Reset search string after 1s of inactivity

      const matchingOptionIndex = options.findIndex((option) =>
        option.name.toLowerCase().startsWith(searchStringRef.current)
      );

      if (matchingOptionIndex !== -1) {
        setHighlightedIndex(matchingOptionIndex);
        if (panelRef.current) {
          const optionElement = panelRef.current.querySelector(
            `#select-option-${matchingOptionIndex}`
          );
          if (optionElement) {
            optionElement.scrollIntoView({
              block: "nearest",
              inline: "start",
            });
          }
        }
      } else {
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [isOpen, options]);

  const handleSelect = (option: any, shouldClose: boolean = true) => {
    if (shouldClose) {
      buttonRef.current?.click();
    }
    onSelect(option);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect(null);
    // Force close the popover without triggering button click
    if (buttonRef.current) {
      buttonRef.current.blur();
    }
  };

  return (
    <Popover className="relative">
      {({ open }) => {
        useEffect(() => {
          setIsOpen(open);
        }, [open]);
        return (
          <>
            <PopoverButton
              ref={buttonRef}
              className={`${
                open ? "bg-[#F5F5F5]" : ""
              } flex items-center justify-between shrink-0 px-3 py-3 text-sm ${extraClassName} ${
                !customTextColor ? "text-gray-700" : ""
              } cursor-pointer rounded-[8px] outline-none ${
                disabled ? "cursor-not-allowed opacity-60" : ""
              }`}
              disabled={disabled}
              onClick={disabled ? (e) => e.preventDefault() : undefined}
              tabIndex={disabled ? -1 : 0}
            >
              <div className="flex items-center">
                <span className="truncate">
                  {selectedItem ? selectedItem.name : defaultText}
                </span>
              </div>
              {selectedItem && !popoverExtraClassName?.includes("mobile") && showClearButton ? (
                <button
                  type="button"
                  className="ml-2 p-1 rounded hover:bg-gray-100 transition cursor-pointer"
                  onClick={handleClear}
                  tabIndex={-1}
                  disabled={disabled}
                >
                  <XMarkIcon className="w-5 h-5 text-[#8C8C8C]" />
                </button>
              ) : (
                <img
                  src="/chevron-down.png"
                  className={`w-[24px] h-[24px] ${open ? "rotate-180" : ""} ${
                    disabled ? "opacity-60" : ""
                  }`}
                />
              )}
            </PopoverButton>

            <PopoverPanel
              className={`absolute left-0 z-50 mt-2 flex w-full transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in ${popoverExtraClassName}`}
            >
              <div className="w-full  flex-auto overflow-hidden rounded-[8px] bg-white text-sm/6 shadow-2xl border border-[#D9D9D9] ring-1 ring-gray-900/5 ">
                <div
                  ref={panelRef}
                  className="overflow-y-auto"
                  style={{
                    maxHeight: maxHeight ? `${maxHeight}px` : "auto",
                  }}
                  onMouseLeave={() => setHighlightedIndex(-1)}
                >
                  {options.map((option, index) => (
                    <div
                      key={option.id ?? index}
                      id={`select-option-${index}`}
                      className={`group relative flex items-center gap-x-6 rounded-lg p-4 py-3 cursor-pointer ${
                        index === highlightedIndex ? "bg-gray-50" : ""
                      }`}
                      onClick={() => handleSelect(option)}
                      onMouseEnter={() => setHighlightedIndex(index)}
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
