"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/app/utils/router";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchUserData } from "../../store/userSlice";
import AccountForm from "./AccountForm";
import Header from "../admin/Header/Header";
import { useTranslations } from "next-intl";
import Footer from "../resident/[slug]/Footer/Footer";

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
    <div className="min-h-screen" style={{ backgroundColor: "#E9E8F3" }}>
      <Header />
      <div className="max-w-[1440px] mx-auto px-[60px] py-12">
        {user && <AccountForm user={user} />}
      </div>
      <Footer />
    </div>
  );
}
