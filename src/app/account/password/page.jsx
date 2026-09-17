"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import Header from "@/components/customer/Header";
import Footer from "@/components/customer/Footer";
import useAuthStore from "@/store/authStore";

export default function ChangePasswordPage() {
  const router = useRouter();

  const token = useAuthStore(
    (state) => state.token
  );

  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated
    );

  const [form, setForm] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (
      !form.currentPassword ||
      !form.newPassword ||
      !form.confirmPassword
    ) {
      setError(
        "Please complete all password fields."
      );
      return;
    }

    if (
      form.newPassword.length < 6
    ) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (
      form.newPassword !==
      form.confirmPassword
    ) {
      setError(
        "New password and confirm password do not match."
      );
      return;
    }

    if (
      form.currentPassword ===
      form.newPassword
    ) {
      setError(
        "New password must be different from your current password."
      );
      return;
    }

    try {
      setSaving(true);

      const response =
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/customer/changePassword`,
          {
            currentPassword:
              form.currentPassword,

            newPassword:
              form.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      setMessage(
        response.data?.message ||
          "Password changed successfully."
      );

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.log(
        "Change password error:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data
          ?.message ||
          "Unable to change password."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F7F9FB]">

        {/* HEADER */}
        <section className="border-b border-[#e5eaed] bg-white">
          <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-6 lg:px-10">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 transition hover:text-[#024E82]"
            >
              <ArrowLeft size={15} />

              Back to Account
            </Link>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
                Account Security
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#172B38]">
                Change Password
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Update your FTC account
                password to keep your
                account secure.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[900px] px-4 py-8 sm:px-6 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">

            {/* FORM */}
            <section className="rounded-xl border border-[#e5eaed] bg-white">
              <div className="flex items-center gap-3 border-b border-[#edf0f2] px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#edf6fa] text-[#024E82]">
                  <LockKeyhole
                    size={19}
                  />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-[#213640]">
                    Update Password
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Enter your current
                    password before
                    choosing a new one.
                  </p>
                </div>
              </div>

              <form
                onSubmit={
                  handleSubmit
                }
                className="p-5 sm:p-6"
              >
                {/* CURRENT PASSWORD */}
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="text-xs font-medium text-[#344852]"
                  >
                    Current Password
                  </label>

                  <div className="relative mt-2">
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type={
                        showCurrentPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        form.currentPassword
                      }
                      onChange={
                        handleChange
                      }
                      autoComplete="current-password"
                      placeholder="Enter current password"
                      className="h-11 w-full rounded-md border border-[#dfe5e8] px-3 pr-11 text-sm text-[#263a44] outline-none transition focus:border-[#024E82]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(
                          (prev) =>
                            !prev
                        )
                      }
                      className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-gray-400 transition hover:text-[#024E82]"
                      aria-label="Toggle current password visibility"
                    >
                      {showCurrentPassword ? (
                        <EyeOff
                          size={17}
                        />
                      ) : (
                        <Eye
                          size={17}
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* NEW PASSWORD */}
                <div className="mt-5">
                  <label
                    htmlFor="newPassword"
                    className="text-xs font-medium text-[#344852]"
                  >
                    New Password
                  </label>

                  <div className="relative mt-2">
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        form.newPassword
                      }
                      onChange={
                        handleChange
                      }
                      autoComplete="new-password"
                      placeholder="Enter new password"
                      className="h-11 w-full rounded-md border border-[#dfe5e8] px-3 pr-11 text-sm text-[#263a44] outline-none transition focus:border-[#024E82]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword(
                          (prev) =>
                            !prev
                        )
                      }
                      className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-gray-400 transition hover:text-[#024E82]"
                      aria-label="Toggle new password visibility"
                    >
                      {showNewPassword ? (
                        <EyeOff
                          size={17}
                        />
                      ) : (
                        <Eye
                          size={17}
                        />
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-[11px] text-gray-400">
                    Minimum 6 characters.
                  </p>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="mt-5">
                  <label
                    htmlFor="confirmPassword"
                    className="text-xs font-medium text-[#344852]"
                  >
                    Confirm New Password
                  </label>

                  <div className="relative mt-2">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        form.confirmPassword
                      }
                      onChange={
                        handleChange
                      }
                      autoComplete="new-password"
                      placeholder="Re-enter new password"
                      className="h-11 w-full rounded-md border border-[#dfe5e8] px-3 pr-11 text-sm text-[#263a44] outline-none transition focus:border-[#024E82]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) =>
                            !prev
                        )
                      }
                      className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-gray-400 transition hover:text-[#024E82]"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? (
                        <EyeOff
                          size={17}
                        />
                      ) : (
                        <Eye
                          size={17}
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* ERROR */}
                {error && (
                  <div className="mt-5 rounded-md bg-red-50 px-4 py-3 text-xs leading-5 text-red-600">
                    {error}
                  </div>
                )}

                {/* SUCCESS */}
                {message && (
                  <div className="mt-5 flex items-start gap-2 rounded-md bg-green-50 px-4 py-3 text-xs leading-5 text-green-600">
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0"
                    />

                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-6 h-11 w-full rounded-md bg-[#024E82] text-sm font-medium text-white transition hover:bg-[#013d67] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6"
                >
                  {saving
                    ? "Changing Password..."
                    : "Change Password"}
                </button>
              </form>
            </section>

            {/* SECURITY INFO */}
            <aside className="rounded-xl border border-[#e5eaed] bg-white p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#edf6fa] text-[#024E82]">
                <ShieldCheck
                  size={21}
                />
              </div>

              <h2 className="mt-4 text-sm font-semibold text-[#213640]">
                Password Security
              </h2>

              <div className="mt-4 space-y-3 text-xs leading-5 text-gray-500">
                <p>
                  Use a password that is
                  different from your
                  current password.
                </p>

                <p>
                  Avoid using easily
                  guessed personal
                  information.
                </p>

                <p>
                  Never share your FTC
                  account password with
                  anyone.
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