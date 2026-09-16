/* 소개 페이지 동작
   페이지 유일의 연출: 히어로의 "질문 → 빈칸 → 채워진 답" 타이핑.
   그 외에는 실제 기능(진단 위젯 선택, 서랍 열기)만. */
(function () {
  'use strict';

  /* ── 1. 히어로 데모 — AI가 묻고, 사용자가 채운다 ────────── */
  var line = document.getElementById('demoLine');
  var answer = document.getElementById('demoAnswer');
  var caret = document.getElementById('demoCaret');
  if (line && answer && caret) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ANSWER = '버스에서 본 광고 문구가 계속 생각났다';
    line.textContent = '이 자리에, 당신의 답';

    if (reduce) {
      line.classList.add('is-hidden');
      answer.textContent = ANSWER;
    } else {
      window.setTimeout(function typeStart() {
        line.classList.add('is-hidden');
        var i = 0;
        (function tick() {
          answer.textContent = ANSWER.slice(0, ++i);
          if (i < ANSWER.length) window.setTimeout(tick, 55);
        })();
      }, 1400);
    }
  }

  /* ── 2. 시작 지점 진단 위젯 ──────────────────────────── */
  var opts = Array.prototype.slice.call(document.querySelectorAll('.dopt'));
  if (opts.length) {
    var panels = Array.prototype.slice.call(document.querySelectorAll('.dpan'));

    function selectDiag(btn) {
      opts.forEach(function (o) {
        var on = o === btn;
        o.classList.toggle('is-on', on);
        o.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      var id = btn.getAttribute('data-t');
      panels.forEach(function (p) {
        p.classList.toggle('is-on', p.id === id);
      });
    }

    opts.forEach(function (btn, idx) {
      btn.addEventListener('click', function () { selectDiag(btn); });
      btn.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = opts[(idx + 1) % opts.length];
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = opts[(idx - 1 + opts.length) % opts.length];
        if (next) { e.preventDefault(); next.focus(); selectDiag(next); }
      });
    });
  }

  /* ── 3. 서랍 열고 닫기 ───────────────────────────────── */
  var dToggle = document.getElementById('drwBtn');
  var dBody = document.getElementById('drwBody');
  if (dToggle && dBody) {
    dToggle.addEventListener('click', function () {
      var open = dToggle.getAttribute('aria-expanded') === 'true';
      dToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      dBody.hidden = open;
    });
  }

  /* ── 4. 현재 섹션 표시 (목차 강조용, 연출 아님) ─────────── */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var secs = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && secs.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) {
          var cur = a.getAttribute('href') === '#' + en.target.id;
          a.style.color = cur ? 'var(--ink)' : '';
          a.style.borderBottomColor = cur ? 'var(--blue)' : '';
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    secs.forEach(function (s) { io.observe(s); });
  }
})();
