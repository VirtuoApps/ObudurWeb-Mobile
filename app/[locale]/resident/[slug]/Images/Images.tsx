"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaRegImages } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import GridIcon from "@/app/svgIcons/GridIcon";

export default function Images() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Example images - replace with actual property images
  const images = [
    "/example-house.png",
    "/example-house.png",
    "/example-house.png",
    "/example-house.png",
    "/example-house.png",

    // Add more images if available
  ];

  const openModal = (index = 0) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="w-full">
      {/* Images grid layout */}
      <div className="relative grid grid-cols-1 md:grid-cols-5 gap-2 p-1">
        {/* Large image on the left */}
        <div
          className="relative md:col-span-3 aspect-[4/3] md:aspect-auto md:h-full overflow-hidden shadow-md cursor-pointer"
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

        {/* 2x2 grid on the right */}
        <div className="md:col-span-2 grid grid-cols-2 gap-2 h-full">
          {/* Top row */}
          <div
            className="relative aspect-square overflow-hidden shadow-md cursor-pointer"
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
            className="relative aspect-square overflow-hidden shadow-md cursor-pointer"
            onClick={() => openModal(2)}
          >
            <Image
              src={images[2]}
              alt="Property image 3"
              fill
              className="object-cover"
            />
          </div>

          {/* Bottom row */}
          <div
            className="relative aspect-square overflow-hidden shadow-md cursor-pointer"
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
            className="relative aspect-square overflow-hidden shadow-md cursor-pointer"
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
          <GridIcon />
          <span className="ml-3 text-[#5E5691]">Bütün Fotoğrafları Gör</span>
        </button>
      </div>

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
                src={images[currentImageIndex]}
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
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
