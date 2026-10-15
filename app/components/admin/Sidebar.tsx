"use client";

import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: "▦",
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: "□",
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: "◇",
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: "↗",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: "⚙",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
async function handleLogout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    alert("Unable to log out. Please try again.");
    return;
  }

  window.location.replace("/login");
}
  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  }

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col bg-black text-white">
      <div className="border-b border-neutral-800 px-6 py-7">
        <Link href="/admin" className="block">
          <div className="relative mb-6 h-24 w-full">
            <Image
  src="/brand/jf-logo-white.png"
  alt="JihadForge"
  fill
  sizes="160px"
  priority
  className="object-contain"
/>
          </div>

          <p className="text-sm font-bold tracking-[0.22em]">
            JIHADFORGE
          </p>

          <p className="mt-1 text-xs text-neutral-500">
            Admin Panel
          </p>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-white text-black"
                  : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <span className="w-5 text-center text-base">
                {item.icon}
              </span>

              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-neutral-800 p-4">
        <button
  type="button"
  onClick={handleLogout}
  className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
>
  Logout
</button>
      </div>
    </aside>
  );
}