// ABOUTME: Unit tests for the Deliverability Rate section — event type filter, SVG chart, domain breakdown table

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/metrics",
  useSearchParams: () => new URLSearchParams(),
}));

afterEach(() => {
  cleanup();
});

// ── Deliverability rate calculation ────────────────────────────────

describe("Deliverability rate calculation", () => {
  it("calculates deliverability rate as delivered / sent * 100", async () => {
    const mod = await import("../src/components/deliverability-section");
    expect(mod.calculateDeliverabilityRate(95, 100)).toBe(95);
    expect(mod.calculateDeliverabilityRate(50, 200)).toBe(25);
    expect(mod.calculateDeliverabilityRate(100, 100)).toBe(100);
  });

  it("returns 0 when no emails sent", async () => {
    const mod = await import("../src/components/deliverability-section");
    expect(mod.calculateDeliverabilityRate(0, 0)).toBe(0);
  });
});

// ── Event type filter ──────────────────────────────────────────────

const EVENT_TYPES = [
  "All Events",
  "Received",
  "Delivered",
  "Opened",
  "Clicked",
  "Bounced",
  "Complained",
  "Unsubscribed",
  "Delivery Delayed",
  "Failed",
  "Suppressed",
];

describe("Event type filter", () => {
  it("renders all 11 event type options (All Events + 10 individual types)", async () => {
    const mod = await import("../src/components/deliverability-section");
    expect(mod.EVENT_TYPE_OPTIONS).toBeDefined();
    expect(mod.EVENT_TYPE_OPTIONS.length).toBe(11);
    for (const eventType of EVENT_TYPES) {
      expect(
        mod.EVENT_TYPE_OPTIONS.some(
          (o: { label: string }) => o.label === eventType,
        ),
      ).toBe(true);
    }
  });

  it("renders event type filter dropdown with default 'All Events'", async () => {
    const mod = await import("../src/components/deliverability-section");
    const noop = () => {};
    render(
      React.createElement(mod.DeliverabilitySection, {
        data: {
          totalEmails: 3,
          deliverabilityRate: 100,
          dailyData: [],
          domainBreakdown: [],
        },
        loading: false,
        eventType: "all",
        onEventTypeChange: noop,
      }),
    );
    expect(screen.getByText("All Events")).toBeDefined();
  });

  it("shows dropdown options when clicked", async () => {
    const mod = await import("../src/components/deliverability-section");
    const noop = () => {};
    render(
      React.createElement(mod.DeliverabilitySection, {
        data: {
          totalEmails: 3,
          deliverabilityRate: 100,
          dailyData: [],
          domainBreakdown: [],
        },
        loading: false,
        eventType: "all",
        onEventTypeChange: noop,
      }),
    );
    fireEvent.click(screen.getByText("All Events"));
    // Should show all individual event types
    expect(screen.getByText("Received")).toBeDefined();
    expect(screen.getByText("Delivered")).toBeDefined();
    expect(screen.getByText("Bounced")).toBeDefined();
    expect(screen.getByText("Suppressed")).toBeDefined();
  });

  it("calls onEventTypeChange when an event type is selected", async () => {
    const mod = await import("../src/components/deliverability-section");
    const onChange = vi.fn();
    render(
      React.createElement(mod.DeliverabilitySection, {
        data: {
          totalEmails: 3,
          deliverabilityRate: 100,
          dailyData: [],
          domainBreakdown: [],
        },
        loading: false,
        eventType: "all",
        onEventTypeChange: onChange,
      }),
    );
    fireEvent.click(screen.getByText("All Events"));
    fireEvent.click(screen.getByText("Delivered"));
    expect(onChange).toHaveBeenCalledWith("delivered");
  });
});

// ── SVG Chart ──────────────────────────────────────────────────────

describe("Deliverability chart", () => {
  it("renders SVG chart with daily data points", async () => {
    const mod = await import("../src/components/deliverability-section");
    const noop = () => {};
    const dailyData = [
      { date: "2026-03-15", count: 0 },
      { date: "2026-03-16", count: 1 },
      { date: "2026-03-17", count: 2 },
      { date: "2026-03-18", count: 3 },
    ];
    const { container } = render(
      React.createElement(mod.DeliverabilitySection, {
        data: {
          totalEmails: 6,
          deliverabilityRate: 100,
          dailyData,
          domainBreakdown: [],
        },
        loading: false,
        eventType: "all",
        onEventTypeChange: noop,
      }),
    );
    const svg = container.querySelector("svg[role='application']");
    expect(svg).not.toBeNull();
  });

  it("renders date labels on x-axis", async () => {
    const mod = await import("../src/components/deliverability-section");
    const noop = () => {};
    const dailyData = [
      { date: "2026-03-15", count: 1 },
      { date: "2026-03-16", count: 2 },
    ];
    render(
      React.createElement(mod.DeliverabilitySection, {
        data: {
          totalEmails: 3,
          deliverabilityRate: 100,
          dailyData,
          domainBreakdown: [],
        },
        loading: false,
        eventType: "all",
        onEventTypeChange: noop,
      }),
    );
    expect(screen.getByText("Mar, 15")).toBeDefined();
    expect(screen.getByText("Mar, 16")).toBeDefined();
  });

  it("shows 'No data for this period' when dailyData is empty", async () => {
    const mod = await import("../src/components/deliverability-section");
    const noop = () => {};
    render(
      React.createElement(mod.DeliverabilitySection, {
        data: {
          totalEmails: 0,
          deliverabilityRate: 0,
          dailyData: [],
          domainBreakdown: [],
        },
        loading: false,
        eventType: "all",
        onEventTypeChange: noop,
      }),
    );
    expect(screen.getByText("No data for this period")).toBeDefined();
  });
});

// ── Domain breakdown table ─────────────────────────────────────────

describe("Domain breakdown table", () => {
  it("renders domain names with deliverability percentages", async () => {
    const mod = await import("../src/components/deliverability-section");
    const noop = () => {};
    const domainBreakdown = [
      { domain: "updates.foreverbrowsing.com", rate: 100, count: 3 },
      { domain: "mail.example.com", rate: 95.5, count: 20 },
    ];
    render(
      React.createElement(mod.DeliverabilitySection, {
        data: {
          totalEmails: 23,
          deliverabilityRate: 96,
          dailyData: [],
          domainBreakdown,
        },
        loading: false,
        eventType: "all",
        onEventTypeChange: noop,
      }),
    );
    expect(screen.getByText(/updates\.foreverbrowsing\.com/)).toBeDefined();
    expect(screen.getByText("100%")).toBeDefined();
    expect(screen.getByText(/mail\.example\.com/)).toBeDefined();
    expect(screen.getByText("95.5%")).toBeDefined();
  });

  it("shows email count next to domain name", async () => {
    const mod = await import("../src/components/deliverability-section");
    const noop = () => {};
    const domainBreakdown = [
      { domain: "updates.foreverbrowsing.com", rate: 100, count: 3 },
    ];
    render(
      React.createElement(mod.DeliverabilitySection, {
        data: {
          totalEmails: 3,
          deliverabilityRate: 100,
          dailyData: [],
          domainBreakdown,
        },
        loading: false,
        eventType: "all",
        onEventTypeChange: noop,
      }),
    );
    // The count should be displayed in parentheses like in the screenshot: "domain (3)"
    expect(screen.getByText(/\(3\)/)).toBeDefined();
  });
});
