"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const hpText = document.getElementById("hpText");
const hpBar = document.getElementById("hpBar");
const roundText = document.getElementById("roundText");
const timeText = document.getElementById("timeText");
const coinText = document.getElementById("coinText");
const attackText = document.getElementById("attackText");
const slotText = document.getElementById("slotText");
const armText = document.getElementById("armText");
const legText = document.getElementById("legText");
const relicText = document.getElementById("relicText");
const setText = document.getElementById("setText");
const centerBanner = document.getElementById("centerBanner");
const shopButton = document.getElementById("shopButton");
const shopModal = document.getElementById("shopModal");
const shopKicker = document.getElementById("shopKicker");
const shopTitle = document.getElementById("shopTitle");
const shopSummary = document.getElementById("shopSummary");
const shopGrid = document.getElementById("shopGrid");
const nextRoundButton = document.getElementById("nextRoundButton");
const startMenu = document.getElementById("startMenu");
const startButton = document.getElementById("startButton");
const testButton = document.getElementById("testButton");
const helpButton = document.getElementById("helpButton");
const aboutButton = document.getElementById("aboutButton");
const pauseHelpButton = document.getElementById("pauseHelpButton");
const helpModal = document.getElementById("helpModal");
const closeHelpButton = document.getElementById("closeHelpButton");
const aboutModal = document.getElementById("aboutModal");
const closeAboutButton = document.getElementById("closeAboutButton");
const languageToggle = document.getElementById("languageToggle");
const audioToggle = document.getElementById("audioToggle");
const bgmAudio = document.getElementById("bgmAudio");
const testRoundControl = document.getElementById("testRoundControl");
const testRoundInput = document.getElementById("testRoundInput");
const pauseMenu = document.getElementById("pauseMenu");
const resumeButton = document.getElementById("resumeButton");
const exitButton = document.getElementById("exitButton");
const gameOverPanel = document.getElementById("gameOverPanel");
const resultTitle = document.getElementById("resultTitle");
const resultCopy = document.getElementById("resultCopy");
const restartButton = document.getElementById("restartButton");
const backMenuButton = document.getElementById("backMenuButton");
const pauseBadge = document.getElementById("pauseBadge");

const W = canvas.width;
const H = canvas.height;
const ROUND_LENGTH = 60;
const TAU = Math.PI * 2;
const keys = new Set();

const ART_ATLAS_SRC = "assets/neon-cyberpunk-asset-board.png";
const ART_ATLAS_SIZE = { w: 1536, h: 1024 };
const artAtlas = new Image();
let artAtlasReady = false;
artAtlas.addEventListener("load", () => {
  artAtlasReady = true;
});
artAtlas.src = ART_ATLAS_SRC;

const factories = {
  red: { name: "赤炉重工", color: "#d9584f" },
  blue: { name: "青脉电械", color: "#69c9dc" },
  white: { name: "白塔医工", color: "#f3efe7" }
};

let currentLanguage = "zh";

const UI_TEXT = {
  zh: {
    documentTitle: "残肢求生 Prototype",
    appTitle: "残肢求生",
    version: "Prototype 0.2",
    hp: "生命",
    round: "回合",
    timer: "计时",
    coins: "货币",
    shopShort: "店",
    startCopy: "手术醒来后，双手不见了。你只剩一颗格外坚硬的头，以及可以被替换、升级、变卖的身体。",
    startGame: "开始游戏",
    testMode: "测试模式",
    help: "操作指南",
    about: "关于",
    paused: "暂停",
    resume: "继续战斗",
    exitToMenu: "退出到开始菜单",
    helpTitle: "别停下，别回头",
    helpMove: "方向键（↑ ↓ ← →）或 WASD 控制移动。攻击会自动朝最近的敌人或可破坏箱子释放。",
    helpPause: "Esc 打开暂停菜单；战斗中不能打开商店，每个回合结束后才会进入改造阶段。",
    aboutPanel: "关于界面",
    aboutTitle: "残肢求生 Prototype 0.2",
    author: "作者：Shuntian Yang",
    aiCredit: "AI assistance development by Codex ChatGPT 5.4",
    close: "关闭",
    restart: "重新开始",
    backToMenu: "返回开始菜单",
    headbutt: "头槌",
    limbSlots: "肢体槽",
    armProsthetics: "手部义体",
    legProsthetics: "腿部义体",
    relics: "强化道具",
    sets: "套装",
    startRound: "起始回合",
    none: "无",
    noArms: "双手缺失",
    noLegs: "无腿部义体",
    notStarted: "未开始",
    roundLabel: "第 {round} 回合",
    roundStart: "第 {round} 回合：撑过一分钟",
    bossExtend: "一分钟已到，但 Boss 未死，回合延长",
    combatShopBlocked: "战斗中不能打开商店",
    normalTime: "正常时间",
    testSpeed: "测试加速 x8",
    audioOn: "开启音乐",
    audioOff: "关闭音乐",
    headAttack: "Lv.{level} 群体 {damage} / {cooldown}s",
    testShopTitle: "测试模式：免费调试商店",
    tradeDone: "交易完成，继续改造身体",
    shopDefaultTitle: "地下义体商店",
    shopTestKicker: "测试模式",
    shopRoundKicker: "第 {round} 回合结束",
    nextRound: "下一回合",
    startCombat: "开始战斗",
    summaryCoins: "货币：{coins}",
    summarySlots: "肢体槽：{filled} / {total}",
    summarySets: "套装：{sets}",
    groupUpgrade: "强化已有义体",
    groupSell: "变卖义体",
    groupBuy: "购买义体",
    groupRelic: "购买增益道具",
    groupBody: "身体改造",
    emptyUpgrade: "本轮没有刷出可用强化选项。",
    emptyOption: "暂无可用选项。",
    used: "已处理",
    free: "免费",
    price: "{cost} 货币",
    priceOriginal: "{cost} 货币（原 {original}）",
    offerUsedDesc: "本轮商店中该选项已经处理。",
    sale: "特价 -{percent}%",
    positive: "正面",
    sideEffect: "副作用",
    permanent: "永久",
    arm: "手臂",
    leg: "腿部",
    slot: "槽位 {slot}",
    base: "基础",
    upgraded: "强化II",
    enhanced: "强化I",
    evolved: "进化",
    numericUpgrade: "数值强化",
    mechanicUpgrade: "机制强化",
    stage3: "3级机制强化",
    stage6: "6级机制强化",
    stage9: "9级进化",
    buyHead: "强化头槌 Lv.{from} -> Lv.{to}",
    buyHeadDesc: "提升椭圆头槌的伤害、长度和击退。3/6级强化机制，9级进化为颅骨列车。",
    buySlot: "购买多余肢体栏位",
    buySlotDesc: "增加 1 个总肢体槽位。可装更多手臂或腿，也能留作未来替换空间。",
    buyProsthetic: "购买 {name}{level}",
    preLevelTag: "预升级 Lv.{level}",
    baseModel: "基础款",
    preLevelDesc: "本件已预升级到 Lv.{level}，价格包含强化成本。",
    needSlot: "需要空肢体槽",
    upgradeLimb: "强化 {slot}：{name}",
    upgradeLimbDesc: "单独强化此肢体。下一个关键机制点：{stage}。",
    sellLimb: "变卖 {slot}：{name}",
    organicLimb: "原生肢体",
    sell: "变卖",
    sellDesc: "卖出后返还货币，并空出一个总肢体槽。头不能变卖。",
    permanentRelic: "永久强化",
    testBuy: "测试购买 {name} Lv.{level}",
    testBuyDesc: "{desc} 测试模式免费，可直接购买 Lv.{level} 成品。",
    testUpgrade: "测试强化 {slot}：{name}",
    testUpgradeDesc: "免费强化此肢体。下一个关键机制点：{stage}。",
    testSell: "测试变卖 {slot}：{name}",
    testSellDesc: "测试模式免费移除此肢体，空出槽位。",
    testRelic: "测试道具：{name}",
    testSlot: "测试购买肢体栏位",
    testSlotDesc: "免费增加 1 个总肢体槽位。",
    testHeadDesc: "免费提升头槌等级。",
    fullSet: "{factory} 全套共鸣",
    armSet: "{factory} 双臂套装",
    legSet: "{factory} 双腿套装",
    bossName: "第 {index} 代 {name}",
    bossReward: "{line} 回收了 {bonus} 枚可用零件。",
    winTitle: "你活到了最后一刻",
    loseTitle: "意识再次沉入黑暗",
    winCopy: "本轮原型暂未设置最终关，你已经突破当前目标。",
    loseCopy: "你倒在了第 {round} 回合，击倒了 {kills} 个敌人。{line}"
  },
  en: {
    documentTitle: "Limb Survivor Prototype",
    appTitle: "Limb Survivor",
    version: "Prototype 0.2",
    hp: "HP",
    round: "Round",
    timer: "Timer",
    coins: "Scrap",
    shopShort: "Shop",
    startCopy: "You wake from surgery with both hands gone. All you have left is a skull built like a weapon, and a body that can be replaced, upgraded, or sold piece by piece.",
    startGame: "Start Game",
    testMode: "Test Mode",
    help: "Controls",
    about: "About",
    paused: "Paused",
    resume: "Resume",
    exitToMenu: "Exit to Main Menu",
    helpTitle: "Do Not Stop. Do Not Look Back.",
    helpMove: "Move with Arrow Keys (↑ ↓ ← →) or WASD. Attacks automatically target the nearest enemy or destructible crate.",
    helpPause: "Press Esc to open the pause menu. The shop is locked during combat and opens only after a round ends.",
    aboutPanel: "About",
    aboutTitle: "Limb Survivor Prototype 0.2",
    author: "Author: Shuntian Yang",
    aiCredit: "AI assistance development by Codex ChatGPT 5.4",
    close: "Close",
    restart: "Restart",
    backToMenu: "Back to Main Menu",
    headbutt: "Headbutt",
    limbSlots: "Limb Slots",
    armProsthetics: "Arm Prosthetics",
    legProsthetics: "Leg Prosthetics",
    relics: "Enhancements",
    sets: "Sets",
    startRound: "Start Round",
    none: "None",
    noArms: "Both hands missing",
    noLegs: "No leg prosthetics",
    notStarted: "Not started",
    roundLabel: "Round {round}",
    roundStart: "Round {round}: survive one minute",
    bossExtend: "The minute is over, but the Boss is still alive. The round continues.",
    combatShopBlocked: "The shop cannot open during combat",
    normalTime: "Normal time",
    testSpeed: "Test speed x8",
    audioOn: "Turn music on",
    audioOff: "Turn music off",
    headAttack: "Lv.{level} AoE {damage} / {cooldown}s",
    testShopTitle: "Test Mode: Free Debug Shop",
    tradeDone: "Deal complete. Keep rebuilding.",
    shopDefaultTitle: "Underground Prosthetic Shop",
    shopTestKicker: "Test Mode",
    shopRoundKicker: "Round {round} Complete",
    nextRound: "Next Round",
    startCombat: "Start Combat",
    summaryCoins: "Scrap: {coins}",
    summarySlots: "Limb slots: {filled} / {total}",
    summarySets: "Set: {sets}",
    groupUpgrade: "Upgrade Equipped Prosthetics",
    groupSell: "Sell Prosthetics",
    groupBuy: "Buy Prosthetics",
    groupRelic: "Buy Enhancements",
    groupBody: "Body Mods",
    emptyUpgrade: "No usable upgrade appeared this round.",
    emptyOption: "No options available.",
    used: "Handled",
    free: "Free",
    price: "{cost} scrap",
    priceOriginal: "{cost} scrap (was {original})",
    offerUsedDesc: "This shop option has already been handled this round.",
    sale: "SALE -{percent}%",
    positive: "Positive",
    sideEffect: "Side effect",
    permanent: "Permanent",
    arm: "Arm",
    leg: "Leg",
    slot: "Slot {slot}",
    base: "Base",
    upgraded: "Upgrade II",
    enhanced: "Upgrade I",
    evolved: "Evolved",
    numericUpgrade: "Stat Upgrade",
    mechanicUpgrade: "Mechanic Upgrade",
    stage3: "Lv.3 mechanic upgrade",
    stage6: "Lv.6 mechanic upgrade",
    stage9: "Lv.9 evolution",
    buyHead: "Upgrade Headbutt Lv.{from} -> Lv.{to}",
    buyHeadDesc: "Improves the oval headbutt's damage, reach, and knockback. Lv.3/Lv.6 add mechanics; Lv.9 evolves into Skull Train.",
    buySlot: "Buy Extra Limb Slot",
    buySlotDesc: "Adds 1 total limb slot. Equip more arms or legs, or keep room for a future replacement.",
    buyProsthetic: "Buy {name}{level}",
    preLevelTag: "Pre-upgraded Lv.{level}",
    baseModel: "Base model",
    preLevelDesc: "This unit is already upgraded to Lv.{level}; its price includes the upgrade cost.",
    needSlot: "Requires an empty limb slot",
    upgradeLimb: "Upgrade {slot}: {name}",
    upgradeLimbDesc: "Upgrade this limb individually. Next key mechanic: {stage}.",
    sellLimb: "Sell {slot}: {name}",
    organicLimb: "Organic limb",
    sell: "Sell",
    sellDesc: "Sell it for scrap and free one total limb slot. The head cannot be sold.",
    permanentRelic: "Permanent Enhancement",
    testBuy: "Test Buy {name} Lv.{level}",
    testBuyDesc: "{desc} Test mode is free and can buy a finished Lv.{level} unit.",
    testUpgrade: "Test Upgrade {slot}: {name}",
    testUpgradeDesc: "Upgrade this limb for free. Next key mechanic: {stage}.",
    testSell: "Test Sell {slot}: {name}",
    testSellDesc: "Remove this limb for free in test mode and open the slot.",
    testRelic: "Test Item: {name}",
    testSlot: "Test Buy Limb Slot",
    testSlotDesc: "Adds 1 total limb slot for free.",
    testHeadDesc: "Upgrade headbutt level for free.",
    fullSet: "{factory} Full Resonance",
    armSet: "{factory} Twin-Arm Set",
    legSet: "{factory} Twin-Leg Set",
    bossName: "Generation {index} {name}",
    bossReward: "{line} Recovered {bonus} usable parts.",
    winTitle: "You Survived the Last Moment",
    loseTitle: "Consciousness Falls Back Into Darkness",
    winCopy: "This prototype does not yet have a final stage. You have beaten the current objective.",
    loseCopy: "You fell in Round {round} after taking down {kills} enemies. {line}"
  }
};

const factoryEnglish = {
  red: "Red Furnace Heavy",
  blue: "Blue Vein Electrics",
  white: "White Tower Medtech"
};

const prostheticEnglish = {
  red_arm: {
    name: "Impact Gauntlet",
    desc: "Automatically throws heavy impact punches. Lv.3 adds burst damage, Lv.6 burns and knocks back, and Lv.9 evolves into a rotary saw arm."
  },
  blue_arm: {
    name: "Arc Gauntlet",
    desc: "Automatically fires chain lightning. Lv.3 jumps to more targets, Lv.6 paralyzes and slows, and Lv.9 evolves into a thunder-net arm."
  },
  white_arm: {
    name: "Injector Arm",
    desc: "Automatically fires medical needles. Lv.3 pierces, Lv.6 heals on hit, and Lv.9 evolves into a surgical arm."
  },
  red_leg: {
    name: "Ramming Leg",
    desc: "Stomps periodically. Lv.3 charges while moving, Lv.6 sends ground fissures, and Lv.9 evolves into a siege leg."
  },
  blue_leg: {
    name: "Spring Leg",
    desc: "Discharges foot arcs periodically. Lv.3 charges through movement, Lv.6 paralyzes, and Lv.9 evolves into a blink-step leg."
  },
  white_leg: {
    name: "Stabilizer Leg",
    desc: "Emits a shield pulse periodically. Lv.3 adds pulse damage, Lv.6 grants damage reduction, and Lv.9 evolves into a bastion leg."
  }
};

const relicEnglish = {
  bone_serum: ["Hardened Skull Serum", "Headbutt damage +20%."],
  mag_spine: ["Magnetized Spine", "Pickup range +70."],
  stable_plasma: ["Stabilized Plasma", "Max HP +25."],
  combat_chip: ["Combat Memory Chip", "Prosthetic upgrade prices -10%."],
  battery_pack: ["Backup Battery Pack", "All prosthetic cooldowns -8%."],
  light_frame: ["Lightweight Frame", "Move speed +18."],
  coin_reader: ["Scrap Reader", "Enemy scrap drops +15%."],
  nano_pouch: ["Medical Nano Pouch", "Healing +25%."],
  recoil_anchor: ["Recoil Anchor", "Knockback +20%."],
  crate_scanner: ["Crate Scanner", "Reduces the chance that crates are empty."],
  overclock: ["Overclock Reactor", "Prosthetic damage +45%, max HP -18%."],
  pain_lock: ["Pain Lock", "Damage taken -22%, move speed -16."],
  shop_debt: ["Debt License", "Gain 70 scrap now; the next two slot expansions cost +35."],
  volatile_fuel: ["Volatile Fuel Line", "Explosion/fire damage +35%, bombardment damage taken +20%."],
  neuro_boost: ["Neural Accelerator", "All cooldowns -18%, lose 8 HP at the start of each round."],
  black_interface: ["Black Market Interface", "Shop goods +2, all shop prices +12%."],
  cracked_core: ["Cracked Power Core", "Area attack radius +30%, projectile damage -12%."],
  rejection_drug: ["Rejection Drug", "Max HP +50, healing -35%."],
  unstable_field: ["Unstable Magnetic Field", "Pickup range +140, enemy bullet speed +12%."],
  blood_contract: ["Blood Debt Contract", "Boss rewards +50%, Boss HP +20%."]
};

