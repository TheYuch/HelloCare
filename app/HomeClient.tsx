"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useUserData } from "@/lib/firestore";

function UserDataSection() {
  const {
    data,
    loading,
    error,
    refetch,
    write,
    writing,
    writeError,
    isAuthenticated,
  } = useUserData();
  const [message, setMessage] = useState("");

  if (!isAuthenticated) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = message.trim();
    if (value) write(value);
  };

  return (
    <section className="mt-10 w-full max-w-md space-y-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-700 dark:bg-zinc-900/30">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Your data
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter a message to save"
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          aria-label="Message to save"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={writing || !message.trim()}
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {writing ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={loading}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </form>

      {writeError && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          Write error: {writeError.message}
        </p>
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          Read error: {error.message}
        </p>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Stored data
        </h3>
        <pre className="overflow-auto rounded-lg border border-zinc-200 bg-white p-4 text-left text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
          {loading
            ? "Loading…"
            : data
              ? JSON.stringify(data, null, 2)
              : "No data yet. Save a message above."}
        </pre>
      </div>
    </section>
  );
}

export function HomeClient() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" aria-hidden />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <header className="absolute right-4 top-4 flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {user.email}
            </span>
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Sign out
            </button>
          </>
        ) : (
          <Link
            href="/sign-in"
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Sign in
          </Link>
        )}
      </header>

      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-24 sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="mt-6 flex flex-col items-center gap-6 sm:items-start">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            HelloCare
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {user
              ? "You’re signed in. Use the section below to view and update your data."
              : "Sign in to view and update your data."}
          </p>
        </div>

        {user && <UserDataSection />}
      </main>
    </div>
  );
}
