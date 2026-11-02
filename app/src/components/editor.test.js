/**
 * components/editor.test.js — Unit tests for CodeMirror wrapper.
 *
 * Verifies editor initialization, getting/setting code, reset functionality,
 * accessibility attributes, and error handling.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createEditor } from "./editor.js";

describe("createEditor()", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("throws when container is missing", () => {
    expect(() => createEditor(null)).toThrow("createEditor: container element is required");
  });

  it("initializes with the provided starter code", () => {
    const starter = 'console.log("Hello, world!");';
    const editor = createEditor(container, { initialCode: starter });

    expect(editor.getValue()).toBe(starter);
    editor.destroy();
  });

  it("updates code when setValue() is called", () => {
    const editor = createEditor(container, { initialCode: "var a = 1;" });
    editor.setValue("const b = 2;");

    expect(editor.getValue()).toBe("const b = 2;");
    editor.destroy();
  });

  it("resets back to initialCode when reset() is called without arguments", () => {
    const starter = 'console.log("Hello, world!");';
    const editor = createEditor(container, { initialCode: starter });

    editor.setValue("console.log('Modified');");
    expect(editor.getValue()).toBe("console.log('Modified');");

    editor.reset();
    expect(editor.getValue()).toBe(starter);
    editor.destroy();
  });

  it("sets accessible attributes on the editor content DOM", () => {
    const editor = createEditor(container, {
      initialCode: "console.log(1);",
      ariaLabel: "Test JavaScript Editor",
    });

    const contentDom = container.querySelector(".cm-content");
    expect(contentDom).not.toBeNull();
    expect(contentDom.getAttribute("aria-label")).toBe("Test JavaScript Editor");
    expect(contentDom.getAttribute("role")).toBe("textbox");
    expect(contentDom.getAttribute("aria-multiline")).toBe("true");

    editor.destroy();
  });

  it("fires onChange callback when text is updated", () => {
    const onChange = vi.fn();
    const editor = createEditor(container, {
      initialCode: "a",
      onChange,
    });

    editor.setValue("b");
    expect(onChange).toHaveBeenCalledWith("b");

    editor.destroy();
  });
});
