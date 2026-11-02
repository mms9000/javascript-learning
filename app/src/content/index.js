/**
 * content/index.js — Content registry.
 *
 * Provides functions to retrieve lesson content by ID.
 */

import { lessonM1L1 } from "./m1-l1.js";
import { lessonM1L2 } from "./m1-l2.js";
import { lessonM1L3 } from "./m1-l3.js";
import { lessonM1L4 } from "./m1-l4.js";
import { lessonM2L1 } from "./m2-l1.js";
import { lessonM2L2 } from "./m2-l2.js";
import { lessonM2L3 } from "./m2-l3.js";
import { lessonM2L4 } from "./m2-l4.js";
import { lessonM2L5 } from "./m2-l5.js";
import { lessonM2L6 } from "./m2-l6.js";
import { lessonM3L1 } from "./m3-l1.js";
import { lessonM3L2 } from "./m3-l2.js";
import { lessonM3L3 } from "./m3-l3.js";
import { lessonM3L4 } from "./m3-l4.js";
import { lessonM3L5 } from "./m3-l5.js";
import { lessonM3L6 } from "./m3-l6.js";
import { lessonM4L1 } from "./m4-l1.js";
import { lessonM4L2 } from "./m4-l2.js";
import { lessonM4L3 } from "./m4-l3.js";
import { lessonM4L4 } from "./m4-l4.js";
import { lessonM4L5 } from "./m4-l5.js";
import { lessonM4L6 } from "./m4-l6.js";
import { lessonM4L7 } from "./m4-l7.js";
import { lessonM5L1 } from "./m5-l1.js";
import { lessonM5L2 } from "./m5-l2.js";
import { lessonM5L3 } from "./m5-l3.js";
import { lessonM5L4 } from "./m5-l4.js";
import { lessonM5L5 } from "./m5-l5.js";
import { lessonM5L6 } from "./m5-l6.js";
import { lessonM5L7 } from "./m5-l7.js";
import { lessonM5L8 } from "./m5-l8.js";
import { lessonM6L1 } from "./m6-l1.js";
import { lessonM6L2 } from "./m6-l2.js";
import { lessonM6L3 } from "./m6-l3.js";
import { lessonM6L4 } from "./m6-l4.js";
import { lessonM6L5 } from "./m6-l5.js";
import { lessonM6L6 } from "./m6-l6.js";
import { lessonM6L7 } from "./m6-l7.js";
import { lessonM7L1 } from "./m7-l1.js";
import { lessonM7L2 } from "./m7-l2.js";
import { lessonM7L3 } from "./m7-l3.js";
import { lessonM7L4 } from "./m7-l4.js";
import { lessonM7L5 } from "./m7-l5.js";
import { lessonM7L6 } from "./m7-l6.js";
import { lessonM7L7 } from "./m7-l7.js";
import { lessonM8L1 } from "./m8-l1.js";
import { lessonM8L2 } from "./m8-l2.js";
import { lessonM8L3 } from "./m8-l3.js";
import { lessonM8L4 } from "./m8-l4.js";
import { lessonM8L5 } from "./m8-l5.js";
import { lessonM8L6 } from "./m8-l6.js";
import { lessonM8L7 } from "./m8-l7.js";
import { lessonM8L8 } from "./m8-l8.js";
import { lessonM8L9 } from "./m8-l9.js";
import { lessonM8L10 } from "./m8-l10.js";
import { lessonM9L1 } from "./m9-l1.js";
import { lessonM9L2 } from "./m9-l2.js";
import { lessonM9L3 } from "./m9-l3.js";
import { lessonM9L4 } from "./m9-l4.js";
import { lessonM9L5 } from "./m9-l5.js";
import { lessonM9L6 } from "./m9-l6.js";
import { lessonM9L7 } from "./m9-l7.js";
import { lessonM9L8 } from "./m9-l8.js";
import { lessonM9L9 } from "./m9-l9.js";

/**
 * Validates the structure and consistency of a lesson definition object.
 * Catches missing required fields or registration ID typos early.
 *
 * @param {string} id - The registered lesson ID key.
 * @param {Object} lesson - The lesson definition object.
 */
