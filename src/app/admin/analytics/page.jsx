"use client";

import axios from "axios";
import {
    useEffect,
    useState,
} from "react";

import {
    IndianRupee,
    ShoppingCart,
    ReceiptText,
    Users,
    Package,
    Layers3,
} from "lucide-react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import useAuthStore from "@/store/authStore";

/* --------------------------------
   ORDER STATUS
-------------------------------- */

const statusStyles = {
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

export default function AdminAnalyticsPage() {
    const token = useAuthStore(
        (state) => state.token
    );

    const [analytics, setAnalytics] =
        useState(null);

    const [period, setPeriod] =
        useState("30d");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    /* --------------------------------
       GET ANALYTICS
    -------------------------------- */

    useEffect(() => {
        if (!token) return;

        const getAnalytics =
            async () => {
                try {
                    setLoading(true);
                    setError("");

                    const response =
                        await axios.get(
                            `${process.env.NEXT_PUBLIC_API_URL}/admin/analytics`,
                            {
                                params: {
                                    period,
                                },

                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                    setAnalytics(
                        response.data
                            ?.data || null
                    );
                } catch (error) {
                    console.log(
                        "Analytics error:",
                        error.response
                            ?.data ||
                            error.message
                    );

                    setAnalytics(null);

                    setError(
                        error.response
                            ?.data
                            ?.message ||
                            "Unable to load analytics."
                    );
                } finally {
                    setLoading(
                        false
                    );
                }
            };

        getAnalytics();
    }, [token, period]);

    /* --------------------------------
       FORMATTERS
    -------------------------------- */

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

    const formatCompactCurrency = (
        value
    ) => {
        const number =
            Number(value) || 0;

        if (number >= 10000000) {
            return `₹${(
                number / 10000000
            ).toFixed(1)}Cr`;
        }

        if (number >= 100000) {
            return `₹${(
                number / 100000
            ).toFixed(1)}L`;
        }

        if (number >= 1000) {
            return `₹${(
                number / 1000
            ).toFixed(0)}K`;
        }

        return `₹${number}`;
    };

    const formatChartDate = (
        value
    ) => {
        if (!value) return "";

        return new Date(
            `${value}T00:00:00`
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
            }
        );
    };

    const summary =
        analytics?.summary || {};

    const salesTrend =
        analytics?.salesTrend || [];

    const topProducts =
        analytics?.topProducts || [];

    const categoryPerformance =
        analytics
            ?.categoryPerformance ||
        [];

    const orderStatusBreakdown =
        analytics
            ?.orderStatusBreakdown ||
        [];

    const cards = [
        {
            label: "Revenue",
            value: formatCurrency(
                summary.revenue
            ),
            icon: IndianRupee,
            description:
                "Paid order revenue",
        },
        {
            label: "Orders",
            value:
                summary.orders ?? 0,
            icon: ShoppingCart,
            description:
                "Non-cancelled orders",
        },
        {
            label:
                "Average Order Value",
            value: formatCurrency(
                summary.averageOrderValue
            ),
            icon: ReceiptText,
            description:
                "Average paid order",
        },
        {
            label: "New Customers",
            value:
                summary.newCustomers ??
                0,
            icon: Users,
            description:
                "Customers registered",
        },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8">

            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
                        Insights
                    </p>

                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#172B38] sm:text-3xl">
                        Analytics
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Monitor sales,
                        customers, products
                        and category
                        performance.
                    </p>
                </div>

                {/* PERIOD */}
                <select
                    value={period}
                    onChange={(e) =>
                        setPeriod(
                            e.target.value
                        )
                    }
                    className="h-10 rounded-lg border border-[#DDE3E7] bg-white px-3 text-sm font-medium text-[#52636C] outline-none focus:border-[#024E82]"
                >
                    <option value="7d">
                        Last 7 Days
                    </option>

                    <option value="30d">
                        Last 30 Days
                    </option>

                    <option value="90d">
                        Last 90 Days
                    </option>

                    <option value="1y">
                        Last 1 Year
                    </option>
                </select>
            </div>

            {/* ERROR */}
            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* SUMMARY */}
            <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {cards.map(
                    ({
                        label,
                        value,
                        icon: Icon,
                        description,
                    }) => (
                        <div
                            key={label}
                            className="rounded-xl border border-[#E4E9EC] bg-white p-5"
                        >
                            <div className="flex items-start justify-between">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        {
                                            label
                                        }
                                    </p>

                                    {loading ? (
                                        <div className="mt-3 h-8 w-28 animate-pulse rounded bg-gray-100" />
                                    ) : (
                                        <p className="mt-2 text-2xl font-semibold tracking-tight text-[#172B38]">
                                            {
                                                value
                                            }
                                        </p>
                                    )}

                                    <p className="mt-2 text-[11px] text-gray-400">
                                        {
                                            description
                                        }
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3F8] text-[#024E82]">
                                    <Icon
                                        size={
                                            19
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* SALES TREND */}
            <section className="mt-6 rounded-xl border border-[#E4E9EC] bg-white">

                <div className="flex flex-col gap-2 border-b border-[#E8ECEF] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h2 className="text-base font-semibold text-[#172B38]">
                            Sales Trend
                        </h2>

                        <p className="mt-1 text-xs text-gray-400">
                            Paid revenue over
                            the selected period
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="h-2 w-2 rounded-full bg-[#024E82]" />
                        Revenue
                    </div>
                </div>

                <div className="h-[330px] px-2 pb-5 pt-6 sm:px-5">

                    {loading ? (
                        <div className="h-full animate-pulse rounded-lg bg-gray-100" />
                    ) : salesTrend.length ===
                      0 ? (
                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                            No sales data for
                            this period.
                        </div>
                    ) : (
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <LineChart
                                data={
                                    salesTrend
                                }
                                margin={{
                                    top: 5,
                                    right: 15,
                                    left: 5,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    vertical={
                                        false
                                    }
                                    stroke="#EEF1F3"
                                />

                                <XAxis
                                    dataKey="date"
                                    axisLine={
                                        false
                                    }
                                    tickLine={
                                        false
                                    }
                                    minTickGap={
                                        25
                                    }
                                    tick={{
                                        fill: "#94A3B8",
                                        fontSize: 11,
                                    }}
                                    tickFormatter={
                                        formatChartDate
                                    }
                                />

                                <YAxis
                                    axisLine={
                                        false
                                    }
                                    tickLine={
                                        false
                                    }
                                    width={
                                        65
                                    }
                                    tick={{
                                        fill: "#94A3B8",
                                        fontSize: 11,
                                    }}
                                    tickFormatter={
                                        formatCompactCurrency
                                    }
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
                                        formatChartDate(
                                            value
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
                                    dataKey="revenue"
                                    stroke="#024E82"
                                    strokeWidth={
                                        2.5
                                    }
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
            </section>

            {/* STATUS + TOP PRODUCTS */}
            <div className="mt-6 grid gap-6 xl:grid-cols-2">

                {/* ORDER STATUS */}
                <section className="rounded-xl border border-[#E4E9EC] bg-white">

                    <div className="border-b border-[#E8ECEF] px-5 py-4">

                        <h2 className="text-base font-semibold text-[#172B38]">
                            Order Status
                        </h2>

                        <p className="mt-1 text-xs text-gray-400">
                            Order distribution
                            for this period
                        </p>
                    </div>

                    <div className="p-5">

                        {loading ? (
                            <div className="space-y-3">
                                {Array.from({
                                    length: 5,
                                }).map(
                                    (
                                        _,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="h-11 animate-pulse rounded-lg bg-gray-100"
                                        />
                                    )
                                )}
                            </div>
                        ) : orderStatusBreakdown.length ===
                          0 ? (
                            <p className="py-8 text-center text-sm text-gray-400">
                                No order data.
                            </p>
                        ) : (
                            <div className="space-y-3">

                                {orderStatusBreakdown.map(
                                    (
                                        item
                                    ) => (
                                        <div
                                            key={
                                                item.status
                                            }
                                            className="flex items-center justify-between rounded-lg border border-[#EEF1F3] px-4 py-3"
                                        >

                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                                                    statusStyles[
                                                        item
                                                            .status
                                                    ] ||
                                                    "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                {
                                                    item.status
                                                }
                                            </span>

                                            <span className="text-sm font-semibold text-[#243640]">
                                                {
                                                    item.count
                                                }
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* TOP PRODUCTS */}
                <section className="rounded-xl border border-[#E4E9EC] bg-white">

                    <div className="flex items-center justify-between border-b border-[#E8ECEF] px-5 py-4">

                        <div>
                            <h2 className="text-base font-semibold text-[#172B38]">
                                Top Products
                            </h2>

                            <p className="mt-1 text-xs text-gray-400">
                                Best selling
                                products
                            </p>
                        </div>

                        <Package
                            size={
                                19
                            }
                            className="text-[#024E82]"
                        />
                    </div>

                    <div>
                        {loading ? (
                            Array.from({
                                length: 5,
                            }).map(
                                (
                                    _,
                                    index
                                ) => (
                                    <div
                                        key={
                                            index
                                        }
                                        className="border-b border-[#F0F2F4] px-5 py-4 last:border-0"
                                    >
                                        <div className="h-10 animate-pulse rounded bg-gray-100" />
                                    </div>
                                )
                            )
                        ) : topProducts.length ===
                          0 ? (
                            <p className="px-5 py-12 text-center text-sm text-gray-400">
                                No product sales
                                yet.
                            </p>
                        ) : (
                            topProducts.map(
                                (
                                    product,
                                    index
                                ) => (
                                    <div
                                        key={
                                            product.productId ||
                                            product.name
                                        }
                                        className="flex items-center gap-3 border-b border-[#F0F2F4] px-5 py-4 last:border-0"
                                    >

                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F2F5F7] text-xs font-semibold text-[#52636C]">
                                            {index +
                                                1}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-[#243640]">
                                                {
                                                    product.name
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                {
                                                    product.unitsSold
                                                }{" "}
                                                units sold
                                            </p>
                                        </div>

                                        <p className="whitespace-nowrap text-sm font-semibold text-[#243640]">
                                            {formatCurrency(
                                                product.revenue
                                            )}
                                        </p>
                                    </div>
                                )
                            )
                        )}
                    </div>
                </section>
            </div>

            {/* CATEGORY PERFORMANCE */}
            <section className="mt-6 overflow-hidden rounded-xl border border-[#E4E9EC] bg-white">

                <div className="flex items-center justify-between border-b border-[#E8ECEF] px-5 py-4">

                    <div>
                        <h2 className="text-base font-semibold text-[#172B38]">
                            Category Performance
                        </h2>

                        <p className="mt-1 text-xs text-gray-400">
                            Revenue and units
                            sold by category
                        </p>
                    </div>

                    <Layers3
                        size={19}
                        className="text-[#024E82]"
                    />
                </div>

                <div className="overflow-x-auto">

                    <table className="min-w-[650px] w-full">

                        <thead>
                            <tr className="border-b border-[#EEF1F3] bg-[#FAFBFC] text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">

                                <th className="px-5 py-3">
                                    Category
                                </th>

                                <th className="px-5 py-3 text-right">
                                    Units Sold
                                </th>

                                <th className="px-5 py-3 text-right">
                                    Revenue
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (
                                Array.from({
                                    length: 5,
                                }).map(
                                    (
                                        _,
                                        index
                                    ) => (
                                        <tr
                                            key={
                                                index
                                            }
                                        >
                                            <td
                                                colSpan={
                                                    3
                                                }
                                                className="px-5 py-4"
                                            >
                                                <div className="h-8 animate-pulse rounded bg-gray-100" />
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : categoryPerformance.length ===
                              0 ? (
                                <tr>
                                    <td
                                        colSpan={
                                            3
                                        }
                                        className="px-5 py-12 text-center text-sm text-gray-400"
                                    >
                                        No category
                                        sales data.
                                    </td>
                                </tr>
                            ) : (
                                categoryPerformance.map(
                                    (
                                        category
                                    ) => (
                                        <tr
                                            key={
                                                category.categoryId ||
                                                category.categoryName
                                            }
                                            className="border-b border-[#F0F2F4] text-sm last:border-0"
                                        >

                                            <td className="px-5 py-4 font-medium text-[#344852]">
                                                {
                                                    category.categoryName
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-right text-gray-500">
                                                {
                                                    category.unitsSold
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-right font-semibold text-[#243640]">
                                                {formatCurrency(
                                                    category.revenue
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}