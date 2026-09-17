"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Heart,
  ImageIcon,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import Header from "@/components/customer/Header";
import Footer from "@/components/customer/Footer";
import useAuthStore from "@/store/authStore";
import Image from "next/image";
import useCartStore from "@/store/cartStore";

export default function WishlistPage() {
  const router = useRouter();

  const token = useAuthStore(
    (state) => state.token
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const [wishlist, setWishlist] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    removingProductId,
    setRemovingProductId,
  ] = useState(null);

  const [
    movingProductId,
    setMovingProductId,
  ] = useState(null);

  const fetchCartCount =
    useCartStore(
      (state) =>
        state.fetchCartCount
    );

  const getWishlist = async () => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      router.push("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlist(
        response.data?.data || []
      );
    } catch (error) {
      console.log(
        "Get wishlist error:",
        error.response?.data ||
        error.message
      );

      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    getWishlist();
  }, [isAuthenticated, token]);

  const handleRemove = async (
    productId
  ) => {
    try {
      setRemovingProductId(
        productId
      );

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlist((prev) =>
        prev.filter((item) => {
          const product =
            item.product || item;

          return (
            product.id !== productId
          );
        })
      );
    } catch (error) {
      console.log(
        "Remove wishlist error:",
        error.response?.data ||
        error.message
      );
    } finally {
      setRemovingProductId(null);
    }
  };

  const handleMoveToCart = async (
    productId
  ) => {
    try {
      setMovingProductId(productId);

      // ADD TO CART
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cart`,
        {
          productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchCartCount(token);

      // REMOVE FROM WISHLIST
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlist((prev) =>
        prev.filter((item) => {
          const product =
            item.product || item;

          return (
            product.id !== productId
          );
        })
      );
    } catch (error) {
      console.log(
        "Move to cart error:",
        error.response?.data ||
        error.message
      );
    } finally {
      setMovingProductId(null);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F7F9FB]">
        <section className="border-b border-[#e6ecef] bg-white">
          <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
              Saved Furniture
            </p>

            <div className="mt-2 flex items-center gap-3">
              <Heart
                size={28}
                className="text-[#024E82]"
              />

              <h1 className="text-3xl font-semibold tracking-tight text-[#172B38]">
                My Wishlist
              </h1>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              Keep your favourite FTC
              furniture in one place.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
          {/* LOADING */}
          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({
                length: 4,
              }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-[#e5eaed] bg-white"
                >
                  <div className="aspect-[4/3] animate-pulse bg-gray-200" />

                  <div className="space-y-3 p-4">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />

                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />

                    <div className="h-10 animate-pulse rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            wishlist.length === 0 && (
              <div className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-[#e5eaed] bg-white px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#edf6fa]">
                  <Heart
                    size={28}
                    strokeWidth={1.6}
                    className="text-[#024E82]"
                  />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-[#213640]">
                  Your wishlist is empty
                </h2>

                <p className="mt-2 max-w-[420px] text-sm leading-6 text-gray-500">
                  Save furniture you love
                  while browsing and come
                  back to it anytime.
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

          {/* WISHLIST GRID */}
          {!loading &&
            wishlist.length > 0 && (
              <>
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {wishlist.length}{" "}
                    {wishlist.length === 1
                      ? "saved product"
                      : "saved products"}
                  </p>

                  <Link
                    href="/shop"
                    className="text-sm font-medium text-[#024E82]"
                  >
                    Continue Shopping
                  </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {wishlist.map(
                    (item) => {
                      const product =
                        item.product ||
                        item;

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

                      const discountPrice =
                        product.discountPrice !==
                          null &&
                          product.discountPrice !==
                          undefined
                          ? Number(
                            product.discountPrice
                          )
                          : null;

                      const hasDiscount =
                        discountPrice !==
                        null &&
                        discountPrice <
                        regularPrice;

                      const sellingPrice =
                        hasDiscount
                          ? discountPrice
                          : regularPrice;

                      return (
                        <article
                          key={
                            item.id ||
                            product.id
                          }
                          className="group overflow-hidden rounded-xl border border-[#e5eaed] bg-white transition hover:shadow-md"
                        >
                          {/* IMAGE */}
                          <div className="relative">
                            <Link
                              href={`/products/${product.slug}`}
                              className="block aspect-[4/3] overflow-hidden bg-[#edf1f3]"
                            >
                              {primaryImage ? (
                                <Image
                                  src={
                                    primaryImage.imageUrl
                                  }
                                  alt={
                                    product.name
                                  }
                                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <ImageIcon
                                    size={
                                      38
                                    }
                                    strokeWidth={
                                      1.2
                                    }
                                    className="text-gray-300"
                                  />
                                </div>
                              )}
                            </Link>

                            {/* REMOVE */}
                            <button
                              type="button"
                              disabled={
                                removingProductId ===
                                product.id
                              }
                              onClick={() =>
                                handleRemove(
                                  product.id
                                )
                              }
                              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition hover:text-red-500 disabled:opacity-50"
                              aria-label="Remove from wishlist"
                            >
                              <Trash2
                                size={16}
                              />
                            </button>
                          </div>

                          {/* CONTENT */}
                          <div className="p-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#1683BC]">
                              {product
                                .category
                                ?.name ||
                                "Furniture"}
                            </p>

                            <Link
                              href={`/products/${product.slug}`}
                            >
                              <h2 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#213640] transition hover:text-[#024E82]">
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

                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-base font-bold text-[#024E82]">
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

                            <p
                              className={`mt-2 text-[11px] font-medium ${product.stock ===
                                0
                                ? "text-red-500"
                                : product.stock <=
                                  5
                                  ? "text-orange-500"
                                  : "text-green-600"
                                }`}
                            >
                              {product.stock ===
                                0
                                ? "Out of stock"
                                : product.stock <=
                                  5
                                  ? `Only ${product.stock} left`
                                  : "In stock"}
                            </p>

                            <button
                              type="button"
                              disabled={
                                product.stock ===
                                0 ||
                                movingProductId ===
                                product.id
                              }
                              onClick={() =>
                                handleMoveToCart(
                                  product.id
                                )
                              }
                              className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#024E82] text-xs font-medium text-white transition hover:bg-[#013d67] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <ShoppingBag
                                size={15}
                              />

                              {product.stock ===
                                0
                                ? "Out of Stock"
                                : movingProductId ===
                                  product.id
                                  ? "Moving..."
                                  : "Move to Cart"}
                            </button>
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              </>
            )}
        </section>
      </main>

      <Footer />
    </>
  );
}