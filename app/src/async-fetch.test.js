import { describe, expect, it, vi } from "vitest";
import {
  ASYNC_API_ENDPOINTS,
  ASYNC_FETCH_LIMITS,
  fetchApprovedApiResponse,
} from "./async-fetch.js";

const validTask = {
  userId: 1,
  id: 1,
  title: "delectus aut autem",
  completed: false,
};

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...headers,
    },
  });
}

describe("approved async API bridge", () => {
  it("requests only the fixed GET endpoint without credentials or redirects", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(validTask));

    await expect(fetchApprovedApiResponse(ASYNC_API_ENDPOINTS.todo, { fetchImpl })).resolves.toEqual({
      status: 200,
      ok: true,
      data: validTask,
    });
    expect(fetchImpl).toHaveBeenCalledWith(
      ASYNC_API_ENDPOINTS.todo,
      expect.objectContaining({
        method: "GET",
        credentials: "omit",
        redirect: "error",
        mode: "cors",
      }),
    );
  });

  it("rejects learner-supplied destinations before issuing a request", async () => {
    const fetchImpl = vi.fn();

    await expect(fetchApprovedApiResponse("https://example.com/data.json", { fetchImpl }))
      .rejects.toMatchObject({ name: "TypeError" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("returns the approved JSON 404 as an HTTP response rather than a network error", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({}, 404));

    await expect(fetchApprovedApiResponse(ASYNC_API_ENDPOINTS.missingTodo, { fetchImpl }))
      .resolves.toEqual({ status: 404, ok: false, data: {} });
  });

  it("rejects unexpected schemas and non-JSON responses", async () => {
    await expect(fetchApprovedApiResponse(ASYNC_API_ENDPOINTS.todo, {
      fetchImpl: vi.fn().mockResolvedValue(jsonResponse({ id: 1, title: "wrong shape" })),
    })).rejects.toMatchObject({ name: "ResponseValidationError" });

    await expect(fetchApprovedApiResponse(ASYNC_API_ENDPOINTS.todo, {
      fetchImpl: vi.fn().mockResolvedValue(new Response("<html></html>", {
        status: 200,
        headers: { "content-type": "text/html" },
      })),
    })).rejects.toMatchObject({ name: "ResponseValidationError" });
  });

  it("rejects oversized declared and streamed response bodies", async () => {
    await expect(fetchApprovedApiResponse(ASYNC_API_ENDPOINTS.todo, {
      fetchImpl: vi.fn().mockResolvedValue(jsonResponse(validTask, 200, {
        "content-length": String(ASYNC_FETCH_LIMITS.MAX_RESPONSE_BYTES + 1),
      })),
    })).rejects.toMatchObject({ name: "ResponseTooLargeError" });

    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(ASYNC_FETCH_LIMITS.MAX_RESPONSE_BYTES + 1));
        controller.close();
      },
    });
    await expect(fetchApprovedApiResponse(ASYNC_API_ENDPOINTS.todo, {
      fetchImpl: vi.fn().mockResolvedValue(new Response(body, {
        status: 200,
        headers: { "content-type": "application/json" },
      })),
    })).rejects.toMatchObject({ name: "ResponseTooLargeError" });
  });

  it("distinguishes request timeout from caller cancellation", async () => {
    const slowFetch = vi.fn((_, { signal }) => new Promise((resolve, reject) => {
      signal.addEventListener("abort", () => {
        reject(new DOMException("Aborted", "AbortError"));
      }, { once: true });
    }));

    await expect(fetchApprovedApiResponse(ASYNC_API_ENDPOINTS.todo, {
      fetchImpl: slowFetch,
      timeoutMs: 5,
    })).rejects.toMatchObject({ name: "TimeoutError" });

    const controller = new AbortController();
    const pending = fetchApprovedApiResponse(ASYNC_API_ENDPOINTS.todo, {
      fetchImpl: slowFetch,
      signal: controller.signal,
    });
    controller.abort();
    await expect(pending).rejects.toMatchObject({ name: "AbortError" });
  });

  it("rejects redirects and external-service failures explicitly", async () => {
    await expect(fetchApprovedApiResponse(ASYNC_API_ENDPOINTS.todo, {
      fetchImpl: vi.fn().mockResolvedValue({
        redirected: true,
        url: "https://jsonplaceholder.typicode.com/todos/2",
        status: 200,
      }),
    })).rejects.toMatchObject({ name: "ResponseValidationError" });

    await expect(fetchApprovedApiResponse(ASYNC_API_ENDPOINTS.todo, {
      fetchImpl: vi.fn().mockRejectedValue(new TypeError("Network unavailable")),
    })).rejects.toThrow("Network unavailable");
  });
});