const enemyEnglish = {
  patient: "Uncontrolled Patient",
  orderly: "Prosthetic Orderly",
  shooter: "Ranged Test Subject",
  boss: "Chief Surgeon"
};

function tr(key, vars = {}) {
  const pack = UI_TEXT[currentLanguage] || UI_TEXT.zh;
  const fallback = UI_TEXT.zh[key] || key;
  return (pack[key] || fallback).replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "");
}

function chooseText(zh, en) {
  return currentLanguage === "zh" ? zh : en;
}

function factoryName(factory) {
  return currentLanguage === "zh" ? (factories[factory]?.name || factory) : (factoryEnglish[factory] || factory);
}

function protoName(protoOrId) {
  const id = typeof protoOrId === "string" ? protoOrId : protoOrId.id;
  if (currentLanguage === "en" && prostheticEnglish[id]) return prostheticEnglish[id].name;
  const proto = typeof protoOrId === "string" ? prostheticCatalog.find(item => item.id === id) : protoOrId;
  return proto?.name || id;
}

function protoDesc(protoOrId) {
  const id = typeof protoOrId === "string" ? protoOrId : protoOrId.id;
  if (currentLanguage === "en" && prostheticEnglish[id]) return prostheticEnglish[id].desc;
  const proto = typeof protoOrId === "string" ? prostheticCatalog.find(item => item.id === id) : protoOrId;
  return proto?.desc || id;
}

function relicTitle(relicOrId) {
  const id = typeof relicOrId === "string" ? relicOrId : relicOrId.id;
  if (currentLanguage === "en" && relicEnglish[id]) return relicEnglish[id][0];
  const relic = typeof relicOrId === "string" ? relicCatalog.find(item => item.id === id) : relicOrId;
  return relic?.title || id;
}

function relicDesc(relicOrId) {
  const id = typeof relicOrId === "string" ? relicOrId : relicOrId.id;
  if (currentLanguage === "en" && relicEnglish[id]) return relicEnglish[id][1];
  const relic = typeof relicOrId === "string" ? relicCatalog.find(item => item.id === id) : relicOrId;
  return relic?.desc || id;
}

function enemyName(type) {
  return currentLanguage === "en" ? (enemyEnglish[type] || type) : (enemyTypes[type]?.name || type);
}

function organicSide(side) {
  if (currentLanguage === "zh") return `原生${side}腿`;
  return side === "左" ? "Organic Left Leg" : "Organic Right Leg";
}

function limbName(limb) {
  if (!limb) return "";
  if (limb.organic) return organicSide(limb.side || (limb.id.includes("左") ? "左" : "右"));
  return protoName(limb.baseId);
}

const prostheticVisuals = {
  red_arm: { glyph: "R", shape: "gauntlet", accent: "#ff3b30" },
  blue_arm: { glyph: "B", shape: "coil", accent: "#28d7ff" },
  white_arm: { glyph: "W", shape: "syringe", accent: "#dffcff" },
  red_leg: { glyph: "R", shape: "booster", accent: "#ff3b30" },
  blue_leg: { glyph: "B", shape: "spring", accent: "#28d7ff" },
  white_leg: { glyph: "W", shape: "guard", accent: "#dffcff" },
  organic_leg: { glyph: "L", shape: "organic", accent: "#d8c5a0" }
};

const relicIconGlyphs = {
  bone_serum: "B", mag_spine: "M", stable_plasma: "P", combat_chip: "C", battery_pack: "E",
  light_frame: "F", coin_reader: "$", nano_pouch: "+", recoil_anchor: "K", crate_scanner: "?",
  overclock: "O", pain_lock: "L", shop_debt: "D", volatile_fuel: "V", neuro_boost: "N",
  black_interface: "X", cracked_core: "Q", rejection_drug: "R", unstable_field: "U", blood_contract: "!"
};

const artSprites = {
  player: { x: 22, y: 24, w: 146, h: 546 },
  playerMini: { x: 48, y: 602, w: 110, h: 140 },
  head: { x: 28, y: 24, w: 118, h: 128 },
  slot: { x: 1388, y: 895, w: 138, h: 118 },
  enemies: {
    chaser: { x: 1036, y: 18, w: 108, h: 186 },
    shooter: { x: 1148, y: 24, w: 130, h: 178 },
    sprinter: { x: 1280, y: 76, w: 118, h: 120 },
    orderly: { x: 1404, y: 20, w: 110, h: 186 },
    boss: { x: 1036, y: 236, w: 486, h: 506 }
  },
  prosthetics: {
    red_arm: [
      { x: 382, y: 18, w: 112, h: 154 },
      { x: 594, y: 12, w: 98, h: 160 },
      { x: 704, y: 12, w: 98, h: 162 },
      { x: 818, y: 10, w: 102, h: 166 },
      { x: 930, y: 8, w: 98, h: 170 }
    ],
    blue_arm: [
      { x: 384, y: 182, w: 112, h: 148 },
      { x: 594, y: 180, w: 100, h: 154 },
      { x: 704, y: 180, w: 100, h: 154 },
      { x: 816, y: 178, w: 104, h: 158 },
      { x: 928, y: 176, w: 104, h: 166 }
    ],
    white_arm: [
      { x: 384, y: 314, w: 118, h: 76 },
      { x: 594, y: 294, w: 100, h: 96 },
      { x: 704, y: 294, w: 100, h: 96 },
      { x: 816, y: 290, w: 104, h: 100 },
      { x: 928, y: 286, w: 104, h: 104 }
    ],
    red_leg: [
      { x: 382, y: 418, w: 110, h: 126 },
      { x: 594, y: 414, w: 92, h: 132 },
      { x: 706, y: 414, w: 92, h: 134 },
      { x: 818, y: 410, w: 98, h: 138 },
      { x: 930, y: 406, w: 100, h: 146 }
    ],
    blue_leg: [
      { x: 382, y: 548, w: 108, h: 122 },
      { x: 594, y: 538, w: 92, h: 136 },
      { x: 706, y: 538, w: 92, h: 136 },
      { x: 818, y: 532, w: 98, h: 142 },
      { x: 930, y: 526, w: 104, h: 148 }
    ],
    white_leg: [
      { x: 382, y: 676, w: 112, h: 84 },
      { x: 594, y: 646, w: 94, h: 116 },
      { x: 706, y: 646, w: 94, h: 116 },
      { x: 818, y: 642, w: 100, h: 120 },
      { x: 930, y: 638, w: 106, h: 124 }
    ],
    organic_leg: [
      { x: 30, y: 402, w: 140, h: 220 },
      { x: 30, y: 402, w: 140, h: 220 },
      { x: 30, y: 402, w: 140, h: 220 },
      { x: 30, y: 402, w: 140, h: 220 },
      { x: 30, y: 402, w: 140, h: 220 }
    ]
  }
};

const relicSpriteOrder = [
  "bone_serum", "mag_spine", "stable_plasma", "combat_chip", "battery_pack",
  "light_frame", "coin_reader", "nano_pouch", "recoil_anchor", "crate_scanner",
  "overclock", "pain_lock", "shop_debt", "volatile_fuel", "neuro_boost",
  "black_interface", "cracked_core", "rejection_drug", "unstable_field", "blood_contract"
];

const relicSprites = Object.fromEntries(relicSpriteOrder.map((id, index) => {
  const col = index % 10;
  const row = Math.floor(index / 10);
  return [id, { x: 12 + col * 153, y: 764 + row * 128, w: 140, h: 118 }];
}));

const SPRITE_BASE = "assets/sprites/";
const prostheticSpriteIds = ["red_arm", "blue_arm", "white_arm", "red_leg", "blue_leg", "white_leg"];

function createSprite(file) {
  const image = new Image();
  const sprite = { src: `${SPRITE_BASE}${file}`, image };
  image.src = sprite.src;
  return sprite;
}

const gameSprites = {
  player: createSprite("characters/player.png"),
  head: createSprite("ui/head-upgrade.png"),
  slot: createSprite("ui/limb-slot-key.png"),
  items: {
    crate: createSprite("items/supply_crate.png"),
    coin: createSprite("items/prosthetic_scrap_currency.png")
  },
  enemies: {
    chaser: createSprite("enemies/chaser.png"),
    shooter: createSprite("enemies/shooter.png"),
    sprinter: createSprite("enemies/sprinter.png"),
    orderly: createSprite("enemies/orderly.png"),
    boss: createSprite("enemies/boss.png")
  },
  prosthetics: Object.fromEntries(prostheticSpriteIds.map(id => [id, {
    icon: createSprite(`prosthetics/${id}-icon.png`),
    tiers: [
      createSprite(`prosthetics/${id}-1.png`),
      createSprite(`prosthetics/${id}-3.png`),
      createSprite(`prosthetics/${id}-6.png`),
      createSprite(`prosthetics/${id}-9.png`)
    ]
  }])),
  relics: Object.fromEntries(relicSpriteOrder.map(id => [id, createSprite(`relics/${id}.png`)]))
};

const vfxSprites = {
  shared: {
    setResonanceAura: createSprite("vfx/shared/set_resonance_aura_v2.png")
  },
  enemy: {
    basic: createSprite("vfx/enemy/enemy_basic.png"),
    bossHeavy: createSprite("vfx/enemy/boss_heavy.png"),
    bossBurst: createSprite("vfx/enemy/boss_burst.png"),
    bossHoming: createSprite("vfx/enemy/boss_homing.png"),
    bossRing: createSprite("vfx/enemy/boss_ring.png"),
    bossBombardment: createSprite("vfx/enemy/boss_bombardment.png")
  },
  red: {
    punchBurst: createSprite("vfx/red/punch_burst.png"),
    groundCrack: createSprite("vfx/red/ground_crack.png"),
    fireRing: createSprite("vfx/red/fire_ring.png"),
    flameTrail: createSprite("vfx/red/flame_trail.png"),
    stompImpact: createSprite("vfx/red/stomp_impact.png"),
    hitSparks: createSprite("vfx/red/hit_sparks.png"),
    sawHalo: createSprite("vfx/red/saw_halo.png"),
    lavaPlume: createSprite("vfx/red/lava_plume.png"),
    burnMarker: createSprite("vfx/red/burn_marker.png"),
    resonanceAura: createSprite("vfx/red/resonance_aura.png")
  },
  blue: {
    lightningChain: createSprite("vfx/blue/lightning_chain.png"),
    electricBurst: createSprite("vfx/blue/electric_burst.png"),
    electricRing: createSprite("vfx/blue/electric_ring.png"),
    blinkTrail: createSprite("vfx/blue/blink_trail.png"),
    footMark: createSprite("vfx/blue/foot_mark.png"),
    paralyzeMarker: createSprite("vfx/blue/paralyze_marker.png"),
    thunderNet: createSprite("vfx/blue/thunder_net.png"),
    coilPulse: createSprite("vfx/blue/coil_pulse.png"),
    arcProjectile: createSprite("vfx/blue/arc_projectile.png"),
    resonanceAura: createSprite("vfx/blue/resonance_aura.png")
  },
  white: {
    needleTrail: createSprite("vfx/white/needle_trail.png"),
    needleFan: createSprite("vfx/white/needle_fan.png"),
    healRing: createSprite("vfx/white/heal_ring.png"),
    shieldPulse: createSprite("vfx/white/shield_pulse.png"),
    bulletDisintegrate: createSprite("vfx/white/bullet_disintegrate.png"),
    surgerySigil: createSprite("vfx/white/surgery_sigil.png"),
    bastionFragment: createSprite("vfx/white/bastion_fragment.png"),
    bastionField: createSprite("vfx/white/bastion_field_v2.png"),
    sterileBurst: createSprite("vfx/white/sterile_burst.png"),
    regenParticles: createSprite("vfx/white/regen_particles.png"),
    resonanceAura: createSprite("vfx/white/resonance_aura.png")
  }
};

const prostheticCatalog = [
  {
    id: "red_arm",
    kind: "arm",
    name: "冲拳义臂",
    factory: "red",
    cost: 38,
    value: 18,
    desc: "自动打出重拳冲击。3级爆裂，6级灼烧击退，9级进化为旋锯臂。"
  },
  {
    id: "blue_arm",
    kind: "arm",
    name: "电弧义臂",
    factory: "blue",
    cost: 44,
    value: 20,
    desc: "自动链式电击。3级增加跳跃目标，6级麻痹减速，9级进化为雷网臂。"
  },
  {
    id: "white_arm",
    kind: "arm",
    name: "注射义臂",
    factory: "white",
    cost: 42,
    value: 19,
    desc: "自动发射药针。3级穿透，6级命中回血，9级进化为手术臂。"
  },
  {
    id: "red_leg",
    kind: "leg",
    name: "冲撞义腿",
    factory: "red",
    cost: 36,
    value: 17,
    desc: "周期性践踏。3级移动蓄力，6级地裂波，9级进化为攻城腿。"
  },
  {
    id: "blue_leg",
    kind: "leg",
    name: "弹簧义腿",
    factory: "blue",
    cost: 34,
    value: 16,
    desc: "周期性脚底电弧。3级移动充能，6级麻痹，9级进化为瞬步腿。"
  },
  {
    id: "white_leg",
    kind: "leg",
    name: "稳定义腿",
    factory: "white",
    cost: 40,
    value: 18,
    desc: "周期性护盾脉冲。3级脉冲伤害，6级减伤，9级进化为堡垒腿。"
  }
];

const relicCatalog = [
  { id: "bone_serum", title: "硬化颅骨血清", desc: "头槌伤害 +20%。", cost: 42, sideEffect: false },
  { id: "mag_spine", title: "磁化脊柱", desc: "拾取范围 +70。", cost: 34, sideEffect: false },
  { id: "stable_plasma", title: "稳定血浆", desc: "最大生命 +25。", cost: 38, sideEffect: false },
  { id: "combat_chip", title: "战斗记忆芯片", desc: "义体升级价格 -10%。", cost: 48, sideEffect: false },
  { id: "battery_pack", title: "备用电池组", desc: "所有义体冷却 -8%。", cost: 46, sideEffect: false },
  { id: "light_frame", title: "轻量化骨架", desc: "移动速度 +18。", cost: 36, sideEffect: false },
  { id: "coin_reader", title: "硬币识别器", desc: "敌人掉落货币 +15%。", cost: 44, sideEffect: false },
  { id: "nano_pouch", title: "医疗纳米囊", desc: "治疗效果 +25%。", cost: 40, sideEffect: false },
  { id: "recoil_anchor", title: "反冲稳定器", desc: "击退效果 +20%。", cost: 32, sideEffect: false },
  { id: "crate_scanner", title: "箱体扫描仪", desc: "箱子空掉落概率降低。", cost: 36, sideEffect: false },
  { id: "overclock", title: "过载反应堆", desc: "义体伤害 +45%，最大生命 -18%。", cost: 58, sideEffect: true },
  { id: "pain_lock", title: "痛觉封锁器", desc: "受到伤害 -22%，移动速度 -16。", cost: 52, sideEffect: true },
  { id: "shop_debt", title: "赊账许可证", desc: "立即获得 70 货币，后两次扩槽价格 +35。", cost: 20, sideEffect: true },
  { id: "volatile_fuel", title: "易燃燃料管", desc: "爆炸/火力伤害 +35%，受到轰炸伤害 +20%。", cost: 50, sideEffect: true },
  { id: "neuro_boost", title: "神经加速剂", desc: "所有冷却 -18%，每回合开始损失 8 生命。", cost: 54, sideEffect: true },
  { id: "black_interface", title: "黑市接口", desc: "商店商品 +2，商品价格 +12%。", cost: 48, sideEffect: true },
  { id: "cracked_core", title: "破损聚能核心", desc: "范围攻击半径 +30%，弹体伤害 -12%。", cost: 45, sideEffect: true },
  { id: "rejection_drug", title: "义体排斥药", desc: "最大生命 +50，治疗效果 -35%。", cost: 46, sideEffect: true },
  { id: "unstable_field", title: "不稳定磁场", desc: "拾取范围 +140，敌方子弹速度 +12%。", cost: 44, sideEffect: true },
  { id: "blood_contract", title: "血债契约", desc: "Boss 奖励 +50%，Boss 血量 +20%。", cost: 52, sideEffect: true }
];

const bossIntroLines = [
  "一团扭曲的义肢巨物缓缓出现，像从手术灯背后爬出的噩梦。",
  "地面开始震颤，废弃义体互相咬合，拼成一具不该存在的身体。",
  "警报声被金属啸叫撕碎，Boss 从阴影里拖着满身断肢走来。",
  "它不是人，也不再像机器。它只是饥饿的零件集合体。",
  "一座移动的残肢祭坛踏入战场，所有义体接口都在尖叫。"
];

const roundEndLines = [
  "我又醒着撑过了一分钟。心跳还在，债也还在。",
  "空气里全是烧焦的金属味。至少这一次，倒下的不是我。",
  "一分钟像一场手术那么长。我还活着，还能继续改造。",
  "那些东西退去了。我的身体少了几块，但命还卡在胸腔里。",
  "我听见自己的呼吸声，比商店的霓虹灯还刺耳。还没结束。"
];

const bossVictoryLines = [
  "那东西终于散架了。它的力量让我发冷，但我还站着。",
  "Boss 的残骸还在抽搐。我不敢庆祝，只敢确认自己还有脉搏。",
  "它差点把我拆成库存。好在这一次，我先把它拆了。",
  "巨物倒下时，整片地面都像松了一口气。我没有。",
  "我赢了，可它身上的接口还在发光，像在提醒我迟早轮到自己。"
];

const deathLines = [
  "还不能停。我还没找到是谁把我的身体拆成这样。",
  "黑暗压下来之前，我只想着再站起来一次。",
  "这不是终点，只是又一次失败的苏醒。",
  "我的身体可以碎，真相不能就这样断线。",
  "如果还有下一次醒来，我会把它们全都撞碎。"
];

