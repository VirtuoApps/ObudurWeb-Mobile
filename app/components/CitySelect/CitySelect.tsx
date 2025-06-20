import { useState, useEffect, useRef } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useTranslations } from "next-intl";

type CitySelectProps = {
  selectedCity: any | null;
  setSelectedCity: (city: any) => void;
  isMobileMenu?: boolean;
  defaultText?: string;
  extraClassName?: string;
};

interface City {
  id: string;
  name: string;
  plateCode: string;
}

// Comprehensive list of Turkish cities
const TURKISH_CITIES: City[] = [
  { id: "01", name: "Adana", plateCode: "01" },
  { id: "02", name: "Adıyaman", plateCode: "02" },
  { id: "03", name: "Afyonkarahisar", plateCode: "03" },
  { id: "04", name: "Ağrı", plateCode: "04" },
  { id: "05", name: "Amasya", plateCode: "05" },
  { id: "06", name: "Ankara", plateCode: "06" },
  { id: "07", name: "Antalya", plateCode: "07" },
  { id: "08", name: "Artvin", plateCode: "08" },
  { id: "09", name: "Aydın", plateCode: "09" },
  { id: "10", name: "Balıkesir", plateCode: "10" },
  { id: "11", name: "Bilecik", plateCode: "11" },
  { id: "12", name: "Bingöl", plateCode: "12" },
  { id: "13", name: "Bitlis", plateCode: "13" },
  { id: "14", name: "Bolu", plateCode: "14" },
  { id: "15", name: "Burdur", plateCode: "15" },
  { id: "16", name: "Bursa", plateCode: "16" },
  { id: "17", name: "Çanakkale", plateCode: "17" },
  { id: "18", name: "Çankırı", plateCode: "18" },
  { id: "19", name: "Çorum", plateCode: "19" },
  { id: "20", name: "Denizli", plateCode: "20" },
  { id: "21", name: "Diyarbakır", plateCode: "21" },
  { id: "22", name: "Edirne", plateCode: "22" },
  { id: "23", name: "Elazığ", plateCode: "23" },
  { id: "24", name: "Erzincan", plateCode: "24" },
  { id: "25", name: "Erzurum", plateCode: "25" },
  { id: "26", name: "Eskişehir", plateCode: "26" },
  { id: "27", name: "Gaziantep", plateCode: "27" },
  { id: "28", name: "Giresun", plateCode: "28" },
  { id: "29", name: "Gümüşhane", plateCode: "29" },
  { id: "30", name: "Hakkâri", plateCode: "30" },
  { id: "31", name: "Hatay", plateCode: "31" },
  { id: "32", name: "Isparta", plateCode: "32" },
  { id: "33", name: "Mersin", plateCode: "33" },
  { id: "34", name: "İstanbul", plateCode: "34" },
  { id: "35", name: "İzmir", plateCode: "35" },
  { id: "36", name: "Kars", plateCode: "36" },
  { id: "37", name: "Kastamonu", plateCode: "37" },
  { id: "38", name: "Kayseri", plateCode: "38" },
  { id: "39", name: "Kırklareli", plateCode: "39" },
  { id: "40", name: "Kırşehir", plateCode: "40" },
  { id: "41", name: "Kocaeli", plateCode: "41" },
  { id: "42", name: "Konya", plateCode: "42" },
  { id: "43", name: "Kütahya", plateCode: "43" },
  { id: "44", name: "Malatya", plateCode: "44" },
  { id: "45", name: "Manisa", plateCode: "45" },
  { id: "46", name: "Kahramanmaraş", plateCode: "46" },
  { id: "47", name: "Mardin", plateCode: "47" },
  { id: "48", name: "Muğla", plateCode: "48" },
  { id: "49", name: "Muş", plateCode: "49" },
  { id: "50", name: "Nevşehir", plateCode: "50" },
  { id: "51", name: "Niğde", plateCode: "51" },
  { id: "52", name: "Ordu", plateCode: "52" },
  { id: "53", name: "Rize", plateCode: "53" },
  { id: "54", name: "Sakarya", plateCode: "54" },
  { id: "55", name: "Samsun", plateCode: "55" },
  { id: "56", name: "Siirt", plateCode: "56" },
  { id: "57", name: "Sinop", plateCode: "57" },
  { id: "58", name: "Sivas", plateCode: "58" },
  { id: "59", name: "Tekirdağ", plateCode: "59" },
  { id: "60", name: "Tokat", plateCode: "60" },
  { id: "61", name: "Trabzon", plateCode: "61" },
  { id: "62", name: "Tunceli", plateCode: "62" },
  { id: "63", name: "Şanlıurfa", plateCode: "63" },
  { id: "64", name: "Uşak", plateCode: "64" },
  { id: "65", name: "Van", plateCode: "65" },
  { id: "66", name: "Yozgat", plateCode: "66" },
  { id: "67", name: "Zonguldak", plateCode: "67" },
  { id: "68", name: "Aksaray", plateCode: "68" },
  { id: "69", name: "Bayburt", plateCode: "69" },
  { id: "70", name: "Karaman", plateCode: "70" },
  { id: "71", name: "Kırıkkale", plateCode: "71" },
  { id: "72", name: "Batman", plateCode: "72" },
  { id: "73", name: "Şırnak", plateCode: "73" },
  { id: "74", name: "Bartın", plateCode: "74" },
  { id: "75", name: "Ardahan", plateCode: "75" },
  { id: "76", name: "Iğdır", plateCode: "76" },
  { id: "77", name: "Yalova", plateCode: "77" },
  { id: "78", name: "Karabük", plateCode: "78" },
  { id: "79", name: "Kilis", plateCode: "79" },
  { id: "80", name: "Osmaniye", plateCode: "80" },
  { id: "81", name: "Düzce", plateCode: "81" },
];

