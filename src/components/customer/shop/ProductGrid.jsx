"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState, useEffect } from "react";
import {
    Heart,
    ImageIcon,
    ShoppingBag,
    Star,
} from "lucide-react";
import { motion } from "framer-motion";

import useAuthStore from "@/store/authStore";
import Image from "next/image";
import useCartStore from "@/store/cartStore";

export default function ProductGrid({
    products,
    loading,
}) {
    const router = useRouter();
    const [wishlistIds, setWishlistIds] =
        useState([]);

    const [
        updatingWishlistId,
        setUpdatingWishlistId,
    ] = useState(null);

    const fetchCartCount =
        useCartStore(
            (state) =>
                state.fetchCartCount
        );

    const token = useAuthStore(
        (state) => state.token
    );

    const isAuthenticated = useAuthStore(
        (state) => state.isAuthenticated
    );

    const [addingProductId, setAddingProductId] =
        useState(null);

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

    const getWishlist = async () => {
        if (!isAuthenticated || !token) {
            setWishlistIds([]);
            return;
        }

        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/wishlist`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const wishlist =
                response.data?.data || [];

            const ids = wishlist.map(
                (item) =>
                    item.productId ||
                    item.product?.id
            );

            setWishlistIds(
                ids.filter(Boolean)
            );
        } catch (error) {
            console.log(
                "Get wishlist error:",
                error.response?.data ||
                error.message
            );
        }
    };

    const handleWishlist = async (
        productId
    ) => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        const isWishlisted =
            wishlistIds.includes(productId);

        try {
            setUpdatingWishlistId(productId);

            if (isWishlisted) {
                await axios.delete(
                    `${process.env.NEXT_PUBLIC_API_URL}/wishlist/${productId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setWishlistIds((prev) =>
                    prev.filter(
                        (id) => id !== productId
                    )
                );
            } else {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/wishlist`,
                    {
                        productId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setWishlistIds((prev) => [
                    ...prev,
                    productId,
                ]);
            }
        } catch (error) {
            console.log(
                "Wishlist error:",
                error.response?.data ||
                error.message
            );
        } finally {
            setUpdatingWishlistId(null);
        }
    };

    useEffect(() => {
        getWishlist();
    }, [isAuthenticated, token]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({
                    length: 6,
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

                            <div className="h-10 animate-pulse rounded bg-gray-100" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-[#e5eaed] bg-white px-6 text-center">
                <ImageIcon
                    size={40}
                    strokeWidth={1.3}
                    className="text-gray-300"
                />

                <h3 className="mt-4 text-base font-semibold text-[#253841]">
                    No products match your filters
                </h3>

                <p className="mt-2 max-w-[380px] text-sm leading-6 text-gray-500">
                    Try changing your category,
                    material, color or price range.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map(
                (product, index) => {
                    const primaryImage =
                        product.images?.find(
                            (image) =>
                                image.isPrimary
                        ) ||
                        product.images?.[0];

                    const regularPrice =
                        Number(product.price);

                    const discountPrice =
                        product.discountPrice !== null
                            ? Number(
                                product.discountPrice
                            )
                            : null;

                    const hasDiscount =
                        discountPrice !== null &&
                        discountPrice <
                        regularPrice;

                    const sellingPrice =
                        hasDiscount
                            ? discountPrice
                            : regularPrice;

                    const discountPercentage =
                        hasDiscount
                            ? Math.round(
                                ((regularPrice -
                                    sellingPrice) /
                                    regularPrice) *
                                100
                            )
                            : 0;

                    return (
                        <motion.article
                            key={product.id}
                            initial={{
                                opacity: 0,
                                y: 14,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.3,
                                delay:
                                    index * 0.04,
                            }}
                            className="group overflow-hidden rounded-xl border border-[#e5eaed] bg-white transition hover:-translate-y-0.5 hover:shadow-md"
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
                                                size={38}
                                                strokeWidth={1.2}
                                                className="text-gray-300"
                                            />
                                        </div>
                                    )}
                                </Link>

                                {/* DISCOUNT */}
                                {hasDiscount && (
                                    <span className="absolute left-3 top-3 rounded-md bg-[#D64036] px-2 py-1 text-[10px] font-semibold text-white">
                                        SAVE{" "}
                                        {
                                            discountPercentage
                                        }
                                        %
                                    </span>
                                )}

                                {/* WISHLIST */}
                                <button
                                    type="button"
                                    disabled={
                                        updatingWishlistId ===
                                        product.id
                                    }
                                    onClick={() =>
                                        handleWishlist(product.id)
                                    }
                                    className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm transition ${wishlistIds.includes(
                                        product.id
                                    )
                                        ? "text-[#024E82]"
                                        : "text-[#354851] hover:text-[#024E82]"
                                        } disabled:opacity-50`}
                                    aria-label={
                                        wishlistIds.includes(
                                            product.id
                                        )
                                            ? "Remove from wishlist"
                                            : "Add to wishlist"
                                    }
                                >
                                    <Heart
                                        size={16}
                                        strokeWidth={1.8}
                                        fill={
                                            wishlistIds.includes(
                                                product.id
                                            )
                                                ? "currentColor"
                                                : "none"
                                        }
                                    />
                                </button>
                            </div>

                            {/* CONTENT */}
                            <div className="p-4">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#1683BC]">
                                    {product.category
                                        ?.name ||
                                        "Furniture"}
                                </p>

                                <Link
                                    href={`/products/${product.slug}`}
                                >
                                    <h3 className="mt-1 line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-[#213640] transition hover:text-[#024E82]">
                                        {product.name}
                                    </h3>
                                </Link>

                                {/* RATING */}
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

                                {/* ATTRIBUTES */}
                                {(product.material ||
                                    product.color) && (
                                        <p className="mt-2 line-clamp-1 text-xs text-gray-400">
                                            {[
                                                product.material,
                                                product.color,
                                            ]
                                                .filter(Boolean)
                                                .join(" • ")}
                                        </p>
                                    )}

                                {/* PRICE */}
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
                                            {regularPrice.toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>
                                    )}
                                </div>

                                {/* STOCK */}
                                <p
                                    className={`mt-2 text-[11px] font-medium ${product.stock === 0
                                        ? "text-red-500"
                                        : product.stock <= 5
                                            ? "text-orange-500"
                                            : "text-green-600"
                                        }`}
                                >
                                    {product.stock === 0
                                        ? "Out of stock"
                                        : product.stock <= 5
                                            ? `Only ${product.stock} left`
                                            : "In stock"}
                                </p>

                                {/* ADD TO CART */}
                                <button
                                    type="button"
                                    disabled={
                                        product.stock === 0 ||
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
                                        strokeWidth={1.8}
                                    />

                                    {product.stock === 0
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
    );
}