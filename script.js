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
  else window.scrollTo({ top: 0 });
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