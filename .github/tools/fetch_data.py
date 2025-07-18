import http.client
import urllib.parse
import base64
import json
import os
import shutil
import sys

# --- Configuration from environment ---
COUCHDB_HOST = os.getenv("COUCHDB_HOST")
DB_NAME = os.getenv("DB_NAME")
COUCHDB_USER = os.getenv("COUCHDB_USER")
COUCHDB_PASSWORD = os.getenv("COUCHDB_PASSWORD")
OUTPUT_DIR = os.getenv("OUTPUT_DIR", "src/data/blog")

# Validate required env vars
missing = [
    var
    for var in ["COUCHDB_HOST", "DB_NAME", "COUCHDB_USER", "COUCHDB_PASSWORD"]
    if not os.getenv(var)
]
if missing:
    sys.exit(f"❌ Missing environment variables: {', '.join(missing)}")

AUTH_HEADER = (
    "Basic " + base64.b64encode(f"{COUCHDB_USER}:{COUCHDB_PASSWORD}".encode()).decode()
)

# --- Functions ---


def http_get(path, params=None):
    if params:
        query = urllib.parse.urlencode(params)
        full_path = f"{path}?{query}"
    else:
        full_path = path

    conn = http.client.HTTPConnection(COUCHDB_HOST)
    headers = {
        "Authorization": AUTH_HEADER,
        "Accept": "application/json",
    }
    conn.request("GET", full_path, headers=headers)
    response = conn.getresponse()
    data = response.read().decode()
    conn.close()

    if response.status != 200:
        raise Exception(
            f"HTTP GET {full_path} failed: {response.status} {response.reason} - {data}"
        )

    return json.loads(data)


def fetch_doc(doc_id):
    encoded_id = urllib.parse.quote(doc_id, safe="")
    path = f"/{DB_NAME}/{encoded_id}"
    return http_get(path)


def get_all_doc_ids():
    path = f"/{DB_NAME}/_all_docs"
    resp = http_get(path, params={"include_docs": "false"})
    rows = resp.get("rows", [])
    return [
        row["id"]
        for row in rows
        if row["id"].startswith("website/") and row["id"].endswith(".md")
    ]


def get_full_markdown(doc_id):
    meta = fetch_doc(doc_id)
    if meta.get("deleted", False):
        return None

    children = meta.get("children", [])
    contents = []

    for child_id in children:
        block = fetch_doc(child_id)
        contents.append(block.get("data", ""))

    return "".join(contents)


def save_markdown(doc_id, content):
    if doc_id.startswith("website/"):
        rel_path = doc_id[len("website/") :]
    else:
        rel_path = doc_id
    full_path = os.path.join(OUTPUT_DIR, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)

    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"✅ Saved: {full_path}")


def clear_output_dir():
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR, exist_ok=True)


# --- Main ---

if __name__ == "__main__":
    try:
        clear_output_dir()
        doc_ids = get_all_doc_ids()

        for doc_id in doc_ids:
            try:
                content = get_full_markdown(doc_id)
                if content:
                    save_markdown(doc_id, content)
            except Exception as e:
                print(f"⚠️ Failed to process {doc_id}: {e}")

        print("🎉 All markdown files exported.")
    except Exception as e:
        print(f"❌ Error: {e}")
