"use client";

import { useEffect, useState } from "react";
import NProgress from "nprogress";
import styles from "./fullscreenloader.module.css";

export default function FullScreenLoader() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Create event listeners for NProgress
    const handleStart = () => setIsLoading(true);
    const handleDone = () => setIsLoading(false);

    // Override NProgress methods without using apply
    const originalStart = NProgress.start;
    const originalDone = NProgress.done;

    NProgress.start = function () {
      handleStart();
      return originalStart.call(this);
    };

    NProgress.done = function (force) {
      handleDone();
      return originalDone.call(this, force);
    };

    return () => {
      // Restore original methods on cleanup
      NProgress.start = originalStart;
      NProgress.done = originalDone;
    };
  }, []);

  return (
    <div
      className={`${styles.fullScreenLoader} ${
        isLoading ? styles.fullScreenLoaderVisible : ""
      }`}
    >
      <img
        src="/gif-1-1080px-unscreen.gif"
        alt="Loading"
        className={styles.loader}
      />
    </div>
  );
}
