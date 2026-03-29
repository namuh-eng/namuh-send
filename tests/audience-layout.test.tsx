import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// Mock next/navigation
const mockPush = vi.fn();
const mockPathname = vi.fn(() => "/audience");
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockPathname(),
}));

import { AudienceLayout } from "@/components/audience-layout";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("AudienceLayout", () => {
  it("renders Audience page with 4 tabs", () => {
    render(
      <AudienceLayout stats={{ all: 0, subscribed: 0, unsubscribed: 0 }}>
        <div>Content</div>
      </AudienceLayout>,
    );

    expect(screen.getByText("Audience")).toBeDefined();
    expect(screen.getByText("Contacts")).toBeDefined();
    expect(screen.getByText("Properties")).toBeDefined();
    expect(screen.getByText("Segments")).toBeDefined();
    expect(screen.getByText("Topics")).toBeDefined();
  });

  it("marks Contacts tab as active by default on /audience", () => {
    mockPathname.mockReturnValue("/audience");
    render(
      <AudienceLayout stats={{ all: 0, subscribed: 0, unsubscribed: 0 }}>
        <div>Content</div>
      </AudienceLayout>,
    );

    const contactsTab = screen.getByText("Contacts").closest("a");
    expect(contactsTab?.getAttribute("data-state")).toBe("active");

    const propertiesTab = screen.getByText("Properties").closest("a");
    expect(propertiesTab?.getAttribute("data-state")).toBe("inactive");
  });

  it("marks Properties tab as active on /audience/properties", () => {
    mockPathname.mockReturnValue("/audience/properties");
    render(
      <AudienceLayout stats={{ all: 0, subscribed: 0, unsubscribed: 0 }}>
        <div>Content</div>
      </AudienceLayout>,
    );

    const propertiesTab = screen.getByText("Properties").closest("a");
    expect(propertiesTab?.getAttribute("data-state")).toBe("active");

    const contactsTab = screen.getByText("Contacts").closest("a");
    expect(contactsTab?.getAttribute("data-state")).toBe("inactive");
  });

  it("renders summary stats row", () => {
    render(
      <AudienceLayout stats={{ all: 5, subscribed: 3, unsubscribed: 2 }}>
        <div>Content</div>
      </AudienceLayout>,
    );

    expect(screen.getByText("ALL CONTACTS")).toBeDefined();
    expect(screen.getByText("5")).toBeDefined();
    expect(screen.getByText("SUBSCRIBERS")).toBeDefined();
    expect(screen.getByText("3")).toBeDefined();
    expect(screen.getByText("UNSUBSCRIBERS")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
    expect(screen.getByText("METRICS")).toBeDefined();
  });

  it("renders Add contacts dropdown button", () => {
    render(
      <AudienceLayout stats={{ all: 0, subscribed: 0, unsubscribed: 0 }}>
        <div>Content</div>
      </AudienceLayout>,
    );

    const addButton = screen.getByRole("button", { name: /add contacts/i });
    expect(addButton).toBeDefined();
  });

  it("shows dropdown menu with Add manually and Import CSV options", () => {
    render(
      <AudienceLayout stats={{ all: 0, subscribed: 0, unsubscribed: 0 }}>
        <div>Content</div>
      </AudienceLayout>,
    );

    const addButton = screen.getByRole("button", { name: /add contacts/i });
    fireEvent.click(addButton);

    expect(screen.getByText("Add manually")).toBeDefined();
    expect(screen.getByText("Import CSV")).toBeDefined();
  });

  it("renders children content", () => {
    render(
      <AudienceLayout stats={{ all: 0, subscribed: 0, unsubscribed: 0 }}>
        <div>Test child content</div>
      </AudienceLayout>,
    );

    expect(screen.getByText("Test child content")).toBeDefined();
  });

  it("has correct tab hrefs", () => {
    render(
      <AudienceLayout stats={{ all: 0, subscribed: 0, unsubscribed: 0 }}>
        <div>Content</div>
      </AudienceLayout>,
    );

    const contactsTab = screen.getByText("Contacts").closest("a");
    expect(contactsTab?.getAttribute("href")).toBe("/audience");

    const propertiesTab = screen.getByText("Properties").closest("a");
    expect(propertiesTab?.getAttribute("href")).toBe("/audience/properties");

    const segmentsTab = screen.getByText("Segments").closest("a");
    expect(segmentsTab?.getAttribute("href")).toBe("/audience/segments");

    const topicsTab = screen.getByText("Topics").closest("a");
    expect(topicsTab?.getAttribute("href")).toBe("/audience/topics");
  });
});
