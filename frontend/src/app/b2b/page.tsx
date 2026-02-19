"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMode } from "@/hooks/use-mode";

export default function B2BRedirect() {
  const router = useRouter();
  const setMode = useMode((s) => s.setMode);

  useEffect(() => {
    setMode("wholesale");
    router.replace("/");
  }, [setMode, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-[#6e6e73]">Switching to Wholesale mode...</p>
    </div>
  );
}
