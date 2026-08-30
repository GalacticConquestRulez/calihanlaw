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
