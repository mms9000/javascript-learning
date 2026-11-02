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

  it("configures Cloudflare Pages headers for the app and both emitted Workers", () => {
    const headers = readFileSync("public/_headers", "utf8").replaceAll("\r\n", "\n");
    const appPolicy = viteConfig.preview.headers["Content-Security-Policy"];
    const workerPolicy = "default-src 'none'; script-src 'self' 'unsafe-eval'; worker-src 'none'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'; frame-ancestors 'none'";

    expect(headers).toContain("/*\n  X-Content-Type-Options: nosniff");
    expect(headers).toContain("Referrer-Policy: no-referrer");
    expect(headers).toContain("Permissions-Policy: accelerometer=(), camera=(), geolocation=(), microphone=(), payment=(), usb=()");
    expect(headers).toContain(`/\n  Content-Security-Policy: ${appPolicy}`);
    expect(headers).toContain(`/index.html\n  Content-Security-Policy: ${appPolicy}`);
    expect(headers).toContain(`/assets/dom-worker-*\n  Content-Security-Policy: ${workerPolicy}`);
    expect(headers).toContain(`/assets/async-worker-*\n  Content-Security-Policy: ${workerPolicy}`);
  });

  it("limits the Vite development CSP to the approved API and HMR WebSockets", () => {
    const developmentCsp = viteConfig.server.headers["Content-Security-Policy"];
    expect(developmentCsp).toContain("connect-src 'self' ws: https://jsonplaceholder.typicode.com");
    expect(developmentCsp.match(/https:\/\//g)).toHaveLength(1);
  });
});
