"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const sourceDir = path.join(root, "assets", "source-prosthetics");
const outputDir = path.join(root, "assets", "sprites", "prosthetics");

const prosthetics = [
  "red_arm",
  "blue_arm",
  "white_arm",
  "red_leg",
  "blue_leg",
  "white_leg"
];

const versions = ["icon", "1", "3", "6", "9"];

function colorDistance(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function isBackgroundPixel(data, index, bgSamples) {
  const r = data[index];
  const g = data[index + 1];
  const b = data[index + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max - min;
  const closeToEdge = bgSamples.some(sample => colorDistance([r, g, b], sample) < 46);
  const nearFlatDark = max < 34 && sat < 22;
  return closeToEdge || nearFlatDark;
}

function edgeBackgroundMask(data, width, height, bgSamples) {
  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = [];

  function enqueue(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const pixel = y * width + x;
    if (visited[pixel]) return;
    const index = pixel * 4;
    if (!isBackgroundPixel(data, index, bgSamples)) return;
    visited[pixel] = 1;
    queue.push(pixel);
  }

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  for (let i = 0; i < queue.length; i += 1) {
    const pixel = queue[i];
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    enqueue(x + 1, y);
    enqueue(x - 1, y);
    enqueue(x, y + 1);
    enqueue(x, y - 1);
  }

  return visited;
}

function cropToContent(data, width, height, margin = 8) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 12) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < minX || maxY < minY) return { left: 0, top: 0, width, height };
  minX = Math.max(0, minX - margin);
  minY = Math.max(0, minY - margin);
  maxX = Math.min(width - 1, maxX + margin);
  maxY = Math.min(height - 1, maxY + margin);
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

function keepLargestAlphaComponent(data, width, height) {
  const total = width * height;
  const visited = new Uint8Array(total);
  const components = [];
  const queue = [];

  function isOpaque(pixel) {
    return data[pixel * 4 + 3] > 12;
  }

  for (let start = 0; start < total; start += 1) {
    if (visited[start] || !isOpaque(start)) continue;
    const pixels = [];
    visited[start] = 1;
    queue.length = 0;
    queue.push(start);

    for (let i = 0; i < queue.length; i += 1) {
      const pixel = queue[i];
      pixels.push(pixel);
      const x = pixel % width;
      const y = Math.floor(pixel / width);
      const neighbors = [pixel - 1, pixel + 1, pixel - width, pixel + width];
      for (const next of neighbors) {
        if (next < 0 || next >= total || visited[next] || !isOpaque(next)) continue;
        const nx = next % width;
        const ny = Math.floor(next / width);
        if (Math.abs(nx - x) + Math.abs(ny - y) !== 1) continue;
        visited[next] = 1;
        queue.push(next);
      }
    }

    components.push(pixels);
  }

  if (components.length <= 1) return;
  components.sort((a, b) => b.length - a.length);
  const keep = new Uint8Array(total);
  for (const pixel of components[0]) keep[pixel] = 1;

  for (let pixel = 0; pixel < total; pixel += 1) {
    if (!keep[pixel]) data[pixel * 4 + 3] = 0;
  }
}

function applyForegroundGlowMask(data, width, height) {
  let mask = new Uint8Array(width * height);
  for (let pixel = 0; pixel < mask.length; pixel += 1) {
    const index = pixel * 4;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max - min;
    if ((sat > 42 && max > 58) || max > 138) mask[pixel] = 1;
  }

  const iterations = Math.max(28, Math.round(Math.max(width, height) * 0.09));
  for (let pass = 0; pass < iterations; pass += 1) {
    const next = new Uint8Array(mask);
    for (let pixel = 0; pixel < mask.length; pixel += 1) {
      if (!mask[pixel]) continue;
      const x = pixel % width;
      const y = Math.floor(pixel / width);
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
          next[ny * width + nx] = 1;
        }
      }
    }
    mask = next;
  }

  for (let pixel = 0; pixel < mask.length; pixel += 1) {
    if (!mask[pixel]) data[pixel * 4 + 3] = 0;
  }
}

function applyGreenScreenAlpha(data) {
  for (let index = 0; index < data.length; index += 4) {
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const strongGreen = g > 118 && g > r + 48 && g > b + 32;
    const softGreenEdge = g > 88 && g > r * 1.28 && g > b * 1.18;
    if (strongGreen || softGreenEdge) {
      data[index + 3] = 0;
    }
  }
}

function edgeSamples(data, width, height) {
  const coords = [
    [0, 0],
    [Math.floor(width / 2), 0],
    [width - 1, 0],
    [0, Math.floor(height / 2)],
    [width - 1, Math.floor(height / 2)],
    [0, height - 1],
    [Math.floor(width / 2), height - 1],
    [width - 1, height - 1]
  ];
  return coords.map(([x, y]) => {
    const index = (y * width + x) * 4;
    return [data[index], data[index + 1], data[index + 2]];
  });
}

async function extractCell(source, id, version, left, top, width, height) {
  const { data, info } = await sharp(source)
    .extract({ left, top, width, height })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  applyGreenScreenAlpha(data);
  keepLargestAlphaComponent(data, info.width, info.height);

  const content = cropToContent(data, info.width, info.height);
  const target = path.join(outputDir, `${id}-${version}.png`);
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extract(content)
    .png()
    .toFile(target);

  const metadata = await sharp(target).metadata();
  return { file: path.relative(path.join(root, "assets", "sprites"), target).replaceAll("\\", "/"), w: metadata.width, h: metadata.height };
}

async function extractProsthetic(id) {
  const source = path.join(sourceDir, `${id}.png`);
  const metadata = await sharp(source).metadata();
  const cellWidth = Math.floor(metadata.width / versions.length);
  const verticalPad = Math.floor(metadata.height * 0.06);
  const cellHeight = metadata.height - verticalPad * 2;
  const results = {};

  for (let i = 0; i < versions.length; i += 1) {
    const left = Math.max(0, Math.floor(i * metadata.width / versions.length));
    const right = i === versions.length - 1 ? metadata.width : Math.floor((i + 1) * metadata.width / versions.length);
    const inset = Math.max(8, Math.floor(cellWidth * 0.035));
    const extractLeft = Math.min(metadata.width - 1, left + inset);
    const extractRight = Math.max(extractLeft + 1, right - inset);
    const version = versions[i];
    results[version] = await extractCell(
      source,
      id,
      version,
      extractLeft,
      verticalPad,
      extractRight - extractLeft,
      cellHeight
    );
  }

  fs.copyFileSync(path.join(outputDir, `${id}-icon.png`), path.join(outputDir, `${id}-shop.png`));
  return results;
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const manifest = {};
  for (const id of prosthetics) {
    manifest[id] = await extractProsthetic(id);
  }
  fs.writeFileSync(path.join(outputDir, "individual-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Extracted ${prosthetics.length * versions.length} individual prosthetic sprites.`);
})();
