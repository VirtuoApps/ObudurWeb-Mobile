"use client";

import { Suspense } from "react";
import NProgress from "nprogress";
import { NProgressDone } from "./index";

// Configure NProgress
NProgress.configure({
  minimum: 0.1,
  showSpinner: true,
  trickleSpeed: 200,
});

export default function NProgressProvider() {
  return (
    <Suspense fallback={null}>
      <NProgressDone />
    </Suspense>
  );
}
