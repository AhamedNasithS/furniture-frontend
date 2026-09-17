"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    ArrowRight,
    ImageIcon,
    ShoppingBag,
    Star,
} from "lucide-react";
import { motion } from "framer-motion";

import useAuthStore from "@/store/authStore";
import Image from "next/image";
import useCartStore from "@/store/cartStore";

export default function SignatureProducts() {
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

    const [products, setProducts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [addingProductId, setAddingProductId] =
        useState(null);

    const getProducts = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/products`,
                {
                    params: {
                        page: 1,
                        limit: 4,
                        sort: "newest",
                    },
                }
            );

            setProducts(
                response.data?.data || []
            );
        } catch (error) {
            console.log(
                "Get products error:",
                error.response?.data ||
                error.message
            );

            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    const handleAddToCart = async (
        productId
    ) => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        try {
            setAddingProductId(productId);

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
            console.log("Added to cart");
        } catch (error) {
            console.log(
                "Add to cart error:",
                error.response?.data ||
                error.message
            );
        } finally {
            setAddingProductId(null);
        }
    };

    return (
        <section className="px-4 pb-14 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-[1440px]">

                {/* HEADER */}
                <div className="mb-7 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
                            Engineered for endurance
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#172B38] sm:text-3xl">
                            Signature Factory Pieces
                        </h2>
                    </div>

                    <Link
                        href="/shop"
                        className="hidden items-center gap-1.5 text-sm font-medium text-[#024E82] sm:flex"
                    >
                        View All

                        <ArrowRight
                            size={16}
                            strokeWidth={1.8}
                        />
                    </Link>
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({
                            length: 4,
                        }).map((_, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
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

                {/* PRODUCTS */}
                {!loading &&
                    products.length > 0 && (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {products.map(
                                (product, index) => {
                                    const primaryImage =
                                        product.images?.find(
                                            (image) =>
                                                image.isPrimary
                                        ) ||
                                        product.images?.[0];

                                    const hasDiscount =
                                        product.discountPrice !==
                                        null &&
                                        Number(
                                            product.discountPrice
                                        ) <
                                        Number(
                                            product.price
                                        );

                                    const sellingPrice =
                                        hasDiscount
                                            ? Number(
                                                product.discountPrice
                                            )
                                            : Number(
                                                product.price
                                            );

                                    const discountPercentage =
                                        hasDiscount
                                            ? Math.round(
                                                ((Number(
                                                    product.price
                                                ) -
                                                    sellingPrice) /
                                                    Number(
                                                        product.price
                                                    )) *
                                                100
                                            )
                                            : 0;

                                    return (
                                        <motion.article
                                            key={product.id}
                                            initial={{
                                                opacity: 0,
                                                y: 18,
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
                                                    index * 0.06,
                                            }}
                                            className="group overflow-hidden rounded-xl border border-[#e7ebed] bg-white"
                                        >
                                            {/* IMAGE */}
                                            <Link
                                                href={`/products/${product.slug}`}
                                                className="relative block aspect-[4/3] overflow-hidden bg-[#eef1f2]"
                                            >
                                                {primaryImage ? (
                                                    <Image
                                                        width={300}
                                                        height={300}
                                                        src={
                                                            primaryImage.imageUrl
                                                        }
                                                        alt={
                                                            product.name
                                                        }
                                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-gray-300">
                                                        <ImageIcon
                                                            size={40}
                                                            strokeWidth={
                                                                1.2
                                                            }
                                                        />
                                                    </div>
                                                )}

                                                {hasDiscount && (
                                                    <span className="absolute left-3 top-3 rounded-md bg-[#d64235] px-2 py-1 text-[11px] font-semibold text-white">
                                                        -
                                                        {
                                                            discountPercentage
                                                        }
                                                        %
                                                    </span>
                                                )}

                                                {product.stock <=
                                                    5 &&
                                                    product.stock >
                                                    0 && (
                                                        <span className="absolute right-3 top-3 rounded-md bg-[#f4a62a] px-2 py-1 text-[10px] font-medium text-white">
                                                            Low stock
                                                        </span>
                                                    )}
                                            </Link>

                                            {/* CONTENT */}
                                            <div className="p-4">
                                                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                                    {product.category
                                                        ?.name ||
                                                        "Furniture"}
                                                </p>

                                                <Link
                                                    href={`/products/${product.slug}`}
                                                >
                                                    <h3 className="mt-1 line-clamp-2 min-h-[42px] text-sm font-semibold leading-5 text-[#233640] transition hover:text-[#024E82]">
                                                        {product.name}
                                                    </h3>
                                                </Link>

                                                {/* RATING */}
                                                <div className="mt-2 flex items-center gap-1.5">
                                                    <Star
                                                        size={14}
                                                        fill="#F4B740"
                                                        className="text-[#F4B740]"
                                                    />

                                                    <span className="text-xs font-medium text-[#45555d]">
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

                                                {/* PRICE */}
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
                                                            {Number(
                                                                product.price
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* CART */}
                                                <button
                                                    type="button"
                                                    disabled={
                                                        product.stock ===
                                                        0 ||
                                                        addingProductId ===
                                                        product.id
                                                    }
                                                    onClick={() =>
                                                        handleAddToCart(
                                                            product.id
                                                        )
                                                    }
                                                    className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#024E82] text-xs font-medium text-white transition hover:bg-[#013d67] disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <ShoppingBag
                                                        size={15}
                                                        strokeWidth={
                                                            1.8
                                                        }
                                                    />

                                                    {product.stock ===
                                                        0
                                                        ? "Out of Stock"
                                                        : addingProductId ===
                                                            product.id
                                                            ? "Adding..."
                                                            : "Add to Cart"}
                                                </button>
                                            </div>
                                        </motion.article>
                                    );
                                }
                            )}
                        </div>
                    )}

                {/* EMPTY */}
                {!loading &&
                    products.length === 0 && (
                        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-14 text-center">
                            <ImageIcon
                                size={38}
                                className="mx-auto text-gray-300"
                            />

                            <p className="mt-3 text-sm text-gray-500">
                                No products available
                            </p>
                        </div>
                    )}

                {/* MOBILE VIEW ALL */}
                <Link
                    href="/shop"
                    className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-[#024E82] sm:hidden"
                >
                    View All Products

                    <ArrowRight size={16} />
                </Link>
            </div>
        </section>
    );
}