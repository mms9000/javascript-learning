import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import viteConfig from "../vite.config.js";

describe("application and Worker response security policies", () => {
  it("uses a restrictive application meta policy for required local resources", () => {
    const html = readFileSync("index.html", "utf8");
    const policy = html.match(/http-equiv="Content-Security-Policy"\s+content="([^"]+)"/)?.[1];

    expect(policy).toContain("default-src 'none'");
    expect(policy).toContain("script-src 'self' 'unsafe-eval'");
    expect(policy).toContain("worker-src 'self' blob:");
    expect(policy).toContain("style-src 'self' 'unsafe-inline'");
    expect(policy).toContain("connect-src 'self' ws: https://jsonplaceholder.typicode.com");
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("base-uri 'none'");
    expect(policy).toContain("form-action 'none'");
    expect(policy).toContain("frame-src 'none'");
    expect(policy).not.toContain("http:");
    expect(policy).not.toContain("frame-ancestors");
  });

  it("applies production-like app and restricted DOM and async Worker headers", () => {
    const productionCsp = viteConfig.preview.headers["Content-Security-Policy"];
    expect(productionCsp).toContain("connect-src 'self' https://jsonplaceholder.typicode.com");
    expect(productionCsp).not.toContain("ws:");
    expect(productionCsp).toContain("frame-ancestors 'none'");
    expect(viteConfig.preview.headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(viteConfig.preview.headers["Referrer-Policy"]).toBe("no-referrer");

    for (const hookName of ["configureServer", "configurePreviewServer"]) {
      let middleware;
      viteConfig.plugins[0][hookName]({
        middlewares: {
          use: (handler) => {
            middleware = handler;
          },
        },
      });

      for (const url of [
        "/src/dom-worker.js?worker_file&type=module",
        "/src/async-worker.js?worker_file&type=module",
        "/assets/dom-worker-AbC123.js",
        "/assets/async-worker-AbC123.js",
      ]) {
        const setHeader = vi.fn();
        const response = { setHeader, writeHead: vi.fn() };
        middleware({ url }, response, vi.fn());
        response.writeHead(200);

        const workerCsp = setHeader.mock.calls[0][1];
        expect(setHeader).toHaveBeenCalledWith("Content-Security-Policy", workerCsp);
        expect(workerCsp).toContain("script-src 'self' 'unsafe-eval'");
        expect(workerCsp).toContain("worker-src 'none'");
        expect(workerCsp).toContain("connect-src 'none'");
      }

      const unrelatedSetHeader = vi.fn();
      middleware(
        { url: "/assets/app-AbC123.js" },
        { setHeader: unrelatedSetHeader, writeHead: vi.fn() },
        vi.fn(),
      );
      expect(unrelatedSetHeader).not.toHaveBeenCalled();
    }
  });

  it("limits the Vite development CSP to the approved API and HMR WebSockets", () => {
    const developmentCsp = viteConfig.server.headers["Content-Security-Policy"];
    expect(developmentCsp).toContain("connect-src 'self' ws: https://jsonplaceholder.typicode.com");
    expect(developmentCsp.match(/https:\/\//g)).toHaveLength(1);
  });
});
