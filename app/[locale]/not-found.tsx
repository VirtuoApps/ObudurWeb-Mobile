import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">
        The requested page or locale does not exist.
      </p>
      <Link
        href="/en"
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md"
      >
        Return to Home
      </Link>
    </div>
  );
}
