import assert from "node:assert/strict";
import { getCurriculum } from "../src/curriculum.js";
import { getLessonContent } from "../src/content/index.js";

const lessons = getCurriculum().flatMap((module) => module.lessons);

for (const lesson of lessons) {
  const content = getLessonContent(lesson.lessonId);
  assert.ok(content, `Missing content for ${lesson.lessonId}`);
  assert.equal(content.lessonId, lesson.lessonId);
}

console.log(`Content registry native ESM import verified (${lessons.length} lessons).`);
