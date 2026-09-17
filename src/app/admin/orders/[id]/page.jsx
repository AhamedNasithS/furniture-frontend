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
    Package,
    User,
    MapPin,
    CreditCard,
} from "lucide-react";

import useAuthStore from "@/store/authStore";
import Image from "next/image";

/* -------------------------
   BADGES
------------------------- */

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

export default function AdminOrderDetailsPage() {
    const router = useRouter();
    const params = useParams();

    const orderId = params.id;

    const token = useAuthStore(
        (state) => state.token
    );

    const [order, setOrder] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [savingStatus, setSavingStatus] =
        useState(false);

    const [savingPayment, setSavingPayment] =
        useState(false);

    const [error, setError] =
        useState("");

    /* -------------------------
       LOAD ORDER
    ------------------------- */

    const loadOrder = useCallback(
        async () => {
            if (!token || !orderId) {
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response =
                    await axios.get(
                        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                setOrder(
                    response.data?.data ||
                        null
                );
            } catch (error) {
                console.log(
                    "Admin order details error:",
                    error.response?.data ||
                        error.message
                );

                setError(
                    error.response?.data
                        ?.message ||
                        "Unable to load order."
                );

                setOrder(null);
            } finally {
                setLoading(false);
            }
        },
        [token, orderId]
    );

    useEffect(() => {
        loadOrder();
    }, [loadOrder]);

    /* -------------------------
       UPDATE ORDER STATUS
    ------------------------- */

    const handleOrderStatus =
        async (status) => {
            if (!token) return;

            try {
                setSavingStatus(true);
                setError("");

                await axios.patch(
                    `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}/status`,
                    {
                        status,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                await loadOrder();
            } catch (error) {
                console.log(
                    "Update order status error:",
                    error.response?.data ||
                        error.message
                );

                setError(
                    error.response?.data
                        ?.message ||
                        "Unable to update order status."
                );
            } finally {
                setSavingStatus(false);
            }
        };

    /* -------------------------
       UPDATE PAYMENT
    ------------------------- */

    const handlePaymentStatus =
        async (paymentStatus) => {
            if (!token) return;

            try {
                setSavingPayment(true);
                setError("");

                await axios.patch(
                    `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}/paymentStatus`,
                    {
                        paymentStatus,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                await loadOrder();
            } catch (error) {
                console.log(
                    "Update payment status error:",
                    error.response?.data ||
                        error.message
                );

                setError(
                    error.response?.data
                        ?.message ||
                        "Unable to update payment status."
                );
            } finally {
                setSavingPayment(false);
            }
        };

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
        ).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const getProductImage = (
        product
    ) => {
        const images =
            product?.images || [];

        if (!images.length) {
            return null;
        }

        return (
            images.find(
                (image) =>
                    image.isPrimary
            )?.imageUrl ||
            images[0]?.imageUrl ||
            null
        );
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
                        Loading order...
                    </p>
                </div>
            </div>
        );
    }

    /* -------------------------
       NOT FOUND
    ------------------------- */

    if (!order) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                    <p className="text-sm text-red-600">
                        {error ||
                            "Order not found"}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/admin/orders"
                            )
                        }
                        className="mt-4 text-sm font-medium text-[#024E82]"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    const terminalOrder =
        order.status ===
            "delivered" ||
        order.status ===
            "cancelled";

    return (
        <div className="p-4 sm:p-6 lg:p-8">

            {/* HEADER */}
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">

                <div className="flex items-start gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/admin/orders"
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
                            Order Details
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold text-[#172B38] sm:text-3xl">
                                {
                                    order.orderNumber
                                }
                            </h1>

                            <OrderStatusBadge
                                status={
                                    order.status
                                }
                            />
                        </div>

                        <p className="mt-2 text-sm text-gray-500">
                            Placed{" "}
                            {formatDate(
                                order.createdAt
                            )}
                        </p>
                    </div>
                </div>

                {/* STATUS CONTROLS */}
                <div className="flex flex-col gap-3 sm:flex-row">

                    <div>
                        <p className="mb-1.5 text-xs font-medium text-gray-400">
                            Order Status
                        </p>

                        <select
                            value={
                                order.status
                            }
                            disabled={
                                savingStatus ||
                                terminalOrder
                            }
                            onChange={(e) =>
                                handleOrderStatus(
                                    e.target
                                        .value
                                )
                            }
                            className="h-10 min-w-[170px] rounded-lg border border-[#DDE3E7] bg-white px-3 text-sm text-[#344852] outline-none focus:border-[#024E82] disabled:cursor-not-allowed disabled:bg-gray-100"
                        >
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
                    </div>

                    <div>
                        <p className="mb-1.5 text-xs font-medium text-gray-400">
                            Payment Status
                        </p>

                        <select
                            value={
                                order.paymentStatus
                            }
                            disabled={
                                savingPayment
                            }
                            onChange={(e) =>
                                handlePaymentStatus(
                                    e.target
                                        .value
                                )
                            }
                            className="h-10 min-w-[160px] rounded-lg border border-[#DDE3E7] bg-white px-3 text-sm text-[#344852] outline-none focus:border-[#024E82] disabled:opacity-60"
                        >
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
                    </div>
                </div>
            </div>

            {/* ERROR */}
            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_360px]">

                {/* LEFT */}
                <div className="space-y-6">

                    {/* ITEMS */}
                    <section className="overflow-hidden rounded-xl border border-[#E4E9EC] bg-white">

                        <div className="border-b border-[#E8ECEF] px-5 py-4">
                            <h2 className="text-base font-semibold text-[#172B38]">
                                Order Items
                            </h2>

                            <p className="mt-1 text-xs text-gray-400">
                                {order.items
                                    ?.length ||
                                    0}{" "}
                                products in
                                this order
                            </p>
                        </div>

                        <div>
                            {order.items?.map(
                                (item) => {
                                    const image =
                                        getProductImage(
                                            item.product
                                        );

                                    return (
                                        <div
                                            key={
                                                item.id
                                            }
                                            className="flex gap-4 border-b border-[#F0F2F4] px-5 py-4 last:border-0"
                                        >
                                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F3F5F6]">
                                                {image ? (
                                                    <Image
                                                        src={
                                                            image
                                                        }
                                                        alt={
                                                            item.productName
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <Package
                                                        size={
                                                            20
                                                        }
                                                        className="text-gray-300"
                                                    />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-[#243640]">
                                                    {
                                                        item.productName
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    Qty:{" "}
                                                    {
                                                        item.quantity
                                                    }{" "}
                                                    ×{" "}
                                                    {formatCurrency(
                                                        item.unitPrice
                                                    )}
                                                </p>
                                            </div>

                                            <p className="whitespace-nowrap text-sm font-semibold text-[#243640]">
                                                {formatCurrency(
                                                    item.total
                                                )}
                                            </p>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </section>

                    {/* SHIPPING */}
                    <section className="rounded-xl border border-[#E4E9EC] bg-white p-5">

                        <div className="flex items-center gap-2">
                            <MapPin
                                size={18}
                                className="text-[#024E82]"
                            />

                            <h2 className="text-base font-semibold text-[#172B38]">
                                Shipping Address
                            </h2>
                        </div>

                        <div className="mt-4 text-sm leading-6 text-gray-500">
                            <p className="font-medium text-[#344852]">
                                {
                                    order.shippingFullName
                                }
                            </p>

                            <p>
                                {
                                    order.shippingPhone
                                }
                            </p>

                            <p className="mt-2">
                                {
                                    order.shippingAddressLine1
                                }
                            </p>

                            {order.shippingAddressLine2 && (
                                <p>
                                    {
                                        order.shippingAddressLine2
                                    }
                                </p>
                            )}

                            <p>
                                {
                                    order.shippingCity
                                }
                                ,{" "}
                                {
                                    order.shippingState
                                }{" "}
                                {
                                    order.shippingPostalCode
                                }
                            </p>

                            <p>
                                {
                                    order.shippingCountry
                                }
                            </p>
                        </div>
                    </section>
                </div>

                {/* RIGHT */}
                <div className="space-y-6">

                    {/* CUSTOMER */}
                    <section className="rounded-xl border border-[#E4E9EC] bg-white p-5">

                        <div className="flex items-center gap-2">
                            <User
                                size={18}
                                className="text-[#024E82]"
                            />

                            <h2 className="text-base font-semibold text-[#172B38]">
                                Customer
                            </h2>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm font-medium text-[#344852]">
                                {order.user
                                    ?.name ||
                                    "Customer"}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                {order.user
                                    ?.email ||
                                    "—"}
                            </p>

                            <p className="mt-3 text-xs text-gray-400">
                                Customer ID #
                                {
                                    order.userId
                                }
                            </p>
                        </div>
                    </section>

                    {/* PAYMENT */}
                    <section className="rounded-xl border border-[#E4E9EC] bg-white p-5">

                        <div className="flex items-center gap-2">
                            <CreditCard
                                size={18}
                                className="text-[#024E82]"
                            />

                            <h2 className="text-base font-semibold text-[#172B38]">
                                Payment
                            </h2>
                        </div>

                        <div className="mt-4 space-y-3">

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">
                                    Method
                                </span>

                                <span className="font-medium text-[#344852]">
                                    {order.paymentMethod ||
                                        "—"}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">
                                    Status
                                </span>

                                <PaymentStatusBadge
                                    status={
                                        order.paymentStatus
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    {/* SUMMARY */}
                    <section className="rounded-xl border border-[#E4E9EC] bg-white p-5">

                        <h2 className="text-base font-semibold text-[#172B38]">
                            Order Summary
                        </h2>

                        <div className="mt-5 space-y-3">

                            <div className="flex justify-between text-sm text-gray-500">
                                <span>
                                    Subtotal
                                </span>

                                <span>
                                    {formatCurrency(
                                        order.subtotal
                                    )}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm text-gray-500">
                                <span>
                                    Shipping
                                </span>

                                <span>
                                    {formatCurrency(
                                        order.shippingFee
                                    )}
                                </span>
                            </div>

                            <div className="border-t border-[#EEF1F3] pt-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-[#243640]">
                                        Total
                                    </span>

                                    <span className="text-lg font-semibold text-[#024E82]">
                                        {formatCurrency(
                                            order.totalAmount
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {terminalOrder && (
                        <div className="rounded-xl bg-[#F7F9FB] p-4 text-xs leading-5 text-gray-500">
                            This order is{" "}
                            <strong className="capitalize">
                                {
                                    order.status
                                }
                            </strong>
                            . Its order status
                            can no longer be
                            changed.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}