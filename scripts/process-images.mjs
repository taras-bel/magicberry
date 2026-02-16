import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const inputFilenames = [
  "IMG_20211203_122035.jpg",
  "IMG_20211203_123333.jpg",
  "IMG_20211203_124122.jpg",
  "IMG_20211203_124538.jpg",
  "IMG_20211203_125022.jpg",
  "IMG_20211203_131727.jpg",
];

// Человеческие имена файлов на выходе
const nameMap = {
  "IMG_20211203_122035.jpg": "pumpkin-sticks",
  "IMG_20211203_123333.jpg": "fruit-mix",
  "IMG_20211203_124122.jpg": "golden-berries",
  "IMG_20211203_124538.jpg": "cranberry-heap",
  "IMG_20211203_125022.jpg": "cherry-dried",
  "IMG_20211203_131727.jpg": "cranberry",
};

const projectRoot = process.cwd();
const inputDir = path.resolve(projectRoot, ".."); // родительская папка с IMG_*.jpg
const outDir = path.resolve(projectRoot, "public", "images", "products");
fs.mkdirSync(outDir, { recursive: true });

// Пастельная тонировка под бренд
const pastel = { saturation: 0.88, brightness: 1.06, hue: 0 }; // мягче и светлее

async function processOne(filename) {
  const inPath = path.resolve(inputDir, filename);
  const base = nameMap[filename] || path.parse(filename).name.toLowerCase();

  const pipeline = sharp(inPath)
    .rotate()
    .flatten({ background: "#ffffff" }) // белая подложка
    .modulate(pastel) // мягкая пастель
    .gamma(1.0)
    .sharpen(0.5);

  // Размеры и форматы
  const sizes = [1600, 1200, 800];
  await Promise.all(
    sizes.flatMap((w) => [
      pipeline
        .clone()
        .resize({ width: w, height: Math.round((w * 3) / 4), fit: "cover", position: "entropy" })
        .webp({ quality: 82 })
        .toFile(path.join(outDir, `${base}-${w}.webp`)),
      pipeline
        .clone()
        .resize({ width: w, height: Math.round((w * 3) / 4), fit: "cover", position: "entropy" })
        .avif({ quality: 45 })
        .toFile(path.join(outDir, `${base}-${w}.avif`)),
    ])
  );

  // Маленький плейсхолдер
  await pipeline
    .clone()
    .resize({ width: 24 })
    .jpeg({ quality: 40, progressive: false })
    .toFile(path.join(outDir, `${base}-placeholder.jpg`));
}

async function main() {
  for (const f of inputFilenames) {
    try {
      await processOne(f);
      console.log("Processed:", f);
    } catch (e) {
      console.error("Failed:", f, e.message);
    }
  }
  console.log("Done. Output dir:", outDir);
}

main();


