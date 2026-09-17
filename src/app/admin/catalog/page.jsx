"use client";

import axios from "axios";
import {
    useEffect,
    useState,
} from "react";

import {
    Plus,
    Pencil,
    Trash2,
    X,
    Tags,
} from "lucide-react";

import useAuthStore from "@/store/authStore";
import Image from "next/image";

const emptyForm = {
    name: "",
    description: "",
    image: "",
    status: "active",
};

export default function AdminCatalogPage() {
    const token = useAuthStore(
        (state) => state.token
    );

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [modalOpen, setModalOpen] =
        useState(false);

    const [editingCategory, setEditingCategory] =
        useState(null);

    const [form, setForm] =
        useState(emptyForm);

    const [deleteCategory, setDeleteCategory] =
        useState(null);

    /* -------------------------
       SLUG
    ------------------------- */

    const createSlug = (name) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    /* -------------------------
       GET CATEGORIES
    ------------------------- */

    const getCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/categories/all`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

            setCategories(
                response.data?.data || []
            );
        } catch (error) {
            console.log(
                "Categories error:",
                error.response?.data ||
                error.message
            );

            setError(
                "Unable to load categories."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    /* -------------------------
       OPEN ADD
    ------------------------- */

    const openAddModal = () => {
        setEditingCategory(null);

        setForm(emptyForm);

        setError("");

        setModalOpen(true);
    };

    /* -------------------------
       OPEN EDIT
    ------------------------- */

    const openEditModal = (
        category
    ) => {
        setEditingCategory(
            category
        );

        setForm({
            name:
                category.name || "",

            description:
                category.description ||
                "",

            image:
                category.image || "",

            status:
                category.status ||
                "active",
        });

        setError("");

        setModalOpen(true);
    };

    /* -------------------------
       CHANGE
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
       SAVE
    ------------------------- */

    const handleSubmit = async (
        e
    ) => {
        e.preventDefault();

        if (!form.name.trim()) {
            setError(
                "Category name is required."
            );

            return;
        }

        try {
            setSaving(true);
            setError("");

            const payload = {
                name:
                    form.name.trim(),

                slug: createSlug(
                    form.name
                ),

                description:
                    form.description.trim() ||
                    null,

                image:
                    form.image.trim() ||
                    null,

                status:
                    form.status,
            };

            if (editingCategory) {
                await axios.put(
                    `${process.env.NEXT_PUBLIC_API_URL}/categories/${editingCategory.id}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/categories`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }

            setModalOpen(false);

            setEditingCategory(
                null
            );

            setForm(emptyForm);

            await getCategories();
        } catch (error) {
            console.log(
                "Save category error:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data
                    ?.message ||
                "Unable to save category."
            );
        } finally {
            setSaving(false);
        }
    };

    /* -------------------------
       DELETE
    ------------------------- */

    const handleDelete =
        async () => {
            if (
                !deleteCategory ||
                !token
            ) {
                return;
            }

            try {
                setSaving(true);
                setError("");

                await axios.delete(
                    `${process.env.NEXT_PUBLIC_API_URL}/categories/${deleteCategory.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setDeleteCategory(
                    null
                );

                await getCategories();
            } catch (error) {
                console.log(
                    "Delete category error:",
                    error.response?.data ||
                    error.message
                );

                setDeleteCategory(
                    null
                );

                setError(
                    error.response
                        ?.data?.message ||
                    "Unable to delete category."
                );
            } finally {
                setSaving(false);
            }
        };

    return (
        <div className="p-4 sm:p-6 lg:p-8">

            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
                        Catalog
                    </p>

                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#172B38] sm:text-3xl">
                        Categories
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Organize products into
                        customer-facing furniture
                        categories.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={
                        openAddModal
                    }
                    className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#024E82] px-4 text-sm font-medium text-white transition hover:bg-[#013D67]"
                >
                    <Plus size={17} />

                    Add Category
                </button>
            </div>

            {/* ERROR */}
            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* CARD */}
            <div className="mt-7 overflow-hidden rounded-xl border border-[#E4E9EC] bg-white">

                <div className="flex items-center justify-between border-b border-[#E8ECEF] px-5 py-4">
                    <div>
                        <h2 className="text-base font-semibold text-[#172B38]">
                            Furniture Categories
                        </h2>

                        <p className="mt-1 text-xs text-gray-400">
                            {
                                categories.length
                            }{" "}
                            categories
                        </p>
                    </div>

                    <Tags
                        size={20}
                        className="text-[#024E82]"
                    />
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="min-w-[800px] w-full">

                        <thead>
                            <tr className="border-b border-[#EEF1F3] bg-[#FAFBFC] text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                                <th className="px-5 py-3">
                                    Category
                                </th>

                                <th className="px-5 py-3">
                                    Slug
                                </th>

                                <th className="px-5 py-3">
                                    Description
                                </th>

                                <th className="px-5 py-3">
                                    Status
                                </th>

                                <th className="px-5 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                Array.from({
                                    length: 5,
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
                                                    5
                                                }
                                                className="px-5 py-4"
                                            >
                                                <div className="h-12 animate-pulse rounded-lg bg-gray-100" />
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : categories.length ===
                                0 ? (
                                <tr>
                                    <td
                                        colSpan={
                                            5
                                        }
                                        className="px-5 py-16 text-center"
                                    >
                                        <Tags
                                            size={
                                                30
                                            }
                                            className="mx-auto text-gray-300"
                                        />

                                        <p className="mt-3 text-sm font-medium text-gray-500">
                                            No categories
                                            yet
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                categories.map(
                                    (
                                        category
                                    ) => (
                                        <tr
                                            key={
                                                category.id
                                            }
                                            className="border-b border-[#F0F2F4] text-sm last:border-0 hover:bg-[#FAFBFC]"
                                        >

                                            {/* CATEGORY */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F3F5F6]">
                                                        {category.image ? (
                                                            <Image
                                                                src={
                                                                    category.image
                                                                }
                                                                alt={
                                                                    category.name
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <Tags
                                                                size={
                                                                    18
                                                                }
                                                                className="text-gray-300"
                                                            />
                                                        )}
                                                    </div>

                                                    <div>
                                                        <p className="font-medium text-[#243640]">
                                                            {
                                                                category.name
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-400">
                                                            ID #
                                                            {
                                                                category.id
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* SLUG */}
                                            <td className="px-5 py-4 text-gray-500">
                                                {
                                                    category.slug
                                                }
                                            </td>

                                            {/* DESCRIPTION */}
                                            <td className="px-5 py-4">
                                                <p className="max-w-[300px] truncate text-gray-500">
                                                    {category.description ||
                                                        "—"}
                                                </p>
                                            </td>

                                            {/* STATUS */}
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${category.status ===
                                                            "active"
                                                            ? "bg-green-50 text-green-600"
                                                            : "bg-gray-100 text-gray-500"
                                                        }`}
                                                >
                                                    {
                                                        category.status
                                                    }
                                                </span>
                                            </td>

                                            {/* ACTIONS */}
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditModal(
                                                                category
                                                            )
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DDE3E7] text-gray-500 transition hover:border-[#024E82] hover:text-[#024E82]"
                                                        aria-label="Edit category"
                                                    >
                                                        <Pencil
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setDeleteCategory(
                                                                category
                                                            )
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DDE3E7] text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                                                        aria-label="Delete category"
                                                    >
                                                        <Trash2
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ADD / EDIT MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4">

                    <div className="w-full max-w-[560px] rounded-2xl bg-white shadow-2xl">

                        <div className="flex items-center justify-between border-b border-[#E8ECEF] px-5 py-4">
                            <div>
                                <h2 className="text-lg font-semibold text-[#172B38]">
                                    {editingCategory
                                        ? "Edit Category"
                                        : "Add Category"}
                                </h2>

                                <p className="mt-1 text-xs text-gray-400">
                                    Category details
                                    used throughout
                                    the storefront.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setModalOpen(
                                        false
                                    )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
                            >
                                <X
                                    size={
                                        18
                                    }
                                />
                            </button>
                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="p-5"
                        >
                            <div className="space-y-4">

                                <label className="block text-sm font-medium text-[#344852]">
                                    Category Name
                                    *

                                    <input
                                        name="name"
                                        value={
                                            form.name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Sofas"
                                        className="mt-2 h-11 w-full rounded-lg border border-[#DDE3E7] px-3 text-sm outline-none focus:border-[#024E82]"
                                    />
                                </label>

                                <label className="block text-sm font-medium text-[#344852]">
                                    Slug

                                    <input
                                        value={
                                            createSlug(
                                                form.name
                                            )
                                        }
                                        readOnly
                                        className="mt-2 h-11 w-full rounded-lg border border-[#E4E9EC] bg-[#F7F9FB] px-3 text-sm text-gray-500 outline-none"
                                    />
                                </label>

                                <label className="block text-sm font-medium text-[#344852]">
                                    Image URL

                                    <input
                                        name="image"
                                        value={
                                            form.image
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="https://..."
                                        className="mt-2 h-11 w-full rounded-lg border border-[#DDE3E7] px-3 text-sm outline-none focus:border-[#024E82]"
                                    />
                                </label>

                                <label className="block text-sm font-medium text-[#344852]">
                                    Description

                                    <textarea
                                        name="description"
                                        value={
                                            form.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows={4}
                                        placeholder="Category description..."
                                        className="mt-2 w-full resize-none rounded-lg border border-[#DDE3E7] px-3 py-3 text-sm outline-none focus:border-[#024E82]"
                                    />
                                </label>

                                <label className="block text-sm font-medium text-[#344852]">
                                    Status

                                    <select
                                        name="status"
                                        value={
                                            form.status
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="mt-2 h-11 w-full rounded-lg border border-[#DDE3E7] px-3 text-sm outline-none focus:border-[#024E82]"
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

                            <div className="mt-6 flex justify-end gap-3 border-t border-[#EEF1F3] pt-5">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setModalOpen(
                                            false
                                        )
                                    }
                                    className="h-10 rounded-lg border border-[#DDE3E7] px-4 text-sm font-medium text-gray-500"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        saving
                                    }
                                    className="h-10 rounded-lg bg-[#024E82] px-5 text-sm font-medium text-white disabled:opacity-60"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingCategory
                                            ? "Update Category"
                                            : "Create Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRM */}
            {deleteCategory && (
                <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/40 p-4">

                    <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl">

                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-500">
                            <Trash2
                                size={19}
                            />
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-[#172B38]">
                            Delete Category?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Are you sure you
                            want to delete{" "}
                            <span className="font-medium text-[#344852]">
                                {
                                    deleteCategory.name
                                }
                            </span>
                            ?
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteCategory(
                                        null
                                    )
                                }
                                className="h-10 rounded-lg border border-[#DDE3E7] px-4 text-sm font-medium text-gray-500"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleDelete
                                }
                                disabled={
                                    saving
                                }
                                className="h-10 rounded-lg bg-red-500 px-4 text-sm font-medium text-white disabled:opacity-60"
                            >
                                {saving
                                    ? "Deleting..."
                                    : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}