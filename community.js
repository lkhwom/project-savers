const STORAGE_KEY = 'ps-community-posts-v2';

const BOARDS = {
  idea: { label: '아이디어', full: '💡 아이디어 공유' },
  talk: { label: '자유', full: '💬 자유 수다' },
  question: { label: '질문', full: '❓ 질문·피드백' }
};

const BOARD_TITLES = {
  all: '전체글',
  idea: '아이디어 공유',
  talk: '자유 수다',
  question: '질문·피드백'
};

const SEED_POSTS = [
  {
    id: 'seed-1',
    category: 'idea',
    nickname: '민지',
    title: '택배 온 거 한 화면에 모아 보고 싶어요',
    body: '쿠팡, 네이버, 당근… 택배 앱마다 확인하는 게 너무 귀찮아요.\n한 곳에서 “오늘 뭐 오는 날”만 보여 주면 좋겠는데, 비슷한 고민 있으신 분?',
    cheers: 3,
    comments: [
      { id: 'c1', nickname: '준호', body: '저도요! 특히 당근은 알림이 약해서 자주 놓쳐요.', createdAt: '2026-05-20T11:00:00.000Z' }
    ],
    createdAt: '2026-05-20T10:00:00.000Z'
  },
  {
    id: 'seed-2',
    category: 'talk',
    nickname: '수연',
    title: 'AI 툴 뭐 써 보셨어요? 추천 좀!',
    body: '챗GPT 말고도 쓸 만한 게 많다던데… 코딩 못하는 사람 기준으로 진짜 도움 되는 거 뭐가 있을까요?',
    cheers: 7,
    comments: [
      { id: 'c2', nickname: '태민', body: '노션 AI랑 클로드 메모는 글 정리할 때 편했어요.', createdAt: '2026-05-21T09:00:00.000Z' },
      { id: 'c3', nickname: '하은', body: 'Canva AI로 간단한 이미지 만드는 것도 괜찮더라고요.', createdAt: '2026-05-21T14:00:00.000Z' }
    ],
    createdAt: '2026-05-21T08:30:00.000Z'
  },
  {
    id: 'seed-3',
    category: 'question',
    nickname: '지훈',
    title: '아이디어는 있는데 “이거 될까?” 판단을 못 하겠어요',
    body: '매번 “이거 만들면 대박” 싶다가도, 주변에 물어볼 사람이 없으니까 금방 식어요.\n여기서 아이디어 피드백 받아 본 분 계세요?',
    cheers: 4,
    comments: [],
    createdAt: '2026-05-23T16:00:00.000Z'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const viewList = document.getElementById('view-list');
  const viewDetail = document.getElementById('view-detail');
  const postTableBody = document.getElementById('post-table-body');
  const postEmpty = document.getElementById('post-empty');
  const boardTitle = document.getElementById('board-title');
  const statPosts = document.getElementById('stat-posts');
  const boardNav = document.getElementById('board-nav');
  const writeModal = document.getElementById('write-modal');
  const postForm = document.getElementById('post-form');
  const commentForm = document.getElementById('comment-form');

  let currentCategory = 'all';
  let currentSort = 'latest';
  let currentPostId = null;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  function loadPosts() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (_) { /* ignore */ }
    return structuredClone(SEED_POSTS);
  }

  function savePosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatDate(iso) {
    const d = new Date(iso);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000) {
      return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
  }

  function formatDateFull(iso) {
    return new Date(iso).toLocaleString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function getFilteredPosts() {
    let posts = loadPosts();
    if (currentCategory !== 'all') {
      posts = posts.filter(p => p.category === currentCategory);
    }
    if (currentSort === 'popular') {
      posts.sort((a, b) => (b.cheers || 0) - (a.cheers || 0));
    } else {
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return posts;
  }

  function updateStats() {
    statPosts.textContent = loadPosts().length;
  }

  function showListView() {
    viewList.hidden = false;
    viewDetail.hidden = true;
    currentPostId = null;
    location.hash = '';
  }

  function showDetailView(postId) {
    currentPostId = postId;
    viewList.hidden = true;
    viewDetail.hidden = false;
    location.hash = `post/${postId}`;
    renderDetail(postId);
  }

  function renderList() {
    const posts = getFilteredPosts();
    boardTitle.textContent = BOARD_TITLES[currentCategory] || '전체글';
    updateStats();

    if (!posts.length) {
      postTableBody.innerHTML = '';
      postEmpty.hidden = false;
      return;
    }

    postEmpty.hidden = true;
    postTableBody.innerHTML = posts.map(post => {
      const board = BOARDS[post.category] || { label: '기타' };
      const commentCount = (post.comments || []).length;
      return `
        <tr data-post-id="${escapeHtml(post.id)}">
          <td class="col-board"><span class="post-row__board">${board.label}</span></td>
          <td class="col-title">
            <span class="post-row__title">
              ${escapeHtml(post.title)}
              ${commentCount ? `<span class="comment-badge">[${commentCount}]</span>` : ''}
            </span>
          </td>
          <td class="col-author"><span class="post-row__author">${escapeHtml(post.nickname)}</span></td>
          <td class="col-date">${formatDate(post.createdAt)}</td>
          <td class="col-stats">👍 ${post.cheers || 0}</td>
        </tr>
      `;
    }).join('');
  }

  function renderDetail(postId) {
    const post = loadPosts().find(p => p.id === postId);
    if (!post) { showListView(); return; }

    const board = BOARDS[post.category] || { full: '기타' };
    document.getElementById('detail-board').textContent = board.full;
    document.getElementById('detail-title').textContent = post.title;
    document.getElementById('detail-author').textContent = post.nickname;
    document.getElementById('detail-date').textContent = formatDateFull(post.createdAt);
    document.getElementById('detail-cheers').textContent = `👍 ${post.cheers || 0}`;
    document.getElementById('detail-body').textContent = post.body;

    const deleteBtn = document.getElementById('btn-detail-delete');
    deleteBtn.hidden = post.id.startsWith('seed-');

    const comments = post.comments || [];
    document.getElementById('comment-count').textContent = comments.length;
    const commentList = document.getElementById('comment-list');

    if (!comments.length) {
      commentList.innerHTML = '<li class="comment-empty">아직 댓글이 없어요. 첫 의견을 남겨 보세요!</li>';
    } else {
      commentList.innerHTML = comments.map(c => `
        <li class="comment-item">
          <div class="comment-item__head">
            <span class="comment-item__author">${escapeHtml(c.nickname)}</span>
            <span class="comment-item__date">${formatDateFull(c.createdAt)}</span>
          </div>
          <p class="comment-item__body">${escapeHtml(c.body)}</p>
        </li>
      `).join('');
    }
  }

  function openModal() {
    writeModal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (currentCategory !== 'all' && BOARDS[currentCategory]) {
      postForm.category.value = currentCategory;
    }
  }

  function closeModal() {
    writeModal.hidden = true;
    document.body.style.overflow = '';
  }

  // 게시판 필터
  boardNav.addEventListener('click', (e) => {
    const btn = e.target.closest('.board-nav__item');
    if (!btn) return;
    boardNav.querySelectorAll('.board-nav__item').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    currentCategory = btn.dataset.category;
    showListView();
    renderList();
  });

  // 정렬
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentSort = btn.dataset.sort;
      renderList();
    });
  });

  // 목록 → 상세
  postTableBody.addEventListener('click', (e) => {
    const row = e.target.closest('[data-post-id]');
    if (!row) return;
    showDetailView(row.dataset.postId);
  });

  document.getElementById('btn-back-list').addEventListener('click', () => {
    showListView();
    renderList();
  });

  // 글쓰기 모달
  document.getElementById('btn-open-write').addEventListener('click', openModal);
  writeModal.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', closeModal);
  });

  postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(postForm);
    const posts = loadPosts();
    posts.unshift({
      id: `post-${Date.now()}`,
      category: fd.get('category'),
      nickname: fd.get('nickname').trim(),
      title: fd.get('title').trim(),
      body: fd.get('body').trim(),
      cheers: 0,
      comments: [],
      createdAt: new Date().toISOString()
    });
    savePosts(posts);
    postForm.reset();
    closeModal();
    showListView();
    renderList();
  });

  // 상세: 반응
  document.getElementById('btn-detail-cheer').addEventListener('click', () => {
    if (!currentPostId) return;
    const posts = loadPosts();
    const post = posts.find(p => p.id === currentPostId);
    if (post) {
      post.cheers = (post.cheers || 0) + 1;
      savePosts(posts);
      renderDetail(currentPostId);
    }
  });

  // 상세: 삭제
  document.getElementById('btn-detail-delete').addEventListener('click', () => {
    if (!currentPostId || !confirm('이 글을 삭제할까요?')) return;
    savePosts(loadPosts().filter(p => p.id !== currentPostId));
    showListView();
    renderList();
  });

  // 댓글
  commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentPostId) return;
    const posts = loadPosts();
    const post = posts.find(p => p.id === currentPostId);
    if (!post) return;

    post.comments = post.comments || [];
    post.comments.push({
      id: `comment-${Date.now()}`,
      nickname: document.getElementById('comment-nickname').value.trim(),
      body: document.getElementById('comment-body').value.trim(),
      createdAt: new Date().toISOString()
    });
    savePosts(posts);
    commentForm.reset();
    renderDetail(currentPostId);
  });

  // URL 해시로 상세 진입
  function handleHash() {
    const match = location.hash.match(/^#post\/(.+)$/);
    if (match) {
      showDetailView(match[1]);
    }
  }

  window.addEventListener('hashchange', handleHash);
  handleHash();
  if (!location.hash.startsWith('#post/')) {
    renderList();
  }
});
