"use client";

import { useRouter as useNextRouter } from "next/navigation";
import NProgress from "nprogress";
import { shouldTriggerStartEvent } from "./shouldTriggerStartEvent";
import { useCallback } from "react";

export function useProgressRouter() {
  const router = useNextRouter();

  // Wrap the push method to trigger NProgress
  const push = useCallback(
    (href: string, options?: Parameters<typeof router.push>[1]) => {
      const shouldStartProgress = shouldTriggerStartEvent(href);
      if (shouldStartProgress) {
        NProgress.start();
      }
      router.push(href, options);
    },
    [router]
  );

  // Wrap other navigation methods similarly
  const replace = useCallback(
    (href: string, options?: Parameters<typeof router.replace>[1]) => {
      const shouldStartProgress = shouldTriggerStartEvent(href);
      if (shouldStartProgress) {
        NProgress.start();
      }
      router.replace(href, options);
    },
    [router]
  );

  // Forward all other router methods and properties
  return {
    ...router,
    push,
    replace,
  };
}
