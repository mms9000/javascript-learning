import { defineConfig } from "vite";

const approvedApiOrigin = "https://jsonplaceholder.typicode.com";

function appContentSecurityPolicy(connectSources) {
  return [
    "default-src 'none'",
    "script-src 'self' 'unsafe-eval'",
    "worker-src 'self' blob:",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    `connect-src ${connectSources}`,
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
  ].join("; ");
}

const restrictedWorkerContentSecurityPolicy = [
  "default-src 'none'",
  "script-src 'self' 'unsafe-eval'",
  "worker-src 'none'",
  "connect-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
].join("; ");

const sharedSecurityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "accelerometer=(), camera=(), geolocation=(), microphone=(), payment=(), usb=()",
};

function isRestrictedWorkerRequest(url) {
  const fileName = new URL(url, "http://localhost").pathname.split("/").pop();
  return /^(?:dom|async)-worker(?:-[\w-]+)?\.js$/.test(fileName);
}

function setRestrictedWorkerHeaders(server) {
  server.middlewares.use((request, response, next) => {
    if (request.url && isRestrictedWorkerRequest(request.url)) {
      const writeHead = response.writeHead;
      response.writeHead = function (...args) {
        this.setHeader("Content-Security-Policy", restrictedWorkerContentSecurityPolicy);
        return writeHead.apply(this, args);
      };
    }
    next();
  });
}

export default defineConfig({
  server: {
    headers: {
      ...sharedSecurityHeaders,
      "Content-Security-Policy": appContentSecurityPolicy(`'self' ws: ${approvedApiOrigin}`),
    },
  },
  preview: {
    headers: {
      ...sharedSecurityHeaders,
      "Content-Security-Policy": appContentSecurityPolicy(`'self' ${approvedApiOrigin}`),
    },
  },
  plugins: [{
    name: "restricted-exercise-worker-security-headers",
    configureServer: setRestrictedWorkerHeaders,
    configurePreviewServer: setRestrictedWorkerHeaders,
  }],
  // Vitest configuration lives here alongside Vite config
  test: {
    // Run tests in jsdom so browser APIs are available in unit tests
    environment: "jsdom",
    // Show verbose output for each test
    reporter: "verbose",
    // Global setup for browser mocks (ResizeObserver, etc.)
    setupFiles: ["src/test-setup.js"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
    // Collect coverage from src files (opt-in with --coverage flag)
    coverage: {
      include: ["src/**/*.js"],
      exclude: ["src/**/*.test.js"],
    },
  },
});