const localizedNarration = {
  bossIntro: {
    zh: bossIntroLines,
    en: [
      "A warped mass of prosthetic limbs drifts in, like a nightmare crawling out from behind an operating lamp.",
      "The floor starts to shake. Discarded limbs bite into each other and assemble a body that should not exist.",
      "Metal shrieks tear the sirens apart as the Boss drags itself out of the shadow, wrapped in severed machinery.",
      "It is not human, and not quite machine. It is a hungry collection of parts.",
      "A walking altar of ruined limbs enters the field, and every prosthetic socket begins to scream."
    ]
  },
  roundEnd: {
    zh: roundEndLines,
    en: [
      "I stayed awake for one more minute. The pulse is still here. So is the debt.",
      "The air tastes like burned metal. At least this time, I am not the one on the floor.",
      "A minute can last as long as surgery. I am alive, and I can still rebuild.",
      "They pulled back. Parts of me are missing, but my life is still jammed inside my ribs.",
      "My breathing sounds louder than the shop neon. It is not over."
    ]
  },
  bossVictory: {
    zh: bossVictoryLines,
    en: [
      "The thing finally came apart. Its strength still chills me, but I am standing.",
      "The Boss wreckage keeps twitching. I cannot celebrate. I can only check for a pulse.",
      "It nearly stripped me into inventory. This time, I stripped it first.",
      "When the giant falls, the whole floor seems to exhale. I do not.",
      "I won, but the sockets on its body are still glowing, reminding me that my turn will come."
    ]
  },
  death: {
    zh: deathLines,
    en: [
      "I cannot stop yet. I still do not know who took my body apart.",
      "Before the dark presses down, all I want is to stand up one more time.",
      "This is not the end, just another failed awakening.",
      "My body can break. The truth cannot go dark like this.",
      "If I wake again, I will smash every last one of them."
    ]
  }
};

function pickNarration(group) {
  return pickLine(localizedNarration[group]?.[currentLanguage] || localizedNarration[group]?.zh || []);
}

const enemyTypes = {
  patient: {
    name: "失控病患",
    hp: 34,
    speed: 52,
    radius: 14,
    damage: 9,
    coins: 1,
    color: "#c9d1cf",
    stroke: "#6f7c79"
  },
  orderly: {
    name: "义体护工",
    hp: 70,
    speed: 40,
    radius: 18,
    damage: 15,
    coins: 2,
    color: "#e0b163",
    stroke: "#775b28"
  },
  shooter: {
    name: "远程实验体",
    hp: 52,
    speed: 38,
    radius: 15,
    damage: 8,
    coins: 3,
    color: "#78cfe0",
    stroke: "#2a6972",
    range: 320,
    shootCd: 2.3
  },
  boss: {
    name: "值班主任",
    hp: 390,
    speed: 32,
    radius: 38,
    damage: 24,
    coins: 62,
    color: "#d9584f",
    stroke: "#7d2723",
    range: 360,
    shootCd: 1.45
  }
};

let state = createMenuState();
let lastTime = performance.now();
let spawnTimer = 0;
let bannerTimer = 0;
let bgmMuted = false;

function updateAudioToggle() {
  audioToggle.classList.toggle("muted", bgmMuted);
  audioToggle.title = bgmMuted ? tr("audioOn") : tr("audioOff");
  audioToggle.setAttribute("aria-label", bgmMuted ? tr("audioOn") : tr("audioOff"));
}

function playBgm(restart = false) {
  if (bgmMuted) return;
  bgmAudio.volume = 0.55;
  if (restart) bgmAudio.currentTime = 0;
  bgmAudio.play().catch(() => {
    // Browsers can block audio until the next user gesture; the toggle/start buttons will retry.
  });
}

function stopBgm() {
  bgmAudio.pause();
  bgmAudio.currentTime = 0;
}

function toggleBgm() {
  bgmMuted = !bgmMuted;
  if (bgmMuted) stopBgm();
  else playBgm(true);
  updateAudioToggle();
}

function applyLanguage() {
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
  document.title = tr("documentTitle");
  if (languageToggle) languageToggle.textContent = currentLanguage === "zh" ? "中文（简体）" : "ENGLISH";
  document.querySelectorAll("[data-i18n]").forEach(element => {
    element.textContent = tr(element.dataset.i18n);
  });
  updateAudioToggle();
}

function toggleLanguage() {
  currentLanguage = currentLanguage === "zh" ? "en" : "zh";
  applyStats();
  applyLanguage();
  updateHud();
  if (state.mode === "shop") {
    buildShopOffers();
    renderShop(tr("shopDefaultTitle"));
  }
  if (!gameOverPanel.classList.contains("hidden")) finishGame(state.player.hp > 0);
}

function createMenuState() {
  return {
    mode: "menu",
    testMode: false,
    round: 0,
    roundTime: ROUND_LENGTH,
    timeScale: 1,
    coins: 0,
    debt: 0,
    killedEnemies: 0,
    head: { level: 1, timer: 0, flash: 0, range: 92 },
    player: {
      x: W / 2,
      y: H / 2,
      radius: 18,
      hp: 100,
      maxHp: 100,
      speed: 150,
      pickup: 64,
      armor: 0,
      invuln: 0
    },
    limbSlots: [],
    relics: [],
    stats: {},
    setBonus: { text: tr("none"), armFactory: null, legFactory: null, fullFactory: null, armFactories: [], legFactories: [], fullFactories: [] },
    enemies: [],
    crates: [],
    pickups: [],
    projectiles: [],
    hazards: [],
    lightningBolts: [],
    attackEffects: [],
    particles: [],
    shopOffers: {},
    bossAlive: false,
    bossNoticeShown: false,
    bossAttack: {
      bombTimer: 6,
      burstTimer: 8,
      burstShots: 0,
      burstInterval: 0,
      homingTimer: 10,
      ringTimer: 12
    },
    movedDistance: 0,
    lastPlayerX: W / 2,
    lastPlayerY: H / 2
  };
}

function createRunState() {
  const next = createMenuState();
  next.mode = "combat";
  next.round = 0;
  next.coins = 12;
  next.limbSlots = [
    null,
    null,
    createOrganicLeg("左"),
    createOrganicLeg("右")
  ];
  return next;
}

function createOrganicLeg(side) {
  return {
    id: `organic_leg_${side}`,
    baseId: "organic_leg",
    kind: "leg",
    name: `原生${side}腿`,
    side,
    factory: "organic",
    level: 1,
    value: 18,
    organic: true,
    timer: 0
  };
}

function cloneProsthetic(proto) {
  return {
    id: `${proto.id}_${Math.random().toString(16).slice(2)}`,
    baseId: proto.id,
    kind: proto.kind,
    name: proto.name,
    factory: proto.factory,
    level: 1,
    value: proto.value,
    organic: false,
    timer: 0
  };
}

function createShopProsthetic(proto, level) {
  const limb = cloneProsthetic(proto);
  limb.level = level;
  limb.value = proto.value + (level - 1) * 7;
  return limb;
}

function startRun() {
  state = createRunState();
  state.testMode = false;
  playBgm(true);
  startMenu.classList.add("hidden");
  gameOverPanel.classList.add("hidden");
  pauseMenu.classList.add("hidden");
  helpModal.classList.add("hidden");
  shopModal.classList.add("hidden");
  pauseBadge.classList.add("hidden");
  beginNextRound();
}

function startTestMode() {
  state = createRunState();
  state.testMode = true;
  state.mode = "shop";
  state.coins = 999999;
  playBgm(true);
  startMenu.classList.add("hidden");
  gameOverPanel.classList.add("hidden");
  pauseMenu.classList.add("hidden");
  helpModal.classList.add("hidden");
  pauseBadge.classList.add("hidden");
  shopModal.classList.remove("hidden");
  buildShopOffers();
  renderShop(tr("testShopTitle"));
  updateHud();
}

function returnToMenu() {
  state = createMenuState();
  startMenu.classList.remove("hidden");
  pauseMenu.classList.add("hidden");
  gameOverPanel.classList.add("hidden");
  helpModal.classList.add("hidden");
  shopModal.classList.add("hidden");
  pauseBadge.classList.add("hidden");
  centerBanner.classList.add("hidden");
  keys.clear();
  applyStats();
  updateHud();
}

function beginNextRound() {
  state.round += 1;
  state.mode = "combat";
  state.roundTime = ROUND_LENGTH;
  state.player.x = W / 2;
  state.player.y = H / 2;
  state.enemies = [];
  state.crates = [];
  state.pickups = [];
  state.projectiles = [];
  state.hazards = [];
  state.lightningBolts = [];
  state.attackEffects = [];
  state.particles = [];
  state.bossAlive = state.round % 3 === 0;
  state.bossNoticeShown = false;
  state.bossAttack = {
    bombTimer: 6,
    burstTimer: 8,
    burstShots: 0,
    burstInterval: 0,
    homingTimer: 10,
    ringTimer: 12
  };
  state.movedDistance = 0;
  state.lastPlayerX = W / 2;
  state.lastPlayerY = H / 2;
  spawnTimer = 0.2;
  shopModal.classList.add("hidden");
  pauseMenu.classList.add("hidden");
  pauseBadge.classList.add("hidden");
  spawnCrates();
  applyStats();
  if (state.relics.includes("neuro_boost")) damagePlayer(8, true);
  if (state.bossAlive) spawnEnemy("boss");
  showBanner(state.bossAlive ? pickNarration("bossIntro") : tr("roundStart", { round: state.round }));
  updateHud();
}

function beginSelectedTestRound() {
  const selected = clamp(Number.parseInt(testRoundInput.value, 10) || 1, 1, 99);
  state.round = selected - 1;
  beginNextRound();
}

function applyStats() {
  if (!state.player) return;

  const relics = new Set(state.relics);
  const limbSlots = state.limbSlots || [];
  let maxHp = 100;
  let speed = 150;
  let pickup = 64;
  let armor = 0;
  let headDamage = 24 + state.head.level * 5;
  let headRange = 90 + state.head.level * 5;
  let headCooldown = Math.max(0.42, 0.86 - state.head.level * 0.035);
  let limbDamageMult = 1;
  let limbCooldownMult = 1;
  let areaMult = 1;
  let projectileDamageMult = 1;
  let healingMult = 1;
  let coinMult = 1;
  let knockbackMult = 1;
  let shopPriceMult = 1;
  let bossHpMult = 1;
  let enemyBulletSpeedMult = 1;
  let bombDamageTakenMult = 1;
  let fireDamageMult = 1;
  let crateEmptyBonus = 0;
  let regenPerRound = 0;

  for (const limb of limbSlots) {
    if (!limb) continue;
    const level = limb.level;
    if (limb.organic) {
      speed += 14;
      continue;
    }
    if (limb.baseId === "red_leg") {
      speed += 10 + level * 4;
      knockbackMult += 0.03 * level;
    }
    if (limb.baseId === "blue_leg") {
      speed += 18 + level * 6;
      pickup += 12 + level * 4;
      if (level >= 9) speed += 34;
    }
    if (limb.baseId === "white_leg") {
      maxHp += 18 + level * 7;
      armor += 0.02 + level * 0.008;
      if (level >= 6) regenPerRound += 8;
      if (level >= 9) armor += 0.08;
    }
  }

  if (relics.has("bone_serum")) headDamage *= 1.2;
  if (relics.has("mag_spine")) pickup += 70;
  if (relics.has("stable_plasma")) maxHp += 25;
  if (relics.has("battery_pack")) limbCooldownMult *= 0.92;
  if (relics.has("light_frame")) speed += 18;
  if (relics.has("coin_reader")) coinMult *= 1.15;
  if (relics.has("nano_pouch")) healingMult *= 1.25;
  if (relics.has("recoil_anchor")) knockbackMult *= 1.2;
  if (relics.has("crate_scanner")) crateEmptyBonus += 0.22;
  if (relics.has("overclock")) {
    limbDamageMult *= 1.45;
    maxHp *= 0.82;
  }
  if (relics.has("pain_lock")) {
    armor += 0.22;
    speed -= 16;
  }
  if (relics.has("volatile_fuel")) {
    fireDamageMult *= 1.35;
    bombDamageTakenMult *= 1.2;
  }
  if (relics.has("neuro_boost")) limbCooldownMult *= 0.82;
  if (relics.has("black_interface")) shopPriceMult *= 1.12;
  if (relics.has("cracked_core")) {
    areaMult *= 1.3;
    projectileDamageMult *= 0.88;
  }
  if (relics.has("rejection_drug")) {
    maxHp += 50;
    healingMult *= 0.65;
  }
  if (relics.has("unstable_field")) {
    pickup += 140;
    enemyBulletSpeedMult *= 1.12;
  }
  if (relics.has("blood_contract")) bossHpMult *= 1.2;

  const synergy = computeSetBonus();
  if (synergy.armFactories.length > 0) {
    limbDamageMult *= 1 + synergy.armFactories.length * 0.18;
  }
  for (const factory of synergy.legFactories) {
    if (factory === "red") {
      knockbackMult *= 1.18;
      areaMult *= 1.08;
    }
    if (factory === "blue") {
      speed += 18;
      limbCooldownMult *= 0.94;
    }
    if (factory === "white") {
      maxHp += 22;
      armor += 0.06;
      regenPerRound += 6;
    }
  }
  for (const factory of synergy.fullFactories) {
    maxHp += 25;
    speed += 16;
    limbDamageMult *= 1.35;
    if (factory === "white") regenPerRound += 12;
    if (factory === "blue") limbCooldownMult *= 0.92;
    if (factory === "red") knockbackMult *= 1.25;
  }

  state.stats = {
    maxHp: Math.round(maxHp),
    speed: Math.max(70, speed),
    pickup,
    armor: clamp(armor, 0, 0.62),
    headDamage: Math.round(headDamage),
    headRange,
    headCooldown: Math.max(0.28, headCooldown),
    limbDamageMult,
    limbCooldownMult,
    areaMult,
    projectileDamageMult,
    healingMult,
    coinMult,
    knockbackMult,
    shopPriceMult,
    bossHpMult,
    enemyBulletSpeedMult,
    bombDamageTakenMult,
    fireDamageMult,
    crateEmptyBonus,
    regenPerRound
  };

  const oldMax = state.player.maxHp || state.stats.maxHp;
  state.player.maxHp = state.stats.maxHp;
  state.player.hp = clamp(state.player.hp + Math.max(0, state.player.maxHp - oldMax), 1, state.player.maxHp);
  state.player.speed = state.stats.speed;
  state.player.pickup = state.stats.pickup;
  state.player.armor = state.stats.armor;
  state.head.range = state.stats.headRange;
  state.setBonus = synergy;
}

function computeSetBonus() {
  const arms = {};
  const legs = {};
  for (const limb of state.limbSlots || []) {
    if (!limb || limb.organic) continue;
    const bucket = limb.kind === "arm" ? arms : legs;
    bucket[limb.factory] = (bucket[limb.factory] || 0) + 1;
  }

  const armFactories = [];
  const legFactories = [];
  const fullFactories = [];
  for (const key of Object.keys(factories)) {
    if ((arms[key] || 0) >= 2) armFactories.push(key);
    if ((legs[key] || 0) >= 2) legFactories.push(key);
    if ((arms[key] || 0) >= 2 && (legs[key] || 0) >= 2) fullFactories.push(key);
  }

  const labels = [
    ...fullFactories.map(factory => tr("fullSet", { factory: factoryName(factory) })),
    ...armFactories.filter(factory => !fullFactories.includes(factory)).map(factory => tr("armSet", { factory: factoryName(factory) })),
    ...legFactories.filter(factory => !fullFactories.includes(factory)).map(factory => tr("legSet", { factory: factoryName(factory) }))
  ];
  const text = labels.length > 0 ? labels.join(" / ") : tr("none");
  return {
    text,
    armFactory: armFactories[0] || null,
    legFactory: legFactories[0] || null,
    fullFactory: fullFactories[0] || null,
    armFactories,
    legFactories,
    fullFactories
  };
}

function hasArmSet(factory) {
  return Boolean(state.setBonus?.armFactories?.includes(factory));
}

function hasLegSet(factory) {
  return Boolean(state.setBonus?.legFactories?.includes(factory));
}

