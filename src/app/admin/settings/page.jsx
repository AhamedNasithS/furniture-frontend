"use client";

import axios from "axios";
import {
    useEffect,
    useState,
} from "react";

import {
    Store,
    Truck,
    Package,
    Bell,
    Save,
} from "lucide-react";

import useAuthStore from "@/store/authStore";

const initialForm = {
    storeName: "",
    supportEmail: "",
    supportPhone: "",
    currency: "INR",
    shippingFee: "",
    freeShippingThreshold: "",
    lowStockThreshold: "",
    orderPrefix: "",
    emailNotifications: true,
};

export default function AdminSettingsPage() {
    const token = useAuthStore(
        (state) => state.token
    );

    const [form, setForm] =
        useState(initialForm);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    /* -------------------------
       GET SETTINGS
    ------------------------- */

    useEffect(() => {
        if (!token) return;

        const getSettings =
            async () => {
                try {
                    setLoading(true);
                    setError("");

                    const response =
                        await axios.get(
                            `${process.env.NEXT_PUBLIC_API_URL}/admin/settings`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                    const data =
                        response.data
                            ?.data;

                    if (!data) return;

                    setForm({
                        storeName:
                            data.storeName ||
                            "",

                        supportEmail:
                            data.supportEmail ||
                            "",

                        supportPhone:
                            data.supportPhone ||
                            "",

                        currency:
                            data.currency ||
                            "INR",

                        shippingFee:
                            data.shippingFee ??
                            "",

                        freeShippingThreshold:
                            data.freeShippingThreshold ??
                            "",

                        lowStockThreshold:
                            data.lowStockThreshold ??
                            5,

                        orderPrefix:
                            data.orderPrefix ||
                            "FTC",

                        emailNotifications:
                            data.emailNotifications ??
                            true,
                    });
                } catch (error) {
                    console.log(
                        "Settings error:",
                        error.response
                            ?.data ||
                            error.message
                    );

                    setError(
                        error.response
                            ?.data
                            ?.message ||
                            "Unable to load settings."
                    );
                } finally {
                    setLoading(false);
                }
            };

        getSettings();
    }, [token]);

    /* -------------------------
       CHANGE
    ------------------------- */

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setForm((prev) => ({
            ...prev,

            [name]:
                type ===
                "checkbox"
                    ? checked
                    : value,
        }));

        setSuccess("");
    };

    /* -------------------------
       SAVE
    ------------------------- */

    const handleSubmit =
        async (e) => {
            e.preventDefault();

            if (!token) return;

            setError("");
            setSuccess("");

            if (
                !form.storeName.trim()
            ) {
                setError(
                    "Store name is required."
                );

                return;
            }

            if (
                !form.orderPrefix.trim()
            ) {
                setError(
                    "Order prefix is required."
                );

                return;
            }

            const shippingFee =
                Number(
                    form.shippingFee ||
                        0
                );

            const lowStockThreshold =
                Number(
                    form.lowStockThreshold
                );

            const freeShippingThreshold =
                form.freeShippingThreshold ===
                ""
                    ? null
                    : Number(
                          form.freeShippingThreshold
                      );

            if (
                shippingFee < 0 ||
                Number.isNaN(
                    shippingFee
                )
            ) {
                setError(
                    "Shipping fee cannot be negative."
                );

                return;
            }

            if (
                !Number.isInteger(
                    lowStockThreshold
                ) ||
                lowStockThreshold <
                    0
            ) {
                setError(
                    "Low stock threshold must be a non-negative whole number."
                );

                return;
            }

            if (
                freeShippingThreshold !==
                    null &&
                (Number.isNaN(
                    freeShippingThreshold
                ) ||
                    freeShippingThreshold <
                        0)
            ) {
                setError(
                    "Free shipping threshold cannot be negative."
                );

                return;
            }

            try {
                setSaving(true);

                const payload = {
                    storeName:
                        form.storeName.trim(),

                    supportEmail:
                        form.supportEmail.trim() ||
                        null,

                    supportPhone:
                        form.supportPhone.trim() ||
                        null,

                    currency:
                        form.currency.trim() ||
                        "INR",

                    shippingFee,

                    freeShippingThreshold,

                    lowStockThreshold,

                    orderPrefix:
                        form.orderPrefix
                            .trim()
                            .toUpperCase(),

                    emailNotifications:
                        form.emailNotifications,
                };

                const response =
                    await axios.put(
                        `${process.env.NEXT_PUBLIC_API_URL}/admin/settings`,
                        payload,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                const updated =
                    response.data
                        ?.data;

                if (updated) {
                    setForm(
                        (prev) => ({
                            ...prev,

                            storeName:
                                updated.storeName ??
                                prev.storeName,

                            supportEmail:
                                updated.supportEmail ||
                                "",

                            supportPhone:
                                updated.supportPhone ||
                                "",

                            currency:
                                updated.currency ||
                                "INR",

                            shippingFee:
                                updated.shippingFee ??
                                0,

                            freeShippingThreshold:
                                updated.freeShippingThreshold ??
                                "",

                            lowStockThreshold:
                                updated.lowStockThreshold ??
                                5,

                            orderPrefix:
                                updated.orderPrefix ||
                                "FTC",

                            emailNotifications:
                                updated.emailNotifications ??
                                true,
                        })
                    );
                }

                setSuccess(
                    "Settings updated successfully."
                );
            } catch (error) {
                console.log(
                    "Update settings error:",
                    error.response
                        ?.data ||
                        error.message
                );

                setError(
                    error.response
                        ?.data
                        ?.message ||
                        "Unable to update settings."
                );
            } finally {
                setSaving(false);
            }
        };

    const inputClass =
        "mt-2 h-11 w-full rounded-lg border border-[#DDE3E7] bg-white px-3 text-sm text-[#344852] outline-none transition focus:border-[#024E82]";

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#DDE7EC] border-t-[#024E82]" />

                    <p className="mt-4 text-sm text-gray-400">
                        Loading settings...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form
            onSubmit={
                handleSubmit
            }
            className="p-4 sm:p-6 lg:p-8"
        >

            {/* HEADER */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
                        Configuration
                    </p>

                    <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#172B38] sm:text-3xl">
                        Store Settings
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Manage FTC store,
                        shipping, inventory
                        and notification
                        settings.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={
                        saving
                    }
                    className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#024E82] px-5 text-sm font-medium text-white transition hover:bg-[#013D67] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Save
                        size={16}
                    />

                    {saving
                        ? "Saving..."
                        : "Save Changes"}
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

            <div className="mt-7 grid gap-6 xl:grid-cols-2">

                {/* STORE INFORMATION */}
                <section className="rounded-xl border border-[#E4E9EC] bg-white">

                    <div className="flex items-center gap-3 border-b border-[#E8ECEF] px-5 py-4">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF3F8] text-[#024E82]">
                            <Store
                                size={18}
                            />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-[#172B38]">
                                Store Information
                            </h2>

                            <p className="mt-1 text-xs text-gray-400">
                                Basic FTC store
                                information
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5 p-5">

                        <label className="block text-sm font-medium text-[#344852]">
                            Store Name

                            <input
                                name="storeName"
                                value={
                                    form.storeName
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="FTC Furniture"
                                className={
                                    inputClass
                                }
                            />
                        </label>

                        <div className="grid gap-4 sm:grid-cols-2">

                            <label className="block text-sm font-medium text-[#344852]">
                                Support Email

                                <input
                                    type="email"
                                    name="supportEmail"
                                    value={
                                        form.supportEmail
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="support@ftc.com"
                                    className={
                                        inputClass
                                    }
                                />
                            </label>

                            <label className="block text-sm font-medium text-[#344852]">
                                Support Phone

                                <input
                                    type="tel"
                                    name="supportPhone"
                                    value={
                                        form.supportPhone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="+91..."
                                    className={
                                        inputClass
                                    }
                                />
                            </label>
                        </div>

                        <label className="block text-sm font-medium text-[#344852]">
                            Currency

                            <input
                                name="currency"
                                value={
                                    form.currency
                                }
                                onChange={
                                    handleChange
                                }
                                maxLength={
                                    10
                                }
                                className={
                                    inputClass
                                }
                            />

                            <span className="mt-2 block text-[11px] leading-5 text-gray-400">
                                FTC currently uses
                                INR formatting
                                throughout the
                                storefront.
                            </span>
                        </label>
                    </div>
                </section>

                {/* SHIPPING */}
                <section className="rounded-xl border border-[#E4E9EC] bg-white">

                    <div className="flex items-center gap-3 border-b border-[#E8ECEF] px-5 py-4">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF3F8] text-[#024E82]">
                            <Truck
                                size={18}
                            />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-[#172B38]">
                                Shipping
                            </h2>

                            <p className="mt-1 text-xs text-gray-400">
                                Configure checkout
                                delivery charges
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5 p-5">

                        <label className="block text-sm font-medium text-[#344852]">
                            Shipping Fee

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                name="shippingFee"
                                value={
                                    form.shippingFee
                                }
                                onChange={
                                    handleChange
                                }
                                className={
                                    inputClass
                                }
                            />

                            <span className="mt-2 block text-[11px] text-gray-400">
                                Standard shipping
                                fee added to the
                                cart.
                            </span>
                        </label>

                        <label className="block text-sm font-medium text-[#344852]">
                            Free Shipping
                            Threshold

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                name="freeShippingThreshold"
                                value={
                                    form.freeShippingThreshold
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Leave empty to disable"
                                className={
                                    inputClass
                                }
                            />

                            <span className="mt-2 block text-[11px] leading-5 text-gray-400">
                                Orders at or above
                                this subtotal get
                                free shipping.
                                Leave empty to
                                disable.
                            </span>
                        </label>

                        {/* SHIPPING PREVIEW */}
                        <div className="rounded-lg bg-[#F7F9FB] p-4">

                            <p className="text-xs font-medium text-[#344852]">
                                Current rule
                            </p>

                            <p className="mt-2 text-xs leading-5 text-gray-500">

                                Standard shipping:{" "}

                                <strong>
                                    ₹
                                    {Number(
                                        form.shippingFee ||
                                            0
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>

                                {form.freeShippingThreshold !==
                                    "" && (
                                    <>
                                        <br />

                                        Free shipping from{" "}

                                        <strong>
                                            ₹
                                            {Number(
                                                form.freeShippingThreshold
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </section>

                {/* INVENTORY + ORDERS */}
                <section className="rounded-xl border border-[#E4E9EC] bg-white">

                    <div className="flex items-center gap-3 border-b border-[#E8ECEF] px-5 py-4">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF3F8] text-[#024E82]">
                            <Package
                                size={18}
                            />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-[#172B38]">
                                Inventory & Orders
                            </h2>

                            <p className="mt-1 text-xs text-gray-400">
                                Stock alerts and
                                order numbering
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5 p-5">

                        <label className="block text-sm font-medium text-[#344852]">
                            Low Stock Threshold

                            <input
                                type="number"
                                min="0"
                                step="1"
                                name="lowStockThreshold"
                                value={
                                    form.lowStockThreshold
                                }
                                onChange={
                                    handleChange
                                }
                                className={
                                    inputClass
                                }
                            />

                            <span className="mt-2 block text-[11px] leading-5 text-gray-400">
                                Products at or
                                below this quantity
                                appear as Low Stock
                                in Inventory.
                            </span>
                        </label>

                        <label className="block text-sm font-medium text-[#344852]">
                            Order Prefix

                            <input
                                name="orderPrefix"
                                value={
                                    form.orderPrefix
                                }
                                onChange={
                                    handleChange
                                }
                                maxLength={
                                    20
                                }
                                placeholder="FTC"
                                className={
                                    inputClass
                                }
                            />

                            <span className="mt-2 block text-[11px] leading-5 text-gray-400">
                                New orders are
                                generated using
                                this prefix.
                            </span>
                        </label>

                        <div className="rounded-lg bg-[#F7F9FB] p-4">

                            <p className="text-xs text-gray-400">
                                Example Order Number
                            </p>

                            <p className="mt-2 text-sm font-semibold text-[#344852]">
                                {form.orderPrefix
                                    .trim()
                                    .toUpperCase() ||
                                    "FTC"}
                                -1750000000000-12
                            </p>
                        </div>
                    </div>
                </section>

                {/* NOTIFICATIONS */}
                <section className="rounded-xl border border-[#E4E9EC] bg-white">

                    <div className="flex items-center gap-3 border-b border-[#E8ECEF] px-5 py-4">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF3F8] text-[#024E82]">
                            <Bell
                                size={18}
                            />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-[#172B38]">
                                Notifications
                            </h2>

                            <p className="mt-1 text-xs text-gray-400">
                                Store notification
                                preferences
                            </p>
                        </div>
                    </div>

                    <div className="p-5">

                        <label className="flex cursor-pointer items-start justify-between gap-5 rounded-xl border border-[#E4E9EC] p-4">

                            <div>
                                <p className="text-sm font-medium text-[#344852]">
                                    Email Notifications
                                </p>

                                <p className="mt-1 max-w-[400px] text-xs leading-5 text-gray-400">
                                    Enable email
                                    notifications
                                    for store
                                    activity.
                                </p>
                            </div>

                            <div className="relative mt-1">

                                <input
                                    type="checkbox"
                                    name="emailNotifications"
                                    checked={
                                        form.emailNotifications
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="peer sr-only"
                                />

                                <div className="h-6 w-11 rounded-full bg-gray-200 transition peer-checked:bg-[#024E82]" />

                                <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                            </div>
                        </label>

                        <div className="mt-4 rounded-lg bg-[#F7F9FB] p-4">

                            <p className="text-xs leading-5 text-gray-500">
                                Status:{" "}
                                <span
                                    className={`font-medium ${
                                        form.emailNotifications
                                            ? "text-green-600"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {form.emailNotifications
                                        ? "Enabled"
                                        : "Disabled"}
                                </span>
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* MOBILE SAVE */}
            <div className="mt-6 sm:hidden">

                <button
                    type="submit"
                    disabled={
                        saving
                    }
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#024E82] text-sm font-medium text-white disabled:opacity-60"
                >
                    <Save
                        size={16}
                    />

                    {saving
                        ? "Saving..."
                        : "Save Changes"}
                </button>
            </div>
        </form>
    );
}