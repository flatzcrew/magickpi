import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp"
  ],
  "framework": "@storybook/react-vite",
  // Токены и логотип ДС — для интерфейса Storybook (manager-head.html, manager.ts)
  "staticDirs": [
    { "from": "../src/tokens", "to": "/ds/tokens" },
    { "from": "../src/assets/logomark-kpi", "to": "/ds/logo" }
  ]
};
export default config;