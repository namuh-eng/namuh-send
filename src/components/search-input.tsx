"use client";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: SearchInputProps) {
  return (
    <div className="relative flex items-center">
      <svg
        aria-hidden="true"
        className="absolute left-3 text-[#A1A4A5] pointer-events-none"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border border-[rgba(176,199,217,0.145)] rounded-[12px] py-1.5 pl-9 pr-3 text-[13px] text-[#F0F0F0] placeholder-[#A1A4A5] outline-none focus:border-[rgba(176,199,217,0.3)] transition-colors"
      />
    </div>
  );
}
