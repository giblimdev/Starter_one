import IsConnected from "@/components/layout/IsConected";
import NavHeader from "@/components/layout/NavHeader";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="fixed top-0 w-full border-b z-10">
      <div
        className="p-10 backdrop-blur-sm"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255, 255, 255, 1) 20%, rgba(255, 255, 255, 0.1) 100%)",
        }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo />
            <NavHeader />
          </div>
          <IsConnected />
        </div>
      </div>
    </header>
  );
}
