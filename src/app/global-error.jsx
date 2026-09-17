"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center px-4">
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
              FTC encountered an unexpected error.
              Please try again.
            </p>

            {error?.digest && (
              <p className="mt-3 text-xs text-gray-400">
                Error reference: {error.digest}
              </p>
            )}

            <button
              type="button"
              onClick={() => reset()}
              className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#024E82] px-5 text-sm font-medium text-white transition hover:bg-[#073E64]"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}