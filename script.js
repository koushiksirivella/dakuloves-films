// Dakuloves Films — interactions
(() => {
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.burger');
  const links = document.querySelector('.nav-links');

  // Sticky nav style
  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  if (burger) {
    burger.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }

  // Reveal on scroll
  const io = new IntersectionObserver(
    (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('in')),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---- Hero: mouse parallax + cursor glow ----
  const hero = document.querySelector('.hero');
  const glow = document.getElementById('heroGlow');
  if (hero) {
    const layers = hero.querySelectorAll('[data-parallax]');
    let raf = null, mx = 0, my = 0;
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;   // -0.5 .. 0.5
      my = (e.clientY - r.top)  / r.height - 0.5;
      if (glow) {
        glow.style.left = (e.clientX - r.left) + 'px';
        glow.style.top  = (e.clientY - r.top)  + 'px';
      }
      if (!raf) raf = requestAnimationFrame(applyParallax);
    });
    hero.addEventListener('mouseleave', () => {
      mx = my = 0;
      if (!raf) raf = requestAnimationFrame(applyParallax);
    });
    function applyParallax(){
      raf = null;
      layers.forEach(l => {
        const k = parseFloat(l.dataset.parallax) || 0.1;
        const tx = -mx * 40 * k * 10;   // px
        const ty = -my * 40 * k * 10;
        l.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
    }
  }

  // ---- Hero: scroll-tied fade + lift ----
  const heroInner = document.querySelector('.hero-inner');
  const heroBgWrap = document.querySelector('.hero-bg-wrap');
  if (hero && heroInner) {
    const onHeroScroll = () => {
      const h = hero.offsetHeight;
      const y = Math.min(Math.max(window.scrollY, 0), h);
      const t = y / h;                       // 0..1
      heroInner.style.opacity = String(1 - t * 1.4);
      heroInner.style.transform = `translate3d(0, ${ -t * 80 }px, 0)`;
      // bg parallax via inner .hero-bg (kenBurns lives there too — use translate only on wrap; we leave wrap to mouse)
      const bg = document.querySelector('.hero-bg');
      if (bg) bg.style.opacity = String(1 - t * 0.4);
    };
    window.addEventListener('scroll', onHeroScroll, { passive: true });
    onHeroScroll();
  }

  // ---- Stats counter ----
  const counters = document.querySelectorAll('[data-count]');
  const cIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      cIO.unobserve(el);
      const target = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimal || '0', 10);
      const sfx = el.dataset.suffix || '';
      const dur = 1600;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = (target * eased).toFixed(dec);
        el.textContent = val + sfx;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => cIO.observe(c));

  // Form — open WhatsApp pre-filled
  const form = document.querySelector('form.book');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const msg =
        `Hello Dakuloves Films,%0A%0A` +
        `Name: ${encodeURIComponent(fd.get('name') || '')}%0A` +
        `Phone: ${encodeURIComponent(fd.get('phone') || '')}%0A` +
        `Event: ${encodeURIComponent(fd.get('event') || '')}%0A` +
        `Date: ${encodeURIComponent(fd.get('date') || '')}%0A` +
        `Venue: ${encodeURIComponent(fd.get('venue') || '')}%0A%0A` +
        `Message: ${encodeURIComponent(fd.get('message') || '')}`;
      window.open(`https://wa.me/917765001122?text=${msg}`, '_blank');
    });
  }
})();
