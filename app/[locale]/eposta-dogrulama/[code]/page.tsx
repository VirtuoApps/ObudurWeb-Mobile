"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/axios";

type VerifyEmailPageProps = {
  params: {
    code: string;
  };
};

export default function VerifyEmailPage({ params }: VerifyEmailPageProps) {
  const router = useRouter();
  const { code } = params;
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
