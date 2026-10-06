// Editor demo langsung di preview HP (khusus owner, same-origin iframe).
// Klik teks untuk ubah, klik foto untuk ganti. Simpan kirim JSON ke server.
(function () {
  const cfg = window.__DEMO_EDITOR__ || {};
  const frame = document.getElementById('demo-frame');
  const saveBtn = document.getElementById('demo-save');
  const resetBtn = document.getElementById('demo-reset');
  const dirtyDot = document.getElementById('demo-dirty');
  const hint = document.getElementById('demo-hint');
  const fileInput = document.getElementById('demo-photo-input');

  const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const state = {}; // field -> raw string
  let dirty = false;
  let photoSlot = null;

  function setDirty(v) {
    dirty = v;
    saveBtn.disabled = !v;
    dirtyDot.classList.toggle('hidden', !v);
  }

  function parseDate(raw) {
    const m = String(raw || '').match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
    if (!m) return null;
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4] || 0), Number(m[5] || 0));
    if (Number.isNaN(d.getTime())) return null;
    return d;
  }

  function fmtDate(raw, fmt) {
    const d = parseDate(raw);
    if (!d) return null;
    const day = DAYS[d.getDay()];
    const num = String(d.getDate());
    const monthYear = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    if (fmt === 'long') return `${day}, ${num} ${monthYear}`;
    if (fmt === 'short') return `${num} ${monthYear}`;
    if (fmt === 'day') return day;
    if (fmt === 'num') return num;
    if (fmt === 'monthyear') return monthYear;
    return null;
  }

  function displayFor(field, el) {
    const raw = state[field];
    if (raw === undefined) return el.textContent;
    if (el.dataset.fmt) {
      if (field !== 'event_date') return raw;
      return fmtDate(raw, el.dataset.fmt) ?? el.textContent;
    }
    if (el.dataset.part === 'first') return String(raw).split(' ')[0];
    return raw;
  }

  function refreshField(field) {
    const doc = frame.contentDocument;
    if (!doc) return;
    doc.querySelectorAll(`[data-demo="${field}"]`).forEach((el) => {
      el.textContent = displayFor(field, el);
      if ((field === 'instagram_bride' || field === 'instagram_groom') && el.closest('a')) {
        const handle = String(state[field] || '').replace('@', '');
        if (handle) el.closest('a').setAttribute('href', `https://instagram.com/${handle}`);
      }
    });
  }

  function say(msg) {
    hint.textContent = msg;
    window.clearTimeout(say._t);
    say._t = window.setTimeout(() => { hint.textContent = 'Klik teks di HP untuk ubah. Klik foto untuk ganti.'; }, 4000);
  }

  function startTextEdit(el) {
    const field = el.dataset.demo;
    if (!field || el.querySelector('input')) return;
    const raw = state[field] !== undefined ? state[field] : el.textContent.trim();
    const input = el.ownerDocument.createElement('input');
    input.type = 'text';
    input.value = el.dataset.fmt ? (el.dataset.raw || raw) : raw;
    input.style.cssText = 'width:100%;min-width:120px;background:#fff;color:#111;border:2px solid #ca8a04;border-radius:8px;padding:4px 8px;font-size:14px;';
    const original = el.textContent;
    el.textContent = '';
    el.appendChild(input);
    input.focus();
    input.select();

    let done = false;
    const commit = (save) => {
      if (done) return;
      done = true;
      const val = input.value.trim();
      if (!save) {
        el.textContent = original;
        return;
      }
      if (el.dataset.fmt) {
        if (!parseDate(val)) {
          say('Format tanggal: YYYY-MM-DD HH:MM:SS, contoh 2026-02-14 10:00:00.');
          el.textContent = original;
          return;
        }
        state[field] = val;
        el.dataset.raw = val;
      } else if (val === '') {
        el.textContent = original;
        return;
      } else {
        state[field] = val;
      }
      refreshField(field);
      setDirty(true);
    };
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') commit(true);
      if (e.key === 'Escape') commit(false);
      e.stopPropagation();
    });
    input.addEventListener('blur', () => commit(true));
    input.addEventListener('click', (e) => e.stopPropagation());
  }

  function onFrameClick(e) {
    const photo = e.target.closest('[data-demo-photo]');
    if (photo) {
      e.preventDefault();
      e.stopPropagation();
      photoSlot = photo.dataset.demoPhoto;
      fileInput.click();
      return;
    }
    const text = e.target.closest('[data-demo]');
    if (text) {
      e.preventDefault();
      e.stopPropagation();
      startTextEdit(text);
    }
  }

  async function uploadPhoto(file) {
    const form = new FormData();
    form.append('_csrf', cfg.csrf);
    form.append('slot', photoSlot);
    form.append('photo', file);
    const r = await fetch(cfg.photoUrl, { method: 'POST', body: form });
    const out = await r.json().catch(() => ({}));
    if (!r.ok || !out.url) {
      say(out.message || 'Upload gagal.');
      return;
    }
    const doc = frame.contentDocument;
    doc.querySelectorAll(`[data-demo-photo="${photoSlot}"]`).forEach((box) => {
      const img = box.querySelector('img');
      if (img) {
        img.src = out.url;
      } else {
        box.innerHTML = `<img src="${out.url}" class="w-full h-full object-cover" alt="">`;
      }
    });
    say('Foto tersimpan.');
  }

  async function saveAll() {
    const payload = {};
    for (const k of Object.keys(state)) payload[k] = state[k];
    const r = await fetch(cfg.saveUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-csrf-token': cfg.csrf },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      say('Simpan gagal. Coba lagi.');
      return;
    }
    setDirty(false);
    say('Tersimpan. Reload demo untuk memastikan.');
  }

  frame.addEventListener('load', () => {
    try {
      const doc = frame.contentDocument;
      if (!doc) return;
      // Sembunyikan scrollbar di dalam preview (konten tetap bisa di-scroll).
      if (doc.head && !doc.querySelector('style[data-demo-chrome]')) {
        const st = doc.createElement('style');
        st.setAttribute('data-demo-chrome', '1');
        st.textContent = 'html{scrollbar-width:none!important;-ms-overflow-style:none!important}'
          + 'html::-webkit-scrollbar,body::-webkit-scrollbar,::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}';
        doc.head.appendChild(st);
      }
      // State awal dari DOM: raw tanggal + teks field lain.
      doc.querySelectorAll('[data-demo]').forEach((el) => {
        const f = el.dataset.demo;
        if (!(f in state)) {
          state[f] = el.dataset.fmt ? (el.dataset.raw || '') : el.textContent.trim();
        }
      });
      doc.addEventListener('click', onFrameClick, true);
    } catch (err) {
      say('Preview tidak bisa diakses.');
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) uploadPhoto(fileInput.files[0]);
    fileInput.value = '';
  });
  saveBtn.addEventListener('click', saveAll);
  resetBtn.addEventListener('click', () => {
    frame.contentWindow.location.reload();
    setDirty(false);
  });
})();
