"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Menu,
} from "lucide-react";

import useAuthStore from "@/store/authStore";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({
  children,
}) {
  const router = useRouter();

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const [hydrated, setHydrated] =
    useState(false);

  useEffect(() => {
    // In case Zustand already hydrated
    if (
      useAuthStore.persist.hasHydrated()
    ) {
      setHydrated(true);
    }

    // Wait for persist hydration
    const unsubscribe =
      useAuthStore.persist.onFinishHydration(
        () => {
          setHydrated(true);
        }
      );

    return unsubscribe;
  }, []);

  useEffect(() => {
    // IMPORTANT:
    // Do not redirect before hydration finishes
    if (!hydrated) return;

    if (!token) {
      router.replace("/login");
      return;
    }

    if (user?.role !== "admin") {
      router.replace("/");
    }
  }, [
    hydrated,
    token,
    user,
    router,
  ]);

  // Wait while localStorage auth is loading
  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#024E82]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FB]">
      <AdminSidebar
        mobileOpen={
          mobileMenuOpen
        }
        closeMobile={() =>
          setMobileMenuOpen(
            false
          )
        }
      />

      <div className="lg:pl-[260px]">

        {/* MOBILE ADMIN HEADER */}
        <header className="sticky top-0 z-40 flex h-[64px] items-center justify-between border-b border-[#E4E9EC] bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                true
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#344852] hover:bg-gray-100"
          >
            <Menu size={21} />
          </button>

          <span className="text-base font-bold tracking-[0.13em] text-[#0E3A53]">
            FTC ADMIN
          </span>

          <div className="w-10" />
        </header>

        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}