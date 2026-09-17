"use client";

import axios from "axios";
import {
    useEffect,
    useState,
} from "react";

import {
    useRouter,
} from "next/navigation";

import {
    Search,
    Eye,
    Users,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import useAuthStore from "@/store/authStore";

export default function AdminCustomersPage() {
    const router = useRouter();

    const token = useAuthStore(
        (state) => state.token
    );

    const [customers, setCustomers] =
        useState([]);

    const [pagination, setPagination] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [searchInput, setSearchInput] =
        useState("");

    const [filters, setFilters] =
        useState({
            search: "",
            page: 1,
            limit: 20,
        });

    /* -------------------------
       GET CUSTOMERS
    ------------------------- */

    useEffect(() => {
        if (!token) return;

        const getCustomers =
            async () => {
                try {
                    setLoading(true);
                    setError("");

                    const params = {
                        page:
                            filters.page,

                        limit:
                            filters.limit,
                    };

                    if (
                        filters.search
                    ) {
                        params.search =
                            filters.search;
                    }

                    const response =
                        await axios.get(
                            `${process.env.NEXT_PUBLIC_API_URL}/admin/customers`,
                            {
                                params,

                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                    setCustomers(
                        response.data
                            ?.data || []
                    );

                    setPagination(
                        response.data
                            ?.pagination ||
                            null
                    );
                } catch (error) {
                    console.log(
                        "Admin customers error:",
                        error.response
                            ?.data ||
                            error.message
                    );

                    setCustomers([]);

                    setError(
                        error.response
                            ?.data
                            ?.message ||
                            "Unable to load customers."
                    );
                } finally {
                    setLoading(
                        false
                    );
                }
            };

        getCustomers();
    }, [token, filters]);

    /* -------------------------
       SEARCH
    ------------------------- */

    const handleSearch = (
        e
    ) => {
        e.preventDefault();

        setFilters((prev) => ({
            ...prev,

            search:
                searchInput.trim(),

            page: 1,
        }));
    };

    const clearSearch = () => {
        setSearchInput("");

        setFilters((prev) => ({
            ...prev,

            search: "",

            page: 1,
        }));
    };

    /* -------------------------
       FORMATTERS
    ------------------------- */

    const formatCurrency = (
        value
    ) =>
        new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }
        ).format(
            Number(value) || 0
        );

    const formatDate = (
        value
    ) => {
        if (!value) return "—";

        return new Date(
            value
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    /* -------------------------
       INITIALS
    ------------------------- */

    const getInitials = (
        name = ""
    ) => {
        const parts = name
            .trim()
            .split(" ")
            .filter(Boolean);

        if (!parts.length) {
            return "C";
        }

        return parts
            .slice(0, 2)
            .map(
                (part) =>
                    part[0]
            )
            .join("")
            .toUpperCase();
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">

            {/* HEADER */}
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
                    Customers
                </p>

                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#172B38] sm:text-3xl">
                    Customer Management
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    View registered
                    customers, order
                    activity and total
                    spending.
                </p>
            </div>

            {/* ERROR */}
            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* CARD */}
            <div className="mt-7 overflow-hidden rounded-xl border border-[#E4E9EC] bg-white">

                {/* SEARCH BAR */}
                <div className="border-b border-[#E8ECEF] p-4">

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        <form
                            onSubmit={
                                handleSearch
                            }
                            className="flex w-full max-w-[430px]"
                        >
                            <div className="relative flex-1">

                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    value={
                                        searchInput
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setSearchInput(
                                            e.target
                                                .value
                                        )
                                    }
                                    placeholder="Search name or email..."
                                    className="h-10 w-full rounded-l-lg border border-r-0 border-[#DDE3E7] pl-9 pr-3 text-sm text-[#344852] outline-none focus:border-[#024E82]"
                                />
                            </div>

                            <button
                                type="submit"
                                className="h-10 rounded-r-lg bg-[#024E82] px-4 text-sm font-medium text-white"
                            >
                                Search
                            </button>
                        </form>

                        {filters.search && (
                            <button
                                type="button"
                                onClick={
                                    clearSearch
                                }
                                className="h-10 rounded-lg border border-[#DDE3E7] px-4 text-sm text-gray-500 transition hover:border-[#024E82] hover:text-[#024E82]"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                </div>

                {/* RESULT COUNT */}
                <div className="flex items-center justify-between border-b border-[#EEF1F3] bg-[#FAFBFC] px-5 py-3">

                    <p className="text-xs text-gray-500">
                        {loading
                            ? "Loading customers..."
                            : `${
                                  pagination
                                      ?.totalItems ||
                                  0
                              } customers`}
                    </p>

                    <p className="hidden text-xs text-gray-400 sm:block">
                        Registered customers
                    </p>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">

                    <table className="min-w-[900px] w-full">

                        <thead>
                            <tr className="border-b border-[#EEF1F3] text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">

                                <th className="px-5 py-3">
                                    Customer
                                </th>

                                <th className="px-5 py-3">
                                    Email
                                </th>

                                <th className="px-5 py-3">
                                    Joined
                                </th>

                                <th className="px-5 py-3 text-center">
                                    Orders
                                </th>

                                <th className="px-5 py-3 text-right">
                                    Total Spent
                                </th>

                                <th className="px-5 py-3 text-right">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {/* LOADING */}
                            {loading ? (
                                Array.from({
                                    length: 6,
                                }).map(
                                    (
                                        _,
                                        index
                                    ) => (
                                        <tr
                                            key={
                                                index
                                            }
                                            className="border-b border-[#F0F2F4]"
                                        >
                                            <td
                                                colSpan={
                                                    6
                                                }
                                                className="px-5 py-4"
                                            >
                                                <div className="h-12 animate-pulse rounded-lg bg-gray-100" />
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : customers.length ===
                              0 ? (

                                /* EMPTY */
                                <tr>
                                    <td
                                        colSpan={
                                            6
                                        }
                                        className="px-5 py-16 text-center"
                                    >
                                        <Users
                                            size={
                                                32
                                            }
                                            className="mx-auto text-gray-300"
                                        />

                                        <p className="mt-3 text-sm font-medium text-gray-500">
                                            No customers
                                            found
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Try another
                                            search.
                                        </p>
                                    </td>
                                </tr>
                            ) : (

                                /* CUSTOMERS */
                                customers.map(
                                    (
                                        customer
                                    ) => (
                                        <tr
                                            key={
                                                customer.id
                                            }
                                            className="border-b border-[#F0F2F4] text-sm transition last:border-0 hover:bg-[#FAFBFC]"
                                        >

                                            {/* CUSTOMER */}
                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF3F8] text-xs font-semibold text-[#024E82]">
                                                        {getInitials(
                                                            customer.name
                                                        )}
                                                    </div>

                                                    <div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                router.push(
                                                                    `/admin/customers/${customer.id}`
                                                                )
                                                            }
                                                            className="font-medium text-[#243640] transition hover:text-[#024E82]"
                                                        >
                                                            {customer.name ||
                                                                "Customer"}
                                                        </button>

                                                        <p className="mt-1 text-xs text-gray-400">
                                                            ID #
                                                            {
                                                                customer.id
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* EMAIL */}
                                            <td className="px-5 py-4 text-gray-500">
                                                {
                                                    customer.email
                                                }
                                            </td>

                                            {/* JOINED */}
                                            <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                                                {formatDate(
                                                    customer.createdAt
                                                )}
                                            </td>

                                            {/* ORDER COUNT */}
                                            <td className="px-5 py-4 text-center">
                                                <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-[#F2F5F7] px-2.5 py-1 text-xs font-medium text-[#52636C]">
                                                    {customer.orderCount ||
                                                        0}
                                                </span>
                                            </td>

                                            {/* TOTAL SPENT */}
                                            <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-[#243640]">
                                                {formatCurrency(
                                                    customer.totalSpent
                                                )}
                                            </td>

                                            {/* ACTION */}
                                            <td className="px-5 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        router.push(
                                                            `/admin/customers/${customer.id}`
                                                        )
                                                    }
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#DDE3E7] text-gray-500 transition hover:border-[#024E82] hover:text-[#024E82]"
                                                    aria-label="View customer"
                                                >
                                                    <Eye
                                                        size={
                                                            16
                                                        }
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {pagination &&
                    pagination.totalPages >
                        1 && (
                        <div className="flex flex-col gap-3 border-t border-[#E8ECEF] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                            <p className="text-xs text-gray-400">
                                Page{" "}
                                {
                                    pagination.currentPage
                                }{" "}
                                of{" "}
                                {
                                    pagination.totalPages
                                }
                            </p>

                            <div className="flex gap-2">

                                <button
                                    type="button"
                                    disabled={
                                        pagination.currentPage ===
                                        1
                                    }
                                    onClick={() =>
                                        setFilters(
                                            (
                                                prev
                                            ) => ({
                                                ...prev,

                                                page:
                                                    prev.page -
                                                    1,
                                            })
                                        )
                                    }
                                    className="flex h-9 items-center gap-1 rounded-lg border border-[#DDE3E7] px-3 text-xs font-medium text-[#52636C] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft
                                        size={
                                            15
                                        }
                                    />

                                    Previous
                                </button>

                                <button
                                    type="button"
                                    disabled={
                                        pagination.currentPage ===
                                        pagination.totalPages
                                    }
                                    onClick={() =>
                                        setFilters(
                                            (
                                                prev
                                            ) => ({
                                                ...prev,

                                                page:
                                                    prev.page +
                                                    1,
                                            })
                                        )
                                    }
                                    className="flex h-9 items-center gap-1 rounded-lg border border-[#DDE3E7] px-3 text-xs font-medium text-[#52636C] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next

                                    <ChevronRight
                                        size={
                                            15
                                        }
                                    />
                                </button>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
}