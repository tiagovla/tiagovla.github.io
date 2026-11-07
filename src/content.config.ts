// Import the glob loader
import { glob, file } from 'astro/loaders'
import { dbLoader } from './utils/custom_loader.ts'

import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'

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

const publications = defineCollection({
    loader: file('./src/data/publications.json'),
    schema: z.object({
        title: z.string(),
        authors: z.string(),
        venue: z.string(),
        year: z.number().int(),
    }),
})

const posts = defineCollection({
    loader: dbLoader({
        hostname: import.meta.env.COUCHDB_HOST,
        name: import.meta.env.DB_NAME,
        username: import.meta.env.COUCHDB_USER,
        password: import.meta.env.COUCHDB_PASSWORD,
    }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        date: z.date(),
    }),
})

export const collections = { blog, projects, publications, posts }
