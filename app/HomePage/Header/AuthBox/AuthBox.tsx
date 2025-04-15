import React from "react";
import { TbWorld } from "react-icons/tb";
import { GoPerson } from "react-icons/go";

export default function AuthBox() {
  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <div className="text-sm text-black font-bold">Hoş geldiniz!</div>
        <div className="text-sm text-gray-600">Giriş Yap</div>
      </div>

      <div className="bg-gray-100 rounded-lg flex items-center justify-center py-3 px-2">
        <GoPerson className="text-gray-600 text-2xl" />
      </div>

      <TbWorld className="text-gray-600 text-3xl" />
    </div>
  );
}
