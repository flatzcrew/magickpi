// Generates react/src/tokens/*.css from Figma dumps (read-only export, 2026-11-25).
import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const OUT = process.argv[2];
const read = (f) => fs.readFileSync(path.join(here, f), 'utf8').trim().split(/\r?\n/).map((l) => l.split('|'));

// Naming rule: Figma name -> kebab-case, hierarchy kept: "/" and spaces -> "-", lower-case.
const kebab = (n) => '--' + n.trim().toLowerCase().replace(/[\/\s]+/g, '-');
const val = (v) => (v.startsWith('@') ? `var(${kebab(v.slice(1).replace(/^T:/, ''))})` : v);

const counts = {};
const header = (title) => `/*\n * ${title}\n * Источник: Figma «Pitonize Design System» (Atomize PRO 3.4), fileKey eXsMwWilMH7f3cOWXFRwM5.\n * Снято только чтением 2026-11-25. Файл сгенерирован — не править руками, перегенерировать из Figma.\n * Имя переменной = имя Variable/стиля в Figma в kebab-case с сохранением иерархии\n * (Color/brand/500 -> --color-brand-500, Surface/s0 -> --surface-s0, Space/xl -> --space-xl).\n */\n`;

/* ---------- primitives.css ---------- */
let p = header('Слой 1 — примитивы: 🍄 Primitives (Atomize), 🎨 Color Accent (Accent-1), 🆎 Font (KPI Bro), 📐 Space (Default), 🟢 Radius (Regular), тени и размытия (Effect styles)');
let n = 0;
p += '\n:root {\n  /* 🍄 Primitives · режим Atomize (Color/brand/* — alias на 🎨 Color Accent, как в Figma) */\n';
for (const [name, v] of read('prim.txt')) { p += `  ${kebab(name)}: ${val(v)};\n`; n++; }
counts.primitives = n;

n = 0;
p += '\n  /* 🎨 Color Accent · режим Accent-1 */\n';
for (const [name, v] of read('accent.txt')) { p += `  ${kebab(name)}: ${val(v)};\n`; n++; }
counts.accent = n;

// 🆎 Font · KPI Bro
n = 0;
const fam = { 'display-1': 'Manrope', 'body-1': 'Geist', 'display-2': 'Cygre ExtraBold', 'body-2': 'Geist Mono' };
const steps = ['xl-heading-4','xl-heading-3','xl-heading-2','xl-heading-1','display-3','display-2','display-1','heading-6','heading-5','heading-4','heading-3','heading-2','heading-1','title-2','title-1','body-2','body-1','caption-2','caption-1','overline'];
const sizeWeb = [280,200,160,120,104,88,76,62,52,42,32,25,22,18,15,15,13,12,10,11];
const sizeMob = [88,72,72,64,64,56,44,40,36,30,26,22,20,17,17,17,15,14,12,12];
const lhSteps = [...steps.slice(0, 17), 'para', 'caption-2', 'caption-1', 'overline'];
const lhWeb = [256,184,152,112,96,80,80,68,56,48,40,36,28,24,24,24,24,20,16,16,12];
const lhMob = [96,80,80,72,72,60,48,44,44,36,32,28,28,24,24,24,20,20,20,16,16];
const lsSteps = ['none','xs','sm','md','lg','spaced-out'];
const lsWeb = [0,-0.5,-3,-5,-7,2];
const lsMob = [0,-0.5,-2,-4,-5,2];
const px = (x) => (x === 0 ? '0px' : `${x}px`);
p += '\n  /* 🆎 Font · режим KPI Bro */\n';
for (const [k, f] of Object.entries(fam)) { p += `  --font-family-${k}: "${f}";\n`; n++; }
steps.forEach((s, i) => { p += `  --font-size-web-${s}: ${px(sizeWeb[i])};\n`; n++; });
steps.forEach((s, i) => { p += `  --font-size-mobile-${s}: ${px(sizeMob[i])};\n`; n++; });
lhSteps.forEach((s, i) => { p += `  --font-line-height-web-${s}: ${px(lhWeb[i])};\n`; n++; });
lhSteps.forEach((s, i) => { p += `  --font-line-height-mobile-${s}: ${px(lhMob[i])};\n`; n++; });
lsSteps.forEach((s, i) => { p += `  --font-letter-spacing-web-${s}: ${px(lsWeb[i])};\n`; n++; });
lsSteps.forEach((s, i) => { p += `  --font-letter-spacing-mobile-${s}: ${px(lsMob[i])};\n`; n++; });
for (const [g, ws] of [['display', [400,500,600,700]], ['body', [500,600,700,800]]]) {
  ['normal','medium','semibold','bold'].forEach((w, i) => { p += `  --font-weight-${g}-${w}: ${ws[i]};\n`; n++; });
}
counts.font = n;

