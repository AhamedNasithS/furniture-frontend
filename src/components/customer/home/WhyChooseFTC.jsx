"use client";

import {
  BadgeCheck,
  Hammer,
  House,
  ShieldCheck,
} from "lucide-react";

import { motion } from "framer-motion";

const benefits = [
  {
    title: "Direct-from-FTC Pricing",
    description:
      "Factory-direct value with transparent pricing and no unnecessary retail markup.",
    icon: BadgeCheck,
  },
  {
    title: "Architect-Led Build",
    description:
      "Thoughtful proportions, materials and construction designed for real interiors.",
    icon: Hammer,
  },
  {
    title: "White-Glove Home Setup",
    description:
      "Careful furniture handling and a smoother delivery experience for your home.",
    icon: House,
  },
  {
    title: "10-Year Quality Belief",
    description:
      "Built around durable materials, solid construction and long-term everyday use.",
    icon: ShieldCheck,
  },
];

export default function WhyChooseFTC() {
  return (
    <section className="px-4 pb-14 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1440px]">

        {/* SECTION HEADER */}
        <div className="mx-auto mb-8 max-w-[760px] text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1683BC]">
            The FTC direct advantage
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#172B38] sm:text-3xl">
            Why Architects & Homeowners Rely on FTC
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Thoughtful design, durable construction and
            dependable service from factory to home.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
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
                  amount: 0.25,
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.06,
                }}
                whileHover={{
                  y: -4,
                }}
                className="rounded-xl border border-[#e7ecef] bg-white p-5 transition-shadow hover:shadow-md"
              >
                {/* ICON */}
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#eaf5fb] text-[#024E82]">
                  <Icon
                    size={21}
                    strokeWidth={1.8}
                  />
                </div>

                {/* CONTENT */}
                <h3 className="mt-5 text-sm font-semibold text-[#20333E]">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  {item.description}
                </p>

                <button
                  type="button"
                  className="mt-5 text-xs font-medium text-[#024E82] transition hover:opacity-70"
                >
                  Learn More →
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}