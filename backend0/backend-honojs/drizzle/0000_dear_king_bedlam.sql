CREATE TABLE `admins` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`email` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admins_username_unique` ON `admins` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `admins_email_unique` ON `admins` (`email`);--> statement-breakpoint
CREATE TABLE `problems` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`problem_statement` text NOT NULL,
	`expected_solution` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`team_id` text NOT NULL,
	`swap_with_id` text,
	`problem_statement` text NOT NULL,
	`sol1` text NOT NULL,
	`sol2` text NOT NULL,
	`sol3` text NOT NULL,
	`sol4` text NOT NULL,
	`locked_index` integer DEFAULT 0 NOT NULL,
	`is_final` integer DEFAULT 0 NOT NULL,
	`evaluation` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` text PRIMARY KEY NOT NULL,
	`team_name` text NOT NULL,
	`leader_name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`problem_statement` text,
	`members` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `teams_team_name_unique` ON `teams` (`team_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `teams_email_unique` ON `teams` (`email`);