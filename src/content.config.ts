// Import the glob loader
import { glob, file } from 'astro/loaders'

import { z, defineCollection } from 'astro:content'

const blog = defineCollection({
    loader: glob({ pattern: '*.md', base: './src/data/blog' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        date: z.date(),
    }),
})

const projects = defineCollection({
    loader: file('./src/data/projects.json'),
    schema: z.object({
        name: z.string(),
        description: z.string(),
        url: z.string(),
    }),
})

export const collections = { blog, projects }
