"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams() as { locale: "en" | "ar" };

  const nextLocale = locale === "ar" ? "en" : "ar";

  const handleSwitchLanguage = () => {
    const pathSegments = pathname.split("/");
    if (["en", "ar"].includes(pathSegments[1])) {
      pathSegments[1] = nextLocale;
    } else {
      pathSegments.unshift(nextLocale);
    }
    router.push(pathSegments.join("/"));
  };

  return (
    <Button
      onClick={handleSwitchLanguage}
      size="sm"
      variant="outline"
      className="flex items-center gap-1 rounded-full px-3 text-xs"
    >
      <Globe className="w-4 h-4 text-primary" />
      {nextLocale.toUpperCase()}
    </Button>
  );
}
