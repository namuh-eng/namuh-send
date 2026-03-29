"use client";

import { CopyToClipboard } from "@/components/copy-to-clipboard";
import { StatusBadge } from "@/components/status-badge";
import { useRef, useState } from "react";

export interface EmailDetailData {
  id: string;
  from: string;
  to: string[];
  subject: string;
  html: string | null;
  text: string | null;
  createdAt: string;
  events: Array<{ type: string; timestamp: string }>;
}

interface EmailDetailProps {
  email: EmailDetailData;
}

function getStatusVariant(
  status: string,
): "success" | "error" | "warning" | "info" | "default" {
  switch (status) {
    case "delivered":
    case "sent":
      return "success";
    case "bounced":
    case "failed":
      return "error";
    case "opened":
    case "clicked":
      return "info";
    case "delivery_delayed":
    case "complained":
      return "warning";
    default:
      return "default";
  }
}

function formatStatusLabel(status: string): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatEventTimestamp(dateStr: string): string {
  const d = new Date(dateStr);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[d.getMonth()];
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${month} ${day}, ${h}:${minutes} ${ampm}`;
}

/**
 * Renders trusted email HTML in a sandboxed iframe.
 * The HTML comes from our own DB (stored when we sent the email via SES),
 * so it is trusted first-party content — not user-supplied input.
 */
function EmailPreview({ html }: { html: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <iframe
      ref={iframeRef}
      data-testid="email-preview"
      title="Email preview"
      sandbox=""
      srcDoc={html}
      className="w-full min-h-[300px] border-0"
    />
  );
}

export function EmailDetail({ email }: EmailDetailProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "plaintext" | "html">(
    "preview",
  );
  const primaryTo = email.to[0] || "";

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div
          data-testid="email-envelope-icon"
          className="w-14 h-14 rounded-xl bg-[rgba(24,25,28,0.88)] border border-[rgba(176,199,217,0.145)] flex items-center justify-center shrink-0"
        >
          <svg
            aria-hidden="true"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4ade80"
            strokeWidth="1.5"
          >
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-[#A1A4A5] mb-0.5">Email</p>
          <h1 className="text-[22px] font-semibold text-[#F0F0F0] truncate">
            {primaryTo}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="More actions"
            className="p-2 rounded-lg hover:bg-[rgba(176,199,217,0.145)] text-[#A1A4A5] hover:text-[#F0F0F0] transition-colors"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div>
          <p className="text-[11px] font-medium text-[#A1A4A5] tracking-wider mb-1">
            FROM
          </p>
          <p className="text-[14px] text-[#F0F0F0]">{email.from}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-[#A1A4A5] tracking-wider mb-1">
            SUBJECT
          </p>
          <p className="text-[14px] text-[#F0F0F0]">{email.subject}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-[#A1A4A5] tracking-wider mb-1">
            TO
          </p>
          <p className="text-[14px] text-[#F0F0F0]">{primaryTo}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-[#A1A4A5] tracking-wider mb-1">
            ID
          </p>
          <CopyToClipboard value={email.id} />
        </div>
      </div>

      {/* Email Events */}
      <div className="mb-8">
        <p className="text-[11px] font-medium text-[#A1A4A5] tracking-wider mb-4">
          EMAIL EVENTS
        </p>
        <div data-testid="event-timeline" className="flex items-center gap-6">
          {email.events.map((event, i) => (
            <div key={event.timestamp} className="flex items-center gap-6">
              {i > 0 && (
                <div className="w-8 h-px bg-[rgba(176,199,217,0.145)]" />
              )}
              <div className="flex flex-col items-center gap-1">
                <div data-testid="event-badge">
                  <StatusBadge
                    status={formatStatusLabel(event.type)}
                    variant={getStatusVariant(event.type)}
                  />
                </div>
                <span className="text-[11px] text-[#A1A4A5]">
                  {formatEventTimestamp(event.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Tabs */}
      <div className="border-b border-[rgba(176,199,217,0.145)] mb-4">
        <div className="flex gap-0">
          {(
            [
              { key: "preview", label: "Preview" },
              { key: "plaintext", label: "Plain Text" },
              { key: "html", label: "HTML" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`px-4 py-2 text-[13px] font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-[#F0F0F0] text-[#F0F0F0]"
                  : "border-transparent text-[#A1A4A5] hover:text-[#F0F0F0]"
              }`}
              onClick={() => setActiveTab(tab.key)}
              data-state={activeTab === tab.key ? "active" : "inactive"}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg min-h-[300px] p-6">
        {activeTab === "preview" && <EmailPreview html={email.html || ""} />}
        {activeTab === "plaintext" && (
          <pre
            data-testid="email-plaintext"
            className="text-black text-[14px] whitespace-pre-wrap font-mono"
          >
            {email.text || ""}
          </pre>
        )}
        {activeTab === "html" && (
          <pre
            data-testid="email-html"
            className="text-black text-[14px] whitespace-pre-wrap font-mono"
          >
            {email.html || ""}
          </pre>
        )}
      </div>
    </div>
  );
}
