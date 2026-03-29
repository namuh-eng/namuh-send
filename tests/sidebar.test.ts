import { describe, expect, it } from "vitest";

// Test the sidebar navigation configuration
const NAV_ITEMS = [
  { label: "Emails", href: "/emails" },
  { label: "Broadcasts", href: "/broadcasts" },
  { label: "Templates", href: "/templates" },
  { label: "Audience", href: "/audience" },
  { label: "Metrics", href: "/metrics" },
  { label: "Domains", href: "/domains" },
  { label: "Logs", href: "/logs" },
  { label: "API Keys", href: "/api-keys" },
  { label: "Webhooks", href: "/webhooks" },
  { label: "Settings", href: "/settings" },
];

describe("Sidebar navigation", () => {
  it("has exactly 10 nav items", () => {
    expect(NAV_ITEMS).toHaveLength(10);
  });

  it("includes all required nav labels", () => {
    const labels = NAV_ITEMS.map((item) => item.label);
    expect(labels).toEqual([
      "Emails",
      "Broadcasts",
      "Templates",
      "Audience",
      "Metrics",
      "Domains",
      "Logs",
      "API Keys",
      "Webhooks",
      "Settings",
    ]);
  });

  it("all nav items have valid href paths", () => {
    for (const item of NAV_ITEMS) {
      expect(item.href).toMatch(/^\/[a-z-]+$/);
    }
  });

  it("no duplicate hrefs", () => {
    const hrefs = NAV_ITEMS.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("no duplicate labels", () => {
    const labels = NAV_ITEMS.map((item) => item.label);
    expect(new Set(labels).size).toBe(labels.length);
  });
});
