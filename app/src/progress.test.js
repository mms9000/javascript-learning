/**
 * progress.test.js — Unit tests for the Progress module.
 *
 * Verifies that progress is correctly loaded, saved, updated, and reset,
 * and that malformed or outdated data is handled safely.
 *
 * Requirement coverage:
 *   - FR-006: progress persistence, restore after reload, reset, malformed-data safety.
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  loadProgress,
  saveProgress,
  markLessonComplete,
  isLessonComplete,
  resetProgress,
} from "./progress.js";

describe("Progress module", () => {
  beforeEach(() => {
    // Reset localStorage before each test to ensure test isolation
    localStorage.clear();
  });

  describe("loadProgress()", () => {
    it("returns a default record when localStorage is empty", () => {
      const progress = loadProgress();
      expect(progress.completedLessons).toEqual([]);
      expect(progress.schemaVersion).toBe(1);
    });

    it("returns default progress when the stored value is not valid JSON", () => {
      localStorage.setItem("jslearn_progress_v1", "not-json{{{");
      const progress = loadProgress();
      expect(progress.completedLessons).toEqual([]);
    });

    it("returns default progress when the schema version does not match", () => {
      localStorage.setItem(
        "jslearn_progress_v1",
        JSON.stringify({ schemaVersion: 99, completedLessons: ["m1-l1"] })
      );
      const progress = loadProgress();
      expect(progress.completedLessons).toEqual([]);
    });

    it.each([
      ["null", "null"],
      ["array", "[]"],
      ["missing completedLessons", '{"schemaVersion":1}'],
      ["non-array completedLessons", '{"schemaVersion":1,"completedLessons":"m1-l1"}'],
    ])("returns default progress for %s records", (_label, raw) => {
      localStorage.setItem("jslearn_progress_v1", raw);
      expect(loadProgress().completedLessons).toEqual([]);
    });

    it("restores a saved progress record", () => {
      const record = {
        schemaVersion: 1,
        completedLessons: ["m1-l1", "m1-l2"],
        lastUpdated: "2026-01-01T00:00:00.000Z",
      };
      localStorage.setItem("jslearn_progress_v1", JSON.stringify(record));
      const progress = loadProgress();
      expect(progress.completedLessons).toEqual(["m1-l1", "m1-l2"]);
    });

    it("deduplicates completion and ignores unknown or non-string lesson IDs", () => {
      localStorage.setItem(
        "jslearn_progress_v1",
        JSON.stringify({
          schemaVersion: 1,
          completedLessons: ["m1-l1", "m1-l1", "unknown", 42, "m9-l9"],
          lastUpdated: "2026-01-01T00:00:00.000Z",
        })
      );

      expect(loadProgress().completedLessons).toEqual(["m1-l1", "m9-l9"]);
    });
  });

  describe("markLessonComplete() / isLessonComplete()", () => {
    it("marks a lesson as complete", () => {
      markLessonComplete("m1-l1");
      expect(isLessonComplete("m1-l1")).toBe(true);
    });

    it("does not duplicate an already-completed lesson", () => {
      markLessonComplete("m1-l1");
      markLessonComplete("m1-l1");
      const progress = loadProgress();
      expect(progress.completedLessons.filter((id) => id === "m1-l1")).toHaveLength(1);
    });

    it("returns false for a lesson that has not been completed", () => {
      expect(isLessonComplete("m1-l1")).toBe(false);
    });

    it("ignores unknown lesson IDs when marking completion", () => {
      markLessonComplete("unknown");
      expect(loadProgress().completedLessons).toEqual([]);
      expect(isLessonComplete("unknown")).toBe(false);
    });

    it("persists across a simulated reload (re-reading from localStorage)", () => {
      markLessonComplete("m1-l1");
      // Simulate a page reload by calling loadProgress fresh
      const restoredProgress = loadProgress();
      expect(restoredProgress.completedLessons).toContain("m1-l1");
    });
  });

  describe("resetProgress()", () => {
    it("clears all completed lessons", () => {
      markLessonComplete("m1-l1");
      resetProgress();
      expect(isLessonComplete("m1-l1")).toBe(false);
    });

    it("leaves loadProgress returning a default record after reset", () => {
      markLessonComplete("m1-l1");
      resetProgress();
      const progress = loadProgress();
      expect(progress.completedLessons).toEqual([]);
    });
  });

  describe("saveProgress()", () => {
    it("updates lastUpdated timestamp on save", () => {
      const record = { schemaVersion: 1, completedLessons: [] };
      saveProgress(record);
      const saved = loadProgress();
      expect(saved.lastUpdated).not.toBeNull();
    });
  });
});
