"use client";
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Switch } from "@headlessui/react";

export default function ContactBox() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+90",
    wantsVisit: false,
    message:
      "Merhaba, Obudur'daki #135154832 numaralı ilanınız ile ilgili daha fazla bilgi almak istiyorum.",
  });

  const countryCodes = [
    { code: "+90", country: "TR" },
    { code: "+1", country: "US" },
    { code: "+44", country: "GB" },
    { code: "+49", country: "DE" },
    { code: "+33", country: "FR" },
    { code: "+39", country: "IT" },
    { code: "+7", country: "RU" },
    { code: "+86", country: "CN" },
    { code: "+81", country: "JP" },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleVisit = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      wantsVisit: checked,
    }));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-md w-full p-4">
      {/* Agent Info Section */}
      <div className="bg-[#31286A] p-4 rounded-xl">
        <div className="flex flex-row items-center">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-300 mr-4 flex-shrink-0">
            <img
              src="/example-person.png"
              alt="Bruce Wayne"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/150";
              }}
            />
          </div>
          <div className="text-white">
            <h3 className="font-bold text-lg">Bruce Wayne</h3>
            <p className="text-white/80 text-sm">Motto Yatırım</p>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button className="flex-1 bg-[#EC755D] text-white py-2 px-4 rounded-xl font-medium cursor-pointer">
            Ara
          </button>
          <button className="flex-1 bg-[#FCFCFC] text-gray-800 py-2 px-4 rounded-xl border border-gray-200 font-medium cursor-pointer">
            Tüm İlanları
          </button>
        </div>
      </div>

      {/* Action Buttons */}

      {/* Contact Form */}
      <div className="p-4">
        <h4 className="font-medium text-gray-800 mb-4">Daha Fazla Bilgi Al</h4>

        <div className="mb-3">
          <input
            type="text"
            id="firstName"
            placeholder="İsim*"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full  border border-gray-300 rounded-2xl text-sm placeholder:text-gray-400 text-[#262626] font-semibold py-4 px-3"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Soyisim*"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full  border border-gray-300 rounded-2xl text-sm placeholder:text-gray-400 text-[#262626] font-semibold py-4 px-3"
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="E-posta*"
            value={formData.email}
            onChange={handleChange}
            className="w-full  border border-gray-300 rounded-2xl text-sm placeholder:text-gray-400 text-[#262626] font-semibold py-4 px-3"
            required
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="phone"
            className="block text-sm text-[#262626] font-semibold mb-1"
          >
            Telefon
          </label>
          <div className="flex gap-2">
            <div className="relative">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="bg-white border border-gray-300 rounded-2xl text-sm text-[#262626] font-semibold py-4 px-2 w-24 appearance-none pr-8"
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code} {country.country}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <FaChevronDown size={12} />
              </div>
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Telefon Numarası"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl text-sm placeholder:text-gray-400 text-[#262626] font-semibold py-4 px-3"
            />
          </div>
        </div>

        <div className="mb-3 flex items-center mt-4">
          <Switch
            checked={formData.wantsVisit}
            onChange={toggleVisit}
            className={`${
              formData.wantsVisit ? "bg-[#31286A]" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
          >
            <span className="sr-only">Evi ziyaret etmek istiyorum</span>
            <span
              className={`${
                formData.wantsVisit ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
          <label htmlFor="wantsVisit" className="text-sm text-gray-700 ml-4">
            Evi ziyaret etmek istiyorum.
          </label>
        </div>

        <div className="mb-4 mt-8">
          <label
            htmlFor="message"
            className="block text-sm text-gray-400 -mb-8 ml-3"
          >
            Mesajınız
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-2xl text-sm resize-none placeholder:text-gray-400 text-[#262626] font-semibold pt-10"
          />
        </div>

        <button
          type="button"
          disabled
          className="w-full bg-[#F0F0F0] text-gray-700 py-3 rounded-xl font-medium cursor-not-allowed"
        >
          Mesaj Gönder
        </button>
      </div>
    </div>
  );
}
