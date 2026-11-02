import { parse } from "acorn";

function containsDynamicImport(node) {
  if (node.type === "ImportExpression") return true;

  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      if (value.some((child) =>
        child && typeof child.type === "string" && containsDynamicImport(child)
      )) return true;
    } else if (value && typeof value.type === "string" && containsDynamicImport(value)) {
      return true;
    }
  }
  return false;
}

export function assertNoDynamicImports(source) {
  const syntaxTree = parse(source, {
    ecmaVersion: "latest",
    sourceType: "script",
    allowReturnOutsideFunction: true,
  });
  if (containsDynamicImport(syntaxTree)) {
    throw new SyntaxError("Dynamic import() is unavailable in this controlled exercise environment.");
  }
}

export function disableFunctionConstructorAccess(prototypes) {
  for (const prototype of new Set(prototypes)) {
    Object.defineProperty(prototype, "constructor", {
      value: undefined,
      writable: false,
      configurable: false,
    });
  }
}
