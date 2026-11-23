const menuButton = document.querySelector('.menu-btn');
const navigation = document.querySelector('.navlinks');

function setMenuOpen(open) {
  navigation.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

menuButton.addEventListener('click', () => {
  setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
});
navigation.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => setMenuOpen(false));
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuButton.focus();
  }
});
matchMedia('(width > 1050px)').addEventListener('change', event => {
  if (event.matches) setMenuOpen(false);
});

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const heroVideo = document.querySelector('.hero-video');

function syncHeroVideo() {
  if (!heroVideo) return;
  if (reducedMotion.matches) {
    heroVideo.pause();
  } else {
    heroVideo.play().catch(() => {});
  }
}

syncHeroVideo();
reducedMotion.addEventListener('change', syncHeroVideo);

if ('IntersectionObserver' in window && 'animate' in Element.prototype) {
  const easing = 'cubic-bezier(.22, 1, .36, 1)';
  const fade = { opacity: 0 };
  const motion = [
    ['.topbar > *, .nav-wrap nav > *', { opacity: 0, translate: '0 -8px' }, 460, 45],
    ['.hero-inner > .eyebrow', { opacity: 0, translate: '-18px 0' }, 640],
    ['.hero-inner > h1', [
      { opacity: 0, clipPath: 'inset(0 0 100% 0)', translate: '0 18px' },
      { opacity: 1, clipPath: 'inset(0)', translate: '0 0' },
    ], 1040, 0, 100],
    ['.hero-inner > p, .hero-ctas', { opacity: 0, translate: '0 22px' }, 760, 120, 290],
    ['.intro-heading', { opacity: 0, translate: '-28px 0' }, 760],
    ['.intro-copy > p', { opacity: 0, translate: '20px 0' }, 720, 115, 70],
    ['#academics .section-head > *', { opacity: 0, translate: '0 14px' }, 620, 95],
    ['.school', { opacity: 0, translate: '0 24px', scale: '.96' }, 630, 72],
    ['.campus-art', [
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0)' },
    ], 1080],
    ['.campus-copy > *', { opacity: 0, translate: '24px 0' }, 680, 85, 110],
    ['#life .section-head > *', fade, 640, 100],
    ['.feature:first-child', { opacity: 0, translate: '-24px 0', scale: '.98' }, 760],
    ['.feature:nth-child(2)', { opacity: 0, translate: '24px 0', scale: '.98' }, 760, 0, 100],
    ['.recruiter-intro > h1', { opacity: 0, scale: '.96' }, 780],
    ['.recruiter-intro > p, .recruiters > h2', fade, 660, 0, 120],
    ['.recruiter-grid > li', { opacity: 0, scale: '.93' }, 550, 50],
    ['.recruiters > .pill', { opacity: 0, translate: '0 12px' }, 560],
    ['#campus-tour > h2', { opacity: 0, translate: '0 12px' }, 620, 90],
    ['.campus-tour-frame', { opacity: 0, scale: '.97' }, 820],
    ['.campus-tour-scan', [
      { opacity: 0, translate: '0 -96%' },
      { opacity: .85, offset: .18 },
      { opacity: .85, offset: .8 },
      { opacity: 0, translate: '0 4%' },
    ], 1300, 0, 240],
    ['.footer-grid > *, .footer-bottom', { opacity: 0, translate: '0 10px' }, 660, 95],
  ];

  const effects = new Map();
  const observer = new IntersectionObserver(entries => {
    const visibleByGroup = new Map();
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target;
      observer.unobserve(element);
      if (reducedMotion.matches || element.matches(':focus-within')) continue;

      const effect = effects.get(element);
      const [, frames, duration, stagger = 0, startDelay = 0] = effect;
      const index = visibleByGroup.get(effect) ?? 0;
      visibleByGroup.set(effect, index + 1);
      element.animate(Array.isArray(frames) ? frames : [frames, {}], {
        duration,
        delay: startDelay + Math.min(index * stagger, 320),
        easing,
        fill: 'backwards',
      });
    }
  }, { threshold: .12 });

  if (!reducedMotion.matches) {
    for (const effect of motion) {
      for (const element of document.querySelectorAll(effect[0])) {
        effects.set(element, effect);
        observer.observe(element);
      }
    }
  }

  document.addEventListener('focusin', event => {
    for (let element = event.target; element; element = element.parentElement) {
      if (effects.has(element)) element.getAnimations().forEach(animation => animation.cancel());
    }
  });

  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    for (const element of effects.keys()) {
      element.getAnimations().forEach(animation => animation.cancel());
    }
    effects.clear();
  });
}
