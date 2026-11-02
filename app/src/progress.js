/**
 * progress.js — Progress module.
 *
 * Stores and retrieves lesson completion information using localStorage.
 * Uses a versioned schema so future migrations can be handled safely.
 *
 * Status: Phase 1 stub — schema defined, implementation in Phase 5.
 */

import { getCurriculum } from "./curriculum.js";

/** Current schema version. Increment when the schema changes. */
const SCHEMA_VERSION = 1;

/** localStorage key for the progress record. */
const STORAGE_KEY = "jslearn_progress_v1";
const knownLessonIds = new Set(
  getCurriculum().flatMap((module) => module.lessons.map((lesson) => lesson.lessonId))
);

/**
 * The default (empty) progress record.
 *
 * @returns {Object} A fresh progress record.
 */
function defaultProgress() {
  return {
    schemaVersion: SCHEMA_VERSION,
    completedLessons: [],
    lastUpdated: null,
  };
}

/**
 * Load progress from localStorage.
 * Returns default progress if the record is missing, malformed, or outdated.
 *
 * @returns {Object} The current progress record.
 */
export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      console.warn("[progress] Discarding malformed progress record.");
      return defaultProgress();
    }

    // Discard records from an incompatible schema version
    if (parsed.schemaVersion !== SCHEMA_VERSION) {
      console.warn(
        `[progress] Discarding incompatible progress record (schema version ${parsed.schemaVersion}).`
      );
      return defaultProgress();
    }

    if (!Array.isArray(parsed.completedLessons)) {
      console.warn("[progress] Discarding progress record with invalid completedLessons.");
      return defaultProgress();
    }

    return {
      schemaVersion: SCHEMA_VERSION,
      completedLessons: [...new Set(
        parsed.completedLessons.filter((lessonId) =>
          typeof lessonId === "string" && knownLessonIds.has(lessonId)
        )
      )],
      lastUpdated: typeof parsed.lastUpdated === "string" ? parsed.lastUpdated : null,
    };
  } catch {
    console.warn("[progress] Failed to load progress; resetting to default.");
    return defaultProgress();
  }
}

/**
 * Save a progress record to localStorage.
 *
 * @param {Object} progress - The progress record to save.
 */
export function saveProgress(progress) {
  try {
    const record = { ...progress, lastUpdated: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    console.warn("[progress] Failed to save progress.");
  }
}

/**
 * Mark a lesson as complete and persist the update.
 *
 * @param {string} lessonId - The ID of the completed lesson.
 */
export function markLessonComplete(lessonId) {
  if (!knownLessonIds.has(lessonId)) return;
  const progress = loadProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    saveProgress(progress);
  }
}

/**
 * Check whether a lesson is complete.
 *
 * @param {string} lessonId - The lesson ID to check.
 * @returns {boolean} True if the lesson has been completed.
 */
export function isLessonComplete(lessonId) {
  if (!knownLessonIds.has(lessonId)) return false;
  const progress = loadProgress();
  return progress.completedLessons.includes(lessonId);
}

/**
 * Reset all progress by removing the localStorage record.
 */
export function resetProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.warn("[progress] Failed to reset progress.");
  }
}
