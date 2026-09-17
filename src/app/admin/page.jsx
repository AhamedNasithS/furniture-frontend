"use client";

import axios from "axios";
import {
    useEffect,
    useState,
} from "react";

import {
    IndianRupee,
    ShoppingCart,
    Users,
    Package,
} from "lucide-react";

import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import Image from "next/image";

function StatusBadge({ status }) {
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
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles[status] ||
                "bg-gray-100 text-gray-500"
                }`}
        >
            {status}
        </span>
    );
}

function PaymentBadge({ status }) {
    const styles = {
        paid:
            "bg-green-50 text-green-600",
        pending:
            "bg-amber-50 text-amber-600",
        failed:
            "bg-red-50 text-red-600",
        refunded:
            "bg-purple-50 text-purple-600",
    };

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles[status] ||
                "bg-gray-100 text-gray-500"
                }`}
        >
            {status}
        </span>
    );
}

export default function AdminDashboardPage() {
    const token = useAuthStore(
        (state) => state.token
    );

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const rounter = useRouter()

    const recentOrders =
        dashboard?.recentOrders || [];

    const salesOverview =
        dashboard?.salesOverview || [];

    const lowStockProducts =
        dashboard?.lowStockProducts || [];

    const topSellingProducts =
        dashboard?.topSellingProducts || [];


    const getPrimaryImage = (images = []) => {
        if (!images.length) {
            return null;
        }

        const primary = images.find(
            (image) => image.isPrimary
        );

        return (
            primary?.imageUrl ||
            images[0]?.imageUrl ||
            null
        );
    };

    useEffect(() => {
        if (!token) return;

        const getDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await axios.get(
                        `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                setDashboard(
                    response.data?.data || null
                );
            } catch (error) {
                console.log(
                    "Admin dashboard error:",
                    error.response?.data ||
                    error.message
                );

                setError(
                    error.response?.data
                        ?.message ||
                    "Unable to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        getDashboard();
    }, [token]);

    const formatCurrency = (value) => {
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

    const stats =
        dashboard?.stats || {};

    const cards = [
        {
            label: "Revenue",
            value: formatCurrency(
                stats.revenue
            ),
            icon: IndianRupee,
        },
        {
            label: "Orders",
            value:
                stats.orders ?? 0,
            icon: ShoppingCart,
        },
        {
            label: "Customers",
            value:
                stats.customers ?? 0,
            icon: Users,
        },
        {
            label: "Products",
            value:
                stats.products ?? 0,
            icon: Package,
        },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8">

            {/* PAGE HEADER */}
            <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
                    Overview
                </p>

                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#172B38] sm:text-3xl">
                    Dashboard
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Monitor FTC store performance,
                    orders and inventory.
                </p>
            </div>

            {/* ERROR */}
            {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* KPI CARDS */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => {
                    const Icon =
                        card.icon;

                    return (
                        <div
                            key={
                                card.label
                            }
                            className="rounded-xl border border-[#E4E9EC] bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        {
                                            card.label
                                        }
                                    </p>

                                    {loading ? (
                                        <div className="mt-3 h-8 w-24 animate-pulse rounded-md bg-gray-100" />
                                    ) : (
                                        <p className="mt-2 text-2xl font-semibold text-[#172B38]">
                                            {
                                                card.value
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF3F8] text-[#024E82]">
                                    <Icon
                                        size={20}
                                        strokeWidth={
                                            1.8
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* SALES OVERVIEW */}
            <div className="mt-6 rounded-xl border border-[#E4E9EC] bg-white">
                <div className="flex flex-col gap-2 border-b border-[#E8ECEF] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-[#172B38]">
                            Sales Overview
                        </h2>

                        <p className="mt-1 text-xs text-gray-400">
                            Store sales performance over the last 7 days
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="h-2 w-2 rounded-full bg-[#024E82]" />
                        Revenue
                    </div>
                </div>

                <div className="h-[320px] w-full px-2 pb-4 pt-6 sm:px-5">
                    {loading ? (
                        <div className="h-full w-full animate-pulse rounded-lg bg-gray-100" />
                    ) : salesOverview.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-sm text-gray-400">
                                No sales data available.
                            </p>
                        </div>
                    ) : (
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <LineChart
                                data={salesOverview}
                                margin={{
                                    top: 5,
                                    right: 15,
                                    left: 0,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    vertical={false}
                                    stroke="#EEF1F3"
                                />

                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: "#94A3B8",
                                        fontSize: 11,
                                    }}
                                    tickFormatter={(value) =>
                                        new Date(
                                            value
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                            }
                                        )
                                    }
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    width={65}
                                    tick={{
                                        fill: "#94A3B8",
                                        fontSize: 11,
                                    }}
                                    tickFormatter={(value) => {
                                        const number =
                                            Number(
                                                value
                                            ) || 0;

                                        if (
                                            number >=
                                            100000
                                        ) {
                                            return `₹${(
                                                number /
                                                100000
                                            ).toFixed(
                                                1
                                            )}L`;
                                        }

                                        if (
                                            number >=
                                            1000
                                        ) {
                                            return `₹${(
                                                number /
                                                1000
                                            ).toFixed(
                                                0
                                            )}K`;
                                        }

                                        return `₹${number}`;
                                    }}
                                />

                                <Tooltip
                                    formatter={(
                                        value
                                    ) => [
                                            formatCurrency(
                                                value
                                            ),
                                            "Revenue",
                                        ]}
                                    labelFormatter={(
                                        value
                                    ) =>
                                        new Date(
                                            value
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            }
                                        )
                                    }
                                    contentStyle={{
                                        borderRadius:
                                            "10px",
                                        border:
                                            "1px solid #E4E9EC",
                                        boxShadow:
                                            "0 8px 24px rgba(15,23,42,0.08)",
                                        fontSize:
                                            "12px",
                                    }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#024E82"
                                    strokeWidth={2.5}
                                    dot={{
                                        r: 3,
                                        fill: "#FFFFFF",
                                        stroke: "#024E82",
                                        strokeWidth: 2,
                                    }}
                                    activeDot={{
                                        r: 5,
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* LOW STOCK + TOP SELLING */}
            <div className="mt-6 grid gap-6 xl:grid-cols-2">

                {/* LOW STOCK */}
                <div className="rounded-xl border border-[#E4E9EC] bg-white">
                    <div className="flex items-center justify-between border-b border-[#E8ECEF] px-5 py-4">
                        <div>
                            <h2 className="text-base font-semibold text-[#172B38]">
                                Low Stock Products
                            </h2>

                            <p className="mt-1 text-xs text-gray-400">
                                Products that need attention
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                rounter.push("/admin/inventory");
                            }}
                            className="text-xs font-medium text-[#024E82] hover:underline"
                        >
                            View inventory
                        </button>
                    </div>

                    <div>
                        {loading ? (
                            Array.from({
                                length: 4,
                            }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 border-b border-[#F0F2F4] px-5 py-4 last:border-0"
                                >
                                    <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-100" />

                                    <div className="flex-1">
                                        <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />

                                        <div className="mt-2 h-3 w-20 animate-pulse rounded bg-gray-100" />
                                    </div>
                                </div>
                            ))
                        ) : lowStockProducts.length ===
                            0 ? (
                            <div className="px-5 py-10 text-center text-sm text-gray-400">
                                No low-stock products.
                            </div>
                        ) : (
                            lowStockProducts.map(
                                (product) => {
                                    const image =
                                        getPrimaryImage(
                                            product.images
                                        );

                                    const isOutOfStock =
                                        Number(
                                            product.stock
                                        ) === 0;

                                    return (
                                        <div
                                            key={
                                                product.id
                                            }
                                            className="flex items-center gap-3 border-b border-[#F0F2F4] px-5 py-4 last:border-0"
                                        >
                                            {/* IMAGE */}
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F4F6F7]">
                                                {image ? (
                                                    <Image
                                                        src={
                                                            image
                                                        }
                                                        alt={
                                                            product.name
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-[10px] text-gray-400">
                                                        No image
                                                    </span>
                                                )}
                                            </div>

                                            {/* INFO */}
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-[#243640]">
                                                    {
                                                        product.name
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    {product
                                                        .category
                                                        ?.name ||
                                                        "Uncategorized"}
                                                </p>
                                            </div>

                                            {/* STOCK */}
                                            <div className="text-right">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${isOutOfStock
                                                            ? "bg-red-50 text-red-600"
                                                            : "bg-amber-50 text-amber-600"
                                                        }`}
                                                >
                                                    {isOutOfStock
                                                        ? "Out of stock"
                                                        : `${product.stock} left`}
                                                </span>

                                                <p className="mt-1 text-[11px] text-gray-400">
                                                    {
                                                        product.sku
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                            )
                        )}
                    </div>
                </div>

                {/* TOP SELLING */}
                <div className="rounded-xl border border-[#E4E9EC] bg-white">
                    <div className="flex items-center justify-between border-b border-[#E8ECEF] px-5 py-4">
                        <div>
                            <h2 className="text-base font-semibold text-[#172B38]">
                                Top Selling Products
                            </h2>

                            <p className="mt-1 text-xs text-gray-400">
                                Best performing products
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                rounter.push("/admin/products");
                            }}
                            className="text-xs font-medium text-[#024E82] hover:underline"
                        >
                            View products
                        </button>
                    </div>

                    <div>
                        {loading ? (
                            Array.from({
                                length: 4,
                            }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 border-b border-[#F0F2F4] px-5 py-4 last:border-0"
                                >
                                    <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-100" />

                                    <div className="flex-1">
                                        <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />

                                        <div className="mt-2 h-3 w-20 animate-pulse rounded bg-gray-100" />
                                    </div>
                                </div>
                            ))
                        ) : topSellingProducts.length ===
                            0 ? (
                            <div className="px-5 py-10 text-center text-sm text-gray-400">
                                No sales data yet.
                            </div>
                        ) : (
                            topSellingProducts.map(
                                (product) => {
                                    const image =
                                        getPrimaryImage(
                                            product.images
                                        );

                                    return (
                                        <div
                                            key={
                                                product.productId ||
                                                product.name
                                            }
                                            className="flex items-center gap-3 border-b border-[#F0F2F4] px-5 py-4 last:border-0"
                                        >
                                            {/* IMAGE */}
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F4F6F7]">
                                                {image ? (
                                                    <Image
                                                        src={
                                                            image
                                                        }
                                                        alt={
                                                            product.name
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-[10px] text-gray-400">
                                                        No image
                                                    </span>
                                                )}
                                            </div>

                                            {/* INFO */}
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-[#243640]">
                                                    {
                                                        product.name
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-gray-400">
                                                    {
                                                        product.totalSold
                                                    }{" "}
                                                    units sold
                                                </p>
                                            </div>

                                            {/* REVENUE */}
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-[#243640]">
                                                    {formatCurrency(
                                                        product.revenue
                                                    )}
                                                </p>

                                                <p className="mt-1 text-[11px] text-gray-400">
                                                    Revenue
                                                </p>
                                            </div>
                                        </div>
                                    );
                                }
                            )
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6 rounded-xl border border-[#E4E9EC] bg-white">

                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-[#E8ECEF] px-5 py-4">
                    <div>
                        <h2 className="text-base font-semibold text-[#172B38]">
                            Recent Orders
                        </h2>

                        <p className="mt-1 text-xs text-gray-400">
                            Latest customer orders
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            rounter.push("/admin/orders")
                        }
                        className="text-sm font-medium text-[#024E82] hover:underline"
                    >
                        View all
                    </button>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#EEF1F3] bg-[#FAFBFC] text-left text-xs font-medium uppercase tracking-wide text-gray-400">
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
                                    Status
                                </th>

                                <th className="px-5 py-3">
                                    Payment
                                </th>

                                <th className="px-5 py-3 text-right">
                                    Total
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                Array.from({
                                    length: 5,
                                }).map((_, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-[#F0F2F4]"
                                    >
                                        <td
                                            colSpan={6}
                                            className="px-5 py-4"
                                        >
                                            <div className="h-5 animate-pulse rounded bg-gray-100" />
                                        </td>
                                    </tr>
                                ))
                            ) : recentOrders.length ===
                                0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-5 py-10 text-center text-sm text-gray-400"
                                    >
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map(
                                    (order) => (
                                        <tr
                                            key={
                                                order.id
                                            }
                                            className="border-b border-[#F0F2F4] text-sm last:border-0 hover:bg-[#FAFBFC]"
                                        >
                                            <td className="px-5 py-4 font-medium text-[#024E82]">
                                                {
                                                    order.orderNumber
                                                }
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="font-medium text-[#344852]">
                                                    {order
                                                        .user
                                                        ?.name ||
                                                        "Customer"}
                                                </p>

                                                <p className="mt-0.5 text-xs text-gray-400">
                                                    {order
                                                        .user
                                                        ?.email ||
                                                        ""}
                                                </p>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </td>

                                            <td className="px-5 py-4">
                                                <StatusBadge
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
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}