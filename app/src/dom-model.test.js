import { describe, expect, it } from "vitest";
import { createDomModel, DOM_LIMITS } from "./dom-model.js";

describe("controlled DOM model", () => {
  it("supports bounded selection, text updates, creation, and append", () => {
    const model = createDomModel("m6-l2");
    const status = model.document.querySelector("#status");
    const items = model.document.querySelector("#items");
    const item = model.document.createElement("li");

    expect(status.textContent).toBe("Ready");
    expect(model.document.querySelector("#missing")).toBeNull();
    status.textContent = "JavaScript updated";
    item.textContent = "Practice DOM";
    items.append(item);

    const snapshot = model.snapshot();
    expect(snapshot.roots[0].text).toBe("JavaScript updated");
    expect(snapshot.roots[1].children).toHaveLength(2);
    expect(snapshot.roots[1].children[1].text).toBe("Practice DOM");
  });

  it("supports direct target events and serializable snapshots", () => {
    const model = createDomModel("m6-l3");
    const button = model.document.querySelector("#increment");
    const count = model.document.querySelector("#count");
    const observations = [];
    let value = 0;

    button.addEventListener("click", (event) => {
      value += 1;
      count.textContent = String(value);
      observations.push(event.target.textContent);
    });

    const buttonId = model.snapshot().roots[0].id;
    expect(model.dispatch({ nodeId: buttonId, type: "click" })).toEqual({
      defaultPrevented: false,
      handled: true,
    });
    expect(model.dispatch({ nodeId: buttonId, type: "click" }).handled).toBe(true);
    expect(observations).toEqual(["Add one", "Add one"]);
    expect(model.snapshot().roots[1].children[0].text).toBe("2");
  });

  it("supports the to-do form's values, checkbox state, query, and focus request", () => {
    const model = createDomModel("m6-l4");
    const { document } = model;
    const form = document.querySelector("#task-form");
    const input = document.querySelector("#task-input");
    const status = document.querySelector("#task-status");
    const count = document.querySelector("#task-count");
    const list = document.querySelector("#task-list");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const task = input.value.trim();
      if (!task) {
        status.textContent = "Enter a task.";
        return;
      }
      const item = document.createElement("li");
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      label.textContent = `${task} `;
      label.append(checkbox);
      item.append(label);
      list.append(item);
      input.value = "";
      input.focus();
      status.textContent = `Added: ${task}.`;
      count.textContent = `0 of ${list.children.length} completed`;
    });

    const formId = model.snapshot().roots[0].id;
    model.dispatch({ nodeId: formId, type: "submit", formValues: { "task-input": "  " } });
    expect(document.querySelector("#task-status").textContent).toBe("Enter a task.");

    model.dispatch({
      nodeId: formId,
      type: "submit",
      formValues: { "task-input": "Review DOM" },
    });
    expect(document.querySelector("#task-list").children).toHaveLength(3);
    expect(document.querySelector("#task-input").value).toBe("");
    expect(model.snapshot().focusRequest).toBe("dom-node-4");
    expect(document.querySelector("#task-status").textContent).toBe("Added: Review DOM.");

    const checkboxes = document.querySelectorAll("input:checked");
    expect(checkboxes).toHaveLength(0);
    const checkbox = document.querySelector("#task-list").children[0].querySelector("input");
    expect(checkbox).not.toBeNull();
  });

  it("rejects unsupported selectors, tags, event types, and excessive listeners", () => {
    const model = createDomModel("m6-l2");
    expect(() => model.document.querySelector("body")).toThrow(/not supported/);
    expect(() => model.document.createElement("script")).toThrow(/does not support/);
    expect(() => model.document.querySelector("#status").addEventListener("mouseover", () => {}))
      .toThrow(/supported click, submit, or change/);

    const status = model.document.querySelector("#status");
    for (let index = 0; index < DOM_LIMITS.MAX_LISTENERS; index += 1) {
      status.addEventListener("click", () => {});
    }
    expect(() => status.addEventListener("click", () => {})).toThrow(/limited to 50/);
  });

  it("enforces text, node, and tree-depth quotas", () => {
    const model = createDomModel("m6-l2");
    const status = model.document.querySelector("#status");
    expect(() => {
      status.textContent = "x".repeat(DOM_LIMITS.MAX_STRING_LENGTH + 1);
    }).toThrow(/limited to 2000 characters/);

    const deepModel = createDomModel("m6-l2");
    let branch = deepModel.document.querySelector("#items");
    for (let index = 0; index < 18; index += 1) {
      const child = deepModel.document.createElement("div");
      branch.append(child);
      branch = child;
    }
    const tooDeep = deepModel.document.createElement("div");
    expect(() => branch.append(tooDeep)).toThrow(/limited to 20 levels/);

    const largeModel = createDomModel("m6-l2");
    const list = largeModel.document.querySelector("#items");
    for (let index = 0; index < DOM_LIMITS.MAX_NODES - 4; index += 1) {
      largeModel.document.createElement("li");
    }
    expect(() => largeModel.document.createElement("li")).toThrow(/limited to 200 elements/);
    expect(list).not.toBeNull();
  });
});
