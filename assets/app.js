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