function hasFullSet(factory) {
  return Boolean(state.setBonus?.fullFactories?.includes(factory));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function normalize(x, y) {
  const len = Math.hypot(x, y) || 1;
  return { x: x / len, y: y / len };
}

function formatTime(seconds) {
  const clamped = Math.max(0, seconds);
  const mins = Math.floor(clamped / 60);
  const secs = Math.ceil(clamped % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function showBanner(text) {
  centerBanner.textContent = text;
  centerBanner.classList.remove("hidden");
  bannerTimer = 2.2;
}

function spawnCrates() {
  const count = 5 + Math.min(5, Math.floor(state.round / 2));
  for (let i = 0; i < count; i += 1) {
    let x = 80 + Math.random() * (W - 160);
    let y = 80 + Math.random() * (H - 160);
    if (Math.hypot(x - W / 2, y - H / 2) < 120) {
      x += x < W / 2 ? -90 : 90;
      y += y < H / 2 ? -60 : 60;
    }
    state.crates.push({
      x: clamp(x, 48, W - 48),
      y: clamp(y, 48, H - 48),
      radius: 16,
      hp: 32 + state.round * 4,
      maxHp: 32 + state.round * 4,
      hitFlash: 0
    });
  }
}

function spawnEnemy(forcedType) {
  let type = forcedType;
  if (!type) {
    const roll = Math.random();
    if (state.round >= 3 && roll < 0.22) type = "shooter";
    else if (state.round >= 2 && roll < 0.45) type = "orderly";
    else type = "patient";
  }

  const template = enemyTypes[type];
  const edge = Math.floor(Math.random() * 4);
  const margin = 46;
  const scale = 1 + Math.max(0, state.round - 1) * 0.13;
  const enemy = {
    ...template,
    type,
    hp: Math.round(template.hp * scale),
    maxHp: Math.round(template.hp * scale),
    x: edge === 1 ? W + margin : edge === 3 ? -margin : Math.random() * W,
    y: edge === 0 ? -margin : edge === 2 ? H + margin : Math.random() * H,
    hitFlash: 0,
    contactCd: 0,
    slow: 0,
    shootTimer: template.shootCd ? template.shootCd * Math.random() : 0
  };

  if (type === "boss") {
    const bossIndex = Math.floor(state.round / 3);
    const lateBossBoost = bossIndex >= 3 ? 1 + (bossIndex - 2) * 0.85 : 1;
    enemy.name = tr("bossName", { index: bossIndex, name: enemyName(type) });
    enemy.hp = Math.round(template.hp * (1 + state.round * 0.22) * lateBossBoost * state.stats.bossHpMult);
    enemy.maxHp = enemy.hp;
    enemy.speed = Math.round(template.speed * (bossIndex >= 3 ? 1.25 + (bossIndex - 3) * 0.08 : 1));
    enemy.damage = Math.round(template.damage * (bossIndex >= 3 ? 1.25 + (bossIndex - 3) * 0.1 : 1));
    enemy.coins = Math.round((template.coins + state.round * 8) * (state.relics.includes("blood_contract") ? 1.5 : 1));
    enemy.x = W / 2;
    enemy.y = -72;
  }

  state.enemies.push(enemy);
}

function addPickup(x, y, kind, amount) {
  state.pickups.push({
    x,
    y,
    kind,
    amount,
    radius: kind === "heal" ? 9 : 7,
    pulse: Math.random() * TAU
  });
}

function addParticle(x, y, color, count = 7) {
  for (let i = 0; i < count; i += 1) {
    const a = Math.random() * TAU;
    const s = 40 + Math.random() * 130;
    state.particles.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life: 0.35 + Math.random() * 0.35,
      maxLife: 0.7,
      color
    });
  }
}

function damagePlayer(amount, ignoreInvuln = false, type = "normal") {
  if ((!ignoreInvuln && state.player.invuln > 0) || state.mode !== "combat") return;
  if (ignoreInvuln) state.player.invuln = 0;
  const typeMult = type === "bomb" ? state.stats.bombDamageTakenMult : 1;
  const finalDamage = Math.max(1, amount * typeMult * (1 - state.player.armor));
  state.player.hp -= finalDamage;
  state.player.invuln = 0.42;
  addParticle(state.player.x, state.player.y, "#d9584f", 10);
  if (state.player.hp <= 0) finishGame(false);
}

function healPlayer(amount) {
  state.player.hp = clamp(state.player.hp + amount * state.stats.healingMult, 0, state.player.maxHp);
  addParticle(state.player.x, state.player.y, "#80cf78", 6);
}

function damageEnemy(enemy, amount, knockback = 0, sourceX = state.player.x, sourceY = state.player.y) {
  enemy.hp -= amount;
  enemy.hitFlash = 0.12;
  if (knockback > 0) {
    const dir = normalize(enemy.x - sourceX, enemy.y - sourceY);
    enemy.x += dir.x * knockback * state.stats.knockbackMult;
    enemy.y += dir.y * knockback * state.stats.knockbackMult;
  }
}

function damageCrate(crate, amount) {
  crate.hp -= amount;
  crate.hitFlash = 0.12;
  if (crate.hp <= 0 && !crate.destroyed) {
    crate.destroyed = true;
    const roll = Math.random();
    const coinChance = 0.38 + state.stats.crateEmptyBonus * 0.5;
    const healChance = 0.24;
    if (roll < coinChance) addPickup(crate.x, crate.y, "coin", Math.round((1 + Math.floor(Math.random() * 5)) * earlyCoinBonus()));
    else if (roll < coinChance + healChance) addPickup(crate.x, crate.y, "heal", 10 + Math.floor(Math.random() * 16));
    addParticle(crate.x, crate.y, "#b58a50", 12);
  }
}

function performHeadbutt() {
  const target = nearestHeadbuttTarget();
  const dir = target ? normalize(target.x - state.player.x, target.y - state.player.y) : { x: 1, y: 0 };
  const angle = Math.atan2(dir.y, dir.x);
  const length = (state.stats.headRange + (state.head.level >= 3 ? 24 : 0) + (state.head.level >= 9 ? 44 : 0)) * state.stats.areaMult;
  const width = (42 + state.head.level * 3 + (state.head.level >= 6 ? 18 : 0)) * state.stats.areaMult;
  const damage = state.stats.headDamage * (state.head.level >= 9 ? 1.35 : 1);
  state.head.flash = 0.2;
  state.head.range = length;
  state.head.angle = angle;
  state.head.width = width;

  for (const enemy of state.enemies) {
    const hit = pointInHeadbutt(enemy, length, width + enemy.radius);
    if (hit.inside) {
      const centerLine = Math.abs(hit.localY) < width * 0.28;
      const falloff = state.head.level >= 6 ? 1 : clamp(1.05 - hit.localX / (length * 1.2), 0.65, 1);
      damageEnemy(enemy, damage * falloff * (centerLine && state.head.level >= 9 ? 1.35 : 1), state.head.level >= 3 ? 24 : 14);
      if (state.head.level >= 6) splashAt(enemy.x, enemy.y, damage * 0.28, 42);
    }
  }

  for (const crate of state.crates) {
    if (pointInHeadbutt(crate, length, width + crate.radius).inside) {
      damageCrate(crate, damage * (state.head.level >= 3 ? 1.5 : 0.8));
    }
  }

  addParticle(state.player.x, state.player.y, "#f3efe7", 12);
}

function nearestCrate() {
  return [...state.crates]
    .map(crate => ({ crate, d: distance(state.player, crate) }))
    .sort((a, b) => a.d - b.d)[0]?.crate || null;
}

function nearestHeadbuttTarget() {
  const candidates = [
    ...state.enemies.map(enemy => ({ target: enemy, d: distance(state.player, enemy), priority: 1 })),
    ...state.crates.map(crate => ({ target: crate, d: distance(state.player, crate), priority: 0.72 }))
  ];
  return candidates
    .sort((a, b) => (a.d * a.priority) - (b.d * b.priority))[0]?.target
    || nearestEnemies(1, 999)[0]
    || nearestCrate();
}

function pointInHeadbutt(point, length, width) {
  const dx = point.x - state.player.x;
  const dy = point.y - state.player.y;
  const cos = Math.cos(-(state.head.angle || 0));
  const sin = Math.sin(-(state.head.angle || 0));
  const localX = dx * cos - dy * sin;
  const localY = dx * sin + dy * cos;
  const cx = length * 0.5;
  const rx = length * 0.5;
  const ry = width * 0.5;
  const inside = localX >= 0 && ((localX - cx) ** 2) / (rx ** 2) + (localY ** 2) / (ry ** 2) <= 1;
  return { inside, localX, localY };
}

function performArmAttack(limb) {
  if (!limb || limb.kind !== "arm") return;
  const level = limb.level;
  const mult = state.stats.limbDamageMult;
  const pairBoost = hasArmSet(limb.factory) ? 1.22 : 1;
  const fullBoost = hasFullSet(limb.factory) ? 1.35 : 1;
  let damage = (18 + level * 7) * mult * pairBoost * fullBoost;
  if (limb.factory === "red") damage *= state.stats.fireDamageMult;

  if (limb.baseId === "red_arm") {
    const range = (level >= 9 ? 155 : level >= 6 ? 132 : 112) * state.stats.areaMult;
    addAttackEffect({ type: "burst", x: state.player.x, y: state.player.y, radius: range, color: "#d9584f", life: 0.34, spikes: level >= 9 });
    for (const enemy of state.enemies) {
      if (distance(state.player, enemy) <= range + enemy.radius) {
        damageEnemy(enemy, damage, 14);
        if (level >= 6) enemy.burn = Math.max(enemy.burn || 0, 2.2);
      }
    }
    for (const crate of state.crates) {
      if (distance(state.player, crate) <= range + crate.radius) damageCrate(crate, damage);
    }
    if (level >= 3 || hasArmSet("red")) fireWave("#d9584f", damage * 0.65);
    if (level >= 9) {
      addAttackEffect({ type: "sawHalo", x: state.player.x, y: state.player.y, radius: range, color: "#d9584f", life: 0.72 });
      for (let i = 0; i < 3; i += 1) {
        setTimeout(() => splashAt(state.player.x, state.player.y, damage * 0.45, 118, "#d9584f"), i * 80);
      }
    }
    addParticle(state.player.x, state.player.y, "#d9584f", 8);
  }

  if (limb.baseId === "blue_arm") {
    const pairTargets = hasArmSet("blue") ? 2 : 0;
    const targets = nearestEnemies(4 + Math.floor(level / 3) + pairTargets, 260 + level * 8);
    targets.forEach((enemy, index) => {
      damageEnemy(enemy, damage * (1 - index * 0.08), 4);
      if (level >= 6 || hasArmSet("blue")) {
        enemy.slow = Math.max(enemy.slow, 1.2);
        addAttackEffect({ type: "paralyzeMark", x: enemy.x, y: enemy.y, radius: enemy.radius + 18, color: "#69c9dc", life: 0.34 });
      }
      addParticle(enemy.x, enemy.y, "#69c9dc", 5);
    });
    if (targets.length > 0) addLightningChain([{ x: state.player.x, y: state.player.y }, ...targets], level >= 9);
    if (targets.length === 0) addAttackEffect({ type: "ring", x: state.player.x, y: state.player.y, radius: 72, color: "#69c9dc", life: 0.25, electric: true });
    if (level >= 9) {
      addAttackEffect({ type: "thunderNet", x: state.player.x, y: state.player.y, radius: 170 * state.stats.areaMult, color: "#69c9dc", life: 0.75 });
      splashAt(state.player.x, state.player.y, damage * 0.7, 150 * state.stats.areaMult, "#69c9dc");
    }
  }

  if (limb.baseId === "white_arm") {
    const needleCount = level >= 9 ? 5 : hasArmSet("white") ? 3 : level >= 3 ? 3 : 1;
    const targets = nearestEnemies(needleCount, 330);
    if (targets.length > 0) addAttackEffect({ type: "needleFan", x: state.player.x, y: state.player.y, points: targets.map(target => ({ x: target.x, y: target.y })), color: "#f3efe7", life: 0.28 });
    if (level >= 9) addAttackEffect({ type: "surgerySigil", x: state.player.x, y: state.player.y, points: targets.map(target => ({ x: target.x, y: target.y })), color: "#f3efe7", life: 0.8 });
    for (const target of targets) {
      const dir = normalize(target.x - state.player.x, target.y - state.player.y);
      state.projectiles.push({
        x: state.player.x,
        y: state.player.y,
        vx: dir.x * 330,
        vy: dir.y * 330,
        radius: 5,
        damage: damage * state.stats.projectileDamageMult,
        pierce: level >= 9 ? 5 : level >= 3 ? 2 : 0,
        bounce: level >= 9 ? 2 : 0,
        life: 1.1,
        fromPlayer: true,
        color: "#f3efe7",
        vfx: "white.needleTrail"
      });
    }
    if (level >= 6 || hasArmSet("white")) {
      healPlayer(3);
      addAttackEffect({ type: "healPulse", x: state.player.x, y: state.player.y, radius: 52, color: "#80cf78", life: 0.42 });
    }
  }
}

function performLegAttack(limb) {
  if (!limb || limb.kind !== "leg" || limb.organic) return;
  const level = limb.level;
  const pairBoost = hasLegSet(limb.factory) ? 1.18 : 1;
  const fullBoost = hasFullSet(limb.factory) ? 1.35 : 1;
  let damage = (15 + level * 6) * state.stats.limbDamageMult * pairBoost * fullBoost;
  if (limb.factory === "red") damage *= state.stats.fireDamageMult;

  if (limb.baseId === "red_leg") {
    const range = (level >= 9 ? 210 : level >= 6 ? 170 : 130) * state.stats.areaMult;
    const charge = level >= 3 ? clamp(state.movedDistance / 360, 1, 1.8) : 1;
    addAttackEffect({ type: "cracks", x: state.player.x, y: state.player.y, radius: range, color: "#d9584f", life: 0.45, power: charge });
    splashAt(state.player.x, state.player.y, damage * charge, range, "#d9584f");
    if (level >= 6 || hasLegSet("red")) fireWave("#d9584f", damage * 0.85);
    if (level >= 9) {
      addAttackEffect({ type: "siegeImpact", x: state.player.x, y: state.player.y, radius: range, color: "#d9584f", life: 0.7 });
      const target = nearestEnemies(1, 999)[0];
      if (target) {
        const dir = normalize(target.x - state.player.x, target.y - state.player.y);
        state.player.x = clamp(state.player.x + dir.x * 90, 28, W - 28);
        state.player.y = clamp(state.player.y + dir.y * 90, 28, H - 28);
        addAttackEffect({ type: "dashTrail", x: state.player.x, y: state.player.y, angle: Math.atan2(dir.y, dir.x), color: "#d9584f", life: 0.36 });
        splashAt(state.player.x, state.player.y, damage * 1.2, range, "#d9584f");
      }
    }
    state.movedDistance = 0;
  }

  if (limb.baseId === "blue_leg") {
    const range = (level >= 9 ? 145 : 95) * state.stats.areaMult;
    addAttackEffect({ type: "electricRing", x: state.player.x, y: state.player.y, radius: range, color: "#69c9dc", life: 0.38 });
    splashAt(state.player.x, state.player.y, damage, range, "#69c9dc");
    for (const enemy of state.enemies) {
      if (distance(state.player, enemy) <= range + enemy.radius && (level >= 6 || hasLegSet("blue"))) enemy.slow = Math.max(enemy.slow, 1.4);
    }
    if (level >= 9) {
      addAttackEffect({ type: "blinkTrail", x: state.player.x, y: state.player.y, radius: range, color: "#69c9dc", life: 0.65 });
      const target = nearestEnemies(1, 999)[0];
      if (target) {
        const dir = normalize(target.x - state.player.x, target.y - state.player.y);
        for (let i = 1; i <= 4; i += 1) {
          addAttackEffect({ type: "sparkMark", x: state.player.x + dir.x * i * 32, y: state.player.y + dir.y * i * 32, radius: 28, color: "#69c9dc", life: 0.3 });
          splashAt(state.player.x + dir.x * i * 32, state.player.y + dir.y * i * 32, damage * 0.45, 34, "#69c9dc");
        }
      }
    }
  }

  if (limb.baseId === "white_leg") {
    const range = (level >= 9 ? 150 : 96) * state.stats.areaMult;
    if (level < 9) {
      addAttackEffect({ type: "shieldPulse", x: state.player.x, y: state.player.y, radius: range, color: "#f3efe7", life: 0.5, active: level >= 6 || hasLegSet("white") });
    }
    const destroyed = clearEnemyProjectiles(range);
    if (level >= 3 || hasLegSet("white")) splashAt(state.player.x, state.player.y, damage * 0.5, range * 0.72, "#f3efe7");
    if ((level >= 6 || hasLegSet("white")) && destroyed > 0) healPlayer(Math.min(10, destroyed * 2));
    if (level >= 9) {
      addAttackEffect({ type: "bastionDome", x: state.player.x, y: state.player.y, radius: range, color: "#f3efe7", life: 0.9 });
      state.hazards.push({ x: state.player.x, y: state.player.y, radius: range, timer: 4, friendly: true, tick: 0 });
      healPlayer(10);
    }
  }
}

function clearEnemyProjectiles(range) {
  let destroyed = 0;
  state.projectiles = state.projectiles.filter(projectile => {
    if (projectile.fromPlayer) return true;
    if (distance(projectile, state.player) <= range + projectile.radius) {
      destroyed += 1;
      addAttackEffect({ type: "bulletDisintegrate", x: projectile.x, y: projectile.y, radius: projectile.radius + 26, color: "#f3efe7", life: 0.28 });
      addParticle(projectile.x, projectile.y, "#f3efe7", 4);
      return false;
    }
    return true;
  });
  return destroyed;
}

function fireWave(color, damage) {
  const target = nearestEnemies(1, 999)[0];
  if (!target) return;
  const dir = normalize(target.x - state.player.x, target.y - state.player.y);
  state.projectiles.push({
    x: state.player.x,
    y: state.player.y,
    vx: dir.x * 360,
    vy: dir.y * 360,
    radius: 7,
    damage,
    pierce: 3,
    life: 0.9,
    fromPlayer: true,
    color,
    vfx: color === "#d9584f" ? "red.flameTrail" : null
  });
}

function addLightningChain(points, empowered = false) {
  state.lightningBolts.push({
    points: points.map(point => ({ x: point.x, y: point.y })),
    life: empowered ? 0.42 : 0.32,
    maxLife: empowered ? 0.42 : 0.32,
    width: empowered ? 5 : 3,
    color: empowered ? "#b9f7ff" : "#69c9dc"
  });
}

function addAttackEffect(effect) {
  state.attackEffects.push({
    ...effect,
    maxLife: effect.life,
    seed: Math.random() * 1000
  });
}

function splashAt(x, y, damage, radius, color = "#f3efe7") {
  for (const enemy of state.enemies) {
    if (distance({ x, y }, enemy) <= radius + enemy.radius) {
      damageEnemy(enemy, damage, 6, x, y);
    }
  }
  for (const crate of state.crates) {
    if (distance({ x, y }, crate) <= radius + crate.radius) damageCrate(crate, damage);
  }
  addParticle(x, y, color, 8);
}

function nearestEnemies(count, range) {
  return state.enemies
    .map(enemy => ({ enemy, d: distance(state.player, enemy) }))
    .filter(item => item.d <= range)
    .sort((a, b) => a.d - b.d)
    .slice(0, count)
    .map(item => item.enemy);
}

function killEnemy(enemy, options = {}) {
  state.killedEnemies += 1;
  if (options.drop !== false && enemy.type !== "boss") addPickup(enemy.x, enemy.y, "coin", enemyCoinValue(enemy));
  addParticle(enemy.x, enemy.y, enemy.color, enemy.type === "boss" ? 28 : 10);
  if (enemy.type === "boss") resolveBossDeath(enemy);
}

function resolveBossDeath(boss) {
  if (state.mode !== "combat") return;
  state.bossAlive = false;
  let bonus = boss.coins;
  for (const enemy of state.enemies) {
    if (enemy !== boss && enemy.type !== "boss") {
      bonus += enemyCoinValue(enemy);
      addParticle(enemy.x, enemy.y, enemy.color, 6);
    }
  }
  state.coins += bonus;
  endRound(tr("bossReward", { line: pickNarration("bossVictory"), bonus }), true);
}

function enemyCoinValue(enemy) {
  return Math.max(1, Math.round(enemy.coins * state.stats.coinMult * earlyCoinBonus()));
}

function earlyCoinBonus() {
  if (state.round <= 3) return 1.5;
  if (state.round <= 5) return 1.25;
  return 1;
}

function enemyShoot(enemy) {
  const dir = normalize(state.player.x - enemy.x, state.player.y - enemy.y);
  state.projectiles.push({
    x: enemy.x + dir.x * enemy.radius,
    y: enemy.y + dir.y * enemy.radius,
    vx: dir.x * 175 * state.stats.enemyBulletSpeedMult,
    vy: dir.y * 175 * state.stats.enemyBulletSpeedMult,
    radius: enemy.type === "boss" ? 8 : 5,
    damage: enemy.type === "boss" ? 15 : 9,
    life: 3,
    fromPlayer: false,
    color: enemy.type === "boss" ? "#d9584f" : "#69c9dc",
    vfx: enemy.type === "boss" ? "enemy.bossHeavy" : "enemy.basic"
  });
}

function updatePlayer(dt) {
  const left = keys.has("arrowleft") || keys.has("a");
  const right = keys.has("arrowright") || keys.has("d");
  const up = keys.has("arrowup") || keys.has("w");
  const down = keys.has("arrowdown") || keys.has("s");
  const moving = left || right || up || down;
  const move = normalize((right ? 1 : 0) - (left ? 1 : 0), (down ? 1 : 0) - (up ? 1 : 0));
  if (moving) {
    const oldX = state.player.x;
    const oldY = state.player.y;
    state.player.x += move.x * state.player.speed * dt;
    state.player.y += move.y * state.player.speed * dt;
    state.movedDistance += Math.hypot(state.player.x - oldX, state.player.y - oldY);
  }
  state.player.x = clamp(state.player.x, 28, W - 28);
  state.player.y = clamp(state.player.y, 28, H - 28);
  state.player.invuln = Math.max(0, state.player.invuln - dt);
}

function updateCombat(dt) {
  state.head.timer -= dt;
  state.head.flash = Math.max(0, state.head.flash - dt);
  if (state.head.timer <= 0) {
    performHeadbutt();
    state.head.timer = state.stats.headCooldown;
  }

  for (const limb of state.limbSlots) {
    if (!limb || limb.organic) continue;
    limb.timer -= dt;
    const baseCooldown = limb.kind === "arm"
      ? limb.level >= 9 ? 1.05 : limb.level >= 6 ? 1.35 : limb.level >= 3 ? 1.65 : 1.95
      : limb.level >= 9 ? 2.0 : limb.level >= 6 ? 2.55 : limb.level >= 3 ? 3.0 : 3.45;
    const cooldown = baseCooldown * state.stats.limbCooldownMult;
    if (limb.timer <= 0) {
      if (limb.kind === "arm") performArmAttack(limb);
      else performLegAttack(limb);
      limb.timer = cooldown;
    }
  }
}

function updateEnemies(dt) {
  const speedPhase = state.round >= 5 ? 1.28 : 1;
  for (const enemy of state.enemies) {
    const dir = normalize(state.player.x - enemy.x, state.player.y - enemy.y);
    const d = distance(state.player, enemy);
    const slowMult = enemy.slow > 0 ? 0.55 : 1;
    let desiredSpeed = enemy.speed * speedPhase * slowMult * (1 + state.round * 0.025);

    if (enemy.range && d < enemy.range) {
      desiredSpeed *= enemy.type === "boss" ? 0.48 : 0.25;
      enemy.shootTimer -= dt;
      if (enemy.shootTimer <= 0) {
        enemyShoot(enemy);
        enemy.shootTimer = Math.max(0.65, enemy.shootCd - state.round * 0.04);
      }
    }

    enemy.x += dir.x * desiredSpeed * dt;
    enemy.y += dir.y * desiredSpeed * dt;
    enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
    enemy.contactCd = Math.max(0, enemy.contactCd - dt);
    enemy.slow = Math.max(0, enemy.slow - dt);
    if (enemy.burn > 0) {
      enemy.burn = Math.max(0, enemy.burn - dt);
      enemy.hp -= (8 + state.round) * dt;
    }

    if (d < state.player.radius + enemy.radius && enemy.contactCd <= 0) {
      damagePlayer(enemy.damage);
      enemy.contactCd = 0.75;
    }
  }

  for (let i = state.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = state.enemies[i];
    if (enemy.hp <= 0) {
      state.enemies.splice(i, 1);
      killEnemy(enemy);
      if (state.mode !== "combat") break;
    }
  }
}

function updateProjectiles(dt) {
  for (const projectile of state.projectiles) {
    if (projectile.homing) {
      const desired = normalize(state.player.x - projectile.x, state.player.y - projectile.y);
      const speed = Math.hypot(projectile.vx, projectile.vy) || 1;
      projectile.vx += desired.x * speed * projectile.turnRate * dt;
      projectile.vy += desired.y * speed * projectile.turnRate * dt;
      const fixed = normalize(projectile.vx, projectile.vy);
      projectile.vx = fixed.x * speed;
      projectile.vy = fixed.y * speed;
    }
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    projectile.life -= dt;

    if (projectile.fromPlayer) {
      for (const enemy of state.enemies) {
        if (distance(projectile, enemy) < projectile.radius + enemy.radius) {
          damageEnemy(enemy, projectile.damage, 4, projectile.x, projectile.y);
          if (projectile.vfx === "red.flameTrail") {
            addAttackEffect({ type: "fireImpact", x: projectile.x, y: projectile.y, radius: 54, color: "#d9584f", life: 0.34 });
          }
          if (projectile.vfx === "white.needleTrail") {
            addAttackEffect({ type: "needleImpact", x: projectile.x, y: projectile.y, radius: 38, color: "#f3efe7", life: 0.24 });
          }
          projectile.pierce -= 1;
          if (projectile.bounce > 0) {
            const next = nearestEnemies(1, 260).find(target => target !== enemy);
            if (next) {
              const dir = normalize(next.x - projectile.x, next.y - projectile.y);
              projectile.vx = dir.x * 330;
              projectile.vy = dir.y * 330;
              projectile.bounce -= 1;
              projectile.pierce = Math.max(projectile.pierce, 0);
            }
          }
          if (projectile.pierce < 0) projectile.life = 0;
          break;
        }
      }
      for (const crate of state.crates) {
        if (distance(projectile, crate) < projectile.radius + crate.radius) {
          damageCrate(crate, projectile.damage);
          projectile.life = 0;
          break;
        }
      }
    } else if (distance(projectile, state.player) < projectile.radius + state.player.radius) {
      projectile.life = 0;
      damagePlayer(projectile.damage);
    }
  }
  state.projectiles = state.projectiles.filter(p => p.life > 0 && p.x > -90 && p.x < W + 90 && p.y > -90 && p.y < H + 90);
}

function updatePickups(dt) {
  for (const pickup of state.pickups) {
    pickup.pulse += dt * 6;
    const d = distance(pickup, state.player);
    if (d < state.player.pickup) {
      const dir = normalize(state.player.x - pickup.x, state.player.y - pickup.y);
      const pull = 170 + (state.player.pickup - d) * 5;
      pickup.x += dir.x * pull * dt;
      pickup.y += dir.y * pull * dt;
    }
    if (d < state.player.radius + pickup.radius + 5) {
      if (pickup.kind === "coin") state.coins += pickup.amount;
      if (pickup.kind === "heal") healPlayer(pickup.amount);
      pickup.collected = true;
      addParticle(pickup.x, pickup.y, pickup.kind === "coin" ? "#e4b84d" : "#80cf78", 5);
    }
  }
  state.pickups = state.pickups.filter(pickup => !pickup.collected);
}

function updateCrates(dt) {
  for (const crate of state.crates) crate.hitFlash = Math.max(0, crate.hitFlash - dt);
  state.crates = state.crates.filter(crate => !crate.destroyed);
}

function updateParticles(dt) {
  for (const p of state.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 0.92;
    p.vy *= 0.92;
    p.life -= dt;
  }
  state.particles = state.particles.filter(p => p.life > 0);

  for (const bolt of state.lightningBolts) bolt.life -= dt;
  state.lightningBolts = state.lightningBolts.filter(bolt => bolt.life > 0);

  for (const effect of state.attackEffects) effect.life -= dt;
  state.attackEffects = state.attackEffects.filter(effect => effect.life > 0);
}

function updateSpawns(dt) {
  const interval = spawnIntervalForRound(state.round);
  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    spawnEnemy();
    if (state.round >= 5 && Math.random() < Math.min(0.48, 0.12 + state.round * 0.035)) spawnEnemy();
    if (state.round >= 9 && Math.random() < 0.16) spawnEnemy();
    spawnTimer = interval;
  }
}

