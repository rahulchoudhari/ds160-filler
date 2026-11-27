// ==UserScript==
// @name         DS-160 Autofill
// @namespace    local.ds160.autofill
// @version      1.1
// @description  Fills DS-160 pages from a profile you paste in. No network access. Never signs or submits.
// @match        https://ceac.state.gov/GenNIV/*
// @match        https://ceac.state.gov/genniv/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==
//
// HOW IT WORKS
// 1. Click "DS-160 Autofill" (bottom-right) > paste one person's profile JSON > Load.
//    The profile is kept in sessionStorage only: it disappears when you close the tab.
// 2. On each page click "Fill this page". Yes/No questions and "Add Another" make the page
//    reload; the script continues automatically after each reload, filling only EMPTY fields.
// 3. Type ID numbers yourself (passport, SSN, TIN, driver's licence). Review, then click Next.
// It never clicks Next, Sign or Submit, and it never sends data anywhere.

(function () {
  'use strict';
  const KEY = 'ds160_profile', RUN = 'ds160_autorun';
  const P = 'ctl00_SiteContentPlaceHolder_FormView1_';
  const node = (location.search.match(/node=([^&]+)/) || [])[1] || '';
  const $ = id => document.getElementById(P + id);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const load = () => { try { return JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch { return null; } };

  function setSelect(el, v) {
    const s = String(v).trim().toUpperCase();
    const o = [...el.options].find(o => o.value === String(v)) ||
              [...el.options].find(o => o.text.trim().toUpperCase() === s);
    if (!o) return false;
    if (el.value !== o.value) { el.value = o.value; el.dispatchEvent(new Event('change', { bubbles: true })); }
    return true;
  }
  function setPlain(el, v) {
    if (el.tagName === 'SELECT') return setSelect(el, v);
    if (el.type === 'checkbox') { if (!!v !== el.checked) el.click(); return true; }
    if (!el.value) { el.value = v; el.dispatchEvent(new Event('change', { bubbles: true })); }
    return true;
  }
  // Yes/No radio: "rblX": "Y" | "N". Returns true if a click (possible postback) happened.
  function setRadio(name, v) {
    const el = $(name + (String(v).toUpperCase().startsWith('Y') ? '_0' : '_1'));
    if (!el || el.checked) return false;
    el.click(); return true;
  }
  // Repeating rows: "_rows": { "dtlPREV_US_VISIT": [ {field: value}, ... ] }
  function fillRows(prefix, rows) {
    const row = i => P + prefix + '_ctl' + String(i).padStart(2, '0') + '_';
    let n = 0; while (document.querySelector('[id^="' + row(n) + '"]')) n++;
    for (let i = 0; i < Math.min(n, rows.length); i++)
      for (const [k, v] of Object.entries(rows[i])) {
        const el = document.getElementById(row(i) + k); if (el) setPlain(el, v);
      }
    if (n > 0 && n < rows.length) {
      const add = document.querySelector('[id^="' + row(n - 1) + 'Insert"]');
      if (add && !add.hasAttribute('disabled')) { add.click(); return true; }
    }
    return false;
  }

  async function fillPage() {
    const prof = load(); if (!prof) return say('Load a profile first.');
    const page = prof.pages && prof.pages[node];
    if (!page) { sessionStorage.removeItem(RUN); return say('Nothing to fill on "' + node + '".'); }
    sessionStorage.setItem(RUN, node);
    // 1) plain fields and selects (no postback)
    for (const [k, v] of Object.entries(page)) {
      if (k.startsWith('_') || k.startsWith('rbl')) continue;
      const el = $(k); if (el) setPlain(el, v);
    }
    // 2) yes/no answers, one at a time (some reload the page; if so, autorun continues after reload)
    for (const [k, v] of Object.entries(page)) {
      if (!k.startsWith('rbl')) continue;
      if (setRadio(k, v)) await sleep(1500);
    }
    // 2b) security pages: "_allNo": true answers every question on the page NO (read them first!)
    if (page._allNo)
      for (const el of document.querySelectorAll('input[type=radio][id^="' + P + '"][id$="_1"]'))
        if (!el.checked) { el.click(); await sleep(300); }
    // 3) dropdowns that reveal more fields: "_postback": { dropdownId: fieldItReveals }
    for (const [dd, revealed] of Object.entries(page._postback || {})) {
      const el = $(dd);
      if (el && el.value && !$(revealed) && window.__doPostBack) { window.__doPostBack(el.name, ''); return; }
    }
    await sleep(300);
    for (const [k, v] of Object.entries(page)) {          // second pass for revealed fields
      if (k.startsWith('_') || k.startsWith('rbl')) continue;
      const el = $(k); if (el) setPlain(el, v);
    }
    // 4) repeating rows
    for (const [prefix, rows] of Object.entries(page._rows || {}))
      if (fillRows(prefix, rows)) { await sleep(2500); return fillPage(); }  // reloads; continues
    sessionStorage.removeItem(RUN);
    say('Done. Type any ID numbers, review, then click Next yourself.');
  }

  // ---------- small panel ----------
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:99999;background:#fff;border:2px solid #1d3d6b;border-radius:8px;padding:8px;font:13px sans-serif;width:260px;box-shadow:0 2px 8px #0003';
  box.innerHTML = '<b>DS-160 Autofill</b> <span id="d6who" style="color:#555"></span><br>' +
    '<button id="d6fill" style="margin:6px 0;width:100%">Fill this page</button>' +
    '<details><summary>Load / clear profile</summary>' +
    '<textarea id="d6json" rows="4" style="width:100%" placeholder="Paste profile JSON"></textarea>' +
    '<button id="d6load">Load</button> <button id="d6clear">Clear</button></details>' +
    '<div id="d6msg" style="color:#1d3d6b;margin-top:4px"></div>';
  document.body.appendChild(box);
  const say = m => { document.getElementById('d6msg').textContent = m; };
  const who = () => { const p = load(); document.getElementById('d6who').textContent = p ? '(' + p.person + ')' : '(no profile)'; };
  document.getElementById('d6fill').onclick = fillPage;
  document.getElementById('d6load').onclick = () => {
    try { const p = JSON.parse(document.getElementById('d6json').value); if (!p.pages) throw 0;
      sessionStorage.setItem(KEY, JSON.stringify(p)); document.getElementById('d6json').value = ''; who(); say('Loaded ' + p.person + '.');
    } catch { say('That is not a valid profile.'); }
  };
  document.getElementById('d6clear').onclick = () => { sessionStorage.removeItem(KEY); sessionStorage.removeItem(RUN); who(); say('Cleared.'); };
  who();
  if (sessionStorage.getItem(RUN) === node) setTimeout(fillPage, 600);   // continue after a postback
})();
