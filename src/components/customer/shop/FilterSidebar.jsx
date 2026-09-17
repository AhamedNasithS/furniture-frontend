"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

const materials = [
  "Teak Wood",
  "Oak Wood",
  "Solid Wood",
  "Fabric",
  "Leather",
  "Metal",
];

const colors = [
  "Brown",
  "Natural",
  "Black",
  "White",
  "Grey",
  "Blue",
];

export default function FilterSidebar({
  filters,
  setFilters,
  className = "",
}) {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`
      );

      setCategories(
        (response.data?.data || []).filter(
          (item) =>
            !item.status ||
            item.status === "active"
        )
      );
    } catch (error) {
      console.log(
        "Category error:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      categoryId: "",
      minPrice: "",
      maxPrice: "",
      material: "",
      color: "",
      sort: "newest",
      page: 1,
      limit: 12,
    });
  };

  return (
    <aside className={`rounded-xl border border-[#e5eaed] bg-white ${className}`}>
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-[#edf0f2] px-5 py-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={17}
            className="text-[#024E82]"
          />

          <h2 className="text-sm font-semibold text-[#243640]">
            Filters
          </h2>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="text-xs font-medium text-[#1683BC]"
        >
          Clear
        </button>
      </div>

      <div className="divide-y divide-[#edf0f2]">

        {/* CATEGORY */}
        <div className="p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[#283b45]">
            Category
          </h3>

          <div className="mt-4 space-y-3">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex cursor-pointer items-center gap-3 text-sm text-gray-600"
              >
                <input
                  type="radio"
                  name="category"
                  checked={
                    String(filters.categoryId) ===
                    String(category.id)
                  }
                  onChange={() =>
                    handleChange(
                      "categoryId",
                      category.id
                    )
                  }
                  className="accent-[#024E82]"
                />

                {category.name}
              </label>
            ))}
          </div>
        </div>

        {/* PRICE */}
        <div className="p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[#283b45]">
            Price Range
          </h3>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) =>
                handleChange(
                  "minPrice",
                  e.target.value
                )
              }
              className="h-10 min-w-0 rounded-md border border-[#dce3e6] px-3 text-xs outline-none focus:border-[#024E82]"
            />

            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) =>
                handleChange(
                  "maxPrice",
                  e.target.value
                )
              }
              className="h-10 min-w-0 rounded-md border border-[#dce3e6] px-3 text-xs outline-none focus:border-[#024E82]"
            />
          </div>
        </div>

        {/* MATERIAL */}
        <div className="p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[#283b45]">
            Material
          </h3>

          <div className="mt-4 space-y-3">
            {materials.map((material) => (
              <label
                key={material}
                className="flex cursor-pointer items-center gap-3 text-sm text-gray-600"
              >
                <input
                  type="radio"
                  name="material"
                  checked={
                    filters.material === material
                  }
                  onChange={() =>
                    handleChange(
                      "material",
                      material
                    )
                  }
                  className="accent-[#024E82]"
                />

                {material}
              </label>
            ))}
          </div>
        </div>

        {/* COLOR */}
        <div className="p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[#283b45]">
            Color
          </h3>

          <div className="mt-4 flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() =>
                  handleChange("color", color)
                }
                title={color}
                className={`h-8 rounded-full border px-3 text-xs transition ${
                  filters.color === color
                    ? "border-[#024E82] bg-[#eaf5fb] text-[#024E82]"
                    : "border-[#dfe5e8] text-gray-500"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}