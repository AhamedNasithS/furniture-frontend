"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CraftsmanshipBanner() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const getBannerImage = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        {
          params: {
            page: 1,
            limit: 1,
            sort: "newest",
          },
        }
      );

      const product =
        response.data?.data?.[0];

      const primaryImage =
        product?.images?.find(
          (item) => item.isPrimary
        ) || product?.images?.[0];

      setImage(
        primaryImage?.imageUrl || null
      );
    } catch (error) {
      console.log(
        "Craftsmanship banner error:",
        error.response?.data ||
          error.message
      );

      setImage(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBannerImage();
  }, []);

  return (
    <section className="px-4 pb-14 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-2xl bg-[#073452]">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">

          {/* LEFT */}
          <div className="flex items-center px-6 py-12 sm:px-10 lg:px-14 xl:px-16">
            <motion.div
              initial={{
                opacity: 0,
                y: 18,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.45,
              }}
              className="max-w-[600px]"
            >
              <span className="inline-flex rounded-full bg-[#0a547c] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[#98d8f7]">
                FTC Signature Collection
              </span>

              <h2 className="mt-5 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Modern Teak &
                <br />
                Scandinavian Craftsmanship
              </h2>

              <p className="mt-5 max-w-[560px] text-sm leading-7 text-white/65">
                Thoughtfully designed furniture combining
                premium hardwood, clean proportions and
                timeless Scandinavian-inspired styling.
              </p>

              {/* FEATURES */}
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Premium hardwood construction",
                  "Hand-finished craftsmanship",
                  "Timeless modern design",
                  "Built for everyday durability",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-white/80"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1387c4]/20 text-[#67c5ef]">
                      <Check
                        size={13}
                        strokeWidth={2}
                      />
                    </span>

                    {item}
                  </div>
                ))}
              </div>

              <Link
                href="/shop"
                className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-white px-5 text-sm font-medium text-[#073452] transition hover:bg-gray-100"
              >
                Explore Living Collection

                <ArrowRight
                  size={16}
                  strokeWidth={1.8}
                />
              </Link>
            </motion.div>
          </div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.5,
            }}
            className="relative min-h-[320px] bg-[#e7ecee] sm:min-h-[420px] lg:min-h-full"
          >
            {loading && (
              <div className="absolute inset-0 animate-pulse bg-[#dfe5e7]" />
            )}

            {!loading && image && (
              <Image
                src={image}
                alt="FTC Scandinavian furniture"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            {!loading && !image && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <ImageIcon
                    size={42}
                    strokeWidth={1.3}
                    className="mx-auto"
                  />

                  <p className="mt-3 text-sm">
                    No image available
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}