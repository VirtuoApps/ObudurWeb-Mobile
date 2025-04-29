import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-white mt-32">
      {/* Primary top divider */}
      <div className="border-t border-slate-200"></div>

      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 pt-8 pb-10">
          {/* Column 1 */}
          <nav className="col-span-1">
            <ul className="space-y-2">
              <li>
                <a className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer">
                  İlan Verin
                </a>
              </li>
              <li>
                <a className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer">
                  Sıkak İlanlar
                </a>
              </li>
              <li>
                <a className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer">
                  Kiralık İlanlar
                </a>
              </li>
              <li>
                <a className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer">
                  Şu Anda Popüler
                </a>
              </li>
            </ul>
          </nav>

          {/* Column 2 */}
          <nav className="col-span-1">
            <ul className="space-y-2">
              <li>
                <a className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer">
                  Hakkımızda
                </a>
              </li>
              <li>
                <a className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer">
                  Kariyer
                </a>
              </li>
              <li>
                <a className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer">
                  Bayimiz Olun
                </a>
              </li>
            </ul>
          </nav>

          {/* Column 3 */}
          <nav className="col-span-1">
            <ul className="space-y-2">
              <li>
                <a className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer">
                  Yardım Merkezi
                </a>
              </li>
              <li>
                <a className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer">
                  Gizlilik & Şartlar
                </a>
              </li>
              <li>
                <a className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer">
                  Çerez Politikası
                </a>
              </li>
              <li>
                <a className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer">
                  Döviz Para Birimi
                </a>
              </li>
            </ul>
          </nav>

          {/* Column 4 */}
          <nav className="col-span-1">
            <ul className="space-y-2">
              <li>
                <a className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer">
                  Instagram
                </a>
              </li>
              <li>
                <a className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer">
                  Facebook
                </a>
              </li>
              <li>
                <a className="text-sm text-[#8C8C8C] hover:text-[#31286A] cursor-pointer">
                  LinkedIn
                </a>
              </li>
            </ul>
          </nav>

          {/* Newsletter Column */}
          <div className="col-span-2 lg:col-span-2">
            <form>
              <div className="flex border-b border-gray-300 pb-4">
                <input
                  type="email"
                  id="email"
                  aria-label="E-posta adresiniz"
                  placeholder="E-Posta Adresiniz"
                  className="w-full max-w-xs rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500  placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="bg-slate-100 text-[#8C8C8C] text-sm px-4 rounded-xl  transition w-[200px]"
                >
                  Abone Ol
                </button>
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
