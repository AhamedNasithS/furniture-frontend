"use client";
import { Suspense } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  ImageIcon,
  Search,
  Star,
} from "lucide-react";

import Header from "@/components/customer/Header";
import Footer from "@/components/customer/Footer";
import Image from "next/image";

function SearchContent() {
  const searchParams = useSearchParams();

  const query =
    searchParams.get("q") || "";

  const [searchValue, setSearchValue] =
    useState(query);

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const searchProducts = async (
    searchQuery
  ) => {
    const cleanQuery =
      searchQuery.trim();

    if (!cleanQuery) {
      setProducts([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          {
            params: {
              search: cleanQuery,
              page: 1,
              limit: 24,
            },
          }
        );

      setProducts(
        response.data?.data || []
      );
    } catch (error) {
      console.log(
        "Search products error:",
        error.response?.data ||
          error.message
      );

      setProducts([]);

      setError(
        error.response?.data?.message ||
          "Unable to search products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchValue(query);

    if (query) {
      searchProducts(query);
    } else {
      setProducts([]);
    }
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanQuery =
      searchValue.trim();

    if (!cleanQuery) return;

    window.history.pushState(
      {},
      "",
      `/search?q=${encodeURIComponent(
        cleanQuery
      )}`
    );

    searchProducts(cleanQuery);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F7F9FB]">

        {/* SEARCH HEADER */}
        <section className="border-b border-[#e5eaed] bg-white">
          <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
              FTC Furniture
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#172B38]">
              Search Furniture
            </h1>

            <form
              onSubmit={handleSubmit}
              className="mt-6 flex max-w-[720px] overflow-hidden rounded-lg border border-[#dfe5e8] bg-white transition focus-within:border-[#024E82]"
            >
              <div className="flex flex-1 items-center gap-3 px-4">
                <Search
                  size={18}
                  className="shrink-0 text-gray-400"
                />

                <input
                  type="search"
                  value={searchValue}
                  onChange={(e) =>
                    setSearchValue(
                      e.target.value
                    )
                  }
                  placeholder="Search sofas, chairs, tables..."
                  className="h-12 w-full bg-transparent text-sm text-[#263a44] outline-none placeholder:text-gray-400"
                />
              </div>

              <button
                type="submit"
                className="bg-[#024E82] px-6 text-sm font-medium text-white transition hover:bg-[#013d67]"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">

          {/* QUERY TITLE */}
          {query && !loading && (
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                {products.length}{" "}
                {products.length === 1
                  ? "result"
                  : "results"}{" "}
                for
              </p>

              <h2 className="mt-1 text-xl font-semibold text-[#213640]">
                “{query}”
              </h2>
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({
                length: 8,
              }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-[#e5eaed] bg-white"
                >
                  <div className="aspect-[4/3] animate-pulse bg-gray-200" />

                  <div className="space-y-3 p-4">
                    <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />

                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />

                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="rounded-xl bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* EMPTY SEARCH */}
          {!loading &&
            !query &&
            !error && (
              <div className="flex min-h-[430px] flex-col items-center justify-center rounded-2xl border border-[#e5eaed] bg-white px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#edf6fa] text-[#024E82]">
                  <Search size={28} />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-[#213640]">
                  Find your furniture
                </h2>

                <p className="mt-2 max-w-[420px] text-sm leading-6 text-gray-500">
                  Search the FTC
                  collection by product
                  name.
                </p>
              </div>
            )}

          {/* NO RESULTS */}
          {!loading &&
            query &&
            products.length === 0 &&
            !error && (
              <div className="flex min-h-[430px] flex-col items-center justify-center rounded-2xl border border-[#e5eaed] bg-white px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#edf6fa] text-[#024E82]">
                  <Search size={28} />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-[#213640]">
                  No furniture found
                </h2>

                <p className="mt-2 max-w-[420px] text-sm leading-6 text-gray-500">
                  We couldn{"'"}t find any
                  products matching
                  “{query}”.
                </p>

                <Link
                  href="/shop"
                  className="mt-6 flex h-11 items-center rounded-md bg-[#024E82] px-5 text-sm font-medium text-white"
                >
                  Browse All Furniture
                </Link>
              </div>
            )}

          {/* RESULTS */}
          {!loading &&
            products.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map(
                  (product) => {
                    const image =
                      product.images?.find(
                        (item) =>
                          item.isPrimary
                      ) ||
                      product.images?.[0];

                    const price =
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
                        price;

                    const sellingPrice =
                      hasDiscount
                        ? discountPrice
                        : price;

                    return (
                      <article
                        key={product.id}
                        className="group overflow-hidden rounded-xl border border-[#e5eaed] bg-white transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <Link
                          href={`/products/${product.slug}`}
                          className="block aspect-[4/3] overflow-hidden bg-[#edf1f3]"
                        >
                          {image ? (
                            <Image
                              src={
                                image.imageUrl
                              }
                              alt={
                                product.name
                              }
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ImageIcon
                                size={36}
                                className="text-gray-300"
                              />
                            </div>
                          )}
                        </Link>

                        <div className="p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#1683BC]">
                            {product
                              .category
                              ?.name ||
                              "Furniture"}
                          </p>

                          <Link
                            href={`/products/${product.slug}`}
                          >
                            <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#213640] transition hover:text-[#024E82]">
                              {
                                product.name
                              }
                            </h3>
                          </Link>

                          <div className="mt-2 flex items-center gap-1">
                            <Star
                              size={13}
                              fill="#F4B740"
                              className="text-[#F4B740]"
                            />

                            <span className="text-xs font-medium text-[#3f5058]">
                              {product.averageRating ||
                                0}
                            </span>

                            <span className="text-xs text-gray-400">
                              (
                              {product.reviewCount ||
                                0}
                              )
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="text-base font-bold text-[#024E82]">
                              ₹
                              {sellingPrice.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                            {hasDiscount && (
                              <span className="text-xs text-gray-400 line-through">
                                ₹
                                {price.toLocaleString(
                                  "en-IN"
                                )}
                              </span>
                            )}
                          </div>

                          <div className="mt-3">
                            <span
                              className={`text-[11px] font-medium ${
                                product.stock >
                                0
                                  ? "text-green-600"
                                  : "text-red-500"
                              }`}
                            >
                              {product.stock >
                              0
                                ? "In Stock"
                                : "Out of Stock"}
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}