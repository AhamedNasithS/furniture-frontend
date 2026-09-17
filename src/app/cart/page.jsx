"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ImageIcon,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import Header from "@/components/customer/Header";
import Footer from "@/components/customer/Footer";
import useAuthStore from "@/store/authStore";
import Image from "next/image";
import useCartStore from "@/store/cartStore";

export default function CartPage() {
  const router = useRouter();

  const token = useAuthStore(
    (state) => state.token
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const fetchCartCount =
    useCartStore(
      (state) =>
        state.fetchCartCount
    );

  const [cartItems, setCartItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    updatingProductId,
    setUpdatingProductId,
  ] = useState(null);

  const [
    removingProductId,
    setRemovingProductId,
  ] = useState(null);

  const getCart = async () => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      router.push("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data?.data;

      // Supports:
      // data: [...]
      // OR
      // data: { items: [...] }
      const items = Array.isArray(data)
        ? data
        : data?.items || [];

      setCartItems(items);
    } catch (error) {
      console.log(
        "Get cart error:",
        error.response?.data ||
        error.message
      );

      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    getCart();
  }, [isAuthenticated, token]);

  const getProduct = (item) =>
    item.product || item.Product || item;

  const getSellingPrice = (product) => {
    const regularPrice = Number(
      product?.price || 0
    );

    const discountPrice =
      product?.discountPrice !== null &&
        product?.discountPrice !== undefined
        ? Number(product.discountPrice)
        : null;

    if (
      discountPrice !== null &&
      discountPrice < regularPrice
    ) {
      return discountPrice;
    }

    return regularPrice;
  };

  const updateQuantity = async (
    productId,
    quantity
  ) => {
    if (quantity < 1) return;

    try {
      setUpdatingProductId(productId);

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`,
        {
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchCartCount(token);

      setCartItems((prev) =>
        prev.map((item) => {
          const product =
            getProduct(item);

          if (
            product.id === productId
          ) {
            return {
              ...item,
              quantity,
            };
          }

          return item;
        })
      );
    } catch (error) {
      console.log(
        "Update cart error:",
        error.response?.data ||
        error.message
      );
    } finally {
      setUpdatingProductId(null);
    }
  };

  const removeItem = async (
    productId
  ) => {
    try {
      setRemovingProductId(productId);

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchCartCount(token);

      setCartItems((prev) =>
        prev.filter((item) => {
          const product =
            getProduct(item);

          return (
            product.id !== productId
          );
        })
      );
    } catch (error) {
      console.log(
        "Remove cart error:",
        error.response?.data ||
        error.message
      );
    } finally {
      setRemovingProductId(null);
    }
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) => {
        const product =
          getProduct(item);

        const price =
          getSellingPrice(product);

        const quantity = Number(
          item.quantity || 1
        );

        return (
          total + price * quantity
        );
      },
      0
    );
  }, [cartItems]);

  const totalSavings = useMemo(() => {
    return cartItems.reduce(
      (total, item) => {
        const product =
          getProduct(item);

        const regularPrice = Number(
          product?.price || 0
        );

        const sellingPrice =
          getSellingPrice(product);

        const quantity = Number(
          item.quantity || 1
        );

        return (
          total +
          (regularPrice -
            sellingPrice) *
          quantity
        );
      },
      0
    );
  }, [cartItems]);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F7F9FB]">

        {/* PAGE HEADER */}
        <section className="border-b border-[#e6ecef] bg-white">
          <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
              Your Selection
            </p>

            <div className="mt-2 flex items-center gap-3">
              <ShoppingBag
                size={28}
                className="text-[#024E82]"
              />

              <h1 className="text-3xl font-semibold tracking-tight text-[#172B38]">
                Shopping Cart
              </h1>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              Review your furniture
              before proceeding to checkout.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">

          {/* LOADING */}
          {loading && (
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="space-y-4">
                {Array.from({
                  length: 3,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[180px] animate-pulse rounded-xl bg-white"
                  />
                ))}
              </div>

              <div className="h-[300px] animate-pulse rounded-xl bg-white" />
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            cartItems.length === 0 && (
              <div className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-[#e5eaed] bg-white px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#edf6fa]">
                  <ShoppingBag
                    size={28}
                    strokeWidth={1.6}
                    className="text-[#024E82]"
                  />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-[#213640]">
                  Your cart is empty
                </h2>

                <p className="mt-2 max-w-[420px] text-sm leading-6 text-gray-500">
                  Explore the FTC collection
                  and add furniture you love
                  to your cart.
                </p>

                <Link
                  href="/shop"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-[#024E82] px-5 text-sm font-medium text-white transition hover:bg-[#013d67]"
                >
                  Start Shopping

                  <ArrowRight size={16} />
                </Link>
              </div>
            )}

          {/* CART */}
          {!loading &&
            cartItems.length > 0 && (
              <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">

                {/* LEFT */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      {cartItems.length}{" "}
                      {cartItems.length ===
                        1
                        ? "item"
                        : "items"}{" "}
                      in your cart
                    </p>

                    <Link
                      href="/shop"
                      className="text-sm font-medium text-[#024E82]"
                    >
                      Continue Shopping
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {cartItems.map(
                      (item) => {
                        const product =
                          getProduct(item);

                        const quantity =
                          Number(
                            item.quantity ||
                            1
                          );

                        const primaryImage =
                          product.images?.find(
                            (image) =>
                              image.isPrimary
                          ) ||
                          product.images?.[0];

                        const regularPrice =
                          Number(
                            product.price ||
                            0
                          );

                        const sellingPrice =
                          getSellingPrice(
                            product
                          );

                        const hasDiscount =
                          sellingPrice <
                          regularPrice;

                        return (
                          <article
                            key={
                              item.id ||
                              product.id
                            }
                            className="rounded-xl border border-[#e5eaed] bg-white p-4"
                          >
                            <div className="flex flex-col gap-4 sm:flex-row">

                              {/* IMAGE */}
                              <Link
                                href={`/products/${product.slug}`}
                                className="flex h-[170px] w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#edf1f3] sm:h-[150px] sm:w-[190px]"
                              >
                                {primaryImage ? (
                                  <Image
                                    src={
                                      primaryImage.imageUrl
                                    }
                                    alt={
                                      product.name
                                    }
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <ImageIcon
                                    size={34}
                                    strokeWidth={
                                      1.2
                                    }
                                    className="text-gray-300"
                                  />
                                )}
                              </Link>

                              {/* DETAILS */}
                              <div className="flex min-w-0 flex-1 flex-col">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#1683BC]">
                                      {product
                                        .category
                                        ?.name ||
                                        "Furniture"}
                                    </p>

                                    <Link
                                      href={`/products/${product.slug}`}
                                    >
                                      <h2 className="mt-1 text-base font-semibold text-[#213640] transition hover:text-[#024E82]">
                                        {
                                          product.name
                                        }
                                      </h2>
                                    </Link>

                                    {(product.material ||
                                      product.color) && (
                                        <p className="mt-2 text-xs text-gray-400">
                                          {[
                                            product.material,
                                            product.color,
                                          ]
                                            .filter(
                                              Boolean
                                            )
                                            .join(
                                              " • "
                                            )}
                                        </p>
                                      )}
                                  </div>

                                  {/* REMOVE */}
                                  <button
                                    type="button"
                                    disabled={
                                      removingProductId ===
                                      product.id
                                    }
                                    onClick={() =>
                                      removeItem(
                                        product.id
                                      )
                                    }
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                                    aria-label="Remove product"
                                  >
                                    <Trash2
                                      size={
                                        17
                                      }
                                    />
                                  </button>
                                </div>

                                {/* PRICE */}
                                <div className="mt-4 flex items-center gap-2">
                                  <span className="text-lg font-bold text-[#024E82]">
                                    ₹
                                    {sellingPrice.toLocaleString(
                                      "en-IN"
                                    )}
                                  </span>

                                  {hasDiscount && (
                                    <span className="text-xs text-gray-400 line-through">
                                      ₹
                                      {regularPrice.toLocaleString(
                                        "en-IN"
                                      )}
                                    </span>
                                  )}
                                </div>

                                {/* BOTTOM */}
                                <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">

                                  {/* QUANTITY */}
                                  <div>
                                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                      Quantity
                                    </p>

                                    <div className="flex h-10 items-center overflow-hidden rounded-md border border-[#dfe5e8]">
                                      <button
                                        type="button"
                                        disabled={
                                          quantity <=
                                          1 ||
                                          updatingProductId ===
                                          product.id
                                        }
                                        onClick={() =>
                                          updateQuantity(
                                            product.id,
                                            quantity -
                                            1
                                          )
                                        }
                                        className="flex h-full w-10 items-center justify-center text-gray-500 transition hover:bg-gray-50 disabled:opacity-30"
                                      >
                                        <Minus
                                          size={
                                            14
                                          }
                                        />
                                      </button>

                                      <span className="flex h-full min-w-10 items-center justify-center border-x border-[#dfe5e8] text-sm font-medium text-[#263a44]">
                                        {
                                          quantity
                                        }
                                      </span>

                                      <button
                                        type="button"
                                        disabled={
                                          quantity >=
                                          Number(
                                            product.stock ||
                                            0
                                          ) ||
                                          updatingProductId ===
                                          product.id
                                        }
                                        onClick={() =>
                                          updateQuantity(
                                            product.id,
                                            quantity +
                                            1
                                          )
                                        }
                                        className="flex h-full w-10 items-center justify-center text-gray-500 transition hover:bg-gray-50 disabled:opacity-30"
                                      >
                                        <Plus
                                          size={
                                            14
                                          }
                                        />
                                      </button>
                                    </div>
                                  </div>

                                  {/* LINE TOTAL */}
                                  <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-wide text-gray-400">
                                      Total
                                    </p>

                                    <p className="mt-1 text-base font-semibold text-[#213640]">
                                      ₹
                                      {(
                                        sellingPrice *
                                        quantity
                                      ).toLocaleString(
                                        "en-IN"
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* ORDER SUMMARY */}
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
                        {subtotal.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>

                    {totalSavings > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          You Save
                        </span>

                        <span className="font-medium text-green-600">
                          -₹
                          {totalSavings.toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Delivery
                      </span>

                      <span className="text-xs font-medium text-[#024E82]">
                        Calculated at checkout
                      </span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between pt-5">
                    <div>
                      <p className="text-sm font-semibold text-[#213640]">
                        Total
                      </p>

                      <p className="mt-1 text-[11px] text-gray-400">
                        Inclusive of product
                        discounts
                      </p>
                    </div>

                    <p className="text-xl font-bold text-[#024E82]">
                      ₹
                      {subtotal.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  <Link
                    href="/checkout"
                    className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#024E82] text-sm font-medium text-white transition hover:bg-[#013d67]"
                  >
                    Proceed to Checkout

                    <ArrowRight
                      size={16}
                    />
                  </Link>

                  <Link
                    href="/shop"
                    className="mt-3 flex h-11 w-full items-center justify-center rounded-md border border-[#dfe5e8] text-sm font-medium text-[#42545d] transition hover:border-[#024E82] hover:text-[#024E82]"
                  >
                    Continue Shopping
                  </Link>
                </aside>
              </div>
            )}
        </section>
      </main>

      <Footer />
    </>
  );
}