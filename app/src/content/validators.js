/**
 * content/validators.js — Shared validator base factory.
 *
 * Provides createBaseValidator to eliminate boilerplate across lesson validators
 * while ensuring identical, robust error-guard behavior (timeouts, SyntaxErrors,
 * ReferenceErrors, TypeErrors, unexpected runner statuses).
 */

/**
 * Strips trailing newline and carriage-return characters from a string,
 * preserving all leading and internal whitespace.
 *
 * @param {*} value
 * @returns {string}
 */
export function stripTrailingNewlines(value) {
  return String(value ?? "").replace(/[\r\n]+$/, "");
}

/**
 * Creates an exercise validator function with standardized guards for runner
 * timeouts, syntax/runtime errors, and execution status checks.
 *
 * @param {Function} outputChecker - Called with normalized entries array when runResult.status is "success".
 * @param {Object} [options]
 * @param {Function|string} [options.syntaxErrorMessage] - Custom SyntaxError formatter or string.
 * @param {Function|string} [options.referenceErrorMessage] - Custom ReferenceError formatter or string.
 * @param {Function|string} [options.typeErrorMessage] - Custom TypeError formatter or string.
 * @param {string} [options.timeoutMessage] - Custom timeout message.
 * @param {Function} [options.onError] - Custom error hook returning { passed, status, message } or null.
 * @returns {Function} Validator accepting (outputEntries, runResult).
 */
export function createBaseValidator(outputChecker, options = {}) {
  if (typeof outputChecker !== "function") {
    throw new TypeError("createBaseValidator requires an outputChecker function.");
  }

  return function validate(outputEntries, runResult) {
    if (!runResult) {
      return {
        passed: false,
        status: "error",
        message: "No execution result recorded. Click 'Run' to test your code.",
      };
    }

    // Handle timeout or worker termination
    if (runResult.status === "terminated") {
      return {
        passed: false,
        status: "error",
        message:
          options.timeoutMessage ||
          "Execution timed out. Make sure your code does not contain an infinite loop.",
      };
    }

    // Handle execution errors (syntax, runtime, etc.)
    if (runResult.status === "error") {
      const err = runResult.error;
      const errName = err?.name || "Error";
      const errMsg = err?.message || "Execution error.";

      if (typeof options.onError === "function") {
        const custom = options.onError(errName, errMsg, err);
        if (custom) return custom;
      }

      if (errName === "SyntaxError") {
        const msg =
          typeof options.syntaxErrorMessage === "function"
            ? options.syntaxErrorMessage(errMsg, err)
            : options.syntaxErrorMessage ||
              `Syntax Error: ${errMsg}. Check that each statement has valid syntax.`;
        return {
          passed: false,
          status: "error",
          message: msg,
        };
      }

      if (errName === "ReferenceError") {
        const msg =
          typeof options.referenceErrorMessage === "function"
            ? options.referenceErrorMessage(errMsg, err)
            : options.referenceErrorMessage ||
              `Reference Error: ${errMsg}. Check the spelling and capitalization.`;
        return {
          passed: false,
          status: "error",
          message: msg,
        };
      }

      if (errName === "TypeError") {
        const msg =
          typeof options.typeErrorMessage === "function"
            ? options.typeErrorMessage(errMsg, err)
            : options.typeErrorMessage || `Type Error: ${errMsg}.`;
        return {
          passed: false,
          status: "error",
          message: msg,
        };
      }

      return {
        passed: false,
        status: "error",
        message: `${errName}: ${errMsg}`,
      };
    }

    // Reject any status other than "success"
    if (runResult.status !== "success") {
      return {
        passed: false,
        status: "error",
        message: "Execution did not complete successfully.",
      };
    }

    // Status is "success": validate actual output entries
    const entries = Array.isArray(outputEntries) ? outputEntries : [];
    return outputChecker(entries);
  };
}
