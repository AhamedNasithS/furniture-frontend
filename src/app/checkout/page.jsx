"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    Check,
    Home,
    MapPin,
    Plus,
    ShoppingBag,
} from "lucide-react";

import Header from "@/components/customer/Header";
import Footer from "@/components/customer/Footer";
import useAuthStore from "@/store/authStore";
import Image from "next/image";

export default function CheckoutPage() {
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] =
        useState("cod");

    const [placingOrder, setPlacingOrder] =
        useState(false);

    const [orderError, setOrderError] =
        useState("");

    const [placedOrder, setPlacedOrder] =
        useState(null);

    const token = useAuthStore(
        (state) => state.token
    );

    const isAuthenticated = useAuthStore(
        (state) => state.isAuthenticated
    );

    const [addresses, setAddresses] =
        useState([]);

    const [
        selectedAddressId,
        setSelectedAddressId,
    ] = useState(null);

    const [cartItems, setCartItems] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const getProduct = (item) =>
        item.product || item.Product || item;

    const getSellingPrice = (product) => {
        const regularPrice = Number(
            product?.price || 0
        );

        const discountPrice =
            product?.discountPrice !== null &&
                product?.discountPrice !== undefined
                ? Number(product.discountPrice)
                : null;

        if (
            discountPrice !== null &&
            discountPrice < regularPrice
        ) {
            return discountPrice;
        }

        return regularPrice;
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            setOrderError(
                "Please select a delivery address."
            );
            return;
        }

        if (cartItems.length === 0) {
            setOrderError(
                "Your cart is empty."
            );
            return;
        }

        // Prevent duplicate clicks
        if (placingOrder) {
            return;
        }

        try {
            setPlacingOrder(true);
            setOrderError("");

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/orders`,
                {
                    addressId: selectedAddressId,
                    paymentMethod,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const order =
                response.data?.data;

            setPlacedOrder(order);

            // Backend already clears the cart
            setCartItems([]);
        } catch (error) {
            console.log(
                "Place order error:",
                error.response?.data ||
                error.message
            );

            setOrderError(
                error.response?.data?.message ||
                "Unable to place your order. Please try again."
            );
        } finally {
            setPlacingOrder(false);
        }
    };

    const getCheckoutData = async () => {
        if (!isAuthenticated || !token) {
            setLoading(false);
            router.push("/login");
            return;
        }

        try {
            setLoading(true);

            const [
                addressResponse,
                cartResponse,
            ] = await Promise.all([
                axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/addresses`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ),

                axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/cart`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ),
            ]);

            // ADDRESSES
            const addressData =
                addressResponse.data?.data || [];

            setAddresses(addressData);

            const defaultAddress =
                addressData.find(
                    (item) =>
                        item.isDefault === true
                );

            if (defaultAddress) {
                setSelectedAddressId(
                    defaultAddress.id
                );
            } else if (
                addressData.length > 0
            ) {
                setSelectedAddressId(
                    addressData[0].id
                );
            }

            // CART
            const cartData =
                cartResponse.data?.data;

            const items = Array.isArray(
                cartData
            )
                ? cartData
                : cartData?.items || [];

            setCartItems(items);
        } catch (error) {
            console.log(
                "Checkout data error:",
                error.response?.data ||
                error.message
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) return;

        getCheckoutData();
    }, [isAuthenticated, token]);

    const subtotal = useMemo(() => {
        return cartItems.reduce(
            (total, item) => {
                const product =
                    getProduct(item);

                const price =
                    getSellingPrice(product);

                const quantity = Number(
                    item.quantity || 1
                );

                return (
                    total +
                    price * quantity
                );
            },
            0
        );
    }, [cartItems]);

    const totalSavings = useMemo(() => {
        return cartItems.reduce(
            (total, item) => {
                const product =
                    getProduct(item);

                const regularPrice = Number(
                    product?.price || 0
                );

                const sellingPrice =
                    getSellingPrice(product);

                const quantity = Number(
                    item.quantity || 1
                );

                return (
                    total +
                    (regularPrice -
                        sellingPrice) *
                    quantity
                );
            },
            0
        );
    }, [cartItems]);

    if (placedOrder) {
        return (
            <>
                <Header />

                <main className="flex min-h-[70vh] items-center justify-center bg-[#F7F9FB] px-4 py-12">
                    <div className="w-full max-w-[600px] rounded-2xl border border-[#e5eaed] bg-white p-6 text-center shadow-sm sm:p-10">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                            <Check
                                size={30}
                                className="text-green-600"
                            />
                        </div>

                        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
                            Order Confirmed
                        </p>

                        <h1 className="mt-2 text-2xl font-semibold text-[#172B38]">
                            Thank you for your order
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-gray-500">
                            Your FTC furniture order
                            has been placed successfully.
                        </p>

                        <div className="mt-7 rounded-xl bg-[#F7F9FB] p-5 text-left">
                            <div className="flex justify-between gap-4 text-sm">
                                <span className="text-gray-500">
                                    Order Number
                                </span>

                                <span className="font-semibold text-[#213640]">
                                    {placedOrder.orderNumber}
                                </span>
                            </div>

                            <div className="mt-4 flex justify-between gap-4 text-sm">
                                <span className="text-gray-500">
                                    Payment
                                </span>

                                <span className="font-medium capitalize text-[#213640]">
                                    {placedOrder.paymentMethod ===
                                        "cod"
                                        ? "Cash on Delivery"
                                        : placedOrder.paymentMethod}
                                </span>
                            </div>

                            <div className="mt-4 flex justify-between gap-4 text-sm">
                                <span className="text-gray-500">
                                    Shipping
                                </span>

                                <span className="font-medium text-[#213640]">
                                    ₹
                                    {Number(
                                        placedOrder.shippingFee ||
                                        0
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </span>
                            </div>

                            <div className="mt-4 border-t border-[#e3e9ec] pt-4">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="font-semibold text-[#213640]">
                                        Order Total
                                    </span>

                                    <span className="text-lg font-bold text-[#024E82]">
                                        ₹
                                        {Number(
                                            placedOrder.totalAmount ||
                                            0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Link
                                href="/shop"
                                className="flex h-11 items-center justify-center rounded-md border border-[#dfe5e8] px-5 text-sm font-medium text-[#42545d]"
                            >
                                Continue Shopping
                            </Link>

                            <Link
                                href={`/account/orders/${placedOrder.id}`}
                                className="flex h-11 items-center justify-center rounded-md bg-[#024E82] px-5 text-sm font-medium text-white"
                            >
                                View Order
                            </Link>
                        </div>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Header />

                <main className="min-h-screen bg-[#F7F9FB]">
                    <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
                        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                            <div className="h-[500px] animate-pulse rounded-xl bg-white" />

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
                    <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-10">
                        <Link
                            href="/cart"
                            className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 transition hover:text-[#024E82]"
                        >
                            <ArrowLeft size={15} />

                            Back to Cart
                        </Link>

                        <div className="mt-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
                                Secure Checkout
                            </p>

                            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#172B38]">
                                Delivery & Order Review
                            </h1>

                            <p className="mt-3 text-sm text-gray-500">
                                Confirm your delivery
                                address and review your
                                furniture before placing
                                the order.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10">
                    <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">

                        {/* LEFT */}
                        <div className="space-y-6">

                            {/* ADDRESS */}
                            <section className="rounded-xl border border-[#e5eaed] bg-white">
                                <div className="flex items-center justify-between border-b border-[#edf0f2] px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edf6fa] text-[#024E82]">
                                            <MapPin size={18} />
                                        </div>

                                        <div>
                                            <h2 className="text-base font-semibold text-[#213640]">
                                                Delivery Address
                                            </h2>

                                            <p className="mt-1 text-xs text-gray-400">
                                                Choose where your
                                                order should be delivered.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* NO ADDRESS */}
                                {addresses.length === 0 ? (
                                    <div className="p-6">
                                        <div className="rounded-xl border border-dashed border-[#ccd9df] bg-[#fafcfd] p-8 text-center">
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#edf6fa] text-[#024E82]">
                                                <Home size={21} />
                                            </div>

                                            <h3 className="mt-4 text-sm font-semibold text-[#213640]">
                                                No saved address
                                            </h3>

                                            <p className="mx-auto mt-2 max-w-[400px] text-xs leading-5 text-gray-500">
                                                Add a delivery address
                                                before continuing with
                                                checkout.
                                            </p>

                                            <Link
                                                href="/account/addresses"
                                                className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-[#024E82] px-4 text-xs font-medium text-white"
                                            >
                                                <Plus size={15} />

                                                Add Address
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid gap-3 p-5 sm:grid-cols-2">
                                        {addresses.map(
                                            (address) => {
                                                const isSelected =
                                                    selectedAddressId ===
                                                    address.id;

                                                return (
                                                    <button
                                                        key={
                                                            address.id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedAddressId(
                                                                address.id
                                                            )
                                                        }
                                                        className={`relative rounded-xl border p-4 text-left transition ${isSelected
                                                            ? "border-[#024E82] bg-[#f3f9fc]"
                                                            : "border-[#e1e7ea] bg-white hover:border-[#9dbac9]"
                                                            }`}
                                                    >
                                                        {isSelected && (
                                                            <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#024E82] text-white">
                                                                <Check
                                                                    size={
                                                                        14
                                                                    }
                                                                />
                                                            </span>
                                                        )}

                                                        <div className="pr-8">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm font-semibold text-[#213640]">
                                                                    {address.fullName}
                                                                </p>

                                                                {address.isDefault && (
                                                                    <span className="rounded-full bg-[#eaf5fb] px-2 py-1 text-[9px] font-semibold uppercase text-[#024E82]">
                                                                        Default
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <p className="mt-3 text-xs leading-5 text-gray-500">
                                                                {[
                                                                    address.addressLine1,
                                                                    address.addressLine2,
                                                                    address.city,
                                                                    address.state,
                                                                    address.postalCode,
                                                                    address.country,
                                                                ]
                                                                    .filter(Boolean)
                                                                    .join(", ")}
                                                            </p>

                                                            <p className="mt-2 text-xs text-gray-500">
                                                                {address.phone}
                                                            </p>
                                                        </div>
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>
                                )}

                                {addresses.length > 0 && (
                                    <div className="border-t border-[#edf0f2] px-5 py-4">
                                        <Link
                                            href="/account/addresses"
                                            className="inline-flex items-center gap-2 text-xs font-medium text-[#024E82]"
                                        >
                                            <Plus size={14} />

                                            Add another address
                                        </Link>
                                    </div>
                                )}
                            </section>

                            <section className="rounded-xl border border-[#e5eaed] bg-white">
                                <div className="border-b border-[#edf0f2] px-5 py-4">
                                    <h2 className="text-base font-semibold text-[#213640]">
                                        Payment Method
                                    </h2>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Choose how you would like to pay.
                                    </p>
                                </div>

                                <div className="p-5">
                                    {/* COD */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPaymentMethod("cod")
                                        }
                                        className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${paymentMethod === "cod"
                                            ? "border-[#024E82] bg-[#f3f9fc]"
                                            : "border-[#e1e7ea]"
                                            }`}
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-[#213640]">
                                                Cash on Delivery
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                                Pay when your FTC furniture
                                                reaches your delivery address.
                                            </p>
                                        </div>

                                        <div
                                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${paymentMethod === "cod"
                                                ? "border-[#024E82] bg-[#024E82]"
                                                : "border-gray-300"
                                                }`}
                                        >
                                            {paymentMethod === "cod" && (
                                                <Check
                                                    size={12}
                                                    className="text-white"
                                                />
                                            )}
                                        </div>
                                    </button>

                                    {/* ONLINE PAYMENT */}
                                    <div className="mt-3 flex items-center justify-between rounded-xl border border-[#e5eaed] bg-gray-50 p-4 opacity-60">
                                        <div>
                                            <p className="text-sm font-semibold text-[#213640]">
                                                Online Payment
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                Card / UPI / Net Banking
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-gray-200 px-2.5 py-1 text-[10px] font-medium text-gray-500">
                                            Coming Soon
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* PRODUCTS */}
                            <section className="rounded-xl border border-[#e5eaed] bg-white">
                                <div className="flex items-center gap-3 border-b border-[#edf0f2] px-5 py-4">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edf6fa] text-[#024E82]">
                                        <ShoppingBag
                                            size={18}
                                        />
                                    </div>

                                    <div>
                                        <h2 className="text-base font-semibold text-[#213640]">
                                            Order Items
                                        </h2>

                                        <p className="mt-1 text-xs text-gray-400">
                                            {cartItems.length}{" "}
                                            {cartItems.length ===
                                                1
                                                ? "item"
                                                : "items"}{" "}
                                            in this order
                                        </p>
                                    </div>
                                </div>

                                <div className="divide-y divide-[#edf0f2]">
                                    {cartItems.map(
                                        (item) => {
                                            const product =
                                                getProduct(item);

                                            const quantity =
                                                Number(
                                                    item.quantity ||
                                                    1
                                                );

                                            const image =
                                                product.images?.find(
                                                    (img) =>
                                                        img.isPrimary
                                                ) ||
                                                product.images?.[0];

                                            const price =
                                                getSellingPrice(
                                                    product
                                                );

                                            return (
                                                <div
                                                    key={
                                                        item.id ||
                                                        product.id
                                                    }
                                                    className="flex gap-4 p-5"
                                                >
                                                    <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-[#edf1f3]">
                                                        {image ? (
                                                            <Image
                                                                src={
                                                                    image.imageUrl
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center text-xs text-gray-300">
                                                                No image
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="line-clamp-2 text-sm font-semibold text-[#213640]">
                                                            {
                                                                product.name
                                                            }
                                                        </h3>

                                                        <p className="mt-2 text-xs text-gray-400">
                                                            Qty:{" "}
                                                            {
                                                                quantity
                                                            }
                                                        </p>
                                                    </div>

                                                    <p className="shrink-0 text-sm font-semibold text-[#024E82]">
                                                        ₹
                                                        {(
                                                            price *
                                                            quantity
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </p>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* ORDER SUMMARY */}
                        <aside className="rounded-xl border border-[#e5eaed] bg-white p-5 lg:sticky lg:top-24">
                            <h2 className="text-lg font-semibold text-[#213640]">
                                Order Summary
                            </h2>

                            <div className="mt-5 space-y-4 border-b border-[#edf0f2] pb-5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Subtotal
                                    </span>

                                    <span className="font-medium text-[#263a44]">
                                        ₹
                                        {subtotal.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>
                                </div>

                                {totalSavings > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">
                                            Savings
                                        </span>

                                        <span className="font-medium text-green-600">
                                            -₹
                                            {totalSavings.toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between gap-4 text-sm">
                                    <span className="text-gray-500">
                                        Delivery
                                    </span>

                                    <span className="text-right text-xs font-medium text-[#024E82]">
                                        Calculated when order is placed
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-end justify-between pt-5">
                                <div>
                                    <p className="text-sm font-semibold text-[#213640]">
                                        Product Subtotal
                                    </p>

                                    <p className="mt-1 text-[11px] text-gray-400">
                                        Final order amount
                                    </p>
                                </div>

                                <p className="text-xl font-bold text-[#024E82]">
                                    ₹
                                    {subtotal.toLocaleString(
                                        "en-IN"
                                    )}
                                </p>
                            </div>

                            {/* NEXT STEP BUTTON */}
                            <button
                                type="button"
                                onClick={handlePlaceOrder}
                                disabled={
                                    !selectedAddressId ||
                                    cartItems.length === 0 ||
                                    placingOrder
                                }
                                className="mt-6 flex h-12 w-full items-center justify-center rounded-md bg-[#024E82] text-sm font-medium text-white transition hover:bg-[#013d67] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {placingOrder
                                    ? "Placing Order..."
                                    : "Place Order"}
                            </button>

                            {orderError && (
                                <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-center text-xs text-red-600">
                                    {orderError}
                                </div>
                            )}

                            {!selectedAddressId &&
                                addresses.length > 0 && (
                                    <p className="mt-3 text-center text-xs text-red-500">
                                        Select a delivery
                                        address to continue.
                                    </p>
                                )}

                            <div className="mt-5 rounded-lg bg-[#f6fafc] p-4">
                                <p className="text-xs leading-5 text-gray-500">
                                    Your delivery address
                                    and product details will
                                    be saved with the order
                                    when checkout is completed.
                                </p>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}