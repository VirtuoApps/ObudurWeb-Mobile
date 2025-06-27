"use client";

import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";

import { useTranslations } from "next-intl";

type PanoramicViewProps = {
  video: string;
};

export default function PanoramicView({ video }: PanoramicViewProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("panoramicView");

  return (
    <section
      id="panoramic-section"
      className="max-w-5xl mx-auto p-4 lg:p-0 mt-12"
    >
      <h2 className="text-[#31286A] font-semibold tracking-tight text-3xl md:text-2xl">
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
          className="absolute cursor-pointer inset-0 m-auto w-[100px] h-[100px] bg-[#362C75]/70 rounded-full flex flex-col items-center justify-center gap-1 text-white shadow-lg transition hover:scale-105 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#31286A]"
        >
          <svg
            width={60}
            height={60}
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M38.4359 31.8971L37.8903 31.059L37.8764 31.0681L37.8628 31.0776L38.4359 31.8971ZM38.4359 28.6717L37.8429 29.4769L37.8876 29.5098L37.9355 29.5375L38.4359 28.6717ZM25.5092 19.153L26.1021 18.3478L26.0739 18.327L26.0443 18.3083L25.5092 19.153ZM22.7991 20.5748L23.7991 20.5719L23.7991 20.5631L23.7989 20.5544L22.7991 20.5748ZM22.8533 39.2725L21.8533 39.2754L21.8534 39.3037L21.8551 39.332L22.8533 39.2725ZM25.6627 40.8307L26.1469 41.7056L26.1929 41.6802L26.2359 41.6501L25.6627 40.8307ZM30 52.5V51.5C18.1259 51.5 8.5 41.8741 8.5 30H7.5H6.5C6.5 42.9787 17.0213 53.5 30 53.5V52.5ZM52.5 30H51.5C51.5 41.8741 41.8741 51.5 30 51.5V52.5V53.5C42.9787 53.5 53.5 42.9787 53.5 30H52.5ZM30 7.5V8.5C41.8741 8.5 51.5 18.1259 51.5 30H52.5H53.5C53.5 17.0213 42.9787 6.5 30 6.5V7.5ZM30 7.5V6.5C17.0213 6.5 6.5 17.0213 6.5 30H7.5H8.5C8.5 18.1259 18.1259 8.5 30 8.5V7.5ZM38.4359 31.8971L38.9815 32.7352C39.8897 32.1439 40.6749 31.3136 40.6735 30.2364C40.672 29.1368 39.8578 28.3384 38.9363 27.8059L38.4359 28.6717L37.9355 29.5375C38.6611 29.9568 38.6735 30.2331 38.6735 30.2391C38.6735 30.2676 38.6352 30.5742 37.8903 31.059L38.4359 31.8971ZM38.4359 28.6717L39.0288 27.8664L26.1021 18.3478L25.5092 19.153L24.9162 19.9583L37.8429 29.4769L38.4359 28.6717ZM25.5092 19.153L26.0443 18.3083C25.1895 17.7668 24.1351 17.5461 23.215 17.9756C22.2398 18.431 21.7758 19.4407 21.7994 20.5952L22.7991 20.5748L23.7989 20.5544C23.7864 19.9385 24.0074 19.813 24.0612 19.7878C24.1702 19.7369 24.4888 19.6905 24.974 19.9978L25.5092 19.153ZM22.7991 20.5748L21.7991 20.5777L21.8533 39.2754L22.8533 39.2725L23.8533 39.2696L23.7991 20.5719L22.7991 20.5748ZM22.8533 39.2725L21.8551 39.332C21.9197 40.4172 22.2781 41.4802 23.228 41.9875C24.1675 42.4893 25.2411 42.207 26.1469 41.7056L25.6627 40.8307L25.1785 39.9557C24.4794 40.3426 24.2055 40.2422 24.1702 40.2233C24.1452 40.21 23.9014 40.0498 23.8516 39.2131L22.8533 39.2725ZM25.6627 40.8307L26.2359 41.6501L39.009 32.7166L38.4359 31.8971L37.8628 31.0776L25.0896 40.0112L25.6627 40.8307Z"
              fill="#FCFCFC"
            />
          </svg>
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
