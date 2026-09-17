"use client";

import axios from "axios";
import {
    useEffect,
    useState,
} from "react";
import { useRouter } from "next/navigation";

import {
    Search,
    Plus,
    Pencil,
    Package,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import useAuthStore from "@/store/authStore";
import Image from "next/image";

export default function AdminProductsPage() {
    const router = useRouter();

    const token = useAuthStore(
        (state) => state.token
    );

    const [products, setProducts] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [pagination, setPagination] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [searchInput, setSearchInput] =
        useState("");

    const [filters, setFilters] =
        useState({
            search: "",
            categoryId: "",
            status: "",
            page: 1,
            limit: 20,
        });

    /* -----------------------------
       CATEGORIES
    ----------------------------- */

    useEffect(() => {
        const getCategories =
            async () => {
                try {
                    const response =
                        await axios.get(
                            `${process.env.NEXT_PUBLIC_API_URL}/categories`
                        );

                    setCategories(
                        response.data
                            ?.data || []
                    );
                } catch (error) {
                    console.log(
                        "Admin categories error:",
                        error.response
                            ?.data ||
                            error.message
                    );
                }
            };

        getCategories();
    }, []);

    /* -----------------------------
       PRODUCTS
    ----------------------------- */

    useEffect(() => {
        if (!token) return;

        const getProducts =
            async () => {
                try {
                    setLoading(true);

                    const params = {
                        page:
                            filters.page,
                        limit:
                            filters.limit,
                    };

                    if (
                        filters.search
                    ) {
                        params.search =
                            filters.search;
                    }

                    if (
                        filters.categoryId
                    ) {
                        params.categoryId =
                            filters.categoryId;
                    }

                    if (
                        filters.status
                    ) {
                        params.status =
                            filters.status;
                    }

                    const response =
                        await axios.get(
                            `${process.env.NEXT_PUBLIC_API_URL}/admin/products`,
                            {
                                params,

                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                    setProducts(
                        response.data
                            ?.data || []
                    );

                    setPagination(
                        response.data
                            ?.pagination ||
                            null
                    );
                } catch (error) {
                    console.log(
                        "Admin products error:",
                        error.response
                            ?.data ||
                            error.message
                    );

                    setProducts([]);
                } finally {
                    setLoading(
                        false
                    );
                }
            };

        getProducts();
    }, [token, filters]);

    /* -----------------------------
       SEARCH
    ----------------------------- */

    const handleSearch = (e) => {
        e.preventDefault();

        setFilters((prev) => ({
            ...prev,
            search:
                searchInput.trim(),
            page: 1,
        }));
    };

    const clearSearch = () => {
        setSearchInput("");

        setFilters((prev) => ({
            ...prev,
            search: "",
            page: 1,
        }));
    };

    /* -----------------------------
       IMAGE
    ----------------------------- */

    const getPrimaryImage = (
        images = []
    ) => {
        if (!images.length) {
            return null;
        }

        const primary =
            images.find(
                (image) =>
                    image.isPrimary
            );

        return (
            primary?.imageUrl ||
            images[0]?.imageUrl ||
            null
        );
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">

            {/* PAGE HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
                        Catalog
                    </p>

                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#172B38] sm:text-3xl">
                        Products
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Manage your furniture
                        catalog, pricing and
                        availability.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            "/admin/products/new"
                        )
                    }
                    className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#024E82] px-4 text-sm font-medium text-white transition hover:bg-[#013D67]"
                >
                    <Plus size={17} />

                    Add Product
                </button>
            </div>

            {/* MAIN CARD */}
            <div className="mt-7 overflow-hidden rounded-xl border border-[#E4E9EC] bg-white">

                {/* FILTER BAR */}
                <div className="border-b border-[#E8ECEF] p-4">

                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

                        {/* SEARCH */}
                        <form
                            onSubmit={
                                handleSearch
                            }
                            className="flex w-full max-w-[420px]"
                        >
                            <div className="relative flex-1">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    value={
                                        searchInput
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setSearchInput(
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Search name or SKU..."
                                    className="h-10 w-full rounded-l-lg border border-r-0 border-[#DDE3E7] bg-white pl-9 pr-3 text-sm text-[#344852] outline-none transition focus:border-[#024E82]"
                                />
                            </div>

                            <button
                                type="submit"
                                className="h-10 rounded-r-lg bg-[#024E82] px-4 text-sm font-medium text-white"
                            >
                                Search
                            </button>
                        </form>

                        {/* FILTERS */}
                        <div className="flex flex-wrap gap-2">

                            {/* CATEGORY */}
                            <select
                                value={
                                    filters.categoryId
                                }
                                onChange={(e) =>
                                    setFilters(
                                        (
                                            prev
                                        ) => ({
                                            ...prev,

                                            categoryId:
                                                e
                                                    .target
                                                    .value,

                                            page: 1,
                                        })
                                    )
                                }
                                className="h-10 rounded-lg border border-[#DDE3E7] bg-white px-3 text-sm text-[#52636C] outline-none focus:border-[#024E82]"
                            >
                                <option value="">
                                    All Categories
                                </option>

                                {categories.map(
                                    (
                                        category
                                    ) => (
                                        <option
                                            key={
                                                category.id
                                            }
                                            value={
                                                category.id
                                            }
                                        >
                                            {
                                                category.name
                                            }
                                        </option>
                                    )
                                )}
                            </select>

                            {/* STATUS */}
                            <select
                                value={
                                    filters.status
                                }
                                onChange={(e) =>
                                    setFilters(
                                        (
                                            prev
                                        ) => ({
                                            ...prev,

                                            status:
                                                e
                                                    .target
                                                    .value,

                                            page: 1,
                                        })
                                    )
                                }
                                className="h-10 rounded-lg border border-[#DDE3E7] bg-white px-3 text-sm text-[#52636C] outline-none focus:border-[#024E82]"
                            >
                                <option value="">
                                    All Status
                                </option>

                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>
                            </select>

                            {(filters.search ||
                                filters.categoryId ||
                                filters.status) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        clearSearch();

                                        setFilters(
                                            (
                                                prev
                                            ) => ({
                                                ...prev,

                                                categoryId:
                                                    "",

                                                status:
                                                    "",

                                                search:
                                                    "",

                                                page: 1,
                                            })
                                        );
                                    }}
                                    className="h-10 rounded-lg border border-[#DDE3E7] px-3 text-sm text-gray-500 transition hover:border-[#024E82] hover:text-[#024E82]"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* RESULT COUNT */}
                <div className="flex items-center justify-between border-b border-[#EEF1F3] bg-[#FAFBFC] px-5 py-3">
                    <p className="text-xs text-gray-500">
                        {loading
                            ? "Loading products..."
                            : `${
                                  pagination
                                      ?.totalItems ||
                                  0
                              } products`}
                    </p>

                    <p className="hidden text-xs text-gray-400 sm:block">
                        FTC product catalog
                    </p>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="min-w-[900px] w-full">

                        <thead>
                            <tr className="border-b border-[#E8ECEF] text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                <th className="px-5 py-3">
                                    Product
                                </th>

                                <th className="px-5 py-3">
                                    SKU
                                </th>

                                <th className="px-5 py-3">
                                    Category
                                </th>

                                <th className="px-5 py-3">
                                    Price
                                </th>

                                <th className="px-5 py-3">
                                    Stock
                                </th>

                                <th className="px-5 py-3">
                                    Status
                                </th>

                                <th className="px-5 py-3 text-right">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                Array.from({
                                    length: 6,
                                }).map(
                                    (
                                        _,
                                        index
                                    ) => (
                                        <tr
                                            key={
                                                index
                                            }
                                            className="border-b border-[#F0F2F4]"
                                        >
                                            <td
                                                colSpan={
                                                    7
                                                }
                                                className="px-5 py-4"
                                            >
                                                <div className="h-11 animate-pulse rounded-lg bg-gray-100" />
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : products.length ===
                              0 ? (
                                <tr>
                                    <td
                                        colSpan={
                                            7
                                        }
                                        className="px-5 py-16 text-center"
                                    >
                                        <Package
                                            size={
                                                32
                                            }
                                            className="mx-auto text-gray-300"
                                        />

                                        <p className="mt-3 text-sm font-medium text-gray-500">
                                            No products
                                            found
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Try changing
                                            your filters.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                products.map(
                                    (
                                        product
                                    ) => {
                                        const image =
                                            getPrimaryImage(
                                                product.images
                                            );

                                        return (
                                            <tr
                                                key={
                                                    product.id
                                                }
                                                className="border-b border-[#F0F2F4] text-sm transition last:border-0 hover:bg-[#FAFBFC]"
                                            >

                                                {/* PRODUCT */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F3F5F6]">
                                                            {image ? (
                                                                <Image
                                                                    src={
                                                                        image
                                                                    }
                                                                    alt={
                                                                        product.name
                                                                    }
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <Package
                                                                    size={
                                                                        18
                                                                    }
                                                                    className="text-gray-300"
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="max-w-[220px] truncate font-medium text-[#243640]">
                                                                {
                                                                    product.name
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-400">
                                                                ID #
                                                                {
                                                                    product.id
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* SKU */}
                                                <td className="px-5 py-4 text-gray-500">
                                                    {
                                                        product.sku
                                                    }
                                                </td>

                                                {/* CATEGORY */}
                                                <td className="px-5 py-4 text-gray-500">
                                                    {product
                                                        .category
                                                        ?.name ||
                                                        "—"}
                                                </td>

                                                {/* PRICE */}
                                                <td className="whitespace-nowrap px-5 py-4 font-medium text-[#344852]">
                                                    {new Intl.NumberFormat(
                                                        "en-IN",
                                                        {
                                                            style:
                                                                "currency",

                                                            currency:
                                                                "INR",

                                                            maximumFractionDigits: 0,
                                                        }
                                                    ).format(
                                                        Number(
                                                            product.price
                                                        ) ||
                                                            0
                                                    )}
                                                </td>

                                                {/* STOCK */}
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`text-sm font-medium ${
                                                            Number(
                                                                product.stock
                                                            ) ===
                                                            0
                                                                ? "text-red-500"
                                                                : Number(
                                                                        product.stock
                                                                    ) <=
                                                                    5
                                                                  ? "text-amber-500"
                                                                  : "text-[#52636C]"
                                                        }`}
                                                    >
                                                        {
                                                            product.stock
                                                        }
                                                    </span>
                                                </td>

                                                {/* STATUS */}
                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                                                            product.status ===
                                                            "active"
                                                                ? "bg-green-50 text-green-600"
                                                                : "bg-gray-100 text-gray-500"
                                                        }`}
                                                    >
                                                        {
                                                            product.status
                                                        }
                                                    </span>
                                                </td>

                                                {/* ACTION */}
                                                <td className="px-5 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            router.push(
                                                                `/admin/products/${product.id}/edit`
                                                            )
                                                        }
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#DDE3E7] text-gray-500 transition hover:border-[#024E82] hover:text-[#024E82]"
                                                        aria-label="Edit product"
                                                    >
                                                        <Pencil
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {pagination &&
                    pagination.totalPages >
                        1 && (
                        <div className="flex flex-col gap-3 border-t border-[#E8ECEF] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                            <p className="text-xs text-gray-400">
                                Page{" "}
                                {
                                    pagination.currentPage
                                }{" "}
                                of{" "}
                                {
                                    pagination.totalPages
                                }
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={
                                        pagination.currentPage ===
                                        1
                                    }
                                    onClick={() =>
                                        setFilters(
                                            (
                                                prev
                                            ) => ({
                                                ...prev,

                                                page:
                                                    prev.page -
                                                    1,
                                            })
                                        )
                                    }
                                    className="flex h-9 items-center gap-1 rounded-lg border border-[#DDE3E7] px-3 text-xs font-medium text-[#52636C] transition hover:border-[#024E82] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft
                                        size={
                                            15
                                        }
                                    />
                                    Previous
                                </button>

                                <button
                                    type="button"
                                    disabled={
                                        pagination.currentPage ===
                                        pagination.totalPages
                                    }
                                    onClick={() =>
                                        setFilters(
                                            (
                                                prev
                                            ) => ({
                                                ...prev,

                                                page:
                                                    prev.page +
                                                    1,
                                            })
                                        )
                                    }
                                    className="flex h-9 items-center gap-1 rounded-lg border border-[#DDE3E7] px-3 text-xs font-medium text-[#52636C] transition hover:border-[#024E82] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next

                                    <ChevronRight
                                        size={
                                            15
                                        }
                                    />
                                </button>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
}