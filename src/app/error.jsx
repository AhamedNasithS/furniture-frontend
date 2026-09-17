"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle
            size={30}
            className="text-red-500"
          />
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-[#172B38]">
          Something went wrong
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          We couldn{"'"}t complete your request.
          Please try again or return to the home page.
        </p>

        {error?.digest && (
          <p className="mt-3 text-xs text-gray-400">
            Error reference: {error.digest}
          </p>
        )}

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#024E82] px-5 text-sm font-medium text-white transition hover:bg-[#073E64]"
          >
            <RefreshCw size={16} />
            Try Again
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 text-sm font-medium text-[#344852] transition hover:bg-gray-50"
          >
            <Home size={16} />
            Go Home
          </button>

        </div>
      </div>
    </div>
  );
}