// Demo: Send a stunning React email via the Resend Clone SDK
// Usage: npx tsx scripts/demo-react-email.tsx

import React from "react";
import { ResendClone } from "../packages/sdk/src";

// ── React Email Components ──────────────────────────────────

const e = React.createElement;

const Card = ({ children }: { children: React.ReactNode }) =>
  e("div", { style: { background: "#18181b", borderRadius: "16px", border: "1px solid #27272a", padding: "48px", marginBottom: "16px" } }, children);

const Badge = ({ color, label }: { color: string; label: string }) =>
  e("span", { style: { display: "inline-block", background: color, color: "#fff", padding: "4px 14px", borderRadius: "99px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" as const } }, label);

const Stat = ({ value, label }: { value: string; label: string }) =>
  e("div", { style: { textAlign: "center" as const, flex: 1 } },
    e("div", { style: { fontSize: "36px", fontWeight: 800, color: "#fafafa", lineHeight: 1 } }, value),
    e("div", { style: { fontSize: "12px", color: "#71717a", marginTop: "8px", textTransform: "uppercase" as const, letterSpacing: "1px" } }, label),
  );

const Divider = () =>
  e("div", { style: { height: "1px", background: "linear-gradient(to right, transparent, #3b82f6, transparent)", margin: "32px 0" } });

function WelcomeEmail({ name }: { name: string }) {
  return e("html", null,
    e("body", { style: { margin: 0, padding: 0, background: "#09090b", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif" } },
      e("div", { style: { maxWidth: "600px", margin: "0 auto", padding: "40px 20px" } },

        // Header with gradient accent
        e("div", { style: { textAlign: "center" as const, marginBottom: "32px" } },
          e("div", { style: { fontSize: "32px", fontWeight: 800, color: "#fafafa", letterSpacing: "-0.5px" } },
            "resend", e("span", { style: { color: "#3b82f6" } }, "-clone")
          ),
          e("div", { style: { fontSize: "13px", color: "#52525b", marginTop: "8px" } }, "Autonomous Product Cloner"),
        ),

        // Main card
        e(Card, null,
          // Greeting
          e("div", { style: { marginBottom: "24px" } },
            e(Badge, { color: "#22c55e", label: "Live on AWS" }),
          ),
          e("h1", { style: { color: "#fafafa", fontSize: "28px", fontWeight: 700, margin: "0 0 12px", lineHeight: 1.3 } },
            `Hey ${name},`
          ),
          e("h2", { style: { color: "#a1a1aa", fontSize: "18px", fontWeight: 400, margin: "0 0 24px", lineHeight: 1.5 } },
            "Your Resend clone is live. Built entirely by AI agents in one autonomous session."
          ),

          e(Divider, null),

          // Stats row
          e("div", { style: { display: "flex", gap: "16px", margin: "0 0 32px" } },
            e(Stat, { value: "52", label: "Features" }),
            e(Stat, { value: "24K", label: "Lines of Code" }),
            e(Stat, { value: "388", label: "Tests Passing" }),
          ),

          e(Divider, null),

          // Feature list
          e("div", { style: { marginBottom: "32px" } },
            ...[
              { icon: "📧", title: "Real Email Delivery", desc: "AWS SES production mode with DKIM, SPF, DMARC" },
              { icon: "🌐", title: "Auto DNS Configuration", desc: "Cloudflare API auto-configures domain records" },
              { icon: "⚛️", title: "React Email SDK", desc: "renderToStaticMarkup() — write emails as components" },
              { icon: "🔑", title: "Full REST API", desc: "16+ endpoints with Bearer token auth" },
              { icon: "🚀", title: "Deployed to AWS", desc: "App Runner + RDS Postgres + S3" },
            ].map(f =>
              e("div", { key: f.title, style: { display: "flex", gap: "16px", padding: "16px 0", borderBottom: "1px solid #1f1f23" } },
                e("div", { style: { fontSize: "24px", width: "40px", textAlign: "center" as const } }, f.icon),
                e("div", null,
                  e("div", { style: { color: "#fafafa", fontSize: "14px", fontWeight: 600, marginBottom: "2px" } }, f.title),
                  e("div", { style: { color: "#71717a", fontSize: "13px" } }, f.desc),
                ),
              )
            ),
          ),

          // CTA
          e("div", { style: { textAlign: "center" as const } },
            e("a", {
              href: "https://zjucbjapsn.us-east-1.awsapprunner.com",
              style: { display: "inline-block", background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff", padding: "14px 32px", borderRadius: "10px", textDecoration: "none", fontWeight: 700, fontSize: "15px", letterSpacing: "0.3px" }
            }, "Open Dashboard"),
          ),
        ),

        // Footer
        e("div", { style: { textAlign: "center" as const, padding: "24px 0" } },
          e("div", { style: { color: "#3f3f46", fontSize: "12px", marginBottom: "8px" } },
            "Built at Ralphthon Seoul 2026"
          ),
          e("div", { style: { color: "#27272a", fontSize: "11px" } },
            "Ralph-to-Ralph: Give it any URL. It builds the product."
          ),
        ),
      ),
    ),
  );
}

// ── Send via SDK ─────────────────────────────────────────────

const resend = new ResendClone("re_dev_token_123", {
  baseUrl: "https://zjucbjapsn.us-east-1.awsapprunner.com",
});

async function main() {
  console.log("Rendering React email + sending via SDK...\n");

  const { data, error } = await resend.emails.send({
    from: "jaeyunha@foreverbrowsing.com",
    to: "jaeyunha0317@gmail.com",
    subject: "Your Resend Clone is Live 🚀",
    react: React.createElement(WelcomeEmail, { name: "Jaeyun" }),
  });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Sent! ID:", data?.id);
  console.log("\n✓ Check jaeyunha0317@gmail.com");
}

main().catch(console.error);
