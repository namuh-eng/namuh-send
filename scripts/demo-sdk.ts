// Demo: Send email using the resend-clone SDK
// Usage: npx tsx scripts/demo-sdk.ts

import { ResendClone } from "../packages/sdk/src";

const resend = new ResendClone("re_dev_token_123", {
  baseUrl: "https://zjucbjapsn.us-east-1.awsapprunner.com",
});

async function main() {
  console.log("=== Resend Clone SDK Demo ===\n");

  // 1. Send a simple email
  console.log("1. Sending email...");
  const { data, error } = await resend.emails.send({
    from: "jaeyunha@foreverbrowsing.com",
    to: "jaeyunha0317@gmail.com",
    subject: "Sent via resend-clone SDK!",
    html: "<h1>Hello from the SDK!</h1><p>This email was sent using the resend-clone TypeScript SDK.</p>",
  });

  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log("   Sent! ID:", data?.id);

  console.log("\n=== Done! Check jaeyunha0317@gmail.com ===");
}

main().catch(console.error);
