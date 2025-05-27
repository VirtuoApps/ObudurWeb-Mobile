import React, { useState } from "react";
import { FaPlus } from "react-icons/fa"; // Assuming you have react-icons installed
import GeneralSelect from "@/app/components/GeneralSelect/GeneralSelect";

export default function FormSection() {
  const [selectedCity, setSelectedCity] = useState<any>(null);

  // Replace with your actual city options
  const cityOptions = [
    { id: "istanbul", name: "İstanbul" },
    { id: "ankara", name: "Ankara" },
    { id: "izmir", name: "İzmir" },
  ];

  const handleCitySelect = (city: any) => {
    setSelectedCity(city);
  };

  return (
    <div className="bg-white p-8">
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="name" className="sr-only">
              İsim Soyisim
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="İsim Soyisim"
              className="block w-full px-4 py-4 border border-[#F0F0F0] rounded-2xl focus:none  focus:ring-0 focus:outline-none sm:text-sm bg-[#fff] placeholder:text-[#8C8C8C] text-gray-800"
            />
          </div>
          <div>
            <label htmlFor="phone" className="sr-only">
              Telefon
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="Telefon"
              className="block w-full px-4 py-4 border border-[#F0F0F0] rounded-2xl focus:none  focus:ring-0 focus:outline-none sm:text-sm bg-[#fff] placeholder:text-[#8C8C8C] text-gray-800"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              E-Posta
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="E-Posta"
              className="block w-full px-4 py-4 border border-[#F0F0F0] rounded-2xl focus:none  focus:ring-0 focus:outline-none sm:text-sm bg-[#fff] placeholder:text-[#8C8C8C] text-gray-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <label htmlFor="city" className="sr-only">
              Şehir
            </label>
            <GeneralSelect
              selectedItem={selectedCity}
              onSelect={handleCitySelect}
              options={cityOptions}
              defaultText="Şehir"
              extraClassName="w-full px-4 py-3 border border-gray-200 rounded-2xl  focus:border-indigo-500 sm:text-sm bg-[#fff] text-gray-500 focus:none  focus:ring-0"
              popoverMaxWidth="400"
            />
          </div>

          <div className="relative border border-gray-200 rounded-2xl bg-[#fff] flex items-center justify-between px-4 py-4 cursor-pointer">
            <label
              htmlFor="document"
              className="block text-sm text-gray-500 cursor-pointer"
            >
              Döküman (CV, Portfolyo vb)
            </label>
            <input
              type="file"
              name="document"
              id="document"
              className="sr-only"
            />
            <FaPlus className="text-gray-500" />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Gönder
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
