ALTER TABLE "todo" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "todo" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "todo" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "todo" ADD COLUMN "password" text NOT NULL;--> statement-breakpoint
ALTER TABLE "todo" ADD COLUMN "createdAt" text DEFAULT '2025-02-10T18:42:31.890Z';--> statement-breakpoint
ALTER TABLE "todo" DROP COLUMN "text";--> statement-breakpoint
ALTER TABLE "todo" DROP COLUMN "done";--> statement-breakpoint
ALTER TABLE "todo" ADD CONSTRAINT "todo_email_unique" UNIQUE("email");