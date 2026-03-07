"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  Clock,
  MapPin,
  Wallet,
  Star,
  Settings,
  Activity,
  UserCheck
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: Activity, href: "/driver/dashboard" },
  { label: "My Trips", icon: Clock, href: "/driver/trips" },
  { label: "Earnings", icon: Wallet, href: "/driver/earnings" },
  { label: "Ratings", icon: Star, href: "/driver/ratings" },
  { label: "Profile", icon: UserCheck, href: "/driver/profile" },
  { label: "Settings", icon: Settings, href: "/driver/settings" },
];

export default function DriverSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[200px] bg-slate-900 border-r border-slate-800 flex flex-col text-white">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="font-bold text-lg text-white">Kinetiq Drive</span>
        </Link>
      </div>

      {/* Menu Label */}
      <div className="px-5 pt-5 pb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Drive Menu</span>
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
                  ? "bg-green-500/10 text-green-400"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className={`h-[18px] w-[18px] ${isActive ? "text-green-400" : "text-slate-500"}`} />
              {item.label}
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Status */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-xl p-4 flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center relative">
            <Car className="h-5 w-5 text-green-400" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
          </div>
          <span className="text-white text-xs font-semibold py-1">
            Online & Ready
          </span>
        </div>
      </div>
    </aside>
  );
}
