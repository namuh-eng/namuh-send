#!/bin/bash
# Test sending email through the clone's own API
curl -s http://localhost:3001/api/emails \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer re_dev_token_123" \
  -d '{"from":"hello@foreverbrowsing.com","to":["jaeyunha0317@gmail.com"],"subject":"Sent from Resend Clone API!","html":"<h1>Hello from resend-clone!</h1><p>This email was sent through our own REST API at <code>POST /api/emails</code>, powered by AWS SES.</p>"}' | python3 -m json.tool
