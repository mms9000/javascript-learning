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
const ALLOWED_ATTRIBUTES = new Set(["id", "type", "role", "aria-live", "name"]);

/**
 * Renders validated controlled-DOM state as native, host-owned preview controls.
 */
export function createDomPreview(container, onInteraction = () => {}) {
  if (!container) throw new Error("createDomPreview: container is required.");
  let currentSnapshot = null;

  function isRegistered(nodeId, type) {
    return currentSnapshot?.registeredEvents.some(
      (registration) => registration.nodeId === nodeId && registration.type === type
    ) || false;
  }

  function handleClick(event) {
    const target = event.target.closest?.("[data-dom-node-id]");
    if (!target || !container.contains(target)) return;
    const nodeId = target.getAttribute("data-dom-node-id");
    if (isRegistered(nodeId, "click")) {
      onInteraction({ nodeId, type: "click" });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.target.closest?.("[data-dom-node-id]");
    if (!form || !container.contains(form)) return;
    const nodeId = form.getAttribute("data-dom-node-id");
    if (!isRegistered(nodeId, "submit")) return;
    const formValues = Object.create(null);
    for (const input of form.querySelectorAll("input[id]")) {
      formValues[input.id] = input.value;
    }
    onInteraction({ nodeId, type: "submit", formValues });
  }

  function handleChange(event) {
    const input = event.target.closest?.("[data-dom-node-id]");
    if (!input || !container.contains(input)) return;
    const nodeId = input.getAttribute("data-dom-node-id");
    if (!isRegistered(nodeId, "change")) return;
    const interaction = { nodeId, type: "change" };
    if (input.type === "checkbox") interaction.checked = input.checked;
    else interaction.value = input.value;
    onInteraction(interaction);
  }

  container.addEventListener("click", handleClick);
  container.addEventListener("submit", handleSubmit);
  container.addEventListener("change", handleChange);

  function render(snapshot) {
    currentSnapshot = snapshot;
    const previouslyFocused = container.querySelector(":focus")?.getAttribute("data-dom-node-id");
    const fragment = document.createDocumentFragment();

    function renderNode(node) {
      if (!ALLOWED_TAGS.has(node.tag)) {
        throw new TypeError(`The controlled preview cannot render <${node.tag}>.`);
      }
      const element = document.createElement(node.tag);
      element.setAttribute("data-dom-node-id", node.id);
      for (const [name, value] of Object.entries(node.attributes)) {
        if (!ALLOWED_ATTRIBUTES.has(name)) {
          throw new TypeError(`The controlled preview cannot render the "${name}" attribute.`);
        }
        element.setAttribute(name, value);
      }
      if (node.tag === "input") {
        element.value = node.value;
        if (node.attributes.type === "checkbox") element.checked = node.checked;
      }
      if (node.text) element.appendChild(document.createTextNode(node.text));
      for (const child of node.children) element.appendChild(renderNode(child));
      return element;
    }

    for (const root of snapshot.roots) fragment.appendChild(renderNode(root));
    container.replaceChildren(fragment);

    const focusId = snapshot.focusRequest || previouslyFocused;
    if (focusId) {
      container.querySelector(`[data-dom-node-id="${focusId}"]`)?.focus();
    }
  }

  return {
    render,
    clear() {
      currentSnapshot = null;
      container.replaceChildren();
    },
    getSnapshot() {
      return currentSnapshot;
    },
    destroy() {
      container.removeEventListener("click", handleClick);
      container.removeEventListener("submit", handleSubmit);
      container.removeEventListener("change", handleChange);
      currentSnapshot = null;
      container.replaceChildren();
    },
  };
}
