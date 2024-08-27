import * as esbuild from "esbuild";
import * as fs from "node:fs";

await esbuild
  .build({
    entryPoints: ["./src/popup.tsx", "./src/background.ts", "./src/content.ts"],
    bundle: true,
    minify: true,
    sourcemap: true,
    outdir: "dist",
  })
  .catch(() => process.exit(1));

const htmlFiles = ["popup"];

for (const htmlFile of htmlFiles) {
  fs.copyFileSync(`public/${htmlFile}.html`, `dist/${htmlFile}.html`);
}

fs.cpSync("src/assets", "dist", { recursive: true });

fs.copyFileSync("public/manifest.json", "dist/manifest.json");
