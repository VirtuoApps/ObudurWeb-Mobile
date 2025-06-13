"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/axios";

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useParams();
  const code = params.code as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (code) {
      const verifyEmail = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axiosInstance.patch(
            `/auth/verify-email/${code}`
          );
          if (response.data.status === "success") {
            router.push("/?emailConfirmed=true");
          } else {
            // This case might not be reached if the API always throws an error on failure
            setError("E-posta doğrulaması başarısız oldu.");
          }
        } catch (err: any) {
          setError("E-posta doğrulaması sırasında bir hata oluştu.");
          console.log(err);
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } finally {
          setLoading(false);
        }
      };

      verifyEmail();
    }
  }, [code, router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      <div>
        {loading && <p>E-posta adresiniz doğrulanıyor, lütfen bekleyin...</p>}
        {error && <p style={{ color: "red" }}>Hata: {error}</p>}
      </div>
    </div>
  );
}
