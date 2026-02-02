import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';

// Force production mode for builds
if (process.env.NODE_ENV === 'production') {
  process.env.NODE_ENV = 'production';
}

const isProd = process.env.NODE_ENV === 'production';

const config = defineConfig({
  mode: isProd ? 'production' : 'development',
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
    minify: isProd ? 'esbuild' : false,
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    allowedHosts: [
      'openwearables.ekygai.com',
      'localhost',
      '127.0.0.1',
      '.ekygai.com',
    ],
  },
  plugins: [
    // IMPORTANT: tanstackStart MUST be before viteReact
    // Only include devtools in development
    !isProd && devtools(),
    tanstackStart({
      router: {
        generatedRouteTree: 'src/routeTree.gen.ts',
        autoCodeSplitting: true,
      },
    }),
    viteReact({
      jsxRuntime: 'automatic',
    }),
    nitro({
      // Nitro server configuration for production SSR
      devServer: {
        host: '0.0.0.0',
        port: 3000,
      },
      // Runtime config accessible via useRuntimeConfig()
      runtimeConfig: {
        apiUrl: process.env.VITE_API_URL || 'http://localhost:8000',
      },
    }),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
  ].filter(Boolean),
});

export default config;
