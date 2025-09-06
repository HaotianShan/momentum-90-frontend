ALTER TABLE "user_plans" ADD COLUMN "quests" jsonb;--> statement-breakpoint
ALTER TABLE "user_plans" ADD COLUMN "completed_quests" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "user_plans" ADD COLUMN "total_xp" jsonb DEFAULT '0'::jsonb;