function spawnIntervalForRound(round) {
  if (round <= 1) return 1.85;
  if (round === 2) return 1.65;
  if (round === 3) return 1.45;
  return clamp(1.45 - (round - 3) * 0.11, 0.38, 1.45);
}

function updateBossAttacks(dt) {
  const boss = state.enemies.find(enemy => enemy.type === "boss");
  if (!boss) return;
  const tier = Math.floor(state.round / 3);
  const atk = state.bossAttack;

  if (tier >= 2) {
    atk.bombTimer -= dt;
    if (atk.bombTimer <= 0) {
      spawnBombHazards(4 + Math.max(0, tier - 6));
      atk.bombTimer = Math.max(4.5, 7 - tier * 0.15);
    }
  }

  if (tier >= 3) {
    atk.burstTimer -= dt;
    if (atk.burstTimer <= 0 && atk.burstShots <= 0) {
      atk.burstShots = 16 + Math.min(10, tier * 2);
      atk.burstInterval = 0;
      atk.burstTimer = Math.max(6.5, 9 - tier * 0.18);
    }
    if (atk.burstShots > 0) {
      atk.burstInterval -= dt;
      if (atk.burstInterval <= 0) {
        fireBossBurst(boss);
        atk.burstShots -= 1;
        atk.burstInterval = 0.12;
      }
    }
  }

  if (tier >= 4) {
    atk.homingTimer -= dt;
    if (atk.homingTimer <= 0) {
      fireHomingShots(boss, 5 + Math.max(0, tier - 6));
      atk.homingTimer = Math.max(5.5, 8 - tier * 0.12);
    }
  }

  if (tier >= 5) {
    atk.ringTimer -= dt;
    if (atk.ringTimer <= 0) {
      fireBossRing(boss, 18 + Math.min(12, tier * 2));
      atk.ringTimer = Math.max(7, 12 - tier * 0.18);
    }
  }
}

function spawnBombHazards(count) {
  for (let i = 0; i < count; i += 1) {
    state.hazards.push({
      x: 70 + Math.random() * (W - 140),
      y: 70 + Math.random() * (H - 140),
      radius: 44 + Math.random() * 18,
      timer: 1.2,
      damage: 24 + state.round * 3,
      color: "#d9584f",
      bomb: true,
      vfx: "enemy.bossBombardment"
    });
  }
}

function fireBossBurst(boss) {
  const dir = normalize(state.player.x - boss.x, state.player.y - boss.y);
  const spread = (Math.random() - 0.5) * 0.22;
  const a = Math.atan2(dir.y, dir.x) + spread;
  const speed = 220 * state.stats.enemyBulletSpeedMult;
  state.projectiles.push({
    x: boss.x,
    y: boss.y,
    vx: Math.cos(a) * speed,
    vy: Math.sin(a) * speed,
    radius: 5,
    damage: 10,
    life: 3,
    fromPlayer: false,
    color: "#d9584f",
    vfx: "enemy.bossBurst"
  });
}

function fireHomingShots(boss, count) {
  for (let i = 0; i < count; i += 1) {
    const a = (i / count) * TAU;
    const speed = 135 * state.stats.enemyBulletSpeedMult;
    state.projectiles.push({
      x: boss.x + Math.cos(a) * boss.radius,
      y: boss.y + Math.sin(a) * boss.radius,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed,
      radius: 7,
      damage: 13,
      life: 3,
      homing: true,
      turnRate: 3.2,
      fromPlayer: false,
      color: "#e4b84d",
      vfx: "enemy.bossHoming"
    });
  }
}

function fireBossRing(boss, count) {
  for (let i = 0; i < count; i += 1) {
    const a = (i / count) * TAU;
    const speed = 95 * state.stats.enemyBulletSpeedMult;
    state.projectiles.push({
      x: boss.x,
      y: boss.y,
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed,
      radius: 5,
      damage: 8,
      life: 3,
      fromPlayer: false,
      color: "#69c9dc",
      vfx: "enemy.bossRing"
    });
  }
}

function updateHazards(dt) {
  for (const hazard of state.hazards) {
    hazard.timer -= dt;
    if (hazard.friendly) {
      hazard.tick -= dt;
      if (hazard.tick <= 0) {
        splashAt(hazard.x, hazard.y, 14 + state.round, hazard.radius, "#f3efe7");
        hazard.tick = 0.55;
      }
      continue;
    }
    if (hazard.timer <= 0 && !hazard.exploded) {
      hazard.exploded = true;
      if (distance(hazard, state.player) <= hazard.radius + state.player.radius) {
        damagePlayer(hazard.damage, true, "bomb");
      }
      splashAt(hazard.x, hazard.y, 0, hazard.radius, hazard.color);
    }
  }
  state.hazards = state.hazards.filter(hazard => hazard.timer > -0.18);
}

function updateRoundTimer(dt) {
  state.roundTime -= dt;
  if (state.roundTime <= 0) {
    state.roundTime = 0;
    if (state.bossAlive) {
      if (!state.bossNoticeShown) {
        showBanner(tr("bossExtend"));
        state.bossNoticeShown = true;
      }
    } else {
      endRound(pickNarration("roundEnd"), false);
    }
  }
}

function endRound(reason, bossRewarded) {
  state.mode = "shop";
  if (!bossRewarded) clearField(false);
  else clearField(true);
  if (state.stats.regenPerRound > 0) healPlayer(state.stats.regenPerRound);
  buildShopOffers();
  renderShop(reason);
  shopModal.classList.remove("hidden");
  pauseBadge.classList.add("hidden");
  updateHud();
}

function clearField(keepCoins) {
  state.enemies = [];
  state.crates = [];
  state.projectiles = [];
  state.hazards = [];
  state.lightningBolts = [];
  state.attackEffects = [];
  if (!keepCoins) state.pickups = [];
}

function update(dt) {
  if (bannerTimer > 0) {
    bannerTimer -= dt;
    if (bannerTimer <= 0) centerBanner.classList.add("hidden");
  }
  updateParticles(dt);

  if (state.mode !== "combat") {
    updateHud();
    return;
  }

  dt *= state.timeScale;
  updateRoundTimer(dt);
  if (state.mode !== "combat") return;
  updateSpawns(dt);
  updateBossAttacks(dt);
  updatePlayer(dt);
  updateCombat(dt);
  updateEnemies(dt);
  if (state.mode !== "combat") return;
  updateProjectiles(dt);
  updateHazards(dt);
  updatePickups(dt);
  updateCrates(dt);
  updateHud();
}

