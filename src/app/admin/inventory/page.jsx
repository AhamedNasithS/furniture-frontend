"use client";

import axios from "axios";
import {
    useEffect,
    useState,
} from "react";

import {
    Search,
    Package,
    Save,
    Eye,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import {
    useRouter,
} from "next/navigation";

import useAuthStore from "@/store/authStore";
import Image from "next/image";

function StockBadge({ status }) {
    const config = {
        in_stock: {
            label: "In Stock",
            className:
                "bg-green-50 text-green-600",
        },

        low_stock: {
            label: "Low Stock",
            className:
                "bg-amber-50 text-amber-600",
        },

        out_of_stock: {
            label: "Out of Stock",
            className:
                "bg-red-50 text-red-600",
        },
    };

    const current =
        config[status] || {
            label: status,
            className:
                "bg-gray-100 text-gray-500",
        };

    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${current.className}`}
        >
            {current.label}
        </span>
    );
}

export default function AdminInventoryPage() {
    const router = useRouter();

    const token = useAuthStore(
        (state) => state.token
    );

    const [products, setProducts] =
        useState([]);

    const [pagination, setPagination] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [searchInput, setSearchInput] =
        useState("");

    const [stockValues, setStockValues] =
        useState({});

    const [updatingId, setUpdatingId] =
        useState(null);

    const [filters, setFilters] =
        useState({
            search: "",
            stockStatus: "",
            page: 1,
            limit: 20,
        });

    /* -------------------------
       GET INVENTORY
    ------------------------- */

    useEffect(() => {
        if (!token) return;

        const getInventory =
            async () => {
                try {
                    setLoading(true);
                    setError("");

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
                        filters.stockStatus
                    ) {
                        params.stockStatus =
                            filters.stockStatus;
                    }

                    const response =
                        await axios.get(
                            `${process.env.NEXT_PUBLIC_API_URL}/admin/inventory`,
                            {
                                params,

                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                    const data =
                        response.data
                            ?.data || [];

                    setProducts(
                        data
                    );

                    setPagination(
                        response.data
                            ?.pagination ||
                            null
                    );

                    const values = {};

                    data.forEach(
                        (product) => {
                            values[
                                product.id
                            ] =
                                product.stock;
                        }
                    );

                    setStockValues(
                        values
                    );
                } catch (error) {
                    console.log(
                        "Inventory error:",
                        error.response
                            ?.data ||
                            error.message
                    );

                    setProducts([]);

                    setError(
                        error.response
                            ?.data
                            ?.message ||
                            "Unable to load inventory."
                    );
                } finally {
                    setLoading(
                        false
                    );
                }
            };

        getInventory();
    }, [token, filters]);

    /* -------------------------
       SEARCH
    ------------------------- */

    const handleSearch = (
        e
    ) => {
        e.preventDefault();

        setFilters((prev) => ({
            ...prev,

            search:
                searchInput.trim(),

            page: 1,
        }));
    };

    const clearFilters = () => {
        setSearchInput("");

        setFilters({
            search: "",
            stockStatus: "",
            page: 1,
            limit: 20,
        });
    };

    /* -------------------------
       STOCK INPUT
    ------------------------- */

    const handleStockChange = (
        productId,
        value
    ) => {
        setStockValues(
            (prev) => ({
                ...prev,
                [productId]:
                    value,
            })
        );
    };

    /* -------------------------
       UPDATE STOCK
    ------------------------- */

    const updateStock =
        async (productId) => {
            if (!token) return;

            const stock = Number(
                stockValues[
                    productId
                ]
            );

            if (
                !Number.isInteger(
                    stock
                ) ||
                stock < 0
            ) {
                setError(
                    "Stock must be a non-negative whole number."
                );

                return;
            }

            try {
                setUpdatingId(
                    productId
                );

                setError("");

                const response =
                    await axios.patch(
                        `${process.env.NEXT_PUBLIC_API_URL}/admin/inventory/${productId}/stock`,
                        {
                            stock,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                const updated =
                    response.data
                        ?.data;

                if (!updated) {
                    return;
                }

                setProducts(
                    (prev) =>
                        prev.map(
                            (
                                product
                            ) =>
                                product.id ===
                                productId
                                    ? {
                                          ...product,

                                          stock:
                                              updated.stock,

                                          stockStatus:
                                              updated.stockStatus,
                                      }
                                    : product
                        )
                );

                setStockValues(
                    (prev) => ({
                        ...prev,

                        [productId]:
                            updated.stock,
                    })
                );
            } catch (error) {
                console.log(
                    "Update stock error:",
                    error.response
                        ?.data ||
                        error.message
                );

                setError(
                    error.response
                        ?.data
                        ?.message ||
                        "Unable to update stock."
                );
            } finally {
                setUpdatingId(
                    null
                );
            }
        };

    /* -------------------------
       PRODUCT IMAGE
    ------------------------- */

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

    const hasFilters =
        filters.search ||
        filters.stockStatus;

    return (
        <div className="p-4 sm:p-6 lg:p-8">

            {/* HEADER */}
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
                    Inventory
                </p>

                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#172B38] sm:text-3xl">
                    Stock Management
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Monitor product
                    availability and update
                    stock quantities.
                </p>
            </div>

            {/* ERROR */}
            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* MAIN CARD */}
            <div className="mt-7 overflow-hidden rounded-xl border border-[#E4E9EC] bg-white">

                {/* FILTERS */}
                <div className="border-b border-[#E8ECEF] p-4">

                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                        {/* SEARCH */}
                        <form
                            onSubmit={
                                handleSearch
                            }
                            className="flex w-full max-w-[430px]"
                        >

                            <div className="relative flex-1">

                                <Search
                                    size={
                                        16
                                    }
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
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
                                    placeholder="Search product or SKU..."
                                    className="h-10 w-full rounded-l-lg border border-r-0 border-[#DDE3E7] pl-9 pr-3 text-sm text-[#344852] outline-none focus:border-[#024E82]"
                                />
                            </div>

                            <button
                                type="submit"
                                className="h-10 rounded-r-lg bg-[#024E82] px-4 text-sm font-medium text-white"
                            >
                                Search
                            </button>
                        </form>

                        <div className="flex flex-wrap gap-2">

                            {/* STOCK FILTER */}
                            <select
                                value={
                                    filters.stockStatus
                                }
                                onChange={(
                                    e
                                ) =>
                                    setFilters(
                                        (
                                            prev
                                        ) => ({
                                            ...prev,

                                            stockStatus:
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
                                    All Stock
                                </option>

                                <option value="in">
                                    In Stock
                                </option>

                                <option value="low">
                                    Low Stock
                                </option>

                                <option value="out">
                                    Out of Stock
                                </option>
                            </select>

                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={
                                        clearFilters
                                    }
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
                            ? "Loading inventory..."
                            : `${
                                  pagination
                                      ?.totalItems ||
                                  0
                              } products`}
                    </p>

                    <p className="hidden text-xs text-gray-400 sm:block">
                        Lowest stock shown first
                    </p>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">

                    <table className="min-w-[950px] w-full">

                        <thead>
                            <tr className="border-b border-[#EEF1F3] text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">

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
                                    Stock Status
                                </th>

                                <th className="px-5 py-3">
                                    Quantity
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
                                                    6
                                                }
                                                className="px-5 py-4"
                                            >
                                                <div className="h-12 animate-pulse rounded-lg bg-gray-100" />
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : products.length ===
                              0 ? (

                                <tr>
                                    <td
                                        colSpan={
                                            6
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
                                            No inventory
                                            found
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

                                        const changed =
                                            Number(
                                                stockValues[
                                                    product
                                                        .id
                                                ]
                                            ) !==
                                            Number(
                                                product.stock
                                            );

                                        return (
                                            <tr
                                                key={
                                                    product.id
                                                }
                                                className="border-b border-[#F0F2F4] text-sm last:border-0 hover:bg-[#FAFBFC]"
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
                                                                Product #
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

                                                {/* STATUS */}
                                                <td className="px-5 py-4">
                                                    <StockBadge
                                                        status={
                                                            product.stockStatus
                                                        }
                                                    />
                                                </td>

                                                {/* STOCK */}
                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-2">

                                                        <input
                                                            type="number"
                                                            min={
                                                                0
                                                            }
                                                            step={
                                                                1
                                                            }
                                                            value={
                                                                stockValues[
                                                                    product
                                                                        .id
                                                                ] ??
                                                                ""
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                handleStockChange(
                                                                    product.id,
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            className="h-9 w-20 rounded-lg border border-[#DDE3E7] px-3 text-sm text-[#344852] outline-none focus:border-[#024E82]"
                                                        />

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                !changed ||
                                                                updatingId ===
                                                                    product.id
                                                            }
                                                            onClick={() =>
                                                                updateStock(
                                                                    product.id
                                                                )
                                                            }
                                                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#DDE3E7] px-3 text-xs font-medium text-[#024E82] transition hover:border-[#024E82] disabled:cursor-not-allowed disabled:opacity-40"
                                                        >
                                                            <Save
                                                                size={
                                                                    14
                                                                }
                                                            />

                                                            {updatingId ===
                                                            product.id
                                                                ? "Saving..."
                                                                : "Save"}
                                                        </button>
                                                    </div>
                                                </td>

                                                {/* ACTION */}
                                                <td className="px-5 py-4 text-right">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            router.push(
                                                                `/admin/inventory/${product.id}`
                                                            )
                                                        }
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#DDE3E7] text-gray-500 transition hover:border-[#024E82] hover:text-[#024E82]"
                                                        aria-label="View inventory item"
                                                    >
                                                        <Eye
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

                            <div className="flex gap-2">

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
                                    className="flex h-9 items-center gap-1 rounded-lg border border-[#DDE3E7] px-3 text-xs font-medium text-[#52636C] disabled:cursor-not-allowed disabled:opacity-40"
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
                                    className="flex h-9 items-center gap-1 rounded-lg border border-[#DDE3E7] px-3 text-xs font-medium text-[#52636C] disabled:cursor-not-allowed disabled:opacity-40"
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