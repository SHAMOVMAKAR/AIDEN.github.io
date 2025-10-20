document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!expanded));
      if (window.matchMedia('(min-width: 760px)').matches) return;
      nav.classList.toggle('is-open', !expanded);
      if (!expanded) {
        nav.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => {
            burger.setAttribute('aria-expanded', 'false');
            nav.classList.remove('is-open');
          }, { once: true });
        });
      }
    });
  }

  // Contact form → Google Apps Script endpoint
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (statusEl) statusEl.textContent = 'Отправляем...';
      const endpoint = form.getAttribute('data-endpoint');
      if (!endpoint || endpoint === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
        if (statusEl) statusEl.textContent = 'Не задан адрес приёма формы.';
        return;
      }
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      try {
        const body = new URLSearchParams(payload);
        const res = await fetch(endpoint, {
          method: 'POST',
          mode: 'no-cors',
          body
        });
        // With no-cors we can't read status; optimistically show success
        if (statusEl) statusEl.textContent = 'Заявка отправлена!';
        form.reset();
      } catch (err) {
        if (statusEl) statusEl.textContent = 'Ошибка отправки. Попробуйте ещё раз.';
      }
    });
  }

  // Hero form → Google Apps Script endpoint
  const heroForm = document.getElementById('heroContactForm');
  if (heroForm) {
    heroForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = heroForm.querySelector('.btn-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Отправляем...';
      submitBtn.disabled = true;
      
      const endpoint = heroForm.getAttribute('data-endpoint');
      if (!endpoint || endpoint === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
        submitBtn.textContent = 'Не задан адрес приёма формы.';
        submitBtn.disabled = false;
        return;
      }
      
      const formData = new FormData(heroForm);
      const payload = Object.fromEntries(formData.entries());
      
      try {
        const body = new URLSearchParams(payload);
        const res = await fetch(endpoint, {
          method: 'POST',
          mode: 'no-cors',
          body
        });
        // With no-cors we can't read status; optimistically show success
        submitBtn.textContent = 'Заявка отправлена!';
        heroForm.reset();
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 3000);
      } catch (err) {
        submitBtn.textContent = 'Ошибка отправки. Попробуйте ещё раз.';
        submitBtn.disabled = false;
      }
    });
  }
  // Services accordion: keep only one details open at a time within the grid
  const servicesGrid = document.querySelector('#products .cards-grid');
  if (servicesGrid) {
    const items = Array.from(servicesGrid.querySelectorAll('details.service'));
    items.forEach((detailsEl) => {
      const summary = detailsEl.querySelector('summary');
      if (!summary) return;
      const toggleExclusive = () => {
        const isOpen = detailsEl.hasAttribute('open');
        items.forEach(d => d.removeAttribute('open'));
        if (!isOpen) detailsEl.setAttribute('open', '');
      };
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        toggleExclusive();
      });
      summary.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleExclusive();
        }
      });
    });
  }
});


