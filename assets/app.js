// active 하이라이트 + 연도 자동 펼침 + 스크롤 위치 보정
document.addEventListener('DOMContentLoaded', () => {
  const norm = p => (p || '').replace(/\/+$/,'');
  const path = norm(location.pathname);

  // 현재 글 링크 활성화
  document.querySelectorAll('.left-rail a.post-link[data-path]').forEach(a => {
    const ap = norm(a.getAttribute('data-path'));
    if (ap === path) {
      a.classList.add('active');
      const d = a.closest('details'); if (d) d.open = true;
      // 긴 목록이면 영역 안에서 살짝 중앙에 보이게
      const rail = document.querySelector('.left-rail');
      if (rail) {
        const r = rail.getBoundingClientRect();
        const ar = a.getBoundingClientRect();
        if (ar.top < r.top + 80 || ar.bottom > r.bottom - 80) {
          rail.scrollTop += (ar.top - r.top) - (r.height * 0.3);
        }
      }
    }
  });

  // details 열림 상태 기억 (localStorage)
  const key = 'open-years';
  const saved = new Set((localStorage.getItem(key) || '').split(',').filter(Boolean));
  document.querySelectorAll('details.year').forEach(det => {
    const label = det.querySelector('summary')?.textContent?.trim();
    if (!label) return;
    if (saved.has(label)) det.open = true;
    det.addEventListener('toggle', () => {
      if (det.open) saved.add(label); else saved.delete(label);
      localStorage.setItem(key, Array.from(saved).join(','));
    });
  });
});

// Floating tooltip for truncated titles
document.addEventListener('DOMContentLoaded', () => {
  let tip, hold;
  const mk = () => tip || (tip = Object.assign(document.createElement('div'), { className: 'tooltip' }), document.body.appendChild(tip), tip);

  const show = (a) => {
    const text = a.dataset.full || a.title || a.textContent.trim();
    if (!text) return;
    const t = mk();
    t.textContent = text;
    t.style.display = 'block';
    // 위치 계산
    const r = a.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight, pad = 10;
    const maxW = Math.min(vw * 0.6, 420);
    t.style.maxWidth = maxW + 'px';
    // 기본: 링크 오른쪽 위
    let left = Math.min(r.right + 12, vw - pad - maxW);
    let top  = r.top - (t.offsetHeight || 40) - 8;
    if (top < pad) top = Math.min(r.bottom + 8, vh - pad); // 위가 부족하면 아래
    t.style.left = left + 'px';
    t.style.top  = top  + 'px';
  };

  const hide = () => { if (tip) tip.style.display = 'none'; };

  document.querySelectorAll('.left-rail a.post-link').forEach(a => {
    // 마우스/키보드
    a.addEventListener('mouseenter', () => show(a));
    a.addEventListener('mouseleave', hide);
    a.addEventListener('focus', () => show(a));
    a.addEventListener('blur', hide);
    // 모바일 롱프레스
    a.addEventListener('touchstart', () => { hold = setTimeout(() => show(a), 450); }, { passive: true });
    a.addEventListener('touchend',   () => { clearTimeout(hold); hide(); }, { passive: true });
    a.addEventListener('touchcancel',() => { clearTimeout(hold); hide(); });
  });

  window.addEventListener('scroll', hide, { passive: true });
  window.addEventListener('resize', hide);
});
