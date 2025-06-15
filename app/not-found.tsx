"use client";

import Link from "next/link";
import Image from "next/image";
import { Kumbh_Sans } from "next/font/google";
import { useRouter } from "next/navigation";

const kumbhSans = Kumbh_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function NotFound() {
  const router = useRouter();

  return (
    <html>
      <body>
        <div
          className={`${kumbhSans.className} relative flex flex-col items-center justify-center min-h-screen bg-white overflow-hidden`}
        >
          {/* Logo - Responsive positioning */}
          <Image
            src="/obudur-logo.png"
            alt="Obudur Logo"
            width={150}
            height={40}
            className="absolute top-[32px] left-[24px]  z-10 w-24 h-auto sm:w-32 md:w-36 lg:w-[150px]"
            onClick={() => router.push("/")}
          />

          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/background.png')" }}
          />

          {/* 404 Image - Responsive sizing */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <Image
              src="/404.png"
              alt="Error 404"
              width={1188}
              height={500}
              className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl h-auto"
              priority
            />
          </div>

          {/* Content - Responsive typography and spacing */}
          <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 md:px-8 max-w-sm sm:max-w-lg md:max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#362C75] mb-3 sm:mb-4 leading-tight sm:leading-relaxed">
              Bir şeyler ters gitti!
            </h1>

            <div className="space-y-2  mb-6 sm:mb-8">
              <p className="text-lg sm:text-xl md:text-2xl font-medium text-[#262626]">
                Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış
                olabilir.
              </p>
              <p className="text-sm sm:text-base font-medium text-[#262626]">
                Ama doğru gayrimenkul hâlâ bir tık uzağınızda.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center justify-center px-4 py-3 w-[182px] sm:px-6 sm:py-4 bg-[#5E5691] hover:bg-[#362C75] active:bg-[#2A1F5C] text-white font-medium text-sm sm:text-base rounded-xl sm:rounded-2xl transition-colors duration-300 ease-in-out touch-manipulation"
            >
              Ana Sayfa'ya Dön
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
