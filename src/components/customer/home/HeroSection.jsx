"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const [heroImage, setHeroImage] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const getStoreSettings = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/settings/public`
      );

      setHeroImage(
        response.data?.data?.heroImageUrl ||
          null
      );
    } catch (error) {
      console.log(
        "Hero settings error:",
        error.response?.data ||
          error.message
      );

      setHeroImage(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStoreSettings();
  }, []);

  return (
    <section className="px-4 pt-5 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-2xl bg-[#072D49]">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">

          {/* LEFT CONTENT */}
          <div className="flex items-center px-6 py-12 sm:px-10 sm:py-16 lg:px-14 xl:px-16">
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              className="max-w-[650px]"
            >
              {/* BADGE */}
              <div className="mb-5 inline-flex rounded-full border border-[#2386B9] bg-[#0B466B] px-3 py-1.5 text-xs font-medium text-[#9DD8F5]">
                FTC Factory-Direct Furniture
              </div>

              {/* TITLE */}
              <h1 className="text-[38px] font-bold leading-[0.98] tracking-tight text-white sm:text-5xl lg:text-[58px]">
                Crafted for
                <br />
                Longevity.
                <br />

                <span className="text-[#69C7F2]">
                  Factory-Direct
                </span>

                <br />

                <span className="text-[#69C7F2]">
                  Hardwood &
                </span>

                <br />

                <span className="text-[#69C7F2]">
                  Bespoke Upholstery.
                </span>
              </h1>

              {/* DESCRIPTION */}
              <p className="mt-6 max-w-[570px] text-sm leading-6 text-white/65 sm:text-[15px]">
                Discover handcrafted furniture
                designed for lasting comfort,
                thoughtful interiors and modern
                living.
              </p>

              {/* BUTTONS */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="inline-flex h-11 items-center gap-2 rounded-md bg-[#087BC1] px-5 text-sm font-medium text-white transition hover:bg-[#066ca9]"
                >
                  Explore Collection

                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/shop"
                  className="inline-flex h-11 items-center rounded-md bg-white/10 px-5 text-sm font-medium text-white transition hover:bg-white/15"
                >
                  Shop Signature Pieces
                </Link>
              </div>
            </motion.div>
          </div>

          {/* RIGHT FEATURE IMAGE */}
          <div className="flex items-center justify-center px-6 pb-10 sm:px-10 lg:px-12 lg:py-12">
            <motion.div
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="w-full max-w-[480px] overflow-hidden rounded-xl bg-[#dfe5e8] shadow-2xl"
            >
              {/* IMAGE */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#e5eaec]">
                {loading ? (
                  <div className="h-full w-full animate-pulse bg-[#dce2e5]" />
                ) : heroImage ? (
                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    className="h-full w-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url("${heroImage}")`,
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-gray-400">
                    <ImageIcon
                      size={42}
                      strokeWidth={1.3}
                    />

                    <p className="mt-3 text-sm">
                      No banner image
                    </p>
                  </div>
                )}
              </div>

              {/* IMAGE BOTTOM INFO */}
              <div className="flex items-end justify-between bg-[#081C2B] px-4 py-4 text-white">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/50">
                    Featured Collection
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    FTC Premium Furniture
                  </p>
                </div>

                <ArrowRight
                  size={18}
                  className="text-white/70"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}