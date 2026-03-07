"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Car,
  Clock,
  MapPin,
  Wallet,
  Tag,
  Star,
  HelpCircle,
  Settings,
  Plus,
} from "lucide-react";

const menuItems = [
  { label: "Home", icon: Home, href: "/customer/dashboard" },
  { label: "Book Ride", icon: Car, href: "/customer/book" },
  { label: "My Rides", icon: Clock, href: "/customer/rides" },
  { label: "Saved Places", icon: MapPin, href: "/customer/places" },
  { label: "Wallet", icon: Wallet, href: "/customer/wallet" },
  { label: "Offers", icon: Tag, href: "/customer/offers" },
  { label: "Ratings", icon: Star, href: "/customer/ratings" },
  { label: "Help & Support", icon: HelpCircle, href: "/customer/support" },
  { label: "Settings", icon: Settings, href: "/customer/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[200px] bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="font-bold text-lg">Kinetiq</span>
        </Link>
      </div>

      {/* Menu Label */}
      <div className="px-5 pt-5 pb-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto px-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5 relative ${
                isActive
                  ? "bg-orange-50 text-orange-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className={`h-[18px] w-[18px] ${isActive ? "text-orange-500" : "text-gray-400"}`} />
              {item.label}
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-orange-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Book Ride Button */}
      <div className="p-4">
        <Link href="/customer/book">
          <div className="bg-orange-500 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-orange-600 transition-colors">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <span className="text-white text-xs font-semibold border border-white/50 rounded-md px-3 py-1">
              Book a Ride
            </span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