export function assertLessonShape(id, lesson) {
  if (!lesson || typeof lesson !== "object") {
    throw new TypeError(`Lesson registration for "${id}" must be a non-null object.`);
  }
  if (lesson.lessonId !== id) {
    throw new Error(
      `Lesson ID mismatch: registered as "${id}" but object has lessonId "${lesson.lessonId}".`
    );
  }
  const requiredFields = ["lessonId", "moduleId", "title", "sections", "summary"];
  for (const field of requiredFields) {
    if (!lesson[field]) {
      throw new Error(`Lesson "${id}" is missing required field "${field}".`);
    }
  }
  if (!Array.isArray(lesson.sections) || lesson.sections.length === 0) {
    throw new Error(`Lesson "${id}" must have a non-empty sections array.`);
  }
  if (!Array.isArray(lesson.summary) || lesson.summary.length === 0) {
    throw new Error(`Lesson "${id}" must have a non-empty summary array.`);
  }
}

// Development and test integrity check
const isDev =
  (typeof import.meta !== "undefined" && Boolean(import.meta.env?.DEV)) ||
  (typeof globalThis.process !== "undefined" &&
    globalThis.process.env?.NODE_ENV !== "production");

if (isDev) {
  assertLessonShape("m1-l1", lessonM1L1);
  assertLessonShape("m1-l2", lessonM1L2);
  assertLessonShape("m1-l3", lessonM1L3);
  assertLessonShape("m1-l4", lessonM1L4);
  assertLessonShape("m2-l1", lessonM2L1);
  assertLessonShape("m2-l2", lessonM2L2);
  assertLessonShape("m2-l3", lessonM2L3);
  assertLessonShape("m2-l4", lessonM2L4);
  assertLessonShape("m2-l5", lessonM2L5);
  assertLessonShape("m2-l6", lessonM2L6);
  assertLessonShape("m3-l1", lessonM3L1);
  assertLessonShape("m3-l2", lessonM3L2);
  assertLessonShape("m3-l3", lessonM3L3);
  assertLessonShape("m3-l4", lessonM3L4);
  assertLessonShape("m3-l5", lessonM3L5);
  assertLessonShape("m3-l6", lessonM3L6);
  assertLessonShape("m4-l1", lessonM4L1);
  assertLessonShape("m4-l2", lessonM4L2);
  assertLessonShape("m4-l3", lessonM4L3);
  assertLessonShape("m4-l4", lessonM4L4);
  assertLessonShape("m4-l5", lessonM4L5);
  assertLessonShape("m4-l6", lessonM4L6);
  assertLessonShape("m4-l7", lessonM4L7);
  assertLessonShape("m5-l1", lessonM5L1);
  assertLessonShape("m5-l2", lessonM5L2);
  assertLessonShape("m5-l3", lessonM5L3);
  assertLessonShape("m5-l4", lessonM5L4);
  assertLessonShape("m5-l5", lessonM5L5);
  assertLessonShape("m5-l6", lessonM5L6);
  assertLessonShape("m5-l7", lessonM5L7);
  assertLessonShape("m5-l8", lessonM5L8);
  assertLessonShape("m6-l1", lessonM6L1);
  assertLessonShape("m6-l2", lessonM6L2);
  assertLessonShape("m6-l3", lessonM6L3);
  assertLessonShape("m6-l4", lessonM6L4);
  assertLessonShape("m6-l5", lessonM6L5);
  assertLessonShape("m6-l6", lessonM6L6);
  assertLessonShape("m6-l7", lessonM6L7);
  assertLessonShape("m7-l1", lessonM7L1);
  assertLessonShape("m7-l2", lessonM7L2);
  assertLessonShape("m7-l3", lessonM7L3);
  assertLessonShape("m7-l4", lessonM7L4);
  assertLessonShape("m7-l5", lessonM7L5);
  assertLessonShape("m7-l6", lessonM7L6);
  assertLessonShape("m7-l7", lessonM7L7);
  assertLessonShape("m8-l1", lessonM8L1);
  assertLessonShape("m8-l2", lessonM8L2);
  assertLessonShape("m8-l3", lessonM8L3);
  assertLessonShape("m8-l4", lessonM8L4);
  assertLessonShape("m8-l5", lessonM8L5);
  assertLessonShape("m8-l6", lessonM8L6);
  assertLessonShape("m8-l7", lessonM8L7);
  assertLessonShape("m8-l8", lessonM8L8);
  assertLessonShape("m8-l9", lessonM8L9);
  assertLessonShape("m8-l10", lessonM8L10);
  assertLessonShape("m9-l1", lessonM9L1);
  assertLessonShape("m9-l2", lessonM9L2);
  assertLessonShape("m9-l3", lessonM9L3);
  assertLessonShape("m9-l4", lessonM9L4);
  assertLessonShape("m9-l5", lessonM9L5);
  assertLessonShape("m9-l6", lessonM9L6);
  assertLessonShape("m9-l7", lessonM9L7);
  assertLessonShape("m9-l8", lessonM9L8);
  assertLessonShape("m9-l9", lessonM9L9);
}

