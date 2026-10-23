import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
  base: './',
  outDir: './standalone',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
