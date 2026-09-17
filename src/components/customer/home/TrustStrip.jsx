"use client";

import {
  BadgeIndianRupee,
  ShieldCheck,
  PackageCheck,
  TreePine,
} from "lucide-react";

import { motion } from "framer-motion";

const trustItems = [
  {
    title: "Factory-Direct Pricing",
    description: "Transparent value, no retail markup",
    icon: BadgeIndianRupee,
  },
  {
    title: "10-Year Framework",
    description: "Built for long-term durability",
    icon: ShieldCheck,
  },
  {
    title: "White-Glove Logistics",
    description: "Careful handling and delivery",
    icon: PackageCheck,
  },
  {
    title: "Seasoned Hardwood",
    description: "Selected timber, crafted to last",
    icon: TreePine,
  },
];

export default function TrustStrip() {
  return (
    <section className="px-4 pt-4 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {trustItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              initial={{
                opacity: 0,
                y: 14,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.35,
                delay: index * 0.06,
              }}
              className="flex items-center gap-4 rounded-xl border border-[#e8edf0] bg-white px-4 py-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eaf5fb] text-[#024E82]">
                <Icon
                  size={20}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#1f2f38]">
                  {item.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}