function buildShopOffers() {
  if (state.testMode) {
    buildTestShopOffers();
    return;
  }

  const extraGoods = state.relics.includes("black_interface") ? 2 : 0;
  const offers = {
    buy: [],
    upgrade: [],
    sell: [],
    relic: [],
    body: []
  };

  if (state.head.level < 9) {
    offers.body.push({
      title: tr("buyHead", { from: state.head.level, to: state.head.level + 1 }),
      tags: [tr("headbutt"), stageTag(state.head.level + 1)],
      desc: tr("buyHeadDesc"),
      icon: { type: "head", glyph: "H", level: state.head.level + 1 },
      cost: priced(24 + state.head.level * 14),
      action() {
        state.head.level += 1;
        applyStats();
      }
    });
  }

  offers.body.push({
    title: tr("buySlot"),
    tags: [tr("limbSlots"), tr("permanent")],
    desc: tr("buySlotDesc"),
    icon: { type: "slot", glyph: "+", level: state.limbSlots.length - 3 },
    cost: priced(82 + (state.limbSlots.length - 4) * 42 + (state.debt > 0 ? 35 : 0)),
    action() {
      state.limbSlots.push(null);
      if (state.debt > 0) state.debt -= 1;
      applyStats();
    }
  });

  const randomProsthetics = shuffle([...prostheticCatalog]).slice(0, 3 + Math.min(1, extraGoods));
  for (const proto of randomProsthetics) {
    const level = randomShopLimbLevel();
    const shopLimb = createShopProsthetic(proto, level);
    offers.buy.push({
      title: tr("buyProsthetic", { name: protoName(proto), level: level > 1 ? ` Lv.${level}` : "" }),
      tags: [kindName(proto.kind), factoryName(proto.factory), level > 1 ? tr("preLevelTag", { level }) : tr("baseModel")],
      desc: `${protoDesc(proto)} ${level > 1 ? tr("preLevelDesc", { level }) : ""}`,
      icon: { type: "prosthetic", id: proto.id, factory: proto.factory, level },
      cost: priced(proto.cost + state.round * 5 + (level - 1) * (20 + level * 7)),
      disabled: () => emptySlotIndex() === -1,
      disabledText: tr("needSlot"),
      action() {
        const index = emptySlotIndex();
        if (index !== -1) state.limbSlots[index] = shopLimb;
        applyStats();
      }
    });
  }

  const upgradeCandidates = [];
  state.limbSlots.forEach((limb, index) => {
    if (!limb) return;
    if (!limb.organic && limb.level < 9) {
      upgradeCandidates.push({
        title: tr("upgradeLimb", { slot: slotLabel(index), name: limbName(limb) }),
        tags: [factoryName(limb.factory), `Lv.${limb.level}`],
        desc: tr("upgradeLimbDesc", { stage: stageText(limb.level + 1) }),
        icon: { type: "prosthetic", id: limb.baseId, factory: limb.factory, level: limb.level + 1 },
        cost: priced((18 + limb.level * 12 + state.round * 3) * (state.relics.includes("combat_chip") ? 0.9 : 1)),
        action() {
          limb.level += 1;
          applyStats();
        }
      });
    }
    offers.sell.push({
      title: tr("sellLimb", { slot: slotLabel(index), name: limbName(limb) }),
      tags: [limb.organic ? tr("organicLimb") : factoryName(limb.factory), tr("sell")],
      desc: tr("sellDesc"),
      icon: { type: "prosthetic", id: limb.baseId, factory: limb.factory, level: limb.level },
      cost: 0,
      free: true,
      action() {
        state.coins += limb.organic ? 24 : limb.value + limb.level * 7;
        state.limbSlots[index] = null;
        applyStats();
      }
    });
  });
  offers.upgrade = shuffle(upgradeCandidates).slice(0, Math.min(upgradeCandidates.length, 1 + Math.floor(Math.random() * 3)));

  const relics = shuffle(relicCatalog.filter(relic => !state.relics.includes(relic.id))).slice(0, 3 + Math.min(1, extraGoods));
  for (const relic of relics) {
    offers.relic.push({
      title: relicTitle(relic),
      tags: [tr("permanentRelic"), relic.sideEffect ? tr("sideEffect") : tr("positive")],
      desc: relicDesc(relic),
      icon: { type: "relic", id: relic.id, glyph: relicIconGlyphs[relic.id] || "P", sideEffect: relic.sideEffect },
      cost: priced(relic.cost + Math.floor(state.round * 4)),
      action() {
        applyRelic(relic);
        applyStats();
      }
    });
  }

  applyShopDiscounts(offers);
  state.shopOffers = offers;
}

function buildTestShopOffers() {
  const offers = {
    buy: [],
    upgrade: [],
    sell: [],
    relic: [],
    body: []
  };

  for (const proto of prostheticCatalog) {
    for (const level of [1, 3, 6, 9]) {
      const shopLimb = createShopProsthetic(proto, level);
      offers.buy.push({
        title: tr("testBuy", { name: protoName(proto), level }),
        tags: [kindName(proto.kind), factoryName(proto.factory), tr("free")],
        desc: tr("testBuyDesc", { desc: protoDesc(proto), level }),
        icon: { type: "prosthetic", id: proto.id, factory: proto.factory, level },
        cost: 0,
        disabled: () => emptySlotIndex() === -1,
        disabledText: tr("needSlot"),
        action() {
          const index = emptySlotIndex();
          if (index !== -1) state.limbSlots[index] = { ...shopLimb, id: `${shopLimb.id}_${Date.now()}` };
          applyStats();
        }
      });
    }
  }

  state.limbSlots.forEach((limb, index) => {
    if (!limb) return;
    if (!limb.organic && limb.level < 9) {
      offers.upgrade.push({
        title: tr("testUpgrade", { slot: slotLabel(index), name: limbName(limb) }),
        tags: [factoryName(limb.factory), `Lv.${limb.level}`, tr("free")],
        desc: tr("testUpgradeDesc", { stage: stageText(limb.level + 1) }),
        icon: { type: "prosthetic", id: limb.baseId, factory: limb.factory, level: limb.level + 1 },
        cost: 0,
        action() {
          limb.level += 1;
          applyStats();
        }
      });
    }
    offers.sell.push({
      title: tr("testSell", { slot: slotLabel(index), name: limbName(limb) }),
      tags: [limb.organic ? tr("organicLimb") : factoryName(limb.factory), tr("free")],
      desc: tr("testSellDesc"),
      icon: { type: "prosthetic", id: limb.baseId, factory: limb.factory, level: limb.level },
      cost: 0,
      free: true,
      action() {
        state.limbSlots[index] = null;
        applyStats();
      }
    });
  });

  for (const relic of relicCatalog.filter(relic => !state.relics.includes(relic.id))) {
    offers.relic.push({
      title: tr("testRelic", { name: relicTitle(relic) }),
      tags: [tr("permanentRelic"), relic.sideEffect ? tr("sideEffect") : tr("positive"), tr("free")],
      desc: relicDesc(relic),
      icon: { type: "relic", id: relic.id, glyph: relicIconGlyphs[relic.id] || "P", sideEffect: relic.sideEffect },
      cost: 0,
      action() {
        applyRelic(relic);
        applyStats();
      }
    });
  }

  offers.body.push({
    title: tr("testSlot"),
    tags: [tr("limbSlots"), tr("free")],
    desc: tr("testSlotDesc"),
    icon: { type: "slot", glyph: "+", level: state.limbSlots.length - 3 },
    cost: 0,
    action() {
      state.limbSlots.push(null);
      applyStats();
    }
  });

  if (state.head.level < 9) {
    offers.body.push({
      title: tr("buyHead", { from: state.head.level, to: state.head.level + 1 }),
      tags: [tr("headbutt"), tr("free")],
      desc: tr("testHeadDesc"),
      icon: { type: "head", glyph: "H", level: state.head.level + 1 },
      cost: 0,
      action() {
        state.head.level += 1;
        applyStats();
      }
    });
  }

  state.shopOffers = offers;
}

function priced(value) {
  return Math.max(1, Math.round(value * (state.stats.shopPriceMult || 1)));
}

function randomShopLimbLevel() {
  const maxLevel = clamp(Math.floor((state.round - 1) / 2) + 1, 1, 9);
  if (maxLevel <= 1) return 1;
  const roll = Math.random();
  if (roll < 0.55) return 1;
  if (roll < 0.82) return clamp(1 + Math.floor(Math.random() * Math.min(maxLevel, 3)), 1, maxLevel);
  if (roll < 0.96) return clamp(3 + Math.floor(Math.random() * Math.max(1, Math.min(maxLevel - 2, 3))), 1, maxLevel);
  return maxLevel;
}

function applyRelic(relic) {
  state.relics.push(relic.id);
  if (relic.id === "shop_debt") {
    state.coins += 70;
    state.debt += 2;
  }
}

function applyShopDiscounts(groups) {
  const candidates = Object.values(groups).flat().filter(offer => !offer.free);
  const count = Math.min(candidates.length, 1 + Math.floor(Math.random() * 2));
  for (const offer of shuffle(candidates).slice(0, count)) {
    const ratio = 0.25 + Math.random() * 0.25;
    offer.originalCost = offer.cost;
    offer.cost = Math.max(1, Math.round(offer.cost * ratio));
    offer.discountPercent = Math.round((1 - ratio) * 100);
    offer.discountLabel = tr("sale", { percent: offer.discountPercent });
  }
}

function renderShop(reason) {
  shopKicker.textContent = state.testMode ? tr("shopTestKicker") : tr("shopRoundKicker", { round: state.round });
  shopTitle.textContent = reason || tr("shopDefaultTitle");
  nextRoundButton.textContent = state.testMode ? tr("startCombat") : tr("nextRound");
  testRoundControl.classList.toggle("hidden", !state.testMode);
  shopSummary.innerHTML = `
    <span>${tr("summaryCoins", { coins: state.coins })}</span>
    <span>${tr("summarySlots", { filled: filledSlotCount(), total: state.limbSlots.length })}</span>
    <span>${tr("summarySets", { sets: state.setBonus.text })}</span>
  `;
  shopGrid.innerHTML = "";

  const groups = [
    ["upgrade", tr("groupUpgrade")],
    ["sell", tr("groupSell")],
    ["buy", tr("groupBuy")],
    ["relic", tr("groupRelic")],
    ["body", tr("groupBody")]
  ];

  for (const [key, title] of groups) {
    const section = document.createElement("section");
    section.className = "shop-section";
    section.innerHTML = `<h3>${title}</h3><div class="shop-section-grid"></div>`;
    const grid = section.querySelector(".shop-section-grid");
    const list = state.shopOffers[key] || [];
    if (list.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-shop";
      empty.textContent = key === "upgrade" ? tr("emptyUpgrade") : tr("emptyOption");
      grid.appendChild(empty);
    }
    for (const offer of list) grid.appendChild(renderOfferCard(offer));
    shopGrid.appendChild(section);
  }
}

function isGoldTag(tag) {
  return [tr("sideEffect"), tr("permanent"), tr("permanentRelic"), tr("free")].includes(tag)
    || tag.startsWith(chooseText("特价", "SALE"));
}

function renderOfferCard(offer) {
  const cost = typeof offer.cost === "function" ? offer.cost() : offer.cost;
  const blocked = offer.used || (offer.disabled ? offer.disabled() : false);
  const affordable = offer.free || state.coins >= cost;
  const node = document.createElement("article");
  node.className = `shop-item ${offer.discountLabel ? "sale" : ""}`;
  const priceText = offer.used
    ? tr("used")
    : offer.free
    ? tr("free")
    : offer.discountLabel
      ? tr("priceOriginal", { cost, original: offer.originalCost })
      : tr("price", { cost });
  const discountLabel = offer.discountPercent ? tr("sale", { percent: offer.discountPercent }) : offer.discountLabel;
  node.innerHTML = `
    ${renderShopIcon(offer.icon)}
    <div class="item-title-row">
      <h3>${offer.title}</h3>
      ${discountLabel ? `<strong class="sale-badge">${discountLabel}</strong>` : ""}
    </div>
    <div class="tag-row">${offer.tags.map(tag => `<span class="tag ${isGoldTag(tag) ? "gold" : ""}">${tag}</span>`).join("")}</div>
    <p>${offer.used ? tr("offerUsedDesc") : offer.desc}</p>
    ${blocked && !offer.used ? `<p class="blocked-note">${offer.disabledText}</p>` : ""}
    <button ${!blocked && affordable ? "" : "disabled"}>${priceText}</button>
  `;
  node.querySelector("button").addEventListener("click", () => {
    if (blocked) return;
    if (!offer.free && state.coins < cost) return;
    if (!offer.free) state.coins -= cost;
    offer.action();
    offer.used = true;
    if (state.testMode) buildShopOffers();
    renderShop(tr("tradeDone"));
    updateHud();
  });
  return node;
}

function artTierIndex(level = 1) {
  if (level >= 9) return 3;
  if (level >= 6) return 2;
  if (level >= 3) return 1;
  return 0;
}

function prostheticSprite(id, level = 1) {
  const set = gameSprites.prosthetics[id];
  if (!set) return null;
  return set.tiers[artTierIndex(level)] || set.icon;
}

function prostheticShopSprite(id, level = 1) {
  const set = gameSprites.prosthetics[id];
  if (!set) return null;
  return level <= 1 ? set.icon : prostheticSprite(id, level);
}

function enemySprite(type) {
  if (type === "boss") return gameSprites.enemies.boss;
  if (type === "shooter") return gameSprites.enemies.shooter;
  if (type === "sprinter") return gameSprites.enemies.sprinter;
  if (type === "orderly") return gameSprites.enemies.orderly;
  return gameSprites.enemies.chaser;
}

function atlasCss(sprite) {
  if (!sprite) return "";
  const sizeX = (ART_ATLAS_SIZE.w / sprite.w) * 100;
  const sizeY = (ART_ATLAS_SIZE.h / sprite.h) * 100;
  const posX = sprite.x / Math.max(1, ART_ATLAS_SIZE.w - sprite.w) * 100;
  const posY = sprite.y / Math.max(1, ART_ATLAS_SIZE.h - sprite.h) * 100;
  return `background-image:url('${ART_ATLAS_SRC}');background-size:${sizeX}% ${sizeY}%;background-position:${posX}% ${posY}%;`;
}

function drawAtlasSprite(sprite, x, y, width, height, options = {}) {
  const image = sprite?.image;
  if (!image || !image.complete || !image.naturalWidth) return false;
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawW = image.naturalWidth * scale;
  const drawH = image.naturalHeight * scale;
  ctx.save();
  ctx.globalAlpha *= options.alpha ?? 1;
  if (options.glow) {
    ctx.shadowColor = options.glow;
    ctx.shadowBlur = options.blur ?? 10;
  }
  ctx.translate(x, y);
  if (options.flipX) ctx.scale(-1, 1);
  if (options.rotate) ctx.rotate(options.rotate);
  ctx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();
  return true;
}

function drawVfxSprite(sprite, x, y, width, height, options = {}) {
  return drawAtlasSprite(sprite, x, y, width, height, options);
}

function renderShopIcon(icon = {}) {
  const visual = icon.id ? prostheticVisuals[icon.id] : null;
  const glyph = icon.glyph || visual?.glyph || "?";
  const family = icon.factory || (icon.id && prostheticCatalog.find(item => item.id === icon.id)?.factory) || icon.type || "neutral";
  const level = icon.level || 1;
  const tier = level >= 9 ? "tier-9" : level >= 6 ? "tier-6" : level >= 3 ? "tier-3" : "tier-1";
  const side = icon.sideEffect ? " side-effect" : "";
  const sprite = icon.type === "prosthetic"
    ? prostheticShopSprite(icon.id, level)
    : icon.type === "relic"
      ? gameSprites.relics[icon.id]
      : icon.type === "head"
        ? gameSprites.head
        : icon.type === "slot"
          ? gameSprites.slot
          : null;
  const spriteMarkup = sprite
    ? `<img class="atlas-sprite ${icon.type || "misc"}" src="${sprite.src}" alt="">`
    : `<span class="icon-core">${glyph}</span>`;
  return `
    <div class="shop-visual ${family} ${tier}${side}">
      ${spriteMarkup}
      <span class="icon-circuit"></span>
      ${icon.type === "prosthetic" ? `<span class="icon-level">Lv.${level}</span>` : ""}
    </div>
  `;
}

function emptySlotIndex() {
  return state.limbSlots.findIndex(slot => slot === null);
}

function filledSlotCount() {
  return state.limbSlots.filter(Boolean).length;
}

function kindName(kind) {
  return kind === "arm" ? tr("arm") : tr("leg");
}

function slotLabel(index) {
  return tr("slot", { slot: index + 1 });
}

function stageTag(level) {
  if (level >= 9) return tr("evolved");
  if (level % 3 === 0) return tr("mechanicUpgrade");
  return tr("numericUpgrade");
}

