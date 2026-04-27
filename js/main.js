// ─── SCROLL REVEAL ───
// Adiciona .visible nos elementos .fade-in-up quando entram na tela
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

// ─── MENU HAMBÚRGUER (mobile) ───
const hamburger = document.querySelector('.nav-hamburger');
const navMobile = document.getElementById('nav-mobile');

hamburger.addEventListener('click', () => {
  const isOpen = navMobile.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Fecha o menu ao clicar em um link
navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// ── Carrossel de Projetos ──
(function () {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  let cur = 0;
  const total = track.children.length;
  const dots = document.querySelectorAll('.carousel-dot');

  function getCardWidth() {
    const card = track.children[0];
    const gap = 20; // ajuste se necessário
    return card.offsetWidth + gap;
  }

  function goTo(i) {
    cur = (i + total) % total;

    const cardWidth = getCardWidth();

    track.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    track.style.transform = `translateX(-${cur * cardWidth}px)`;

    dots.forEach(d => d.classList.toggle('active', +d.dataset.i === cur));
  }

  document.getElementById('carouselPrev').addEventListener('click', () => goTo(cur - 1));
  document.getElementById('carouselNext').addEventListener('click', () => goTo(cur + 1));
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.i)));

  // ── Drag / swipe ──
  let startX = 0, dragging = false, moved = false;

  track.addEventListener('mousedown', e => {
    startX = e.clientX;
    dragging = true;
    moved = false;
  });

  window.addEventListener('mousemove', e => {
    if (!dragging) return;

    const dx = e.clientX - startX;
    if (Math.abs(dx) > 5) moved = true;

    const cardWidth = getCardWidth();

    track.style.transition = 'none';
    track.style.transform = `translateX(${-(cur * cardWidth) + dx}px)`;
  });

  window.addEventListener('mouseup', e => {
    if (!dragging) return;

    dragging = false;
    const dx = e.clientX - startX;

    if (Math.abs(dx) > 60) {
      goTo(dx < 0 ? cur + 1 : cur - 1);
    } else {
      goTo(cur);
    }
  });

  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    dragging = true;
    moved = false;
  }, { passive: true });

  track.addEventListener('touchmove', e => {
    if (!dragging) return;

    const dx = e.touches[0].clientX - startX;
    if (Math.abs(dx) > 5) moved = true;

    const cardWidth = getCardWidth();

    track.style.transition = 'none';
    track.style.transform = `translateX(${-(cur * cardWidth) + dx}px)`;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    dragging = false;

    const dx = e.changedTouches[0].clientX - startX;

    if (Math.abs(dx) > 60) {
      goTo(dx < 0 ? cur + 1 : cur - 1);
    } else {
      goTo(cur);
    }
  });

  // Impede clique quando arrasta
  track.addEventListener('click', e => {
    if (moved) e.preventDefault();
  }, true);
})();