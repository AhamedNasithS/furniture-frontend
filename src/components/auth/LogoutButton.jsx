"use client";

import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const logout = useAuthStore(
    (state) => state.logout
  );

  const handleLogout = () => {
    logout();

    router.replace("/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-sm font-medium text-red-600 flex gap-2 items-center border border-red-600 rounded-xl w-max py-2 px-4 h-max"
    >
      <LogOut size={14} />
      Logout
    </button>
  );
}