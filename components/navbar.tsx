import Link from "next/link";
import { Button } from "@/components/ui/button";

const NavBar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-10">
        {/* Logo */}
        <Link href="/">
          <div className="font-bold text-2xl whitespace-nowrap min-w-[120px] flex items-center">
            <span
              style={{
                fontFamily: "Roboto, sans-serif",
                color: "#FC7B11",
                fontWeight: 800,
                fontSize: "1.6rem",
                lineHeight: 1,
              }}
            >
              M
            </span>
            <span
              className="ml-0.5"
              style={{ fontFamily: "geist, sans-serif" }}
            >
              90
            </span>
          </div>
        </Link>

        {/* Right Buttons */}
        <div className="hidden items-center space-x-2 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-[#FC7B11] hover:bg-[#FC7B11]/90 font-semibold transition-colors"
          >
            <Link href="/register">Sign up for Free</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
