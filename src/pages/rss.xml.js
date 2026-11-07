import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context) {
    const posts = await getCollection('posts')
    return rss({
        title: 'tiagovla.github.io',
        description: "Feed of tiagovla.github.io's posts",
        site: context.site,
        items: posts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.date,
            description: post.data.description,
            link: `/posts/${post.id}/`,
        })),
    })
}
