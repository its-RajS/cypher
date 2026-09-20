CREATE TABLE "pending_uploads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"video_id" uuid NOT NULL,
	"video_size" bigint NOT NULL,
	"started_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "plan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"tier" text NOT NULL,
	"price" integer NOT NULL,
	"currency" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transcoding_metadata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"video_id" uuid NOT NULL,
	"file_count" integer DEFAULT 0,
	"resolution" text[] DEFAULT '{}' NOT NULL,
	"total_size_bytes" bigint DEFAULT 0,
	"status" "video_status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"storage_usage" bigint DEFAULT 0,
	"storage_limit" bigint DEFAULT 0,
	"minutes_streamed" bigint DEFAULT 0,
	"minutes_streamed_limit" bigint DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "video_metadata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '',
	"video_file_name" text NOT NULL,
	"video_content_type" text NOT NULL,
	"video_size" bigint NOT NULL,
	"thumbnail_file_name" text NOT NULL,
	"thumbnail_content_type" text NOT NULL,
	"thumbnail_size" bigint NOT NULL,
	"video_duration" real NOT NULL,
	"timestamps" text DEFAULT '',
	"tags" text[] DEFAULT '{}' NOT NULL,
	"playlist_id" uuid,
	"generate_subtitle" boolean DEFAULT false,
	"include_watermark" boolean DEFAULT false,
	"video_tracking_id" text,
	"thumbnail_tracking_id" text,
	"status" "video_status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "pending_uploads" ADD CONSTRAINT "pending_uploads_video_id_video_metadata_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."video_metadata"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transcoding_metadata" ADD CONSTRAINT "transcoding_metadata_video_id_video_metadata_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."video_metadata"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_metadata" ADD CONSTRAINT "video_metadata_playlist_id_playlist_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlist"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "plan_user_id_tier_idx" ON "plan" USING btree ("user_id","tier");--> statement-breakpoint
CREATE UNIQUE INDEX "usage_user_id_idx" ON "usage" USING btree ("user_id");