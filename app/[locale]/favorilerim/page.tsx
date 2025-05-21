"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import { fetchUserFavorites } from "@/app/store/favoritesSlice";
import ResidentBox from "@/app/HomePage/ListView/ResidentBox/ResidentBox";
import { useRouter } from "@/app/utils/router";
import { useTranslations } from "next-intl";
import AuthPopup from "@/app/components/AuthPopup/AuthPopup";

export default function FavoritesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const t = useTranslations();
  const user = useSelector((state: RootState) => state.user.user);
  const { favorites, loading, error } = useSelector(
    (state: RootState) => state.favorites
  );
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    // Wait a moment to ensure Redux state is fully loaded
    const timer = setTimeout(() => {
      setCheckedAuth(true);

      if (!user) {
        setIsAuthPopupOpen(true);
      } else {
        // Fetch favorites when user is available
        dispatch(fetchUserFavorites());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch, user]);

  // Update when user state changes
  useEffect(() => {
    if (user && checkedAuth) {
      setIsAuthPopupOpen(false);
      dispatch(fetchUserFavorites());
    }
  }, [user, checkedAuth, dispatch]);

  const handleAuthClose = () => {
    setIsAuthPopupOpen(false);
    if (!user) {
      // If still not logged in, redirect to homepage
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">Favorilerim</h1>
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">Favorilerim</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>
            Favorilerinizi yüklerken bir hata oluştu. Lütfen daha sonra tekrar
            deneyin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-700">Favorilerim</h1>

      {favorites.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-700 mb-4">
            Henüz favori ilanınız bulunmamaktadır.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            İlanları Keşfet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((favorite) => {
            const hotel = favorite.hotelDetails;
            if (!hotel) return null;

            // Format the price
            let priceDisplay = "";
            if (hotel.price && hotel.price.length > 0) {
              const price = hotel.price[0];
              priceDisplay = `${price.amount.toLocaleString()} ${
                price.currency
              }`;
            }

            return (
              <ResidentBox
                key={favorite._id}
                isFavorite={true}
                hotelId={hotel._id}
                slug={hotel.slug}
                type={hotel.listingType?.tr || "Satılık"}
                residentTypeName={hotel.housingType?.tr || "Modern Villa"}
                title={hotel.title?.tr || ""}
                price={priceDisplay}
                bedCount={hotel.bedRoomCount?.toString() || ""}
                floorCount={hotel.floorCount?.toString() || ""}
                area={`${hotel.totalSize}m²` || ""}
                locationText={`${hotel.city?.tr}, ${hotel.state?.tr}` || ""}
                image={
                  hotel.images && hotel.images.length > 0
                    ? hotel.images[0]
                    : "/example-house.png"
                }
              />
            );
          })}
        </div>
      )}

      <AuthPopup isOpen={isAuthPopupOpen} onClose={handleAuthClose} />
    </div>
  );
}
