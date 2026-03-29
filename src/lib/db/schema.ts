import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ── Enums ──────────────────────────────────────────────────────────

export const emailStatusEnum = pgEnum("email_status", [
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

export const domainStatusEnum = pgEnum("domain_status", [
  "pending",
  "verified",
  "failed",
  "temporary_failure",
  "not_started",
]);

export const permissionTypeEnum = pgEnum("permission_type", [
  "full_access",
  "sending_access",
]);

export const broadcastStatusEnum = pgEnum("broadcast_status", [
  "draft",
  "scheduled",
  "queued",
  "sent",
  "failed",
]);

export const topicVisibilityEnum = pgEnum("topic_visibility", [
  "public",
  "private",
]);

export const topicDefaultSubscriptionEnum = pgEnum(
  "topic_default_subscription",
  ["opt_in", "opt_out"],
);

export const webhookEventEnum = pgEnum("webhook_event", [
  "email.sent",
  "email.delivered",
  "email.delivery_delayed",
  "email.bounced",
  "email.complained",
  "email.opened",
  "email.clicked",
  "email.failed",
  "email.received",
  "email.scheduled",
  "email.suppressed",
  "domain.created",
  "domain.updated",
  "domain.deleted",
  "contact.created",
  "contact.updated",
  "contact.deleted",
]);

// ── Tables ─────────────────────────────────────────────────────────

export const domains = pgTable("domains", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  status: domainStatusEnum("status").notNull().default("not_started"),
  region: varchar("region", { length: 50 }).notNull().default("us-east-1"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  clickTracking: boolean("click_tracking").notNull().default(false),
  openTracking: boolean("open_tracking").notNull().default(false),
  tls: varchar("tls", { length: 20 }).notNull().default("opportunistic"),
  customReturnPath: varchar("custom_return_path", { length: 255 }),
  sendingEnabled: boolean("sending_enabled").notNull().default(true),
  receivingEnabled: boolean("receiving_enabled").notNull().default(false),
  records:
    jsonb("records").$type<
      Array<{
        type: string;
        name: string;
        value: string;
        status: string;
        ttl: string;
        priority?: number;
      }>
    >(),
});

export const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  hashedKey: varchar("hashed_key", { length: 512 }).notNull().unique(),
  keyPrefix: varchar("key_prefix", { length: 20 }).notNull(),
  permission: permissionTypeEnum("permission").notNull().default("full_access"),
  domainId: uuid("domain_id").references(() => domains.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const emails = pgTable("emails", {
  id: uuid("id").primaryKey().defaultRandom(),
  from: varchar("from", { length: 512 }).notNull(),
  to: jsonb("to").notNull().$type<string[]>(),
  cc: jsonb("cc").$type<string[]>(),
  bcc: jsonb("bcc").$type<string[]>(),
  replyTo: varchar("reply_to", { length: 512 }),
  subject: varchar("subject", { length: 998 }).notNull(),
  html: text("html"),
  text: text("text"),
  tags: jsonb("tags").$type<Array<{ name: string; value: string }>>(),
  lastEvent: emailStatusEnum("last_event").notNull().default("queued"),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  apiKeyId: uuid("api_key_id").references(() => apiKeys.id, {
    onDelete: "set null",
  }),
  domainId: uuid("domain_id").references(() => domains.id, {
    onDelete: "set null",
  }),
  sesMessageId: varchar("ses_message_id", { length: 255 }),
});

export const emailEvents = pgTable("email_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  emailId: uuid("email_id")
    .notNull()
    .references(() => emails.id, { onDelete: "cascade" }),
  type: emailStatusEnum("type").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true })
    .notNull()
    .defaultNow(),
  data: jsonb("data"),
});

