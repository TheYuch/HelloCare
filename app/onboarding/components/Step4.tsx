import { Spinner } from "@/app/components/Spinner";
import { Step4Props } from "../types";

export function Step4({ onContinue, saving, saveError }: Step4Props) {
  return (
    <div className="flex flex-col gap-10 px-5">
      <div className="flex flex-col items-center leading-5 gap-1">
        <span>You&apos;re all set!</span>
        <span className="text-neutral-400 max-w-xs text-center">Welcome to hellocare.</span>
      </div>
      {saveError && (
        <p className="text-sm text-red-600 text-center">{saveError}</p>
      )}
      <button
        onClick={onContinue}
        disabled={saving}
        className="w-full h-12 font-semibold text-sm text-white bg-neutral-900 rounded-full flex items-center justify-center active:bg-neutral-700 disabled:opacity-50 disabled:pointer-events-none"
      >
        {saving ? <Spinner size="sm" /> : "Finish"}
      </button>
    </div>
  );
}