// 📐 Space
n = 0;
const space = [['zero',0],['xxs',2],['xs',4],['sm',6],['md',8],['lg',10],['xl',12],['2xl',14],['3xl',16],['4xl',18],['5xl',20],['6xl',22],['7xl',24],['8xl',26],['9xl',28],['10xl',32],['11xl',36],['12xl',40],['13xl',44],['14xl',48],['15xl',52],['16xl',56],['17xl',60],['18xl',64],['19xl',72],['20xl',80],['21xl',88],['22xl',96],['23xl',104],['24xl',120],['25xl',144],['26xl',160]];
p += '\n  /* 📐 Space · режим Default (в Figma один слой — переносим как есть) */\n';
for (const [k, v] of space) { p += `  --space-${k}: ${px(v)};\n`; n++; }
counts.space = n;

// 🟢 Radius · Regular
n = 0;
const radius = [['zero',0],['xxs',2],['xs',4],['sm',6],['md',8],['lg',10],['xl',12],['2xl',14],['3xl',16],['4xl',18],['5xl',20],['6xl',22],['7xl',24],['8xl',28],['9xl',32],['10xl',40],['11xl',44],['12xl',48],['13xl',52],['14xl',56],['15xl',64],['16xl',72],['round',1000],
  ['small-component-xxs',4],['small-component-xs',6],['small-component-sm',8],['small-component-md',10],['small-component-lg',12],['small-component-xl',14],['small-component-2xl',16],['small-component-3xl',18],['small-component-4xl',20],['small-component-5xl',24],['small-component-6xl',28],
  ['big-component-xs',16],['big-component-sm',20],['big-component-md',24],['big-component-lg',28]];
p += '\n  /* 🟢 Radius · режим Regular (в Figma один слой — переносим как есть) */\n';
for (const [k, v] of radius) { p += `  --radius-${k}: ${px(v)};\n`; n++; }
counts.radius = n;
p += '}\n';

