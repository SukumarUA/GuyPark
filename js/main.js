(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // ----- Mobile menu -----
    var toggle = document.querySelector('.menu-toggle');
    var nav    = document.querySelector('.nav');

    if (toggle && nav) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        var icon = toggle.querySelector('i');
        if (icon) {
          icon.classList.toggle('fa-bars', !open);
          icon.classList.toggle('fa-times', open);
        }
      });

      nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          var icon = toggle.querySelector('i');
          if (icon) { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }
        });
      });
    }

    // ----- Auto-highlight active nav link based on current page filename -----
    var path = location.pathname.toLowerCase();
    var current = path.split('/').pop() || 'index.html';
    if (current === '') current = 'index.html';

    var baseCurrent = current.replace(/\.html$/, '');
    if (baseCurrent === 'index' || baseCurrent === '') baseCurrent = 'index';

    document.querySelectorAll('.nav a[href]:not(.nav-cta)').forEach(function (link) {
      var href = link.getAttribute('href').toLowerCase();
      var baseHref = href.split('/').pop().replace(/\.html$/, '').split('#')[0];
      if (baseHref === baseCurrent) {
        link.classList.add('is-active');
      }
    });

    // ----- Smooth scroll for in-page anchors, accounting for sticky header -----
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        var target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        var header = document.querySelector('.site-header');
        var subnav = document.querySelector('.subnav');
        var offset = (header ? header.offsetHeight : 0) + (subnav ? subnav.offsetHeight : 0);
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset - 12;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });

    // ----- Reveal-on-scroll for sections, cards, and headers -----
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion && 'IntersectionObserver' in window) {
      var revealTargets = document.querySelectorAll('.section-header, .service-card, .review-card, .hero-card, .stat, .resource-card, .service-block, .value-card, .pharmacist-card, .info-card, .form-card');
      revealTargets.forEach(function (el) { el.classList.add('reveal'); });

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

      revealTargets.forEach(function (el) { io.observe(el); });
    }

    // ----- Contact form submission (Netlify, general inquiries only — no PHI) -----
    document.querySelectorAll('form[data-netlify="true"]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        if (!btn) return;
        var originalLabel = btn.innerHTML;

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

        var formData = new FormData(form);
        formData.append('form-name', form.getAttribute('name') || 'contact');

        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        })
          .then(function () {
            btn.innerHTML = '<i class="fas fa-check"></i> Message sent';
            form.reset();
          })
          .catch(function () {
            btn.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Error - please call us';
            btn.style.background = 'var(--red-600)';
          })
          .finally(function () {
            setTimeout(function () {
              btn.innerHTML = originalLabel;
              btn.disabled = false;
              btn.style.background = '';
            }, 4000);
          });
      });
    });
  });
})();
