"use client";

import {
  createContext,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

export type NavigationEvent = "start" | "complete" | "error";

export interface NavigationEvents {
  on: (event: NavigationEvent, callback: () => void) => void;
  off: (event: NavigationEvent, callback: () => void) => void;
  emit: (event: NavigationEvent) => void;
}

const NavigationEventsContext = createContext<NavigationEvents | null>(null);

export function useNavigationEvents() {
  const context = useContext(NavigationEventsContext);
  if (!context) {
    throw new Error(
      "useNavigationEvents must be used within a NavigationEventsProvider"
    );
  }
  return context;
}

export function NavigationEventsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Use refs for event callbacks to avoid re-renders and infinite loops
  const eventsRef = useRef<Map<NavigationEvent, Set<() => void>>>(
    new Map([
      ["start", new Set()],
      ["complete", new Set()],
      ["error", new Set()],
    ])
  );

  // Track if this is the initial render
  const isFirstRender = useRef(true);

  // Create stable references to event handler methods
  const on = useCallback((event: NavigationEvent, callback: () => void) => {
    const callbacks = eventsRef.current.get(event) || new Set();
    callbacks.add(callback);
    eventsRef.current.set(event, callbacks);
  }, []);

  const off = useCallback((event: NavigationEvent, callback: () => void) => {
    const callbacks = eventsRef.current.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }, []);

  const emit = useCallback((event: NavigationEvent) => {
    const callbacks = eventsRef.current.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback());
    }
  }, []);

  // Handle pathname and searchParams changes
  useEffect(() => {
    // Skip the initial render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Emit navigation start and complete events
    emit("start");

    const timeoutId = setTimeout(() => {
      emit("complete");
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pathname, searchParams, emit]);

  // Handle navigation errors with window error event
  useEffect(() => {
    const handleError = () => {
      emit("error");
    };

    window.addEventListener("error", handleError);
    return () => {
      window.removeEventListener("error", handleError);
    };
  }, [emit]);

  // Handle link clicks to start navigation early
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (
        link &&
        link.href &&
        link.href.startsWith(window.location.origin) &&
        !link.hasAttribute("download") &&
        !link.target
      ) {
        emit("start");
      }
    };

    document.addEventListener("click", handleLinkClick);
    return () => {
      document.removeEventListener("click", handleLinkClick);
    };
  }, [emit]);

  // Create stable navigation events object with memoized methods
  const navigationEvents = {
    on,
    off,
    emit,
  };

  return (
    <NavigationEventsContext.Provider value={navigationEvents}>
      {children}
    </NavigationEventsContext.Provider>
  );
}
