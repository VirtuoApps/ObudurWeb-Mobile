"use client";

import React, { useState, Fragment } from "react";
import { useTranslations } from "next-intl";
import { Dialog, Transition } from "@headlessui/react";

type PanoramicViewProps = {
  video: string;
};

export default function PanoramicView({ video }: PanoramicViewProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("panoramicView");

  return (
    <section id="panoramic-section" className="max-w-5xl mx-auto p-4 mt-12">
      <h2 className="text-[#31286A] font-semibold tracking-tight text-3xl md:text-4xl">
        {t("title")}
      </h2>
      <p className="mt-2 max-w-lg text-sm md:text-base leading-relaxed text-gray-500">
        {t("description")}
      </p>

      {/* Hero image */}
      <div className="relative mt-10">
        <img
          src="/example-house.png"
          alt="House interior"
          className="w-full rounded-lg object-cover"
        />
        <button
          onClick={() => setOpen(true)}
          className="absolute cursor-pointer inset-0 m-auto w-36 h-36 bg-[#31286A] rounded-full flex flex-col items-center justify-center gap-2 text-white shadow-lg transition hover:scale-105 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#31286A]"
        >
          <img src="/360.png" alt="" className="w-10 h-10" />
          <span className="text-sm font-medium">{t("startTour")}</span>
        </button>
      </div>

      {/* Modal */}
      <Transition show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl">
                <Dialog.Title className="sr-only">Video Tour</Dialog.Title>
                <button
                  type="button"
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">{t("closeTour")}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="w-full h-full flex justify-center">
                  <video
                    src={video}
                    controls
                    autoPlay
                    className="w-full max-h-[450px]"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
}
