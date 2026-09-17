"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import AuthLayout from "@/components/auth/AuthLayout";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      router.push("/login");
    } catch (error) {
      console.log(
        "Register error:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      description="Create your FTC account and start exploring premium furniture."
    >
      <form
        onSubmit={handleRegister}
        className="space-y-5"
      >
        {/* NAME */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-[#263238]"
          >
            Full name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
            className="h-12 w-full rounded-md border border-[#d9d9d4] bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#102a3a]"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-[#263238]"
          >
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            className="h-12 w-full rounded-md border border-[#d9d9d4] bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#102a3a]"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-[#263238]"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              className="h-12 w-full rounded-md border border-[#d9d9d4] bg-white px-4 pr-16 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#102a3a]"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500"
            >
              {showPassword
                ? "Hide"
                : "Show"}
            </button>
          </div>
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-[#263238]"
          >
            Confirm password
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={
              formData.confirmPassword
            }
            onChange={handleChange}
            required
            placeholder="Re-enter your password"
            className="h-12 w-full rounded-md border border-[#d9d9d4] bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#102a3a]"
          />
        </div>

        {/* ERROR */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-md bg-[#102a3a] text-sm font-medium text-white transition hover:bg-[#19394b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Creating account..."
            : "Create account"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[#102a3a] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}