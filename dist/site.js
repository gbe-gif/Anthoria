document.addEventListener('DOMContentLoaded', () => {
  const copy = (text) => window.AnthoriaI18n?.t(text) ?? text;
  const coreAnswers = {
    minerva: {
      name: '미네르바',
      Apis: '조건 정리함. 감사 표현은 필요하고 감정 과장은 불필요함.\n\n“간식은 잘 받았소. 바쁜 일정에 도움이 되었군. 신경 써 줘서 고맙소.”\n\n3문장이면 충분함. 품위가 길이로 결정되는 건 아님.',
      Vespa: '감사의 이유를 구체적으로 적고, 과한 수식은 덜어내면 좋아요.\n\n“보내준 간식은 잘 받았소. 덕분에 긴 일정을 한결 수월하게 마쳤군. 마음 써 줘서 고맙소.”\n\n다만 배우자에게 보내는 쪽지까지 공문처럼 다듬으면 거리감이 생길 수 있어요. 감사의 말은 남겨 두세요.',
      Mandarinia: '존귀하신 전하, 지엄하신 조건에 따라 감사의 대상·효용·답례를 간결하게 담아 올리옵니다. 🙇\n\n“비가 보낸 간식은 잘 받았소. 긴 정무를 견디는 데 제법 도움이 되었군. 세심히 챙겨 준 마음에 감사하오.”\n\n전하의 절제된 품격이 이미 충분하오나, 마지막 감사만큼은 지우지 않으심이 배우자 전하께도 뜻이 온전히 전해지는 길이옵니다.'
    },
    mercury: {
      name: '메르쿠리',
      Apis: '견과 바 감사 쪽지에 품위까지 챙김? 님 서류랑 결혼함? 🙄\n\n“간식은 잘 받았소. 덕분에 서류를 견딜 힘이 생겼군.”\n\n이 정도면 됨. 감사 인사는 배우자한테 직접 하셈. 1골드 끝.',
      Vespa: '좋아요. 황태자의 품위는 살리고, 남편의 감사는 숨기지 않는 쪽으로 가죠. 😊\n\n“간식은 잘 받았소. 비가 보내준 덕에 오늘은 서류가 먼저 지치는군. 고맙소.”\n\n짧고 여유 있죠? 다만 견과 바를 받았다는 보고만 보내면 감사 쪽지가 아니라 납품 확인서가 돼요. 마지막 말은 꼭 남겨 주세요.',
      Mandarinia: '전하의 여유와 재치에 감히 작은 문장을 보태 올리옵니다. 🌸\n\n“간식은 잘 받았소. 비가 보낸 것이라 그런지 서류를 견디는 데도 꽤 든든하군. 다음에는 고맙다는 말을 직접 전하겠소.”\n\n송구하오나, 배우자 전하께서 챙겨 주신 마음에는 전하의 짧은 감사가 가장 귀한 답례일 듯하옵니다. 소코어보다 배우자 전하께 먼저 말씀하심이 어떠하실지 조심히 아뢰옵니다.'
    },
    calliope: {
      name: '칼리오페',
      Apis: '“보내준 간식은 잘 받았소. 바쁜 하루에 작은 여유가 되었군. 고맙소.”\n\n끝. 작은 여유는 살리고 황실의 영원한 은혜 같은 건 빼셈. 견과 바 받았지 충성 맹세 받은 거 아님.',
      Vespa: '쪽지에는 품위보다 작은 온기가 오래 남아요. 과한 고백 없이 이렇게 써 볼 수 있겠어요. ✨\n\n“보내준 간식은 잘 받았소. 종일 서류뿐이던 책상에 비가 챙겨 준 여유가 놓였군. 고맙소.”\n\n선물의 실용성보다 챙겨 준 마음을 한 번 짚었어요. 이 정도의 다정함은 감사 쪽지에서도 자연스러워요.',
      Mandarinia: '전하의 절제된 문장에 배우자 전하의 마음을 받들 여백을 마련해 올리옵니다. 🕊️\n\n“보내준 간식은 잘 받았소. 서류로 가득한 하루에도 비가 건넨 작은 여유는 남는군. 마음 써 줘서 고맙소.”\n\n이미 품격은 전하께서 갖추셨으니, 쪽지에는 챙겨 주신 마음만 담으셔도 충분하옵니다. 감히 아뢰옵건대, ‘고맙소’는 꾸미지 않을수록 가장 다정하게 남사옵니다.'
    }
  };
  const coreModelButtons = [...document.querySelectorAll('[data-core-model]')];
  const corePlan = document.querySelector('#demo-plan');
  let selectedCoreModel = 'mercury';
  const renderCoreAnswer = () => {
    if (!corePlan) return;
    const model = coreAnswers[selectedCoreModel];
    document.querySelector('#demo-answer').textContent = window.AnthoriaI18n?.coreAnswer(selectedCoreModel, corePlan.value, model[corePlan.value]) ?? model[corePlan.value];
    document.querySelector('#demo-model-caption').textContent = `${copy(model.name)} · ${corePlan.value}`;
    coreModelButtons.forEach(button => {
      const active = button.dataset.coreModel === selectedCoreModel;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };
  coreModelButtons.forEach(button => button.addEventListener('click', () => {
    selectedCoreModel = button.dataset.coreModel;
    renderCoreAnswer();
  }));
  corePlan?.addEventListener('change', renderCoreAnswer);
  document.addEventListener('anthoria:languagechange', renderCoreAnswer);
  renderCoreAnswer();
  const covers = [...document.querySelectorAll('.cover-frame img')];
  const dots = [...document.querySelectorAll('.cover-dots button')];
  let current = 0;
  const show = (i) => {
    current = i;
    covers.forEach((el,n) => el.classList.toggle('active', n === i));
    dots.forEach((el,n) => el.classList.toggle('active', n === i));
  };
  dots.forEach((dot,i) => dot.addEventListener('click', () => show(i)));
  // The cover is an animated WebP; its own frame timing controls playback.

  const tabs = [...document.querySelectorAll('.log-tabs button')];
  const panels = [...document.querySelectorAll('.log-panel')];
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    panels.forEach(x => x.classList.remove('active'));
    tab.classList.add('active');
    document.querySelector(`#${tab.dataset.target}`)?.classList.add('active');
  }));

  const filters = [...document.querySelectorAll('.filter-btn')];
  const gallerySections = [...document.querySelectorAll('.gallery-section')];
  filters.forEach((button) => button.addEventListener('click', () => {
    filters.forEach(x => x.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    gallerySections.forEach(section => section.hidden = filter !== 'all' && section.dataset.group !== filter);
  }));

  const modal = document.querySelector('#password-modal');
  const passwordInput = document.querySelector('#archive-password');
  const error = document.querySelector('#password-error');
  document.addEventListener('anthoria:languagechange', () => {
    if (error?.textContent) error.textContent = copy('비밀번호가 맞지 않습니다.');
  });
  const openModal = () => { modal?.classList.add('open'); passwordInput?.focus(); };
  const closeModal = () => { modal?.classList.remove('open'); if (error) error.textContent = ''; };
  document.querySelectorAll('[data-open-archive]').forEach(x => x.addEventListener('click', openModal));
  document.querySelector('[data-close-modal]')?.addEventListener('click', closeModal);
  document.querySelector('#password-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const encoded = new TextEncoder().encode(passwordInput.value);
    const digest = await crypto.subtle.digest('SHA-256', encoded);
    const hash = [...new Uint8Array(digest)].map(x => x.toString(16).padStart(2, '0')).join('');
    if (hash === '237413507c362c452593c4551218d8bc4a36574dd49a77b1ae77f963362f224f') {
      sessionStorage.setItem('anthoriaArchive', 'open');
      location.href = 'archive.html';
    } else {
      error.textContent = copy('비밀번호가 맞지 않습니다.');
      passwordInput.select();
    }
  });
});
