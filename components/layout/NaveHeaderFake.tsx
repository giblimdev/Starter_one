import React from "react";

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [{ href: "/", label: "H" }];

function NavHeaderFake() {
  return (
    <nav className="hidden md:flex items-center gap-4 px-4 py-2">
      {navItems.map((item) => (
        <span
          key={item.href}
          className="px-4 py-2 font-medium text-sm invisible"
        >
          {item.label}
        </span>
      ))}
    </nav>
  );
}

export default NavHeaderFake;
