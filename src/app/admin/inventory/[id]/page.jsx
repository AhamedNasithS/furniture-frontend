"use client";

import axios from "axios";
import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    useParams,
    useRouter,
} from "next/navigation";

import {
    ArrowLeft,
    Package,
    Boxes,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Pencil,
    Save,
} from "lucide-react";

import useAuthStore from "@/store/authStore";
import Image from "next/image";

export default function InventoryItemPage() {
    const router = useRouter();
    const params = useParams();

    const productId = params.id;

    const token = useAuthStore(
        (state) => state.token
    );

    const [product, setProduct] =
        useState(null);

    const [
        lowStockThreshold,
        setLowStockThreshold,
    ] = useState(5);

    const [stockInput, setStockInput] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    /* -------------------------
       LOAD DATA
    ------------------------- */

    const loadData =
        useCallback(async () => {
            if (
                !token ||
                !productId
            ) {
                return;
            }

            try {
                setLoading(true);
                setError("");

                const [
                    productResponse,
                    settingsResponse,
                ] = await Promise.all([
                    axios.get(
                        `${process.env.NEXT_PUBLIC_API_URL}/admin/products/${productId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    ),

                    axios.get(
                        `${process.env.NEXT_PUBLIC_API_URL}/admin/settings`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    ),
                ]);

                const productData =
                    productResponse.data
                        ?.data;

                const settings =
                    settingsResponse.data
                        ?.data;

                if (!productData) {
                    throw new Error(
                        "Product not found"
                    );
                }

                setProduct(
                    productData
                );

                setStockInput(
                    productData.stock
                );

                setLowStockThreshold(
                    Number(
                        settings?.lowStockThreshold
                    ) || 5
                );
            } catch (error) {
                console.log(
                    "Inventory item error:",
                    error.response
                        ?.data ||
                    error.message
                );

                setProduct(null);

                setError(
                    error.response
                        ?.data
                        ?.message ||
                    error.message ||
                    "Unable to load inventory item."
                );
            } finally {
                setLoading(false);
            }
        }, [
            token,
            productId,
        ]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    /* -------------------------
       STOCK STATUS
    ------------------------- */

    const getStockStatus = (
        stock
    ) => {
        const quantity =
            Number(stock);

        if (quantity === 0) {
            return {
                label:
                    "Out of Stock",

                className:
                    "bg-red-50 text-red-600",

                icon: XCircle,
            };
        }

        if (
            quantity <=
            lowStockThreshold
        ) {
            return {
                label:
                    "Low Stock",

                className:
                    "bg-amber-50 text-amber-600",

                icon: AlertTriangle,
            };
        }

        return {
            label:
                "In Stock",

            className:
                "bg-green-50 text-green-600",

            icon: CheckCircle2,
        };
    };

    /* -------------------------
       UPDATE STOCK
    ------------------------- */

    const updateStock =
        async () => {
            if (
                !token ||
                !product
            ) {
                return;
            }

            const stock =
                Number(
                    stockInput
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
                setSaving(true);
                setError("");
                setSuccess("");

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

                setProduct(
                    (prev) => ({
                        ...prev,

                        stock:
                            updated?.stock ??
                            stock,
                    })
                );

                setStockInput(
                    updated?.stock ??
                    stock
                );

                setSuccess(
                    "Stock updated successfully."
                );
            } catch (error) {
                console.log(
                    "Stock update error:",
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
                setSaving(false);
            }
        };

    /* -------------------------
       HELPERS
    ------------------------- */

    const formatCurrency = (
        value
    ) =>
        new Intl.NumberFormat(
            "en-IN",
            {
                style:
                    "currency",

                currency:
                    "INR",

                maximumFractionDigits:
                    0,
            }
        ).format(
            Number(value) || 0
        );

    const getPrimaryImage = (
        images = []
    ) => {
        if (!images.length) {
            return null;
        }

        return (
            images.find(
                (image) =>
                    image.isPrimary
            )?.imageUrl ||
            images[0]
                ?.imageUrl ||
            null
        );
    };

    /* -------------------------
       LOADING
    ------------------------- */

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <div className="text-center">

                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#DDE7EC] border-t-[#024E82]" />

                    <p className="mt-4 text-sm text-gray-400">
                        Loading inventory...
                    </p>
                </div>
            </div>
        );
    }

    /* -------------------------
       ERROR
    ------------------------- */

    if (!product) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">

                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">

                    <p className="text-sm text-red-600">
                        {error ||
                            "Product not found"}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/admin/inventory"
                            )
                        }
                        className="mt-4 text-sm font-medium text-[#024E82]"
                    >
                        Back to Inventory
                    </button>
                </div>
            </div>
        );
    }

    const image =
        getPrimaryImage(
            product.images
        );

    const stockStatus =
        getStockStatus(
            product.stock
        );

    const StockIcon =
        stockStatus.icon;

    const stockChanged =
        Number(stockInput) !==
        Number(product.stock);

    return (
        <div className="p-4 sm:p-6 lg:p-8">

            {/* HEADER */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                <div className="flex items-start gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/admin/inventory"
                            )
                        }
                        className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#DDE3E7] text-gray-500 transition hover:border-[#024E82] hover:text-[#024E82]"
                    >
                        <ArrowLeft
                            size={
                                17
                            }
                        />
                    </button>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
                            Inventory Item
                        </p>

                        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#172B38] sm:text-3xl">
                            {
                                product.name
                            }
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Manage stock and
                            product inventory
                            information.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            `/admin/products/${product.id}/edit`
                        )
                    }
                    className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#DDE3E7] px-4 text-sm font-medium text-[#52636C] transition hover:border-[#024E82] hover:text-[#024E82]"
                >
                    <Pencil
                        size={15}
                    />

                    Edit Product
                </button>
            </div>

            {/* MESSAGES */}
            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                    {success}
                </div>
            )}

            {/* CONTENT */}
            <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_380px]">

                {/* LEFT */}
                <div className="space-y-6">

                    {/* PRODUCT INFO */}
                    <section className="rounded-xl border border-[#E4E9EC] bg-white p-5 sm:p-6">

                        <div className="flex flex-col gap-5 sm:flex-row">

                            {/* IMAGE */}
                            <div className="flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F3F5F6] sm:w-40">

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
                                            32
                                        }
                                        className="text-gray-300"
                                    />
                                )}
                            </div>

                            {/* INFO */}
                            <div className="flex-1">

                                <div className="flex flex-wrap items-center gap-2">

                                    <h2 className="text-lg font-semibold text-[#172B38]">
                                        {
                                            product.name
                                        }
                                    </h2>

                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${product.status ===
                                                "active"
                                                ? "bg-green-50 text-green-600"
                                                : "bg-gray-100 text-gray-500"
                                            }`}
                                    >
                                        {
                                            product.status
                                        }
                                    </span>
                                </div>

                                <p className="mt-2 text-sm text-gray-500">
                                    {product.description ||
                                        "No product description."}
                                </p>

                                <div className="mt-5 grid gap-4 sm:grid-cols-2">

                                    <div>
                                        <p className="text-xs text-gray-400">
                                            SKU
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-[#344852]">
                                            {
                                                product.sku
                                            }
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400">
                                            Category
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-[#344852]">
                                            {product
                                                .category
                                                ?.name ||
                                                "—"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400">
                                            Regular Price
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-[#344852]">
                                            {formatCurrency(
                                                product.price
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400">
                                            Discount Price
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-[#344852]">
                                            {product.discountPrice
                                                ? formatCurrency(
                                                    product.discountPrice
                                                )
                                                : "—"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* INVENTORY INFORMATION */}
                    <section className="rounded-xl border border-[#E4E9EC] bg-white">

                        <div className="border-b border-[#E8ECEF] px-5 py-4">

                            <h2 className="text-base font-semibold text-[#172B38]">
                                Inventory Information
                            </h2>

                            <p className="mt-1 text-xs text-gray-400">
                                Current product
                                availability.
                            </p>
                        </div>

                        <div className="grid gap-4 p-5 sm:grid-cols-3">

                            {/* CURRENT STOCK */}
                            <div className="rounded-xl bg-[#F7F9FB] p-4">

                                <Boxes
                                    size={
                                        18
                                    }
                                    className="text-[#024E82]"
                                />

                                <p className="mt-3 text-xs text-gray-400">
                                    Current Stock
                                </p>

                                <p className="mt-1 text-2xl font-semibold text-[#172B38]">
                                    {
                                        product.stock
                                    }
                                </p>
                            </div>

                            {/* STATUS */}
                            <div className="rounded-xl bg-[#F7F9FB] p-4">

                                <StockIcon
                                    size={
                                        18
                                    }
                                    className={
                                        product.stock ===
                                            0
                                            ? "text-red-500"
                                            : product.stock <=
                                                lowStockThreshold
                                                ? "text-amber-500"
                                                : "text-green-500"
                                    }
                                />

                                <p className="mt-3 text-xs text-gray-400">
                                    Stock Status
                                </p>

                                <span
                                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${stockStatus.className}`}
                                >
                                    {
                                        stockStatus.label
                                    }
                                </span>
                            </div>

                            {/* THRESHOLD */}
                            <div className="rounded-xl bg-[#F7F9FB] p-4">

                                <AlertTriangle
                                    size={
                                        18
                                    }
                                    className="text-amber-500"
                                />

                                <p className="mt-3 text-xs text-gray-400">
                                    Low Stock Alert
                                </p>

                                <p className="mt-1 text-sm font-semibold text-[#172B38]">
                                    ≤{" "}
                                    {
                                        lowStockThreshold
                                    }{" "}
                                    units
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* RIGHT */}
                <div>

                    {/* STOCK ADJUSTMENT */}
                    <section className="rounded-xl border border-[#E4E9EC] bg-white p-5">

                        <div className="flex items-center gap-2">

                            <Boxes
                                size={
                                    18
                                }
                                className="text-[#024E82]"
                            />

                            <h2 className="text-base font-semibold text-[#172B38]">
                                Adjust Stock
                            </h2>
                        </div>

                        <p className="mt-2 text-xs leading-5 text-gray-400">
                            Set the total stock
                            quantity currently
                            available for this
                            product.
                        </p>

                        {/* CURRENT */}
                        <div className="mt-5 rounded-lg bg-[#F7F9FB] p-4">

                            <p className="text-xs text-gray-400">
                                Current Quantity
                            </p>

                            <p className="mt-1 text-3xl font-semibold text-[#172B38]">
                                {
                                    product.stock
                                }
                            </p>
                        </div>

                        {/* INPUT */}
                        <label className="mt-5 block text-sm font-medium text-[#344852]">
                            New Stock Quantity

                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={
                                    stockInput
                                }
                                onChange={(
                                    e
                                ) => {
                                    setStockInput(
                                        e
                                            .target
                                            .value
                                    );

                                    setSuccess(
                                        ""
                                    );
                                }}
                                className="mt-2 h-12 w-full rounded-lg border border-[#DDE3E7] px-4 text-base font-medium text-[#344852] outline-none transition focus:border-[#024E82]"
                            />
                        </label>

                        {/* PREVIEW */}
                        <div className="mt-4 flex items-center justify-between rounded-lg border border-[#EEF1F3] p-3">

                            <span className="text-xs text-gray-500">
                                New Status
                            </span>

                            <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStockStatus(
                                    Number(
                                        stockInput ||
                                        0
                                    )
                                )
                                        .className
                                    }`}
                            >
                                {
                                    getStockStatus(
                                        Number(
                                            stockInput ||
                                            0
                                        )
                                    ).label
                                }
                            </span>
                        </div>

                        {/* SAVE */}
                        <button
                            type="button"
                            disabled={
                                saving ||
                                !stockChanged
                            }
                            onClick={
                                updateStock
                            }
                            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#024E82] text-sm font-medium text-white transition hover:bg-[#013D67] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Save
                                size={
                                    16
                                }
                            />

                            {saving
                                ? "Updating..."
                                : "Update Stock"}
                        </button>

                        {!stockChanged && (
                            <p className="mt-3 text-center text-[11px] text-gray-400">
                                Change the quantity
                                to enable Update
                                Stock.
                            </p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}