// Effect styles. Geometry exact from Figma; color = var(--<Theme variable bound in Figma>).
// DROP_SHADOW x y blur spread -> "x y blur spread color"; INNER_SHADOW -> "inset ...".
// BACKGROUND_BLUR radius R -> backdrop-filter blur(R/2) (convention of Figma Dev Mode CSS export).
// NOISE and GLASS have no CSS equivalent and are not transferred (see comments).
const S = (x, y, b, s, c, inset = false) => `${inset ? 'inset ' : ''}${px(x)} ${px(y)} ${px(b)} ${px(s)} var(${kebab(c)})`;
const effects = [
  ['Elevation/e1', [S(0,1,1,-0.5,'Elevation/shadow-low')]],
  ['Elevation/e2', [S(0,3,3,-1.5,'Elevation/shadow-low'), S(0,1,1,-0.5,'Elevation/shadow-low')]],
  ['Elevation/e3', [S(0,20,20,-12,'Elevation/shadow-low'), S(0,3,3,-1.5,'Elevation/shadow-low'), S(0,1,1,-0.5,'Elevation/shadow-low')]],
  ['Elevation/e4', [S(0,32,32,-16,'Elevation/shadow-base'), S(0,20,20,-12,'Elevation/shadow-low'), S(0,3,3,-1.5,'Elevation/shadow-low'), S(0,1,1,-0.5,'Elevation/shadow-low')]],
  ['Elevation/e5', [S(0,56,56,-28,'Elevation/shadow-base'), S(0,32,32,-16,'Elevation/shadow-base'), S(0,20,20,-12,'Elevation/shadow-low'), S(0,3,3,-1.5,'Elevation/shadow-low'), S(0,1,1,-0.5,'Elevation/shadow-low')]],
  ['Elevation/e6', [S(0,72,72,-36,'Elevation/shadow-base'), S(0,56,56,-28,'Elevation/shadow-base'), S(0,32,32,-16,'Elevation/shadow-base'), S(0,20,20,-12,'Elevation/shadow-low'), S(0,3,3,-1.5,'Elevation/shadow-low'), S(0,1,1,-0.5,'Elevation/shadow-low')]],
  ['Card-shadow', [S(0,56,56,-28,'Elevation/shadow-base'), S(0,32,32,-16,'Elevation/shadow-base'), S(0,20,20,-12,'Elevation/shadow-base'), S(0,3,3,-1.5,'Elevation/shadow-base'), S(0,1,1,-0.5,'Elevation/shadow-base'), S(0,4,12,-2,'Elevation/highlight-high',true)]],
  ['Card-inner-shadow', [S(0,-1,3,0,'Inverse-white/alpha-4',true)], 48],
  ['Small-dark-shadow', [S(0,2,3,-1.5,'Elevation/shadow-high')]],
  ['Special', [S(0,2,2,-1.5,'Elevation/shadow-base'), S(0,-8,8,0,'Elevation/shadow-low',true), S(0,1,1,0,'Elevation/highlight-med',true)], null, 'NOISE (multitone, #000 12%, opacity 3%) не переносится'],
  ['Special-sm', [S(0,1,2,-1.5,'Inverse-white/alpha-4'), S(0,-4,6,0,'Elevation/shadow-med',true)], null, 'NOISE (multitone, #000 12%, opacity 3%) не переносится'],
  ['Component-effect/primary-default', [S(0,1,1,-0.5,'Elevation/shadow-base'), S(0,3,3,0,'Elevation/highlight-med',true)], 24],
  ['Component-effect/secondary-default', [S(0,2,1.5,-0.5,'Elevation/shadow-base'), S(0,1,2,0,'Elevation/highlight-low',true)], 24],
  ['Component-effect/primary-hover', [S(0,20,20,-12,'Elevation/shadow-low'), S(0,3,3,-1.5,'Elevation/shadow-low'), S(0,1,1,-0.5,'Elevation/shadow-low'), S(0,3,3,0,'Elevation/highlight-high',true)], 24],
  ['Component-effect/secondary-hover', [S(0,3,3,-1.5,'Elevation/shadow-base'), S(0,1,1,-0.5,'Elevation/shadow-low'), S(0,2,3,0,'Elevation/highlight-low',true)], 24],
  ['Component-effect/primary-drag', [S(0,20,20,-12,'Elevation/shadow-med'), S(0,3,3,-1.5,'Elevation/shadow-med'), S(0,1,1,-0.5,'Elevation/shadow-med')], 24],
  ['Pressed/primary', [S(0,0,0,3,'Outline/primary-base-em-alpha')]],
  ['Pressed/info', [S(0,0,0,3,'Outline/info-base-em-alpha')]],
  ['Pressed/success', [S(0,0,0,3,'Outline/success-base-em-alpha')]],
  ['Pressed/warning', [S(0,0,0,3,'Outline/warning-base-em-alpha')]],
  ['Pressed/danger', [S(0,0,0,3,'Outline/danger-base-em-alpha')]],
  ['Pressed/gray', [S(0,0,0,3,'Outline/med-em')]],
];
n = 0;
p += `\n/*\n * Effect styles (30 в ките). Геометрия — точно из Figma, цвет — через Theme-переменную, привязанную в Figma.\n * Объявлены на :root и на [data-theme]: var() внутри custom property вычисляется на элементе объявления,\n * поэтому тень должна пересчитываться там, где переключается тема.\n * Тень: --<стиль>; размытие фона у смешанных стилей: --<стиль>-backdrop (для backdrop-filter).\n * BACKGROUND_BLUR радиус R -> blur(R/2), как в CSS-экспорте Figma Dev Mode.\n * Не переносится (нет CSS-аналога): Liquid-glass (GLASS r8, refraction 1, depth 48, light 315°/0.8, dispersion 0.48),\n * NOISE-слой в Special и Special-sm.\n */\n:root,\n[data-theme] {\n`;
for (const [name, layers, blur, note] of effects) {
  if (note) p += `  /* ${name}: ${note} */\n`;
  p += `  ${kebab(name)}: ${layers.join(',\n    ')};\n`; n++;
  if (blur) { p += `  ${kebab(name)}-backdrop: blur(${px(blur / 2)});\n`; n++; }
}
p += '\n  /* Blur/* — значения для backdrop-filter */\n';
for (const r of [8, 16, 24, 48, 96]) { p += `  --blur-${r}: blur(${px(r / 2)});\n`; n++; }
p += '  /* Blur/40-* в Figma — PROGRESSIVE (градиентное по вертикали): здесь максимум; градиент — mask-image в компоненте */\n';
p += `  --blur-40-bot-0-top: blur(${px(20)}); /* 0 сверху -> 40 снизу */\n`; n++;
p += `  --blur-40-top-0-bot: blur(${px(20)}); /* 40 сверху -> 0 снизу */\n`; n++;
p += '}\n';
counts.effects = n;
fs.writeFileSync(path.join(OUT, 'primitives.css'), p);

