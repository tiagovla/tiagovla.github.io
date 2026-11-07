import { defineConfig } from 'astro/config'

import sitemap from '@astrojs/sitemap'

export default defineConfig({
    site: 'https://tiagovla.github.io',
    compressHTML: true,
    markdown: {
        shikiConfig: {
            theme: 'css-variables',
            wrap: false,
        },
    },

    integrations: [sitemap()],
})
