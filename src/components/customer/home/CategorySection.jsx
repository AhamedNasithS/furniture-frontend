"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CategorySection() {
  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const getCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`
      );

      const categoryData =
        response.data?.data || [];

      setCategories(
        categoryData.filter(
          (item) =>
            !item.status ||
            item.status === "active"
        )
      );
    } catch (error) {
      console.log(
        "Get categories error:",
        error.response?.data ||
          error.message
      );

      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1440px]">

        {/* SECTION HEADER */}
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
              Curated for every space
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#172B38] sm:text-3xl">
              Explore Core Furniture Categories
            </h2>
          </div>

          <Link
            href="/shop"
            className="hidden items-center gap-1.5 text-sm font-medium text-[#024E82] transition hover:opacity-70 sm:flex"
          >
            View All Categories

            <ArrowRight
              size={16}
              strokeWidth={1.8}
            />
          </Link>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-[#e9ecef] bg-white"
              >
                <div className="aspect-[4/3] animate-pulse bg-gray-200" />

                <div className="p-4">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />

                  <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CATEGORIES */}
        {!loading &&
          categories.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {categories
                .slice(0, 6)
                .map(
                  (
                    category,
                    index
                  ) => (
                    <motion.div
                      key={category.id}
                      initial={{
                        opacity: 0,
                        y: 16,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.35,
                        delay:
                          index * 0.05,
                      }}
                    >
                      <Link
                        href={`/shop?categoryId=${category.id}`}
                        className="group block overflow-hidden rounded-xl border border-[#e8edf0] bg-white transition hover:-translate-y-1 hover:shadow-md"
                      >
                        {/* IMAGE */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-[#edf1f3]">
                          {category.image ? (
                            <Image
                              src={
                                category.image
                              }
                              alt={
                                category.name
                              }
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-gray-300">
                              <ImageIcon
                                size={34}
                                strokeWidth={
                                  1.3
                                }
                              />
                            </div>
                          )}
                        </div>

                        {/* CONTENT */}
                        <div className="p-4">
                          <h3 className="text-sm font-semibold text-[#20333E]">
                            {
                              category.name
                            }
                          </h3>

                          <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                            {category.description ||
                              "Explore collection"}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  )
                )}
            </div>
          )}

        {/* EMPTY */}
        {!loading &&
          categories.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white py-12 text-center">
              <ImageIcon
                size={34}
                strokeWidth={1.3}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 text-sm text-gray-500">
                No categories available
              </p>
            </div>
          )}

        {/* MOBILE VIEW ALL */}
        <Link
          href="/shop"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-[#024E82] sm:hidden"
        >
          View All Categories

          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}