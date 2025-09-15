"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function SideNavLink({ link }) {
  const pathname = usePathname();
  const isActive = pathname === link.href;

  return (
    <Link
      href={link.href}
      className={`p-3 rounded-lg transition-colors duration-300 ${
        isActive ? "bg-zinc-700 font-bold" : "hover:bg-zinc-700"
      }`}
    >
      {link.title}
    </Link>
  );
}
