export const DOM_PROTOCOL = "jslearn-dom-v1";

export const DOM_LIMITS = Object.freeze({
  MAX_NODES: 200,
  MAX_DEPTH: 20,
  MAX_LISTENERS: 50,
  MAX_ENTRIES: 100,
  MAX_STRING_LENGTH: 2000,
  MAX_CODE_LENGTH: 50000,
  TIMEOUT_MS: 5000,
  HEARTBEAT_MS: 500,
  HEARTBEAT_TIMEOUT_MS: 2000,
});

const ALLOWED_TAGS = new Set([
  "div",
  "h2",
  "p",
  "ul",
  "li",
  "button",
  "form",
  "label",
  "input",
  "output",
]);
const ALLOWED_EVENTS = new Set(["click", "submit", "change"]);
const ALLOWED_ATTRIBUTES = new Set(["id", "type", "role", "aria-live", "name"]);

function makeFixture(lessonId) {
  let nextId = 0;
  const nodes = new Map();
  const wrappers = new WeakMap();
  const listeners = new Map();
  let listenerCount = 0;
  let focusRequest = null;
  let root;

  function createNode(tag, attributes = {}, text = "") {
    if (!ALLOWED_TAGS.has(tag)) {
      throw new TypeError(`The controlled DOM preview does not support <${tag}>.`);
    }
    if (nodes.size >= DOM_LIMITS.MAX_NODES) {
      throw new RangeError(`The controlled DOM preview is limited to ${DOM_LIMITS.MAX_NODES} elements.`);
    }
    const node = {
      id: `dom-node-${++nextId}`,
      tag,
      attributes: Object.create(null),
      text: normalizeText(text),
      value: "",
      checked: false,
      children: [],
      parentId: null,
    };
    for (const [name, value] of Object.entries(attributes)) {
      if (!ALLOWED_ATTRIBUTES.has(name)) {
        throw new TypeError(`The controlled DOM preview does not support the "${name}" attribute.`);
      }
      node.attributes[name] = normalizeText(value);
    }
    if (tag === "input") {
      node.value = "";
      node.checked = false;
    }
    nodes.set(node.id, node);
    return node;
  }

  function normalizeText(value) {
    const text = String(value ?? "");
    if (text.length > DOM_LIMITS.MAX_STRING_LENGTH) {
      throw new RangeError(`Text is limited to ${DOM_LIMITS.MAX_STRING_LENGTH} characters.`);
    }
    return text;
  }

  function append(parent, child) {
    if (!child || !nodes.has(child.id)) {
      throw new TypeError("Only elements created in this controlled preview can be appended.");
    }
    if (parent === child) {
      throw new TypeError("An element cannot be appended to itself.");
    }
    let ancestor = parent;
    while (ancestor) {
      if (ancestor === child) {
        throw new TypeError("Appending this element would create a circular tree.");
      }
      ancestor = ancestor.parentId ? nodes.get(ancestor.parentId) : null;
    }

    const depth = getDepth(parent) + 1;
    if (depth > DOM_LIMITS.MAX_DEPTH) {
      throw new RangeError(`The controlled DOM preview is limited to ${DOM_LIMITS.MAX_DEPTH} levels.`);
    }
    if (child.parentId) {
      const previousParent = nodes.get(child.parentId);
      previousParent.children = previousParent.children.filter((id) => id !== child.id);
    }
    child.parentId = parent.id;
    parent.children.push(child.id);
  }

  function getDepth(node) {
    let depth = 1;
    let current = node;
    while (current.parentId) {
      depth += 1;
      current = nodes.get(current.parentId);
    }
    return depth;
  }

  function textOf(node) {
    return node.text + node.children.map((id) => textOf(nodes.get(id))).join("");
  }

  function matches(node, selector) {
    if (selector === "input:checked") {
      return node.tag === "input" && node.attributes.type === "checkbox" && node.checked;
    }
    if (selector.startsWith("#")) {
      return node.attributes.id === selector.slice(1);
    }
    return node.tag === selector;
  }

  function validateSelector(selector) {
    if (typeof selector !== "string" || selector.length > 100) {
      throw new TypeError("Use a supported element tag or #id selector.");
    }
    const normalized = selector.trim();
    const isId = /^#[a-zA-Z][\w-]*$/.test(normalized);
    const isTag = ALLOWED_TAGS.has(normalized);
    if (normalized !== "input:checked" && !isId && !isTag) {
      throw new TypeError(`Selector "${normalized}" is not supported in the controlled preview.`);
    }
    return normalized;
  }

  function findAll(selector, startNode, includeStart = false) {
    const normalized = validateSelector(selector);
    const found = [];
    function visit(node, include) {
      if (include && matches(node, normalized)) found.push(node);
      for (const id of node.children) visit(nodes.get(id), true);
    }
    visit(startNode, includeStart);
    return found;
  }

  function wrapperFor(node) {
    if (!node) return null;
    if (wrappers.has(node)) return wrappers.get(node);
    const wrapper = Object.create(null);
    Object.defineProperties(wrapper, {
      id: {
        enumerable: true,
        get: () => node.attributes.id || "",
        set: (value) => {
          const id = normalizeText(value);
          if (id && !/^[a-zA-Z][\w-]*$/.test(id)) {
            throw new TypeError("Element ids must start with a letter and contain only letters, numbers, hyphens, or underscores.");
          }
          const duplicate = [...nodes.values()].some(
            (candidate) => candidate !== node && candidate.attributes.id === id
          );
          if (duplicate) throw new TypeError(`The id "${id}" is already in use.`);
          node.attributes.id = id;
        },
      },
      tagName: { enumerable: true, get: () => node.tag.toUpperCase() },
      textContent: {
        enumerable: true,
        get: () => textOf(node),
        set: (value) => {
          node.text = normalizeText(value);
          for (const childId of node.children) {
            nodes.get(childId).parentId = null;
          }
          node.children = [];
        },
      },
      value: {
        enumerable: true,
        get: () => node.value,
        set: (value) => {
          if (node.tag !== "input") throw new TypeError("Only input elements have a value.");
          node.value = normalizeText(value);
        },
      },
      checked: {
        enumerable: true,
        get: () => node.checked,
        set: (value) => {
          if (node.tag !== "input" || node.attributes.type !== "checkbox") {
            throw new TypeError("Only checkbox inputs have a checked state.");
          }
          node.checked = Boolean(value);
        },
      },
      type: {
        enumerable: true,
        get: () => node.attributes.type || "",
        set: (value) => {
          if (node.tag !== "input" && node.tag !== "button") {
            throw new TypeError("Only input and button elements have a type.");
          }
          const type = normalizeText(value);
          const allowed = node.tag === "input"
            ? new Set(["text", "checkbox"])
            : new Set(["button", "submit"]);
          if (!allowed.has(type)) throw new TypeError(`The type "${type}" is not supported.`);
          node.attributes.type = type;
        },
      },
      children: {
        enumerable: true,
        get: () => Object.freeze(node.children.map((id) => wrapperFor(nodes.get(id)))),
      },
      append: {
        enumerable: false,
        value: (...items) => {
          if (items.length === 0) return;
          for (const item of items) {
            const child = item && typeof item === "object" ? [...nodes.values()].find(
              (candidate) => wrappers.get(candidate) === item
            ) : null;
            append(node, child);
          }
        },
      },
      appendChild: {
        enumerable: false,
        value: (item) => {
          wrapper.append(item);
          return item;
        },
      },
      querySelector: {
        enumerable: false,
        value: (selector) => wrapperFor(findAll(selector, node)[0] || null),
      },
      querySelectorAll: {
        enumerable: false,
        value: (selector) => Object.freeze(findAll(selector, node).map((child) => wrapperFor(child))),
      },
      addEventListener: {
        enumerable: false,
        value: (type, callback) => {
          if (!ALLOWED_EVENTS.has(type) || typeof callback !== "function") {
            throw new TypeError("Use a function with a supported click, submit, or change event.");
          }
          if (listenerCount >= DOM_LIMITS.MAX_LISTENERS) {
            throw new RangeError(`The controlled DOM preview is limited to ${DOM_LIMITS.MAX_LISTENERS} event listeners.`);
          }
          const key = `${node.id}:${type}`;
          if (!listeners.has(key)) listeners.set(key, []);
          listeners.get(key).push(callback);
          listenerCount += 1;
        },
      },
      focus: {
        enumerable: false,
        value: () => {
          if (!["input", "button"].includes(node.tag)) {
            throw new TypeError("Only input and button elements can receive focus in the preview.");
          }
          focusRequest = node.id;
        },
      },
    });
    Object.freeze(wrapper);
    wrappers.set(node, wrapper);
    return wrapper;
  }

  function appendTree(parent, child) {
    append(parent, child);
    return child;
  }

  root = createNode("div", { id: "preview-root" });

  if (lessonId === "m6-l2") {
    const status = createNode("h2", { id: "status" }, "Ready");
    const items = createNode("ul", { id: "items" });
    appendTree(root, status);
    appendTree(items, createNode("li", {}, "Read guide"));
    appendTree(root, items);
  } else if (lessonId === "m6-l3") {
    const button = createNode("button", { id: "increment", type: "button" }, "Add one");
    const count = createNode("output", { id: "count", "aria-live": "polite" }, "0");
    const countRow = createNode("p", {}, "Count: ");
    appendTree(root, button);
    appendTree(countRow, count);
    appendTree(root, countRow);
  } else if (lessonId === "m6-l4") {
    const form = createNode("form", { id: "task-form" });
    const label = createNode("label", {}, "New task");
    const input = createNode("input", { id: "task-input", name: "task", type: "text" });
    appendTree(label, input);
    appendTree(form, label);
    appendTree(form, createNode("button", { type: "submit" }, "Add task"));
    appendTree(root, form);
    appendTree(root, createNode("p", { id: "task-status", role: "status", "aria-live": "polite" }));
    appendTree(root, createNode("p", { id: "task-count", "aria-live": "polite" }, "0 of 2 completed"));
    const list = createNode("ul", { id: "task-list" });
    for (const task of ["Read guide", "Practice events"]) {
      const item = createNode("li");
      const taskLabel = createNode("label", {}, task);
      appendTree(taskLabel, createNode("input", { type: "checkbox" }));
      appendTree(item, taskLabel);
      appendTree(list, item);
    }
    appendTree(root, list);
  } else {
    throw new TypeError(`No controlled DOM fixture is defined for "${lessonId}".`);
  }

  const documentFacade = Object.create(null);
  Object.defineProperties(documentFacade, {
    querySelector: {
      enumerable: true,
      value: (selector) => wrapperFor(findAll(selector, root, true)[0] || null),
    },
    querySelectorAll: {
      enumerable: true,
      value: (selector) => Object.freeze(findAll(selector, root, true).map((node) => wrapperFor(node))),
    },
    createElement: {
      enumerable: true,
      value: (tag) => wrapperFor(createNode(String(tag).toLowerCase())),
    },
  });
  Object.freeze(documentFacade);

  return {
    document: documentFacade,
    getRegisteredEvents() {
      return [...listeners.entries()].flatMap(([key, callbacks]) => {
        const [nodeId, type] = key.split(":");
        return callbacks.length ? [{ nodeId, type }] : [];
      });
    },
    snapshot() {
      function serialize(node) {
        return {
          id: node.id,
          tag: node.tag,
          attributes: { ...node.attributes },
          text: node.text,
          value: node.value,
          checked: node.checked,
          children: node.children.map((id) => serialize(nodes.get(id))),
        };
      }
      const snapshot = {
        roots: root.children.map((id) => serialize(nodes.get(id))),
        registeredEvents: this.getRegisteredEvents(),
        focusRequest,
      };
      focusRequest = null;
      return snapshot;
    },
    dispatch(event) {
      const node = nodes.get(event.nodeId);
      if (!node || !ALLOWED_EVENTS.has(event.type)) {
        throw new TypeError("The requested preview interaction is invalid.");
      }
      if (event.value !== undefined && node.tag === "input") {
        node.value = normalizeText(event.value);
      }
      if (event.formValues && typeof event.formValues === "object") {
        for (const [id, value] of Object.entries(event.formValues)) {
          const target = [...nodes.values()].find((candidate) => candidate.attributes.id === id);
          if (!target || target.tag !== "input") {
            throw new TypeError("The submitted form contains an unsupported field.");
          }
          target.value = normalizeText(value);
        }
      }
      if (event.checked !== undefined) {
        if (node.tag !== "input" || node.attributes.type !== "checkbox") {
          throw new TypeError("Only checkbox inputs accept checked-state interactions.");
        }
        node.checked = Boolean(event.checked);
      }
      const handlers = listeners.get(`${node.id}:${event.type}`) || [];
      let defaultPrevented = false;
      const eventObject = Object.freeze({
        type: event.type,
        target: wrapperFor(node),
        preventDefault() {
          defaultPrevented = true;
        },
        get defaultPrevented() {
          return defaultPrevented;
        },
      });
      for (const handler of [...handlers]) handler(eventObject);
      return { defaultPrevented, handled: handlers.length > 0 };
    },
    getNode(id) {
      return nodes.has(id) ? wrapperFor(nodes.get(id)) : null;
    },
  };
}

export function createDomModel(lessonId) {
  return makeFixture(lessonId);
}
