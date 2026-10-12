(() => {
  'use strict';
  const supported = ['ko', 'en', 'ja'];
  let language = 'ko';
  try {
    const saved = localStorage.getItem('anthoriaLanguage');
    if (supported.includes(saved)) language = saved;
  } catch { /* Storage may be disabled in an embedded browser. */ }

  const translate = (source, locale = language) => {
    if (locale === 'ko') return source;
    const copy = window.AnthoriaCopy?.[source.replace(/\r\n/g, '\n')];
    if (copy?.[locale]) return copy[locale];
    const image = source.match(/^(필레온|엘리라|비렉스|카엘리스) (수록 이미지|별관 이미지) (\d+)$/);
    if (image) {
      const name = translate(image[1], locale);
      return locale === 'en'
        ? `${name} ${image[2] === '별관 이미지' ? 'annex illustration' : 'illustration'} ${image[3]}`
        : `${name}の${image[2] === '별관 이미지' ? '別館' : '収録'}イラスト ${image[3]}`;
    }
    const caption = source.match(/^(필레온|엘리라|비렉스|카엘리스) · (\d+)$/);
    if (caption) return `${translate(caption[1], locale)} · ${caption[2]}`;
    return source;
  };

  const textEntries = [];
  const attributeEntries = [];
  let originalHero;
  const apply = () => {
    document.documentElement.lang = language;
    for (const { node, source, leading, trailing } of textEntries) {
      node.nodeValue = leading + translate(source) + trailing;
    }
    for (const { element, attribute, source } of attributeEntries) {
      element.setAttribute(attribute, translate(source));
    }
    const hero = document.querySelector('.hero h1');
    if (hero && originalHero) {
      // Only trusted, authored markup is used here; preserve the emphasized title.
      hero.innerHTML = language === 'ko' ? originalHero
        : language === 'en' ? 'I Married the<br><em>Villainess’s</em> Brother<br>by Contract'
        : '<em>悪女</em>の兄と<br>契約結婚したら';
    }
    document.querySelectorAll('[data-language-switch]').forEach(select => {
      select.value = language;
    });
    document.dispatchEvent(new CustomEvent('anthoria:languagechange', { detail: { language } }));
  };

  window.AnthoriaI18n = {
    t: translate,
    get language() { return language; },
    coreAnswer(model, plan, fallback) {
      return window.AnthoriaCoreCopy?.[language]?.[model]?.[plan] ?? fallback;
    },
    setLanguage(locale) {
      if (!supported.includes(locale)) return;
      language = locale;
      try { localStorage.setItem('anthoriaLanguage', language); } catch { /* Keep the current page usable. */ }
      apply();
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    originalHero = document.querySelector('.hero h1')?.innerHTML;
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || parent.closest('script, style, [data-language-switch], #demo-answer, #demo-model-caption, #password-error')) continue;
      const source = node.nodeValue.trim();
      if (!source) continue;
      textEntries.push({ node, source, leading: node.nodeValue.match(/^\s*/)[0], trailing: node.nodeValue.match(/\s*$/)[0] });
    }
    document.querySelectorAll('[alt], [aria-label], [title], [placeholder], meta[name="description"]').forEach(element => {
      for (const attribute of ['alt', 'aria-label', 'title', 'placeholder', ...(element.matches('meta[name="description"]') ? ['content'] : [])]) {
        const source = element.getAttribute(attribute);
        if (source) attributeEntries.push({ element, attribute, source });
      }
    });
    document.querySelectorAll('[data-language-switch]').forEach(select => {
      select.addEventListener('change', () => window.AnthoriaI18n.setLanguage(select.value));
    });
    apply();
  });
})();
