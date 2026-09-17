"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import ProductForm from "@/components/admin/products/ProductForm";
import useAuthStore from "@/store/authStore";

export default function AddProductPage() {
    const router = useRouter();

    const token = useAuthStore(
        (state) => state.token
    );

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleCreateProduct =
        async ({
            product,
            images,
        }) => {
            if (!token) return;

            try {
                setSubmitting(true);
                setError("");

                /* CREATE PRODUCT */
                const response =
                    await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/products`,
                        product,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                const createdProduct =
                    response.data?.data;

                if (
                    !createdProduct?.id
                ) {
                    throw new Error(
                        "Product was created but no product ID was returned."
                    );
                }

                /* CREATE IMAGES */
                for (
                    let index = 0;
                    index <
                    images.length;
                    index++
                ) {
                    await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/productImages/product/${createdProduct.id}`,
                        {
                            imageUrl:
                                images[
                                    index
                                ],

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

                router.push(
                    "/admin/products"
                );
            } catch (error) {
                console.log(
                    "Create product error:",
                    error.response
                        ?.data ||
                        error.message
                );

                setError(
                    error.response
                        ?.data
                        ?.message ||
                        error.message ||
                        "Unable to create product"
                );
            } finally {
                setSubmitting(
                    false
                );
            }
        };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <ProductForm
                onSubmit={
                    handleCreateProduct
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
                submitLabel="Create Product"
            />
        </div>
    );
}