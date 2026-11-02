export const ASYNC_API_ENDPOINTS = Object.freeze({
  todo: "https://jsonplaceholder.typicode.com/todos/1",
  missingTodo: "https://jsonplaceholder.typicode.com/todos/999999999",
});

export const ASYNC_FETCH_LIMITS = Object.freeze({
  REQUEST_TIMEOUT_MS: 3000,
  MAX_RESPONSE_BYTES: 64 * 1024,
  MAX_REQUESTS_PER_EXECUTION: 3,
});

const endpointStatuses = new Map([
  [ASYNC_API_ENDPOINTS.todo, 200],
  [ASYNC_API_ENDPOINTS.missingTodo, 404],
]);

function createRequestError(name, message) {
  const error = new Error(message);
  error.name = name;
  return error;
}

function validateJsonData(url, status, data) {
  if (status === 404 && url === ASYNC_API_ENDPOINTS.missingTodo) {
    if (data && typeof data === "object" && !Array.isArray(data) && Object.keys(data).length === 0) {
      return;
    }
    throw createRequestError("ResponseValidationError", "The API returned an unexpected not-found response.");
  }

  if (
    status !== 200 ||
    url !== ASYNC_API_ENDPOINTS.todo ||
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    !Number.isSafeInteger(data.userId) ||
    data.userId < 1 ||
    data.id !== 1 ||
    typeof data.title !== "string" ||
    data.title.length === 0 ||
    data.title.length > 200 ||
    typeof data.completed !== "boolean" ||
    Object.keys(data).some((key) => !["userId", "id", "title", "completed"].includes(key))
  ) {
    throw createRequestError("ResponseValidationError", "The API response did not match the approved task shape.");
  }
}

async function readBoundedJson(response) {
  const contentType = response.headers.get("content-type") || "";
  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
    throw createRequestError("ResponseValidationError", "The API response was not JSON.");
  }

  const contentLength = response.headers.get("content-length");
  if (contentLength !== null) {
    if (!/^\d+$/.test(contentLength)) {
      throw createRequestError("ResponseValidationError", "The API returned an invalid content length.");
    }
    if (Number(contentLength) > ASYNC_FETCH_LIMITS.MAX_RESPONSE_BYTES) {
      throw createRequestError("ResponseTooLargeError", "The API response exceeded the 64 KiB limit.");
    }
  }

  if (!response.body?.getReader) {
    throw createRequestError("ResponseValidationError", "The API response could not be read safely.");
  }

  const reader = response.body.getReader();
  const chunks = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > ASYNC_FETCH_LIMITS.MAX_RESPONSE_BYTES) {
        await reader.cancel();
        throw createRequestError("ResponseTooLargeError", "The API response exceeded the 64 KiB limit.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  let parsed;
  try {
    parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body));
  } catch {
    throw createRequestError("ResponseValidationError", "The API returned invalid JSON.");
  }
  return parsed;
}

export async function fetchApprovedApiResponse(url, {
  signal,
  fetchImpl = globalThis.fetch,
  timeoutMs = ASYNC_FETCH_LIMITS.REQUEST_TIMEOUT_MS,
} = {}) {
  const expectedStatus = endpointStatuses.get(url);
  if (!expectedStatus) {
    throw createRequestError(
      "TypeError",
      "This exercise can request only the approved task API endpoint.",
    );
  }
  if (typeof fetchImpl !== "function") {
    throw createRequestError("EnvironmentError", "The browser fetch API is unavailable.");
  }

  const controller = new AbortController();
  let timedOut = false;
  const abortFromCaller = () => controller.abort();
  if (signal?.aborted) {
    controller.abort();
  } else {
    signal?.addEventListener("abort", abortFromCaller, { once: true });
  }
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetchImpl(url, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      redirect: "error",
      cache: "no-store",
      signal: controller.signal,
    });

    if (
      response.redirected ||
      (response.url && response.url !== url) ||
      response.status !== expectedStatus
    ) {
      throw createRequestError("ResponseValidationError", "The API returned an unexpected response.");
    }

    const data = await readBoundedJson(response);
    validateJsonData(url, response.status, data);
    return {
      status: response.status,
      ok: response.ok,
      data,
    };
  } catch (error) {
    if (timedOut) {
      throw createRequestError("TimeoutError", "The API request exceeded the 3-second limit.");
    }
    if (signal?.aborted) {
      throw createRequestError("AbortError", "The API request was cancelled.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abortFromCaller);
  }
}
