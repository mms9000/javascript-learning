import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDomModel } from "../dom-model.js";
import { createDomPreview } from "./dom-preview.js";

describe("createDomPreview()", () => {
  let container;
  let preview;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    preview?.destroy();
    preview = null;
    container.remove();
  });

  it("renders learner text as text and creates only approved elements", () => {
    const model = createDomModel("m6-l2");
    const status = model.document.querySelector("#status");
    status.textContent = "<script>not executable</script>";
    const list = model.document.querySelector("#items");
    const item = model.document.createElement("li");
    item.textContent = "<img src=x>";
    list.append(item);

    preview = createDomPreview(container);
    preview.render(model.snapshot());

    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("#status").textContent).toBe("<script>not executable</script>");
    expect(container.querySelector("#items").lastElementChild.textContent).toBe("<img src=x>");
  });

  it("forwards only registered click interactions", () => {
    const model = createDomModel("m6-l3");
    const button = model.document.querySelector("#increment");
    button.addEventListener("click", () => {});
    const onInteraction = vi.fn();
    preview = createDomPreview(container, onInteraction);
    preview.render(model.snapshot());

    container.querySelector("button").click();

    expect(onInteraction).toHaveBeenCalledWith({
      nodeId: model.snapshot().roots[0].id,
      type: "click",
    });
  });

  it("prevents native form navigation and sends bounded current values", () => {
    const model = createDomModel("m6-l4");
    model.document.querySelector("#task-form").addEventListener("submit", () => {});
    const onInteraction = vi.fn();
    preview = createDomPreview(container, onInteraction);
    preview.render(model.snapshot());

    const input = container.querySelector("#task-input");
    input.value = "Review DOM";
    const form = container.querySelector("form");
    const submit = new Event("submit", { bubbles: true, cancelable: true });
    form.dispatchEvent(submit);

    expect(submit.defaultPrevented).toBe(true);
    expect(onInteraction).toHaveBeenCalledWith(expect.objectContaining({
      nodeId: model.snapshot().roots[0].id,
      type: "submit",
      formValues: { "task-input": "Review DOM" },
    }));
  });

  it("restores explicit focus and removes host event listeners on destroy", () => {
    const model = createDomModel("m6-l4");
    const input = model.document.querySelector("#task-input");
    input.focus();
    const onInteraction = vi.fn();
    preview = createDomPreview(container, onInteraction);
    preview.render(model.snapshot());

    expect(document.activeElement).toBe(container.querySelector("#task-input"));
    preview.destroy();
    container.dispatchEvent(new Event("click", { bubbles: true }));
    expect(onInteraction).not.toHaveBeenCalled();
    expect(container.childElementCount).toBe(0);
  });
});
