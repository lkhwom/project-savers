document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('partnership-form');
  const status = document.getElementById('form-status');
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);

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
