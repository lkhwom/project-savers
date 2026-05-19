document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('partnership-form');
  const status = document.getElementById('form-status');
  const navbar = document.querySelector('.navbar');
  const ideaList = document.getElementById('idea-list');
  const ideas = [
    {
      title: "무료 체험 취소 알리미",
      desc: "넷플릭스, 쿠팡 와우 무료 체험 끝나기 딱 하루 전! 내 계좌에서 돈 빠져나가는 걸 막아 주는 생명의 알림.",
      meta: "구독 · 돈"
    },
    {
      title: "옷차림 기억장치",
      desc: "“쟤 만날 때 뭐 입었지?” “너 저번에도 그거 입지 않았어?” 고민하기 싫을 때. 친구별로 마지막에 만났을 때 입었던 옷을 적어 두는 메모.",
      meta: "일상 · 취향"
    },
    {
      title: "회식 탈출 도우미",
      desc: "숨 막히는 술자리에 타이머만 맞춰 두면, 10분 뒤 “어머니로부터 긴급 전화”가 울려서 자연스럽게 나올 각을 만들어 줌.",
      meta: "모임 · 유머"
    },
    {
      title: "월세·관리비 납부일 알림",
      desc: "매달 같은 날인데 자꾸 까먹을 때, 미리 하루 전에 알려 주는 간단한 알림.",
      meta: "생활 · 돈"
    },
    {
      title: "부모님 병원·약 먹는 시간 공유",
      desc: "형제가 돌아가며 챙기는데, 누가 언제 데려갔는지, 무엇을 유의하는지 가족끼리만 공유하는 메모.",
      meta: "가족 · 건강"
    },
    {
      title: "이번 달 뭐 샀지 자동 정리",
      desc: "쿠팡·배민·카드 문자가 쏟아질 때, 이번 달에 쓴 돈과 뭘 샀는지 한곳에 모아 보여 주는 앱.",
      meta: "쇼핑 · 가계"
    }
  ];

  if (ideaList) {
    ideaList.innerHTML = ideas.map(idea => `
      <div class="market-item">
        <div class="item-header">
          <span class="item-title">${idea.title}</span>
        </div>
        <p class="item-desc">${idea.desc}</p>
        <span class="item-meta">${idea.meta}</span>
      </div>
    `).join('');
  }

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    
    // UI state: Loading
    const submitBtn = form.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>보내는 중...</span>';

    try {
      const response = await fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        status.innerHTML = "잘 보냈어요! 곧 확인할게요.";
        status.className = "status-message show success";
        form.reset();
      } else {
        const result = await response.json();
        if (Object.hasOwn(result, 'errors')) {
          status.innerHTML = result.errors.map(error => error.message).join(", ");
        } else {
          status.innerHTML = "보내지 못했어요. 인터넷 연결을 확인해 주세요.";
        }
        status.className = "status-message show error";
      }
    } catch (error) {
      status.innerHTML = "연결 오류예요. 잠시 뒤 다시 시도해 주세요.";
      status.className = "status-message show error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      
      setTimeout(() => {
        status.classList.remove('show');
      }, 6000);
    }
  }

  if (form) form.addEventListener("submit", handleSubmit);
});
