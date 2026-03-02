document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('partnership-form');
  const status = document.getElementById('form-status');
  const navbar = document.querySelector('.navbar');
  const ideaList = document.getElementById('idea-list');
  const taskList = document.getElementById('task-list');

  // Marketplace Data
  const ideas = [
    { title: "AI Inventory Predictor", desc: "SaaS that automates ordering based on CCTV analysis.", reward: "15M KRW / Mo" },
    { title: "No-Code Landing Builder", desc: "Text-to-Tailwind deployment engine.", reward: "8M KRW / Mo" },
    { title: "Pet Voice Translator", desc: "Deep learning emotion analysis for pets.", reward: "5M KRW / Mo" }
  ];

  const tasks = [
    { title: "CCTV API Logic", desc: "Fragment frame splitting & AWS Lambda integration.", reward: "2.5 ETH", tier: "Master" },
    { title: "Audio Waveform UI", desc: "React Native real-time wave visualization.", reward: "0.5 ETH", tier: "Silver" },
    { title: "Stripe Webhook Verification", desc: "Backend logic for double-verification security.", reward: "1.2 ETH", tier: "Gold" }
  ];

  // Render Marketplace
  if (ideaList) {
    ideaList.innerHTML = ideas.map(idea => `
      <div class="market-item">
        <div class="item-header">
          <span class="item-title">${idea.title}</span>
          <span class="item-reward">${idea.reward}</span>
        </div>
        <p class="item-desc">${idea.desc}</p>
        <span class="item-meta">Active Fragmentation</span>
      </div>
    `).join('');
  }

  if (taskList) {
    taskList.innerHTML = tasks.map(task => `
      <div class="market-item">
        <div class="item-header">
          <span class="item-title">${task.title}</span>
          <span class="item-reward">${task.reward}</span>
        </div>
        <p class="item-desc">${task.desc}</p>
        <span class="tier-badge tier-${task.tier.toLowerCase()}">${task.tier} Tier</span>
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
        status.innerHTML = "Success! Your vision has been deployed to the ecosystem.";
        status.className = "status-message show success";
        form.reset();
      } else {
        const result = await response.json();
        if (Object.hasOwn(result, 'errors')) {
          status.innerHTML = result.errors.map(error => error.message).join(", ");
        } else {
          status.innerHTML = "Deployment failed. Check your connection.";
        }
        status.className = "status-message show error";
      }
    } catch (error) {
      status.innerHTML = "Connection error. Retry later.";
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
