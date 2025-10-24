document.addEventListener('DOMContentLoaded', () => {
  // Прокручиваем страницу наверх при загрузке
  window.scrollTo(0, 0);
  
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
        console.log('Отправляем данные (контактная форма):', payload);
        console.log('Endpoint:', endpoint);
        
        const res = await fetch(endpoint, {
          method: 'POST',
          mode: 'no-cors',
          body
        });
        
        console.log('Запрос отправлен (контактная форма)');
        // With no-cors we can't read status; optimistically show success
        if (statusEl) statusEl.textContent = 'Заявка отправлена!';
        form.reset();
      } catch (err) {
        console.error('Ошибка (контактная форма):', err);
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
        console.log('Отправляем данные:', payload);
        console.log('Endpoint:', endpoint);
        
        const res = await fetch(endpoint, {
          method: 'POST',
          mode: 'no-cors',
          body
        });
        
        console.log('Запрос отправлен');
        // With no-cors we can't read status; optimistically show success
        submitBtn.textContent = 'Заявка отправлена!';
        heroForm.reset();
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 3000);
      } catch (err) {
        console.error('Ошибка:', err);
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
  
  // Кнопка "Наверх"
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (scrollToTopBtn) {
    // Показываем кнопку при прокрутке вниз
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    });
    
    // Плавная прокрутка наверх при клике
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Делаем карточки услуг кликабельными
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    const link = card.querySelector('.service-button .btn');
    if (link) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        // Предотвращаем клик, если кликнули именно на кнопку
        if (e.target.closest('.service-button')) {
          return;
        }
        // Переходим по ссылке
        window.location.href = link.href;
      });
    }
  });

  // Cookie баннер
  const cookieBanner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('acceptCookies');
  const rejectBtn = document.getElementById('rejectCookies');

  if (cookieBanner && acceptBtn && rejectBtn) {
    // Проверяем, есть ли уже сохранённое согласие
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent) {
      // Показываем баннер через небольшую задержку
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 1000);
    }

    // Обработка принятия cookies
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('show');
      
      // Загружаем Яндекс.Метрику после согласия
      if (typeof ym !== 'undefined') {
        ym(123147, 'reachGoal', 'cookie_accepted');
      }
    });

    // Обработка отклонения cookies
    rejectBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'rejected');
      cookieBanner.classList.remove('show');
    });
  }
  
  // Проверяем согласие и загружаем Яндекс.Метрику если согласен
  const cookieConsent = localStorage.getItem('cookieConsent');
  if (cookieConsent === 'accepted' && typeof ym !== 'undefined') {
    // Метрика уже загружена в head, ничего не делаем
  }
});


