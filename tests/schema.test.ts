import {
  apiKeys,
  broadcastStatusEnum,
  broadcasts,
  contactSegments,
  contactTopics,
  contacts,
  domainStatusEnum,
  domains,
  emailEvents,
  emailStatusEnum,
  emails,
  logs,
  permissionTypeEnum,
  properties,
  segments,
  templates,
  topicDefaultSubscriptionEnum,
  topicVisibilityEnum,
  topics,
  webhookEventEnum,
  webhooks,
} from "@/lib/db/schema";
import { getTableColumns, getTableName } from "drizzle-orm";
import { describe, expect, it } from "vitest";

describe("Database schema", () => {
  describe("Tables exist with correct names", () => {
    it("defines all required tables", () => {
      expect(getTableName(domains)).toBe("domains");
      expect(getTableName(apiKeys)).toBe("api_keys");
      expect(getTableName(emails)).toBe("emails");
      expect(getTableName(emailEvents)).toBe("email_events");
      expect(getTableName(segments)).toBe("segments");
      expect(getTableName(topics)).toBe("topics");
      expect(getTableName(contacts)).toBe("contacts");
      expect(getTableName(contactSegments)).toBe("contact_segments");
      expect(getTableName(contactTopics)).toBe("contact_topics");
      expect(getTableName(broadcasts)).toBe("broadcasts");
      expect(getTableName(webhooks)).toBe("webhooks");
      expect(getTableName(templates)).toBe("templates");
      expect(getTableName(properties)).toBe("properties");
      expect(getTableName(logs)).toBe("logs");
    });
  });

  describe("Enums define correct values", () => {
    it("email_status has 12 values", () => {
      expect(emailStatusEnum.enumValues).toEqual([
        "queued",
        "scheduled",
        "sent",
        "delivered",
        "delivery_delayed",
        "bounced",
        "complained",
        "opened",
        "clicked",
        "failed",
        "canceled",
        "suppressed",
      ]);
    });

    it("domain_status has 5 values", () => {
      expect(domainStatusEnum.enumValues).toEqual([
        "pending",
        "verified",
        "failed",
        "temporary_failure",
        "not_started",
      ]);
    });

    it("permission_type has 2 values", () => {
      expect(permissionTypeEnum.enumValues).toEqual([
        "full_access",
        "sending_access",
      ]);
    });

    it("broadcast_status has 5 values", () => {
      expect(broadcastStatusEnum.enumValues).toEqual([
        "draft",
        "scheduled",
        "queued",
        "sent",
        "failed",
      ]);
    });

    it("topic_visibility has 2 values", () => {
      expect(topicVisibilityEnum.enumValues).toEqual(["public", "private"]);
    });

    it("topic_default_subscription has 2 values", () => {
      expect(topicDefaultSubscriptionEnum.enumValues).toEqual([
        "opt_in",
        "opt_out",
      ]);
    });

    it("webhook_event has 17 values", () => {
      expect(webhookEventEnum.enumValues).toHaveLength(17);
      expect(webhookEventEnum.enumValues).toContain("email.sent");
      expect(webhookEventEnum.enumValues).toContain("email.delivered");
      expect(webhookEventEnum.enumValues).toContain("domain.created");
      expect(webhookEventEnum.enumValues).toContain("contact.created");
    });
  });

  describe("Emails table columns", () => {
    it("has all required columns", () => {
      const cols = getTableColumns(emails);
      expect(cols.id).toBeDefined();
      expect(cols.from).toBeDefined();
      expect(cols.to).toBeDefined();
      expect(cols.cc).toBeDefined();
      expect(cols.bcc).toBeDefined();
      expect(cols.replyTo).toBeDefined();
      expect(cols.subject).toBeDefined();
      expect(cols.html).toBeDefined();
      expect(cols.text).toBeDefined();
      expect(cols.tags).toBeDefined();
      expect(cols.lastEvent).toBeDefined();
      expect(cols.scheduledAt).toBeDefined();
      expect(cols.createdAt).toBeDefined();
      expect(cols.apiKeyId).toBeDefined();
      expect(cols.domainId).toBeDefined();
      expect(cols.sesMessageId).toBeDefined();
    });

    it("from and subject are not nullable", () => {
      const cols = getTableColumns(emails);
      expect(cols.from.notNull).toBe(true);
      expect(cols.subject.notNull).toBe(true);
    });
  });

  describe("Domains table columns", () => {
    it("has all required columns", () => {
      const cols = getTableColumns(domains);
      expect(cols.id).toBeDefined();
      expect(cols.name).toBeDefined();
      expect(cols.status).toBeDefined();
      expect(cols.region).toBeDefined();
      expect(cols.clickTracking).toBeDefined();
      expect(cols.openTracking).toBeDefined();
      expect(cols.tls).toBeDefined();
      expect(cols.customReturnPath).toBeDefined();
      expect(cols.sendingEnabled).toBeDefined();
      expect(cols.receivingEnabled).toBeDefined();
      expect(cols.records).toBeDefined();
    });

    it("name is not nullable", () => {
      const cols = getTableColumns(domains);
      expect(cols.name.notNull).toBe(true);
    });
  });

  describe("API Keys table columns", () => {
    it("has all required columns", () => {
      const cols = getTableColumns(apiKeys);
      expect(cols.id).toBeDefined();
      expect(cols.name).toBeDefined();
      expect(cols.hashedKey).toBeDefined();
      expect(cols.keyPrefix).toBeDefined();
      expect(cols.permission).toBeDefined();
      expect(cols.domainId).toBeDefined();
      expect(cols.createdAt).toBeDefined();
    });

    it("hashedKey is unique and not nullable", () => {
      const cols = getTableColumns(apiKeys);
      expect(cols.hashedKey.notNull).toBe(true);
      expect(cols.hashedKey.isUnique).toBe(true);
    });
  });

  describe("Contacts table columns", () => {
    it("has all required columns", () => {
      const cols = getTableColumns(contacts);
      expect(cols.id).toBeDefined();
      expect(cols.email).toBeDefined();
      expect(cols.firstName).toBeDefined();
      expect(cols.lastName).toBeDefined();
      expect(cols.unsubscribed).toBeDefined();
      expect(cols.properties).toBeDefined();
    });
  });

  describe("Broadcasts table columns", () => {
    it("has all required columns", () => {
      const cols = getTableColumns(broadcasts);
      expect(cols.id).toBeDefined();
      expect(cols.name).toBeDefined();
      expect(cols.segmentId).toBeDefined();
      expect(cols.from).toBeDefined();
      expect(cols.subject).toBeDefined();
      expect(cols.html).toBeDefined();
      expect(cols.text).toBeDefined();
      expect(cols.topicId).toBeDefined();
      expect(cols.status).toBeDefined();
      expect(cols.scheduledAt).toBeDefined();
    });
  });

  describe("Webhooks table columns", () => {
    it("has all required columns", () => {
      const cols = getTableColumns(webhooks);
      expect(cols.id).toBeDefined();
      expect(cols.endpoint).toBeDefined();
      expect(cols.events).toBeDefined();
      expect(cols.signingSecret).toBeDefined();
      expect(cols.active).toBeDefined();
    });

    it("endpoint and signingSecret are not nullable", () => {
      const cols = getTableColumns(webhooks);
      expect(cols.endpoint.notNull).toBe(true);
      expect(cols.signingSecret.notNull).toBe(true);
    });
  });

  describe("Templates table columns", () => {
    it("has all required columns", () => {
      const cols = getTableColumns(templates);
      expect(cols.id).toBeDefined();
      expect(cols.name).toBeDefined();
      expect(cols.alias).toBeDefined();
      expect(cols.from).toBeDefined();
      expect(cols.subject).toBeDefined();
      expect(cols.html).toBeDefined();
      expect(cols.text).toBeDefined();
      expect(cols.variables).toBeDefined();
      expect(cols.published).toBeDefined();
    });
  });

  describe("Logs table columns", () => {
    it("has all required columns for API request logging", () => {
      const cols = getTableColumns(logs);
      expect(cols.id).toBeDefined();
      expect(cols.method).toBeDefined();
      expect(cols.path).toBeDefined();
      expect(cols.statusCode).toBeDefined();
      expect(cols.apiKeyId).toBeDefined();
      expect(cols.requestBody).toBeDefined();
      expect(cols.responseBody).toBeDefined();
      expect(cols.duration).toBeDefined();
    });
  });

  describe("Join tables", () => {
    it("contact_segments links contacts to segments", () => {
      const cols = getTableColumns(contactSegments);
      expect(cols.contactId).toBeDefined();
      expect(cols.segmentId).toBeDefined();
    });

    it("contact_topics links contacts to topics", () => {
      const cols = getTableColumns(contactTopics);
      expect(cols.contactId).toBeDefined();
      expect(cols.topicId).toBeDefined();
      expect(cols.subscribed).toBeDefined();
    });
  });
});
