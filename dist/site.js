document.addEventListener('DOMContentLoaded', () => {
  const covers = [...document.querySelectorAll('.cover-frame img')];
  const dots = [...document.querySelectorAll('.cover-dots button')];
  let current = 0;
  const show = (i) => {
    current = i;
    covers.forEach((el,n) => el.classList.toggle('active', n === i));
    dots.forEach((el,n) => el.classList.toggle('active', n === i));
  };
  dots.forEach((dot,i) => dot.addEventListener('click', () => show(i)));
  if (covers.length > 1) setInterval(() => show((current + 1) % covers.length), 4200);

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
      error.textContent = '비밀번호가 맞지 않습니다.';
      passwordInput.select();
    }
  });
});
