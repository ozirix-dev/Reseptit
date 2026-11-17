import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import { relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const destination = process.env.RECIPAVO_GK_READ_TRACE;
if (destination) {
  const root = resolve(import.meta.dirname, "../..");
  const files = new Set();
  function observe(file) {
    const filename = file instanceof URL ? fileURLToPath(file) : file;
    if (typeof filename !== "string") return;
    const path = relative(root, resolve(filename)).split(sep).join("/");
    if (/^docs\/(?:nutrition|research)\//.test(path)) files.add(path);
  }

  const readFileSync = fs.readFileSync;
  fs.readFileSync = function(file, ...options) {
    const data = readFileSync.call(this, file, ...options);
    observe(file);
    return data;
  };
  const readFile = fs.promises.readFile;
  fs.promises.readFile = async function(file, ...options) {
    const data = await readFile.call(this, file, ...options);
    observe(file);
    return data;
  };
  syncBuiltinESMExports();
  process.on("exit", () => fs.writeFileSync(destination, JSON.stringify([...files].sort())));
}
