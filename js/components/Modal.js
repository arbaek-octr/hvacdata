/* ═══════════════════════════════════════
   components/Modal.js
   Data-point edit modal
   ═══════════════════════════════════════ */
import { updateDataPoint } from '../store.js';

let _dp = null; // current data point being edited

export function render() {
  return /* html */`
<div class="modal-overlay" id="modal-overlay">
  <div class="modal-box">
    <div class="modal-name" id="modal-name">Point Name</div>
    <div class="modal-addr" id="modal-addr">address</div>
    <div class="modal-cur">
      <span class="modal-cur-lbl">현재값</span>
      <span class="modal-cur-val" id="modal-cur">--</span>
    </div>
    <label class="modal-lbl">새 값 입력</label>
    <input class="modal-input" id="modal-input" type="text" autocomplete="off">
    <div class="modal-btns">
      <button class="btn-primary" id="modal-apply">적용</button>
      <button class="btn-ghost"   id="modal-cancel">취소</button>
    </div>
  </div>
</div>`;
}

export function mount(el) {
  const overlay = el.querySelector('#modal-overlay');
  const input   = el.querySelector('#modal-input');

  el.querySelector('#modal-apply').addEventListener('click', apply);
  el.querySelector('#modal-cancel').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') apply();
    if (e.key === 'Escape') close();
  });
}

export function open(dp) {
  _dp = dp;
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-name').textContent = dp.name;
  document.getElementById('modal-addr').textContent = dp.address;
  document.getElementById('modal-cur').textContent  = dp.value + (dp.unit ? ' ' + dp.unit : '');
  document.getElementById('modal-input').value = dp.value;
  overlay.classList.add('open');
  setTimeout(() => document.getElementById('modal-input').focus(), 50);
}

function apply() {
  if (!_dp) return;
  const raw = document.getElementById('modal-input').value.trim();
  updateDataPoint(_dp.id, raw);
  // Update the display in the current page
  const valEl = document.querySelector(`[data-dp-id="${_dp.id}"] .dp-value`);
  if (valEl) valEl.textContent = raw + (_dp.unit ? ' ' + _dp.unit : '');
  close();
}

function close() {
  document.getElementById('modal-overlay').classList.remove('open');
  _dp = null;
}
