CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(64) NOT NULL,
	"password" varchar(64)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"raw_text" text,
	"months" jsonb,
	"weeks" jsonb,
	"all_weeks" jsonb,
	"super_goal" text,
	"start_date" date DEFAULT now(),
	"banner_url" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_plans" ADD CONSTRAINT "user_plans_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
