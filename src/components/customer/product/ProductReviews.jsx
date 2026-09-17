"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  MessageSquare,
  Star,
} from "lucide-react";

import useAuthStore from "@/store/authStore";

export default function ProductReviews({
  productId,
}) {
  const token = useAuthStore(
    (state) => state.token
  );

  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated
    );

  const [reviews, setReviews] =
    useState([]);

  const [averageRating, setAverageRating] =
    useState(0);

  const [reviewCount, setReviewCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [rating, setRating] =
    useState(0);

  const [comment, setComment] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const getReviews = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/product/${productId}`
      );

      const data =
        response.data?.data;

      setReviews(
        data?.reviews || []
      );

      setAverageRating(
        Number(
          data?.averageRating || 0
        )
      );

      setReviewCount(
        Number(
          data?.reviewCount || 0
        )
      );
    } catch (error) {
      console.log(
        "Get reviews error:",
        error.response?.data ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      getReviews();
    }
  }, [productId]);

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError(
        "Please login before writing a review."
      );
      return;
    }

    if (rating < 1) {
      setError(
        "Please select a rating."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/product/${productId}`,
        {
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRating(0);
      setComment("");

      setMessage(
        "Your review has been added successfully."
      );

      await getReviews();
    } catch (error) {
      console.log(
        "Create review error:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data
          ?.message ||
          "Unable to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="mx-auto max-w-[1440px] px-4 pb-14 sm:px-6 lg:px-10">
      <div className="rounded-2xl border border-[#e5eaed] bg-white p-5 sm:p-7">

        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">

          {/* RATING SUMMARY */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1683BC]">
              Customer Reviews
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-[#172B38]">
              What Customers Say
            </h2>

            <div className="mt-6 rounded-xl bg-[#F7F9FB] p-5">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-[#172B38]">
                  {averageRating}
                </span>

                <span className="pb-1 text-sm text-gray-400">
                  / 5
                </span>
              </div>

              <div className="mt-3 flex gap-1">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <Star
                      key={star}
                      size={18}
                      fill={
                        star <=
                        Math.round(
                          averageRating
                        )
                          ? "#F4B740"
                          : "none"
                      }
                      className={
                        star <=
                        Math.round(
                          averageRating
                        )
                          ? "text-[#F4B740]"
                          : "text-gray-300"
                      }
                    />
                  )
                )}
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Based on{" "}
                {reviewCount}{" "}
                {reviewCount === 1
                  ? "review"
                  : "reviews"}
              </p>
            </div>

            {/* REVIEW FORM */}
            <form
              onSubmit={
                handleSubmit
              }
              className="mt-6"
            >
              <h3 className="text-sm font-semibold text-[#213640]">
                Write a Review
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-400">
                Reviews are available
                only for products that
                have been delivered to
                you.
              </p>

              <div className="mt-4 flex gap-1">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setRating(
                          star
                        )
                      }
                      className="transition hover:scale-110"
                    >
                      <Star
                        size={24}
                        fill={
                          star <=
                          rating
                            ? "#F4B740"
                            : "none"
                        }
                        className={
                          star <=
                          rating
                            ? "text-[#F4B740]"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  )
                )}
              </div>

              <textarea
                rows={4}
                value={comment}
                onChange={(e) =>
                  setComment(
                    e.target.value
                  )
                }
                placeholder="Share your experience with this furniture..."
                className="mt-4 w-full resize-none rounded-lg border border-[#dfe5e8] px-3 py-3 text-sm text-[#344852] outline-none transition focus:border-[#024E82]"
              />

              {error && (
                <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs leading-5 text-red-600">
                  {error}
                </div>
              )}

              {message && (
                <div className="mt-3 rounded-md bg-green-50 px-3 py-2 text-xs leading-5 text-green-600">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  submitting
                }
                className="mt-4 h-10 rounded-md bg-[#024E82] px-5 text-xs font-medium text-white transition hover:bg-[#013d67] disabled:opacity-50"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Review"}
              </button>
            </form>
          </div>

          {/* REVIEW LIST */}
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare
                size={18}
                className="text-[#024E82]"
              />

              <h3 className="text-base font-semibold text-[#213640]">
                Reviews
              </h3>
            </div>

            {loading ? (
              <div className="mt-5 space-y-3">
                {Array.from({
                  length: 3,
                }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-[120px] animate-pulse rounded-xl bg-[#F7F9FB]"
                    />
                  )
                )}
              </div>
            ) : reviews.length ===
              0 ? (
              <div className="mt-5 flex min-h-[280px] flex-col items-center justify-center rounded-xl bg-[#F7F9FB] px-5 text-center">
                <MessageSquare
                  size={34}
                  strokeWidth={1.4}
                  className="text-gray-300"
                />

                <h4 className="mt-4 text-sm font-semibold text-[#213640]">
                  No reviews yet
                </h4>

                <p className="mt-2 text-xs text-gray-500">
                  Be the first verified
                  customer to review this
                  product.
                </p>
              </div>
            ) : (
              <div className="mt-5 divide-y divide-[#edf0f2]">
                {reviews.map(
                  (review) => (
                    <article
                      key={
                        review.id
                      }
                      className="py-5 first:pt-0"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#213640]">
                            {review.user
                              ?.name ||
                              "FTC Customer"}
                          </p>

                          <p className="mt-1 text-[11px] text-gray-400">
                            {formatDate(
                              review.createdAt
                            )}
                          </p>
                        </div>

                        <div className="flex gap-0.5">
                          {[
                            1, 2, 3, 4,
                            5,
                          ].map(
                            (
                              star
                            ) => (
                              <Star
                                key={
                                  star
                                }
                                size={
                                  14
                                }
                                fill={
                                  star <=
                                  review.rating
                                    ? "#F4B740"
                                    : "none"
                                }
                                className={
                                  star <=
                                  review.rating
                                    ? "text-[#F4B740]"
                                    : "text-gray-300"
                                }
                              />
                            )
                          )}
                        </div>
                      </div>

                      {review.comment && (
                        <p className="mt-3 text-sm leading-6 text-gray-500">
                          {
                            review.comment
                          }
                        </p>
                      )}
                    </article>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}