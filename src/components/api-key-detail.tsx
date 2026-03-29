"use client";

import { Modal } from "@/components/modal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export interface ApiKeyDetailData {
  id: string;
  name: string;
  keyPrefix: string;
  permission: "full_access" | "sending_access";
  domainId: string | null;
  domainName: string;
  totalUses: number;
  lastUsedAt: string | null;
  createdAt: string;
  creatorEmail: string;
}

interface DomainOption {
  id: string;
  name: string;
}

interface ApiKeyDetailProps {
  apiKey: ApiKeyDetailData;
  domains: DomainOption[];
}

function formatPermission(p: string): string {
  if (p === "full_access") return "Full access";
  if (p === "sending_access") return "Sending access";
  return p;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  if (diffDays > 0)
    return `about ${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffHours > 0)
    return `about ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffMins > 0)
    return `about ${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  return "just now";
}

export function ApiKeyDetail({ apiKey, domains }: ApiKeyDetailProps) {
  const router = useRouter();
  const [actionsOpen, setActionsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editName, setEditName] = useState(apiKey.name);
  const [editPermission, setEditPermission] = useState(apiKey.permission);
  const [editDomainId, setEditDomainId] = useState(apiKey.domainId ?? "");
  const [currentName, setCurrentName] = useState(apiKey.name);
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/api-keys/${apiKey.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          permission: editPermission,
          domain_id: editDomainId || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentName(data.name || editName.trim());
        setEditOpen(false);
        router.refresh();
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  }, [apiKey.id, editName, editPermission, editDomainId, saving, router]);

  const handleDelete = useCallback(async () => {
    try {
      await fetch(`/api/api-keys/${apiKey.id}`, { method: "DELETE" });
      router.push("/api-keys");
    } catch {
      // silently fail
    }
  }, [apiKey.id, router]);

  const handleEditPermissionChange = useCallback(
    (value: "full_access" | "sending_access") => {
      setEditPermission(value);
      if (value === "full_access") {
        setEditDomainId("");
      }
    },
    [],
  );

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-[13px] text-[#A1A4A5]">
        <Link
          href="/api-keys"
          className="hover:text-[#F0F0F0] transition-colors"
        >
          API Keys
        </Link>
        <span>/</span>
        <span className="text-[#F0F0F0]">API Key</span>
      </div>

      {/* Header with icon, name, and actions */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          {/* Lock icon */}
          <div
            data-testid="key-icon"
            className="w-16 h-16 rounded-xl bg-[rgba(24,25,28,0.88)] border border-[rgba(176,199,217,0.145)] flex items-center justify-center"
          >
            <svg
              aria-hidden="true"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4ade80"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <div>
            <p className="text-[13px] text-[#A1A4A5]">API Key</p>
            <h1 className="text-2xl font-semibold text-[#F0F0F0]">
              {currentName}
            </h1>
          </div>
        </div>

        {/* More actions */}
        <div className="relative">
          <button
            type="button"
            aria-label="More actions"
            className="p-2 rounded-md border border-[rgba(176,199,217,0.145)] text-[#A1A4A5] hover:text-[#F0F0F0] hover:bg-[rgba(24,25,28,0.5)] transition-colors"
            onClick={() => setActionsOpen(!actionsOpen)}
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
          {actionsOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-md border border-[rgba(176,199,217,0.145)] bg-[#0a0a0a] shadow-xl z-20 py-1">
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-[13px] text-[#F0F0F0] hover:bg-[rgba(24,25,28,0.5)]"
                onClick={() => {
                  setActionsOpen(false);
                  setEditName(currentName);
                  setEditOpen(true);
                }}
              >
                Edit API key
              </button>
              <Link
                href="/docs"
                className="block px-3 py-2 text-[13px] text-[#F0F0F0] hover:bg-[rgba(24,25,28,0.5)]"
                onClick={() => setActionsOpen(false)}
              >
                Go to docs
              </Link>
              <div className="border-t border-[rgba(176,199,217,0.145)] my-1" />
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-[13px] text-red-400 hover:bg-[rgba(24,25,28,0.5)]"
                onClick={() => {
                  setActionsOpen(false);
                  setDeleteOpen(true);
                }}
              >
                Delete API key
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Metadata grid — 2 rows, matching screenshot layout */}
      <div className="grid grid-cols-4 gap-x-8 gap-y-6">
        {/* Row 1 */}
        <div>
          <p className="text-[11px] font-semibold text-[#A1A4A5] tracking-wider mb-1">
            PERMISSION
          </p>
          <p className="text-[14px] text-[#F0F0F0]">
            {formatPermission(apiKey.permission)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-[#A1A4A5] tracking-wider mb-1">
            DOMAIN
          </p>
          <p className="text-[14px] text-[#F0F0F0]">{apiKey.domainName}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-[#A1A4A5] tracking-wider mb-1">
            TOTAL USES
          </p>
          <p className="text-[14px]">
            <a
              href={`/logs?api_key=${apiKey.id}`}
              className="text-[#F0F0F0] hover:underline"
            >
              {apiKey.totalUses} times
            </a>
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-[#A1A4A5] tracking-wider mb-1">
            TOKEN
          </p>
          <p className="text-[14px] text-[#A1A4A5] font-mono">
            {apiKey.keyPrefix}
          </p>
        </div>

        {/* Row 2 */}
        <div>
          <p className="text-[11px] font-semibold text-[#A1A4A5] tracking-wider mb-1">
            LAST USED
          </p>
          <p className="text-[14px] text-[#F0F0F0]">
            {apiKey.lastUsedAt
              ? formatRelativeTime(apiKey.lastUsedAt)
              : "Never"}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-[#A1A4A5] tracking-wider mb-1">
            CREATED
          </p>
          <p className="text-[14px] text-[#F0F0F0]">
            {formatRelativeTime(apiKey.createdAt)}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-[#A1A4A5] tracking-wider mb-1">
            CREATOR
          </p>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[rgba(176,199,217,0.145)]" />
            <p className="text-[14px] text-[#F0F0F0]">{apiKey.creatorEmail}</p>
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit API Key"
        actionLabel="Save"
        onAction={handleSave}
        actionDisabled={!editName.trim()}
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="edit-name"
              className="block text-[13px] text-[#F0F0F0] mb-1.5"
            >
              Name
            </label>
            <input
              id="edit-name"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-transparent border border-[rgba(176,199,217,0.145)] rounded-md py-2 px-3 text-[14px] text-[#F0F0F0] outline-none focus:border-[rgba(176,199,217,0.3)] transition-colors"
            />
          </div>
          <div>
            <label
              htmlFor="edit-permission"
              className="block text-[13px] text-[#F0F0F0] mb-1.5"
            >
              Permission
            </label>
            <select
              id="edit-permission"
              value={editPermission}
              onChange={(e) =>
                handleEditPermissionChange(
                  e.target.value as "full_access" | "sending_access",
                )
              }
              className="w-full bg-[rgba(24,25,28,0.88)] border border-[rgba(176,199,217,0.145)] rounded-md py-2 px-3 text-[14px] text-[#F0F0F0] outline-none focus:border-[rgba(176,199,217,0.3)] transition-colors appearance-none cursor-pointer"
            >
              <option value="full_access">Full access</option>
              <option value="sending_access">Sending access</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="edit-domain"
              className="block text-[13px] text-[#F0F0F0] mb-1.5"
            >
              Domain
            </label>
            <select
              id="edit-domain"
              value={editDomainId}
              onChange={(e) => setEditDomainId(e.target.value)}
              disabled={editPermission === "full_access"}
              className={`w-full bg-[rgba(24,25,28,0.88)] border border-[rgba(176,199,217,0.145)] rounded-md py-2 px-3 text-[14px] text-[#F0F0F0] outline-none focus:border-[rgba(176,199,217,0.3)] transition-colors appearance-none cursor-pointer ${editPermission === "full_access" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <option value="">All Domains</option>
              {domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete API Key"
        actionLabel="Delete"
        onAction={handleDelete}
        actionVariant="destructive"
      >
        <p className="text-[13px] text-[#A1A4A5]">
          Are you sure you want to delete this API key? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
}
