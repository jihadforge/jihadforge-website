"use client";

import Link from "next/link";
import { useCart } from "../CartProvider";

export default function Navbar() {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080808]/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="text-xl font-black uppercase tracking-[0.18em]"
        >
          JihadForge
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/#shop"
            className="text-xs font-bold uppercase tracking-[0.18em] text-white/60 transition hover:text-white"
          >
            Shop
          </Link>

          <Link
            href="/#about"
            className="text-xs font-bold uppercase tracking-[0.18em] text-white/60 transition hover:text-white"
          >
            About
          </Link>

          <Link
            href="/#contact"
            className="text-xs font-bold uppercase tracking-[0.18em] text-white/60 transition hover:text-white"
          >
            Contact
          </Link>
        </nav>

        <Link
          href="/cart"
          className="border border-white/20 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] transition hover:border-white hover:bg-white hover:text-black"
        >
          Cart ({cartCount})
        </Link>
      </div>
    </header>
  );
}