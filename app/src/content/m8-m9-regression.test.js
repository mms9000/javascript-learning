import { describe, expect, it } from "vitest";
import { getLessonContent } from "./index.js";
import { findLessonById } from "../curriculum.js";

const module8Lessons = [
  ["m8-l1", "Objects, Properties, and Methods"],
  ["m8-l2", "Constructor Functions and Prototypes"],
  ["m8-l3", "Prototype Chains and Property Lookup"],
  ["m8-l4", "Classes and Constructors"],
  ["m8-l5", "Instance Methods and this"],
  ["m8-l6", "Inheritance Using extends and super"],
  ["m8-l7", "Encapsulation and Private Class Fields"],
  ["m8-l8", "Polymorphism and Shared Object Behavior"],
  ["m8-l9", "Composition Versus Inheritance"],
  ["m8-l10", "When OOP Is Useful and When It Is Unnecessary"],
];

const module9Lessons = [
  ["m9-l1", "Modules and Code Organization"],
  ["m9-l2", "Reusable Functions and Separation of Concerns"],
  ["m9-l3", "Array Transformations and Immutable Update Patterns"],
  ["m9-l4", "Data Flow, State, and Derived Values"],
  ["m9-l5", "Event-Driven Programming"],
  ["m9-l6", "Components as a General UI Design Concept"],
  ["m9-l7", "Reading Unfamiliar Code and API Documentation"],
  ["m9-l8", "Understanding What a Framework Adds Beyond JavaScript"],
  ["m9-l9", "Framework-Neutral Capstone Project"],
];

describe("Modules 8 and 9 regression coverage", () => {
  it.each([...module8Lessons, ...module9Lessons])(
    "defines %s with canonical metadata and required instructional sections",
    (lessonId, title) => {
      const lesson = getLessonContent(lessonId);
      expect(lesson).not.toBeNull();
      expect(lesson.lessonId).toBe(lessonId);
      expect(lesson.title).toBe(title);
      expect(lesson.moduleId).toBe(lessonId.startsWith("m8") ? "m8" : "m9");
      const curriculumLesson = findLessonById(lessonId);
      expect(lesson.estimatedMinutes).toBe(curriculumLesson.estimatedMinutes);
      expect(lesson.prerequisites).toEqual(curriculumLesson.prerequisites);
      expect(Array.isArray(lesson.objectives)).toBe(true);
      expect(lesson.objectives.length).toBeGreaterThanOrEqual(3);
      expect(lesson.prerequisites).toEqual(expect.any(Array));
      expect(lesson.sections.length).toBeGreaterThanOrEqual(3);
      expect(lesson.summary.length).toBeGreaterThanOrEqual(3);
      expect(lesson.exercise).toBeDefined();
      expect(lesson.exercise.title).toBeTruthy();
      expect(lesson.exercise.hints).toEqual(expect.any(Array));
      expect(lesson.exercise.hints.length).toBeGreaterThanOrEqual(2);
    }
  );

  it("keeps the approved worker-based exercises for the selected M8 lessons", () => {
    const workerLessons = ["m8-l2", "m8-l4", "m8-l5", "m8-l6", "m8-l7"];

    for (const lessonId of workerLessons) {
      const lesson = getLessonContent(lessonId);
      expect(lesson.exercise.executionMode).toBe("worker");
      expect(lesson.exercise.starterCode).toContain("TODO");
      expect(lesson.exercise.validate).toBeTypeOf("function");
      expect(lesson.exercise.expectedOutput).toBeTruthy();
    }
  });

  it("validates the intended observable behavior for each executable M8 exercise", () => {
    const workerLessons = ["m8-l2", "m8-l4", "m8-l5", "m8-l6", "m8-l7"];

    for (const lessonId of workerLessons) {
      const exercise = getLessonContent(lessonId).exercise;
      const expectedEntries = exercise.expectedOutput
        .split("\n")
        .map((text) => ({ text }));
      const validResult = { status: "success" };

      expect(exercise.validate(expectedEntries, validResult).passed).toBe(true);
      expect(exercise.validate([{ text: "incorrect behavior" }], validResult).passed).toBe(false);
    }

    expect(getLessonContent("m8-l2").exercise.expectedOutput).toContain("true");
    expect(getLessonContent("m8-l4").exercise.expectedOutput).toContain("true");
    expect(getLessonContent("m8-l5").exercise.expectedOutput).toBe("8\n6\n8");
    expect(getLessonContent("m8-l6").exercise.expectedOutput).toContain("true");
    expect(getLessonContent("m8-l7").exercise.expectedOutput).toBe("4\n11\n5");
    expect(getLessonContent("m8-l7").exercise.starterCode).not.toMatch(/counter\.#count/);
  });

  it.each([
    ["m8-l6", /super\.speak\(\)/i],
    ["m8-l7", /SyntaxError/i],
  ])("includes a separate comprehension assessment for %s", (lessonId, concept) => {
    const check = getLessonContent(lessonId).comprehensionCheck;
    expect(check.questions).toHaveLength(1);
    const assessmentText = [
      check.questions[0].prompt,
      ...check.questions[0].options.map((option) => option.label),
    ].join(" ");
    expect(assessmentText).toMatch(concept);
    expect(check.questions[0].options.map((option) => option.id))
      .toContain(check.questions[0].correctOptionId);
  });

  it("keeps the M9 scenario-driven assessments framework-neutral and conceptually grounded", () => {
    const scenarioLessons = ["m9-l3", "m9-l4", "m9-l5", "m9-l6", "m9-l8", "m9-l9"];

    for (const lessonId of scenarioLessons) {
      const lesson = getLessonContent(lessonId);
      expect(lesson.exercise.executionMode).toBe("knowledge-check");
      expect(lesson.exercise.questions).toHaveLength(lessonId === "m9-l9" ? 5 : 3);
      expect(lesson.exercise.prompt).toMatch(/task|state|event|component|framework|board|list/i);
    }
  });

  it("assesses all five framework-neutral Task Board design criteria in the capstone", () => {
    const lesson = getLessonContent("m9-l9");
    const capstone = lesson.exercise;
    expect(capstone.questions).toHaveLength(5);
    const assessmentText = capstone.questions
      .flatMap((question) => [question.prompt, ...question.options.map((option) => option.label)])
      .join(" ");
    expect(assessmentText).toMatch(/application-level state/i);
    expect(assessmentText).toMatch(/responsibilit/i);
    expect(assessmentText).toMatch(/event.*state.*render/i);
    expect(assessmentText).toMatch(/reus/i);
    expect(assessmentText).toMatch(/framework/i);
    expect(lesson.sections[0].content).toMatch(/does not build or execute a functioning task manager/i);
  });
});
