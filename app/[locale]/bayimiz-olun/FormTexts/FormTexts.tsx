import React from "react";
import { useTranslations } from "next-intl";

export default function FormTexts() {
  const t = useTranslations("becomePartnerPage");

  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <h1 className=" sm:text-[56px] text-[32px] md:text-[56px] font-bold text-[#362C75] mb-3">
        {t("title")}
      </h1>
      <p className="text-[16px] md:text-[24px] text-[#262626] mb-3  text-left">
        {t("subtitle")}
      </p>
      <p className="text-base text-[#595959] font-medium">
        {t("description1")}
      </p>
      <p className="text-base text-[#595959] font-medium">
        {t("description2")}
      </p>
    </div>
  );
}
