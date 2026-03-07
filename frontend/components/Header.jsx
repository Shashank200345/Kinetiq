"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Search, Bell } from "lucide-react";

export default function Header() {
  const { user, isLoaded } = useUser();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Welcome */}
      <h1 className="text-lg font-semibold text-gray-800">
        Welcome Back, {isLoaded && user ? user.firstName : "..."}!
      </h1>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search.."
            className="w-full h-10 pl-4 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 bg-white"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-500" />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-2">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9",
              },
            }}
          />
          <span className="text-sm font-medium text-gray-700 hidden md:block">
            {isLoaded && user ? `${user.firstName} ${user.lastName || ""}` : "..."}
          </span>
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