function stageText(level) {
  if (level >= 9) return tr("stage9");
  if (level <= 3) return tr("stage3");
  if (level <= 6) return tr("stage6");
  return tr("stage9");
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function pickLine(lines) {
  return lines[Math.floor(Math.random() * lines.length)];
}

function drawGrid() {
  ctx.fillStyle = "#101313";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(228, 184, 77, 0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(217, 88, 79, 0.22)";
  ctx.lineWidth = 5;
  ctx.strokeRect(10, 10, W - 20, H - 20);
}

function drawPlayer() {
  const p = state.player;
  ctx.save();
  ctx.translate(p.x, p.y);
  if (p.invuln > 0 && Math.floor(p.invuln * 24) % 2 === 0) ctx.globalAlpha = 0.55;
  drawSetAura();

  if (drawAtlasSprite(gameSprites.player, 0, 5, 50, 112, { glow: "#69c9dc", blur: 10 })) {
    drawEquippedLimbs();
    drawSetAura(true);
    if (state.head.flash > 0) {
      ctx.strokeStyle = "rgba(243, 239, 231, 0.55)";
      ctx.lineWidth = 5;
      ctx.rotate(state.head.angle || 0);
      ctx.beginPath();
      ctx.ellipse((state.head.range || 90) / 2, 0, (state.head.range || 90) / 2, (state.head.width || 48) / 2, 0, 0, TAU);
      ctx.stroke();
    }
    ctx.restore();
    return;
  }

  ctx.shadowColor = "#69c9dc";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#171b21";
  ctx.strokeStyle = "#050506";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-17, -12);
  ctx.lineTo(12, -18);
  ctx.lineTo(21, 4);
  ctx.lineTo(8, 22);
  ctx.lineTo(-15, 18);
  ctx.lineTo(-22, -2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#d9584f";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-11, -7);
  ctx.lineTo(9, -11);
  ctx.lineTo(15, 3);
  ctx.stroke();

  ctx.fillStyle = "#69c9dc";
  ctx.strokeStyle = "#050506";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.rect(3, -7, 8, 5);
  ctx.fill();
  ctx.stroke();

  drawEquippedLimbs();

  if (state.head.flash > 0) {
    ctx.strokeStyle = "rgba(243, 239, 231, 0.55)";
    ctx.lineWidth = 5;
    ctx.rotate(state.head.angle || 0);
    ctx.beginPath();
    ctx.ellipse((state.head.range || 90) / 2, 0, (state.head.range || 90) / 2, (state.head.width || 48) / 2, 0, 0, TAU);
    ctx.stroke();
  }

  ctx.restore();
}

function drawSetAura(overlay = false) {
  const activeSets = [
    ...(state.setBonus?.fullFactories || []).map(factory => ({ factory, radius: 42, width: 3, alpha: 0.48 })),
    ...(state.setBonus?.armFactories || []).filter(factory => !hasFullSet(factory)).map(factory => ({ factory, radius: 34, width: 2, alpha: 0.32 })),
    ...(state.setBonus?.legFactories || []).filter(factory => !hasFullSet(factory)).map(factory => ({ factory, radius: 48, width: 2, alpha: 0.3 }))
  ];
  if (activeSets.length === 0) return;
  const time = performance.now() / 450;
  ctx.save();
  if (drawVfxSprite(vfxSprites.shared.setResonanceAura, 0, 8, 162, 118, {
    glow: "#69c9dc",
    blur: overlay ? 4 : 10,
    alpha: overlay ? 0.32 : 0.68,
    rotate: Math.sin(time * 0.18) * 0.08
  })) {
    ctx.restore();
    return;
  }
  activeSets.slice(0, 6).forEach((set, index) => {
    const color = factories[set.factory].color;
    ctx.globalAlpha = set.alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = set.width;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(0, 8, set.radius + Math.sin(time + index) * 3, set.radius * 0.48, 0, (time + index) % TAU, (time + index) % TAU + TAU * 0.78);
    ctx.stroke();
  });
  ctx.restore();
}

function drawEquippedLimbs() {
  const limbs = state.limbSlots.filter(limb => limb && !limb.organic);
  const arms = limbs.filter(limb => limb.kind === "arm");
  const legs = limbs.filter(limb => limb.kind === "leg");

  legs.slice(0, 6).forEach((limb, index) => drawFloatingProsthetic(limb, index, legs.length, "leg"));

  if (arms.length === 0) {
    ctx.strokeStyle = "#7a4b45";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-16, 1);
    ctx.lineTo(-28, 9);
    ctx.moveTo(16, 1);
    ctx.lineTo(28, 9);
    ctx.stroke();
  }

  arms.slice(0, 6).forEach((limb, index) => drawFloatingProsthetic(limb, index, arms.length, "arm"));
}

function drawFloatingProsthetic(limb, index, total, kind) {
  const visual = prostheticVisuals[limb.baseId] || prostheticVisuals.organic_leg;
  const color = limb.organic ? visual.accent : factories[limb.factory].color;
  const tier = limb.level >= 9 ? 3 : limb.level >= 6 ? 2 : limb.level >= 3 ? 1 : 0;
  const side = index % 2 === 0 ? -1 : 1;
  const row = Math.floor(index / 2);
  const bob = Math.sin(performance.now() / 260 + index) * 3;
  const x = kind === "arm" ? side * (50 + row * 14) : (index - (total - 1) / 2) * 30;
  const y = kind === "arm" ? -8 + row * 18 + bob : 48 + row * 14 + bob;
  const sprite = prostheticSprite(limb.baseId, limb.level);
  const scale = kind === "arm" ? 1 : 0.92;
  const width = (kind === "arm" ? 54 : 46) * scale * (1 + tier * 0.06);
  const height = (kind === "arm" ? 62 : 56) * scale * (1 + tier * 0.06);
  const rotate = (kind === "arm" ? side * 0.18 : 0) + Math.sin(performance.now() / 500 + index) * 0.08;
  const flipX = x > 0;
  if (drawAtlasSprite(sprite, x, y, width, height, { glow: color, blur: 8 + tier * 5, rotate, flipX })) {
    return;
  }

  ctx.save();
  ctx.translate(x, y);
  if (flipX) ctx.scale(-1, 1);
  ctx.rotate((kind === "arm" ? side * 0.18 : 0) + Math.sin(performance.now() / 500 + index) * 0.08);
  ctx.shadowColor = color;
  ctx.shadowBlur = 8 + tier * 5;
  ctx.strokeStyle = "#050506";
  ctx.lineWidth = 5;
  ctx.fillStyle = limb.organic ? "#6a5145" : "#15191f";
  ctx.beginPath();
  if (kind === "arm") {
    ctx.moveTo(-14, -8);
    ctx.lineTo(12, -11);
    ctx.lineTo(18, 8);
    ctx.lineTo(-10, 13);
  } else {
    ctx.moveTo(-10, -14);
    ctx.lineTo(12, -8);
    ctx.lineTo(8, 18);
    ctx.lineTo(-12, 18);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2 + tier;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.font = `${10 + tier * 2}px Microsoft YaHei, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(visual.glyph, 0, 1);
  if (tier >= 1) {
    ctx.beginPath();
    ctx.arc(0, 0, 18 + tier * 4, 0.1, TAU - 0.7);
    ctx.stroke();
  }
  ctx.restore();
}

function drawEnemies() {
  for (const enemy of state.enemies) {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    const neon = enemy.type === "boss" ? "#d9584f" : enemy.type === "shooter" ? "#69c9dc" : enemy.type === "orderly" ? "#e4b84d" : "#80cf78";
    const sprite = enemySprite(enemy.type);
    const spriteW = enemy.type === "boss" ? enemy.radius * 2.55 : enemy.radius * 2.6;
    const spriteH = enemy.type === "boss" ? enemy.radius * 2.65 : enemy.radius * 3.05;
    if (drawAtlasSprite(sprite, 0, enemy.type === "boss" ? -4 : -3, spriteW, spriteH, {
      glow: neon,
      blur: enemy.type === "boss" ? 18 : 8,
      alpha: enemy.hitFlash > 0 ? 0.7 : 1
    })) {
      if (enemy.hitFlash > 0) {
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, 0, enemy.radius * 1.1, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = "#13100e";
      ctx.fillRect(-enemy.radius, -enemy.radius - 12, enemy.radius * 2, 4);
      ctx.fillStyle = neon;
      ctx.fillRect(-enemy.radius, -enemy.radius - 12, enemy.radius * 2 * Math.max(0, enemy.hp / enemy.maxHp), 4);
      if (enemy.type === "boss") {
        ctx.strokeStyle = "rgba(217, 88, 79, 0.45)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.radius + 10, 0, TAU);
        ctx.stroke();
      }
      if (enemy.burn > 0) {
        drawVfxSprite(vfxSprites.red.burnMarker, 0, 0, enemy.radius * 2.35, enemy.radius * 2.35, { glow: "#d9584f", blur: 9, alpha: 0.78, rotate: performance.now() / 900 });
      }
      ctx.restore();
      continue;
    }
    ctx.shadowColor = neon;
    ctx.shadowBlur = enemy.type === "boss" ? 18 : 8;
    ctx.fillStyle = enemy.hitFlash > 0 ? "#ffffff" : "#1a1d22";
    ctx.strokeStyle = "#050506";
    ctx.lineWidth = enemy.type === "boss" ? 6 : 4;
    ctx.beginPath();
    if (enemy.type === "shooter") {
      ctx.moveTo(0, -enemy.radius - 4);
      ctx.lineTo(enemy.radius + 4, 0);
      ctx.lineTo(0, enemy.radius + 4);
      ctx.lineTo(-enemy.radius - 4, 0);
      ctx.closePath();
    } else if (enemy.type === "boss") {
      ctx.moveTo(-enemy.radius, -enemy.radius * 0.5);
      ctx.lineTo(-enemy.radius * 0.4, -enemy.radius);
      ctx.lineTo(enemy.radius * 0.8, -enemy.radius * 0.7);
      ctx.lineTo(enemy.radius, enemy.radius * 0.45);
      ctx.lineTo(enemy.radius * 0.25, enemy.radius);
      ctx.lineTo(-enemy.radius * 0.8, enemy.radius * 0.6);
      ctx.closePath();
    } else {
      ctx.moveTo(-enemy.radius, -enemy.radius * 0.7);
      ctx.lineTo(enemy.radius * 0.7, -enemy.radius);
      ctx.lineTo(enemy.radius, enemy.radius * 0.6);
      ctx.lineTo(-enemy.radius * 0.5, enemy.radius);
      ctx.closePath();
    }
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = neon;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = neon;
    ctx.fillRect(-enemy.radius * 0.35, -enemy.radius * 0.25, enemy.radius * 0.28, 4);
    ctx.fillRect(enemy.radius * 0.18, -enemy.radius * 0.3, enemy.radius * 0.28, 4);

    ctx.fillStyle = "#13100e";
    ctx.fillRect(-enemy.radius, -enemy.radius - 12, enemy.radius * 2, 4);
    ctx.fillStyle = neon;
    ctx.fillRect(-enemy.radius, -enemy.radius - 12, enemy.radius * 2 * Math.max(0, enemy.hp / enemy.maxHp), 4);

    if (enemy.type === "boss") {
      ctx.strokeStyle = "rgba(217, 88, 79, 0.45)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, enemy.radius + 10, 0, TAU);
      ctx.stroke();
    }
    if (enemy.burn > 0) {
      drawVfxSprite(vfxSprites.red.burnMarker, 0, 0, enemy.radius * 2.35, enemy.radius * 2.35, { glow: "#d9584f", blur: 9, alpha: 0.78, rotate: performance.now() / 900 });
    }
    ctx.restore();
  }
}

function drawCrates() {
  for (const crate of state.crates) {
    ctx.save();
    ctx.translate(crate.x, crate.y);
    if (drawAtlasSprite(gameSprites.items.crate, 0, 0, crate.radius * 3.9, crate.radius * 3.05, {
      glow: crate.hitFlash > 0 ? "#f3efe7" : "#69c9dc",
      blur: crate.hitFlash > 0 ? 14 : 6,
      alpha: crate.hitFlash > 0 ? 0.9 : 1
    })) {
      if (crate.hitFlash > 0) {
        ctx.globalAlpha = 0.28;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(0, 0, crate.radius * 1.6, crate.radius * 1.25, 0, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
      continue;
    }
    ctx.fillStyle = crate.hitFlash > 0 ? "#f3efe7" : "#8a623c";
    ctx.strokeStyle = "#3f2c1c";
    ctx.lineWidth = 3;
    ctx.fillRect(-crate.radius, -crate.radius, crate.radius * 2, crate.radius * 2);
    ctx.strokeRect(-crate.radius, -crate.radius, crate.radius * 2, crate.radius * 2);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
    ctx.beginPath();
    ctx.moveTo(-crate.radius, -crate.radius);
    ctx.lineTo(crate.radius, crate.radius);
    ctx.moveTo(crate.radius, -crate.radius);
    ctx.lineTo(-crate.radius, crate.radius);
    ctx.stroke();
    ctx.restore();
  }
}

function drawPickups() {
  for (const pickup of state.pickups) {
    ctx.save();
    ctx.translate(pickup.x, pickup.y + Math.sin(pickup.pulse) * 2);
    if (pickup.kind === "coin" && drawAtlasSprite(gameSprites.items.coin, 0, 0, pickup.radius * 5.4, pickup.radius * 4.9, {
      glow: "#e4b84d",
      blur: 10,
      rotate: Math.sin(pickup.pulse * 0.45) * 0.14
    })) {
      ctx.restore();
      continue;
    }
    ctx.fillStyle = pickup.kind === "coin" ? "#e4b84d" : "#80cf78";
    ctx.strokeStyle = pickup.kind === "coin" ? "#7a5c20" : "#285827";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, pickup.radius, 0, TAU);
    ctx.fill();
    ctx.stroke();
    if (pickup.kind === "heal") {
      ctx.strokeStyle = "#f3efe7";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(4, 0);
      ctx.moveTo(0, -4);
      ctx.lineTo(0, 4);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function enemyProjectileDrawSpec(projectile) {
  if (projectile.vfx === "enemy.basic") {
    return { sprite: vfxSprites.enemy.basic, width: projectile.radius * 15, height: projectile.radius * 5.5, glow: projectile.color, blur: 9 };
  }
  if (projectile.vfx === "enemy.bossHeavy") {
    return { sprite: vfxSprites.enemy.bossHeavy, width: projectile.radius * 16, height: projectile.radius * 7.6, glow: projectile.color, blur: 13 };
  }
  if (projectile.vfx === "enemy.bossBurst") {
    return { sprite: vfxSprites.enemy.bossBurst, width: projectile.radius * 17, height: projectile.radius * 5.6, glow: projectile.color, blur: 12 };
  }
  if (projectile.vfx === "enemy.bossHoming") {
    return { sprite: vfxSprites.enemy.bossHoming, width: projectile.radius * 16, height: projectile.radius * 8.2, glow: projectile.color, blur: 13 };
  }
  if (projectile.vfx === "enemy.bossRing") {
    return { sprite: vfxSprites.enemy.bossRing, width: projectile.radius * 8.4, height: projectile.radius * 8.4, glow: projectile.color, blur: 11 };
  }
  return null;
}

function drawProjectiles() {
  for (const p of state.projectiles) {
    const angle = Math.atan2(p.vy || 0, p.vx || 1);
    if (p.vfx === "red.flameTrail" && drawVfxSprite(vfxSprites.red.flameTrail, p.x, p.y, p.radius * 8, p.radius * 5, { glow: p.color, blur: 9, rotate: angle })) {
      continue;
    }
    if (p.vfx === "white.needleTrail" && drawVfxSprite(vfxSprites.white.needleTrail, p.x, p.y, p.radius * 9, p.radius * 4, { glow: p.color, blur: 7, rotate: angle })) {
      continue;
    }
    const enemySpec = enemyProjectileDrawSpec(p);
    if (enemySpec && drawVfxSprite(enemySpec.sprite, p.x, p.y, enemySpec.width, enemySpec.height, {
      glow: enemySpec.glow,
      blur: enemySpec.blur,
      rotate: p.vfx === "enemy.bossRing" ? performance.now() / 260 : angle
    })) {
      continue;
    }
    ctx.save();
    ctx.shadowColor = p.color;
    ctx.shadowBlur = p.fromPlayer ? 10 : 14;
    ctx.fillStyle = p.color;
    ctx.strokeStyle = "#050506";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (p.fromPlayer) {
      ctx.moveTo(p.x + p.radius, p.y);
      ctx.lineTo(p.x, p.y - p.radius);
      ctx.lineTo(p.x - p.radius, p.y);
      ctx.lineTo(p.x, p.y + p.radius);
      ctx.closePath();
    } else {
      ctx.arc(p.x, p.y, p.radius, 0, TAU);
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function drawLightningBolts() {
  for (const bolt of state.lightningBolts) {
    const alpha = Math.max(0, bolt.life / bolt.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let i = 0; i < bolt.points.length - 1; i += 1) {
      const from = bolt.points[i];
      const to = bolt.points[i + 1];
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      const len = Math.hypot(to.x - from.x, to.y - from.y);
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      drawVfxSprite(vfxSprites.blue.lightningChain, midX, midY, Math.max(80, len * 1.1), 58 + bolt.width * 8, { glow: bolt.color, blur: 10, rotate: angle, alpha: 0.9 });
    }
    drawLightningPath(bolt.points, bolt.width + 4, "rgba(105, 201, 220, 0.22)", 10);
    drawLightningPath(bolt.points, bolt.width, bolt.color, 8);
    drawLightningPath(bolt.points, Math.max(1, bolt.width - 2), "#f3feff", 5);
    ctx.restore();
  }
}

function drawLightningPath(points, width, color, jitter) {
  if (points.length < 2) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  for (let i = 0; i < points.length - 1; i += 1) {
    const from = points[i];
    const to = points[i + 1];
    const segments = 7;
    for (let s = 0; s <= segments; s += 1) {
      const t = s / segments;
      const x = from.x + (to.x - from.x) * t + (Math.random() - 0.5) * jitter;
      const y = from.y + (to.y - from.y) * t + (Math.random() - 0.5) * jitter;
      if (i === 0 && s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

function drawAttackEffectSprite(effect, progress, alpha) {
  const grow = 0.72 + progress * 0.55;
  const ringGrow = 0.55 + progress * 0.9;
  if (effect.type === "burst") {
    const sprite = effect.color === "#d9584f" ? vfxSprites.red.punchBurst : effect.color === "#69c9dc" ? vfxSprites.blue.electricBurst : vfxSprites.white.sterileBurst;
    return drawVfxSprite(sprite, effect.x, effect.y, effect.radius * 1.55 * grow, effect.radius * 1.55 * grow, { glow: effect.color, blur: 14, rotate: effect.seed });
  }
  if (effect.type === "cracks") {
    return drawVfxSprite(vfxSprites.red.groundCrack, effect.x, effect.y, effect.radius * 1.9 * grow, effect.radius * 1.35 * grow, { glow: effect.color, blur: 12, rotate: effect.seed });
  }
  if (effect.type === "needleFan") {
    return drawVfxSprite(vfxSprites.white.needleFan, effect.x, effect.y, 190 * grow, 130 * grow, { glow: effect.color, blur: 10, rotate: effect.seed });
  }
  if (effect.type === "healPulse") {
    return drawVfxSprite(vfxSprites.white.regenParticles, effect.x, effect.y, effect.radius * 2 * ringGrow, effect.radius * 2 * ringGrow, { glow: "#80cf78", blur: 10, rotate: effect.seed });
  }
  if (effect.type === "shieldPulse") {
    return drawVfxSprite(vfxSprites.white.shieldPulse, effect.x, effect.y, effect.radius * 2.1 * ringGrow, effect.radius * 2.1 * ringGrow, { glow: effect.color, blur: 12 });
  }
  if (effect.type === "ring") {
    const sprite = effect.electric ? vfxSprites.blue.coilPulse : vfxSprites.white.healRing;
    return drawVfxSprite(sprite, effect.x, effect.y, effect.radius * 2 * ringGrow, effect.radius * 2 * ringGrow, { glow: effect.color, blur: 10 });
  }
  if (effect.type === "electricRing") {
    return drawVfxSprite(vfxSprites.blue.electricRing, effect.x, effect.y, effect.radius * 2.05 * ringGrow, effect.radius * 2.05 * ringGrow, { glow: effect.color, blur: 12, rotate: effect.seed });
  }
  if (effect.type === "sparkMark") {
    return drawVfxSprite(vfxSprites.blue.footMark, effect.x, effect.y, effect.radius * 2.2, effect.radius * 2.2, { glow: effect.color, blur: 8, rotate: effect.seed });
  }
  if (effect.type === "paralyzeMark") {
    return drawVfxSprite(vfxSprites.blue.paralyzeMarker, effect.x, effect.y, effect.radius * 2, effect.radius * 2, { glow: effect.color, blur: 9, rotate: effect.seed });
  }
  if (effect.type === "fireImpact") {
    return drawVfxSprite(vfxSprites.red.fireRing, effect.x, effect.y, effect.radius * 2.2 * ringGrow, effect.radius * 2.2 * ringGrow, { glow: effect.color, blur: 12, rotate: effect.seed });
  }
  if (effect.type === "needleImpact") {
    return drawVfxSprite(vfxSprites.white.sterileBurst, effect.x, effect.y, effect.radius * 2 * grow, effect.radius * 2 * grow, { glow: effect.color, blur: 10, rotate: effect.seed });
  }
  if (effect.type === "bulletDisintegrate") {
    return drawVfxSprite(vfxSprites.white.bulletDisintegrate, effect.x, effect.y, effect.radius * 2.1 * grow, effect.radius * 2.1 * grow, { glow: effect.color, blur: 10, rotate: effect.seed });
  }
  if (effect.type === "dashTrail") {
    return drawVfxSprite(vfxSprites.red.flameTrail, effect.x, effect.y, 180, 86, { glow: effect.color, blur: 12, rotate: effect.angle || 0 });
  }
  if (effect.type === "sawHalo") {
    return drawVfxSprite(vfxSprites.red.sawHalo, effect.x, effect.y, effect.radius * 2.05, effect.radius * 2.05, { glow: effect.color, blur: 14, rotate: effect.seed + progress * TAU });
  }
  if (effect.type === "thunderNet") {
    return drawVfxSprite(vfxSprites.blue.thunderNet, effect.x, effect.y, effect.radius * 2.25, effect.radius * 2.25, { glow: effect.color, blur: 14, rotate: effect.seed });
  }
  if (effect.type === "surgerySigil") {
    return drawVfxSprite(vfxSprites.white.surgerySigil, effect.x, effect.y, 128 * grow, 128 * grow, { glow: effect.color, blur: 12, rotate: effect.seed * 0.1 });
  }
  if (effect.type === "siegeImpact") {
    return drawVfxSprite(vfxSprites.red.stompImpact, effect.x, effect.y, effect.radius * 1.9 * grow, effect.radius * 1.35 * grow, { glow: effect.color, blur: 13, rotate: effect.seed });
  }
  if (effect.type === "blinkTrail") {
    return drawVfxSprite(vfxSprites.blue.blinkTrail, effect.x, effect.y, effect.radius * 2.25, effect.radius * 1.35, { glow: effect.color, blur: 12, rotate: effect.seed });
  }
  if (effect.type === "bastionDome") {
    return drawVfxSprite(vfxSprites.white.bastionField, effect.x, effect.y, effect.radius * 2.25, effect.radius * 2.25, { glow: effect.color, blur: 14, rotate: effect.seed * 0.002 });
  }
  return false;
}

function drawAttackEffects() {
  for (const effect of state.attackEffects) {
    const progress = 1 - Math.max(0, effect.life / effect.maxLife);
    const alpha = Math.max(0, effect.life / effect.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = effect.color;
    ctx.fillStyle = effect.color;
    ctx.shadowColor = effect.color;
    ctx.shadowBlur = 14;

    if (drawAttackEffectSprite(effect, progress, alpha)) {
      ctx.restore();
      continue;
    }

    if (effect.type === "burst") {
      ctx.strokeStyle = "#050506";
      ctx.lineWidth = effect.spikes ? 9 : 6;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius * (0.35 + progress * 0.65), 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = effect.spikes ? 5 : 3;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius * (0.35 + progress * 0.65), 0, TAU);
      ctx.stroke();
      const rays = effect.spikes ? 18 : 10;
      for (let i = 0; i < rays; i += 1) {
        const a = (i / rays) * TAU + effect.seed;
        const inner = effect.radius * 0.22;
        const outer = effect.radius * (0.55 + progress * 0.35);
        ctx.beginPath();
        ctx.moveTo(effect.x + Math.cos(a) * inner, effect.y + Math.sin(a) * inner);
        ctx.lineTo(effect.x + Math.cos(a) * outer, effect.y + Math.sin(a) * outer);
        ctx.stroke();
      }
    }

    if (effect.type === "needleFan") {
      for (const point of effect.points) {
        ctx.strokeStyle = "#050506";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(effect.x, effect.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.strokeStyle = effect.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(effect.x, effect.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8 + progress * 10, 0, TAU);
        ctx.stroke();
      }
    }

    if (effect.type === "healPulse" || effect.type === "shieldPulse" || effect.type === "ring") {
      ctx.strokeStyle = "#050506";
      ctx.lineWidth = effect.active ? 8 : 6;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius * (0.4 + progress * 0.6), 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = effect.color;
      ctx.lineWidth = effect.active ? 5 : 3;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius * (0.4 + progress * 0.6), 0, TAU);
      ctx.stroke();
      if (effect.type === "shieldPulse") {
        ctx.globalAlpha = alpha * 0.12;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.radius, 0, TAU);
        ctx.fill();
      }
    }

    if (effect.type === "cracks") {
      const cracks = 12;
      for (let i = 0; i < cracks; i += 1) {
        const a = (i / cracks) * TAU + effect.seed;
        const len = effect.radius * (0.45 + ((i * 37) % 50) / 100);
        ctx.strokeStyle = "#050506";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(effect.x, effect.y);
        ctx.lineTo(effect.x + Math.cos(a) * len * progress, effect.y + Math.sin(a) * len * progress);
        ctx.stroke();
        ctx.strokeStyle = effect.color;
        ctx.lineWidth = 2 + (effect.power || 1);
        ctx.beginPath();
        ctx.moveTo(effect.x, effect.y);
        ctx.lineTo(effect.x + Math.cos(a) * len * progress, effect.y + Math.sin(a) * len * progress);
        ctx.stroke();
      }
    }

    if (effect.type === "electricRing") {
      ctx.lineWidth = 3;
      const points = 28;
      ctx.beginPath();
      for (let i = 0; i <= points; i += 1) {
        const a = (i / points) * TAU;
        const r = effect.radius * (0.35 + progress * 0.55) + (Math.random() - 0.5) * 10;
        const x = effect.x + Math.cos(a) * r;
        const y = effect.y + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    if (effect.type === "sparkMark") {
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius * progress, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(effect.x - effect.radius * 0.5, effect.y);
      ctx.lineTo(effect.x + effect.radius * 0.5, effect.y);
      ctx.moveTo(effect.x, effect.y - effect.radius * 0.5);
      ctx.lineTo(effect.x, effect.y + effect.radius * 0.5);
      ctx.stroke();
    }

    if (effect.type === "dashTrail") {
      ctx.translate(effect.x, effect.y);
      ctx.rotate(effect.angle || 0);
      ctx.lineWidth = 5;
      for (let i = 0; i < 4; i += 1) {
        ctx.beginPath();
        ctx.moveTo(-120 + i * 18 + progress * 60, -18 + i * 12);
        ctx.lineTo(-35 + i * 12 + progress * 50, -18 + i * 12);
        ctx.stroke();
      }
    }

    if (effect.type === "sawHalo") {
      ctx.translate(effect.x, effect.y);
      ctx.rotate(effect.seed + progress * TAU * 1.7);
      ctx.lineWidth = 4;
      const teeth = 22;
      ctx.beginPath();
      for (let i = 0; i <= teeth; i += 1) {
        const a = (i / teeth) * TAU;
        const r = effect.radius * (i % 2 === 0 ? 0.72 : 0.98) * (0.85 + progress * 0.2);
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    if (effect.type === "thunderNet") {
      const nodes = 8;
      const pts = [];
      for (let i = 0; i < nodes; i += 1) {
        const a = (i / nodes) * TAU + effect.seed;
        pts.push({
          x: effect.x + Math.cos(a) * effect.radius * 0.82,
          y: effect.y + Math.sin(a) * effect.radius * 0.82
        });
      }
      ctx.lineWidth = 2;
      for (let i = 0; i < pts.length; i += 1) {
        drawLightningPath([pts[i], pts[(i + 2) % pts.length]], 2, effect.color, 7);
      }
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius * (0.45 + progress * 0.4), 0, TAU);
      ctx.stroke();
    }

    if (effect.type === "surgerySigil") {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#f3efe7";
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, 42 + progress * 18, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(effect.x - 34, effect.y);
      ctx.lineTo(effect.x + 34, effect.y);
      ctx.moveTo(effect.x, effect.y - 34);
      ctx.lineTo(effect.x, effect.y + 34);
      ctx.stroke();
      ctx.strokeStyle = "#80cf78";
      for (const point of effect.points) {
        ctx.beginPath();
        ctx.moveTo(effect.x, effect.y);
        ctx.quadraticCurveTo((effect.x + point.x) / 2, effect.y - 45, point.x, point.y);
        ctx.stroke();
      }
    }

    if (effect.type === "siegeImpact") {
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius * (0.25 + progress * 0.85), 0, TAU);
      ctx.stroke();
      ctx.lineWidth = 3;
      for (let i = 0; i < 16; i += 1) {
        const a = (i / 16) * TAU + effect.seed;
        ctx.beginPath();
        ctx.moveTo(effect.x + Math.cos(a) * 30, effect.y + Math.sin(a) * 30);
        ctx.lineTo(effect.x + Math.cos(a) * effect.radius * 1.1 * progress, effect.y + Math.sin(a) * effect.radius * 1.1 * progress);
        ctx.stroke();
      }
    }

    if (effect.type === "blinkTrail") {
      ctx.lineWidth = 3;
      for (let i = 0; i < 7; i += 1) {
        const a = effect.seed + i * 0.9;
        const x = effect.x + Math.cos(a) * effect.radius * 0.55 * progress;
        const y = effect.y + Math.sin(a) * effect.radius * 0.55 * progress;
        drawLightningPath([{ x: effect.x, y: effect.y }, { x, y }], 3, effect.color, 12);
      }
    }

    if (effect.type === "bastionDome") {
      ctx.globalAlpha = alpha * 0.2;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius * (0.75 + progress * 0.15), 0, TAU);
      ctx.fill();
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius * (0.75 + progress * 0.15), 0, TAU);
      ctx.stroke();
      ctx.lineWidth = 2;
      for (let i = 0; i < 6; i += 1) {
        const a = (i / 6) * TAU + effect.seed;
        ctx.beginPath();
        ctx.moveTo(effect.x, effect.y);
        ctx.lineTo(effect.x + Math.cos(a) * effect.radius, effect.y + Math.sin(a) * effect.radius);
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}

function drawHazards() {
  for (const hazard of state.hazards) {
    ctx.save();
    if (hazard.friendly && drawVfxSprite(vfxSprites.white.bastionField, hazard.x, hazard.y, hazard.radius * 2.22, hazard.radius * 2.22, {
      glow: "#f3efe7",
      blur: 12,
      alpha: 0.62,
      rotate: performance.now() / 4200
    })) {
      ctx.restore();
      continue;
    }
    if (hazard.vfx === "enemy.bossBombardment" && drawVfxSprite(vfxSprites.enemy.bossBombardment, hazard.x, hazard.y, hazard.radius * 2.35, hazard.radius * 2.35, {
      glow: "#d9584f",
      blur: hazard.exploded ? 18 : 11,
      alpha: hazard.exploded ? 0.82 : 0.5 + Math.sin(performance.now() / 90) * 0.12,
      rotate: performance.now() / 1200
    })) {
      ctx.restore();
      continue;
    }
    ctx.globalAlpha = hazard.friendly ? 0.18 : hazard.exploded ? 0.34 : 0.2 + (1.2 - hazard.timer) * 0.18;
    ctx.fillStyle = hazard.friendly ? "#f3efe7" : hazard.color || "#d9584f";
    ctx.strokeStyle = hazard.friendly ? "#f3efe7" : "#d9584f";
    ctx.lineWidth = hazard.exploded ? 5 : 2;
    ctx.beginPath();
    ctx.arc(hazard.x, hazard.y, hazard.radius, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 0.85;
    ctx.stroke();
    ctx.restore();
  }
}

function drawParticles() {
  for (const p of state.particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    ctx.globalAlpha = 1;
  }
}

function draw() {
  drawGrid();
  drawCrates();
  drawPickups();
  drawHazards();
  drawAttackEffects();
  drawProjectiles();
  drawLightningBolts();
  drawEnemies();
  if (state.mode !== "menu") drawPlayer();
  drawParticles();
}

function updateHud() {
  if (!state.player) return;
  hpText.textContent = `${Math.ceil(Math.max(0, state.player.hp))} / ${state.player.maxHp}`;
  hpBar.style.width = `${clamp(state.player.hp / state.player.maxHp, 0, 1) * 100}%`;
  roundText.textContent = state.round > 0 ? tr("roundLabel", { round: state.round }) : tr("notStarted");
  timeText.textContent = state.bossAlive && state.roundTime <= 0 ? "Boss" : formatTime(state.roundTime);
  coinText.textContent = state.coins;
  attackText.textContent = tr("headAttack", {
    level: state.head.level,
    damage: state.stats.headDamage || 0,
    cooldown: ((state.stats.headCooldown || 0) || 0).toFixed(2)
  });
  slotText.textContent = `${filledSlotCount()} / ${state.limbSlots.length || 4}`;
  armText.textContent = limbListSummary("arm");
  legText.textContent = limbListSummary("leg");
  relicText.textContent = relicSummary();
  setText.textContent = state.setBonus.text;
  shopButton.disabled = state.mode !== "shop";
}

function levelName(level) {
  if (level >= 9) return tr("evolved");
  if (level >= 6) return tr("upgraded");
  if (level >= 3) return tr("enhanced");
  return tr("base");
}

function limbListSummary(kind) {
  const limbs = (state.limbSlots || []).filter(limb => limb && limb.kind === kind);
  if (limbs.length === 0) return kind === "arm" ? tr("noArms") : tr("noLegs");
  return limbs
    .map(limb => limb.organic ? `${limbName(limb)} Lv.${limb.level}` : `${limbName(limb)} Lv.${limb.level} ${levelName(limb.level)}`)
    .join(" / ");
}

function relicSummary() {
  if (!state.relics || state.relics.length === 0) return tr("none");
  return state.relics
    .map(id => relicTitle(id))
    .join(" / ");
}

function finishGame(won) {
  state.mode = "gameover";
  state.player.hp = Math.max(0, state.player.hp);
  resultTitle.textContent = won ? tr("winTitle") : tr("loseTitle");
  resultCopy.textContent = won
    ? tr("winCopy")
    : tr("loseCopy", { round: state.round, kills: state.killedEnemies, line: pickNarration("death") });
  gameOverPanel.classList.remove("hidden");
  pauseMenu.classList.add("hidden");
  shopModal.classList.add("hidden");
  pauseBadge.classList.add("hidden");
}

function pauseGame() {
  if (state.mode !== "combat") return;
  state.mode = "paused";
  pauseMenu.classList.remove("hidden");
  pauseBadge.classList.remove("hidden");
}

function resumeGame() {
  if (state.mode !== "paused") return;
  state.mode = "combat";
  pauseMenu.classList.add("hidden");
  pauseBadge.classList.add("hidden");
}

function openHelp() {
  helpModal.classList.remove("hidden");
}

function closeHelp() {
  helpModal.classList.add("hidden");
}

function openAbout() {
  aboutModal.classList.remove("hidden");
}

function closeAbout() {
  aboutModal.classList.add("hidden");
}

function loop(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", event => {
  const key = event.key.toLowerCase();
  keys.add(key);
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) event.preventDefault();
  if (key === "escape") {
    if (!helpModal.classList.contains("hidden")) closeHelp();
    else if (!aboutModal.classList.contains("hidden")) closeAbout();
    else if (state.mode === "combat") pauseGame();
    else if (state.mode === "paused") resumeGame();
  }
  if (key === "b" && state.mode === "combat") showBanner(tr("combatShopBlocked"));
  if (key === "t" && (state.mode === "combat" || state.mode === "paused")) {
    state.timeScale = state.timeScale === 1 ? 8 : 1;
    showBanner(state.timeScale === 1 ? tr("normalTime") : tr("testSpeed"));
  }
});

window.addEventListener("keyup", event => {
  keys.delete(event.key.toLowerCase());
});

startButton.addEventListener("click", startRun);
testButton.addEventListener("click", startTestMode);
helpButton.addEventListener("click", openHelp);
aboutButton.addEventListener("click", openAbout);
pauseHelpButton.addEventListener("click", openHelp);
closeHelpButton.addEventListener("click", closeHelp);
closeAboutButton.addEventListener("click", closeAbout);
languageToggle.addEventListener("click", toggleLanguage);
audioToggle.addEventListener("click", toggleBgm);
restartButton.addEventListener("click", startRun);
backMenuButton.addEventListener("click", returnToMenu);
resumeButton.addEventListener("click", resumeGame);
exitButton.addEventListener("click", returnToMenu);
nextRoundButton.addEventListener("click", () => {
  if (state.testMode && state.mode === "shop") beginSelectedTestRound();
  else beginNextRound();
});
shopButton.addEventListener("click", () => {
  if (state.mode === "shop") shopModal.classList.remove("hidden");
});

applyStats();
applyLanguage();
updateHud();
updateAudioToggle();
requestAnimationFrame(loop);
