"use client";

import NextLink from "next/link";
import { forwardRef } from "react";
import NProgress from "nprogress";
import { usePathname, useSearchParams } from "next/navigation";

import { shouldTriggerStartEvent } from "./shouldTriggerStartEvent";

export const Link = forwardRef<HTMLAnchorElement, React.ComponentProps<"a">>(
  function Link({ href, onClick, ...rest }, ref) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const useLink = href && href.toString().startsWith("/");

    if (!useLink)
      return (
        <a href={href?.toString()} onClick={onClick} {...rest} ref={ref} />
      );

    return (
      <NextLink
        href={href}
        onClick={(event) => {
          let targetHref = href.toString();

          // Create current URL for comparison
          let currentUrl =
            pathname +
            (searchParams.toString() ? `?${searchParams.toString()}` : "");

          //Remove /tr or /en from currentUrl
          currentUrl = currentUrl.replace("/tr", "").replace("/en", "");

          //Remove everyting after #
          let targetHrefWithoutHash = targetHref;
          if (targetHrefWithoutHash.includes("#")) {
            targetHrefWithoutHash = targetHref.split("#")[0];
          }

          console.log({
            currentUrl,
            targetHref,
          });

          // Multiple checks to ensure we don't start progress for same page
          const isSamePage =
            currentUrl === targetHrefWithoutHash ||
            pathname === targetHrefWithoutHash ||
            !shouldTriggerStartEvent(targetHref, event);

          if (!isSamePage) {
            NProgress.start();
          }

          if (onClick) onClick(event);
        }}
        {...rest}
        ref={ref}
      />
    );
  }
);
