(function () {
  'use strict';

  // ── WEDDING DATE ─────────────────────────────
  const WEDDING = new Date('2025-10-25T16:00:00+09:00');

  // ── ENVELOPE ─────────────────────────────────
  const scene    = document.getElementById('envelope-scene');
  const envelope = document.getElementById('envelope');
  const invitation = document.getElementById('invitation');
  let opened = false;

  function openEnvelope() {
    if (opened) return;
    opened = true;

    document.querySelector('.env-hint').style.opacity = '0';
    envelope.classList.add('open');

    setTimeout(() => {
      scene.classList.add('gone');
      invitation.removeAttribute('aria-hidden');
      invitation.classList.add('visible');
      document.body.style.overflowY = 'auto';
      initReveal();
    }, 1800);
  }

  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') openEnvelope();
  });

  document.body.style.overflow = 'hidden';

  // ── COUNTDOWN ────────────────────────────────
  function updateCountdown() {
    const now  = new Date();
    const diff = WEDDING - now;

    if (diff <= 0) {
      document.getElementById('countdown').innerHTML =
        '<p class="label-caps" style="letter-spacing:.3em;">Today is the day! ♡</p>';
      return;
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById('cd-days').textContent  = days;
    document.getElementById('cd-hours').textContent = hours;
    document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 30000);

  // ── SCROLL REVEAL ────────────────────────────
  function initReveal() {
    const els = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    els.forEach(el => observer.observe(el));

    // Hero reveals immediately
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) setTimeout(() => heroContent.classList.add('visible'), 300);
  }

  // ── BUS STATION TOGGLE ───────────────────────
  document.querySelectorAll('input[name="transport"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const busField = document.getElementById('bus-station-field');
      busField.style.display = radio.value === 'bus' && radio.checked ? 'flex' : 'none';
    });
  });

  // ── RSVP FORM ────────────────────────────────
  const form       = document.getElementById('rsvp-form');
  const successDiv = document.getElementById('rsvp-success');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors();
    if (!validate()) return;

    const btnLabel   = form.querySelector('.btn-label');
    const btnLoading = form.querySelector('.btn-loading');
    btnLabel.hidden   = true;
    btnLoading.hidden = false;

    try {
      const endpoint = form.dataset.endpoint;
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        if (!res.ok) throw new Error('error');
      } else {
        // Demo: simulate delay
        await new Promise(r => setTimeout(r, 800));
      }

      form.hidden       = true;
      successDiv.hidden = false;
    } catch {
      btnLabel.hidden   = false;
      btnLoading.hidden = true;
      addFormError('Something went wrong. Please email us directly.');
    }
  });

  function validate() {
    let ok = true;
    const name = document.getElementById('fname');
    if (!name.value.trim()) { fieldError(name, 'Please enter your name'); ok = false; }

    const email = document.getElementById('email');
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      fieldError(email, 'Please enter a valid email address'); ok = false;
    }

    if (!form.querySelector('input[name="attendance"]:checked')) {
      fieldError(form.querySelector('.radio-row'), 'Please let us know if you can attend'); ok = false;
    }
    return ok;
  }

  function fieldError(el, msg) {
    const span = document.createElement('span');
    span.className = 'field-error';
    span.textContent = msg;
    el.closest('.form-field').appendChild(span);
  }

  function addFormError(msg) {
    const p = Object.assign(document.createElement('p'), {
      className: 'field-error',
      textContent: msg,
      style: 'text-align:center;margin-top:1rem;'
    });
    form.appendChild(p);
    setTimeout(() => p.remove(), 6000);
  }

  function clearErrors() {
    form.querySelectorAll('.field-error').forEach(e => e.remove());
  }

})();
