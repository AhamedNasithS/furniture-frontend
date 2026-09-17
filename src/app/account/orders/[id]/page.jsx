"use client";

import axios from "axios";
import Link from "next/link";
import {
    useParams,
    useRouter,
} from "next/navigation";
import {
    useEffect,
    useState,
} from "react";

import {
    AlertTriangle,
    ArrowLeft,
    Check,
    Circle,
    CreditCard,
    ImageIcon,
    MapPin,
    Package,
    PackageCheck,
    Truck,
    X,
    XCircle,
} from "lucide-react";

import Header from "@/components/customer/Header";
import Footer from "@/components/customer/Footer";
import useAuthStore from "@/store/authStore";
import Image from "next/image";

const orderSteps = [
    {
        value: "pending",
        label: "Order Placed",
        icon: Package,
    },
    {
        value: "confirmed",
        label: "Confirmed",
        icon: Check,
    },
    {
        value: "processing",
        label: "Processing",
        icon: PackageCheck,
    },
    {
        value: "shipped",
        label: "Shipped",
        icon: Truck,
    },
    {
        value: "delivered",
        label: "Delivered",
        icon: Check,
    },
];

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const orderId = params.id;

    const token = useAuthStore(
        (state) => state.token
    );

    const isAuthenticated = useAuthStore(
        (state) => state.isAuthenticated
    );

    const [order, setOrder] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [cancelling, setCancelling] =
        useState(false);

    const [cancelError, setCancelError] =
        useState("");

    const [
        showCancelModal,
        setShowCancelModal,
    ] = useState(false);

    const getOrder = async () => {
        if (
            !isAuthenticated ||
            !token ||
            !orderId
        ) {
            router.push("/login");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response =
                await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

            setOrder(
                response.data?.data || null
            );
        } catch (error) {
            console.log(
                "Get order error:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data?.message ||
                "Unable to load order."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) return;

        getOrder();
    }, [
        isAuthenticated,
        token,
        orderId,
    ]);

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(
            date
        ).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const canCancel =
        order &&
        ["pending", "confirmed"].includes(
            order.status
        );

    const handleCancelOrder = async () => {
        if (!canCancel || cancelling) {
            return;
        }

        try {
            setCancelling(true);
            setCancelError("");

            const response =
                await axios.patch(
                    `${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}/cancel`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

            const updated =
                response.data?.data;

            setOrder((prev) => ({
                ...prev,
                status:
                    updated?.status ||
                    "cancelled",

                paymentStatus:
                    updated?.paymentStatus ||
                    prev.paymentStatus,
            }));

            setShowCancelModal(false);
        } catch (error) {
            console.log(
                "Cancel order error:",
                error.response?.data ||
                error.message
            );

            setCancelError(
                error.response?.data
                    ?.message ||
                "Unable to cancel this order."
            );
        } finally {
            setCancelling(false);
        }
    };

    const getStatusClasses = (
        status
    ) => {
        switch (status) {
            case "pending":
                return "bg-orange-50 text-orange-600";

            case "confirmed":
                return "bg-blue-50 text-blue-600";

            case "processing":
                return "bg-indigo-50 text-indigo-600";

            case "shipped":
                return "bg-purple-50 text-purple-600";

            case "delivered":
                return "bg-green-50 text-green-600";

            case "cancelled":
                return "bg-red-50 text-red-600";

            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const currentStep =
        orderSteps.findIndex(
            (step) =>
                step.value === order?.status
        );

    if (loading) {
        return (
            <>
                <Header />

                <main className="min-h-screen bg-[#F7F9FB]">
                    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
                        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                            <div className="space-y-5">
                                <div className="h-[220px] animate-pulse rounded-xl bg-white" />

                                <div className="h-[400px] animate-pulse rounded-xl bg-white" />
                            </div>

                            <div className="h-[420px] animate-pulse rounded-xl bg-white" />
                        </div>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    if (error || !order) {
        return (
            <>
                <Header />

                <main className="flex min-h-[70vh] items-center justify-center bg-[#F7F9FB] px-4">
                    <div className="w-full max-w-[500px] rounded-xl border border-[#e5eaed] bg-white p-8 text-center">
                        <XCircle
                            size={42}
                            className="mx-auto text-red-400"
                        />

                        <h1 className="mt-4 text-xl font-semibold text-[#213640]">
                            Order not found
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            {error}
                        </p>

                        <Link
                            href="/account/orders"
                            className="mt-6 inline-flex h-11 items-center rounded-md bg-[#024E82] px-5 text-sm font-medium text-white"
                        >
                            Back to Orders
                        </Link>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    const items =
        order.items || [];

    return (
        <>
            <Header />

            <main className="min-h-screen bg-[#F7F9FB]">

                {/* HEADER */}
                <section className="border-b border-[#e5eaed] bg-white">
                    <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-10">
                        <Link
                            href="/account/orders"
                            className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 transition hover:text-[#024E82]"
                        >
                            <ArrowLeft size={15} />

                            Back to Orders
                        </Link>

                        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
                                    Order Details
                                </p>

                                <div className="mt-2 flex flex-wrap items-center gap-3">
                                    <h1 className="text-2xl font-semibold tracking-tight text-[#172B38] sm:text-3xl">
                                        {order.orderNumber}
                                    </h1>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                                            order.status
                                        )}`}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                <p className="mt-3 text-sm text-gray-500">
                                    Ordered on{" "}
                                    {formatDate(
                                        order.createdAt
                                    )}
                                </p>
                            </div>

                            {canCancel && (
                                <button
                                    type="button"
                                    disabled={cancelling}
                                    onClick={() =>
                                        setShowCancelModal(true)
                                    }
                                    className="h-10 rounded-md border border-red-200 px-4 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                >
                                    {cancelling
                                        ? "Cancelling..."
                                        : "Cancel Order"}
                                </button>
                            )}
                        </div>

                        {cancelError && (
                            <div className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
                                {cancelError}
                            </div>
                        )}
                    </div>
                </section>

                <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
                    <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">

                        {/* LEFT */}
                        <div className="space-y-6">

                            {/* STATUS */}
                            <section className="rounded-xl border border-[#e5eaed] bg-white p-5 sm:p-6">
                                <h2 className="text-base font-semibold text-[#213640]">
                                    Order Status
                                </h2>

                                {order.status ===
                                    "cancelled" ? (
                                    <div className="mt-5 flex items-start gap-4 rounded-xl bg-red-50 p-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                                            <XCircle
                                                size={20}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-red-700">
                                                Order Cancelled
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-red-500">
                                                This order has
                                                been cancelled.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-7">
                                        <div className="grid grid-cols-5">
                                            {orderSteps.map(
                                                (
                                                    step,
                                                    index
                                                ) => {
                                                    const Icon =
                                                        step.icon;

                                                    const completed =
                                                        index <=
                                                        currentStep;

                                                    return (
                                                        <div
                                                            key={
                                                                step.value
                                                            }
                                                            className="relative flex flex-col items-center text-center"
                                                        >
                                                            {/* CONNECTOR */}
                                                            {index <
                                                                orderSteps.length -
                                                                1 && (
                                                                    <div
                                                                        className={`absolute left-1/2 top-5 h-[2px] w-full ${index <
                                                                            currentStep
                                                                            ? "bg-[#024E82]"
                                                                            : "bg-[#dfe5e8]"
                                                                            }`}
                                                                    />
                                                                )}

                                                            {/* ICON */}
                                                            <div
                                                                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border ${completed
                                                                    ? "border-[#024E82] bg-[#024E82] text-white"
                                                                    : "border-[#dce4e7] bg-white text-gray-400"
                                                                    }`}
                                                            >
                                                                <Icon
                                                                    size={
                                                                        17
                                                                    }
                                                                />
                                                            </div>

                                                            <p
                                                                className={`mt-3 text-[10px] font-medium sm:text-xs ${completed
                                                                    ? "text-[#024E82]"
                                                                    : "text-gray-400"
                                                                    }`}
                                                            >
                                                                {
                                                                    step.label
                                                                }
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* ITEMS */}
                            <section className="overflow-hidden rounded-xl border border-[#e5eaed] bg-white">
                                <div className="border-b border-[#edf0f2] px-5 py-4">
                                    <h2 className="text-base font-semibold text-[#213640]">
                                        Order Items
                                    </h2>

                                    <p className="mt-1 text-xs text-gray-400">
                                        {items.length}{" "}
                                        {items.length === 1
                                            ? "product"
                                            : "products"}
                                    </p>
                                </div>

                                <div className="divide-y divide-[#edf0f2]">
                                    {items.map(
                                        (item) => {
                                            const product =
                                                item.product;

                                            const image =
                                                product?.images?.find(
                                                    (image) =>
                                                        image.isPrimary
                                                ) ||
                                                product?.images?.[0];

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="flex flex-col gap-4 p-5 sm:flex-row"
                                                >
                                                    {/* IMAGE */}
                                                    <div className="flex h-[130px] w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#edf1f3] sm:h-24 sm:w-28">
                                                        {image ? (
                                                            <Image
                                                                src={
                                                                    image.imageUrl
                                                                }
                                                                alt={
                                                                    item.productName
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <ImageIcon
                                                                size={30}
                                                                className="text-gray-300"
                                                            />
                                                        )}
                                                    </div>

                                                    {/* DETAILS */}
                                                    <div className="min-w-0 flex-1">
                                                        {product
                                                            ?.slug ? (
                                                            <Link
                                                                href={`/products/${product.slug}`}
                                                            >
                                                                <h3 className="font-semibold text-[#213640] transition hover:text-[#024E82]">
                                                                    {
                                                                        item.productName
                                                                    }
                                                                </h3>
                                                            </Link>
                                                        ) : (
                                                            <h3 className="font-semibold text-[#213640]">
                                                                {
                                                                    item.productName
                                                                }
                                                            </h3>
                                                        )}

                                                        <p className="mt-2 text-xs text-gray-500">
                                                            Quantity:{" "}
                                                            {
                                                                item.quantity
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-500">
                                                            Unit Price: ₹
                                                            {Number(
                                                                item.unitPrice ||
                                                                0
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="sm:text-right">
                                                        <p className="text-xs text-gray-400">
                                                            Item Total
                                                        </p>

                                                        <p className="mt-1 text-base font-semibold text-[#024E82]">
                                                            ₹
                                                            {Number(
                                                                item.total ||
                                                                0
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </section>

                            {/* DELIVERY */}
                            <section className="rounded-xl border border-[#e5eaed] bg-white p-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#edf6fa] text-[#024E82]">
                                        <MapPin size={19} />
                                    </div>

                                    <div>
                                        <h2 className="text-base font-semibold text-[#213640]">
                                            Delivery Address
                                        </h2>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Address saved
                                            when the order was
                                            placed
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 rounded-xl bg-[#F7F9FB] p-4">
                                    <p className="text-sm font-semibold text-[#213640]">
                                        {order.shippingFullName}
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-gray-500">
                                        {[
                                            order.shippingAddressLine1,
                                            order.shippingAddressLine2,
                                            order.shippingCity,
                                            order.shippingState,
                                            order.shippingPostalCode,
                                            order.shippingCountry,
                                        ]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </p>

                                    {order.shippingPhone && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            {
                                                order.shippingPhone
                                            }
                                        </p>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* RIGHT */}
                        <div className="space-y-5">

                            {/* SUMMARY */}
                            <aside className="rounded-xl border border-[#e5eaed] bg-white p-5 lg:sticky lg:top-24">
                                <h2 className="text-lg font-semibold text-[#213640]">
                                    Order Summary
                                </h2>

                                <div className="mt-5 space-y-4 border-b border-[#edf0f2] pb-5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">
                                            Subtotal
                                        </span>

                                        <span className="font-medium text-[#263a44]">
                                            ₹
                                            {Number(
                                                order.subtotal ||
                                                0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">
                                            Shipping
                                        </span>

                                        <span className="font-medium text-[#263a44]">
                                            {Number(
                                                order.shippingFee ||
                                                0
                                            ) === 0
                                                ? "Free"
                                                : `₹${Number(
                                                    order.shippingFee
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between pt-5">
                                    <span className="font-semibold text-[#213640]">
                                        Total
                                    </span>

                                    <span className="text-xl font-bold text-[#024E82]">
                                        ₹
                                        {Number(
                                            order.totalAmount ||
                                            0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>
                                </div>

                                {/* PAYMENT */}
                                <div className="mt-6 border-t border-[#edf0f2] pt-5">
                                    <div className="flex items-center gap-2">
                                        <CreditCard
                                            size={17}
                                            className="text-[#024E82]"
                                        />

                                        <h3 className="text-sm font-semibold text-[#213640]">
                                            Payment
                                        </h3>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        <div className="flex justify-between gap-4 text-xs">
                                            <span className="text-gray-500">
                                                Method
                                            </span>

                                            <span className="font-medium text-[#263a44]">
                                                {order.paymentMethod ===
                                                    "cod"
                                                    ? "Cash on Delivery"
                                                    : order.paymentMethod}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4 text-xs">
                                            <span className="text-gray-500">
                                                Status
                                            </span>

                                            <span className="font-medium capitalize text-[#263a44]">
                                                {
                                                    order.paymentStatus
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {canCancel && (
                                    <div className="mt-6 border-t border-[#edf0f2] pt-5">
                                        <button
                                            type="button"
                                            onClick={() => setShowCancelModal(true)}
                                            disabled={
                                                cancelling
                                            }
                                            className="h-10 w-full rounded-md border border-red-200 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                        >
                                            {cancelling
                                                ? "Cancelling..."
                                                : "Cancel Order"}
                                        </button>

                                        <p className="mt-2 text-center text-[10px] leading-4 text-gray-400">
                                            Cancellation is
                                            available before
                                            processing begins.
                                        </p>
                                    </div>
                                )}
                            </aside>
                        </div>
                    </div>
                </section>
                {showCancelModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4">

                        <div className="relative w-full max-w-[430px] rounded-2xl bg-white p-6 shadow-2xl">

                            {/* CLOSE */}
                            <button
                                type="button"
                                disabled={cancelling}
                                onClick={() =>
                                    setShowCancelModal(false)
                                }
                                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                            >
                                <X size={17} />
                            </button>

                            {/* ICON */}
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                                <AlertTriangle
                                    size={23}
                                />
                            </div>

                            {/* CONTENT */}
                            <h2 className="mt-5 text-xl font-semibold text-[#172B38]">
                                Cancel this order?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Are you sure you want to
                                cancel order{" "}
                                <span className="font-semibold text-[#344852]">
                                    {order.orderNumber}
                                </span>
                                ?
                            </p>

                            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3">
                                <p className="text-xs leading-5 text-red-600">
                                    Once cancelled, this
                                    order cannot be restored.
                                    The reserved product stock
                                    will be returned to
                                    inventory.
                                </p>
                            </div>

                            {cancelError && (
                                <div className="mt-4 rounded-md bg-red-50 px-4 py-3 text-xs text-red-600">
                                    {cancelError}
                                </div>
                            )}

                            {/* ACTIONS */}
                            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    disabled={cancelling}
                                    onClick={() => {
                                        setShowCancelModal(
                                            false
                                        );

                                        setCancelError("");
                                    }}
                                    className="h-10 rounded-md border border-[#dfe5e8] px-5 text-sm font-medium text-[#42545d] transition hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Keep Order
                                </button>

                                <button
                                    type="button"
                                    disabled={cancelling}
                                    onClick={
                                        handleCancelOrder
                                    }
                                    className="flex h-10 items-center justify-center gap-2 rounded-md bg-red-600 px-5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {cancelling ? (
                                        "Cancelling..."
                                    ) : (
                                        <>
                                            <XCircle
                                                size={15}
                                            />

                                            Yes, Cancel Order
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </>
    );
}