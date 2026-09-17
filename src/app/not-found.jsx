import Link from "next/link";
import { Home, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#024E82]">
          404
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[#172B38] sm:text-4xl">
          Page not found
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
          The page you{"'"}re looking for doesn{"'"}t exist,
          may have been moved, or is no longer available.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#024E82] px-5 text-sm font-medium text-white transition hover:bg-[#073E64]"
          >
            <Home size={16} />
            Go Home
          </Link>

          <Link
            href="/shop"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 text-sm font-medium text-[#344852] transition hover:bg-gray-50"
          >
            <ShoppingBag size={16} />
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}