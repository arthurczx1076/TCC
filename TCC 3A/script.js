/* Navegação por hash, menu móvel e WhatsApp */
const WHATSAPP = '5500000000000'; // número demonstrativo (DDI+DDD+número)
const MSG = 'Olá! Gostaria de agendar uma consulta.';
const paginas = [...document.querySelectorAll('.pagina')];
const menu = document.getElementById('menu');
const burger = document.querySelector('.burger');

function rota() {
  const hash = location.hash.slice(1) || 'home';
  const nomes = paginas.map(p => p.dataset.page);
  const base = hash.split('-')[0];
  const secaoHome = document.getElementById(hash);
  const ehSecaoHome = secaoHome && secaoHome.closest('[data-page="home"]');
  const alvo = ehSecaoHome || hash === 'home' ? 'home' : (nomes.includes(base) ? base : 'em-breve');
  paginas.forEach(p => p.classList.toggle('on', p.dataset.page === alvo));
  document.querySelectorAll('[data-nav]').forEach(a =>
    a.classList.toggle('ativo', a.dataset.nav === (alvo === 'em-breve' ? base : alvo)));
  if (ehSecaoHome) secaoHome.scrollIntoView();
  else { const sub = document.getElementById(hash); if (sub && sub.closest('.pagina.on')) sub.scrollIntoView(); else window.scrollTo({ top: 0 }); }
  fechaMenu();
}
function fechaMenu() { menu.classList.remove('aberto'); burger.setAttribute('aria-expanded', 'false'); }

burger.addEventListener('click', () => {
  const aberto = menu.classList.toggle('aberto');
  burger.setAttribute('aria-expanded', aberto);
});
document.querySelectorAll('[data-wa]').forEach(a => {
  a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(MSG)}`;
  a.target = '_blank'; a.rel = 'noopener';
});
// FAQ: abre uma pergunta por vez
document.querySelectorAll('.faq details').forEach(d =>
  d.addEventListener('toggle', () => d.open &&
    document.querySelectorAll('.faq details').forEach(o => o !== d && (o.open = false))));

window.addEventListener('hashchange', rota);
rota();
/* ===== Animações ao rolar ===== */
document.documentElement.classList.add('js');
const topo = document.querySelector('.topo');
const barra = document.querySelector('.progresso');
const flor = document.querySelector('.hero-flor');
// Marca elementos para revelar, com escalonamento dentro de cada grupo
const grupos = '.grade4,.grade3,.difs,.mvv,.info,.faq,.passos,.check,.faixa';
document.querySelectorAll('.sec .cab,.duas>div:first-child,.mapa,.bloco-in,.car').forEach(el => el.dataset.r = '');
document.querySelector('.duas>div:first-child')?.setAttribute('data-r', 'esq');
document.querySelectorAll('.mvv,.mapa').forEach(el => el.dataset.r = 'dir');
document.querySelectorAll(grupos).forEach(g => [...g.children].forEach((el, i) => {
  el.dataset.r = ''; el.style.setProperty('--i', i);
}));
document.querySelectorAll('.mvv').forEach(el => el.removeAttribute('data-r'));
document.querySelectorAll('.mvv>*').forEach((el, i) => { el.dataset.r = 'dir'; el.style.setProperty('--i', i); });
const io = new IntersectionObserver((es) => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
}), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
document.querySelectorAll('[data-r],.cab').forEach(el => io.observe(el));

// Barra de progresso, topo compacto e leve parallax da flor
let tick = false;
function aoRolar() {
  const y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
  barra.style.setProperty('--p', max > 0 ? y / max : 0);
  topo.classList.toggle('rolou', y > 20);
  if (flor && y < innerHeight) flor.style.setProperty('--par', (y * .08) + 'px');
  tick = false;
}
window.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(aoRolar); } }, { passive: true });
aoRolar();

// Brilho dourado que segue o mouse nos cartões
document.addEventListener('pointermove', e => {
  const c = e.target.closest && e.target.closest('.serv,.esp');
  if (!c) return;
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  c.style.setProperty('--my', (e.clientY - r.top) + 'px');
}, { passive: true });

// Sequência de fotos das áreas (assets/clinica.jpg, clinica2.jpg ... clinica5.jpg)
const car = document.querySelector('.car');
if (car) {
  let i = 0, t;
  const ctl = document.createElement('div'); ctl.className = 'car-ctl'; car.append(ctl);
  const lista = () => [...car.querySelectorAll('.slide')];
  const btn = (txt, rot, fn) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = txt; b.setAttribute('aria-label', rot); b.onclick = () => { fn(); reinicia(); }; return b; };
  function mostra(n) {
    const s = lista(); if (!s.length) return;
    i = (n + s.length) % s.length;
    s.forEach((x, k) => x.classList.toggle('on', k === i));
    ctl.innerHTML = ''; if (s.length < 2) return;
    ctl.append(btn('‹', 'Anterior', () => mostra(i - 1)));
    s.forEach((_, k) => { const d = btn('', 'Ir para a foto ' + (k + 1), () => mostra(k)); d.className = 'dot' + (k === i ? ' on' : ''); ctl.append(d); });
    ctl.append(btn('›', 'Próxima', () => mostra(i + 1)));
  }
  function reinicia() { clearInterval(t); t = setInterval(() => { if (!document.hidden) mostra(i + 1); }, 6500); }
  window.addEventListener('load', () => { mostra(0); reinicia(); });
  car.addEventListener('mouseenter', () => clearInterval(t));
  car.addEventListener('mouseleave', reinicia);
}

// Título do início e das especialidades: palavras entram uma a uma
document.querySelectorAll('.hero h1,.phero h1').forEach(h => {
  let n = 0;
  (function quebra(no) {
    [...no.childNodes].forEach(f => {
      if (f.nodeType === 3) {
        const frag = document.createDocumentFragment();
        f.textContent.split(/(\s+)/).forEach(p => {
          if (!p.trim()) { frag.append(p); return; }
          const w = document.createElement('span'); w.className = 'w'; w.textContent = p; w.style.setProperty('--d', n++); frag.append(w);
        });
        f.replaceWith(frag);
      } else if (f.nodeType === 1) quebra(f);
    });
  })(h);
});
