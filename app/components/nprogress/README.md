# NProgress Implementation for Next.js 13 App Router

This implementation adds NProgress loading indicators to your Next.js 13 application with App Router.

## How it works

1. The `Link` component wraps Next.js's Link component and calls `NProgress.start()` when navigating to internal routes.
2. The `NProgressDone` component uses React's `useEffect` with `usePathname` and `useSearchParams` to call `NProgress.done()` when navigation completes.
3. The `NProgressProvider` component wraps `NProgressDone` in a Suspense boundary and configures NProgress.

## Usage

1. Import and use the `Link` component instead of Next.js's Link:

```tsx
import { Link } from "@/app/components/ui";

// Then use it like a normal Next.js Link
<Link href="/about">About</Link>
```

2. For programmatic navigation with `router.push()`, use the provided router hook:

```tsx
import { useRouter } from "@/app/utils/router";

function MyComponent() {
  const router = useRouter();
  
  const handleClick = () => {
    // This will trigger NProgress
    router.push('/about');
  };

  return <button onClick={handleClick}>Go to About</button>;
}
```

3. The NProgress loading indicator is automatically shown during page transitions.

## Customization

You can customize the appearance of NProgress by modifying the `nprogress.css` file. The default settings can be changed in the `NProgressProvider.tsx` file. 