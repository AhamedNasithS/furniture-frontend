import { create } from "zustand";
import axios from "axios";

const useCartStore = create((set) => ({
    cartCount: 0,

    setCartCount: (count) => {
        set({
            cartCount: Number(count) || 0,
        });
    },

    fetchCartCount: async (token) => {
        if (!token) {
            set({
                cartCount: 0,
            });

            return;
        }

        try {
            const response =
                await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/cart`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

            const data =
                response.data?.data;

            const items =
                Array.isArray(data)
                    ? data
                    : data?.items || [];

            const totalQuantity =
                items.reduce(
                    (total, item) =>
                        total +
                        Number(
                            item.quantity || 0
                        ),
                    0
                );

            set({
                cartCount:
                    totalQuantity,
            });
        } catch (error) {
            console.log(
                "Cart count error:",
                error.response?.data ||
                    error.message
            );

            set({
                cartCount: 0,
            });
        }
    },

    clearCartCount: () => {
        set({
            cartCount: 0,
        });
    },
}));

export default useCartStore;