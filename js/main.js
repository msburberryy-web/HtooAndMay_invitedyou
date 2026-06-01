(function () {
  'use strict';

  // ── WEDDING DATE ─────────────────────────────
  const WEDDING = new Date('2025-10-16T16:00:00+09:00');

  // ── AUDIO SETUP ──────────────────────────────
  const audioPiano = document.getElementById('audio-piano');
  const audioBirds = document.getElementById('audio-birds');
  const musicBtn   = document.getElementById('music-btn');
  const iconOn     = musicBtn.querySelector('.music-icon-on');
  const iconOff    = musicBtn.querySelector('.music-icon-off');
  let musicEnabled = false;   // starts off; turns on after envelope opens
  let musicStarted = false;

  // Volume levels
  audioPiano.volume = 0.55;
  audioBirds.volume = 0.30;

  function fadeIn(audio, targetVol, duration) {
    audio.volume = 0;
    audio.play().catch(() => {}); // swallow autoplay errors
    const step = targetVol / (duration / 50);
    const timer = setInterval(() => {
      if (audio.volume + step >= targetVol) {
        audio.volume = targetVol;
        clearInterval(timer);
      } else {
        audio.volume += step;
      }
    }, 50);
  }

  function fadeOut(audio, duration) {
    const start = audio.volume;
    const step  = start / (duration / 50);
    const timer = setInterval(() => {
      if (audio.volume - step <= 0) {
        audio.volume = 0;
        audio.pause();
        clearInterval(timer);
      } else {
        audio.volume -= step;
      }
    }, 50);
  }

  function startMusic() {
    if (musicStarted) return;
    musicStarted = true;
    // Birds come in first, piano follows
    fadeIn(audioBirds, 0.30, 2000);
    setTimeout(() => fadeIn(audioPiano, 0.55, 3000), 1200);
    musicEnabled = true;
    musicBtn.classList.add('playing');
    iconOn.hidden  = false;
    iconOff.hidden = true;
  }

  function toggleMusic() {
    if (musicEnabled) {
      fadeOut(audioPiano, 1000);
      fadeOut(audioBirds, 1000);
      musicEnabled = false;
      musicBtn.classList.remove('playing');
      iconOn.hidden  = true;
      iconOff.hidden = false;
    } else {
      fadeIn(audioPiano, 0.55, 1500);
      fadeIn(audioBirds, 0.30, 1500);
      musicEnabled = true;
      musicBtn.classList.add('playing');
      iconOn.hidden  = false;
      iconOff.hidden = true;
      musicStarted   = true;
    }
  }

  musicBtn.addEventListener('click', () => {
    if (!musicStarted) {
      startMusic();
    } else {
      toggleMusic();
    }
  });

  // ── ENVELOPE ─────────────────────────────────
  const scene      = document.getElementById('envelope-scene');
  const envelope   = document.getElementById('envelope');
  const invitation = document.getElementById('invitation');
  let opened = false;

  function openEnvelope() {
    if (opened) return;
    opened = true;

    document.querySelector('.env-hint').style.opacity = '0';
    envelope.classList.add('open');

    // Start music on envelope open (user gesture = autoplay allowed)
    setTimeout(() => startMusic(), 400);

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
    const diff = WEDDING - new Date();
    if (diff <= 0) {
      document.getElementById('countdown').innerHTML =
        '<p class="label-caps" style="letter-spacing:.3em;padding:1rem 0;">Today is the day! ♡</p>';
      return;
    }
    const days  = Math.floor(diff / 864e5);
    const hours = Math.floor((diff % 864e5) / 36e5);
    const mins  = Math.floor((diff % 36e5) / 6e4);
    document.getElementById('cd-days').textContent  = days;
    document.getElementById('cd-hours').textContent = hours;
    document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 30000);

  // ── SCROLL REVEAL ─────────────────────────────
  function initReveal() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Hero content reveals immediately
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) setTimeout(() => heroContent.classList.add('visible'), 300);
  }

  // ── BUS STATION TOGGLE ───────────────────────
  document.querySelectorAll('input[name="transport"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.getElementById('bus-station-field').style.display =
        radio.value === 'bus' && radio.checked ? 'flex' : 'none';
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
        await new Promise(r => setTimeout(r, 800)); // demo delay
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
    const p = document.createElement('p');
    p.className = 'field-error';
    p.style.textAlign = 'center';
    p.style.marginTop = '1rem';
    p.textContent = msg;
    form.appendChild(p);
    setTimeout(() => p.remove(), 6000);
  }

  function clearErrors() {
    form.querySelectorAll('.field-error').forEach(e => e.remove());
  }

})();
