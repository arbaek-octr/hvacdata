/* ═══════════════════════════════════════
   CommentWidget.js — Floating feedback panel
   Comments stored in localStorage
   ═══════════════════════════════════════ */

const STORAGE_KEY = 'hvac-comments';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function save(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return '방금';
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

export function render() {
  return `
  <div id="comment-widget" class="cw-widget cw-closed">
    <button class="cw-toggle" id="cw-toggle" title="피드백">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span class="cw-count" id="cw-count" style="display:none"></span>
    </button>
    <div class="cw-panel" id="cw-panel">
      <div class="cw-header">
        <span class="cw-title">피드백</span>
        <button class="cw-close" id="cw-close">×</button>
      </div>
      <div class="cw-list" id="cw-list"></div>
      <div class="cw-form">
        <textarea class="cw-input" id="cw-input" placeholder="의견을 남겨주세요..." rows="3"></textarea>
        <button class="cw-submit" id="cw-submit">등록</button>
      </div>
    </div>
  </div>`;
}

export function mount(el) {
  const widget  = el.querySelector('#comment-widget');
  const toggle  = el.querySelector('#cw-toggle');
  const panel   = el.querySelector('#cw-panel');
  const closeBtn = el.querySelector('#cw-close');
  const list    = el.querySelector('#cw-list');
  const input   = el.querySelector('#cw-input');
  const submit  = el.querySelector('#cw-submit');
  const count   = el.querySelector('#cw-count');

  function renderList() {
    const comments = load();
    count.textContent = comments.length;
    count.style.display = comments.length ? '' : 'none';
    if (!comments.length) {
      list.innerHTML = '<div class="cw-empty">아직 코멘트가 없어요</div>';
      return;
    }
    list.innerHTML = comments.slice().reverse().map(c => `
      <div class="cw-item" data-id="${c.id}">
        <div class="cw-item-text">${c.text.replace(/</g, '&lt;')}</div>
        <div class="cw-item-meta">
          <span>${timeAgo(c.time)}</span>
          <button class="cw-del" data-id="${c.id}" title="삭제">×</button>
        </div>
      </div>`).join('');

    list.querySelectorAll('.cw-del').forEach(btn => {
      btn.addEventListener('click', () => {
        const updated = load().filter(c => c.id !== btn.dataset.id);
        save(updated);
        renderList();
      });
    });
  }

  function openPanel() {
    widget.classList.remove('cw-closed');
    renderList();
    setTimeout(() => input.focus(), 180);
  }

  toggle.addEventListener('click', () => {
    if (widget.classList.contains('cw-closed')) openPanel();
    else widget.classList.add('cw-closed');
  });

  closeBtn.addEventListener('click', () => widget.classList.add('cw-closed'));

  submit.addEventListener('click', addComment);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addComment(); }
  });

  function addComment() {
    const text = input.value.trim();
    if (!text) return;
    const comments = load();
    comments.push({ id: Date.now().toString(36), text, time: new Date().toISOString() });
    save(comments);
    input.value = '';
    renderList();
  }

  renderList();
}
