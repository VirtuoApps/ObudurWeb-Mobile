import React, { useState } from "react";
import GeneralLayout from "./GeneralLayout/GeneralLayout";
import PauseConfirm from "./PauseConfim/PauseConfirm";

export default function MobileActionsPopup() {
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-end justify-end w-full h-full"
      style={{
        backgroundColor: "rgba(0,0,0,0.1)",
      }}
    >
      <div className="bg-[#FCFCFC] h-[60%]  w-full z-50 rounded-t-[32px] px-4 pt-8 flex flex-col pb-6">
        {!showPauseConfirm && <GeneralLayout />}
        {showPauseConfirm && <PauseConfirm />}
      </div>
    </div>
  );
}
