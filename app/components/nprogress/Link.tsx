"use client";

import NextLink from "next/link";
import { forwardRef } from "react";
import NProgress from "nprogress";

import { shouldTriggerStartEvent } from "./shouldTriggerStartEvent";

export const Link = forwardRef<HTMLAnchorElement, React.ComponentProps<"a">>(
  function Link({ href, onClick, ...rest }, ref) {
    const useLink = href && href.toString().startsWith("/");
    if (!useLink)
      return (
        <a href={href?.toString()} onClick={onClick} {...rest} ref={ref} />
      );

    return (
      <NextLink
        href={href}
        onClick={(event) => {
          if (shouldTriggerStartEvent(href.toString(), event))
            NProgress.start();
          if (onClick) onClick(event);
        }}
        {...rest}
        ref={ref}
      />
    );
  }
);