/* ---------- semantics.css ---------- */
let s = header('Слой 2 — семантика цвета: 🌈 Theme. :root = ☀️ Light, [data-theme="dark"] = 🌒 Dark.\n * Каждая семантика — var(--примитив), как alias в Figma; Surface/special/* и tertiary-alpha-base ссылаются на Theme, как в Figma.\n * Прибиты к значению в Figma (не alias) и перенесены как есть: Keyboard/* (10).');
const theme = read('theme.txt');
let light = '', dark = '';
const raw = [];
for (const [name, l, d] of theme) {
  light += `  ${kebab(name)}: ${val(l)};\n`;
  dark += `  ${kebab(name)}: ${val(d)};\n`;
  if (!l.startsWith('@') || !d.startsWith('@')) raw.push(name);
}
s += `\n:root,\n[data-theme="light"] {\n  color-scheme: light;\n${light}}\n\n[data-theme="dark"] {\n  color-scheme: dark;\n${dark}}\n`;
counts.theme = theme.length;
counts.themeRaw = raw;
fs.writeFileSync(path.join(OUT, 'semantics.css'), s);

/* ---------- typography.css ---------- */
let t = header('Типографика: 🖍️ Typography (Typeface-1; мобильный Typeface-1-Mobile — @media (max-width: 767px)) и классы TextStyle кита (84).\n * Класс = имя TextStyle в kebab-case (UI/heading-1/bold -> .ui-heading-1-bold). Цвет в классы не зашит — только Text/*.');
t += `\n@import url("https://fonts.googleapis.com/css2?family=Geist:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap");\n`;
let tv = '', tm = '';
n = 0;
tv += '  --typeface-family-display: var(--font-family-display-1);\n  --typeface-family-body: var(--font-family-body-1);\n'; n += 2;
for (const st of steps) { tv += `  --typeface-size-${st}: var(--font-size-web-${st});\n`; tm += `    --typeface-size-${st}: var(--font-size-mobile-${st});\n`; n++; }
for (const st of lhSteps) { tv += `  --typeface-line-height-${st}: var(--font-line-height-web-${st});\n`; tm += `    --typeface-line-height-${st}: var(--font-line-height-mobile-${st});\n`; n++; }
for (const st of lsSteps) { tv += `  --typeface-letter-spacing-${st}: var(--font-letter-spacing-web-${st});\n`; tm += `    --typeface-letter-spacing-${st}: var(--font-letter-spacing-mobile-${st});\n`; n++; }
for (const g of ['display', 'body']) for (const w of ['normal','medium','semibold','bold']) { tv += `  --typeface-weight-${g}-${w}: var(--font-weight-${g}-${w});\n`; n++; }
counts.typeface = n;
t += `\n/* 🖍️ Typography · Typeface-1 (web) */\n:root {\n${tv}}\n\n/* 🖍️ Typography · Typeface-1-Mobile: меняются только size / line-height / letter-spacing */\n@media (max-width: 767px) {\n  :root {\n${tm}  }\n}\n`;

const weights = ['normal','medium','semibold','bold'];
const styles = [];
for (const [b, ls] of [['heading-4','lg'],['heading-3','lg'],['heading-2','md'],['heading-1','md']]) styles.push(['XL', b, 'xl-' + b, 'display', ls]);
for (const b of ['display-3','display-2','display-1']) styles.push(['UI', b, b, 'display', 'sm']);
for (const b of ['heading-6','heading-5','heading-4','heading-3']) styles.push(['UI', b, b, 'display', 'xs']);
for (const b of ['heading-2','heading-1']) styles.push(['UI', b, b, 'body', 'xs']);
for (const b of ['title-2','title-1','body-2','body-1']) styles.push(['UI', b, b, 'body', 'none']);
styles.push(['UI', 'para', 'body-1', 'body', 'none', 'para']);
for (const b of ['caption-2','caption-1']) styles.push(['UI', b, b, 'body', 'none']);
styles.push(['UI', 'overline', 'overline', 'body', 'spaced-out', null, true]);
n = 0;
t += '\n/* TextStyle кита: семейство / размер / вес / межстрочный / трекинг — через Typeface/* (как привязано в Figma) */\n';
for (const [pre, base, sizeKey, famKey, ls, lhKey, upper] of styles) {
  for (const w of weights) {
    t += `.${pre.toLowerCase()}-${base}-${w} {\n  font-family: var(--typeface-family-${famKey});\n  font-size: var(--typeface-size-${sizeKey});\n  font-weight: var(--typeface-weight-${famKey}-${w});\n  line-height: var(--typeface-line-height-${lhKey || sizeKey});\n  letter-spacing: var(--typeface-letter-spacing-${ls});\n${upper ? '  text-transform: uppercase;\n' : ''}}\n`;
    n++;
  }
}
counts.textStyles = n;
fs.writeFileSync(path.join(OUT, 'typography.css'), t);
console.log(JSON.stringify(counts));
