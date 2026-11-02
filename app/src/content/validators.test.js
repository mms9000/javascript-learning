/**
 * content/validators.test.js — Tests for shared validator base factory.
 */

import { describe, it, expect, vi } from "vitest";
import { createBaseValidator, stripTrailingNewlines } from "./validators.js";

describe("stripTrailingNewlines()", () => {
  it("strips trailing \\n and \\r\\n only", () => {
    expect(stripTrailingNewlines("hello\n")).toBe("hello");
    expect(stripTrailingNewlines("hello\r\n")).toBe("hello");
    expect(stripTrailingNewlines("hello\n\n")).toBe("hello");
  });

  it("preserves leading and internal whitespace", () => {
    expect(stripTrailingNewlines("  hello world  \n")).toBe("  hello world  ");
    expect(stripTrailingNewlines("\nhello")).toBe("\nhello");
  });

  it("handles empty or non-string inputs safely", () => {
    expect(stripTrailingNewlines("")).toBe("");
    expect(stripTrailingNewlines(null)).toBe("");
    expect(stripTrailingNewlines(undefined)).toBe("");
    expect(stripTrailingNewlines(123)).toBe("123");
  });
});

describe("createBaseValidator()", () => {
  it("throws TypeError if outputChecker is not a function", () => {
    expect(() => createBaseValidator(null)).toThrow(TypeError);
    expect(() => createBaseValidator("not-a-fn")).toThrow(TypeError);
  });

  it("returns error result if runResult is missing", () => {
    const checker = vi.fn();
    const validate = createBaseValidator(checker);

    const res = validate([], null);
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("No execution result");
    expect(checker).not.toHaveBeenCalled();
  });

  it("handles terminated status (watchdog timeout)", () => {
    const checker = vi.fn();
    const validate = createBaseValidator(checker);

    const res = validate([], { status: "terminated" });
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("infinite loop");
    expect(checker).not.toHaveBeenCalled();
  });

  it("uses custom timeout message if provided", () => {
    const checker = vi.fn();
    const validate = createBaseValidator(checker, {
      timeoutMessage: "Custom timeout warning.",
    });

    const res = validate([], { status: "terminated" });
    expect(res.message).toBe("Custom timeout warning.");
  });

  it("handles SyntaxError with default message", () => {
    const checker = vi.fn();
    const validate = createBaseValidator(checker);

    const res = validate([], {
      status: "error",
      error: { name: "SyntaxError", message: "Unexpected token" },
    });
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("Syntax Error: Unexpected token.");
  });

  it("handles SyntaxError with custom formatter", () => {
    const checker = vi.fn();
    const validate = createBaseValidator(checker, {
      syntaxErrorMessage: (msg) => `Custom syntax feedback: ${msg}`,
    });

    const res = validate([], {
      status: "error",
      error: { name: "SyntaxError", message: "Missing quote" },
    });
    expect(res.message).toBe("Custom syntax feedback: Missing quote");
  });

  it("handles ReferenceError with default message", () => {
    const checker = vi.fn();
    const validate = createBaseValidator(checker);

    const res = validate([], {
      status: "error",
      error: { name: "ReferenceError", message: "foo is not defined" },
    });
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("Reference Error");
  });

  it("handles ReferenceError with custom formatter", () => {
    const checker = vi.fn();
    const validate = createBaseValidator(checker, {
      referenceErrorMessage: (msg) => `Check name: ${msg}`,
    });

    const res = validate([], {
      status: "error",
      error: { name: "ReferenceError", message: "bar is not defined" },
    });
    expect(res.message).toBe("Check name: bar is not defined");
  });

  it("handles TypeError with default or custom message", () => {
    const checker = vi.fn();
    const validate = createBaseValidator(checker, {
      typeErrorMessage: (msg) => `Type problem: ${msg}`,
    });

    const res = validate([], {
      status: "error",
      error: { name: "TypeError", message: "x is not a function" },
    });
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toBe("Type problem: x is not a function");
  });

  it("handles unexpected error types with fallback name and message", () => {
    const checker = vi.fn();
    const validate = createBaseValidator(checker);

    const res = validate([], {
      status: "error",
      error: { name: "RangeError", message: "Maximum call stack exceeded" },
    });
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toBe("RangeError: Maximum call stack exceeded");
  });

  it("invokes onError hook when provided and returns its result if non-null", () => {
    const checker = vi.fn();
    const validate = createBaseValidator(checker, {
      onError: (errName) => {
        if (errName === "CustomError") {
          return { passed: false, status: "error", message: "Intercepted CustomError" };
        }
        return null;
      },
    });

    const res = validate([], {
      status: "error",
      error: { name: "CustomError", message: "Something special" },
    });
    expect(res.message).toBe("Intercepted CustomError");
  });

  it("rejects non-success runResult status", () => {
    const checker = vi.fn();
    const validate = createBaseValidator(checker);

    const res = validate([], { status: "unknown_status" });
    expect(res.passed).toBe(false);
    expect(res.status).toBe("error");
    expect(res.message).toContain("Execution did not complete successfully");
    expect(checker).not.toHaveBeenCalled();
  });

  it("delegates to outputChecker when status is success", () => {
    const checker = vi.fn().mockReturnValue({
      passed: true,
      status: "success",
      message: "Matched!",
    });
    const validate = createBaseValidator(checker);

    const output = [{ type: "log", text: "hello" }];
    const res = validate(output, { status: "success", error: null });

    expect(checker).toHaveBeenCalledWith(output);
    expect(res).toEqual({
      passed: true,
      status: "success",
      message: "Matched!",
    });
  });

  it("normalizes non-array outputEntries to empty array before calling checker", () => {
    const checker = vi.fn().mockReturnValue({ passed: false, status: "mismatch", message: "empty" });
    const validate = createBaseValidator(checker);

    validate(null, { status: "success", error: null });
    expect(checker).toHaveBeenCalledWith([]);
  });
});
