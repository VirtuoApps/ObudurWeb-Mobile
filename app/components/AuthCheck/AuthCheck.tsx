"use client";

import React, { useEffect } from "react";
import axiosInstance from "../../../axios";
import { useAppDispatch } from "../../store/hooks";
import { fetchUserData } from "../../store/userSlice";

export default function AuthCheck() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Set the authorization header for all future requests
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
      // Fetch user data
      dispatch(fetchUserData());
    }
  }, [dispatch]);

  return null;
}
