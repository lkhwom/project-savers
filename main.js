document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('partnership-form');
  const status = document.getElementById('form-status');

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    
    // UI state: Loading
    const submitBtn = form.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span>';

    try {
      const response = await fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        status.innerHTML = "Thanks! Your inquiry has been sent successfully.";
        status.className = "status-message show success";
        form.reset();
      } else {
        const result = await response.json();
        if (Object.hasOwn(result, 'errors')) {
          status.innerHTML = result.errors.map(error => error.message).join(", ");
        } else {
          status.innerHTML = "Oops! There was a problem submitting your form.";
        }
        status.className = "status-message show error";
      }
    } catch (error) {
      status.innerHTML = "Oops! There was a connection problem.";
      status.className = "status-message show error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      
      // Auto-hide status after 5 seconds
      setTimeout(() => {
        status.classList.remove('show');
      }, 5000);
    }
  }

  form.addEventListener("submit", handleSubmit);
});
