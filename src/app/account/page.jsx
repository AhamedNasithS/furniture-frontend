"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    useEffect,
    useState,
} from "react";

import {
    Heart,
    MapPin,
    Package,
    Pencil,
    Save,
    User,
    X,
} from "lucide-react";

import Header from "@/components/customer/Header";
import Footer from "@/components/customer/Footer";
import useAuthStore from "@/store/authStore";
import LogoutButton from "@/components/auth/LogoutButton";

export default function AccountPage() {
    const router = useRouter();

    const token = useAuthStore(
        (state) => state.token
    );

    const isAuthenticated =
        useAuthStore(
            (state) =>
                state.isAuthenticated
        );

    const setLogin = useAuthStore(
        (state) => state.setLogin
    );

    const [profile, setProfile] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [editing, setEditing] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
    });

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const getProfile = async () => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        if (!token) return;

        try {
            setLoading(true);

            const response =
                await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/customer/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

            const data =
                response.data?.data;

            setProfile(data);

            setForm({
                name: data?.name || "",
                email: data?.email || "",
            });
        } catch (error) {
            console.log(
                "Get profile error:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data
                    ?.message ||
                "Unable to load profile."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) return;
        getProfile();
    }, [isAuthenticated, token]);

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

    const handleCancelEdit = () => {
        setForm({
            name: profile?.name || "",
            email: profile?.email || "",
        });

        setEditing(false);
        setError("");
        setMessage("");
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!form.name.trim()) {
            setError(
                "Name is required."
            );
            return;
        }

        if (!form.email.trim()) {
            setError(
                "Email is required."
            );
            return;
        }

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const response =
                await axios.put(
                    `${process.env.NEXT_PUBLIC_API_URL}/customer/profile`,
                    {
                        name: form.name.trim(),
                        email:
                            form.email.trim(),
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

            const updatedUser =
                response.data?.data;

            setProfile((prev) => ({
                ...prev,
                ...updatedUser,
            }));

            // Keep Zustand auth user updated
            setLogin(
                updatedUser,
                token
            );

            setMessage(
                "Profile updated successfully."
            );

            setEditing(false);
        } catch (error) {
            console.log(
                "Update profile error:",
                error.response?.data ||
                error.message
            );

            setError(
                error.response?.data
                    ?.message ||
                "Unable to update profile."
            );
        } finally {
            setSaving(false);
        }
    };

    const defaultAddress =
        profile?.addresses?.find(
            (address) =>
                address.isDefault
        ) ||
        profile?.addresses?.[0];

    if (loading) {
        return (
            <>
                <Header />

                <main className="min-h-screen bg-[#F7F9FB]">
                    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-10">
                        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
                            <div className="h-[420px] animate-pulse rounded-xl bg-white" />

                            <div className="h-[420px] animate-pulse rounded-xl bg-white" />
                        </div>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <main className="min-h-screen bg-[#F7F9FB]">

                {/* HEADER */}
                <section className="border-b border-[#e5eaed] bg-white">
                    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-10 relative flex flex-col md:flex-row gap-4 justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
                                My Account
                            </p>

                            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#172B38]">
                                Account Overview
                            </h1>

                            <p className="mt-3 text-sm text-gray-500">
                                Manage your FTC profile,
                                orders, addresses and saved
                                furniture.
                            </p>
                        </div>
                        <LogoutButton />
                    </div>
                </section>

                <section className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-10">

                    {/* QUICK LINKS */}
                    <div className="grid gap-4 sm:grid-cols-3">

                        <Link
                            href="/account/orders"
                            className="group rounded-xl border border-[#e5eaed] bg-white p-5 transition hover:border-[#b7cdd8] hover:shadow-sm"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#edf6fa] text-[#024E82]">
                                <Package size={19} />
                            </div>

                            <h2 className="mt-4 text-sm font-semibold text-[#213640]">
                                My Orders
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                Track and manage your
                                furniture orders.
                            </p>
                        </Link>

                        <Link
                            href="/account/addresses"
                            className="group rounded-xl border border-[#e5eaed] bg-white p-5 transition hover:border-[#b7cdd8] hover:shadow-sm"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#edf6fa] text-[#024E82]">
                                <MapPin size={19} />
                            </div>

                            <h2 className="mt-4 text-sm font-semibold text-[#213640]">
                                Addresses
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                Manage your saved
                                delivery addresses.
                            </p>
                        </Link>

                        <Link
                            href="/wishlist"
                            className="group rounded-xl border border-[#e5eaed] bg-white p-5 transition hover:border-[#b7cdd8] hover:shadow-sm"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#edf6fa] text-[#024E82]">
                                <Heart size={19} />
                            </div>

                            <h2 className="mt-4 text-sm font-semibold text-[#213640]">
                                Wishlist
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                View furniture you have
                                saved for later.
                            </p>
                        </Link>
                    </div>

                    <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_340px]">

                        {/* PROFILE */}
                        <section className="rounded-xl border border-[#e5eaed] bg-white">
                            <div className="flex items-center justify-between border-b border-[#edf0f2] px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf6fa] text-[#024E82]">
                                        <User size={19} />
                                    </div>

                                    <div>
                                        <h2 className="text-base font-semibold text-[#213640]">
                                            Personal Information
                                        </h2>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Your FTC account
                                            details
                                        </p>
                                    </div>
                                </div>

                                {!editing && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditing(true);
                                            setError("");
                                            setMessage("");
                                        }}
                                        className="flex h-9 items-center gap-2 rounded-md border border-[#dfe5e8] px-3 text-xs font-medium text-[#344852] transition hover:border-[#024E82] hover:text-[#024E82]"
                                    >
                                        <Pencil
                                            size={14}
                                        />

                                        Edit
                                    </button>
                                )}
                            </div>

                            <form
                                onSubmit={
                                    handleSave
                                }
                                className="p-5"
                            >
                                <div className="grid gap-5 sm:grid-cols-2">

                                    {/* NAME */}
                                    <div>
                                        <label className="text-xs font-medium text-[#344852]">
                                            Full Name
                                        </label>

                                        {editing ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={
                                                    form.name
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="mt-2 h-11 w-full rounded-md border border-[#dfe5e8] px-3 text-sm text-[#263a44] outline-none transition focus:border-[#024E82]"
                                            />
                                        ) : (
                                            <div className="mt-2 rounded-md bg-[#F7F9FB] px-3 py-3 text-sm font-medium text-[#263a44]">
                                                {profile?.name ||
                                                    "—"}
                                            </div>
                                        )}
                                    </div>

                                    {/* EMAIL */}
                                    <div>
                                        <label className="text-xs font-medium text-[#344852]">
                                            Email Address
                                        </label>

                                        {editing ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={
                                                    form.email
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                className="mt-2 h-11 w-full rounded-md border border-[#dfe5e8] px-3 text-sm text-[#263a44] outline-none transition focus:border-[#024E82]"
                                            />
                                        ) : (
                                            <div className="mt-2 rounded-md bg-[#F7F9FB] px-3 py-3 text-sm font-medium text-[#263a44]">
                                                {profile?.email ||
                                                    "—"}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <p className="text-xs font-medium text-[#344852]">
                                        Account Type
                                    </p>

                                    <span className="mt-2 inline-flex rounded-full bg-[#edf6fa] px-3 py-1.5 text-xs font-semibold capitalize text-[#024E82]">
                                        {profile?.role ||
                                            "customer"}
                                    </span>
                                </div>

                                {error && (
                                    <div className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
                                        {error}
                                    </div>
                                )}

                                {message && (
                                    <div className="mt-5 rounded-md bg-green-50 px-4 py-3 text-sm text-green-600">
                                        {message}
                                    </div>
                                )}

                                {editing && (
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="flex h-10 items-center gap-2 rounded-md bg-[#024E82] px-4 text-xs font-medium text-white transition hover:bg-[#013d67] disabled:opacity-50"
                                        >
                                            <Save
                                                size={14}
                                            />

                                            {saving
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </button>

                                        <button
                                            type="button"
                                            disabled={saving}
                                            onClick={
                                                handleCancelEdit
                                            }
                                            className="flex h-10 items-center gap-2 rounded-md border border-[#dfe5e8] px-4 text-xs font-medium text-gray-500"
                                        >
                                            <X
                                                size={14}
                                            />

                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </form>
                        </section>

                        {/* ADDRESS SUMMARY */}
                        <aside className="rounded-xl border border-[#e5eaed] bg-white p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#edf6fa] text-[#024E82]">
                                    <MapPin size={18} />
                                </div>

                                <div>
                                    <h2 className="text-sm font-semibold text-[#213640]">
                                        Default Address
                                    </h2>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Delivery information
                                    </p>
                                </div>
                            </div>

                            {defaultAddress ? (
                                <div className="mt-5">
                                    <p className="text-sm font-semibold text-[#263a44]">
                                        {defaultAddress.fullName}
                                    </p>

                                    <p className="mt-3 text-xs leading-6 text-gray-500">
                                        {[
                                            defaultAddress.addressLine1,
                                            defaultAddress.addressLine2,
                                            defaultAddress.city,
                                            defaultAddress.state,
                                            defaultAddress.postalCode,
                                            defaultAddress.country,
                                        ]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </p>

                                    <p className="mt-2 text-xs text-gray-500">
                                        {defaultAddress.phone}
                                    </p>

                                    <Link
                                        href="/account/addresses"
                                        className="mt-5 inline-flex text-xs font-medium text-[#024E82]"
                                    >
                                        Manage Addresses →
                                    </Link>
                                </div>
                            ) : (
                                <div className="mt-5 rounded-lg bg-[#F7F9FB] p-4">
                                    <p className="text-xs leading-5 text-gray-500">
                                        You have not added
                                        any delivery addresses
                                        yet.
                                    </p>

                                    <Link
                                        href="/account/addresses"
                                        className="mt-3 inline-flex text-xs font-medium text-[#024E82]"
                                    >
                                        Add Address →
                                    </Link>
                                </div>
                            )}

                            <div className="mt-6 border-t border-[#edf0f2] pt-5">
                                <Link
                                    href="/account/password"
                                    className="text-xs font-medium text-[#024E82]"
                                >
                                    Change Password →
                                </Link>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}