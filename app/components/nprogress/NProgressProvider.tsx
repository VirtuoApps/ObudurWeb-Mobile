"use client";

import { Suspense } from "react";
import NProgress from "nprogress";
import { NProgressDone } from "./index";
import FullScreenLoader from "./FullScreenLoader";

// Import custom CSS to hide default NProgress elements
import "./custom-nprogress.css";

// Configure NProgress - disabling the bar as we'll use full-screen loader instead
NProgress.configure({
  minimum: 0.1,
  showSpinner: false, // Disable default spinner
  trickleSpeed: 200,
  // Removing the parent setting as it was causing errors
});

export default function NProgressProvider() {
  return (
    <Suspense fallback={null}>
      <NProgressDone />
      <FullScreenLoader />
    </Suspense>
  );
}
