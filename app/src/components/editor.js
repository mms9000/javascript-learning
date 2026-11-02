/**
 * components/editor.js — CodeMirror editor wrapper.
 *
 * Provides a clean abstraction over CodeMirror 6 with JavaScript syntax highlighting,
 * accessible labeling, keyboard shortcuts (Ctrl+Enter to run), and reset/change tracking.
 */

import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

/**
 * Creates and mounts a CodeMirror editor instance into the container.
 *
 * @param {HTMLElement} container - The DOM element to attach the editor to.
 * @param {Object} [options={}] - Editor configuration options.
 * @param {string} [options.initialCode=""] - Starter code.
 * @param {Function} [options.onChange] - Callback fired when document changes with new code string.
 * @param {Function} [options.onRun] - Callback fired when Mod-Enter (Ctrl+Enter / Cmd+Enter) is pressed.
 * @param {string} [options.ariaLabel="JavaScript code editor"] - Accessible label for screen readers.
 * @returns {{ getValue: () => string, setValue: (code: string) => void, reset: (code?: string) => void, focus: () => void, destroy: () => void, view: EditorView }}
 */
export function createEditor(container, options = {}) {
  if (!container) {
    throw new Error("createEditor: container element is required");
  }

  const initialCode = options.initialCode ?? "";
  const ariaLabel = options.ariaLabel ?? "JavaScript code editor";

  const extensions = [
    basicSetup,
    javascript(),
    oneDark,
    EditorView.lineWrapping,
    EditorView.contentAttributes.of({
      "aria-label": ariaLabel,
      role: "textbox",
      "aria-multiline": "true",
      tabindex: "0",
    }),
  ];

  if (typeof options.onRun === "function") {
    extensions.push(
      keymap.of([
        {
          key: "Mod-Enter",
          run: () => {
            options.onRun();
            return true;
          },
        },
      ])
    );
  }

  if (typeof options.onChange === "function") {
    extensions.push(
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          options.onChange(update.state.doc.toString());
        }
      })
    );
  }

  const view = new EditorView({
    doc: initialCode,
    extensions,
    parent: container,
  });

  return {
    view,
    getValue() {
      return view.state.doc.toString();
    },
    setValue(newCode) {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: newCode ?? "",
        },
      });
    },
    reset(code = initialCode) {
      this.setValue(code);
    },
    focus() {
      view.focus();
    },
    destroy() {
      view.destroy();
    },
  };
}
