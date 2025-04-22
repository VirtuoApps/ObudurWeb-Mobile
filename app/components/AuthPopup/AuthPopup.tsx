"use client";

import React, { useState } from "react";
import LoginForm from "./LoginForm/LoginForm";

type AuthPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthPopup({ isOpen, onClose }: AuthPopupProps) {
  const [authState, setAuthState] = useState("login");

  if (!isOpen) return null;

  if (authState === "login") {
    return <LoginForm onClose={onClose} />;
  }

  return <div>AuthPopup</div>;
}
