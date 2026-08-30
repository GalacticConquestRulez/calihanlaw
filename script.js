// Progressive enhancement: fade sections in as they enter the viewport.
(function () {
  var targets = document.querySelectorAll(
    '.hero__inner, .section__label, .section__body, .section__head, .card, .panel'
  );

  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
    observer.observe(el);
  });
})();

// "Desire Justice?" — the hammer of justice answers.
(function () {
  var btn = document.getElementById('desireJustice');
  var stage = document.getElementById('gavelStage');
  if (!btn || !stage) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var striking = false;

  // Synthesized gavel thud: a pitch-dropping thump plus a short crack of noise.
  function thud() {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      var ctx = thud.ctx || (thud.ctx = new Ctx());
      if (ctx.state === 'suspended') ctx.resume();
      var t = ctx.currentTime;

      var osc = ctx.createOscillator();
      var oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(42, t + 0.22);
      oscGain.gain.setValueAtTime(0.5, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.connect(oscGain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.45);

      var len = Math.floor(ctx.sampleRate * 0.09);
      var buf = ctx.createBuffer(1, len, ctx.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
      }
      var noise = ctx.createBufferSource();
      noise.buffer = buf;
      var lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1400;
      var nGain = ctx.createGain();
      nGain.gain.value = 0.3;
      noise.connect(lp).connect(nGain).connect(ctx.destination);
      noise.start(t);
    } catch (e) { /* silence is acceptable in a courtroom */ }
  }

  btn.addEventListener('click', function () {
    if (striking) return;
    striking = true;
    stage.hidden = false;

    if (reduceMotion.matches) {
      // No swing, no shake — just the ruling, then the call.
      thud();
      setTimeout(function () {
        stage.hidden = true;
        striking = false;
        window.location.href = 'tel:+15852812593';
      }, 450);
      return;
    }

    stage.classList.add('is-striking');

    // Impact lands at ~54% of the 1.5s swing.
    setTimeout(function () {
      thud();
      document.body.classList.add('is-shaking');
    }, 810);

    // The gavel has spoken — place the call while it settles.
    setTimeout(function () {
      window.location.href = 'tel:+15852812593';
    }, 1250);

    setTimeout(function () {
      stage.classList.remove('is-striking');
      document.body.classList.remove('is-shaking');
      stage.hidden = true;
      striking = false;
    }, 1600);
  });
})();

// Keep the background video honest about reduced motion.
(function () {
  var video = document.querySelector('.hero__video');
  if (!video) return;
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  function apply() {
    if (mq.matches) { video.pause(); }
    else { video.play().catch(function () {}); }
  }
  apply();
  if (mq.addEventListener) mq.addEventListener('change', apply);
})();
