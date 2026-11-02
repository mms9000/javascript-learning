function createId(value) {
  return String(value || "check").replace(/[^a-zA-Z0-9_-]/g, "-");
}

/**
 * Renders an accessible, no-execution knowledge check.
 */
export function createKnowledgeCheck(container, exercise, options = {}) {
  if (!container) throw new Error("createKnowledgeCheck: container is required.");
  if (!exercise || !Array.isArray(exercise.questions) || exercise.questions.length === 0) {
    throw new TypeError("createKnowledgeCheck: exercise questions are required.");
  }

  const formId = createId(exercise.id);
  let completionNotified = false;
  container.replaceChildren();

  const form = document.createElement("form");
  form.className = "knowledge-check-form";
  form.setAttribute("aria-label", `${exercise.title || "Knowledge check"} answers`);
  form.setAttribute("data-testid", "knowledge-check-form");

  for (const [index, question] of exercise.questions.entries()) {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "knowledge-check-question";
    fieldset.setAttribute("data-testid", `knowledge-question-${index + 1}`);

    const legend = document.createElement("legend");
    legend.textContent = question.prompt;
    fieldset.appendChild(legend);

    const name = `${formId}-question-${index + 1}`;
    for (const option of question.options) {
      const label = document.createElement("label");
      label.className = "knowledge-check-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = name;
      input.value = option.id;
      input.required = true;
      label.appendChild(input);

      const text = document.createElement("span");
      text.textContent = option.label;
      label.appendChild(text);
      fieldset.appendChild(label);
    }

    form.appendChild(fieldset);
  }

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.className = "btn btn-primary knowledge-check-submit";
  submit.setAttribute("data-testid", "knowledge-check-submit");
  submit.textContent = "Check answers";
  submit.disabled = true;
  form.appendChild(submit);

  const feedback = document.createElement("p");
  feedback.className = "knowledge-check-feedback";
  feedback.setAttribute("role", "status");
  feedback.setAttribute("aria-live", "polite");
  feedback.setAttribute("data-testid", "knowledge-check-feedback");
  form.appendChild(feedback);

  form.addEventListener("change", () => {
    submit.disabled = exercise.questions.some((question, index) =>
      !form.querySelector(`input[name="${formId}-question-${index + 1}"]:checked`)
    );
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const answers = exercise.questions.map((question, index) =>
      form.querySelector(`input[name="${formId}-question-${index + 1}"]:checked`)?.value || null
    );
    const passed = exercise.questions.every((question, index) =>
      answers[index] === question.correctOptionId
    );
    const result = {
      passed,
      status: passed ? "success" : "mismatch",
      message: passed
        ? exercise.successMessage || "Correct. You demonstrated the lesson objectives."
        : exercise.failureMessage || "Not quite. Review the choices and try again.",
    };

    feedback.className = `knowledge-check-feedback ${passed ? "feedback-success" : "feedback-fail"}`;
    feedback.textContent = result.message;
    if (passed) {
      if (!completionNotified) {
        completionNotified = true;
        options.onResult?.(result, answers);
      }
    } else {
      options.onResult?.(result, answers);
    }
  });

  container.appendChild(form);

  return {
    reset() {
      form.reset();
      completionNotified = false;
      submit.disabled = true;
      feedback.className = "knowledge-check-feedback";
      feedback.textContent = "";
    },
    destroy() {
      container.replaceChildren();
    },
  };
}
