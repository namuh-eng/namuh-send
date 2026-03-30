// ABOUTME: Unit tests for bounce rate section — rate calculation, info panel, chart, breakdown table

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

describe("Bounce Rate Section", () => {
  describe("calculateBounceRate", () => {
    it("should calculate bounce rate from permanent + transient + undetermined / sent * 100", async () => {
      const mod = await import("../src/components/bounce-rate-section");
      const result = mod.calculateBounceRate({
        permanent: 2,
        transient: 1,
        undetermined: 1,
        sent: 100,
      });
      expect(result).toBe(4);
    });

    it("should return 0 when sent is 0", async () => {
      const mod = await import("../src/components/bounce-rate-section");
      const result = mod.calculateBounceRate({
        permanent: 0,
        transient: 0,
        undetermined: 0,
        sent: 0,
      });
      expect(result).toBe(0);
    });

    it("should round to 2 decimal places", async () => {
      const mod = await import("../src/components/bounce-rate-section");
      const result = mod.calculateBounceRate({
        permanent: 1,
        transient: 1,
        undetermined: 1,
        sent: 700,
      });
      // 3/700 = 0.42857... → 0.43
      expect(result).toBe(0.43);
    });
  });

  describe("BounceRateSection component", () => {
    it("should export BounceRateSection component", async () => {
      const mod = await import("../src/components/bounce-rate-section");
      expect(mod.BounceRateSection).toBeDefined();
      expect(typeof mod.BounceRateSection).toBe("function");
    });

    it("should render SVG chart when daily data exists", async () => {
      const mod = await import("../src/components/bounce-rate-section");
      const { container } = render(
        React.createElement(mod.BounceRateSection, {
          data: {
            bounceRate: 2,
            permanent: 1,
            transient: 1,
            undetermined: 0,
            sent: 100,
            dailyBounceData: [
              { date: "2026-03-28", rate: 1 },
              { date: "2026-03-29", rate: 3 },
            ],
          },
          loading: false,
          dateRange: "Last 15 days",
        }),
      );
      const svgs = container.querySelectorAll("svg[role='application']");
      expect(svgs.length).toBeGreaterThanOrEqual(1);
    });

    it("should render breakdown table with Transient, Permanent, Undetermined rows", async () => {
      const mod = await import("../src/components/bounce-rate-section");
      render(
        React.createElement(mod.BounceRateSection, {
          data: {
            bounceRate: 4,
            permanent: 2,
            transient: 1,
            undetermined: 1,
            sent: 100,
            dailyBounceData: [],
          },
          loading: false,
          dateRange: "Last 15 days",
        }),
      );
      expect(screen.getByText("Transient")).toBeDefined();
      expect(screen.getByText("Permanent")).toBeDefined();
      expect(screen.getByText("Undetermined")).toBeDefined();
    });

    it("should render info chevron button to open info panel", async () => {
      const mod = await import("../src/components/bounce-rate-section");
      render(
        React.createElement(mod.BounceRateSection, {
          data: {
            bounceRate: 0,
            permanent: 0,
            transient: 0,
            undetermined: 0,
            sent: 0,
            dailyBounceData: [],
          },
          loading: false,
          dateRange: "Last 15 days",
        }),
      );
      const infoBtn = screen.getByRole("button", { name: /bounce rate info/i });
      expect(infoBtn).toBeDefined();
    });

    it("should open info panel with 'How Bounce Rate Works' title on info click", async () => {
      const mod = await import("../src/components/bounce-rate-section");
      render(
        React.createElement(mod.BounceRateSection, {
          data: {
            bounceRate: 0,
            permanent: 0,
            transient: 0,
            undetermined: 0,
            sent: 0,
            dailyBounceData: [],
          },
          loading: false,
          dateRange: "Last 15 days",
        }),
      );
      const infoBtn = screen.getByRole("button", { name: /bounce rate info/i });
      fireEvent.click(infoBtn);
      expect(screen.getByText("How Bounce Rate Works")).toBeDefined();
    });

    it("should close info panel on close button click", async () => {
      const mod = await import("../src/components/bounce-rate-section");
      render(
        React.createElement(mod.BounceRateSection, {
          data: {
            bounceRate: 0,
            permanent: 0,
            transient: 0,
            undetermined: 0,
            sent: 0,
            dailyBounceData: [],
          },
          loading: false,
          dateRange: "Last 15 days",
        }),
      );
      const infoBtn = screen.getByRole("button", { name: /bounce rate info/i });
      fireEvent.click(infoBtn);
      expect(screen.getByText("How Bounce Rate Works")).toBeDefined();

      const closeBtn = screen.getByRole("button", { name: /close/i });
      fireEvent.click(closeBtn);
      expect(screen.queryByText("How Bounce Rate Works")).toBeNull();
    });

    it("should show breakdown row percentages", async () => {
      const mod = await import("../src/components/bounce-rate-section");
      render(
        React.createElement(mod.BounceRateSection, {
          data: {
            bounceRate: 4,
            permanent: 2,
            transient: 1,
            undetermined: 1,
            sent: 100,
            dailyBounceData: [],
          },
          loading: false,
          dateRange: "Last 15 days",
        }),
      );
      // Permanent = 2/100 = 2%, Transient = 1/100 = 1%, Undetermined = 1/100 = 1%
      expect(screen.getByText("2%")).toBeDefined();
      // There will be two 1% values
      const onePercents = screen.getAllByText("1%");
      expect(onePercents.length).toBe(2);
    });

    it("should show loading state", async () => {
      const mod = await import("../src/components/bounce-rate-section");
      render(
        React.createElement(mod.BounceRateSection, {
          data: {
            bounceRate: 0,
            permanent: 0,
            transient: 0,
            undetermined: 0,
            sent: 0,
            dailyBounceData: [],
          },
          loading: true,
          dateRange: "Last 15 days",
        }),
      );
      expect(screen.getByText("Loading...")).toBeDefined();
    });

    it("should render breakdown row links with correct href params", async () => {
      const mod = await import("../src/components/bounce-rate-section");
      const { container } = render(
        React.createElement(mod.BounceRateSection, {
          data: {
            bounceRate: 4,
            permanent: 2,
            transient: 1,
            undetermined: 1,
            sent: 100,
            dailyBounceData: [],
          },
          loading: false,
          dateRange: "Last 7 days",
        }),
      );
      const links = container.querySelectorAll("a[href*='/emails']");
      expect(links.length).toBe(3);
      // Each link should have statuses=bounced and date params
      for (const link of links) {
        const href = link.getAttribute("href") || "";
        expect(href).toContain("statuses=bounced");
        expect(href).toContain("startDate=");
        expect(href).toContain("endDate=");
      }
    });
  });
});
