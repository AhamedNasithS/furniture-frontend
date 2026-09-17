"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import {
    Heart,
    Menu,
    Search,
    ShoppingBag,
    UserRound,
    X,
} from "lucide-react";

import {
    AnimatePresence,
    motion,
} from "framer-motion";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    const token = useAuthStore(
        (state) => state.token
    );

    const user = useAuthStore(
        (state) => state.user
    );

    const isAuthenticated = useAuthStore(
        (state) => state.isAuthenticated
    );

    const cartCount =
        useCartStore(
            (state) =>
                state.cartCount
        );

    const fetchCartCount =
        useCartStore(
            (state) =>
                state.fetchCartCount
        );


    const navItems = [
        {
            label: "Home",
            href: "/",
        },
        {
            label: "Shop",
            href: "/shop",
        },
        {
            label: "Wishlist",
            href: "/wishlist",
        },
    ];

    const handleAccount = () => {
        if (isAuthenticated) {
            router.push("/account");
        } else {
            router.push("/login");
        }
    };

    const handleMobileNavigation = (
        href
    ) => {
        setMobileMenuOpen(false);
        router.push(href);
    };

    useEffect(() => {
        fetchCartCount(token);
    }, [token, fetchCartCount]);

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-[#FFFFFF] backdrop-blur-md">
                <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">

                    {/* MOBILE MENU */}
                    <button
                        type="button"
                        onClick={() =>
                            setMobileMenuOpen(true)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full text-[#20323c] transition hover:bg-[#f4f5f3] lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu size={22} strokeWidth={1.8} />
                    </button>

                    {/* LOGO */}
                    <Link
                        href="/"
                        className="text-[22px] font-bold tracking-[0.16em] text-[#0e3a53] sm:text-2xl"
                    >
                        FTC
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav className="hidden items-center gap-7 lg:flex xl:gap-9">
                        {navItems.map((item) => {
                            const isActive =
                                item.href === "/"
                                    ? pathname === "/"
                                    : pathname.startsWith(
                                        item.href.split("?")[0]
                                    );

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`relative pb-2 text-sm font-medium transition-colors ${isActive
                                        ? "text-[#024E82]"
                                        : "text-[#4c565c] hover:text-[#024E82]"
                                        }`}
                                >
                                    {item.label}

                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#024E82]" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-1 sm:gap-2">

                        {/* SEARCH */}
                        <button
                            type="button"
                            onClick={() =>
                                router.push("/search")
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-full text-[#475569] transition hover:bg-[#f4f5f3]"
                            aria-label="Search"
                        >
                            <Search
                                size={20}
                                strokeWidth={1.7}
                            />
                        </button>

                        {/* CART */}
                        <button
                            type="button"
                            onClick={() =>
                                router.push("/cart")
                            }
                            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#475569] transition hover:bg-[#f4f5f3]"
                            aria-label="Cart"
                        >
                            <ShoppingBag
                                size={20}
                                strokeWidth={1.7}
                            />

                            {cartCount > 0 && (
                                <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#0e3a53] px-1 text-[10px] font-medium leading-none text-white">
                                    {cartCount > 99
                                        ? "99+"
                                        : cartCount}
                                </span>
                            )}
                        </button>

                        {/* ACCOUNT */}
                        <button
                            type="button"
                            onClick={handleAccount}
                            className="hidden items-center gap-2 rounded-full p-1.5 transition hover:bg-[#f4f5f3] sm:flex"
                            aria-label="Account"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf3f6] text-[#0e3a53]">
                                <UserRound
                                    size={18}
                                    strokeWidth={1.7}
                                />
                            </span>

                            <span className="hidden max-w-[110px] truncate pr-2 text-sm font-medium text-[#475569] xl:block">
                                {isAuthenticated
                                    ? user?.name || "Account"
                                    : "Sign in"}
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* BACKDROP */}
                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                            onClick={() =>
                                setMobileMenuOpen(false)
                            }
                            className="fixed inset-0 z-[60] bg-black/35 backdrop-blur-[2px] lg:hidden"
                        />

                        {/* DRAWER */}
                        <motion.div
                            initial={{
                                x: "-100%",
                            }}
                            animate={{
                                x: 0,
                            }}
                            exit={{
                                x: "-100%",
                            }}
                            transition={{
                                duration: 0.28,
                                ease: "easeOut",
                            }}
                            className="fixed left-0 top-0 z-[70] flex h-full w-[84%] max-w-[340px] flex-col bg-white px-6 py-6 shadow-xl lg:hidden"
                        >
                            {/* MOBILE HEADER */}
                            <div className="flex items-center justify-between">
                                <Link
                                    href="/"
                                    onClick={() =>
                                        setMobileMenuOpen(false)
                                    }
                                    className="text-2xl font-bold tracking-[0.16em] text-[#0e3a53]"
                                >
                                    FTC
                                </Link>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setMobileMenuOpen(false)
                                    }
                                    className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100"
                                    aria-label="Close menu"
                                >
                                    <X
                                        size={22}
                                        strokeWidth={1.7}
                                    />
                                </button>
                            </div>

                            {/* MOBILE NAV */}
                            <nav className="mt-10 flex flex-col">
                                {navItems.map(
                                    (item, index) => (
                                        <motion.button
                                            key={item.label}
                                            initial={{
                                                opacity: 0,
                                                x: -15,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                            }}
                                            transition={{
                                                delay:
                                                    0.05 *
                                                    index,
                                            }}
                                            type="button"
                                            onClick={() =>
                                                handleMobileNavigation(
                                                    item.href
                                                )
                                            }
                                            className="border-b border-gray-100 py-4 text-left text-base font-medium text-[#475569]"
                                        >
                                            {item.label}
                                        </motion.button>
                                    )
                                )}
                            </nav>

                            {/* MOBILE ACTIONS */}
                            <div className="mt-8 space-y-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleMobileNavigation(
                                            "/wishlist"
                                        )
                                    }
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#475569] transition hover:bg-gray-100"
                                >
                                    <Heart
                                        size={19}
                                        strokeWidth={1.7}
                                    />

                                    Wishlist
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setMobileMenuOpen(
                                            false
                                        );

                                        handleAccount();
                                    }}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#34454d] transition hover:bg-gray-100"
                                >
                                    <UserRound
                                        size={19}
                                        strokeWidth={1.7}
                                    />

                                    {isAuthenticated
                                        ? user?.name ||
                                        "My Account"
                                        : "Sign in"}
                                </button>
                            </div>

                            {/* BOTTOM */}
                            <div className="mt-auto border-t border-gray-100 pt-5">
                                <p className="text-xs leading-5 text-gray-400">
                                    Premium furniture for
                                    modern living.
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}