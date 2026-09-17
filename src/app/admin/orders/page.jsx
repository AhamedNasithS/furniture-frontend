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
    ShoppingCart,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import useAuthStore from "@/store/authStore";

function OrderStatusBadge({
    status,
}) {
    const styles = {
        pending:
            "bg-amber-50 text-amber-600",
        confirmed:
            "bg-blue-50 text-blue-600",
        processing:
            "bg-purple-50 text-purple-600",
        shipped:
            "bg-cyan-50 text-cyan-600",
        delivered:
            "bg-green-50 text-green-600",
        cancelled:
            "bg-red-50 text-red-600",
    };

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                styles[status] ||
                "bg-gray-100 text-gray-500"
            }`}
        >
            {status}
        </span>
    );
}

function PaymentStatusBadge({
    status,
}) {
    const styles = {
        pending:
            "bg-amber-50 text-amber-600",
        paid:
            "bg-green-50 text-green-600",
        failed:
            "bg-red-50 text-red-600",
        refunded:
            "bg-purple-50 text-purple-600",
    };

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                styles[status] ||
                "bg-gray-100 text-gray-500"
            }`}
        >
            {status}
        </span>
    );
}

export default function AdminOrdersPage() {
    const router = useRouter();

    const token = useAuthStore(
        (state) => state.token
    );

    const [orders, setOrders] =
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
            status: "",
            paymentStatus: "",
            page: 1,
            limit: 20,
        });

    /* -------------------------
       GET ORDERS
    ------------------------- */

    useEffect(() => {
        if (!token) return;

        const getOrders = async () => {
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

                if (
                    filters.status
                ) {
                    params.status =
                        filters.status;
                }

                if (
                    filters.paymentStatus
                ) {
                    params.paymentStatus =
                        filters.paymentStatus;
                }

                const response =
                    await axios.get(
                        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders`,
                        {
                            params,

                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                setOrders(
                    response.data?.data ||
                        []
                );

                setPagination(
                    response.data
                        ?.pagination ||
                        null
                );
            } catch (error) {
                console.log(
                    "Admin orders error:",
                    error.response?.data ||
                        error.message
                );

                setOrders([]);

                setError(
                    error.response?.data
                        ?.message ||
                        "Unable to load orders."
                );
            } finally {
                setLoading(false);
            }
        };

        getOrders();
    }, [token, filters]);

    /* -------------------------
       SEARCH
    ------------------------- */

    const handleSearch = (e) => {
        e.preventDefault();

        setFilters((prev) => ({
            ...prev,

            search:
                searchInput.trim(),

            page: 1,
        }));
    };

    const clearFilters = () => {
        setSearchInput("");

        setFilters({
            search: "",
            status: "",
            paymentStatus: "",
            page: 1,
            limit: 20,
        });
    };

    /* -------------------------
       FORMATTERS
    ------------------------- */

    const formatCurrency = (
        value
    ) => {
        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }
        ).format(
            Number(value) || 0
        );
    };

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

    const hasFilters =
        filters.search ||
        filters.status ||
        filters.paymentStatus;

    return (
        <div className="p-4 sm:p-6 lg:p-8">

            {/* HEADER */}
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
                    Sales
                </p>

                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#172B38] sm:text-3xl">
                    Orders
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    View and manage
                    customer orders,
                    fulfilment and payment
                    status.
                </p>
            </div>

            {/* ERROR */}
            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* ORDERS CARD */}
            <div className="mt-7 overflow-hidden rounded-xl border border-[#E4E9EC] bg-white">

                {/* FILTERS */}
                <div className="border-b border-[#E8ECEF] p-4">

                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

                        {/* SEARCH */}
                        <form
                            onSubmit={
                                handleSearch
                            }
                            className="flex w-full max-w-[420px]"
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
                                    placeholder="Search order number..."
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

                        {/* FILTER DROPDOWNS */}
                        <div className="flex flex-wrap gap-2">

                            {/* ORDER STATUS */}
                            <select
                                value={
                                    filters.status
                                }
                                onChange={(e) =>
                                    setFilters(
                                        (
                                            prev
                                        ) => ({
                                            ...prev,

                                            status:
                                                e
                                                    .target
                                                    .value,

                                            page: 1,
                                        })
                                    )
                                }
                                className="h-10 rounded-lg border border-[#DDE3E7] bg-white px-3 text-sm text-[#52636C] outline-none focus:border-[#024E82]"
                            >
                                <option value="">
                                    All Order Status
                                </option>

                                <option value="pending">
                                    Pending
                                </option>

                                <option value="confirmed">
                                    Confirmed
                                </option>

                                <option value="processing">
                                    Processing
                                </option>

                                <option value="shipped">
                                    Shipped
                                </option>

                                <option value="delivered">
                                    Delivered
                                </option>

                                <option value="cancelled">
                                    Cancelled
                                </option>
                            </select>

                            {/* PAYMENT STATUS */}
                            <select
                                value={
                                    filters.paymentStatus
                                }
                                onChange={(e) =>
                                    setFilters(
                                        (
                                            prev
                                        ) => ({
                                            ...prev,

                                            paymentStatus:
                                                e
                                                    .target
                                                    .value,

                                            page: 1,
                                        })
                                    )
                                }
                                className="h-10 rounded-lg border border-[#DDE3E7] bg-white px-3 text-sm text-[#52636C] outline-none focus:border-[#024E82]"
                            >
                                <option value="">
                                    All Payments
                                </option>

                                <option value="pending">
                                    Pending
                                </option>

                                <option value="paid">
                                    Paid
                                </option>

                                <option value="failed">
                                    Failed
                                </option>

                                <option value="refunded">
                                    Refunded
                                </option>
                            </select>

                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={
                                        clearFilters
                                    }
                                    className="h-10 rounded-lg border border-[#DDE3E7] px-3 text-sm text-gray-500 transition hover:border-[#024E82] hover:text-[#024E82]"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* RESULT INFO */}
                <div className="flex items-center justify-between border-b border-[#EEF1F3] bg-[#FAFBFC] px-5 py-3">
                    <p className="text-xs text-gray-500">
                        {loading
                            ? "Loading orders..."
                            : `${
                                  pagination
                                      ?.totalItems ||
                                  0
                              } orders`}
                    </p>

                    <p className="hidden text-xs text-gray-400 sm:block">
                        Latest orders first
                    </p>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">

                    <table className="min-w-[1000px] w-full">

                        <thead>
                            <tr className="border-b border-[#EEF1F3] text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">

                                <th className="px-5 py-3">
                                    Order
                                </th>

                                <th className="px-5 py-3">
                                    Customer
                                </th>

                                <th className="px-5 py-3">
                                    Date
                                </th>

                                <th className="px-5 py-3">
                                    Order Status
                                </th>

                                <th className="px-5 py-3">
                                    Payment
                                </th>

                                <th className="px-5 py-3">
                                    Method
                                </th>

                                <th className="px-5 py-3 text-right">
                                    Total
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
                                                    8
                                                }
                                                className="px-5 py-4"
                                            >
                                                <div className="h-12 animate-pulse rounded-lg bg-gray-100" />
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : orders.length ===
                              0 ? (

                                /* EMPTY */
                                <tr>
                                    <td
                                        colSpan={
                                            8
                                        }
                                        className="px-5 py-16 text-center"
                                    >
                                        <ShoppingCart
                                            size={
                                                32
                                            }
                                            className="mx-auto text-gray-300"
                                        />

                                        <p className="mt-3 text-sm font-medium text-gray-500">
                                            No orders
                                            found
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Try changing
                                            the selected
                                            filters.
                                        </p>
                                    </td>
                                </tr>
                            ) : (

                                /* ORDERS */
                                orders.map(
                                    (
                                        order
                                    ) => (
                                        <tr
                                            key={
                                                order.id
                                            }
                                            className="border-b border-[#F0F2F4] text-sm transition last:border-0 hover:bg-[#FAFBFC]"
                                        >

                                            {/* ORDER */}
                                            <td className="px-5 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        router.push(
                                                            `/admin/orders/${order.id}`
                                                        )
                                                    }
                                                    className="font-semibold text-[#024E82] hover:underline"
                                                >
                                                    {
                                                        order.orderNumber
                                                    }
                                                </button>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    ID #
                                                    {
                                                        order.id
                                                    }
                                                </p>
                                            </td>

                                            {/* CUSTOMER */}
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-[#344852]">
                                                    {order
                                                        .user
                                                        ?.name ||
                                                        "Customer"}
                                                </p>

                                                <p className="mt-1 max-w-[200px] truncate text-xs text-gray-400">
                                                    {order
                                                        .user
                                                        ?.email ||
                                                        "—"}
                                                </p>
                                            </td>

                                            {/* DATE */}
                                            <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                                                {formatDate(
                                                    order.createdAt
                                                )}
                                            </td>

                                            {/* STATUS */}
                                            <td className="px-5 py-4">
                                                <OrderStatusBadge
                                                    status={
                                                        order.status
                                                    }
                                                />
                                            </td>

                                            {/* PAYMENT */}
                                            <td className="px-5 py-4">
                                                <PaymentStatusBadge
                                                    status={
                                                        order.paymentStatus
                                                    }
                                                />
                                            </td>

                                            {/* METHOD */}
                                            <td className="px-5 py-4 text-gray-500">
                                                {order.paymentMethod ||
                                                    "—"}
                                            </td>

                                            {/* TOTAL */}
                                            <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-[#243640]">
                                                {formatCurrency(
                                                    order.totalAmount
                                                )}
                                            </td>

                                            {/* ACTION */}
                                            <td className="px-5 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        router.push(
                                                            `/admin/orders/${order.id}`
                                                        )
                                                    }
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#DDE3E7] text-gray-500 transition hover:border-[#024E82] hover:text-[#024E82]"
                                                    aria-label="View order"
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