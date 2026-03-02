document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('partnership-form');
  const status = document.getElementById('form-status');
  const navbar = document.querySelector('.navbar');

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
    submitBtn.innerHTML = '<span>Processing Vision...</span>';

    try {
      const response = await fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        status.innerHTML = "Success! We've received your vision. Our community will reach out soon.";
        status.className = "status-message show success";
        form.reset();
      } else {
        const result = await response.json();
        if (Object.hasOwn(result, 'errors')) {
          status.innerHTML = result.errors.map(error => error.message).join(", ");
        } else {
          status.innerHTML = "Oops! There was a problem submitting your vision.";
        }
        status.className = "status-message show error";
      }
    } catch (error) {
      status.innerHTML = "Connection error. Please try again later.";
      status.className = "status-message show error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      
      setTimeout(() => {
        status.classList.remove('show');
      }, 6000);
    }
  }

  form.addEventListener("submit", handleSubmit);
});
