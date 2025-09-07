"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const NavBar = () => {
  const { data: session, status } = useSession();
  const [imageError, setImageError] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  // Generate initials from user's name or email
  const getUserInitials = () => {
    if (session?.user?.name) {
      return session.user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    } else if (session?.user?.email) {
      return session.user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/50">
      <div className="flex h-16 items-center justify-between px-4 sm:px-10">
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
              className="ml-0.5 text-white"
              style={{ fontFamily: "geist, sans-serif" }}
            >
              90
            </span>
          </div>
        </Link>

        {/* Right Buttons */}
        <div className="flex items-center space-x-2">
          {status === "loading" ? (
            // Show loading state
            <div className="w-8 h-8 bg-slate-700 rounded-full animate-pulse" />
          ) : session?.user ? (
            // Show user dropdown when authenticated
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full p-0"
                >
                  {session.user.image && !imageError ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User Avatar"}
                      width={32}
                      height={32}
                      className="rounded-full"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center border">
                      <span className="text-orange-600 font-semibold text-sm">
                        {getUserInitials()}
                      </span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {session.user.name && (
                      <p className="font-medium text-white">{session.user.name}</p>
                    )}
                    {session.user.email && (
                      <p className="w-[200px] truncate text-sm text-slate-400">
                        {session.user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-white hover:bg-slate-700"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Show sign in/up buttons when not authenticated
            <>
              <Button variant="ghost" asChild className="hidden sm:flex text-white hover:bg-slate-800">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button
                asChild
                className="rounded-full bg-[#FC7B11] hover:bg-[#FC7B11]/90 font-semibold transition-colors text-white"
              >
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
