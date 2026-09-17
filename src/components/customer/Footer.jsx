import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#072D49] text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* BRAND */}
          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-[0.16em]"
            >
              FTC
            </Link>

            <p className="mt-4 max-w-[280px] text-sm leading-6 text-white/60">
              Premium factory-direct furniture crafted
              for durability, comfort and timeless interiors.
            </p>
          </div>

          {/* SHOP */}
          <div>
            <h3 className="text-sm font-semibold">
              Shop
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-white/60">
              <Link
                href="/shop"
                className="transition hover:text-white"
              >
                All Products
              </Link>

              <Link
                href="/shop?category=sofas"
                className="transition hover:text-white"
              >
                Sofas
              </Link>

              <Link
                href="/shop?category=chairs"
                className="transition hover:text-white"
              >
                Chairs
              </Link>

              <Link
                href="/shop?category=tables"
                className="transition hover:text-white"
              >
                Tables
              </Link>
            </div>
          </div>

          {/* ACCOUNT */}
          <div>
            <h3 className="text-sm font-semibold">
              Account
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-white/60">
              <Link
                href="/account"
                className="transition hover:text-white"
              >
                My Account
              </Link>

              <Link
                href="/account/orders"
                className="transition hover:text-white"
              >
                Orders
              </Link>

              <Link
                href="/wishlist"
                className="transition hover:text-white"
              >
                Wishlist
              </Link>

              <Link
                href="/cart"
                className="transition hover:text-white"
              >
                Cart
              </Link>
            </div>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-sm font-semibold">
              Support
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-white/60">
              <Link
                href="/contact"
                className="transition hover:text-white"
              >
                Contact Us
              </Link>

              <span>
                Shipping & Delivery
              </span>

              <span>
                Returns & Support
              </span>

              <span>
                Product Care
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 FTC Furniture. All rights reserved.
          </p>

          <div className="flex gap-5">
            <span>
              Privacy Policy
            </span>

            <span>
              Terms
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}