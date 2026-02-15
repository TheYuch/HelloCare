"use client";

import { HiChevronDown } from "react-icons/hi";

export type PillOption = {
  readonly value: string;
  readonly label: string;
};

type PillDropdownProps = {
  value: string;
  options: readonly PillOption[];
  onChange: (value: string) => void;
  /** Map of value → Tailwind classes for bg/text/border. Falls back to a neutral style. */
  styles?: Record<string, string>;
  ariaLabel?: string;
};

const DEFAULT_STYLE = "bg-neutral-100 text-neutral-600 border-neutral-200";

export function PillDropdown({
  value,
  options,
  onChange,
  styles,
  ariaLabel = "Change value",
}: PillDropdownProps) {
  const style = styles?.[value] ?? DEFAULT_STYLE;
  return (
    <span className={`relative inline-flex items-center rounded-full border ${style}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none cursor-pointer bg-transparent pl-2.5 pr-5 py-0.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-neutral-400 rounded-full"
        aria-label={ariaLabel}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <HiChevronDown className="pointer-events-none absolute right-1.5 w-3 h-3 opacity-60" />
    </span>
  );
}
