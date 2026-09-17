"use client";

import axios from "axios";
import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    useParams,
    useRouter,
} from "next/navigation";

import {
    ArrowLeft,
    User,
    Mail,
    CalendarDays,
    ShoppingBag,
    IndianRupee,
    MapPin,
    Package,
    Eye,
} from "lucide-react";

import useAuthStore from "@/store/authStore";

function OrderStatusBadge({ status }) {
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

function PaymentBadge({ status }) {
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

export default function AdminCustomerDetailsPage() {
    const router = useRouter();
    const params = useParams();

    const customerId = params.id;

    const token = useAuthStore(
        (state) => state.token
    );

    const [customer, setCustomer] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    /* -------------------------
       LOAD CUSTOMER
    ------------------------- */

    const getCustomer =
        useCallback(async () => {
            if (
                !token ||
                !customerId
            ) {
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response =
                    await axios.get(
                        `${process.env.NEXT_PUBLIC_API_URL}/admin/customers/${customerId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                setCustomer(
                    response.data?.data ||
                        null
                );
            } catch (error) {
                console.log(
                    "Customer details error:",
                    error.response?.data ||
                        error.message
                );

                setCustomer(null);

                setError(
                    error.response?.data
                        ?.message ||
                        "Unable to load customer."
                );
            } finally {
                setLoading(false);
            }
        }, [
            token,
            customerId,
        ]);

    useEffect(() => {
        getCustomer();
    }, [getCustomer]);

    /* -------------------------
       HELPERS
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

    /* -------------------------
       LOADING
    ------------------------- */

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#DDE7EC] border-t-[#024E82]" />

                    <p className="mt-4 text-sm text-gray-400">
                        Loading customer...
                    </p>
                </div>
            </div>
        );
    }

    /* -------------------------
       NOT FOUND
    ------------------------- */

    if (!customer) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">

                    <p className="text-sm text-red-600">
                        {error ||
                            "Customer not found"}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/admin/customers"
                            )
                        }
                        className="mt-4 text-sm font-medium text-[#024E82]"
                    >
                        Back to Customers
                    </button>
                </div>
            </div>
        );
    }

    const addresses =
        customer.addresses || [];

    const orders =
        customer.orders || [];

    return (
        <div className="p-4 sm:p-6 lg:p-8">

            {/* HEADER */}
            <div className="flex items-start gap-3">

                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            "/admin/customers"
                        )
                    }
                    className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#DDE3E7] text-gray-500 transition hover:border-[#024E82] hover:text-[#024E82]"
                >
                    <ArrowLeft
                        size={17}
                    />
                </button>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
                        Customer Details
                    </p>

                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#172B38] sm:text-3xl">
                        {customer.name}
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        View customer
                        information, addresses
                        and purchase history.
                    </p>
                </div>
            </div>

            {/* ERROR */}
            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* STATS */}
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {/* CUSTOMER */}
                <div className="rounded-xl border border-[#E4E9EC] bg-white p-5">

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Customer
                            </p>

                            <p className="mt-2 text-lg font-semibold text-[#172B38]">
                                #{customer.id}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF3F8] text-[#024E82]">
                            <User
                                size={20}
                            />
                        </div>
                    </div>
                </div>

                {/* ORDERS */}
                <div className="rounded-xl border border-[#E4E9EC] bg-white p-5">

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Total Orders
                            </p>

                            <p className="mt-2 text-2xl font-semibold text-[#172B38]">
                                {customer.orderCount ||
                                    0}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF3F8] text-[#024E82]">
                            <ShoppingBag
                                size={20}
                            />
                        </div>
                    </div>
                </div>

                {/* SPENT */}
                <div className="rounded-xl border border-[#E4E9EC] bg-white p-5">

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">
                                Total Spent
                            </p>

                            <p className="mt-2 text-2xl font-semibold text-[#172B38]">
                                {formatCurrency(
                                    customer.totalSpent
                                )}
                            </p>

                            <p className="mt-1 text-[11px] text-gray-400">
                                Excludes cancelled
                                orders
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF3F8] text-[#024E82]">
                            <IndianRupee
                                size={20}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">

                {/* LEFT */}
                <div className="space-y-6">

                    {/* PROFILE */}
                    <section className="rounded-xl border border-[#E4E9EC] bg-white p-5">

                        <div className="flex items-center gap-4 border-b border-[#EEF1F3] pb-5">

                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF3F8] text-base font-semibold text-[#024E82]">
                                {getInitials(
                                    customer.name
                                )}
                            </div>

                            <div>
                                <h2 className="font-semibold text-[#172B38]">
                                    {
                                        customer.name
                                    }
                                </h2>

                                <p className="mt-1 text-xs text-gray-400">
                                    Registered Customer
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 space-y-4">

                            <div className="flex gap-3">
                                <Mail
                                    size={17}
                                    className="mt-0.5 shrink-0 text-gray-400"
                                />

                                <div>
                                    <p className="text-xs text-gray-400">
                                        Email
                                    </p>

                                    <p className="mt-1 break-all text-sm text-[#344852]">
                                        {
                                            customer.email
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <CalendarDays
                                    size={17}
                                    className="mt-0.5 shrink-0 text-gray-400"
                                />

                                <div>
                                    <p className="text-xs text-gray-400">
                                        Joined
                                    </p>

                                    <p className="mt-1 text-sm text-[#344852]">
                                        {formatDate(
                                            customer.createdAt
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ADDRESSES */}
                    <section className="rounded-xl border border-[#E4E9EC] bg-white">

                        <div className="border-b border-[#E8ECEF] px-5 py-4">
                            <div className="flex items-center gap-2">

                                <MapPin
                                    size={18}
                                    className="text-[#024E82]"
                                />

                                <h2 className="text-base font-semibold text-[#172B38]">
                                    Saved Addresses
                                </h2>
                            </div>

                            <p className="mt-1 text-xs text-gray-400">
                                {addresses.length}{" "}
                                saved address
                                {addresses.length ===
                                1
                                    ? ""
                                    : "es"}
                            </p>
                        </div>

                        {addresses.length ===
                        0 ? (
                            <div className="px-5 py-8 text-center text-sm text-gray-400">
                                No saved
                                addresses.
                            </div>
                        ) : (
                            <div>
                                {addresses.map(
                                    (
                                        address
                                    ) => (
                                        <div
                                            key={
                                                address.id
                                            }
                                            className="border-b border-[#F0F2F4] p-5 last:border-0"
                                        >
                                            <div className="flex items-start justify-between gap-3">

                                                <p className="text-sm font-medium text-[#344852]">
                                                    {
                                                        address.fullName
                                                    }
                                                </p>

                                                {address.isDefault && (
                                                    <span className="rounded-full bg-[#EAF3F8] px-2 py-1 text-[10px] font-medium text-[#024E82]">
                                                        Default
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-1 text-xs text-gray-500">
                                                {
                                                    address.phone
                                                }
                                            </p>

                                            <div className="mt-3 text-xs leading-5 text-gray-500">

                                                <p>
                                                    {
                                                        address.addressLine1
                                                    }
                                                </p>

                                                {address.addressLine2 && (
                                                    <p>
                                                        {
                                                            address.addressLine2
                                                        }
                                                    </p>
                                                )}

                                                <p>
                                                    {
                                                        address.city
                                                    }
                                                    ,{" "}
                                                    {
                                                        address.state
                                                    }{" "}
                                                    {
                                                        address.postalCode
                                                    }
                                                </p>

                                                <p>
                                                    {
                                                        address.country
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </section>
                </div>

                {/* RIGHT - ORDER HISTORY */}
                <section className="overflow-hidden rounded-xl border border-[#E4E9EC] bg-white">

                    <div className="border-b border-[#E8ECEF] px-5 py-4">

                        <h2 className="text-base font-semibold text-[#172B38]">
                            Order History
                        </h2>

                        <p className="mt-1 text-xs text-gray-400">
                            Customer purchase
                            history
                        </p>
                    </div>

                    {orders.length ===
                    0 ? (
                        <div className="px-5 py-16 text-center">

                            <Package
                                size={32}
                                className="mx-auto text-gray-300"
                            />

                            <p className="mt-3 text-sm font-medium text-gray-500">
                                No orders yet
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="min-w-[760px] w-full">

                                <thead>
                                    <tr className="border-b border-[#EEF1F3] bg-[#FAFBFC] text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">

                                        <th className="px-5 py-3">
                                            Order
                                        </th>

                                        <th className="px-5 py-3">
                                            Date
                                        </th>

                                        <th className="px-5 py-3">
                                            Items
                                        </th>

                                        <th className="px-5 py-3">
                                            Status
                                        </th>

                                        <th className="px-5 py-3">
                                            Payment
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
                                    {orders.map(
                                        (
                                            order
                                        ) => (
                                            <tr
                                                key={
                                                    order.id
                                                }
                                                className="border-b border-[#F0F2F4] text-sm last:border-0 hover:bg-[#FAFBFC]"
                                            >

                                                <td className="px-5 py-4">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            router.push(
                                                                `/admin/orders/${order.id}`
                                                            )
                                                        }
                                                        className="font-medium text-[#024E82] hover:underline"
                                                    >
                                                        {
                                                            order.orderNumber
                                                        }
                                                    </button>
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                                                    {formatDate(
                                                        order.createdAt
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 text-gray-500">
                                                    {order.items
                                                        ?.length ||
                                                        0}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <OrderStatusBadge
                                                        status={
                                                            order.status
                                                        }
                                                    />
                                                </td>

                                                <td className="px-5 py-4">
                                                    <PaymentBadge
                                                        status={
                                                            order.paymentStatus
                                                        }
                                                    />
                                                </td>

                                                <td className="whitespace-nowrap px-5 py-4 text-right font-semibold text-[#243640]">
                                                    {formatCurrency(
                                                        order.totalAmount
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 text-right">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            router.push(
                                                                `/admin/orders/${order.id}`
                                                            )
                                                        }
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#DDE3E7] text-gray-500 transition hover:border-[#024E82] hover:text-[#024E82]"
                                                    >
                                                        <Eye
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}