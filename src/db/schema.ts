import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  uniqueIndex,
  uuid,
  varchar,
  integer,
  unique,
} from "drizzle-orm/pg-core";


// =========================================================================
// USERS AND SESSIONS TABLES
// Generated from BetterAuth cli 
// =========================================================================


export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("sessions_userId_idx").on(table.userId)],
);

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    issuer: text("issuer").notNull(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("accounts_issuer_accountId_uidx").on(
      table.issuer,
      table.accountId,
    ),
    index("accounts_userId_idx").on(table.userId),
  ],
);

export const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verifications_identifier_idx").on(table.identifier)],
);

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));



// =========================================================================
// 2. THE ROCK 2000 SYSTEM TABLES 
// =========================================================================

/**
 * MASTER SONGS TABLE
 * Stores songs on-demand as soon as a user selects them via the Spotify API.
 */
export const songs = pgTable("songs", {
  id: uuid("id").defaultRandom().primaryKey(),
  spotifyId: varchar("spotify_id", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  artist: varchar("artist", { length: 255 }).notNull(),
  albumArt: text("album_art"),
  album: varchar("album", { length: 255 }),
  releaseYear: integer("release_year"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * USER VOTES TABLE (The Ballot)
 * Records a user's unranked 20 choices for a specific countdown year.
 */
export const votes = pgTable("votes", {
  id: uuid("id").defaultRandom().primaryKey(),
  // Explicitly points to the plural "users.id" created by Better Auth above
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  songId: uuid("song_id")
    .notNull()
    .references(() => songs.id, { onDelete: "cascade" }),
  voteYear: integer("vote_year").notNull(),
  isTopPick: boolean("is_top_pick").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  // Unique constraint ensures a user cannot vote for the same track multiple times in a single year
  unique("user_year_song_unique").on(table.userId, table.voteYear, table.songId),
  // Performance indexes for loading user dashboards rapidly
  index("idx_votes_user_year").on(table.userId, table.voteYear),
  index("idx_votes_year").on(table.voteYear)
]);

/**
 * COUNTDOWN RESULTS TABLE
 * Captures the official positions of the broadcasted top 2000.
 */
export const countdownResults = pgTable("countdown_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  songId: uuid("song_id").notNull().references(() => songs.id, { onDelete: "cascade" }),
  countdownYear: integer("countdown_year").notNull(),
  position: integer("position"), // Nullable until the song actually drops on the radio countdown
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  unique("song_year_result_unique").on(table.songId, table.countdownYear),
  index("idx_results_year_position").on(table.countdownYear, table.position)
]);
