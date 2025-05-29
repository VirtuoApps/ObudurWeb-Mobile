"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axiosInstance from "../../../../../axios";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer.newsletter");
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is already subscribed
    const subscribedEmail = localStorage.getItem("subscribedEmail");
    if (subscribedEmail) {
      setEmail(subscribedEmail);
      setIsSubscribed(true);
    }
  }, []);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await axiosInstance.post("/mail-droppers/subscribe", { email });
      localStorage.setItem("subscribedEmail", email);
      setIsSubscribed(true);
    } catch (err) {
      setError(t("errorMessage"));
      console.error("Subscription error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="w-full bg-white mt-32">
      {/* Primary top divider */}
      <div className="border-t border-slate-200"></div>

      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        <div className="flex flex-row justify-between pt-8 pb-10">
          {/* Column 1 */}
          <nav className="col-span-1">
            <ul className="space-y-2">
              <li>
                <a
                  href="/admin/ilan-olustur"
                  className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer"
                >
                  İlan Verin
                </a>
              </li>
              <li>
                <a
                  href="/satilik"
                  className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer"
                >
                  Satılık İlanlar
                </a>
              </li>
              <li>
                <a
                  href="/kiralik"
                  className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer"
                >
                  Kiralık İlanlar
                </a>
              </li>
            </ul>
          </nav>

          {/* Column 2 */}
          <nav className="col-span-1">
            <ul className="space-y-2">
              <li>
                <a
                  className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer"
                  href="/kariyer"
                >
                  Kariyer
                </a>
              </li>
              <li>
                <a
                  href="/bayimiz-olun"
                  className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer"
                >
                  Bayimiz Olun
                </a>
              </li>
              <li>
                <a
                  href="/iletisim#offices-section"
                  className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer"
                >
                  Satış Ofizlerimiz
                </a>
              </li>
              <li>
                <a
                  href="/iletisim"
                  className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer"
                >
                  İletişim
                </a>
              </li>
            </ul>
          </nav>

          {/* Column 3 */}
          <nav className="col-span-1">
            <ul className="space-y-2">
              <li>
                <a className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer">
                  Geri Bildirim
                </a>
              </li>
              <li>
                <a
                  href="/sozlesmeler?id=sozlesmeler&itemId=bireysel"
                  className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer"
                >
                  Kullanıcı Sözleşmeleri
                </a>
              </li>
              <li>
                <a
                  href="/sozlesmeler?id=cerezler&itemId=tercihler"
                  className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer"
                >
                  Çerez Politikası
                </a>
              </li>
              <li>
                <a className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer">
                  Dil & Para Birimi
                </a>
              </li>
            </ul>
          </nav>

          {/* Column 4 */}
          <nav className="col-span-1">
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.instagram.com/obudurcom/"
                  target="_blank"
                  className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/Obudurcom"
                  target="_blank"
                  className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/obudurcom"
                  target="_blank"
                  className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </nav>

          {/* Newsletter Column */}
          <div className="w-[400px]">
            <form onSubmit={handleSubscribe}>
              <div className="flex flex-col border-b border-gray-300 pb-4">
                {isSubscribed ? (
                  <p className="text-green-600 text-sm mb-2">
                    {t("successMessage")}
                  </p>
                ) : error ? (
                  <p className="text-red-500 text-sm mb-2">{error}</p>
                ) : null}
                <div className="flex">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubscribed || isLoading}
                    aria-label={t("placeholder")}
                    placeholder={t("placeholder")}
                    className="w-full max-w-xs rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-none focus::border-none outline-none placeholder:text-gray-400 text-gray-700 disabled:bg-gray-100"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubscribed || isLoading}
                    className={`text-sm ml-4 px-4 rounded-xl transition w-[200px] ${
                      isSubscribed
                        ? "bg-green-100 text-green-600"
                        : "bg-slate-100 text-[#8C8C8C] hover:bg-slate-200"
                    }`}
                  >
                    {isLoading
                      ? t("subscribing")
                      : isSubscribed
                      ? t("subscribed")
                      : t("subscribe")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Primary bottom divider */}
      <div className="border-t border-slate-200"></div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        <div className="flex justify-between items-center py-6 text-xs text-slate-500">
          <div className="flex items-center">
            <Image
              src="/obudur-icon.png"
              alt="Obudur Logo"
              width={20}
              height={20}
              className="h-5 w-auto mr-2"
            />
            <span>© 2025 Obudur</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
