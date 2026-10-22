import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

// Absolute production URLs must resolve to this build, including route JSON and
// JS navigation. Otherwise tests could silently pass using old deployed images.
export async function localImageServer(root: string, port = 0) {
  root = path.resolve(root);
  let base = "";
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url!, "http://localhost");
      if (!url.pathname.startsWith("/Reseptit/")) throw Error("outside project path");
      const relative = decodeURIComponent(url.pathname.slice("/Reseptit/".length));
      let file = path.resolve(root, relative);
      if (file !== root && !file.startsWith(root + path.sep)) throw Error("outside build");
      if (url.pathname.endsWith("/")) file = path.join(file, "index.html");
      let bytes = await readFile(file);
      const ext = path.extname(file);
      if ([".html", ".js", ".json"].includes(ext)) bytes = Buffer.from(bytes.toString().replaceAll("https://ozirix-dev.github.io/Reseptit", base));
      const types: Record<string, string> = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".svg": "image/svg+xml", ".xml": "application/xml" };
      res.writeHead(200, { "Content-Type": types[ext] ?? "text/plain", "Content-Encoding": "gzip", "Cache-Control": "public,max-age=600" });
      res.end(gzipSync(bytes));
    } catch { res.writeHead(404); res.end("not found"); }
  });
  await new Promise<void>((resolve, reject) => { server.once("error", reject); server.listen(port, "127.0.0.1", resolve); });
  const address = server.address();
  if (!address || typeof address === "string") throw Error("Missing server address");
  base = `http://127.0.0.1:${address.port}/Reseptit`;
  return { base, close: () => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())) };
}
