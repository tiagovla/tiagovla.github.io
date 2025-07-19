import type { Loader } from 'astro/loaders';
import matter from 'gray-matter';
import path from "path";

// Types
export interface StringDictionary {
    [key: string]: string;
}

type Doc = {
    _id: string;
    children?: string[];
    data?: string[];
};

type Row = {
    id: string;
    key: string;
    value: any;
    doc: Doc;
};

// Helpers
function getAuthHeader(username: string, password: string) {
    const credentials = btoa(`${username}:${password}`);
    return {
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`,
    };
}

async function fetchDocs(hostname: string, db: string, headers: any, childIds: string[]) {
    const res = await fetch(`https://${hostname}/${db}/_all_docs?include_docs=true`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ keys: childIds }),
    });

    const { rows }: { rows: Row[] } = await res.json();
    return Object.fromEntries(rows.map(row => [row.id, row.doc]));
}

export async function loadFromCouchDB(
    hostname: string,
    db: string,
    username: string,
    password: string
) {
    const headers = getAuthHeader(username, password);

    // Fetch top-level docs
    const mainRes = await fetch(`https://${hostname}/${db}/_find`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            selector: {
                _id: { $gte: 'website/' },
                deleted: { $exists: false },
            },
        }),
    });

    const { docs }: { docs: Doc[] } = await mainRes.json();
    const childIds = docs.flatMap(doc => doc.children || []);
    const childMap = await fetchDocs(hostname, db, headers, childIds);

    return docs.map(doc => {
        const childContent = (doc.children || [])
            .map(id => childMap[id]?.data)
            .filter(Boolean)
            .flat()
            .join('');

        return {
            ...doc,
            body: childContent,
        };
    });
}

// Astro loader
export function dbLoader(settings: StringDictionary): Loader {
    return {
        name: 'couchdb_fetcher',
        async load({ renderMarkdown, store, generateDigest, parseData }) {
            store.clear();
            const entries = await loadFromCouchDB(
                settings.hostname,
                settings.name,
                settings.username,
                settings.password
            );

            for (const entry of entries) {
                const digest = generateDigest(entry);
                const { data, content } = matter(entry.body);
                const rendered = await renderMarkdown(content);
                const id = path.parse(entry._id).name;

                const entry_data = await parseData(
                    {
                        id: id,
                        data: data,
                    }
                );

                store.set({
                    id,
                    data: entry_data,
                    body: content,
                    digest,
                    rendered,
                });
            }
        },
    };
}
