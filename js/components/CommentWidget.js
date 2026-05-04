/* ═══════════════════════════════════════
   CommentWidget.js — Floating feedback panel
   Comments stored in Google Spreadsheet via Apps Script
   ═══════════════════════════════════════ */

const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbyy0EnmMJRE08AcMVEGDM-qOuGEs3BBqwOk3C9fIbRM7naWaNekaIl-dS0XVSpCKByH/exec';
const NAME_KEY = 'hvac-author';

function formatDate(iso) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, '0');
  const dd   = String(d.getDate()).padStart(2, '0');
  const hh   = String(d.getHours()).padStart(2, '0');
  const min  = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

async function loadComments() {
  if (!SHEETS_URL) return [];
  try {
    const res = await fetch(SHEETS_URL);
    return await res.json();
  } catch { return []; }
}

async function postAction(body) {
  if (!SHEETS_URL) return;
  await fetch(SHEETS_URL, { method: 'POST', body: JSON.stringify(body) });
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
        <div class="cw-form-row">
          <input class="cw-name" id="cw-name" type="text" placeholder="이름" maxlength="20">
          <button class="cw-submit" id="cw-submit">등록</button>
        </div>
      </div>
    </div>
  </div>`;
}

export function mount(el) {
  const widget   = el.querySelector('#comment-widget');
  const toggle   = el.querySelector('#cw-toggle');
  const closeBtn = el.querySelector('#cw-close');
  const list     = el.querySelector('#cw-list');
  const input    = el.querySelector('#cw-input');
  const nameInput = el.querySelector('#cw-name');
  const submit   = el.querySelector('#cw-submit');
  const count    = el.querySelector('#cw-count');

  nameInput.value = localStorage.getItem(NAME_KEY) || '';

  async function renderList() {
    list.innerHTML = '<div class="cw-empty">불러오는 중...</div>';
    const comments = await loadComments();
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
          <span>
            <span class="cw-author">${(c.author || '익명').replace(/</g, '&lt;')}</span>
            <span class="cw-dot">·</span>
            <span>${formatDate(c.time)}</span>
          </span>
          <button class="cw-del" data-id="${c.id}" title="삭제">×</button>
        </div>
      </div>`).join('');

    list.querySelectorAll('.cw-del').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        await postAction({ action: 'delete', id: btn.dataset.id });
        await renderList();
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

  async function handleAdd() {
    const text   = input.value.trim();
    const author = nameInput.value.trim() || '익명';
    if (!text) return;
    submit.disabled = true;
    localStorage.setItem(NAME_KEY, nameInput.value.trim());
    await postAction({
      action: 'add',
      id: Date.now().toString(36),
      text,
      author,
      time: new Date().toISOString()
    });
    input.value = '';
    submit.disabled = false;
    await renderList();
  }

  submit.addEventListener('click', handleAdd);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdd(); }
  });
}
