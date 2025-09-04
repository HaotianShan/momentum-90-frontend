import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  uuid,
  timestamp,
  jsonb,
  date,
  text,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const userPlans = pgTable("user_plans", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  rawText: text("raw_text"),
  months: jsonb("months"),
  weeks: jsonb("weeks"),
  allWeeks: jsonb("all_weeks"),
  superGoal: text("super_goal"),
  startDate: date("start_date").defaultNow(),
  bannerUrl: text("banner_url"),
});

export type UserPlans = InferSelectModel<typeof userPlans>;
