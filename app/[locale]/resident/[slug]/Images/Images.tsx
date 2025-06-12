"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaRegImages } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import GridIcon from "@/app/svgIcons/GridIcon";
import { useHotelData } from "../hotelContext";
import { useTranslations } from "next-intl";

export default function Images() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const t = useTranslations("residentMenu");

  const { hotelData, locale } = useHotelData();

  // Get original images
  let images = hotelData.hotelDetails.images;
  const originalImageCount = images.length;

  // Pad images if less than 5
  if (images.length < 5) {
    const paddedImages = [...images];
    while (paddedImages.length < 5) {
      paddedImages.push(images[0]); // Use first image as fallback
    }
    images = paddedImages;
  }

  const openModal = (index = 0) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === originalImageCount - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? originalImageCount - 1 : prevIndex - 1
    );
  };

  // Render different layouts based on image count
  const renderImageGrid = () => {
    if (originalImageCount === 3) {
      // 3 images: 1 large + 2 small
      return (
        <div className="relative w-full">
          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-2 gap-2 p-1 w-full">
            {/* Large image - responsive width x 520px height */}
            <div
              className="relative w-full h-[520px] overflow-hidden shadow-md cursor-pointer"
              onClick={() => openModal(0)}
            >
              <Image
                src={images[0]}
                alt="Property main image"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* 2 images stacked - responsive width x 254px height each */}
            <div className="flex flex-col gap-2">
              <div
                className="relative w-full h-[254px] overflow-hidden shadow-md cursor-pointer"
                onClick={() => openModal(1)}
              >
                <Image
                  src={images[1]}
                  alt="Property image 2"
                  fill
                  className="object-cover"
                />
              </div>
              <div
                className="relative w-full h-[254px] overflow-hidden shadow-md cursor-pointer"
                onClick={() => openModal(2)}
              >
                <Image
                  src={images[2]}
                  alt="Property image 3"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* View all photos button */}
            <button
              onClick={() => openModal(0)}
              className="absolute bottom-4 right-4 px-4 py-2 bg-white text-black rounded shadow hover:bg-gray-100 transition flex flex-row items-center cursor-pointer"
            >
              <span className=" text-[#5E5691]">{t("viewAll")}</span>
            </button>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden p-1 w-full">
            {/* Main large image */}
            <div
              className="relative w-full h-[240px] mb-2 overflow-hidden rounded-lg shadow-md cursor-pointer"
              onClick={() => openModal(0)}
            >
              <Image
                src={images[0]}
                alt="Property main image"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Grid of smaller images */}
            <div className="grid grid-cols-2 gap-2">
              <div
                className="relative w-full h-[120px] overflow-hidden rounded-lg shadow-md cursor-pointer"
                onClick={() => openModal(1)}
              >
                <Image
                  src={images[1]}
                  alt="Property image 2"
                  fill
                  className="object-cover"
                />
              </div>
              <div
                className="relative w-full h-[120px] overflow-hidden rounded-lg shadow-md cursor-pointer"
                onClick={() => openModal(2)}
              >
                <Image
                  src={images[2]}
                  alt="Property image 3"
                  fill
                  className="object-cover"
                />
                {/* View all button for mobile */}
                <div className="absolute inset-0 bg-black/20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(0);
                    }}
                    className="absolute bottom-2 right-2 px-3 py-1 bg-white text-[#5E5691] text-sm rounded shadow"
                  >
                    {t("viewAll")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (originalImageCount === 4) {
      // 4 images: 1 large + 3 small
      return (
        <div className="relative w-full">
          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-[2fr_1fr] gap-2 p-1 w-full">
            {/* Large image - responsive width x 520px height */}
            <div
              className="relative w-full h-[520px] overflow-hidden shadow-md cursor-pointer"
              onClick={() => openModal(0)}
            >
              <Image
                src={images[0]}
                alt="Property main image"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* 3 images stacked - responsive width x 169px height each */}
            <div className="flex flex-col gap-2 w-full">
              <div
                className="relative w-full h-[169px] overflow-hidden shadow-md cursor-pointer"
                onClick={() => openModal(1)}
              >
                <Image
                  src={images[1]}
                  alt="Property image 2"
                  fill
                  className="object-cover"
                />
              </div>
              <div
                className="relative w-full h-[169px] overflow-hidden shadow-md cursor-pointer"
                onClick={() => openModal(2)}
              >
                <Image
                  src={images[2]}
                  alt="Property image 3"
                  fill
                  className="object-cover"
                />
              </div>
              <div
                className="relative w-full h-[169px] overflow-hidden shadow-md cursor-pointer"
                onClick={() => openModal(3)}
              >
                <Image
                  src={images[3]}
                  alt="Property image 4"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* View all photos button */}
            <button
              onClick={() => openModal(0)}
              className="absolute bottom-4 right-4 px-4 py-2 bg-white text-black rounded shadow hover:bg-gray-100 transition flex flex-row items-center cursor-pointer"
            >
              <span className=" text-[#5E5691]">{t("viewAll")}</span>
            </button>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden p-1 w-full">
            {/* Main large image */}
            <div
              className="relative w-full h-[240px] mb-2 overflow-hidden rounded-lg shadow-md cursor-pointer"
              onClick={() => openModal(0)}
            >
              <Image
                src={images[0]}
                alt="Property main image"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Grid of smaller images */}
            <div className="grid grid-cols-3 gap-2">
              <div
                className="relative w-full h-[100px] overflow-hidden rounded-lg shadow-md cursor-pointer"
                onClick={() => openModal(1)}
              >
                <Image
                  src={images[1]}
                  alt="Property image 2"
                  fill
                  className="object-cover"
                />
              </div>
              <div
                className="relative w-full h-[100px] overflow-hidden rounded-lg shadow-md cursor-pointer"
                onClick={() => openModal(2)}
              >
                <Image
                  src={images[2]}
                  alt="Property image 3"
                  fill
                  className="object-cover"
                />
              </div>
              <div
                className="relative w-full h-[100px] overflow-hidden rounded-lg shadow-md cursor-pointer"
                onClick={() => openModal(3)}
              >
                <Image
                  src={images[3]}
                  alt="Property image 4"
                  fill
                  className="object-cover"
                />
                {/* View all button for mobile */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(0);
                    }}
                    className="px-3 py-1 bg-white text-[#5E5691] text-sm rounded shadow"
                  >
                    {t("viewAll")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default layout for 5 or more images: 1 large + 4 small
    return (
      <div className="relative w-full">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-5 gap-2 p-1 w-full">
          {/* Large image - responsive width x 520px height (spans 2 rows and 3 columns) */}
          <div
            className="relative md:col-span-3 w-full h-[520px] md:row-span-2 overflow-hidden shadow-md cursor-pointer"
            onClick={() => openModal(0)}
          >
            <Image
              src={images[0]}
              alt="Property main image"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* 2x2 grid on the right - each responsive width x 254px height */}
          <div className="md:col-span-2 grid grid-cols-2 gap-2 h-full">
            <div
              className="relative w-full h-[254px] overflow-hidden shadow-md cursor-pointer"
              onClick={() => openModal(1)}
            >
              <Image
                src={images[1]}
                alt="Property image 2"
                fill
                className="object-cover"
              />
            </div>
            <div
              className="relative w-full h-[254px] overflow-hidden shadow-md cursor-pointer"
              onClick={() => openModal(2)}
            >
              <Image
                src={images[2]}
                alt="Property image 3"
                fill
                className="object-cover"
              />
            </div>
            <div
              className="relative w-full h-[254px] overflow-hidden shadow-md cursor-pointer"
              onClick={() => openModal(3)}
            >
              <Image
                src={images[3]}
                alt="Property image 4"
                fill
                className="object-cover"
              />
            </div>
            <div
              className="relative w-full h-[254px] overflow-hidden shadow-md cursor-pointer"
              onClick={() => openModal(4)}
            >
              <Image
                src={images[4]}
                alt="Property image 5"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* View all photos button */}
          <button
            onClick={() => openModal(0)}
            className="absolute bottom-4 right-4 px-4 py-2 bg-white text-black rounded shadow hover:bg-gray-100 transition flex flex-row items-center cursor-pointer"
          >
            <span className=" text-[#5E5691]">{t("viewAll")}</span>
          </button>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden p-1 w-full">
          {/* Main large image */}
          <div
            className="relative w-full h-[240px] mb-2 overflow-hidden rounded-lg shadow-md cursor-pointer"
            onClick={() => openModal(0)}
          >
            <Image
              src={images[0]}
              alt="Property main image"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Grid of smaller images */}
          <div className="grid grid-cols-2 gap-2">
            <div
              className="relative w-full h-[120px] overflow-hidden rounded-lg shadow-md cursor-pointer"
              onClick={() => openModal(1)}
            >
              <Image
                src={images[1]}
                alt="Property image 2"
                fill
                className="object-cover"
              />
            </div>
            <div
              className="relative w-full h-[120px] overflow-hidden rounded-lg shadow-md cursor-pointer"
              onClick={() => openModal(2)}
            >
              <Image
                src={images[2]}
                alt="Property image 3"
                fill
                className="object-cover"
              />
            </div>
            <div
              className="relative w-full h-[120px] overflow-hidden rounded-lg shadow-md cursor-pointer"
              onClick={() => openModal(3)}
            >
              <Image
                src={images[3]}
                alt="Property image 4"
                fill
                className="object-cover"
              />
            </div>
            <div
              className="relative w-full h-[120px] overflow-hidden rounded-lg shadow-md cursor-pointer"
              onClick={() => openModal(4)}
            >
              <Image
                src={images[4]}
                alt="Property image 5"
                fill
                className="object-cover"
              />
              {/* View all button for mobile */}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(0);
                  }}
                  className="px-3 py-1 bg-white text-[#5E5691] text-sm rounded shadow"
                >
                  {t("viewAll")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="images-section" className="w-full">
      {/* Images grid layout */}
      {renderImageGrid()}

      {/* Full-screen modal/slider */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center transition-opacity duration-300"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white text-white flex items-center justify-center cursor-pointer"
          >
            <IoMdClose size={24} color="#5E5691" />
          </button>
          <div
            className="relative w-full max-w-7xl max-h-[90vh] px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image container */}
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
              <Image
                src={hotelData.hotelDetails.images[currentImageIndex]}
                alt={`Property image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>

            {/* Navigation arrows */}
            <button
              onClick={goToPrevImage}
              className="absolute top-1/2 md:-left-12 left-2 -translate-y-1/2 w-12 h-12 rounded-full bg-white text-white flex items-center justify-center cursor-pointer"
            >
              <IoIosArrowBack size={24} color="#5E5691" />
            </button>
            <button
              onClick={goToNextImage}
              className="absolute top-1/2 md:-right-12 right-2 -translate-y-1/2 w-12 h-12 rounded-full bg-white text-white flex items-center justify-center cursor-pointer"
            >
              <IoIosArrowForward size={24} color="#5E5691" />
            </button>

            {/* Image counter */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {originalImageCount}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}