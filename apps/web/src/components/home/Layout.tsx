import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { UserDropdown } from "./UserDropdown";
import Logo from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

const items = [
  { title: "Dashboard", disabled: false, href: "/dashboard" },
  { title: "Explore", disabled: false, href: "/explore" },
];

const Navigation = ({ onClick }: { onClick?: () => void }) => {
  const router = useRouter();
  return (
    <>
      {items?.map((item, index) => (
        <Link
          key={index}
          href={item.disabled ? "#" : item.href}
          onClick={onClick}
          className={cn(
            "flex items-center text-lg font-semibold text-slate-600 sm:text-sm",
            item.href === router.pathname && "text-slate-900",
            item.disabled && "cursor-not-allowed opacity-80"
          )}
        >
          {item.title}
        </Link>
      ))}
    </>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Header */}
      <div className="my-2 flex h-14 shrink-0 items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <Logo />

          <nav className="hidden gap-6 md:flex">
            <Navigation />
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-6 md:flex">
            <UserDropdown />
          </div>
        </div>

        <div className="md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div className="relative flex flex-1">
        {/* Mobile Sidebar */}
        <div className="lg:hidden">
          {mobileMenuOpen && (
            <div className="absolute top-0 left-0 right-0 z-20 overflow-y-auto bg-white shadow lg:hidden">
              <div className="mt-6 flex flex-col gap-4">
                <UserDropdown mobile={true} />

                <nav className="mb-6 flex flex-col items-center gap-4 px-6">
                  <Navigation
                    onClick={() => {
                      setMobileMenuOpen(false);
                    }}
                  />
                </nav>
              </div>
            </div>
          )}
        </div>

        {/* Main */}
        <div className="relative flex-1">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