export default function CitySelect({
  selectedCity,
  setSelectedCity,
  isMobileMenu = false,
  defaultText = "Şehir",
  extraClassName = "",
}: CitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("common");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);

  const buttonRef = useRef<HTMLButtonElement>(null);

  // Filter cities based on search query
  useEffect(() => {
    if (searchQuery.length === 0) {
      setFilteredCities(TURKISH_CITIES);
    } else {
      const filtered = TURKISH_CITIES.filter((city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [searchQuery]);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setShowSearch(false);
    setIsOpen(false);
    setSearchQuery("");
    // Close the popover programmatically
    buttonRef.current?.click();
  };

  useEffect(() => {
    // When popover closes, reset search query
    if (!isOpen) {
      setSearchQuery("");
    }
    // When popover opens after a selection has been made
    if (isOpen && !showSearch) {
      // Next time show search
      setShowSearch(true);
    }
  }, [isOpen, showSearch]);

  // Sort cities alphabetically
  const sortedCities = [...filteredCities].sort((a, b) =>
    a.name.localeCompare(b.name, "tr")
  );

  return (
    <Popover className="relative w-full">
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
              className={`flex items-center text-gray-700 px-3 py-1.5 text-sm cursor-pointer outline-none ${
                isMobileMenu
                  ? "w-full border rounded-md border-gray-200 justify-between"
                  : "w-full"
              } ${extraClassName}`}
            >
              <div
                className={`flex items-center ${
                  isMobileMenu ? "flex-1" : "flex-1"
                }`}
              >
                {isOpen && showSearch ? (
                  <>
                    <MagnifyingGlassIcon className="h-4 w-4 mr-1 text-gray-500 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t("citySearchPlaceholder")}
                      className="outline-none w-full bg-transparent"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        // Prevent space from closing the popover
                        if (e.key === " ") {
                          e.preventDefault();
                          // Manually add space to the input value
                          const input = e.target as HTMLInputElement;
                          const start = input.selectionStart || 0;
                          const end = input.selectionEnd || 0;
                          const newValue =
                            searchQuery.slice(0, start) +
                            " " +
                            searchQuery.slice(end);
                          setSearchQuery(newValue);
                          // Set cursor position after the space
                          setTimeout(() => {
                            input.setSelectionRange(start + 1, start + 1);
                          }, 0);
                        }
                      }}
                      onKeyUp={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  </>
                ) : (
                  <>
                    <span className="truncate text-[#8C8C8C]">
                      {selectedCity ? selectedCity.name : defaultText}
                    </span>
                  </>
                )}
              </div>
              {!isOpen && (
                <img src="/chevron-down.png" className="w-[24px] h-[24px]" />
              )}
            </PopoverButton>

            <PopoverPanel
              transition
              className={`absolute z-20 mt-2 w-full transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in`}
            >
              <div className="w-full flex-auto overflow-hidden rounded-[16px] bg-white text-sm/6 shadow-lg ring-1 ring-gray-900/5 max-h-64 overflow-y-auto">
                <div className="p-2">
                  {sortedCities.length > 0 ? (
                    sortedCities.map((city) => (
                      <div
                        key={city.id}
                        className="group relative flex gap-x-6 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleCitySelect(city)}
                      >
                        <div className="flex-1">
                          <div className="font-normal text-[#595959] flex items-center">
                            {city.name}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500">
                      Şehir bulunamadı
                    </div>
                  )}
                </div>
              </div>
            </PopoverPanel>
          </>
        );
      }}
    </Popover>
  );
}
