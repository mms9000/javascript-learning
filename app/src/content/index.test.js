/**
 * content/index.test.js — Tests for content registry and structural assertions.
 */

import { describe, it, expect } from "vitest";
import { getLessonContent, assertLessonShape } from "./index.js";

describe("content/index.js", () => {
  it("returns registered lesson objects for known lesson IDs", () => {
    expect(getLessonContent("m1-l1")?.lessonId).toBe("m1-l1");
    expect(getLessonContent("m1-l2")?.lessonId).toBe("m1-l2");
    expect(getLessonContent("m1-l3")?.lessonId).toBe("m1-l3");
    expect(getLessonContent("m1-l4")?.lessonId).toBe("m1-l4");
    expect(getLessonContent("m2-l1")?.lessonId).toBe("m2-l1");
    expect(getLessonContent("m2-l2")?.lessonId).toBe("m2-l2");
    expect(getLessonContent("m2-l3")?.lessonId).toBe("m2-l3");
    expect(getLessonContent("m2-l4")?.lessonId).toBe("m2-l4");
    expect(getLessonContent("m2-l5")?.lessonId).toBe("m2-l5");
    expect(getLessonContent("m2-l6")?.lessonId).toBe("m2-l6");
    expect(getLessonContent("m3-l1")?.lessonId).toBe("m3-l1");
    expect(getLessonContent("m3-l2")?.lessonId).toBe("m3-l2");
    expect(getLessonContent("m3-l3")?.lessonId).toBe("m3-l3");
    expect(getLessonContent("m3-l4")?.lessonId).toBe("m3-l4");
    expect(getLessonContent("m3-l5")?.lessonId).toBe("m3-l5");
    expect(getLessonContent("m3-l6")?.lessonId).toBe("m3-l6");
    expect(getLessonContent("m4-l1")?.lessonId).toBe("m4-l1");
    expect(getLessonContent("m4-l2")?.lessonId).toBe("m4-l2");
    expect(getLessonContent("m4-l3")?.lessonId).toBe("m4-l3");
    expect(getLessonContent("m4-l4")?.lessonId).toBe("m4-l4");
    expect(getLessonContent("m4-l5")?.lessonId).toBe("m4-l5");
    expect(getLessonContent("m4-l6")?.lessonId).toBe("m4-l6");
    expect(getLessonContent("m4-l7")?.lessonId).toBe("m4-l7");
    expect(getLessonContent("m5-l1")?.lessonId).toBe("m5-l1");
    expect(getLessonContent("m5-l2")?.lessonId).toBe("m5-l2");
    expect(getLessonContent("m5-l3")?.lessonId).toBe("m5-l3");
    expect(getLessonContent("m5-l4")?.lessonId).toBe("m5-l4");
    expect(getLessonContent("m5-l5")?.lessonId).toBe("m5-l5");
    expect(getLessonContent("m5-l6")?.lessonId).toBe("m5-l6");
    expect(getLessonContent("m5-l7")?.lessonId).toBe("m5-l7");
    expect(getLessonContent("m5-l8")?.lessonId).toBe("m5-l8");
    for (let lessonNumber = 1; lessonNumber <= 7; lessonNumber += 1) {
      expect(getLessonContent(`m7-l${lessonNumber}`)?.lessonId).toBe(`m7-l${lessonNumber}`);
    }
    for (let lessonNumber = 1; lessonNumber <= 10; lessonNumber += 1) {
      expect(getLessonContent(`m8-l${lessonNumber}`)?.lessonId).toBe(`m8-l${lessonNumber}`);
    }
    for (let lessonNumber = 1; lessonNumber <= 9; lessonNumber += 1) {
      expect(getLessonContent(`m9-l${lessonNumber}`)?.lessonId).toBe(`m9-l${lessonNumber}`);
    }
  });

  it("returns null for unknown lesson IDs", () => {
    expect(getLessonContent("unknown-lesson")).toBeNull();
    expect(getLessonContent("")).toBeNull();
  });

  describe("assertLessonShape()", () => {
    const validLesson = {
      lessonId: "test-id",
      moduleId: "m1",
      title: "Test Lesson",
      sections: [{ id: "sec1", title: "Section 1", content: "..." }],
      summary: ["Point 1"],
    };

    it("accepts a well-formed lesson definition", () => {
      expect(() => assertLessonShape("test-id", validLesson)).not.toThrow();
    });

    it("throws if lesson is null or non-object", () => {
      expect(() => assertLessonShape("test-id", null)).toThrow(TypeError);
      expect(() => assertLessonShape("test-id", "string")).toThrow(TypeError);
    });

    it("throws if lessonId does not match registration key", () => {
      expect(() => assertLessonShape("different-key", validLesson)).toThrow(
        /Lesson ID mismatch/
      );
    });

    it("throws if required fields are missing", () => {
      const missingTitle = { ...validLesson, title: "" };
      expect(() => assertLessonShape("test-id", missingTitle)).toThrow(
        /missing required field/
      );

      const emptySections = { ...validLesson, sections: [] };
      expect(() => assertLessonShape("test-id", emptySections)).toThrow(
        /non-empty sections array/
      );

      const emptySummary = { ...validLesson, summary: [] };
      expect(() => assertLessonShape("test-id", emptySummary)).toThrow(
        /non-empty summary array/
      );
    });
  });
});
