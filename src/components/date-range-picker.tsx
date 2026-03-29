"use client";

import { useEffect, useRef, useState } from "react";

const PRESETS = [
  "Today",
  "Yesterday",
  "Last 3 days",
  "Last 7 days",
  "Last 15 days",
  "Last 30 days",
] as const;

const DAY_HEADERS = [
  { key: "sun", label: "S" },
  { key: "mon", label: "M" },
  { key: "tue", label: "T" },
  { key: "wed", label: "W" },
  { key: "thu", label: "T" },
  { key: "fri", label: "F" },
  { key: "sat", label: "S" },
];

interface DateRangePickerProps {
  value: string;
  onChange: (value: string) => void;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = viewDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  // Build calendar grid with stable keys
  const cells: { key: string; day: number | null }[] = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ key: `pad-${i}`, day: null });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ key: `day-${d}`, day: d });
  }

  // Determine which days are "selected" based on preset
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const presetDays: Record<string, number> = {
    Today: 0,
    Yesterday: 1,
    "Last 3 days": 3,
    "Last 7 days": 7,
    "Last 15 days": 15,
    "Last 30 days": 30,
  };

  const rangeDays = presetDays[value] ?? 15;
  const rangeStart = new Date(today);
  if (value === "Yesterday") {
    rangeStart.setDate(rangeStart.getDate() - 1);
  } else if (value === "Today") {
    // just today
  } else {
    rangeStart.setDate(rangeStart.getDate() - rangeDays);
  }

  const isInRange = (day: number): boolean => {
    const d = new Date(year, month, day);
    if (value === "Yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return (
        d.getFullYear() === yesterday.getFullYear() &&
        d.getMonth() === yesterday.getMonth() &&
        d.getDate() === yesterday.getDate()
      );
    }
    if (value === "Today") {
      return (
        d.getFullYear() === todayYear &&
        d.getMonth() === todayMonth &&
        d.getDate() === todayDate
      );
    }
    return d >= rangeStart && d <= today;
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-[#F0F0F0] bg-[rgba(24,25,28,0.88)] border border-[rgba(176,199,217,0.145)] rounded-[12px] hover:border-[rgba(176,199,217,0.3)] transition-colors"
      >
        {value}
        <svg
          aria-hidden="true"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 rounded-[12px] border border-[rgba(176,199,217,0.145)] bg-[rgba(24,25,28,0.88)] shadow-lg backdrop-blur-sm flex">
          {/* Presets */}
          <div className="py-1 border-r border-[rgba(176,199,217,0.145)] min-w-[140px]">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                className="w-full flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#F0F0F0] hover:bg-[rgba(176,199,217,0.145)] transition-colors"
                onClick={() => {
                  onChange(preset);
                  setOpen(false);
                }}
              >
                <span className="flex-1 text-left">{preset}</span>
                {preset === value && (
                  <svg
                    aria-hidden="true"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-[#F0F0F0] flex-shrink-0"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          {/* Calendar */}
          <div className="p-3 min-w-[240px]">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                aria-label="Previous month"
                onClick={prevMonth}
                className="p-1 rounded hover:bg-[rgba(176,199,217,0.145)] text-[#A1A4A5] hover:text-[#F0F0F0] transition-colors"
              >
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <span className="text-[13px] text-[#F0F0F0] font-medium">
                {monthName}
              </span>
              <button
                type="button"
                aria-label="Next month"
                onClick={nextMonth}
                className="p-1 rounded hover:bg-[rgba(176,199,217,0.145)] text-[#A1A4A5] hover:text-[#F0F0F0] transition-colors"
              >
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-0 mb-1">
              {DAY_HEADERS.map((d) => (
                <div
                  key={d.key}
                  className="text-center text-[11px] text-[#A1A4A5] py-1"
                >
                  {d.label}
                </div>
              ))}
            </div>
            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-0">
              {cells.map((cell) => {
                if (cell.day === null) {
                  return <div key={cell.key} className="py-1" />;
                }
                const inRange = isInRange(cell.day);
                const isToday =
                  cell.day === todayDate &&
                  month === todayMonth &&
                  year === todayYear;
                return (
                  <div
                    key={cell.key}
                    className={`text-center text-[12px] py-1 cursor-pointer rounded transition-colors ${
                      inRange
                        ? "bg-[rgba(176,199,217,0.2)] text-[#F0F0F0]"
                        : "text-[#A1A4A5] hover:bg-[rgba(176,199,217,0.1)]"
                    } ${isToday ? "font-bold" : ""}`}
                  >
                    {cell.day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
