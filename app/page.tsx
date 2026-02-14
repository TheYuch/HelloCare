'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserMetadata } from "@/lib/firestore";

export default function Home() {
  const { loading, isOnboarded } = useUserMetadata();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isOnboarded) {
      router.replace("/onboarding");
    }
  }, [loading, isOnboarded, router]);

  if (loading || !isOnboarded) return null;

  // TODO: Replace with actual home page content
  return <div className="w-full h-screen flex items-center justify-center">
    <span className="text-neutral-400">Home</span>
  </div>;
}
