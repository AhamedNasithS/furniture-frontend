"use client";

import axios from "axios";
import Link from "next/link";
import {
    useParams,
    useRouter,
} from "next/navigation";
import {
    useEffect,
    useState,
} from "react";

import {
    ChevronRight,
    Heart,
    ImageIcon,
    Minus,
    Plus,
    ShoppingBag,
    Star,
} from "lucide-react";

import Header from "@/components/customer/Header";
import Footer from "@/components/customer/Footer";
import useAuthStore from "@/store/authStore";
import Image from "next/image";
import ProductReviews from "@/components/customer/product/ProductReviews";
import RelatedProducts from "@/components/customer/product/RelatedProducts";
import useCartStore from "@/store/cartStore";

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const slug = params.slug;

    const token = useAuthStore(
        (state) => state.token
    );

    const fetchCartCount =
        useCartStore(
            (state) =>
                state.fetchCartCount
        );

    const isAuthenticated =
        useAuthStore(
            (state) =>
                state.isAuthenticated
        );

    const [product, setProduct] =
        useState(null);

    const [selectedImage, setSelectedImage] =
        useState(null);

    const [quantity, setQuantity] =
        useState(1);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [adding, setAdding] =
        useState(false);

    const [wishlisted, setWishlisted] =
        useState(false);

    const [wishlistLoading, setWishlistLoading] =
        useState(false);

    const getProduct = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/products/slug/${slug}`
                );

            const data =
                response.data?.data;

            setProduct(data);

            const primaryImage =
                data?.images?.find(
                    (image) =>
                        image.isPrimary
                ) ||
                data?.images?.[0];

            setSelectedImage(
                primaryImage || null
            );
        } catch (error) {
            console.log(
                "Product details error:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data
                    ?.message ||
                "Unable to load product."
            );
        } finally {
            setLoading(false);
        }
    };

    const getWishlistStatus =
        async () => {
            if (
                !isAuthenticated ||
                !token
            ) {
                setWishlisted(false);
                return;
            }

            try {
                const response =
                    await axios.get(
                        `${process.env.NEXT_PUBLIC_API_URL}/wishlist`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                const wishlist =
                    response.data?.data || [];

                const exists =
                    wishlist.some((item) => {
                        const wishlistProduct =
                            item.product || item;

                        return (
                            wishlistProduct.id ===
                            product?.id
                        );
                    });

                setWishlisted(exists);
            } catch (error) {
                console.log(
                    "Wishlist status error:",
                    error.response?.data ||
                    error.message
                );
            }
        };

    useEffect(() => {
        if (slug) {
            getProduct();
        }
    }, [slug]);

    useEffect(() => {
        if (product) {
            getWishlistStatus();
        }
    }, [
        product,
        isAuthenticated,
        token,
    ]);

    const handleAddToCart =
        async () => {
            if (!isAuthenticated) {
                router.push("/login");
                return;
            }

            if (
                !product ||
                product.stock === 0
            ) {
                return;
            }

            try {
                setAdding(true);

                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/cart`,
                    {
                        productId: product.id,
                        quantity,
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
                setAdding(false);
            }
        };

    const handleWishlist =
        async () => {
            if (!isAuthenticated) {
                router.push("/login");
                return;
            }

            if (!product) return;

            try {
                setWishlistLoading(true);

                if (wishlisted) {
                    await axios.delete(
                        `${process.env.NEXT_PUBLIC_API_URL}/wishlist/${product.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    setWishlisted(false);
                } else {
                    await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/wishlist`,
                        {
                            productId:
                                product.id,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    setWishlisted(true);
                }
            } catch (error) {
                console.log(
                    "Wishlist error:",
                    error.response?.data ||
                    error.message
                );
            } finally {
                setWishlistLoading(false);
            }
        };

    if (loading) {
        return (
            <>
                <Header />

                <main className="min-h-screen bg-[#F7F9FB]">
                    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
                        <div className="grid gap-8 lg:grid-cols-2">
                            <div className="aspect-[4/3] animate-pulse rounded-xl bg-gray-200" />

                            <div className="h-[520px] animate-pulse rounded-xl bg-white" />
                        </div>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    if (error || !product) {
        return (
            <>
                <Header />

                <main className="flex min-h-[70vh] items-center justify-center bg-[#F7F9FB] px-4">
                    <div className="rounded-xl border border-[#e5eaed] bg-white p-8 text-center">
                        <h1 className="text-xl font-semibold text-[#213640]">
                            Product not found
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            {error}
                        </p>

                        <Link
                            href="/shop"
                            className="mt-5 inline-flex h-10 items-center rounded-md bg-[#024E82] px-5 text-sm font-medium text-white"
                        >
                            Back to Shop
                        </Link>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    const regularPrice =
        Number(product.price || 0);

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
        <>
            <Header />

            <main className="min-h-screen bg-[#F7F9FB]">
                <section className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10">

                    {/* BREADCRUMB */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                        <Link
                            href="/"
                            className="hover:text-[#024E82]"
                        >
                            Home
                        </Link>

                        <ChevronRight
                            size={13}
                        />

                        <Link
                            href="/shop"
                            className="hover:text-[#024E82]"
                        >
                            Shop
                        </Link>

                        <ChevronRight
                            size={13}
                        />

                        <span className="text-[#024E82]">
                            {product.name}
                        </span>
                    </div>

                    <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">

                        {/* IMAGE GALLERY */}
                        <div>
                            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#e5eaed] bg-white">
                                {selectedImage ? (
                                    <Image
                                        src={
                                            selectedImage.imageUrl
                                        }
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center text-gray-300">
                                        <ImageIcon
                                            size={48}
                                            strokeWidth={1.2}
                                        />

                                        <p className="mt-3 text-sm">
                                            No product image
                                        </p>
                                    </div>
                                )}

                                {hasDiscount && (
                                    <span className="absolute left-4 top-4 rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white">
                                        {discountPercentage}% OFF
                                    </span>
                                )}
                            </div>

                            {product.images?.length >
                                1 && (
                                    <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5">
                                        {product.images.map(
                                            (image) => {
                                                const selected =
                                                    selectedImage?.id ===
                                                    image.id;

                                                return (
                                                    <button
                                                        key={
                                                            image.id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedImage(
                                                                image
                                                            )
                                                        }
                                                        className={`aspect-square overflow-hidden rounded-lg border-2 bg-white ${selected
                                                            ? "border-[#024E82]"
                                                            : "border-transparent"
                                                            }`}
                                                    >
                                                        <Image
                                                            src={
                                                                image.imageUrl
                                                            }
                                                            alt={
                                                                product.name
                                                            }
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>
                                )}
                        </div>

                        {/* PRODUCT DETAILS */}
                        <div className="rounded-2xl border border-[#e5eaed] bg-white p-5 sm:p-7 lg:p-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1683BC]">
                                {product.category
                                    ?.name ||
                                    "FTC Furniture"}
                            </p>

                            <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-[#172B38] sm:text-4xl">
                                {product.name}
                            </h1>

                            {/* RATING */}
                            <div className="mt-4 flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <Star
                                        size={16}
                                        fill="#F4B740"
                                        className="text-[#F4B740]"
                                    />

                                    <span className="text-sm font-semibold text-[#344852]">
                                        {product.averageRating ||
                                            0}
                                    </span>
                                </div>

                                <span className="text-sm text-gray-400">
                                    (
                                    {product.reviewCount ||
                                        0}{" "}
                                    reviews)
                                </span>

                                <span className="text-gray-300">
                                    •
                                </span>

                                <span
                                    className={`text-sm font-medium ${product.stock === 0
                                        ? "text-red-500"
                                        : product.stock <=
                                            5
                                            ? "text-orange-500"
                                            : "text-green-600"
                                        }`}
                                >
                                    {product.stock === 0
                                        ? "Out of stock"
                                        : product.stock <= 5
                                            ? `Only ${product.stock} left`
                                            : "In stock"}
                                </span>
                            </div>

                            {/* PRICE */}
                            <div className="mt-6 flex flex-wrap items-end gap-3">
                                <span className="text-3xl font-bold text-[#024E82]">
                                    ₹
                                    {sellingPrice.toLocaleString(
                                        "en-IN"
                                    )}
                                </span>

                                {hasDiscount && (
                                    <>
                                        <span className="pb-1 text-base text-gray-400 line-through">
                                            ₹
                                            {regularPrice.toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>

                                        <span className="mb-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-600">
                                            Save{" "}
                                            {
                                                discountPercentage
                                            }
                                            %
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* DESCRIPTION */}
                            {product.description && (
                                <p className="mt-6 text-sm leading-7 text-gray-500">
                                    {product.description}
                                </p>
                            )}

                            {/* ATTRIBUTES */}
                            <div className="mt-7 grid grid-cols-2 gap-3">
                                {product.material && (
                                    <div className="rounded-lg bg-[#F7F9FB] p-3">
                                        <p className="text-[10px] uppercase tracking-wide text-gray-400">
                                            Material
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-[#2b3e48]">
                                            {product.material}
                                        </p>
                                    </div>
                                )}

                                {product.color && (
                                    <div className="rounded-lg bg-[#F7F9FB] p-3">
                                        <p className="text-[10px] uppercase tracking-wide text-gray-400">
                                            Color
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-[#2b3e48]">
                                            {product.color}
                                        </p>
                                    </div>
                                )}

                                {product.width && (
                                    <div className="rounded-lg bg-[#F7F9FB] p-3">
                                        <p className="text-[10px] uppercase tracking-wide text-gray-400">
                                            Width
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-[#2b3e48]">
                                            {product.width}
                                        </p>
                                    </div>
                                )}

                                {product.height && (
                                    <div className="rounded-lg bg-[#F7F9FB] p-3">
                                        <p className="text-[10px] uppercase tracking-wide text-gray-400">
                                            Height
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-[#2b3e48]">
                                            {product.height}
                                        </p>
                                    </div>
                                )}

                                {product.depth && (
                                    <div className="rounded-lg bg-[#F7F9FB] p-3">
                                        <p className="text-[10px] uppercase tracking-wide text-gray-400">
                                            Depth
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-[#2b3e48]">
                                            {product.depth}
                                        </p>
                                    </div>
                                )}

                                {product.sku && (
                                    <div className="rounded-lg bg-[#F7F9FB] p-3">
                                        <p className="text-[10px] uppercase tracking-wide text-gray-400">
                                            SKU
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-[#2b3e48]">
                                            {product.sku}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* QUANTITY */}
                            {product.stock > 0 && (
                                <div className="mt-7">
                                    <p className="mb-2 text-xs font-semibold text-[#344852]">
                                        Quantity
                                    </p>

                                    <div className="flex h-11 w-fit items-center overflow-hidden rounded-md border border-[#dfe5e8]">
                                        <button
                                            type="button"
                                            disabled={
                                                quantity <= 1
                                            }
                                            onClick={() =>
                                                setQuantity(
                                                    (prev) =>
                                                        Math.max(
                                                            1,
                                                            prev - 1
                                                        )
                                                )
                                            }
                                            className="flex h-full w-11 items-center justify-center text-gray-500 disabled:opacity-30"
                                        >
                                            <Minus
                                                size={15}
                                            />
                                        </button>

                                        <span className="flex h-full min-w-12 items-center justify-center border-x border-[#dfe5e8] text-sm font-semibold">
                                            {quantity}
                                        </span>

                                        <button
                                            type="button"
                                            disabled={
                                                quantity >=
                                                product.stock
                                            }
                                            onClick={() =>
                                                setQuantity(
                                                    (prev) =>
                                                        Math.min(
                                                            product.stock,
                                                            prev + 1
                                                        )
                                                )
                                            }
                                            className="flex h-full w-11 items-center justify-center text-gray-500 disabled:opacity-30"
                                        >
                                            <Plus
                                                size={15}
                                            />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ACTIONS */}
                            <div className="mt-7 flex gap-3">
                                <button
                                    type="button"
                                    onClick={
                                        handleAddToCart
                                    }
                                    disabled={
                                        product.stock ===
                                        0 || adding
                                    }
                                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-[#024E82] px-5 text-sm font-medium text-white transition hover:bg-[#013d67] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <ShoppingBag
                                        size={17}
                                    />

                                    {product.stock === 0
                                        ? "Out of Stock"
                                        : adding
                                            ? "Adding..."
                                            : "Add to Cart"}
                                </button>

                                <button
                                    type="button"
                                    disabled={
                                        wishlistLoading
                                    }
                                    onClick={
                                        handleWishlist
                                    }
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md border transition ${wishlisted
                                        ? "border-[#024E82] bg-[#edf6fa] text-[#024E82]"
                                        : "border-[#dfe5e8] text-gray-500 hover:border-[#024E82] hover:text-[#024E82]"
                                        }`}
                                    aria-label="Wishlist"
                                >
                                    <Heart
                                        size={19}
                                        fill={
                                            wishlisted
                                                ? "currentColor"
                                                : "none"
                                        }
                                    />
                                </button>
                            </div>

                            <div className="mt-6 border-t border-[#edf0f2] pt-5">
                                <p className="text-xs leading-5 text-gray-400">
                                    Factory-direct FTC
                                    furniture with secure
                                    checkout and inventory
                                    controlled from our
                                    backend.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <ProductReviews
                    productId={product.id}
                />

                <RelatedProducts
                    productId={product.id}
                />
            </main>

            <Footer />
        </>
    );
}