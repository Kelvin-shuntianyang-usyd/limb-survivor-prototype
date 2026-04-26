"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const source = path.join(root, "assets", "neon-cyberpunk-asset-board.png");
const outputDir = path.join(root, "assets", "sprites");

const sprites = [
  ["player", "characters/player.png", 18, 18, 158, 558, 4],
  ["player_mini", "characters/player-mini.png", 44, 598, 120, 150, 4],
  ["head", "ui/head-upgrade.png", 24, 18, 128, 140, 2],
  ["slot", "ui/limb-slot-key.png", 1380, 888, 150, 126, 2],

  ["enemy_chaser", "enemies/chaser.png", 1028, 12, 126, 198, 4],
  ["enemy_shooter", "enemies/shooter.png", 1138, 18, 146, 190, 4],
  ["enemy_sprinter", "enemies/sprinter.png", 1268, 66, 140, 142, 4],
  ["enemy_orderly", "enemies/orderly.png", 1394, 14, 132, 198, 4],
  ["boss", "enemies/boss.png", 1028, 226, 500, 518, 4],

  ["red_arm_icon", "prosthetics/red_arm-icon.png", 374, 10, 130, 170, 3],
  ["red_arm_1", "prosthetics/red_arm-1.png", 586, 6, 116, 172, 3],
  ["red_arm_3", "prosthetics/red_arm-3.png", 696, 6, 116, 174, 3],
  ["red_arm_6", "prosthetics/red_arm-6.png", 808, 4, 122, 178, 3],
  ["red_arm_9", "prosthetics/red_arm-9.png", 920, 2, 116, 184, 3],

  ["blue_arm_icon", "prosthetics/blue_arm-icon.png", 374, 174, 132, 164, 3],
  ["blue_arm_1", "prosthetics/blue_arm-1.png", 586, 172, 116, 168, 3],
  ["blue_arm_3", "prosthetics/blue_arm-3.png", 696, 172, 116, 168, 3],
  ["blue_arm_6", "prosthetics/blue_arm-6.png", 806, 170, 124, 174, 3],
  ["blue_arm_9", "prosthetics/blue_arm-9.png", 918, 168, 124, 182, 3],

  ["white_arm_icon", "prosthetics/white_arm-icon.png", 374, 300, 134, 98, 3],
  ["white_arm_1", "prosthetics/white_arm-1.png", 586, 284, 116, 112, 3],
  ["white_arm_3", "prosthetics/white_arm-3.png", 696, 284, 116, 112, 3],
  ["white_arm_6", "prosthetics/white_arm-6.png", 806, 280, 124, 118, 3],
  ["white_arm_9", "prosthetics/white_arm-9.png", 918, 276, 124, 124, 3],

  ["red_leg_icon", "prosthetics/red_leg-icon.png", 374, 408, 126, 144, 3],
  ["red_leg_1", "prosthetics/red_leg-1.png", 586, 404, 108, 150, 3],
  ["red_leg_3", "prosthetics/red_leg-3.png", 696, 404, 110, 152, 3],
  ["red_leg_6", "prosthetics/red_leg-6.png", 808, 400, 116, 158, 3],
  ["red_leg_9", "prosthetics/red_leg-9.png", 920, 394, 120, 166, 3],

  ["blue_leg_icon", "prosthetics/blue_leg-icon.png", 374, 538, 124, 140, 3],
  ["blue_leg_1", "prosthetics/blue_leg-1.png", 586, 528, 108, 154, 3],
  ["blue_leg_3", "prosthetics/blue_leg-3.png", 696, 528, 110, 154, 3],
  ["blue_leg_6", "prosthetics/blue_leg-6.png", 808, 522, 116, 162, 3],
  ["blue_leg_9", "prosthetics/blue_leg-9.png", 920, 516, 124, 170, 3],

  ["white_leg_icon", "prosthetics/white_leg-icon.png", 374, 666, 126, 102, 3],
  ["white_leg_1", "prosthetics/white_leg-1.png", 586, 636, 110, 134, 3],
  ["white_leg_3", "prosthetics/white_leg-3.png", 696, 636, 110, 134, 3],
  ["white_leg_6", "prosthetics/white_leg-6.png", 808, 632, 118, 140, 3],
  ["white_leg_9", "prosthetics/white_leg-9.png", 920, 628, 124, 146, 3]
];

const relicIds = [
  "bone_serum", "mag_spine", "stable_plasma", "combat_chip", "battery_pack",
  "light_frame", "coin_reader", "nano_pouch", "recoil_anchor", "crate_scanner",
  "overclock", "pain_lock", "shop_debt", "volatile_fuel", "neuro_boost",
  "black_interface", "cracked_core", "rejection_drug", "unstable_field", "blood_contract"
];

for (const [index, id] of relicIds.entries()) {
  const col = index % 10;
  const row = Math.floor(index / 10);
  sprites.push([`relic_${id}`, `relics/${id}.png`, 8 + col * 153, 760 + row * 128, 148, 126, 2]);
}

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
  const value = max;
  const closeToPanel = bgSamples.some(sample => colorDistance([r, g, b], sample) < 58);
  const lowChromaPanel = sat < 34 && value < 88;
  const panelLine = sat < 28 && value >= 78 && value < 122;
  return closeToPanel || lowChromaPanel || panelLine;
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

function cropToContent(data, width, height, margin = 2) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 10) {
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

async function extractSprite(name, relativePath, x, y, width, height, margin) {
  const { data, info } = await sharp(source)
    .extract({ left: x, top: y, width, height })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const samples = [
    [data[0], data[1], data[2]],
    [data[(info.width - 1) * 4], data[(info.width - 1) * 4 + 1], data[(info.width - 1) * 4 + 2]],
    [data[((info.height - 1) * info.width) * 4], data[((info.height - 1) * info.width) * 4 + 1], data[((info.height - 1) * info.width) * 4 + 2]],
    [data[(info.height * info.width - 1) * 4], data[(info.height * info.width - 1) * 4 + 1], data[(info.height * info.width - 1) * 4 + 2]]
  ];

  const mask = edgeBackgroundMask(data, info.width, info.height, samples);
  for (let pixel = 0; pixel < mask.length; pixel += 1) {
    if (mask[pixel]) data[pixel * 4 + 3] = 0;
  }

  const content = cropToContent(data, info.width, info.height, margin);
  const target = path.join(outputDir, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });

  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extract({ left: content.left, top: content.top, width: content.width, height: content.height })
    .png()
    .toFile(target);

  return [name, relativePath.replaceAll("\\", "/"), content.width, content.height];
}

(async () => {
  fs.rmSync(outputDir, { recursive: true, force: true });
  const manifest = {};
  for (const sprite of sprites) {
    const [name, file, w, h] = await extractSprite(...sprite);
    manifest[name] = { file, w, h };
  }
  fs.writeFileSync(path.join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Extracted ${Object.keys(manifest).length} transparent sprites.`);
})();
