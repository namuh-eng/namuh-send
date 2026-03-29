// Demo: Send a beautiful React email via the Resend Clone API
// Usage: npx tsx scripts/demo-react-email.tsx

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// ── Beautiful React Email Component ──────────────────────────

function WelcomeEmail({ name }: { name: string }) {
  const styles = `
    body { margin: 0; padding: 0; background: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card { background: #18181b; border-radius: 12px; border: 1px solid #27272a; padding: 40px; }
    .logo { font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 32px; }
    .logo span { color: #3b82f6; }
    h1 { color: #fafafa; font-size: 28px; margin: 0 0 16px 0; line-height: 1.3; }
    .subtitle { color: #a1a1aa; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0; }
    .feature { background: #09090b; border: 1px solid #27272a; border-radius: 8px; padding: 20px; margin-bottom: 12px; }
    .feature-title { color: #fafafa; font-size: 14px; font-weight: 600; margin: 0 0 4px 0; }
    .feature-desc { color: #71717a; font-size: 13px; margin: 0; }
    .cta { display: inline-block; background: #3b82f6; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
    .footer { text-align: center; padding: 24px 0; color: #52525b; font-size: 12px; }
    .divider { height: 1px; background: #27272a; margin: 32px 0; }
  `;

  return React.createElement("html", null,
    React.createElement("head", null,
      React.createElement("style", null, styles)
    ),
    React.createElement("body", null,
      React.createElement("div", { className: "container" },
        React.createElement("div", { className: "card" },
          React.createElement("div", { className: "logo" }, "resend", React.createElement("span", null, "-clone")),
          React.createElement("h1", null, `Welcome to Resend Clone, ${name}! 🚀`),
          React.createElement("p", { className: "subtitle" },
            "This email was built with React components and sent through our autonomously-cloned email API — powered by AWS SES, RDS Postgres, and deployed on App Runner."
          ),
          React.createElement("div", null,
            React.createElement("div", { className: "feature" },
              React.createElement("p", { className: "feature-title" }, "📧 Real Email Delivery"),
              React.createElement("p", { className: "feature-desc" }, "Powered by AWS SES with DKIM, SPF, and DMARC verification")
            ),
            React.createElement("div", { className: "feature" },
              React.createElement("p", { className: "feature-title" }, "⚛️ React Email Templates"),
              React.createElement("p", { className: "feature-desc" }, "Write emails as React components — renderToStaticMarkup under the hood")
            ),
            React.createElement("div", { className: "feature" },
              React.createElement("p", { className: "feature-title" }, "🤖 Autonomously Built"),
              React.createElement("p", { className: "feature-desc" }, "Entire product cloned from resend.com by AI agents in one session")
            ),
            React.createElement("div", { className: "feature" },
              React.createElement("p", { className: "feature-title" }, "🔑 Full REST API"),
              React.createElement("p", { className: "feature-desc" }, "Emails, domains, contacts, broadcasts, templates, webhooks, and more")
            )
          ),
          React.createElement("a", { href: "https://zjucbjapsn.us-east-1.awsapprunner.com", className: "cta" }, "View Dashboard →"),
          React.createElement("div", { className: "divider" }),
          React.createElement("p", { style: { color: "#52525b", fontSize: "13px", margin: 0 } },
            "Built at Ralphthon 2026 — Ralph-to-Ralph: Autonomous Product Cloner"
          )
        ),
        React.createElement("div", { className: "footer" }, "Sent from jaeyunha@foreverbrowsing.com via resend-clone API")
      )
    )
  );
}

// ── Send the email ───────────────────────────────────────────

async function main() {
  const html = renderToStaticMarkup(React.createElement(WelcomeEmail, { name: "Jaeyun" }));

  console.log("Sending React email via Resend Clone API...\n");

  const res = await fetch("https://zjucbjapsn.us-east-1.awsapprunner.com/api/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer re_dev_token_123",
    },
    body: JSON.stringify({
      from: "jaeyunha@foreverbrowsing.com",
      to: ["jaeyunha0317@gmail.com"],
      subject: "Welcome to Resend Clone — Built by AI 🚀",
      html,
    }),
  });

  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Response:", JSON.stringify(data, null, 2));
  console.log("\n✓ Check jaeyunha0317@gmail.com for the email!");
}

main().catch(console.error);
