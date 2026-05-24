/**
 * IdeaGrid 조립 로더
 * ─ IdeaGrid.html 을 #idea-grid-mount 에 삽입합니다.
 * — 카드 구역 수정은 IdeaGrid.html 만 편집하세요.
 */
(function () {
  const MOUNT_ID = 'idea-grid-mount';
  const COMPONENT_PATH = 'IdeaGrid.html';

  async function mountIdeaGrid() {
    const mount = document.getElementById(MOUNT_ID);
    if (!mount) return;

    try {
      const response = await fetch(COMPONENT_PATH);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      mount.innerHTML = await response.text();
    } catch (error) {
      console.error('[IdeaGrid] 불러오기 실패:', error);
      mount.innerHTML =
        '<p style="text-align:center;color:var(--text-muted);padding:2rem;">아이디어 카드를 불러오지 못했어요. 페이지를 새로고침해 주세요.</p>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountIdeaGrid);
  } else {
    mountIdeaGrid();
  }
})();
