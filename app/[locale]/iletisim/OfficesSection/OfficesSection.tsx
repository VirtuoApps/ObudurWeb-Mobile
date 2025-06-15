"use client";

import React, { useState } from "react";

interface OfficeContact {
  baseTitle: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface Office {
  id: string;
  name: string;
  dayCount: number;
  contacts: OfficeContact[];
}

interface Location {
  id: string;
  name: string;
  dayCount: number;
}

export default function OfficesSection() {
  const [expandedOffices, setExpandedOffices] = useState<Set<string>>(
    new Set()
  );
  const [expandedLocations, setExpandedLocations] = useState<Set<string>>(
    new Set()
  );

  const offices: Office[] = [
    {
      id: "klasyfest",
      name: "Klasyfest",
      dayCount: 2,
      contacts: [
        {
          baseTitle: "Hauck, Conn and Auer",

          name: "Enes Emekli",
          phone: "776-765-1962 x302",
          email: "enes.emekli@klasyfest.com",
          address:
            "Mehdi Hammer Forge, Karşıyakış Mh 78031-8435, Antalya, Türkiye",
        },
      ],
    },
    {
      id: "haack-corn",
      name: "Kileyfort",
      dayCount: 0,
      contacts: [
        {
          baseTitle: "Hauck, Conn and Auer",
          name: "Enes Emekli",
          phone: "776-765-1962 x302",
          email: "enes.emekli@haackcorn.com",
          address:
            "Mehdi Hammer Forge, Karşıyakış Mh 78031-8435, Antalya, Türkiye",
        },
        {
          baseTitle: "Hauck, Conn and Auer",
          name: "Enes Emekli",
          phone: "776-765-1962 x302",
          email: "enes.emekli@haackcorn.com",
          address:
            "Mehdi Hammer Forge, Karşıyakış Mh 78031-8435, Antalya, Türkiye",
        },
      ],
    },
    {
      id: "johnston-buchholze",
      name: "Johnston Buchholze and Wilkinson",
      dayCount: 0,
      contacts: [
        {
          baseTitle: "Hauck, Conn and Auer",

          name: "Enes Emekli",
          phone: "776-765-1962 x302",
          email: "enes.emekli@johnston.com",
          address:
            "Mehdi Hammer Forge, Karşıyakış Mh 78031-8435, Antalya, Türkiye",
        },
      ],
    },
    {
      id: "lake-brooklyn",
      name: "Lake Brooklyn",
      dayCount: 7,
      contacts: [
        {
          baseTitle: "Hauck, Conn and Auer",

          name: "Enes Emekli",
          phone: "776-765-1962 x302",
          email: "enes.emekli@lakebrooklyn.com",
          address:
            "Mehdi Hammer Forge, Karşıyakış Mh 78031-8435, Antalya, Türkiye",
        },
      ],
    },
    {
      id: "sacramento",
      name: "Sacramento",
      dayCount: 1,
      contacts: [
        {
          baseTitle: "Hauck, Conn and Auer",

          name: "Enes Emekli",
          phone: "776-765-1962 x302",
          email: "enes.emekli@sacramento.com",
          address:
            "Mehdi Hammer Forge, Karşıyakış Mh 78031-8435, Antalya, Türkiye",
        },
      ],
    },
  ];

  const toggleOffice = (officeId: string) => {
    const newExpanded = new Set(expandedOffices);
    if (newExpanded.has(officeId)) {
      newExpanded.delete(officeId);
    } else {
      newExpanded.add(officeId);
    }
    setExpandedOffices(newExpanded);
  };

  const toggleLocation = (locationId: string) => {
    const newExpanded = new Set(expandedLocations);
    if (newExpanded.has(locationId)) {
      newExpanded.delete(locationId);
    } else {
      newExpanded.add(locationId);
    }
    setExpandedLocations(newExpanded);
  };

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-3">
      {/* Left Column */}
      <div className="space-y-3">
        {offices
          .filter((_, index) => index % 2 === 0)
          .map((office) => {
            const isExpanded = expandedOffices.has(office.id);
            return (
              <div
                key={office.id}
                className="bg-white rounded-4xl border border-gray-200 overflow-hidden"
              >
                {/* Office Header */}
                <div
                  className="flex items-center justify-between p-4 py-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleOffice(office.id)}
                >
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-[#262626] text-base w-[200px] break-words md:w-auto">
                      {office.name}
                    </h3>
                    <span className="text-base text-[#8C8C8C]  py-1 rounded-full">
                      {office.contacts.length} Bayi
                    </span>
                  </div>
                  <div className="w-[24px] h-[24px] flex items-center justify-center rounded-mdbg-white mr-3 cursor-pointer">
                    {isExpanded ? (
                      <img
                        src="/minus-icon.png"
                        alt="minus"
                        className="w-[21px]"
                      />
                    ) : (
                      <img
                        src="/plus-icon.png"
                        alt="plus"
                        className="w-[21px] h-[21px]"
                      />
                    )}
                  </div>
                </div>

                {/* Office Details */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className=" pb-4 border-t border-[#D9D9D9]">
                    {office.contacts.map((contact, index) => (
                      <div
                        key={index}
                        className={`pt-4 border-b border-[#D9D9D9] pb-4 px-4 ${
                          index === office.contacts.length - 1
                            ? "border-b-0"
                            : ""
                        }`}
                      >
                        <p className="text-[#262626] font-bold text-base mb-4 w-[200px] break-words md:w-auto">
                          {contact.baseTitle}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#262626] text-sm">
                              Yetkili:
                            </span>
                            <span className="text-[#595959] text-sm">
                              {contact.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#262626] text-sm">
                              Telefon:
                            </span>
                            <a
                              href={`tel:${contact.phone}`}
                              className="text-[#595959] text-sm"
                            >
                              {contact.phone}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#262626] text-sm">
                              E-posta:
                            </span>
                            <a
                              href={`mailto:${contact.email}`}
                              className="text-[#595959] text-sm"
                            >
                              {contact.email}
                            </a>
                          </div>
                          <div className="flex flex-row justify-between gap-2">
                            <span className="text-[#262626] text-sm max-w-[200px] sm:max-w-[350px] break-words">
                              {contact.address}
                            </span>
                            <div
                              className="bg-[#F0F0F0] hover:bg-[#5E5691] transition-all duration-200 rounded-2xl flex items-center justify-center w-[56px] h-[56px] group cursor-pointer"
                              onClick={() => {
                                window.open(
                                  `https://www.google.com/maps/search/?api=1&query=${contact.address}`,
                                  "_blank"
                                );
                              }}
                            >
                              <img
                                src="/marker-04.png"
                                alt="map"
                                className="w-[24px] h-[24px] group-hover:hidden"
                              />
                              <img
                                src="/chevron-right.png"
                                alt="chevron"
                                className="w-[24px] h-[24px] hidden group-hover:block"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Right Column */}
      <div className="space-y-3">
        {offices
          .filter((_, index) => index % 2 === 1)
          .map((office) => {
            const isExpanded = expandedOffices.has(office.id);
            return (
              <div
                key={office.id}
                className="bg-white rounded-4xl border border-gray-200 overflow-hidden"
              >
                {/* Office Header */}
                <div
                  className="flex items-center justify-between p-4 py-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleOffice(office.id)}
                >
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-[#262626] text-base w-[200px] break-words md:w-auto">
                      {office.name}
                    </h3>
                    <span className="text-base text-[#8C8C8C]  py-1 rounded-full">
                      {office.contacts.length} Bayi
                    </span>
                  </div>
                  <div className="w-[24px] h-[24px] flex items-center justify-center rounded-mdbg-white mr-3 cursor-pointer">
                    {isExpanded ? (
                      <img
                        src="/minus-icon.png"
                        alt="minus"
                        className="w-[21px]"
                      />
                    ) : (
                      <img
                        src="/plus-icon.png"
                        alt="plus"
                        className="w-[21px] h-[21px]"
                      />
                    )}
                  </div>
                </div>

                {/* Office Details */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isExpanded
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className=" pb-4 border-t border-[#D9D9D9]">
                    {office.contacts.map((contact, index) => (
                      <div
                        key={index}
                        className={`pt-4 border-b border-[#D9D9D9] pb-4 px-4 ${
                          index === office.contacts.length - 1
                            ? "border-b-0"
                            : ""
                        }`}
                      >
                        <p className="text-[#262626] font-bold text-base mb-4">
                          {contact.baseTitle}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#262626] text-sm">
                              Yetkili:
                            </span>
                            <span className="text-[#595959] text-sm">
                              {contact.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#262626] text-sm">
                              Telefon:
                            </span>
                            <a
                              href={`tel:${contact.phone}`}
                              className="text-[#595959] text-sm"
                            >
                              {contact.phone}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#262626] text-sm">
                              E-posta:
                            </span>
                            <a
                              href={`mailto:${contact.email}`}
                              className="text-[#595959] text-sm"
                            >
                              {contact.email}
                            </a>
                          </div>
                          <div className="flex flex-row justify-between gap-2">
                            <span className="text-[#262626] text-sm max-w-[200px] sm:max-w-[350px] break-words">
                              {contact.address}
                            </span>
                            <div
                              className="bg-[#F0F0F0] hover:bg-[#5E5691] transition-all duration-200 rounded-2xl flex items-center justify-center w-[56px] h-[56px] group cursor-pointer"
                              onClick={() => {
                                window.open(
                                  `https://www.google.com/maps/search/?api=1&query=${contact.address}`,
                                  "_blank"
                                );
                              }}
                            >
                              <img
                                src="/marker-04.png"
                                alt="map"
                                className="w-[24px] h-[24px] group-hover:hidden"
                              />
                              <img
                                src="/chevron-right.png"
                                alt="chevron"
                                className="w-[24px] h-[24px] hidden group-hover:block"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
