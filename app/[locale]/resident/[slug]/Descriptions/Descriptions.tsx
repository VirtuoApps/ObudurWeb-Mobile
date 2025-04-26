"use client";

import React from "react";
import { useTranslations } from "next-intl";

export default function Descriptions() {
  const t = useTranslations("residentMenu");

  return (
    <div className="max-w-5xl mx-auto p-4 mt-12">
      <p className="font-bold text-[#362C75] text-2xl">{t("descriptions")}</p>

      <div className="flex md:flex-row flex-col mt-8 gap-6">
        <div className="md:w-1/2 w-full">
          <p className="text-[#262626] text-base">
            In viverra vestibulum maecenas sit id diam turpis risus interdum.
            Magnis integer feugiat nulla nec sapien. Elit amet ac diam habitasse
            sed. Sollicitudin ut at nunc quisque eu quis. Quis volutpat gravida
            elementum elementum pellentesque ante enim. Laoreet auctor tincidunt
            et cursus etiam dui in mauris. Neque libero, leo sagittis, amet
            malesuada egestas sapien. Faucibus sagittis vivamus vitae turpis
            tincidunt arcu. Integer nibh adipiscing enim nulla fames lectus vel
            quis semper. Eu amet pharetra ac nibh sed feugiat diam. Sed erat
            nunc porttitor aliquet phasellus vulputate odio. Enim, amet arcu,
            consequat phasellus mattis leo.
          </p>
        </div>

        <div className="md:w-1/2 w-full">
          <p className="text-[#262626] text-base">
            Egestas dui, eget feugiat posuere est. Pellentesque in elementum
            tempus malesuada orci non in. Ut ac tellus tortor vitae leo,
            consectetur semper lectus. Est nunc in cursus arcu proin semper
            massa, in. Non massa, viverra vulputate bibendum. Duis mauris sit
            amet pulvinar enim.
          </p>
        </div>
      </div>
    </div>
  );
}
