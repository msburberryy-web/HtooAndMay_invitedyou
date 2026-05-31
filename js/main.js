(function () {
  'use strict';

  const envelope      = document.getElementById('envelope');
  const envelopeScene = document.getElementById('envelope-scene');
  const invitation    = document.getElementById('invitation');
  const hint          = document.getElementById('envelope-hint');

  let opened = false;

  function openEnvelope() {
    if (opened) return;
    opened = true;

    hint.style.opacity = '0';
    envelope.classList.add('open');

    // After envelope animation, fade out scene and reveal invitation
    setTimeout(() => {
      envelopeScene.classList.add('hidden');
      invitation.removeAttribute('aria-hidden');
      invitation.classList.add('visible');
      document.body.style.overflowY = 'auto';
      // Kick reveal observer after invitation is visible
      triggerInitialReveal();
    }, 1600);
  }

  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') openEnvelope();
  });
  envelope.setAttribute('tabindex', '0');
  envelope.setAttribute('role', 'button');
  envelope.setAttribute('aria-label', 'Open your wedding invitation');

  // Prevent scrolling while envelope is visible
  document.body.style.overflow = 'hidden';

  // ── Scroll reveal ────────────────────────────
  function setupRevealObserver() {
    const targets = document.querySelectorAll('.reveal, .reveal-child');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.classList.contains('reveal-child')
            ? (Array.from(el.parentElement.querySelectorAll('.reveal-child')).indexOf(el)) * 120
            : 0;
          setTimeout(() => el.classList.add('visible'), delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => observer.observe(el));
  }

  function triggerInitialReveal() {
    setupRevealObserver();
    // Hero content is always visible immediately
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
      setTimeout(() => heroContent.classList.add('visible'), 200);
    }
  }

  // ── Bus station toggle ───────────────────────
  const transportRadios = document.querySelectorAll('input[name="transport"]');
  const busGroup = document.getElementById('bus-group');

  transportRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'bus' && radio.checked) {
        busGroup.style.display = 'flex';
      } else if (radio.value !== 'bus') {
        busGroup.style.display = 'none';
      }
    });
  });

  // ── RSVP Form submission ─────────────────────
  const form       = document.getElementById('rsvp-form');
  const successMsg = document.getElementById('rsvp-success');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      const btnText    = form.querySelector('.btn-text');
      const btnLoading = form.querySelector('.btn-loading');
      btnText.style.display    = 'none';
      btnLoading.style.display = 'inline';

      const data = new FormData(form);
      const payload = Object.fromEntries(data.entries());

      try {
        // Replace YOUR_FORM_ID with your Formspree endpoint
        const endpoint = form.dataset.endpoint || '#';

        if (endpoint === '#') {
          // Demo mode — simulate success after short delay
          await new Promise(r => setTimeout(r, 900));
        } else {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error('Submission failed');
        }

        form.style.display = 'none';
        successMsg.style.display = 'block';

      } catch (err) {
        btnText.style.display    = 'inline';
        btnLoading.style.display = 'none';
        showFormError('Something went wrong. Please try again or email us directly.');
      }
    });
  }

  function validateForm() {
    clearFormErrors();
    let valid = true;

    const name = document.getElementById('name');
    if (!name.value.trim()) {
      showFieldError(name, 'Please enter your name');
      valid = false;
    }

    const attendance = form.querySelector('input[name="attendance"]:checked');
    if (!attendance) {
      const group = form.querySelector('.radio-group');
      showFieldError(group, 'Please let us know if you can attend');
      valid = false;
    }

    const email = document.getElementById('email');
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showFieldError(email, 'Please enter a valid email address');
      valid = false;
    }

    return valid;
  }

  function showFieldError(el, msg) {
    const err = document.createElement('span');
    err.className = 'field-error';
    err.style.cssText = 'color:#e07a6a;font-size:0.8rem;font-style:italic;margin-top:0.2rem;display:block';
    err.textContent = msg;
    el.closest('.form-group').appendChild(err);
  }

  function showFormError(msg) {
    const err = document.createElement('p');
    err.style.cssText = 'color:#e07a6a;text-align:center;font-style:italic;margin-top:1rem;';
    err.textContent = msg;
    form.appendChild(err);
    setTimeout(() => err.remove(), 6000);
  }

  function clearFormErrors() {
    form.querySelectorAll('.field-error').forEach(e => e.remove());
  }

  // ── Smooth parallax for hero bg ──────────────
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBg.style.transform = `translateY(${scrolled * 0.35}px)`;
    }, { passive: true });
  }

})();
