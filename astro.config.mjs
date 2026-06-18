import { defineConfig } from 'astro/config';
import { sessionDrivers } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  site: 'https://yayasanalhidayah.com',
  // Static brochure site — no sessions used. Pin a no-op session driver so the
  // Cloudflare adapter stops auto-provisioning a "SESSION" KV namespace on every
  // deploy (which fails with code 10014 once the namespace already exists).
  session: {
    driver: sessionDrivers.null(),
  },
  build: {
    inlineStylesheets: 'always',
  },
});
