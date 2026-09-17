"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    Tags,
    ShoppingCart,
    Users,
    Warehouse,
    BarChart3,
    Settings,
    Store,
    LogOut,
    X,
} from "lucide-react";

import useAuthStore from "@/store/authStore";

const navItems = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        label: "Products",
        href: "/admin/products",
        icon: Package,
    },
    {
        label: "Catalog",
        href: "/admin/catalog",
        icon: Tags,
    },
    {
        label: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
    },
    {
        label: "Customers",
        href: "/admin/customers",
        icon: Users,
    },
    {
        label: "Inventory",
        href: "/admin/inventory",
        icon: Warehouse,
    },
    {
        label: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
    },
    {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];

export default function AdminSidebar({
    mobileOpen = false,
    closeMobile,
}) {
    const pathname = usePathname();
    const router = useRouter();

    const user = useAuthStore(
        (state) => state.user
    );

    const logout = useAuthStore(
        (state) => state.logout
    );

    const isActive = (href) => {
        if (href === "/admin") {
            return pathname === "/admin";
        }

        return pathname.startsWith(href);
    };

    const handleLogout = () => {
        logout();
        router.replace("/login");
    };

    return (
        <>
            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close admin menu"
                    onClick={closeMobile}
                    className="fixed inset-0 z-[80] bg-black/40 lg:hidden"
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-[90] flex h-screen w-[260px] flex-col border-r border-[#E4E9EC] bg-white transition-transform duration-300 lg:translate-x-0 ${
                    mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >
                {/* LOGO */}
                <div className="flex h-[72px] items-center justify-between border-b border-[#E4E9EC] px-6">
                    <Link
                        href="/admin"
                        onClick={closeMobile}
                        className="text-xl font-bold tracking-[0.15em] text-[#0E3A53]"
                    >
                        FTC
                    </Link>

                    <button
                        type="button"
                        onClick={closeMobile}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
                    >
                        <X size={19} />
                    </button>
                </div>

                {/* ADMIN LABEL */}
                <div className="px-6 pb-3 pt-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                        Admin workspace
                    </p>
                </div>

                {/* NAV */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active =
                            isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMobile}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                    active
                                        ? "bg-[#EAF3F8] text-[#024E82]"
                                        : "text-[#52636C] hover:bg-[#F6F8F9] hover:text-[#024E82]"
                                }`}
                            >
                                <Icon
                                    size={18}
                                    strokeWidth={1.8}
                                />

                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* BOTTOM */}
                <div className="border-t border-[#E8ECEF] p-4">
                    <div className="mb-4 rounded-lg bg-[#F7F9FB] p-3">
                        <p className="truncate text-sm font-semibold text-[#243640]">
                            {user?.name || "Admin"}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                            Administrator
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            router.push("/")
                        }
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#52636C] transition hover:bg-gray-100"
                    >
                        <Store size={18} />
                        View Store
                    </button>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}