"use client";

import axios from "axios";
import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import {
  ArrowRight,
  ImageIcon,
  Star,
} from "lucide-react";
import Image from "next/image";

export default function RelatedProducts({
  productId,
}) {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const getRelatedProducts =
    async () => {
      try {
        setLoading(true);

        const response =
          await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/related`
          );

        setProducts(
          response.data?.data ||
            []
        );
      } catch (error) {
        console.log(
          "Related products error:",
          error.response?.data ||
            error.message
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    if (productId) {
      getRelatedProducts();
    }
  }, [productId]);

  if (
    !loading &&
    products.length === 0
  ) {
    return null;
  }

  return (
    <section className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1683BC]">
            You May Also Like
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-[#172B38]">
            Related Furniture
          </h2>
        </div>

        <Link
          href="/shop"
          className="hidden items-center gap-2 text-sm font-medium text-[#024E82] sm:flex"
        >
          View All

          <ArrowRight
            size={15}
          />
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({
            length: 4,
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
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map(
            (product) => {
              const image =
                product.images?.find(
                  (item) =>
                    item.isPrimary
                ) ||
                product.images?.[0];

              const regularPrice =
                Number(
                  product.price || 0
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
                          size={
                            34
                          }
                          className="text-gray-300"
                        />
                      </div>
                    )}
                  </Link>

                  <div className="p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#1683BC]">
                      {product.category
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
                  </div>
                </article>
              );
            }
          )}
        </div>
      )}
    </section>
  );
}