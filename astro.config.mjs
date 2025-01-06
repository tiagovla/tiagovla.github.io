// @ts-check
import { defineConfig } from 'astro/config'

import icon from 'astro-icon'

import tailwind from '@astrojs/tailwind'

import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
    site: 'https://tiagovla.github.io',
    integrations: [icon(), tailwind(), react()],
    markdown: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
        shikiConfig: {
            theme: 'one-dark-pro', // Make sure this is the theme you want
            wrap: true, // Optional: wrap long lines
        },
    },
})
