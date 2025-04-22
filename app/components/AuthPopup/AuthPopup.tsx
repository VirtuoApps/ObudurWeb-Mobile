"use client";

import React, { useState } from "react";
import LoginForm from "./LoginForm/LoginForm";
import SignupForm from "./SignupForm/SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm/ForgotPasswordForm";

type AuthPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthPopup({ isOpen, onClose }: AuthPopupProps) {
  const [authState, setAuthState] = useState("login");

  if (!isOpen) return null;

  if (authState === "login") {
    return <LoginForm onClose={onClose} onChangeAuthState={setAuthState} />;
  }

  if (authState === "signup") {
    return <SignupForm onClose={onClose} onChangeAuthState={setAuthState} />;
  }

  if (authState === "forgotPassword") {
    return (
      <ForgotPasswordForm onClose={onClose} onChangeAuthState={setAuthState} />
    );
  }

  return <LoginForm onClose={onClose} onChangeAuthState={setAuthState} />;
}