export const segments = pgTable("segments", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const topics = pgTable("topics", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  defaultSubscription: topicDefaultSubscriptionEnum("default_subscription")
    .notNull()
    .default("opt_out"),
  visibility: topicVisibilityEnum("visibility").notNull().default("public"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 512 }).notNull(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  unsubscribed: boolean("unsubscribed").notNull().default(false),
  properties: jsonb("properties").$type<Record<string, string>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const contactSegments = pgTable("contact_segments", {
  id: uuid("id").primaryKey().defaultRandom(),
  contactId: uuid("contact_id")
    .notNull()
    .references(() => contacts.id, { onDelete: "cascade" }),
  segmentId: uuid("segment_id")
    .notNull()
    .references(() => segments.id, { onDelete: "cascade" }),
});

export const contactTopics = pgTable("contact_topics", {
  id: uuid("id").primaryKey().defaultRandom(),
  contactId: uuid("contact_id")
    .notNull()
    .references(() => contacts.id, { onDelete: "cascade" }),
  topicId: uuid("topic_id")
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  subscribed: boolean("subscribed").notNull().default(true),
});

export const broadcasts = pgTable("broadcasts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().default("Untitled"),
  segmentId: uuid("segment_id").references(() => segments.id, {
    onDelete: "set null",
  }),
  from: varchar("from", { length: 512 }),
  replyTo: varchar("reply_to", { length: 512 }),
  subject: varchar("subject", { length: 998 }),
  previewText: varchar("preview_text", { length: 150 }),
  html: text("html"),
  text: text("text"),
  topicId: uuid("topic_id").references(() => topics.id, {
    onDelete: "set null",
  }),
  status: broadcastStatusEnum("status").notNull().default("draft"),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const webhooks = pgTable("webhooks", {
  id: uuid("id").primaryKey().defaultRandom(),
  endpoint: varchar("endpoint", { length: 2048 }).notNull(),
  events: jsonb("events").notNull().$type<string[]>(),
  signingSecret: varchar("signing_secret", { length: 255 }).notNull(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const templates = pgTable("templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().default("Untitled Template"),
  alias: varchar("alias", { length: 255 }),
  from: varchar("from", { length: 512 }),
  replyTo: varchar("reply_to", { length: 512 }),
  subject: varchar("subject", { length: 998 }),
  previewText: varchar("preview_text", { length: 150 }),
  html: text("html"),
  text: text("text"),
  variables:
    jsonb("variables").$type<Array<{ name: string; required: boolean }>>(),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const propertyType = pgEnum("property_type", ["string", "number"]);

export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  type: propertyType("type").notNull().default("string"),
  fallbackValue: text("fallback_value"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const logs = pgTable("logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  method: varchar("method", { length: 10 }).notNull(),
  path: varchar("path", { length: 2048 }).notNull(),
  statusCode: integer("status_code").notNull(),
  apiKeyId: uuid("api_key_id").references(() => apiKeys.id, {
    onDelete: "set null",
  }),
  requestBody: jsonb("request_body"),
  responseBody: jsonb("response_body"),
  duration: integer("duration"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ── Relations ──────────────────────────────────────────────────────

export const domainsRelations = relations(domains, ({ many }) => ({
  apiKeys: many(apiKeys),
  emails: many(emails),
}));

export const apiKeysRelations = relations(apiKeys, ({ one, many }) => ({
  domain: one(domains, {
    fields: [apiKeys.domainId],
    references: [domains.id],
  }),
  emails: many(emails),
  logs: many(logs),
}));

export const emailsRelations = relations(emails, ({ one, many }) => ({
  apiKey: one(apiKeys, {
    fields: [emails.apiKeyId],
    references: [apiKeys.id],
  }),
  domain: one(domains, {
    fields: [emails.domainId],
    references: [domains.id],
  }),
  events: many(emailEvents),
}));

export const emailEventsRelations = relations(emailEvents, ({ one }) => ({
  email: one(emails, {
    fields: [emailEvents.emailId],
    references: [emails.id],
  }),
}));

export const segmentsRelations = relations(segments, ({ many }) => ({
  contacts: many(contactSegments),
  broadcasts: many(broadcasts),
}));

export const topicsRelations = relations(topics, ({ many }) => ({
  contacts: many(contactTopics),
  broadcasts: many(broadcasts),
}));

export const contactsRelations = relations(contacts, ({ many }) => ({
  segments: many(contactSegments),
  topics: many(contactTopics),
}));

export const contactSegmentsRelations = relations(
  contactSegments,
  ({ one }) => ({
    contact: one(contacts, {
      fields: [contactSegments.contactId],
      references: [contacts.id],
    }),
    segment: one(segments, {
      fields: [contactSegments.segmentId],
      references: [segments.id],
    }),
  }),
);

export const contactTopicsRelations = relations(contactTopics, ({ one }) => ({
  contact: one(contacts, {
    fields: [contactTopics.contactId],
    references: [contacts.id],
  }),
  topic: one(topics, {
    fields: [contactTopics.topicId],
    references: [topics.id],
  }),
}));

export const broadcastsRelations = relations(broadcasts, ({ one }) => ({
  segment: one(segments, {
    fields: [broadcasts.segmentId],
    references: [segments.id],
  }),
  topic: one(topics, {
    fields: [broadcasts.topicId],
    references: [topics.id],
  }),
}));

export const logsRelations = relations(logs, ({ one }) => ({
  apiKey: one(apiKeys, {
    fields: [logs.apiKeyId],
    references: [apiKeys.id],
  }),
}));
