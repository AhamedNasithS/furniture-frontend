"use client";

import axios from "axios";
import {
    useEffect,
    useState,
} from "react";

import {
    ArrowLeft,
    ImagePlus,
    Plus,
    Trash2,
} from "lucide-react";

const emptyForm = {
    name: "",
    sku: "",
    categoryId: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    status: "active",

    material: "",
    color: "",
    width: "",
    height: "",
    depth: "",
};

export default function ProductForm({
    initialData = null,
    onSubmit,
    onCancel,
    submitting = false,
    serverError = "",
    submitLabel = "Save Product",
}) {
    const [categories, setCategories] =
        useState([]);

    const [form, setForm] =
        useState(emptyForm);

    const [imageUrls, setImageUrls] =
        useState([""]);

    const [error, setError] =
        useState("");

    /* -------------------------
       INITIAL DATA
    ------------------------- */

    useEffect(() => {
        if (!initialData) return;

        setForm({
            name:
                initialData.name || "",
            sku:
                initialData.sku || "",
            categoryId:
                initialData.categoryId ||
                "",
            description:
                initialData.description ||
                "",
            price:
                initialData.price || "",
            discountPrice:
                initialData.discountPrice ??
                "",
            material: initialData?.material || "",
            color: initialData?.color || "",

            width:
                initialData?.width ?? "",

            height:
                initialData?.height ?? "",

            depth:
                initialData?.depth ?? "",
            stock:
                initialData.stock ?? "",
            status:
                initialData.status ||
                "active",
        });

        if (
            initialData.images?.length
        ) {
            setImageUrls(
                initialData.images.map(
                    (image) =>
                        image.imageUrl
                )
            );
        }
    }, [initialData]);

    /* -------------------------
       CATEGORIES
    ------------------------- */

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
                        "Product form categories error:",
                        error.response
                            ?.data ||
                        error.message
                    );
                }
            };

        getCategories();
    }, []);

    /* -------------------------
       INPUT CHANGE
    ------------------------- */

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /* -------------------------
       IMAGES
    ------------------------- */

    const updateImage = (
        index,
        value
    ) => {
        setImageUrls((prev) =>
            prev.map(
                (item, itemIndex) =>
                    itemIndex === index
                        ? value
                        : item
            )
        );
    };

    const addImage = () => {
        setImageUrls((prev) => [
            ...prev,
            "",
        ]);
    };

    const removeImage = (index) => {
        setImageUrls((prev) => {
            if (prev.length === 1) {
                return [""];
            }

            return prev.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            );
        });
    };

    /* -------------------------
       SUBMIT
    ------------------------- */

    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");

        if (
            !form.name.trim() ||
            !form.sku.trim() ||
            !form.categoryId ||
            form.price === ""
        ) {
            setError(
                "Name, SKU, category and price are required."
            );

            return;
        }

        const price =
            Number(form.price);

        const discountPrice =
            form.discountPrice === ""
                ? null
                : Number(
                    form.discountPrice
                );

        const stock =
            Number(form.stock || 0);

        if (
            Number.isNaN(price) ||
            price <= 0
        ) {
            setError(
                "Enter a valid product price."
            );

            return;
        }

        if (
            discountPrice !== null &&
            discountPrice >= price
        ) {
            setError(
                "Discount price must be lower than regular price."
            );

            return;
        }

        if (
            Number.isNaN(stock) ||
            stock < 0
        ) {
            setError(
                "Stock cannot be negative."
            );

            return;
        }

        const width =
            form.width === ""
                ? null
                : Number(form.width);

        const height =
            form.height === ""
                ? null
                : Number(form.height);

        const depth =
            form.depth === ""
                ? null
                : Number(form.depth);

        if (
            (width !== null &&
                (Number.isNaN(width) ||
                    width < 0)) ||
            (height !== null &&
                (Number.isNaN(height) ||
                    height < 0)) ||
            (depth !== null &&
                (Number.isNaN(depth) ||
                    depth < 0))
        ) {
            setError(
                "Product dimensions cannot be negative."
            );

            return;
        }

        const cleanImages =
            imageUrls
                .map((url) =>
                    url.trim()
                )
                .filter(Boolean);

        onSubmit({
            product: {
                ...form,

                categoryId:
                    Number(form.categoryId),

                name:
                    form.name.trim(),

                sku:
                    form.sku.trim(),

                price,

                discountPrice,

                stock,

                material:
                    form.material.trim() ||
                    null,

                color:
                    form.color.trim() ||
                    null,

                width:
                    form.width === ""
                        ? null
                        : Number(form.width),

                height:
                    form.height === ""
                        ? null
                        : Number(form.height),

                depth:
                    form.depth === ""
                        ? null
                        : Number(form.depth),
            },

            images: cleanImages,
        });
    };

    const inputClass =
        "mt-2 h-11 w-full rounded-lg border border-[#DDE3E7] bg-white px-3 text-sm text-[#344852] outline-none transition focus:border-[#024E82]";

    return (
        <form
            onSubmit={
                handleSubmit
            }
        >
            {/* TOP */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <button
                        type="button"
                        onClick={
                            onCancel
                        }
                        className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#DDE3E7] text-gray-500 transition hover:border-[#024E82] hover:text-[#024E82]"
                    >
                        <ArrowLeft
                            size={17}
                        />
                    </button>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
                            Product Catalog
                        </p>

                        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#172B38] sm:text-3xl">
                            {initialData
                                ? "Edit Product"
                                : "Add Product"}
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Manage product
                            information,
                            pricing,
                            inventory and
                            images.
                        </p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={
                        submitting
                    }
                    className="h-11 rounded-lg bg-[#024E82] px-5 text-sm font-medium text-white transition hover:bg-[#013D67] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting
                        ? "Saving..."
                        : submitLabel}
                </button>
            </div>

            {/* ERROR */}
            {(error ||
                serverError) && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error ||
                            serverError}
                    </div>
                )}

            <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_360px]">

                {/* LEFT */}
                <div className="space-y-6">

                    {/* BASIC INFO */}
                    <section className="rounded-xl border border-[#E4E9EC] bg-white p-5 sm:p-6">
                        <div className="border-b border-[#EEF1F3] pb-4">
                            <h2 className="text-base font-semibold text-[#172B38]">
                                Product
                                Information
                            </h2>

                            <p className="mt-1 text-xs text-gray-400">
                                Basic
                                information
                                displayed in
                                the store.
                            </p>
                        </div>

                        <div className="mt-5 grid gap-5 md:grid-cols-2">

                            <label className="text-sm font-medium text-[#344852]">
                                Product Name
                                *

                                <input
                                    name="name"
                                    value={
                                        form.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Modern Linen Sofa"
                                    className={
                                        inputClass
                                    }
                                />
                            </label>

                            <label className="text-sm font-medium text-[#344852]">
                                SKU *

                                <input
                                    name="sku"
                                    value={
                                        form.sku
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="FTC-SOF-001"
                                    className={
                                        inputClass
                                    }
                                />
                            </label>

                            <label className="text-sm font-medium text-[#344852]">
                                Category *

                                <select
                                    name="categoryId"
                                    value={
                                        form.categoryId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className={
                                        inputClass
                                    }
                                >
                                    <option value="">
                                        Select
                                        category
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
                            </label>

                            <label className="text-sm font-medium text-[#344852]">
                                Status

                                <select
                                    name="status"
                                    value={
                                        form.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className={
                                        inputClass
                                    }
                                >
                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="inactive">
                                        Inactive
                                    </option>
                                </select>
                            </label>
                        </div>

                        <label className="mt-5 block text-sm font-medium text-[#344852]">
                            Description

                            <textarea
                                name="description"
                                value={
                                    form.description
                                }
                                onChange={
                                    handleChange
                                }
                                rows={6}
                                placeholder="Describe the product..."
                                className="mt-2 w-full resize-none rounded-lg border border-[#DDE3E7] bg-white px-3 py-3 text-sm leading-6 text-[#344852] outline-none transition focus:border-[#024E82]"
                            />
                        </label>
                    </section>

                    {/* PRODUCT ATTRIBUTES */}
                    <section className="rounded-xl border border-[#E4E9EC] bg-white">

                        <div className="border-b border-[#E8ECEF] px-5 py-4">
                            <h2 className="text-base font-semibold text-[#172B38]">
                                Product Attributes
                            </h2>

                            <p className="mt-1 text-xs text-gray-400">
                                Furniture material,
                                colour and dimensions.
                            </p>
                        </div>

                        <div className="grid gap-5 p-5 sm:grid-cols-2">

                            {/* MATERIAL */}
                            <label className="block text-sm font-medium text-[#344852]">
                                Material

                                <input
                                    type="text"
                                    name="material"
                                    value={form.material}
                                    onChange={handleChange}
                                    placeholder="Solid Wood"
                                    className="mt-2 h-11 w-full rounded-lg border border-[#DDE3E7] px-3 text-sm outline-none focus:border-[#024E82]"
                                />
                            </label>

                            {/* COLOR */}
                            <label className="block text-sm font-medium text-[#344852]">
                                Color

                                <input
                                    type="text"
                                    name="color"
                                    value={form.color}
                                    onChange={handleChange}
                                    placeholder="Walnut Brown"
                                    className="mt-2 h-11 w-full rounded-lg border border-[#DDE3E7] px-3 text-sm outline-none focus:border-[#024E82]"
                                />
                            </label>

                            {/* WIDTH */}
                            <label className="block text-sm font-medium text-[#344852]">
                                Width

                                <div className="relative mt-2">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        name="width"
                                        value={form.width}
                                        onChange={handleChange}
                                        placeholder="220"
                                        className="h-11 w-full rounded-lg border border-[#DDE3E7] px-3 pr-12 text-sm outline-none focus:border-[#024E82]"
                                    />

                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                        cm
                                    </span>
                                </div>
                            </label>

                            {/* HEIGHT */}
                            <label className="block text-sm font-medium text-[#344852]">
                                Height

                                <div className="relative mt-2">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        name="height"
                                        value={form.height}
                                        onChange={handleChange}
                                        placeholder="85"
                                        className="h-11 w-full rounded-lg border border-[#DDE3E7] px-3 pr-12 text-sm outline-none focus:border-[#024E82]"
                                    />

                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                        cm
                                    </span>
                                </div>
                            </label>

                            {/* DEPTH */}
                            <label className="block text-sm font-medium text-[#344852]">
                                Depth

                                <div className="relative mt-2">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        name="depth"
                                        value={form.depth}
                                        onChange={handleChange}
                                        placeholder="95"
                                        className="h-11 w-full rounded-lg border border-[#DDE3E7] px-3 pr-12 text-sm outline-none focus:border-[#024E82]"
                                    />

                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                        cm
                                    </span>
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* IMAGES */}
                    <section className="rounded-xl border border-[#E4E9EC] bg-white p-5 sm:p-6">
                        <div className="flex items-start justify-between border-b border-[#EEF1F3] pb-4">
                            <div>
                                <h2 className="text-base font-semibold text-[#172B38]">
                                    Product
                                    Images
                                </h2>

                                <p className="mt-1 text-xs text-gray-400">
                                    First image
                                    will be used
                                    as the primary
                                    product image.
                                </p>
                            </div>

                            <ImagePlus
                                size={20}
                                className="text-[#024E82]"
                            />
                        </div>

                        <div className="mt-5 space-y-3">
                            {imageUrls.map(
                                (
                                    imageUrl,
                                    index
                                ) => (
                                    <div
                                        key={
                                            index
                                        }
                                        className="flex gap-2"
                                    >
                                        <div className="relative flex-1">
                                            <input
                                                type="url"
                                                value={
                                                    imageUrl
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    updateImage(
                                                        index,
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="https://example.com/product.jpg"
                                                className="h-11 w-full rounded-lg border border-[#DDE3E7] px-3 pr-20 text-sm outline-none focus:border-[#024E82]"
                                            />

                                            {index ===
                                                0 && (
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-[#EAF3F8] px-2 py-1 text-[10px] font-medium text-[#024E82]">
                                                        Primary
                                                    </span>
                                                )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeImage(
                                                    index
                                                )
                                            }
                                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#DDE3E7] text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                                        >
                                            <Trash2
                                                size={
                                                    16
                                                }
                                            />
                                        </button>
                                    </div>
                                )
                            )}

                            <button
                                type="button"
                                onClick={
                                    addImage
                                }
                                className="flex h-10 items-center gap-2 text-sm font-medium text-[#024E82]"
                            >
                                <Plus
                                    size={16}
                                />
                                Add another
                                image
                            </button>
                        </div>
                    </section>
                </div>

                {/* RIGHT */}
                <div className="space-y-6">

                    {/* PRICING */}
                    <section className="rounded-xl border border-[#E4E9EC] bg-white p-5">
                        <h2 className="text-base font-semibold text-[#172B38]">
                            Pricing
                        </h2>

                        <div className="mt-5 space-y-4">
                            <label className="block text-sm font-medium text-[#344852]">
                                Regular Price
                                *

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    name="price"
                                    value={
                                        form.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="0.00"
                                    className={
                                        inputClass
                                    }
                                />
                            </label>

                            <label className="block text-sm font-medium text-[#344852]">
                                Discount Price

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    name="discountPrice"
                                    value={
                                        form.discountPrice
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Optional"
                                    className={
                                        inputClass
                                    }
                                />
                            </label>
                        </div>
                    </section>

                    {/* INVENTORY */}
                    <section className="rounded-xl border border-[#E4E9EC] bg-white p-5">
                        <h2 className="text-base font-semibold text-[#172B38]">
                            Inventory
                        </h2>

                        <label className="mt-5 block text-sm font-medium text-[#344852]">
                            Stock Quantity

                            <input
                                type="number"
                                min="0"
                                name="stock"
                                value={
                                    form.stock
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="0"
                                className={
                                    inputClass
                                }
                            />
                        </label>

                        <div className="mt-4 rounded-lg bg-[#F7F9FB] p-3">
                            <p className="text-xs leading-5 text-gray-500">
                                Stock changes here
                                will also affect
                                product availability
                                in the storefront.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </form>
    );
}