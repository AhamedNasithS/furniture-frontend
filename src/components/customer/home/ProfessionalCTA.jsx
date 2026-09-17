"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  House,
} from "lucide-react";
import { motion } from "framer-motion";

export default function ProfessionalCTA() {
  return (
    <section className="px-4 pb-16 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-2xl bg-[#072D49]">
        <div className="grid items-center gap-8 px-6 py-12 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-14 lg:py-14 xl:px-16">

          {/* LEFT CONTENT */}
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
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#70C8F0]">
              Trusted by design professionals
            </p>

            <h2 className="mt-3 max-w-[720px] text-3xl font-semibold leading-tight text-white sm:text-4xl">
              Join 14,000+ Architects,
              Interior Designers &
              Discerning Homeowners
            </h2>

            <p className="mt-5 max-w-[650px] text-sm leading-7 text-white/65">
              Discover furniture crafted for
              projects where quality,
              longevity and thoughtful design
              matter.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-[#0B82C6] px-5 text-sm font-medium text-white transition hover:bg-[#0874b2]"
              >
                Explore Collection

                <ArrowRight
                  size={16}
                  strokeWidth={1.8}
                />
              </Link>

              <Link
                href="/contact"
                className="inline-flex h-11 items-center rounded-md border border-white/20 px-5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Talk to FTC
              </Link>
            </div>
          </motion.div>

          {/* RIGHT CARDS */}
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
            className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1"
          >
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.06] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0B82C6]/20 text-[#70C8F0]">
                <Building2
                  size={20}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Architects
                </p>

                <p className="mt-1 text-xs text-white/55">
                  Project-ready furniture solutions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.06] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0B82C6]/20 text-[#70C8F0]">
                <BriefcaseBusiness
                  size={20}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Interior Designers
                </p>

                <p className="mt-1 text-xs text-white/55">
                  Curated pieces for refined spaces
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.06] p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0B82C6]/20 text-[#70C8F0]">
                <House
                  size={20}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Homeowners
                </p>

                <p className="mt-1 text-xs text-white/55">
                  Premium comfort for everyday living
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}