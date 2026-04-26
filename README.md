# 残肢求生 Prototype

HTML5 Canvas “类吸血鬼幸存者 + 义体改造商店 + 1 分钟回合制” Roguelike 原型，用来验证战斗、生存、义体升级与商店改造的核心循环。

## 当前已实现

- 开始菜单、Esc 暂停菜单、退出到开始菜单。
- 测试模式：进入后先打开免费全量商店，可选择起始回合再开始战斗。
- 1 分钟独立回合制：普通回合到时清屏并进入商店，清屏敌人不掉落物品。
- 每 3 个回合生成 Boss；Boss 死前回合不会结算，击败 Boss 后小怪自动死亡并结算货币。
- 战斗中不能打开商店，只能在回合结束后购买。
- 头槌会朝最近敌人方向释放椭圆形群体攻击，附带击退，头部可升到 9 级。
- 每回合开始随机生成可摧毁箱子，可能掉落货币、治疗道具或为空。
- 总肢体槽位系统：初始 4 槽，双手缺失，双腿为原生肢体。
- 每个手臂/腿部义体可单独购买、升级、变卖。
- 每种义体攻击都有独立可视化特效：冲击、闪电链、针轨、裂地、电痕、护盾脉冲等。
- 美术方向：2D 赛博朋克美漫风，主角与敌人使用黑色漫画描边和高饱和霓虹边线。
- 义体以漂浮模块形式围绕主角身体呈现，外观随等级提升出现更强发光和环形结构。
- 商店中义体与 20 种增强道具均展示独立图标，义体图标显示等级。
- 白塔稳定义腿会周期性释放清弹脉冲，摧毁周围敌方子弹。
- 义体等级：每级加数值，3/6 级强化机制，9 级进化。
- 厂家标签与套装：同厂家双臂提供中等强化，同厂家双臂 + 双腿提供全套共鸣。
- 商店按分类展示，强化已有义体也随机出现，不保证每轮都有。
- 商店提供 20 种随机永久强化道具，包含纯正面强化和带负面效果的强力强化。
- 每轮商店随机 1-2 个商品特价，价格降低 50%-75%。
- 商店可购买额外肢体槽位。
- Boss 随出现次数逐步解锁轰炸、扫射、追踪弹、环形弹幕。
- 支持中英双语 UI，可在开始菜单右上角切换。
- 游戏内置循环 BGM，可在开始菜单右上角开关。

## 操作

- `WASD` 或方向键移动。
- `Esc` 打开/关闭暂停菜单。
- `T` 测试加速，用来快速验证回合结算。

## 文件

- `index.html` 点击即玩的页面结构。
- `styles.css` 界面样式。
- `game.js` 游戏逻辑。
- `assets/` 游戏美术、音频和特效资源。
- `tools/` 素材拆分与音频生成辅助脚本。

---

# Limb Survivor Prototype

An HTML5 Canvas roguelike prototype built around a Vampire Survivors-like 2D survival loop, prosthetic body-mod shop, and one-minute round structure. It is designed to test the core cycle of combat, survival, prosthetic upgrades, and post-round body rebuilding.

## Current Features

- Start menu, Esc pause menu, and return-to-main-menu flow.
- Test mode: opens a free full-item shop first, lets you choose the starting round, then begins combat.
- Independent one-minute rounds: normal rounds clear the field when time expires and then open the shop; enemies removed by the clear do not drop items.
- A Boss appears every 3 rounds. The round does not end until the Boss dies. When the Boss is defeated, remaining small enemies die automatically and their scrap value is collected.
- The shop cannot be opened during combat; purchases are only available after a round ends.
- The headbutt targets the nearest enemy direction with an oval area attack and knockback. The head can be upgraded to level 9.
- Each round starts with random destructible crates, which may drop scrap, healing items, or nothing.
- Total limb-slot system: the player starts with 4 slots, both hands missing, and two organic legs.
- Each arm or leg prosthetic can be bought, upgraded, or sold individually.
- Every prosthetic attack has its own visible effect, including impact bursts, lightning chains, needle trails, ground fissures, electric marks, and shield pulses.
- Art direction: 2D cyberpunk comic-book style with black ink outlines and saturated neon edges for the player and enemies.
- Prosthetics appear as floating modules around the player. Their visuals become brighter and more complex as their level increases.
- The shop displays unique icons for prosthetics and 20 enhancement items. Prosthetic icons reflect their level.
- The White Tower stabilizer leg periodically releases a bullet-clearing shield pulse that destroys nearby enemy projectiles.
- Prosthetic levels: each level improves stats, levels 3 and 6 unlock mechanic upgrades, and level 9 evolves the prosthetic.
- Manufacturer tags and set bonuses: matching twin arms from one manufacturer grant a medium set bonus; matching twin arms plus twin legs from the same manufacturer grant full resonance.
- The shop is organized by category. Upgrade options for equipped prosthetics appear randomly and are not guaranteed every round.
- The shop offers 20 random permanent enhancement items, including purely positive upgrades and stronger upgrades with drawbacks.
- Each shop phase randomly marks 1-2 goods as discounted, reducing their price by 50%-75%.
- Extra limb slots can be purchased in the shop.
- Boss encounters progressively unlock bombardments, burst fire, homing shots, and ring bullet patterns.
- Supports bilingual Chinese/English UI switching from the top-right of the start menu.
- Includes looping BGM with a start-menu music toggle.

## Controls

- Move with `WASD` or the arrow keys.
- Press `Esc` to open or close the pause menu.
- Press `T` to toggle test speed-up for quickly checking round flow.

## Files

- `index.html` click-to-play page structure.
- `styles.css` UI styling.
- `game.js` game logic.
- `assets/` game art, audio, and effect assets.
- `tools/` helper scripts for asset extraction and audio generation.
