import { defineConfig } from 'astro/config'

import sitemap from '@astrojs/sitemap'

export default defineConfig({
    site: 'https://tiagovla.github.io',
    markdown: {
        shikiConfig: {
            theme: 'github-light',
        },
    },

    integrations: [sitemap()],
})
