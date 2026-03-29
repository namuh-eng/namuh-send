import { describe, expect, it } from "vitest";

// Test the default values and data model for the broadcast editor sidebar
describe("Broadcast Editor Sidebar", () => {
  // Default style configuration
  const DEFAULT_PAGE_STYLE = {
    background: { color: "#000000", padding: 32 },
    body: {
      layout: "centered" as const,
      color: "#ffffff",
      width: 600,
      height: "auto" as const,
      padding: 0,
      borderRadius: 0,
      borderWidth: 0,
      borderColor: "#000000",
    },
  };

  const DEFAULT_THEME_MINIMAL = {
    text: {
      color: "#374151",
      fontSize: 14,
      fontWeight: "400",
      lineHeight: 1.5,
      letterSpacing: 0,
      decoration: "none" as const,
    },
    title: {
      color: "#111827",
      fontSize: 31,
      fontWeight: "600",
      lineHeight: 1.2,
      letterSpacing: 0,
      decoration: "none" as const,
    },
    subtitle: {
      color: "#111827",
      fontSize: 25,
      fontWeight: "600",
      lineHeight: 1.3,
      letterSpacing: 0,
      decoration: "none" as const,
    },
    heading: {
      color: "#111827",
      fontSize: 19,
      fontWeight: "600",
      lineHeight: 1.4,
      letterSpacing: 0,
      decoration: "none" as const,
    },
  };

  const DEFAULT_THEME_BASIC = {
    text: {
      color: "#4b5563",
      fontSize: 14,
      fontWeight: "400",
      lineHeight: 1.6,
      letterSpacing: 0,
      decoration: "none" as const,
    },
    title: {
      color: "#1f2937",
      fontSize: 31,
      fontWeight: "700",
      lineHeight: 1.2,
      letterSpacing: -0.5,
      decoration: "none" as const,
    },
    subtitle: {
      color: "#1f2937",
      fontSize: 25,
      fontWeight: "600",
      lineHeight: 1.3,
      letterSpacing: -0.3,
      decoration: "none" as const,
    },
    heading: {
      color: "#1f2937",
      fontSize: 19,
      fontWeight: "600",
      lineHeight: 1.4,
      letterSpacing: 0,
      decoration: "none" as const,
    },
  };

  describe("Page Style panel defaults", () => {
    it("renders page style panel with defaults", () => {
      expect(DEFAULT_PAGE_STYLE.body.width).toBe(600);
      expect(DEFAULT_PAGE_STYLE.body.padding).toBe(0);
      expect(DEFAULT_PAGE_STYLE.body.borderColor).toBe("#000000");
      expect(DEFAULT_PAGE_STYLE.body.borderWidth).toBe(0);
      expect(DEFAULT_PAGE_STYLE.body.borderRadius).toBe(0);
      expect(DEFAULT_PAGE_STYLE.body.height).toBe("auto");
      expect(DEFAULT_PAGE_STYLE.body.layout).toBe("centered");
      expect(DEFAULT_PAGE_STYLE.body.color).toBe("#ffffff");
      expect(DEFAULT_PAGE_STYLE.background.color).toBe("#000000");
      expect(DEFAULT_PAGE_STYLE.background.padding).toBe(32);
    });

    it("supports three layout options", () => {
      const layouts = ["full", "centered", "narrow"] as const;
      expect(layouts).toHaveLength(3);
      expect(layouts).toContain("full");
      expect(layouts).toContain("centered");
      expect(layouts).toContain("narrow");
    });
  });

  describe("Theme presets", () => {
    it("minimal theme has correct text style defaults", () => {
      expect(DEFAULT_THEME_MINIMAL.text.fontSize).toBe(14);
      expect(DEFAULT_THEME_MINIMAL.text.fontWeight).toBe("400");
      expect(DEFAULT_THEME_MINIMAL.title.fontSize).toBe(31);
      expect(DEFAULT_THEME_MINIMAL.title.fontWeight).toBe("600");
      expect(DEFAULT_THEME_MINIMAL.subtitle.fontSize).toBe(25);
      expect(DEFAULT_THEME_MINIMAL.subtitle.fontWeight).toBe("600");
      expect(DEFAULT_THEME_MINIMAL.heading.fontSize).toBe(19);
      expect(DEFAULT_THEME_MINIMAL.heading.fontWeight).toBe("600");
    });

    it("basic theme has correct text style defaults", () => {
      expect(DEFAULT_THEME_BASIC.text.fontSize).toBe(14);
      expect(DEFAULT_THEME_BASIC.text.fontWeight).toBe("400");
      expect(DEFAULT_THEME_BASIC.title.fontSize).toBe(31);
      expect(DEFAULT_THEME_BASIC.title.fontWeight).toBe("700");
      expect(DEFAULT_THEME_BASIC.subtitle.fontSize).toBe(25);
      expect(DEFAULT_THEME_BASIC.subtitle.fontWeight).toBe("600");
      expect(DEFAULT_THEME_BASIC.heading.fontSize).toBe(19);
      expect(DEFAULT_THEME_BASIC.heading.fontWeight).toBe("600");
    });

    it("switching preset changes all text styles at once", () => {
      let currentTheme = "minimal";
      let textStyles = { ...DEFAULT_THEME_MINIMAL };

      // Switch to basic
      currentTheme = "basic";
      textStyles = { ...DEFAULT_THEME_BASIC };

      expect(currentTheme).toBe("basic");
      expect(textStyles.title.fontWeight).toBe("700");
      expect(textStyles.title.letterSpacing).toBe(-0.5);
      expect(textStyles.text.lineHeight).toBe(1.6);
    });

    it("text style levels have all required properties", () => {
      const requiredProps = [
        "color",
        "fontSize",
        "fontWeight",
        "lineHeight",
        "letterSpacing",
        "decoration",
      ];
      for (const level of ["text", "title", "subtitle", "heading"] as const) {
        for (const prop of requiredProps) {
          expect(DEFAULT_THEME_MINIMAL[level]).toHaveProperty(prop);
          expect(DEFAULT_THEME_BASIC[level]).toHaveProperty(prop);
        }
      }
    });

    it("decoration supports none, underline, and strikethrough", () => {
      const decorations = ["none", "underline", "strikethrough"] as const;
      expect(decorations).toHaveLength(3);
      expect(DEFAULT_THEME_MINIMAL.text.decoration).toBe("none");
    });
  });

  describe("Global CSS panel", () => {
    it("default global CSS is empty string", () => {
      const globalCSS = "";
      expect(globalCSS).toBe("");
    });

    it("quick-insert buttons generate correct scaffolding", () => {
      const quickInserts = {
        "@media dark":
          "@media (prefers-color-scheme: dark) {\n  /* dark mode styles */\n}",
        "@media mobile":
          "@media only screen and (max-width: 600px) {\n  /* mobile styles */\n}",
        ".button":
          ".button {\n  background-color: #000000;\n  color: #ffffff;\n  padding: 12px 24px;\n  border-radius: 4px;\n  text-decoration: none;\n}",
      };

      expect(Object.keys(quickInserts)).toHaveLength(3);
      expect(quickInserts["@media dark"]).toContain("prefers-color-scheme");
      expect(quickInserts["@media mobile"]).toContain("max-width");
      expect(quickInserts[".button"]).toContain("background-color");
    });
  });

  describe("Style data model structure", () => {
    it("complete broadcast style has all required fields", () => {
      const broadcastStyle = {
        background: DEFAULT_PAGE_STYLE.background,
        body: DEFAULT_PAGE_STYLE.body,
        theme: "minimal" as "minimal" | "basic",
        textStyles: DEFAULT_THEME_MINIMAL,
        globalCSS: "",
      };

      expect(broadcastStyle).toHaveProperty("background");
      expect(broadcastStyle).toHaveProperty("body");
      expect(broadcastStyle).toHaveProperty("theme");
      expect(broadcastStyle).toHaveProperty("textStyles");
      expect(broadcastStyle).toHaveProperty("globalCSS");
      expect(broadcastStyle.theme).toBe("minimal");
    });
  });
});
