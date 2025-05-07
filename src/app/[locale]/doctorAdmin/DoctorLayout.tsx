"use client";

import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Home,
  Calendar,
  User,
  LogOutIcon,
  Clock,
} from "lucide-react";
import React, { ReactNode, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Translations } from "@/types/Translations";
import Link from "@/components/link";
export default function DoctorLayout({
  children,
  locale,
  translations,
}: {
  children: ReactNode;
  locale: string;
  translations: Translations;
}) {
  const pathname = usePathname();
  const isRTL = locale === "ar";

  const navLinks = useMemo(
    () => [
      { href: `/${locale}/doctorAdmin`, label: translations.doctorDashboard.sidebar.home, icon: <Home size={18} /> },
      { href: `/${locale}/doctorAdmin/profile`, label: translations.doctorDashboard.sidebar.profile, icon: <User size={18} /> },
      {
        href: `/${locale}/doctorAdmin/appointments`,
        label: translations.doctorDashboard.sidebar.appointments,
        icon: <Calendar size={18} />,
      },
      {
        href: `/${locale}/doctorAdmin/availability`,
        label: translations.doctorDashboard.sidebar.availability,
        icon: <Clock size={18} />,
      },
    ],
    [locale, translations.doctorDashboard.sidebar.appointments, translations.doctorDashboard.sidebar.availability, translations.doctorDashboard.sidebar.home, translations.doctorDashboard.sidebar.profile]
  );


 

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar - Desktop */}
      <nav
        className={cn(
          "hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-l border-r border-gray-200 dark:border-gray-700 fixed top-16 h-[calc(100vh-4rem)]",
          isRTL ? "right-0 border-r-0 border-l" : "left-0"
        )}
      >
     
        <ul className="flex-1 space-y-2 p-4">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                  pathname === link.href
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                )}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-200 dark:border-gray-700 p-3">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-4 cursor-pointer py-3 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-all duration-200"
          >
            <LogOutIcon size={20} />
            <span>{translations.header.buttons.logout}</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 p-3 pt-24 bg-gray-100 dark:bg-gray-900 min-h-screen mb-0 md:mb-20 ",
          isRTL ? "md:mr-64" : "md:ml-64"
        )}
      >
        <div className="container mx-auto max-w-6xl">{children}</div>
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="fixed bottom-0 grid grid-cols-3 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700  md:hidden justify-between items-center h-24 p-2 z-50 shadow-md ">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-1 px-2 transition-all duration-200 text-center",
              pathname === link.href
                ? "text-blue-600"
                : "text-gray-500 dark:text-gray-300 hover:text-blue-500"
            )}
          >
            <div className="mb-1">{link.icon}</div>
            <span className="text-[12px] font-medium leading-tight text-center whitespace-normal">
              {link.label}
            </span>
          </Link>
        ))}

<button
  onClick={() => signOut()}
  className="flex flex-col items-center justify-center  py-1  text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-lg transition-all duration-200"
>
  <LogOutIcon size={18} className="mb-1" />
  <span className="text-[12px] font-medium leading-tight text-center">
    {translations.header.buttons.logout}
  </span>
</button>

      </nav>







    
    </div>
  );
}