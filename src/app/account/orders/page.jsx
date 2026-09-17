"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  Package,
  ShoppingBag,
} from "lucide-react";

import Header from "@/components/customer/Header";
import Footer from "@/components/customer/Footer";
import useAuthStore from "@/store/authStore";

export default function OrdersPage() {
  const router = useRouter();

  const token = useAuthStore(
    (state) => state.token
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const getOrders = async () => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      router.push("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(
        response.data?.data || []
      );
    } catch (error) {
      console.log(
        "Get orders error:",
        error.response?.data ||
          error.message
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  console.log(isAuthenticated, token);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    getOrders();
  }, [isAuthenticated, token]);

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

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getItemCount = (items = []) => {
    return items.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F7F9FB]">

        {/* PAGE HEADER */}
        <section className="border-b border-[#e5eaed] bg-white">
          <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
              My Account
            </p>

            <div className="mt-2 flex items-center gap-3">
              <Package
                size={28}
                className="text-[#024E82]"
              />

              <h1 className="text-3xl font-semibold tracking-tight text-[#172B38]">
                My Orders
              </h1>
            </div>

            <p className="mt-3 max-w-[620px] text-sm leading-6 text-gray-500">
              View your FTC furniture
              orders, payment information
              and current order status.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">

          {/* LOADING */}
          {loading && (
            <div className="space-y-4">
              {Array.from({
                length: 3,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-[230px] animate-pulse rounded-xl border border-[#e5eaed] bg-white"
                />
              ))}
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            orders.length === 0 && (
              <div className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-[#e5eaed] bg-white px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#edf6fa]">
                  <ShoppingBag
                    size={28}
                    strokeWidth={1.6}
                    className="text-[#024E82]"
                  />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-[#213640]">
                  No orders yet
                </h2>

                <p className="mt-2 max-w-[420px] text-sm leading-6 text-gray-500">
                  Once you place an FTC
                  furniture order, you will
                  be able to track it here.
                </p>

                <Link
                  href="/shop"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-[#024E82] px-5 text-sm font-medium text-white transition hover:bg-[#013d67]"
                >
                  Explore Furniture

                  <ArrowRight size={16} />
                </Link>
              </div>
            )}

          {/* ORDERS */}
          {!loading &&
            orders.length > 0 && (
              <>
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {orders.length}{" "}
                    {orders.length === 1
                      ? "order"
                      : "orders"}
                  </p>

                  <Link
                    href="/shop"
                    className="text-sm font-medium text-[#024E82]"
                  >
                    Continue Shopping
                  </Link>
                </div>

                <div className="space-y-4">
                  {orders.map((order) => {
                    const items =
                      order.items || [];

                    const itemCount =
                      getItemCount(items);

                    return (
                      <article
                        key={order.id}
                        className="overflow-hidden rounded-xl border border-[#e5eaed] bg-white"
                      >
                        {/* TOP */}
                        <div className="flex flex-col gap-4 border-b border-[#edf0f2] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-sm font-semibold text-[#213640]">
                                {
                                  order.orderNumber
                                }
                              </h2>

                              <span
                                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${getStatusClasses(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </div>

                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                              <CalendarDays
                                size={13}
                              />

                              {formatDate(
                                order.createdAt
                              )}
                            </div>
                          </div>

                          <div className="sm:text-right">
                            <p className="text-xs text-gray-400">
                              Order Total
                            </p>

                            <p className="mt-1 text-lg font-bold text-[#024E82]">
                              ₹
                              {Number(
                                order.totalAmount ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          </div>
                        </div>

                        {/* BODY */}
                        <div className="p-5">
                          <div className="grid gap-5 sm:grid-cols-3">

                            {/* ITEMS */}
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                Items
                              </p>

                              <p className="mt-2 text-sm font-medium text-[#2d414b]">
                                {itemCount}{" "}
                                {itemCount === 1
                                  ? "item"
                                  : "items"}
                              </p>

                              <div className="mt-2 space-y-1">
                                {items
                                  .slice(0, 2)
                                  .map(
                                    (item) => (
                                      <p
                                        key={
                                          item.id
                                        }
                                        className="line-clamp-1 text-xs text-gray-500"
                                      >
                                        {
                                          item.productName
                                        }{" "}
                                        ×{" "}
                                        {
                                          item.quantity
                                        }
                                      </p>
                                    )
                                  )}

                                {items.length >
                                  2 && (
                                  <p className="text-xs text-gray-400">
                                    +
                                    {items.length -
                                      2}{" "}
                                    more
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* PAYMENT */}
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                Payment
                              </p>

                              <div className="mt-2 flex items-center gap-2">
                                <CreditCard
                                  size={15}
                                  className="text-[#024E82]"
                                />

                                <p className="text-sm font-medium text-[#2d414b]">
                                  {order.paymentMethod ===
                                  "cod"
                                    ? "Cash on Delivery"
                                    : order.paymentMethod ||
                                      "—"}
                                </p>
                              </div>

                              <p className="mt-2 text-xs capitalize text-gray-500">
                                Payment:{" "}
                                <span className="font-medium">
                                  {
                                    order.paymentStatus
                                  }
                                </span>
                              </p>
                            </div>

                            {/* STATUS */}
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                Order Status
                              </p>

                              <div className="mt-2 flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#1683BC] opacity-30" />

                                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#024E82]" />
                                </span>

                                <p className="text-sm font-medium capitalize text-[#2d414b]">
                                  {
                                    order.status
                                  }
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* FOOTER */}
                          <div className="mt-5 flex flex-col gap-3 border-t border-[#edf0f2] pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-gray-400">
                              Shipping: ₹
                              {Number(
                                order.shippingFee ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </p>

                            <Link
                              href={`/account/orders/${order.id}`}
                              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#024E82] px-4 text-xs font-medium text-white transition hover:bg-[#013d67]"
                            >
                              View Order

                              <ArrowRight
                                size={14}
                              />
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
        </section>
      </main>

      <Footer />
    </>
  );
}