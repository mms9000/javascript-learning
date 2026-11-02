/**
 * curriculum.test.js — Unit tests for Curriculum module.
 *
 * Verifies that the curriculum map satisfies curriculum-spec.md §2 and FR-001.
 */

import { describe, it, expect } from "vitest";
import {
  getCurriculum,
  getStartingLessonId,
  findLessonById,
  findModuleById,
  getNextLessonId,
  getTotalLessonCount,
} from "./curriculum.js";

describe("Curriculum module", () => {
  it("defines all 9 curriculum modules from curriculum-spec.md", () => {
    const curriculum = getCurriculum();
    expect(curriculum).toHaveLength(9);
    const moduleIds = curriculum.map((m) => m.moduleId);
    expect(moduleIds).toEqual(["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9"]);
  });

  it("identifies m1-l1 as the recommended starting lesson", () => {
    expect(getStartingLessonId()).toBe("m1-l1");
  });

  it("derives the total lesson count from all canonical curriculum entries", () => {
    const total = getCurriculum().reduce((count, module) => count + module.lessons.length, 0);
    expect(total).toBe(64);
    expect(getTotalLessonCount()).toBe(total);
  });

  it("defines Module 1 Lesson 1 with title, duration, and learning objectives", () => {
    const lesson = findLessonById("m1-l1");
    expect(lesson).not.toBeNull();
    expect(lesson.title).toBe("What JavaScript Is and Where It Runs");
    expect(lesson.estimatedMinutes).toBe(15);
    expect(lesson.prerequisites).toEqual([]);
    expect(lesson.objectives.length).toBeGreaterThanOrEqual(3);
  });

  it("finds lessons by ID across different modules", () => {
    const l1 = findLessonById("m1-l1");
    expect(l1.moduleId).toBe("m1");

    const l8 = findLessonById("m8-l4");
    expect(l8).not.toBeNull();
    expect(l8.title).toBe("Classes and Constructors");
    expect(l8.moduleId).toBe("m8");
  });

  it("returns null for non-existent lesson IDs", () => {
    expect(findLessonById("unknown-lesson")).toBeNull();
  });

  it("finds modules by ID and returns null for unknown module", () => {
    const m1 = findModuleById("m1");
    expect(m1).not.toBeNull();
    expect(m1.moduleTitle).toContain("Getting Started");

    expect(findModuleById("non-existent")).toBeNull();
  });

  it("defines all 6 Module 2 lessons with titles, durations, prerequisites, and objectives", () => {
    const m2 = findModuleById("m2");
    expect(m2).not.toBeNull();
    expect(m2.lessons).toHaveLength(6);
    expect(m2.milestone).toBe("Build a simple calculator using variables and expressions.");

    const expectedIds = ["m2-l1", "m2-l2", "m2-l3", "m2-l4", "m2-l5", "m2-l6"];
    expectedIds.forEach((id) => {
      const lesson = findLessonById(id);
      expect(lesson).not.toBeNull();
      expect(lesson.moduleId).toBe("m2");
      expect(lesson.estimatedMinutes).toBeGreaterThan(0);
      expect(Array.isArray(lesson.prerequisites)).toBe(true);
      expect(lesson.prerequisites.length).toBeGreaterThan(0);
      expect(Array.isArray(lesson.objectives)).toBe(true);
      expect(lesson.objectives.length).toBeGreaterThanOrEqual(4);
    });

    expect(findLessonById("m2-l1").prerequisites).toEqual(["m1-l4"]);
    expect(findLessonById("m2-l2").prerequisites).toEqual(["m2-l1"]);
    expect(findLessonById("m2-l3").prerequisites).toEqual(["m2-l2"]);
    expect(findLessonById("m2-l4").prerequisites).toEqual(["m2-l3"]);
    expect(findLessonById("m2-l5").prerequisites).toEqual(["m2-l4"]);
    expect(findLessonById("m2-l6").prerequisites).toEqual(["m2-l5"]);
  });

  it("defines the six Module 3 lessons, objective metadata, and milestone", () => {
    const m3 = findModuleById("m3");
    expect(m3.moduleTitle).toBe("Module 3: Decisions and Repetition");
    expect(m3.milestone).toBe(
      "Build a deterministic number-search or rule-based program."
    );

    const expected = [
      ["m3-l1", "Truthy and Falsy Values", 15, ["m2-l6"]],
      ["m3-l2", "if, else if, and else", 20, ["m3-l1"]],
      ["m3-l3", "switch and Conditional Expressions", 15, ["m3-l2"]],
      ["m3-l4", "for and while Loops", 20, ["m3-l3"]],
      ["m3-l5", "break and continue", 15, ["m3-l4"]],
      ["m3-l6", "Choosing an Appropriate Control Structure", 15, ["m3-l5"]],
    ];

    expect(m3.lessons).toHaveLength(expected.length);
    for (const [index, [lessonId, title, minutes, prerequisites]] of expected.entries()) {
      const lesson = findLessonById(lessonId);
      expect(m3.lessons[index].lessonId).toBe(lessonId);
      expect(lesson.title).toBe(title);
      expect(lesson.moduleId).toBe("m3");
      expect(lesson.estimatedMinutes).toBe(minutes);
      expect(lesson.prerequisites).toEqual(prerequisites);
      expect(lesson.objectives.length).toBeGreaterThanOrEqual(3);
    }

    expect(findLessonById("m3-l6").objectives.join(" ")).toContain("deterministic");
    expect(findLessonById("m3-l6")).not.toBeNull();
  });

  it("places m3-l6 immediately before the existing Module 4 placeholder", () => {
    expect(getNextLessonId("m3-l6")).toBe("m4-l1");
  });

  it("defines the seven Module 4 lessons with objectives and a complete prerequisite chain", () => {
    const m4 = findModuleById("m4");
    const expected = [
      ["m4-l1", "Function Declarations and Expressions", 20, ["m3-l6"]],
      ["m4-l2", "Parameters, Arguments, and Return Values", 20, ["m4-l1"]],
      ["m4-l3", "Arrow Functions", 15, ["m4-l2"]],
      ["m4-l4", "Scope and Lexical Scope", 20, ["m4-l3"]],
      ["m4-l5", "Callbacks and Higher-Order Functions", 25, ["m4-l4"]],
      ["m4-l6", "Closures", 25, ["m4-l5"]],
      ["m4-l7", "Recursion and Common Debugging Patterns", 20, ["m4-l6"]],
    ];

    expect(m4.moduleTitle).toBe("Module 4: Functions");
    expect(m4.milestone).toBe("Break a multi-step problem into reusable functions.");
    expect(m4.lessons).toHaveLength(7);
    for (const [index, [lessonId, title, minutes, prerequisites]] of expected.entries()) {
      const lesson = findLessonById(lessonId);
      expect(m4.lessons[index].lessonId).toBe(lessonId);
      expect(lesson.title).toBe(title);
      expect(lesson.estimatedMinutes).toBe(minutes);
      expect(lesson.prerequisites).toEqual(prerequisites);
      expect(lesson.objectives.length).toBeGreaterThanOrEqual(3);
    }
    expect(getNextLessonId("m4-l7")).toBe("m5-l1");
  });

  it("defines all eight Module 5 lessons with objectives and the canonical sequence", () => {
    const m5 = findModuleById("m5");
    const expected = [
      ["m5-l1", "Creating and Accessing Arrays", 20, ["m4-l7"]],
      ["m5-l2", "Iteration and Array Methods", 20, ["m5-l1"]],
      ["m5-l3", "map, filter, find, and reduce", 30, ["m5-l2"]],
      ["m5-l4", "Creating and Updating Objects", 20, ["m5-l3"]],
      ["m5-l5", "Methods and the this Keyword", 25, ["m5-l4"]],
      ["m5-l6", "Destructuring, Spread, and Rest Syntax", 20, ["m5-l5"]],
      ["m5-l7", "References, Mutation, and Copying", 25, ["m5-l6"]],
      ["m5-l8", "Transforming Collections of Objects", 25, ["m5-l7"]],
    ];

    expect(m5.moduleTitle).toBe("Module 5: Arrays and Objects");
    expect(m5.milestone).toBe("Build a small data-processing application.");
    expect(m5.lessons).toHaveLength(expected.length);
    for (const [index, [lessonId, title, minutes, prerequisites]] of expected.entries()) {
      const lesson = findLessonById(lessonId);
      expect(m5.lessons[index].lessonId).toBe(lessonId);
      expect(lesson.title).toBe(title);
      expect(lesson.moduleId).toBe("m5");
      expect(lesson.estimatedMinutes).toBe(minutes);
      expect(lesson.prerequisites).toEqual(prerequisites);
      expect(lesson.objectives.length).toBeGreaterThanOrEqual(3);
    }
    expect(getNextLessonId("m5-l8")).toBe("m6-l1");
    expect(getTotalLessonCount()).toBe(64);
  });

  it("defines all seven Module 6 lessons with approved objectives and the canonical sequence", () => {
    const m6 = findModuleById("m6");
    const expected = [
      ["m6-l1", "The Relationship Between JavaScript, HTML, and CSS", 20, ["m5-l8"]],
      ["m6-l2", "DOM Selection and Manipulation", 25, ["m6-l1"]],
      ["m6-l3", "Event Listeners and Event Objects", 25, ["m6-l2"]],
      ["m6-l4", "Form Input and Validation", 25, ["m6-l3"]],
      ["m6-l5", "Modules and Imports/Exports", 20, ["m6-l4"]],
      ["m6-l6", "Error Handling with try and catch", 20, ["m6-l5"]],
      ["m6-l7", "Browser Debugging Tools", 20, ["m6-l6"]],
    ];

    expect(m6.moduleTitle).toBe("Module 6: JavaScript in the Browser");
    expect(m6.milestone).toBe("Build an interactive to-do list or similar application.");
    expect(m6.lessons).toHaveLength(expected.length);
    for (const [index, [lessonId, title, minutes, prerequisites]] of expected.entries()) {
      const lesson = findLessonById(lessonId);
      expect(m6.lessons[index].lessonId).toBe(lessonId);
      expect(lesson.title).toBe(title);
      expect(lesson.moduleId).toBe("m6");
      expect(lesson.estimatedMinutes).toBe(minutes);
      expect(lesson.prerequisites).toEqual(prerequisites);
      expect(lesson.objectives.length).toBeGreaterThanOrEqual(2);
    }
    expect(getNextLessonId("m5-l8")).toBe("m6-l1");
    expect(getNextLessonId("m6-l7")).toBe("m7-l1");
    expect(getTotalLessonCount()).toBe(64);
  });

  it("defines Module 7 objectives without changing the 64-lesson curriculum", () => {
    const module = findModuleById("m7");
    const expected = [
      ["m7-l1", "Synchronous Execution and the Event Loop", 25, ["m6-l7"]],
      ["m7-l2", "Callbacks and Asynchronous Operations", 20, ["m7-l1"]],
      ["m7-l3", "Promises and Promise Chaining", 25, ["m7-l2"]],
      ["m7-l4", "async and await", 25, ["m7-l3"]],
      ["m7-l5", "Error Handling in Asynchronous Code", 20, ["m7-l4"]],
      ["m7-l6", "Fetching Data from an HTTP API", 30, ["m7-l5"]],
      ["m7-l7", "Loading States and Failed Requests", 20, ["m7-l6"]],
    ];

    expect(module.moduleTitle).toBe("Module 7: Asynchronous JavaScript");
    expect(module.milestone).toBe("Build an interface that retrieves and displays external data.");
    expect(module.lessons).toHaveLength(expected.length);
    for (const [index, [lessonId, title, minutes, prerequisites]] of expected.entries()) {
      const lesson = findLessonById(lessonId);
      expect(module.lessons[index].lessonId).toBe(lessonId);
      expect(lesson.title).toBe(title);
      expect(lesson.estimatedMinutes).toBe(minutes);
      expect(lesson.prerequisites).toEqual(prerequisites);
      expect(lesson.objectives.length).toBeGreaterThanOrEqual(3);
    }
    expect(getNextLessonId("m7-l7")).toBe("m8-l1");
    expect(getTotalLessonCount()).toBe(64);
  });

  it("ensures all lessons have unique lesson IDs across the curriculum", () => {
    const curriculum = getCurriculum();
    const allLessonIds = [];
    for (const mod of curriculum) {
      for (const lesson of mod.lessons) {
        allLessonIds.push(lesson.lessonId);
      }
    }
    const uniqueIds = new Set(allLessonIds);
    expect(uniqueIds.size).toBe(allLessonIds.length);
  });
});
