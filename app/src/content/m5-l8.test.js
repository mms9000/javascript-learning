/**
 * content/m5-l8.test.js — Tests for Module 5, Lesson 8 milestone.
 */

import { describe, it, expect } from "vitest";
import { lessonM5L8, validateM5L8Exercise } from "./m5-l8.js";

describe("Module 5, Lesson 8 Content", () => {
  it("defines the canonical milestone metadata and exercise", () => {
    expect(lessonM5L8.lessonId).toBe("m5-l8");
    expect(lessonM5L8.title).toBe("Transforming Collections of Objects");
    expect(lessonM5L8.estimatedMinutes).toBe(25);
    expect(lessonM5L8.prerequisites).toEqual(["m5-l7"]);
    expect(lessonM5L8.objectives).toHaveLength(3);
    expect(lessonM5L8.sections.map(({ id }) => id)).toContain("comprehension-check");
    expect(lessonM5L8.exercise.id).toBe("m5-l8-ex1");
    expect(lessonM5L8.exercise.expectedOutput).toBe(
      "Notebook: 2\nPen: 3\nUnits: 5\nValue: 9"
    );
    expect(lessonM5L8.exercise.hints).toHaveLength(2);
  });

  it("teaches filter, map, and reduce over records without source mutation", () => {
    const text = [...lessonM5L8.sections.map(({ content }) => content), ...lessonM5L8.summary].join(" ");
    expect(text).toContain("filter");
    expect(text).toContain("map");
    expect(text).toContain("reduce");
    expect(text).toContain("without modifying source records");
  });

  it("accepts the exact deterministic inventory milestone output", () => {
    expect(
      validateM5L8Exercise(
        ["Notebook: 2", "Pen: 3", "Units: 5", "Value: 9"].map((text) => ({
          type: "log",
          text,
        })),
        { status: "success" }
      ).passed
    ).toBe(true);
  });

  it("rejects missing, extra, or incorrect output with transformation guidance", () => {
    expect(validateM5L8Exercise([], { status: "success" }).message).toContain(
      "Keep items with quantity above 0"
    );
    expect(
      validateM5L8Exercise(
        ["Notebook: 2", "Pen: 3", "Units: 5", "Value: 9", "extra"].map((text) => ({
          type: "log",
          text,
        })),
        { status: "success" }
      ).passed
    ).toBe(false);
    expect(
      validateM5L8Exercise(
        ["Notebook: 2", "Pen: 3", "Units: 5", "Value: 7"].map((text) => ({
          type: "log",
          text,
        })),
        { status: "success" }
      ).passed
    ).toBe(false);
  });

  it("provides syntax, reference, type, and timeout feedback", () => {
    expect(
      validateM5L8Exercise([], {
        status: "error",
        error: { name: "SyntaxError", message: "Unexpected token" },
      }).message
    ).toContain("Syntax Error");
    expect(
      validateM5L8Exercise([], {
        status: "error",
        error: { name: "ReferenceError", message: "inventroy is not defined" },
      }).message
    ).toContain("Reference Error");
    expect(
      validateM5L8Exercise([], {
        status: "error",
        error: { name: "TypeError", message: "unknown browser-specific text" },
      }).message
    ).toContain("Type Error");
    expect(validateM5L8Exercise([], { status: "terminated" }).message).toContain(
      "Execution timed out"
    );
  });
});
