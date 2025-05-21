"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/app/utils/router";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchUserData } from "../../store/userSlice";
import AccountForm from "./AccountForm";
import Header from "../admin/Header/Header";
import { useTranslations } from "next-intl";

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.user);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const t = useTranslations("accountForm");

  useEffect(() => {
    // Check if user is authenticated and fetch data only once
    if (!hasCheckedAuth) {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/");
        return;
      }

      dispatch(fetchUserData());
      setHasCheckedAuth(true);
    }
  }, [dispatch, router, hasCheckedAuth]);

  return (
    <>
      <Header customRedirectUrl="/" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            {t("title")}
          </h1>
          {user && <AccountForm user={user} />}
        </div>
      </div>
    </>
  );
}
