'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { ChatWidget, Drawer } from "@/app/components";
import { useAuth } from "@/lib/auth-context";
import { useUserMetadata } from "@/lib/firestore";

export default function Home() {
  const { user } = useAuth();
  const { data: userMetadata, loading, isOnboarded } = useUserMetadata();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const userName =
    userMetadata != null
      ? `${userMetadata.firstName} ${userMetadata.lastName}`.trim()
      : user?.displayName ?? undefined;

  useEffect(() => {
    if (loading) return;
    if (!isOnboarded) {
      router.replace("/onboarding");
    }
  }, [loading, isOnboarded, router]);

  if (loading || !isOnboarded) return null;

  return (
    <div className="w-full h-screen flex flex-col">
      <header className="flex items-center justify-between pl-4 pr-2 py-3">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="p-2 -ml-2 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
          aria-label="Open menu"
        >
          <HiOutlineMenuAlt4 className="w-6 h-6" />
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-neutral-200 px-4 py-2.5 text-sm text-neutral-900 transition-colors hover:bg-neutral-300"
        >
          <HiOutlineChatBubbleLeftRight className="h-5 w-5 shrink-0" />
          <span>I&apos;m at a doctor&apos;s visit</span>
        </button>
      </header>
      <div className="flex-1 flex items-center justify-center">
        <span className="text-neutral-400">Home</span>
      </div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="left"
        userName={userName}
        userAvatarUrl={user?.photoURL ?? undefined}
      >
        <p className="text-neutral-600">Menu content</p>
      </Drawer>
      <ChatWidget />
    </div>
  );
}
