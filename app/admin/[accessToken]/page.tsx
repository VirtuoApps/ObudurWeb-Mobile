"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/app/utils/router";
import axiosInstance from "@/axios";
import { useAppDispatch } from "@/app/store/hooks";
import { fetchUserData } from "@/app/store/userSlice";

export default function AutoLogin() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const accessToken = params.accessToken as string;

        if (!accessToken) {
          router.replace("/admin/login");
          return;
        }

        // Store token in localStorage
        localStorage.setItem("accessToken", accessToken);

        // Set the authorization header for all future requests
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        // Fetch user data to update Redux store
        await dispatch(fetchUserData());

        // Redirect to admin dashboard
        router.replace("/admin/ilanlar");
      } catch (error) {
        console.error("Auto login failed:", error);
        router.replace("/admin/login");
      }
    };

    autoLogin();
  }, [params, router, dispatch]);

  return (
    <html lang="tr">
      <body>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5E5691] mx-auto"></div>
            <p className="mt-4 text-gray-600">Giriş yapılıyor...</p>
          </div>
        </div>
      </body>
    </html>
  );
}
