"use client";

import { Ghost } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import "../[locale]/globals.css";

export default function NotFoundPage() {
  const params = useParams();
  const locale = params.locale || "en"; 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 text-center">
      <div className="flex flex-col items-center">
        <Ghost className="w-24 h-24 text-primary mb-6" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link
          href={`/${locale}`}
          className="inline-block bg-primary text-white font-semibold py-2 px-6 rounded-xl transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
