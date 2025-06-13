"use client";

import React, { useState, useEffect } from "react";
import LoginForm from "./LoginForm/LoginForm";
import SignupForm from "./SignupForm/SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm/ForgotPasswordForm";
import SignupEmailVerifySendPopup from "../SignupEMailVerifySendPopup/SignupEmailVerifySendPopup";

type AuthPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultState?: string;
};

export default function AuthPopup({
  isOpen,
  onClose,
  defaultState = "login",
}: AuthPopupProps) {
  const [authState, setAuthState] = useState(defaultState);

  // Reset authState when popup opens or defaultState changes
  useEffect(() => {
    if (isOpen) {
      setAuthState(defaultState);
    }
  }, [isOpen, defaultState]);

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
