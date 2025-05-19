"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchUserFavorites } from "../store/favoritesSlice";

export default function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  // Fetch favorites when user changes (logs in or out)
  useEffect(() => {
    if (user) {
      dispatch(fetchUserFavorites());
    }
  }, [user, dispatch]);

  return <>{children}</>;
}
