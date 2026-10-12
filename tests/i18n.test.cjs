const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../dist');
const callbacks = {};
const storage = new Map();
const switcher = { value: 'ko', addEventListener(type, fn) { this[type] = fn; } };
const hero = { innerHTML: '<em>악녀</em>의 오빠와<br>계약결혼 했는데' };
const textNode = { nodeValue: '  제국 일정\n', parentElement: { closest() { return false; } } };
const image = {
  attrs: { alt: '필레온 수록 이미지 3' }, matches() { return false; },
  getAttribute(key) { return this.attrs[key] ?? null; },
  setAttribute(key, value) { this.attrs[key] = value; }
};
const document = {
  documentElement: { lang: 'ko' },
  addEventListener(name, fn) { (callbacks[name] ??= []).push(fn); },
  dispatchEvent(event) { for (const fn of callbacks[event.type] ?? []) fn(event); },
  querySelector(selector) { return selector === '.hero h1' ? hero : null; },
  querySelectorAll(selector) { return selector === '[data-language-switch]' ? [switcher] : [image]; },
  createTreeWalker() { let read = false; return { nextNode() { if (read) return null; read = true; return textNode; } }; }
};
const context = vm.createContext({
  window: {}, document, NodeFilter: { SHOW_TEXT: 4 },
  localStorage: { getItem(key) { return storage.get(key); }, setItem(key, value) { storage.set(key, value); } },
  CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } }
});
vm.runInContext(fs.readFileSync(path.join(root, 'translations.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(root, 'i18n.js'), 'utf8'), context);
for (const fn of callbacks.DOMContentLoaded) fn();
const i18n = context.window.AnthoriaI18n;

for (const locale of ['en', 'ja', 'ko', 'ja', 'en', 'ko']) {
  i18n.setLanguage(locale);
  assert.equal(document.documentElement.lang, locale);
  assert.equal(switcher.value, locale);
  assert.equal(storage.get('anthoriaLanguage'), locale);
  assert.equal(textNode.nodeValue, `  ${i18n.t('제국 일정')}\n`);
  assert.equal(image.attrs.alt, i18n.t('필레온 수록 이미지 3'));
}
assert.equal(hero.innerHTML, '<em>악녀</em>의 오빠와<br>계약결혼 했는데');
assert.equal(textNode.nodeValue, '  제국 일정\n');
assert.equal(image.attrs.alt, '필레온 수록 이미지 3');
i18n.setLanguage('invalid');
assert.equal(i18n.language, 'ko');

const pages = ['index', 'characters', 'cast', 'gallery', 'archive'];
let checked = 0;
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, `${page}.html`), 'utf8');
  assert.match(html, /data-language-switch/);
  assert.match(html, /translations\.js/);
  assert.match(html, /i18n\.js/);
  assert.match(html, /site\.js/);
  const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  const sourceStrings = withoutScripts.split(/<[^>]+>/).map(text => text.trim());
  for (const attr of withoutScripts.matchAll(/(?:alt|aria-label|content)="([^"]+)"/g)) sourceStrings.push(attr[1]);
  for (const source of sourceStrings) {
    if (!/[가-힣]/.test(source) || /^(?:Language · )?한국어$/.test(source)) continue;
    for (const locale of ['en', 'ja']) {
      const translated = i18n.t(source, locale);
      assert.notEqual(translated, source, `${page}: ${source} (${locale})`);
      assert.ok(!/[가-힣]/.test(translated), `${page}: Korean remains in ${locale}: ${source}`);
    }
    checked++;
  }
}
for (const locale of ['en', 'ja']) {
  i18n.setLanguage(locale);
  for (const model of ['minerva', 'mercury', 'calliope']) {
    for (const plan of ['Apis', 'Vespa', 'Mandarinia']) {
      const answer = i18n.coreAnswer(model, plan, 'fallback');
      assert.notEqual(answer, 'fallback');
      assert.ok(!/[가-힣]/.test(answer));
    }
  }
  for (const name of ['필레온', '엘리라', '비렉스', '카엘리스']) {
    for (const source of [`${name} · 03`, `${name} 수록 이미지 3`, `${name} 별관 이미지 12`]) {
      assert.ok(!/[가-힣]/.test(i18n.t(source)));
    }
  }
  assert.ok(!/[가-힣]/.test(i18n.t('비밀번호가 맞지 않습니다.')));
  assert.ok(!/[가-힣]/.test(i18n.t('/제국일정')));
  assert.ok(!/[가-힣]/.test(i18n.t('/마도코어')));
}
assert.match(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), /https:\/\/gbe88\.uk\/2\/KQ\/p\.webp/);
assert.ok(!fs.readFileSync(path.join(root, 'site.js'), 'utf8').includes('setInterval'));
console.log(`PASS: ${checked} source strings on 5 pages; language switching/restoration, translated attributes, 18 demo answers, generated gallery text, commands and animated cover.`);
