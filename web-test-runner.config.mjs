#!/usr/bin/env node
import path from 'node:path';
import { defaultReporter } from '@web/test-runner';
import { ROOT, PACKAGES_ROOT } from './scripts/helpers/esm.mjs';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { Buffer } from 'node:buffer';

// Workaround for issue UTF-8 wide characters are unsupported
// from https://github.com/modernweb-dev/web/issues/1888
export const pluginJsBufferToString = {
  name: "plugin-js-buffer-to-string",
  transform(context) {
    if (context.response.is("js") && Buffer.isBuffer(context.body)) {
        context.body = context.body.toString();
    }
  }
};

export default {
  files: [path.join(PACKAGES_ROOT , '*/__test__/**/*.test.js')],
  nodeResolve: true,
  preserveSymlinks: true,
  testFramework: {
    config: { timeout: 5000 }, // Mocha timeout 5 seconds
  },
  staticLogging: process.env.CI ? true : false,
  coverage: true,
  concurrency: 1, // Prevent unstable test e.g. ef-overlay and focusing
  coverageConfig: {
    report: true,
    reportDir: 'coverage',
    threshold: { statements: 80, branches: 80, functions: 80, lines: 80 },
  },
  reporters: [
    defaultReporter({ reportTestResults: true, reportTestProgress: true })
  ],
  concurrentBrowsers: 3,
  browsers: [
    playwrightLauncher({
      product: 'chromium',
      createBrowserContext: ({browser}) => browser.newContext({ignoreHTTPSErrors: true}),
      launchOptions: {
        headless: true,
        args: ['--incognito', '--allow-insecure-localhost'],
      }
    }),
    playwrightLauncher({
      product: 'firefox',
      createBrowserContext: ({browser}) => browser.newContext({ignoreHTTPSErrors: true}),
      launchOptions: {
        headless: true
      }
    }),
    playwrightLauncher({
      product: 'webkit',
      createBrowserContext: ({browser}) => browser.newContext({ignoreHTTPSErrors: true}),
      launchOptions: {
        headless: true
      }
    }),
  ],

  // in a monorepo you need to set set the root dir to resolve modules
  rootDir: ROOT,
  browserStartTimeout: 600000, // 10 minutes
  testsStartTimeout: 600000, // 10 minutes
  testsFinishTimeout: 600000, // 10 minutes
  plugins: [
    esbuildPlugin({ ts: true }), // Workaround: prevent the issue "Could not import module ..." (randomly)
    pluginJsBufferToString,
  ]
};
