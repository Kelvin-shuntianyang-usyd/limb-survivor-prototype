"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const sourceDir = path.join(root, "assets", "source-vfx");
const outputDir = path.join(root, "assets", "sprites", "vfx");

const sheets = {
  red: {
    source: "red_furnace.png",
    names: [
      "punch_burst", "ground_crack", "fire_ring", "flame_trail", "stomp_impact",
      "hit_sparks", "saw_halo", "lava_plume", "burn_marker", "resonance_aura"
    ]
  },
  blue: {
    source: "blue_vein.png",
    names: [
      "lightning_chain", "electric_burst", "electric_ring", "blink_trail", "foot_mark",
      "paralyze_marker", "thunder_net", "coil_pulse", "arc_projectile", "resonance_aura"
    ]
  },
  white: {
    source: "white_tower.png",
    names: [
      "needle_trail", "needle_fan", "heal_ring", "shield_pulse", "bullet_disintegrate",
      "surgery_sigil", "bastion_fragment", "sterile_burst", "regen_particles", "resonance_aura"
    ]
  }
};

function applyGreenScreenAlpha(data) {
  for (let index = 0; index < data.length; index += 4) {
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const strongGreen = g > 116 && g > r + 44 && g > b + 28;
    const softGreen = g > 86 && g > r * 1.24 && g > b * 1.14;
    if (strongGreen || softGreen) data[index + 3] = 0;
  }
}

function cropToContent(data, width, height, margin = 10) {
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

async function extractCell(source, family, name, rect) {
  const { data, info } = await sharp(source)
    .extract(rect)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  applyGreenScreenAlpha(data);
  const content = cropToContent(data, info.width, info.height);
  const target = path.join(outputDir, family, `${name}.png`);
  fs.mkdirSync(path.dirname(target), { recursive: true });

  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extract(content)
    .png()
    .toFile(target);

  const metadata = await sharp(target).metadata();
  return {
    file: path.relative(path.join(root, "assets", "sprites"), target).replaceAll("\\", "/"),
    w: metadata.width,
    h: metadata.height
  };
}

async function extractSheet(family, sheet) {
  const source = path.join(sourceDir, sheet.source);
  const metadata = await sharp(source).metadata();
  const cols = 5;
  const rows = 2;
  const cellW = Math.floor(metadata.width / cols);
  const cellH = Math.floor(metadata.height / rows);
  const manifest = {};

  for (let index = 0; index < sheet.names.length; index += 1) {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const left = Math.floor(col * metadata.width / cols);
    const top = Math.floor(row * metadata.height / rows);
    const right = col === cols - 1 ? metadata.width : Math.floor((col + 1) * metadata.width / cols);
    const bottom = row === rows - 1 ? metadata.height : Math.floor((row + 1) * metadata.height / rows);
    const insetX = Math.max(6, Math.floor(cellW * 0.025));
    const insetY = Math.max(6, Math.floor(cellH * 0.025));
    manifest[sheet.names[index]] = await extractCell(source, family, sheet.names[index], {
      left: left + insetX,
      top: top + insetY,
      width: Math.max(1, right - left - insetX * 2),
      height: Math.max(1, bottom - top - insetY * 2)
    });
  }

  return manifest;
}

(async () => {
  fs.rmSync(outputDir, { recursive: true, force: true });
  const manifest = {};
  for (const [family, sheet] of Object.entries(sheets)) {
    manifest[family] = await extractSheet(family, sheet);
  }
  fs.writeFileSync(path.join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Extracted ${Object.values(sheets).reduce((sum, sheet) => sum + sheet.names.length, 0)} VFX sprites.`);
})();
