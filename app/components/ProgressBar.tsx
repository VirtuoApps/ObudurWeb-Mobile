"use client";

import { useEffect } from "react";
import NProgress from "nprogress";
import { useNavigationEvents } from "../providers/NavigationEventsProvider";

// Custom styling for NProgress
import "./nprogress.css";

export default function ProgressBar() {
  const navigationEvents = useNavigationEvents();

  useEffect(() => {
    // Configure NProgress
    NProgress.configure({ showSpinner: false });

    const start = () => {
      NProgress.start();
    };

    const end = () => {
      NProgress.done();
    };

    // Similar to Router.events in the Pages Router
    navigationEvents.on("start", start);
    navigationEvents.on("complete", end);
    navigationEvents.on("error", end);

    return () => {
      navigationEvents.off("start", start);
      navigationEvents.off("complete", end);
      navigationEvents.off("error", end);
    };
  }, [navigationEvents]);

  return null;
}
