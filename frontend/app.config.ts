import { defineConfig } from '@tanstack/react-start/config';

export default defineConfig({
  server: {
    preset: 'node-server',
  },
  react: {
    babel: {
      plugins: [], // Force removal of dev plugins in production
    },
  },
});
