import Link from "next/link";

export default function AuthLayout({
  children,
  title,
  description,
}) {
  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT BRAND SECTION */}
        <div className="hidden bg-[#102a3a] lg:flex lg:flex-col lg:justify-between lg:p-14">
          <Link
            href="/"
            className="text-3xl font-semibold tracking-widest text-white"
          >
            FTC
          </Link>

          <div className="max-w-lg">
            <p className="mb-4 text-sm uppercase tracking-widest text-white/60">
              Premium Furniture
            </p>

            <h1 className="text-5xl font-medium leading-tight text-white">
              Designed for the
              <br />
              way you live.
            </h1>

            <p className="mt-6 max-w-md leading-7 text-white/60">
              Discover thoughtfully designed furniture
              made to bring comfort, style and character
              into your home.
            </p>
          </div>

          <p className="text-sm text-white/40">
            © 2026 FTC Furniture
          </p>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}
            <Link
              href="/"
              className="mb-10 block text-2xl font-semibold tracking-widest text-[#102a3a] lg:hidden"
            >
              FTC
            </Link>

            <div className="mb-8">
              <h2 className="text-4xl font-semibold tracking-tight text-[#102a3a]">
                {title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                {description}
              </p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}