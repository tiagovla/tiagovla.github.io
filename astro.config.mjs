import { defineConfig } from 'astro/config'

import sitemap from '@astrojs/sitemap'

export default defineConfig({
    site: 'https://tiagovla.github.io',
    markdown: {
        shikiConfig: {
            themes: {
                light: 'one-light',
                dark: 'material-theme-palenight',
            },
        },
    },

    integrations: [sitemap()],
})
