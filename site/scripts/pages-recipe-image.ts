type ImageEntry = { key: string; bytes: number };
type RecipeImageMap = Readonly<Record<string, ImageEntry>>;
type ImageObject = {
  size: number;
  httpEtag: string;
  httpMetadata?: { contentType?: string };
  body?: BodyInit | null;
};
type ImageBucket = {
  head(key: string): Promise<ImageObject | null>;
  get(key: string): Promise<ImageObject | null>;
};

const staticRequestHeaders = [
  "range", "if-match", "if-none-match", "if-modified-since", "if-unmodified-since", "if-range",
];

export async function serveRecipeImage(
  request: Request,
  manifest: RecipeImageMap,
  bucket: ImageBucket | undefined,
  fallback: () => Promise<Response>,
  revision: string,
  preview = false,
): Promise<Response> {
  if (!bucket || (request.method !== "GET" && request.method !== "HEAD") ||
      staticRequestHeaders.some(header => request.headers.has(header))) {
    return fallback();
  }

  const path = new URL(request.url).pathname;
  if (!Object.hasOwn(manifest, path)) return fallback();
  const image = manifest[path];
  const head = request.method === "HEAD";
  let object: ImageObject | null;
  try {
    object = head ? await bucket.head(image.key) : await bucket.get(image.key);
  } catch {
    return fallback();
  }
  if (!object || object.size !== image.bytes || object.httpMetadata?.contentType !== "image/webp" ||
      !object.httpEtag || (!head && !object.body)) {
    return fallback();
  }

  return new Response(head ? null : object.body, {
    headers: {
      "Content-Type": "image/webp",
      "Content-Length": String(image.bytes),
      "Cache-Control": "public, max-age=600",
      "ETag": object.httpEtag,
      "X-Content-Type-Options": "nosniff",
      "X-Recipavo-Commit": revision,
      ...(preview ? { "X-Recipavo-Image-Source": "r2", "X-Robots-Tag": "noindex, nofollow" } : {}),
    },
  });
}
