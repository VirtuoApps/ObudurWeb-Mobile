"use client";

import React, { useState, useEffect } from "react";
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
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
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

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && originalImageCount > 1) {
      goToNextImage();
    }
    if (isRightSwipe && originalImageCount > 1) {
      goToPrevImage();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      if (event.key === 'ArrowLeft') {
        goToPrevImage();
      } else if (event.key === 'ArrowRight') {
        goToNextImage();
      } else if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isModalOpen]);

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
            {/* Single main image with counter */}
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
              {/* Image counter box */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                1 / {originalImageCount}
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
            {/* Single main image with counter */}
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
              {/* Image counter box */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                1 / {originalImageCount}
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
        <div className="md:hidden w-full">
          <div
            className="relative w-full h-[240px] overflow-hidden cursor-pointer flex items-center justify-center"
            onClick={() => openModal(currentImageIndex)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ margin: 0, padding: 0 }}
          >
            <Image
              src={images[currentImageIndex]}
              alt="Property main image"
              fill
              className="object-cover w-full h-full"
              priority
            />
            {/* Counter */}
            <div
              className="absolute bottom-2 right-2 bg-[#FCFCFC] text-[#262626] px-2 py-1 rounded"
              style={{
                fontFamily: 'Kumbh Sans',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '140%',
                letterSpacing: '0%',
              }}
            >
              {currentImageIndex + 1} / {originalImageCount}
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
          className="fixed inset-0 z-50 bg-black flex justify-center items-center transition-opacity duration-300"
          style={{ backgroundColor: '#000' }}
          onClick={closeModal}
        >
          {/* X butonu */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-4 z-10 w-8 h-8 rounded-xl bg-[#FCFCFC] flex items-center justify-center cursor-pointer shadow"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            <IoMdClose size={20} color="#595959" />
          </button>
          <div
            className="relative w-full h-full flex flex-col justify-center items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image container - Desktop */}
            <div className="relative aspect-[16/9] w-full overflow-hidden hidden md:block">
              <Image
                src={hotelData.hotelDetails.images[currentImageIndex]}
                alt={`Property image ${currentImageIndex + 1}`}
                fill
                className="object-contain w-full h-auto"
              />
            </div>
            {/* Image container - Mobile */}
            <div
              className="w-full flex items-center justify-center md:hidden"
              onClick={() => openModal(currentImageIndex)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={hotelData.hotelDetails.images[currentImageIndex]}
                alt={`Property image ${currentImageIndex + 1}`}
                className="w-full h-auto object-contain select-none"
                style={{ display: 'block' }}
              />
            </div>
          </div>
          {/* Counter - tam ekran alt ortada */}
          <div className="fixed left-1/2 bottom-6 -translate-x-1/2 bg-[#FCFCFC] text-[#262626] px-4 py-2 rounded-full z-50"
            style={{
              fontFamily: 'Kumbh Sans',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '140%',
              letterSpacing: '0%'
            }}>
            {currentImageIndex + 1} / {originalImageCount}
          </div>
        </div>
      )}
    </div>
  );
}