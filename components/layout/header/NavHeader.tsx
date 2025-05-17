//@/components/layout/NavHeadder.tsx

import Link from "next/link";
import React from "react";

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/public/features", label: "Features" },
  { href: "/user/newProject", label: "New Project" },
  { href: "/dev", label: "Dev Home" },
];

function NavHeader() {
  return (
    <nav className="hidden md:flex items-center gap-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 font-medium text-sm rounded-md"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export default NavHeader;
