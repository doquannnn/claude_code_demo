const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: { baseURL: 'http://localhost:3013', headless: true },
  webServer: {
    command: 'python3 -m http.server 3013',
    url: 'http://localhost:3013',
    reuseExistingServer: false,
    timeout: 10000,
    cwd: '/Users/admin/Desktop/Personal/claude_code_demo/tower-defense',
  },
});
