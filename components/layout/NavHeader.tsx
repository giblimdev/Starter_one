import Link from "next/link";
import React from "react";

function NavHeader() {
  return (
    <nav className="hidden md:flex items-center gap-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
      <Link
        href="/public/features"
        className="px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 font-medium text-sm rounded-md"
      >
        Fonctionnalités
      </Link>
      <Link
        href="/user/profile"
        className="px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 font-medium text-sm rounded-md"
      >
        profile
      </Link>
      <Link
        href="/user/dashboard"
        className="px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 font-medium text-sm rounded-md"
      >
        user dascboard
      </Link>

      <Link
        href="/user/newProject"
        className="px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 font-medium text-sm rounded-md"
      >
        Nouveau projet
      </Link>

      <Link
        href="/dev"
        className="px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 font-medium text-sm rounded-md"
      >
        Accueil Dev
      </Link>

      <Link
        href="/dev/toDoList"
        className="px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 font-medium text-sm rounded-md"
      >
        To-do List
      </Link>

      <Link
        href="/dev/schema"
        className="px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-200 font-medium text-sm rounded-md"
      >
        Schémas
      </Link>
    </nav>
  );
}

export default NavHeader;
