// @/components/layout/Logo.tsx
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2">
      {/* or: <Image src="/logo.png" alt="StarterOne Logo" width={32} height={32} /> */}
      <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105 group-hover:brightness-125">
        StarterOne
      </span>
    </Link>
  );
}
