"use client";

import Link from "next/link";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useState } from "react";
import {
  MapPin,
  Navigation,
  ArrowRight,
  Car,
  Shield,
  Clock,
  DollarSign,
  Star,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  ChevronRight,
  Users,
  Zap,
  HeadphonesIcon,
} from "lucide-react";

export default function Home() {
  const { user, isLoaded } = useUser();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  const handleBooking = () => {
    if (!user) return; // Auth will handle redirect
    // Navigate to dashboard with pre-filled locations
    window.location.href = `/customer/dashboard?pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(dropoff)}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Kinetiq</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">Services</a>
            <a href="#why-us" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">Why Us</a>
            <a href="#stats" className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">About</a>
          </div>

          <div className="flex items-center gap-3">
            {isLoaded && user ? (
              <Link
                href="/customer/dashboard"
                className="h-10 px-5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button className="h-10 px-5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </nav>

      {/* ─── Hero Section with Booking Form ─── */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-orange-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text + Booking */}
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-block text-xs font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Fast &amp; Reliable
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                  Get a ride in <span className="text-orange-500">minutes</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-md">
                  Book a cab from anywhere, anytime. Enjoy safe, affordable rides at the tap of a button.
                </p>
              </div>

              {/* Booking Form */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-4">
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Book Your Ride</h3>

                <div className="space-y-3">
                  {/* Pickup */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-gray-800" />
                    <input
                      type="text"
                      placeholder="Pickup location"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="w-full h-12 pl-10 pr-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-gray-50 placeholder-gray-400"
                    />
                  </div>

                  {/* Connector Line */}
                  <div className="flex items-center pl-[22px]">
                    <div className="w-px h-4 bg-gray-300" />
                  </div>

                  {/* Dropoff */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-orange-500" />
                    <input
                      type="text"
                      placeholder="Drop-off location"
                      value={dropoff}
                      onChange={(e) => setDropoff(e.target.value)}
                      className="w-full h-12 pl-10 pr-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-gray-50 placeholder-gray-400"
                    />
                  </div>
                </div>

                {isLoaded && user ? (
                  <button
                    onClick={handleBooking}
                    className="w-full h-12 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    Request Ride <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <SignInButton mode="modal">
                    <button className="w-full h-12 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                      Sign In to Book <ArrowRight className="h-4 w-4" />
                    </button>
                  </SignInButton>
                )}
              </div>
            </div>

            {/* Right: Visual */}
            <div className="hidden md:flex justify-center relative">
              <div className="w-[400px] h-[400px] bg-orange-100 rounded-full flex items-center justify-center relative">
                <Car className="h-32 w-32 text-orange-500 opacity-60" />
                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Safe Rides</p>
                    <p className="text-[10px] text-gray-400">Verified Drivers</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">3 min ETA</p>
                    <p className="text-[10px] text-gray-400">Average pickup</p>
                  </div>
                </div>
                <div className="absolute bottom-16 -right-8 bg-white rounded-xl shadow-lg p-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">4.9 Rating</p>
                    <p className="text-[10px] text-gray-400">10k+ reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Services Section ─── */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Our Services
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-4">
              We offer the best ride experience
            </h2>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">
              Choose from a variety of options tailored to your needs, from budget to premium.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Car, title: "City Rides", desc: "Affordable rides for your daily commute within the city.", color: "bg-orange-50 text-orange-500" },
              { icon: Zap, title: "Express", desc: "Priority pickup with the nearest driver for urgent trips.", color: "bg-blue-50 text-blue-500" },
              { icon: Users, title: "Shared Rides", desc: "Share your ride and split costs with fellow travelers.", color: "bg-green-50 text-green-500" },
              { icon: Shield, title: "Premium", desc: "Luxury vehicles with top-rated drivers for a premium feel.", color: "bg-purple-50 text-purple-500" },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-orange-200 transition-all group cursor-pointer"
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us ─── */}
      <section id="why-us" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Why Choose Us
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-4 mb-6">
                Your safety is our priority
              </h2>
              <div className="space-y-5">
                {[
                  { icon: Shield, title: "Verified Drivers", desc: "Every driver goes through background checks and training." },
                  { icon: DollarSign, title: "Fair Pricing", desc: "Transparent fares with no hidden charges or surge traps." },
                  { icon: Clock, title: "24/7 Available", desc: "Book rides any time of day or night, rain or shine." },
                  { icon: HeadphonesIcon, title: "Live Support", desc: "Dedicated customer support available around the clock." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div id="stats" className="grid grid-cols-2 gap-4">
              {[
                { value: "10K+", label: "Happy Riders" },
                { value: "500+", label: "Verified Drivers" },
                { value: "50+", label: "Cities Covered" },
                { value: "4.9", label: "Average Rating" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
                  <p className="text-3xl font-extrabold text-orange-500">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-16 bg-orange-500">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-3">Ready to ride?</h2>
          <p className="text-orange-100 mb-8 text-lg">Download the app or book directly from here. Your next ride is just a click away.</p>
          {isLoaded && user ? (
            <Link
              href="/customer/dashboard"
              className="inline-flex items-center gap-2 h-12 px-8 bg-white text-orange-500 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
            >
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button className="inline-flex items-center gap-2 h-12 px-8 bg-white text-orange-500 rounded-xl font-semibold hover:bg-orange-50 transition-colors">
                Get Started <ArrowRight className="h-4 w-4" />
              </button>
            </SignInButton>
          )}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-lg font-bold text-white">Kinetiq</span>
              </div>
              <p className="text-sm leading-relaxed">
                Your reliable ride partner. Safe, affordable, and always on time.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#services" className="hover:text-orange-400 transition-colors">Services</a></li>
                <li><a href="#why-us" className="hover:text-orange-400 transition-colors">Why Us</a></li>
                <li><a href="#stats" className="hover:text-orange-400 transition-colors">About</a></li>
                <li><Link href="/customer/dashboard" className="hover:text-orange-400 transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#" className="hover:text-orange-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Refund Policy</a></li>
                <li><a href="#" className="hover:text-orange-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-orange-500" />
                  +1 (555) 123-4567
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-orange-500" />
                  support@kinetiq.app
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-orange-500 mt-0.5" />
                  123 Ride Street, Transport City
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">&copy; 2026 Kinetiq. All rights reserved.</p>
            <p className="text-sm">Made with ❤️ for riders everywhere</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
