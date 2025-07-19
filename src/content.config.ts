// Import the glob loader
import { glob, file } from 'astro/loaders'
import { dbLoader } from './utils/custom_loader.ts'



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

const posts = defineCollection({
    loader: dbLoader({
        hostname: process.env.COUCHDB_HOST!,
        name: process.env.DB_NAME!,
        username: process.env.COUCHDB_USER!,
        password: process.env.COUCHDB_PASSWORD!,
    }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        tags: z.array(z.string()),
        date: z.date(),
    }),
});


export const collections = { blog, projects, posts }
