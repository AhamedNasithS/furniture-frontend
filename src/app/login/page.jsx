"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import AuthLayout from "@/components/auth/AuthLayout";
import useAuthStore from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();

  const setLogin = useAuthStore(
    (state) => state.setLogin
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const token =
        response.data.data.token;

      const user =
        response.data.data.user;

      setLogin(user, token);

      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(
        "Login error:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue to your FTC account."
    >
      <form
        onSubmit={handleLogin}
        className="space-y-5"
      >
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

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-[#263238]"
            >
              Password
            </label>

            <button
              type="button"
              className="text-sm text-[#9b7b56] hover:underline"
            >
              Forgot password?
            </button>
          </div>

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
              placeholder="Enter your password"
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

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-md bg-[#102a3a] text-sm font-medium text-white transition hover:bg-[#19394b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Signing in..."
            : "Sign in"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-[#102a3a] hover:underline"
        >
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
}