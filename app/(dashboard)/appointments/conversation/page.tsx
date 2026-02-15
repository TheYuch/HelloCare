'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { HiMicrophone } from "react-icons/hi";
import { TbArrowBackUp } from "react-icons/tb";

function formatConversationDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
}

function parseDateFromSearchParams(searchParams: URLSearchParams): Date {
  const dateParam = searchParams.get("date");
  if (!dateParam) return new Date();
  const parsed = new Date(dateParam);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default function ConversationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentDate = parseDateFromSearchParams(searchParams);
  const dateLabel = formatConversationDate(appointmentDate);

  return (
    <div className="w-full h-screen flex flex-col gap-5 p-5">
      <div className="flex flex-col pt-6 gap-4 mb-8">
        <span className="text-xl font-bold tracking-tight">Conversation</span>
        <span className="text-neutral-400 leading-5 text-sm">
          This conversation is about a doctor&apos;s visit on {dateLabel}
        </span>
      </div>
      <div className="w-full h-full flex flex-col gap-4 items-center justify-center rounded-2xl bg-white border border-neutral-200">
        <button
          type="button"
          aria-label="Start recording"
          className="w-20 h-20 rounded-full border-2 border-neutral-900 bg-white flex items-center justify-center active:opacity-80 transition-opacity"
        >
          <HiMicrophone className="w-8 h-8 text-neutral-900" aria-hidden />
        </button>
        <span className="text-center text-base text-neutral-900">
          Press the button above to start recording
        </span>
      </div>
      <div className="pb-15 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full h-12 text-sm text-white rounded-full flex items-center px-5 bg-red-500 active:bg-red-400"
        >
          <TbArrowBackUp className="w-4 h-4 shrink-0" aria-hidden />
          <span className="flex-1 text-center">I don&apos;t want to record, go back</span>
          <span className="w-4 shrink-0" aria-hidden />
        </button>
      </div>
    </div>
  );
}
