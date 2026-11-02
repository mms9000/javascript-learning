/**
 * Declarative lesson animation scenes.
 *
 * Register only scenes authorized for implementation.
 */
export const lessonAnimationScenes = [
  {
    lessonId: "m1-l1",
    sectionId: "the-three-pieces",
    title: "How JavaScript runs in a browser",
    description:
      "JavaScript is the language. The browser is the host environment; it contains an engine that executes JavaScript and provides the Console API. The example sends the string Hello, world! to visible console output.",
    code: 'console.log("Hello, world!");',
    output: "Hello, world!",
    diagram: [
      {
        type: "code",
        id: "language",
        title: "JavaScript language",
        description: "The source language",
      },
      {
        type: "connector",
        id: "source-engine",
        direction: "horizontal",
        title: "Source code flows to the engine",
      },
      {
        type: "group",
        id: "browser",
        layout: "host",
        title: "Browser host",
        items: [
          {
            type: "node",
            id: "engine",
            title: "JavaScript engine",
            description: "Executes the JavaScript source",
          },
          {
            type: "connector",
            id: "engine-console",
            direction: "horizontal",
            title: "The engine makes the Console API call",
          },
          {
            type: "node",
            id: "console",
            title: "Console API",
            description: "Provided by the browser host",
          },
          {
            type: "connector",
            id: "console-output",
            direction: "vertical",
            title: "The Console API produces visible output",
          },
          {
            type: "output",
            id: "output",
            title: "Console output",
            description: "Visible output from the Console API",
          },
        ],
      },
    ],
    steps: [
      {
        caption: "JavaScript is the language; the browser is a separate host environment.",
        activeNode: "language",
        connections: [],
        showOutput: false,
      },
      {
        caption: "The browser contains a JavaScript engine that executes the source.",
        activeNode: "engine",
        connections: ["source-engine"],
        showOutput: false,
      },
      {
        caption: "The browser provides the Console API used by this call.",
        activeNode: "console",
        connections: ["source-engine", "engine-console"],
        showOutput: false,
      },
      {
        caption: "The Console API displays the string Hello, world! as output.",
        activeNode: "output",
        connections: ["source-engine", "engine-console", "console-output"],
        showOutput: true,
      },
    ],
  },
  {
    lessonId: "m1-l2",
    sectionId: "sequential-execution",
    title: "Statements run from top to bottom",
    description:
      "Both statements are processed in source order. The first call outputs a quoted text string; the second outputs an unquoted number.",
    layout: "sequential",
    code: 'console.log("Player Score:");\nconsole.log(100);',
    codeLineAnnotations: [
      "Text string · quoted in the source",
      "Number · unquoted in the source",
    ],
    outputLines: [
      {
        text: "Player Score:",
        kind: "Text string",
        sourceNotation: "Quoted in the source",
      },
      {
        text: "100",
        kind: "Number",
        sourceNotation: "Unquoted in the source",
      },
    ],
    diagram: [
      {
        type: "code",
        id: "statements",
        title: "JavaScript statements",
        description: "Processed sequentially from top to bottom",
      },
      {
        type: "connector",
        id: "code-output",
        direction: "vertical",
        title: "Statements add output in source order",
      },
      {
        type: "output",
        id: "output",
        title: "Console output",
        description: "Each call adds a line below the previous output",
      },
    ],
    steps: [
      {
        caption: "Both statements are shown in source order; the output is empty.",
        activeCodeLine: null,
        visibleOutputCount: 0,
        connections: [],
      },
      {
        caption: "The first statement runs first: console.log(\"Player Score:\").",
        activeCodeLine: 0,
        visibleOutputCount: 0,
        connections: [],
      },
      {
        caption: "Its quoted text string, Player Score:, becomes the first output line.",
        activeCodeLine: 0,
        visibleOutputCount: 1,
        connections: ["code-output"],
      },
      {
        caption: "The highlight moves down to the second statement; the first output stays above.",
        activeCodeLine: 1,
        visibleOutputCount: 1,
        connections: ["code-output"],
      },
      {
        caption: "The unquoted number 100 is added below, preserving top-to-bottom order.",
        activeCodeLine: 1,
        visibleOutputCount: 2,
        connections: ["code-output"],
      },
    ],
  },
];

export function getLessonAnimationScene(lessonId, sectionId) {
  return lessonAnimationScenes.find(
    (scene) => scene.lessonId === lessonId && scene.sectionId === sectionId,
  );
}
