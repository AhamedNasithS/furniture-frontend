"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Check,
  MapPin,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import Header from "@/components/customer/Header";
import Footer from "@/components/customer/Footer";
import useAuthStore from "@/store/authStore";

const initialForm = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

export default function AddressesPage() {
  const router = useRouter();

  const token = useAuthStore(
    (state) => state.token
  );

  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated
    );

  const [addresses, setAddresses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState(initialForm);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [defaultingId, setDefaultingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const getAddresses = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!token) return;

    try {
      setLoading(true);

      const response =
        await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/addresses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setAddresses(
        response.data?.data || []
      );
    } catch (error) {
      console.log(
        "Get addresses error:",
        error.response?.data ||
        error.message
      );

      setError(
        error.response?.data
          ?.message ||
        "Unable to load addresses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    getAddresses();
  }, [isAuthenticated, token]);

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
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");
    setMessage("");
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const handleAddAddress = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setMessage("");
    setShowForm(true);
  };

  const handleEditAddress = (
    address
  ) => {
    setEditingId(address.id);

    setForm({
      fullName:
        address.fullName || "",
      phone:
        address.phone || "",
      addressLine1:
        address.addressLine1 || "",
      addressLine2:
        address.addressLine2 || "",
      city:
        address.city || "",
      state:
        address.state || "",
      postalCode:
        address.postalCode || "",
      country:
        address.country || "India",
      isDefault:
        Boolean(
          address.isDefault
        ),
    });

    setError("");
    setMessage("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const validateForm = () => {
    if (
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.addressLine1.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.postalCode.trim()
    ) {
      setError(
        "Please complete all required address fields."
      );

      return false;
    }

    return true;
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const body = {
        fullName:
          form.fullName.trim(),

        phone:
          form.phone.trim(),

        addressLine1:
          form.addressLine1.trim(),

        addressLine2:
          form.addressLine2.trim(),

        city:
          form.city.trim(),

        state:
          form.state.trim(),

        postalCode:
          form.postalCode.trim(),

        country:
          form.country.trim() ||
          "India",

        isDefault:
          form.isDefault,
      };

      if (editingId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/addresses/${editingId}`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage(
          "Address updated successfully."
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/addresses`,
          body,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage(
          "Address added successfully."
        );
      }

      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);

      await getAddresses();
    } catch (error) {
      console.log(
        "Save address error:",
        error.response?.data ||
        error.message
      );

      setError(
        error.response?.data
          ?.message ||
        "Unable to save address."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    addressId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this address?"
      );

    if (!confirmed) return;

    try {
      setDeletingId(addressId);
      setError("");
      setMessage("");

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/addresses/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        "Address deleted successfully."
      );

      await getAddresses();
    } catch (error) {
      console.log(
        "Delete address error:",
        error.response?.data ||
        error.message
      );

      setError(
        error.response?.data
          ?.message ||
        "Unable to delete address."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault =
    async (addressId) => {
      try {
        setDefaultingId(
          addressId
        );

        setError("");
        setMessage("");

        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/addresses/${addressId}/default`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage(
          "Default address updated."
        );

        await getAddresses();
      } catch (error) {
        console.log(
          "Default address error:",
          error.response?.data ||
          error.message
        );

        setError(
          error.response?.data
            ?.message ||
          "Unable to update default address."
        );
      } finally {
        setDefaultingId(null);
      }
    };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F7F9FB]">

        {/* PAGE HEADER */}
        <section className="border-b border-[#e5eaed] bg-white">
          <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-10">

            <Link
              href="/account"
              className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 transition hover:text-[#024E82]"
            >
              <ArrowLeft size={15} />

              Back to Account
            </Link>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
                  My Account
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#172B38]">
                  Delivery Addresses
                </h1>

                <p className="mt-3 text-sm text-gray-500">
                  Manage the addresses
                  you use for FTC
                  furniture deliveries.
                </p>
              </div>

              {!showForm && (
                <button
                  type="button"
                  onClick={
                    handleAddAddress
                  }
                  className="flex h-11 items-center justify-center gap-2 rounded-md bg-[#024E82] px-5 text-sm font-medium text-white transition hover:bg-[#013d67]"
                >
                  <Plus size={16} />

                  Add Address
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-10">

          {/* MESSAGES */}
          {message && (
            <div className="mb-5 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">
              <Check size={16} />

              {message}
            </div>
          )}

          {error && !showForm && (
            <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* ADD / EDIT FORM */}
          {showForm && (
            <section className="mb-6 rounded-xl border border-[#e5eaed] bg-white">

              <div className="flex items-center justify-between border-b border-[#edf0f2] px-5 py-4">

                <div>
                  <h2 className="text-base font-semibold text-[#213640]">
                    {editingId
                      ? "Edit Address"
                      : "Add New Address"}
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Enter your delivery
                    information below.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    resetForm
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100"
                >
                  <X size={17} />
                </button>
              </div>

              <form
                onSubmit={
                  handleSubmit
                }
                className="p-5 sm:p-6"
              >
                <div className="grid gap-5 sm:grid-cols-2">

                  {/* FULL NAME */}
                  <div>
                    <label className="text-xs font-medium text-[#344852]">
                      Full Name *
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      value={
                        form.fullName
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter full name"
                      className="mt-2 h-11 w-full rounded-md border border-[#dfe5e8] px-3 text-sm outline-none transition focus:border-[#024E82]"
                    />
                  </div>

                  {/* PHONE */}
                  <div>
                    <label className="text-xs font-medium text-[#344852]">
                      Phone Number *
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={
                        form.phone
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter phone number"
                      className="mt-2 h-11 w-full rounded-md border border-[#dfe5e8] px-3 text-sm outline-none transition focus:border-[#024E82]"
                    />
                  </div>

                  {/* ADDRESS 1 */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-[#344852]">
                      Address Line 1 *
                    </label>

                    <input
                      type="text"
                      name="addressLine1"
                      value={
                        form.addressLine1
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="House / Flat / Street"
                      className="mt-2 h-11 w-full rounded-md border border-[#dfe5e8] px-3 text-sm outline-none transition focus:border-[#024E82]"
                    />
                  </div>

                  {/* ADDRESS 2 */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-[#344852]">
                      Address Line 2
                    </label>

                    <input
                      type="text"
                      name="addressLine2"
                      value={
                        form.addressLine2
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Area / Landmark (optional)"
                      className="mt-2 h-11 w-full rounded-md border border-[#dfe5e8] px-3 text-sm outline-none transition focus:border-[#024E82]"
                    />
                  </div>

                  {/* CITY */}
                  <div>
                    <label className="text-xs font-medium text-[#344852]">
                      City *
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={
                        form.city
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="City"
                      className="mt-2 h-11 w-full rounded-md border border-[#dfe5e8] px-3 text-sm outline-none transition focus:border-[#024E82]"
                    />
                  </div>

                  {/* STATE */}
                  <div>
                    <label className="text-xs font-medium text-[#344852]">
                      State *
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={
                        form.state
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="State"
                      className="mt-2 h-11 w-full rounded-md border border-[#dfe5e8] px-3 text-sm outline-none transition focus:border-[#024E82]"
                    />
                  </div>

                  {/* POSTAL CODE */}
                  <div>
                    <label className="text-xs font-medium text-[#344852]">
                      Postal Code *
                    </label>

                    <input
                      type="text"
                      name="postalCode"
                      value={
                        form.postalCode
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Postal code"
                      className="mt-2 h-11 w-full rounded-md border border-[#dfe5e8] px-3 text-sm outline-none transition focus:border-[#024E82]"
                    />
                  </div>

                  {/* COUNTRY */}
                  <div>
                    <label className="text-xs font-medium text-[#344852]">
                      Country
                    </label>

                    <input
                      type="text"
                      name="country"
                      value={
                        form.country
                      }
                      onChange={
                        handleChange
                      }
                      className="mt-2 h-11 w-full rounded-md border border-[#dfe5e8] px-3 text-sm outline-none transition focus:border-[#024E82]"
                    />
                  </div>
                </div>

                {/* DEFAULT */}
                <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-lg bg-[#F7F9FB] p-4">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={
                      form.isDefault
                    }
                    onChange={
                      handleChange
                    }
                    className="h-4 w-4 accent-[#024E82]"
                  />

                  <div>
                    <p className="text-sm font-medium text-[#263a44]">
                      Make this my default
                      address
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      This address will be
                      preselected during
                      checkout.
                    </p>
                  </div>
                </label>

                {error && (
                  <div className="mt-5 rounded-md bg-red-50 px-4 py-3 text-xs text-red-600">
                    {error}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3">

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex h-11 items-center gap-2 rounded-md bg-[#024E82] px-5 text-sm font-medium text-white transition hover:bg-[#013d67] disabled:opacity-50"
                  >
                    <Save size={15} />

                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Update Address"
                        : "Save Address"}
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={
                      resetForm
                    }
                    className="h-11 rounded-md border border-[#dfe5e8] px-5 text-sm font-medium text-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* LOADING */}
          {loading && (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2].map(
                (item) => (
                  <div
                    key={item}
                    className="h-[260px] animate-pulse rounded-xl bg-white"
                  />
                )
              )}
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            addresses.length === 0 &&
            !showForm && (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-[#e5eaed] bg-white px-6 text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#edf6fa] text-[#024E82]">
                  <MapPin
                    size={28}
                  />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-[#213640]">
                  No saved addresses
                </h2>

                <p className="mt-2 max-w-[420px] text-sm leading-6 text-gray-500">
                  Add a delivery address
                  to make checkout faster.
                </p>

                <button
                  type="button"
                  onClick={
                    handleAddAddress
                  }
                  className="mt-6 flex h-11 items-center gap-2 rounded-md bg-[#024E82] px-5 text-sm font-medium text-white"
                >
                  <Plus size={16} />

                  Add Address
                </button>
              </div>
            )}

          {/* ADDRESS CARDS */}
          {!loading &&
            addresses.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">

                {addresses.map(
                  (address) => (
                    <article
                      key={address.id}
                      className={`relative rounded-xl border bg-white p-5 ${address.isDefault
                        ? "border-[#024E82]"
                        : "border-[#e5eaed]"
                        }`}
                    >

                      {/* DEFAULT BADGE */}
                      {address.isDefault && (
                        <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#edf6fa] px-2.5 py-1 text-[10px] font-semibold uppercase text-[#024E82]">
                          <Check
                            size={11}
                          />

                          Default
                        </span>
                      )}

                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#edf6fa] text-[#024E82]">
                        <MapPin
                          size={18}
                        />
                      </div>

                      <h2 className="mt-4 pr-24 text-base font-semibold text-[#213640]">
                        {
                          address.fullName
                        }
                      </h2>

                      <p className="mt-2 text-sm text-gray-500">
                        {
                          address.phone
                        }
                      </p>

                      <p className="mt-4 text-sm leading-6 text-gray-500">
                        {[
                          address.addressLine1,
                          address.addressLine2,
                          address.city,
                          address.state,
                          address.postalCode,
                          address.country,
                        ]
                          .filter(
                            Boolean
                          )
                          .join(", ")}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2 border-t border-[#edf0f2] pt-4">

                        {/* EDIT */}
                        <button
                          type="button"
                          onClick={() =>
                            handleEditAddress(
                              address
                            )
                          }
                          className="flex h-9 items-center gap-2 rounded-md border border-[#dfe5e8] px-3 text-xs font-medium text-[#344852] transition hover:border-[#024E82] hover:text-[#024E82]"
                        >
                          <Pencil
                            size={13}
                          />

                          Edit
                        </button>

                        {/* SET DEFAULT */}
                        {!address.isDefault && (
                          <button
                            type="button"
                            disabled={
                              defaultingId ===
                              address.id
                            }
                            onClick={() =>
                              handleSetDefault(
                                address.id
                              )
                            }
                            className="h-9 rounded-md border border-[#b9d6e4] px-3 text-xs font-medium text-[#024E82] transition hover:bg-[#edf6fa] disabled:opacity-50"
                          >
                            {defaultingId ===
                              address.id
                              ? "Updating..."
                              : "Set Default"}
                          </button>
                        )}

                        {/* DELETE */}
                        <button
                          type="button"
                          disabled={
                            deletingId ===
                            address.id
                          }
                          onClick={() =>
                            handleDelete(
                              address.id
                            )
                          }
                          className="ml-auto flex h-9 items-center gap-2 rounded-md border border-red-100 px-3 text-xs font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2
                            size={13}
                          />

                          {deletingId ===
                            address.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
        </section>
      </main>

      <Footer />
    </>
  );
}