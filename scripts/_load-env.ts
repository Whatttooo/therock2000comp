/**
 * Loads .env.local before anything else in this script runs. Must be
 * imported first, as a plain side-effect import (`import "./_load-env"`),
 * not alongside other imports — ES module imports execute in declaration
 * order relative to each other, so this module's `config()` call finishes
 * before any later import (e.g. "../src/db", which reads
 * `process.env.DATABASE_URL` the moment it's loaded) gets evaluated.
 * Verified empirically: a plain top-level statement placed textually before
 * an import in the *same* file does NOT run first (imports are hoisted
 * ahead of it), which is why this needs to be its own module.
 */
import { config } from "dotenv";

config({ path: ".env.local" });
