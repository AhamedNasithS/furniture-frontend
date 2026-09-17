"use client";
import { Suspense } from "react";
import Link from "next/link";
import {
    ChevronRight,
    Grid2X2,
    List,
    SlidersHorizontal,
    ChevronLeft,
    X,
    Filter
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import Header from "@/components/customer/Header";
import Footer from "@/components/customer/Footer";
import axios from "axios";
import { useEffect, useState } from "react";
import FilterSidebar from "@/components/customer/shop/FilterSidebar";
import ProductGrid from "@/components/customer/shop/ProductGrid";
import {
    useRouter,
    useSearchParams,
} from "next/navigation";

function ShopContent() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const [categories, setCategories] =
        useState([]);

    const [filters, setFilters] = useState({
        categoryId:
            searchParams.get("categoryId") || "",
        minPrice: "",
        maxPrice: "",
        material: "",
        color: "",
        sort: "newest",
        page: 1,
        limit: 12,
    });

    const handlePageChange = (page) => {
        setFilters((prev) => ({
            ...prev,
            page,
        }));

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const getProducts = async () => {
        try {
            setLoading(true);

            const params = {};

            if (filters.categoryId) {
                params.categoryId = filters.categoryId;
            }

            if (filters.minPrice) {
                params.minPrice = filters.minPrice;
            }

            if (filters.maxPrice) {
                params.maxPrice = filters.maxPrice;
            }

            if (filters.material) {
                params.material = filters.material;
            }

            if (filters.color) {
                params.color = filters.color;
            }

            params.sort = filters.sort;
            params.page = filters.page;
            params.limit = filters.limit;

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/products`,
                {
                    params,
                }
            );

            setProducts(response.data?.data || []);
            setPagination(
                response.data?.pagination || null
            );
        } catch (error) {
            console.log(
                "Shop products error:",
                error.response?.data || error.message
            );

            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickCategory = (
        categoryId
    ) => {
        setFilters((prev) => ({
            ...prev,
            categoryId:
                String(categoryId),
            page: 1,
        }));

        router.push(
            `/shop?categoryId=${categoryId}`
        );
    };

    const handleAllFurniture = () => {
        setFilters((prev) => ({
            ...prev,
            categoryId: "",
            page: 1,
        }));

        router.push("/shop");
    };

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response =
                    await axios.get(
                        `${process.env.NEXT_PUBLIC_API_URL}/categories`
                    );

                const data =
                    response.data?.data || [];

                setCategories(
                    data.filter(
                        (item) =>
                            item.status === "active" ||
                            !item.status
                    )
                );
            } catch (error) {
                console.log(
                    "Shop categories error:",
                    error.response?.data ||
                    error.message
                );
            }
        };

        getCategories();
    }, []);

    useEffect(() => {
        const categoryId =
            searchParams.get("categoryId") || "";

        setFilters((prev) => {
            if (
                String(prev.categoryId) ===
                String(categoryId)
            ) {
                return prev;
            }

            return {
                ...prev,
                categoryId,
                page: 1,
            };
        });
    }, [searchParams]);

    useEffect(() => {
        getProducts();
    }, [filters]);

    return (
        <>
            <Header />

            <main className="bg-[#F7F9FB]">

                {/* TOP INTRO */}
                <section className="border-b border-[#e8edf0] bg-white">
                    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">

                        {/* BREADCRUMB */}
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Link
                                href="/"
                                className="transition hover:text-[#024E82]"
                            >
                                Home
                            </Link>

                            <ChevronRight size={13} />

                            <span>
                                Catalog
                            </span>

                            <ChevronRight size={13} />

                            <span className="text-[#024E82]">
                                All Furniture
                            </span>
                        </div>

                        {/* TITLE */}
                        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
                                    FTC Factory-Direct Collection
                                </p>

                                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#172B38] sm:text-4xl">
                                    Shop Furniture
                                </h1>

                                <p className="mt-3 max-w-[700px] text-sm leading-6 text-gray-500">
                                    Explore factory-direct furniture crafted
                                    for contemporary homes, thoughtful
                                    interiors and everyday living.
                                </p>
                            </div>

                            {/* SMALL TRUST TAGS */}
                            <div className="flex flex-wrap gap-2">
                                <span className="rounded-full border border-[#dfe9ee] bg-[#f8fbfc] px-3 py-2 text-xs font-medium text-[#45606f]">
                                    Factory-Direct Pricing
                                </span>

                                <span className="rounded-full border border-[#dfe9ee] bg-[#f8fbfc] px-3 py-2 text-xs font-medium text-[#45606f]">
                                    FTC Quality Assured
                                </span>
                            </div>
                        </div>

                        {/* QUICK CATEGORY TABS */}
                        {/* QUICK CATEGORY TABS */}
                        <div className="mt-7 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">

                            {/* ALL FURNITURE */}
                            <motion.button
                                initial={{
                                    opacity: 0,
                                    y: 10,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                type="button"
                                onClick={
                                    handleAllFurniture
                                }
                                className={`rounded-lg border px-4 py-3 text-left text-xs font-medium transition ${!filters.categoryId
                                        ? "border-[#024E82] bg-[#024E82] text-white"
                                        : "border-[#e2e8eb] bg-white text-[#3f525d] hover:border-[#024E82] hover:text-[#024E82]"
                                    }`}
                            >
                                All Furniture
                            </motion.button>

                            {/* REAL BACKEND CATEGORIES */}
                            {categories
                                .slice(0, 5)
                                .map(
                                    (
                                        category,
                                        index
                                    ) => {
                                        const isActive =
                                            String(
                                                filters.categoryId ||
                                                ""
                                            ) ===
                                            String(
                                                category.id
                                            );

                                        return (
                                            <motion.button
                                                key={
                                                    category.id
                                                }
                                                initial={{
                                                    opacity: 0,
                                                    y: 10,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                transition={{
                                                    delay:
                                                        (index +
                                                            1) *
                                                        0.04,
                                                }}
                                                type="button"
                                                onClick={() =>
                                                    handleQuickCategory(
                                                        category.id
                                                    )
                                                }
                                                className={`rounded-lg border px-4 py-3 text-left text-xs font-medium transition ${isActive
                                                        ? "border-[#024E82] bg-[#024E82] text-white"
                                                        : "border-[#e2e8eb] bg-white text-[#3f525d] hover:border-[#024E82] hover:text-[#024E82]"
                                                    }`}
                                            >
                                                {
                                                    category.name
                                                }
                                            </motion.button>
                                        );
                                    }
                                )}
                        </div>
                    </div>
                </section>

                {/* SHOP MAIN AREA */}
                <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
                    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">

                        {/* FILTER SIDEBAR PLACEHOLDER */}
                        <div className="hidden lg:block">
                            <FilterSidebar
                                filters={filters}
                                setFilters={setFilters}
                            />
                        </div>

                        {/* RIGHT CONTENT */}
                        <div>
                            {/* TOOLBAR */}
                            <div className="flex flex-col gap-3 rounded-xl border border-[#e5eaed] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

                                {/* PRODUCT COUNT */}
                                <p className="text-sm text-gray-500">
                                    {loading
                                        ? "Loading furniture..."
                                        : `${pagination?.totalItems || 0} products found`}
                                </p>

                                {/* RIGHT CONTROLS */}
                                <div className="flex flex-wrap items-center gap-2">

                                    {/* MOBILE FILTER */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMobileFilterOpen(true)
                                        }
                                        className="flex h-9 items-center gap-2 rounded-md border border-[#dfe4e7] bg-white px-3 text-xs font-medium text-[#344852] lg:hidden"
                                    >
                                        <Filter
                                            size={15}
                                            strokeWidth={1.8}
                                        />

                                        Filters
                                    </button>

                                    {/* SORT */}
                                    <select
                                        value={filters.sort}
                                        onChange={(e) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                sort: e.target.value,
                                                page: 1,
                                            }))
                                        }
                                        className="h-9 rounded-md border border-[#dfe4e7] bg-white px-3 text-xs text-[#3c4e58] outline-none"
                                    >
                                        <option value="newest">
                                            Newest
                                        </option>

                                        <option value="price_asc">
                                            Price: Low to High
                                        </option>

                                        <option value="price_desc">
                                            Price: High to Low
                                        </option>

                                        <option value="name_asc">
                                            Name: A-Z
                                        </option>
                                    </select>

                                    {/* GRID / LIST */}
                                    <div className="flex overflow-hidden rounded-md border border-[#e0e5e8]">
                                        <button
                                            type="button"
                                            className="flex h-9 w-9 items-center justify-center bg-[#edf5f8] text-[#024E82]"
                                        >
                                            <Grid2X2 size={16} />
                                        </button>

                                        <button
                                            type="button"
                                            className="flex h-9 w-9 items-center justify-center text-gray-400"
                                        >
                                            <List size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5">
                                <ProductGrid
                                    products={products}
                                    loading={loading}
                                />
                                {pagination &&
                                    pagination.totalPages > 1 && (
                                        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">

                                            {/* PREVIOUS */}
                                            <button
                                                type="button"
                                                disabled={
                                                    pagination.currentPage === 1
                                                }
                                                onClick={() =>
                                                    handlePageChange(
                                                        pagination.currentPage - 1
                                                    )
                                                }
                                                className="flex h-10 items-center gap-1 rounded-md border border-[#dfe5e8] bg-white px-3 text-sm text-[#42545d] transition hover:border-[#024E82] hover:text-[#024E82] disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                <ChevronLeft size={16} />

                                                Previous
                                            </button>

                                            {/* PAGE NUMBERS */}
                                            {Array.from({
                                                length:
                                                    pagination.totalPages,
                                            }).map((_, index) => {
                                                const pageNumber =
                                                    index + 1;

                                                return (
                                                    <button
                                                        key={pageNumber}
                                                        type="button"
                                                        onClick={() =>
                                                            handlePageChange(
                                                                pageNumber
                                                            )
                                                        }
                                                        className={`flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm font-medium transition ${pagination.currentPage ===
                                                            pageNumber
                                                            ? "border-[#024E82] bg-[#024E82] text-white"
                                                            : "border-[#dfe5e8] bg-white text-[#42545d] hover:border-[#024E82] hover:text-[#024E82]"
                                                            }`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                );
                                            })}

                                            {/* NEXT */}
                                            <button
                                                type="button"
                                                disabled={
                                                    pagination.currentPage ===
                                                    pagination.totalPages
                                                }
                                                onClick={() =>
                                                    handlePageChange(
                                                        pagination.currentPage + 1
                                                    )
                                                }
                                                className="flex h-10 items-center gap-1 rounded-md border border-[#dfe5e8] bg-white px-3 text-sm text-[#42545d] transition hover:border-[#024E82] hover:text-[#024E82] disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Next

                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <AnimatePresence>
                {mobileFilterOpen && (
                    <>
                        {/* BACKDROP */}
                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                            onClick={() =>
                                setMobileFilterOpen(false)
                            }
                            className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-[2px] lg:hidden"
                        />

                        {/* DRAWER */}
                        <motion.div
                            initial={{
                                x: "-100%",
                            }}
                            animate={{
                                x: 0,
                            }}
                            exit={{
                                x: "-100%",
                            }}
                            transition={{
                                duration: 0.28,
                                ease: "easeOut",
                            }}
                            className="fixed left-0 top-0 z-[90] h-full w-[88%] max-w-[360px] overflow-y-auto bg-[#F7F9FB] shadow-xl lg:hidden"
                        >
                            {/* DRAWER HEADER */}
                            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e5eaed] bg-white px-5 py-4">
                                <div className="flex items-center gap-2">
                                    <Filter
                                        size={18}
                                        className="text-[#024E82]"
                                    />

                                    <h2 className="text-base font-semibold text-[#243640]">
                                        Filters
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setMobileFilterOpen(false)
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* SAME FILTER COMPONENT */}
                            <div className="p-4">
                                <FilterSidebar
                                    filters={filters}
                                    setFilters={setFilters}
                                    className="border-0"
                                />
                            </div>

                            {/* APPLY BUTTON */}
                            <div className="sticky bottom-0 border-t border-[#e5eaed] bg-white p-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setMobileFilterOpen(false)
                                    }
                                    className="h-11 w-full rounded-md bg-[#024E82] text-sm font-medium text-white transition hover:bg-[#013d67]"
                                >
                                    View{" "}
                                    {pagination?.totalItems || 0}{" "}
                                    Products
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </>
    );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}