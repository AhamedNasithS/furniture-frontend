"use client";

import axios from "axios";
import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
    useRouter,
} from "next/navigation";

import ProductForm from "@/components/admin/products/ProductForm";
import useAuthStore from "@/store/authStore";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();

    const productId = params.id;

    const token = useAuthStore(
        (state) => state.token
    );

    const [product, setProduct] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    /* --------------------------------
       LOAD PRODUCT + EXISTING IMAGES
    -------------------------------- */

    useEffect(() => {
        if (!productId) return;

        const getProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    productResponse,
                    imagesResponse,
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
                        `${process.env.NEXT_PUBLIC_API_URL}/productImages/product/${productId}`
                    ),
                ]);

                const productData =
                    productResponse.data
                        ?.data;

                const images =
                    imagesResponse.data
                        ?.data || [];

                if (!productData) {
                    throw new Error(
                        "Product not found"
                    );
                }

                setProduct({
                    ...productData,

                    images: [...images].sort(
                        (a, b) =>
                            Number(
                                a.sortOrder
                            ) -
                            Number(
                                b.sortOrder
                            )
                    ),
                });
            } catch (error) {
                console.log(
                    "Get product error:",
                    error.response
                        ?.data ||
                    error.message
                );

                setError(
                    error.response
                        ?.data
                        ?.message ||
                    error.message ||
                    "Unable to load product"
                );
            } finally {
                setLoading(false);
            }
        };

        getProduct();
    }, [productId]);

    /* --------------------------------
       UPDATE PRODUCT
    -------------------------------- */

    const handleUpdateProduct =
        async ({
            product: productForm,
            images,
        }) => {
            if (!token || !product) {
                return;
            }

            try {
                setSubmitting(true);
                setError("");

                /* 1. UPDATE PRODUCT DATA */

                await axios.put(
                    `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
                    productForm,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                /* 2. EXISTING IMAGES */

                const existingImages =
                    product.images || [];

                /*
                 * Example:
                 *
                 * Existing:
                 * A, B, C
                 *
                 * Form:
                 * A, C
                 *
                 * Result:
                 * A, C
                 */

                for (
                    let index = 0;
                    index <
                    images.length;
                    index++
                ) {
                    const imageUrl =
                        images[index];

                    const existingImage =
                        existingImages[
                        index
                        ];

                    /* UPDATE EXISTING */
                    if (existingImage) {
                        await axios.put(
                            `${process.env.NEXT_PUBLIC_API_URL}/productImages/${existingImage.id}`,
                            {
                                imageUrl,

                                sortOrder:
                                    index,

                                isPrimary:
                                    index ===
                                    0,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        continue;
                    }

                    /* CREATE NEW IMAGE */
                    await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/productImages/product/${productId}`,
                        {
                            imageUrl,

                            sortOrder:
                                index,

                            isPrimary:
                                index ===
                                0,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                }

                /* 3. DELETE REMOVED IMAGES */

                if (
                    existingImages.length >
                    images.length
                ) {
                    const removedImages =
                        existingImages.slice(
                            images.length
                        );

                    for (
                        const image of
                        removedImages
                    ) {
                        await axios.delete(
                            `${process.env.NEXT_PUBLIC_API_URL}/productImages/${image.id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                    }
                }

                /* FINISHED */

                router.push(
                    "/admin/products"
                );
            } catch (error) {
                console.log(
                    "Update product error:",
                    error.response
                        ?.data ||
                    error.message
                );

                setError(
                    error.response
                        ?.data
                        ?.message ||
                    error.message ||
                    "Unable to update product"
                );
            } finally {
                setSubmitting(false);
            }
        };

    /* --------------------------------
       LOADING
    -------------------------------- */

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#DDE7EC] border-t-[#024E82]" />

                    <p className="mt-4 text-sm text-gray-400">
                        Loading product...
                    </p>
                </div>
            </div>
        );
    }

    /* --------------------------------
       LOAD ERROR
    -------------------------------- */

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
                                "/admin/products"
                            )
                        }
                        className="mt-4 text-sm font-medium text-[#024E82]"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <ProductForm
                initialData={
                    product
                }
                onSubmit={
                    handleUpdateProduct
                }
                onCancel={() =>
                    router.push(
                        "/admin/products"
                    )
                }
                submitting={
                    submitting
                }
                serverError={
                    error
                }
                submitLabel="Update Product"
            />
        </div>
    );
}