const lessonsById = {
  "m1-l1": lessonM1L1,
  "m1-l2": lessonM1L2,
  "m1-l3": lessonM1L3,
  "m1-l4": lessonM1L4,
  "m2-l1": lessonM2L1,
  "m2-l2": lessonM2L2,
  "m2-l3": lessonM2L3,
  "m2-l4": lessonM2L4,
  "m2-l5": lessonM2L5,
  "m2-l6": lessonM2L6,
  "m3-l1": lessonM3L1,
  "m3-l2": lessonM3L2,
  "m3-l3": lessonM3L3,
  "m3-l4": lessonM3L4,
  "m3-l5": lessonM3L5,
  "m3-l6": lessonM3L6,
  "m4-l1": lessonM4L1,
  "m4-l2": lessonM4L2,
  "m4-l3": lessonM4L3,
  "m4-l4": lessonM4L4,
  "m4-l5": lessonM4L5,
  "m4-l6": lessonM4L6,
  "m4-l7": lessonM4L7,
  "m5-l1": lessonM5L1,
  "m5-l2": lessonM5L2,
  "m5-l3": lessonM5L3,
  "m5-l4": lessonM5L4,
  "m5-l5": lessonM5L5,
  "m5-l6": lessonM5L6,
  "m5-l7": lessonM5L7,
  "m5-l8": lessonM5L8,
  "m6-l1": lessonM6L1,
  "m6-l2": lessonM6L2,
  "m6-l3": lessonM6L3,
  "m6-l4": lessonM6L4,
  "m6-l5": lessonM6L5,
  "m6-l6": lessonM6L6,
  "m6-l7": lessonM6L7,
  "m7-l1": lessonM7L1,
  "m7-l2": lessonM7L2,
  "m7-l3": lessonM7L3,
  "m7-l4": lessonM7L4,
  "m7-l5": lessonM7L5,
  "m7-l6": lessonM7L6,
  "m7-l7": lessonM7L7,
  "m8-l1": lessonM8L1,
  "m8-l2": lessonM8L2,
  "m8-l3": lessonM8L3,
  "m8-l4": lessonM8L4,
  "m8-l5": lessonM8L5,
  "m8-l6": lessonM8L6,
  "m8-l7": lessonM8L7,
  "m8-l8": lessonM8L8,
  "m8-l9": lessonM8L9,
  "m8-l10": lessonM8L10,
  "m9-l1": lessonM9L1,
  "m9-l2": lessonM9L2,
  "m9-l3": lessonM9L3,
  "m9-l4": lessonM9L4,
  "m9-l5": lessonM9L5,
  "m9-l6": lessonM9L6,
  "m9-l7": lessonM9L7,
  "m9-l8": lessonM9L8,
  "m9-l9": lessonM9L9,
};

/**
 * Returns the full content object for a given lesson ID.
 *
 * @param {string} lessonId
 * @returns {Object|null}
 */
export function getLessonContent(lessonId) {
  return lessonsById[lessonId] || null;
}
