/* =========================================
   Menú off-canvas (Header/Nav)
   ========================================= */

(function () {
  const btnOpen  = document.getElementById('btnMenuOpen');
  const btnClose = document.getElementById('btnMenuClose');
  const panel    = document.getElementById('menu-mobile');
  const overlay  = document.getElementById('overlay');
  const BREAKPOINT = 800; // Debe coincidir con mediaqueries.css

  if (!btnOpen || !panel || !overlay) return;

  let prevActive = null;

  function lockScroll() { document.body.style.overflow = 'hidden'; }
  function unlockScroll() { document.body.style.overflow = ''; }

  function openMenu() {
    prevActive = document.activeElement;
    panel.hidden = false; panel.offsetHeight; // reflow
    panel.classList.add('menu-mobile--open');
    overlay.classList.add('overlay--active');
    btnOpen.setAttribute('aria-expanded', 'true');
    lockScroll();
    const firstFocusable = panel.querySelector('a, button');
    (firstFocusable || panel).focus();
  }

  function closeMenu() {
    panel.classList.remove('menu-mobile--open');
    overlay.classList.remove('overlay--active');
    btnOpen.setAttribute('aria-expanded', 'false');
    panel.addEventListener('transitionend', () => { panel.hidden = true; }, { once: true });
    unlockScroll();
    if (prevActive && typeof prevActive.focus === 'function') prevActive.focus();
  }

  btnOpen.addEventListener('click', openMenu);
  if (btnClose) btnClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  panel.addEventListener('click', (e) => { if (e.target.closest('a[href]')) closeMenu(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('menu-mobile--open')) {
      e.preventDefault(); closeMenu();
    }
  });

  // Reset al volver a desktop
  window.addEventListener('resize', () => {
    const w = window.innerWidth || document.documentElement.clientWidth;
    if (w > BREAKPOINT) {
      panel.classList.remove('menu-mobile--open');
      panel.hidden = true;
      overlay.classList.remove('overlay--active');
      btnOpen.setAttribute('aria-expanded', 'false');
      unlockScroll();
    }
  });

  if (!panel.hasAttribute('hidden')) panel.hidden = true;
})();



// PAGINA INICIO

/* ===== HERO CAROUSEL (autoplay 4s + puntos) ===== */
(function(){
  const root = document.querySelector('.hero');
  if(!root) return;

  const slides = Array.from(root.querySelectorAll('.hero__slide'));
  const dots   = Array.from(root.querySelectorAll('.dot'));
  const AUTOPLAY_MS = 4000;

  let idx = 0;
  let timer = null;

  function show(i){
    slides.forEach((s,k)=> s.classList.toggle('is-active', k===i));
    dots.forEach((d,k)=>{
      d.classList.toggle('is-active', k===i);
      d.setAttribute('aria-selected', k===i ? 'true' : 'false');
    });
    idx = i;
  }
  function next(){ show((idx+1) % slides.length); }

  function start(){ stop(); timer = setInterval(next, AUTOPLAY_MS); }
  function stop(){ if(timer){ clearInterval(timer); timer = null; } }

  dots.forEach((btn,i)=> btn.addEventListener('click', ()=>{ show(i); start(); }));

  // Pausa al entrar con ratón o al enfocar; reanuda al salir
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', start);

  start();
})();




// PAGINA ERROR 404
// 404 – volver atrás
document.addEventListener('click', (ev) => {
  const trigger = ev.target.closest('#btn-404-back');
  if (!trigger) return;

  ev.preventDefault();
  // Si hay historial, volvemos; si no, vamos a la home.
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = 'index.html';
  }
});






/* ========== ITEM — swap de imagen con fade y selección de talla ========== */
(function(){
  const item = document.querySelector('.item');
  if(!item) return; // no estamos en la página de item

  const mainImg = item.querySelector('#item-main-img');
  const thumbs  = item.querySelectorAll('.thumb');

  function setActiveThumb(btn){
    thumbs.forEach(t => t.classList.remove('is-active'));
    btn.classList.add('is-active');
  }

  function swapImage(btn){
    const nextSrc = btn.getAttribute('data-src');
    if(!nextSrc || !mainImg) return;
    mainImg.classList.add('is-loading');
    const tmp = new Image();
    tmp.onload = () => {
      mainImg.src = nextSrc;
      mainImg.alt = btn.querySelector('img')?.alt || 'Vista del producto';
      mainImg.classList.remove('is-loading');
    };
    tmp.src = nextSrc;
  }

  thumbs.forEach(btn=>{
    // hover y foco (ratón/teclado)
    btn.addEventListener('mouseenter', ()=>{ swapImage(btn); setActiveThumb(btn); });
    btn.addEventListener('focus',      ()=>{ swapImage(btn); setActiveThumb(btn); });
    // click explícito
    btn.addEventListener('click',      ()=>{ swapImage(btn); setActiveThumb(btn); });
  });

  // (Opcional) Evitar que el CTA envíe formularios por defecto
  const cta = item.querySelector('.btn-item-cta');
  if(cta){
    cta.addEventListener('click', ()=> {
      // Aquí, cuando conectes la cesta, harás la validación y abrirás el modal.
      // De momento no hacemos nada más para no interferir con otras páginas.
    });
  }
})();




// MODALES

// ===== MODAL MENSAJE ENVIADO =====
(() => {
  const overlay = document.getElementById('modal-enviado');
  if (!overlay) return;

  const card = overlay.querySelector('.modal-card');
  const btnClose = overlay.querySelector('.modal-close');

  
  const form =
    document.getElementById('form-contacto') ||
    document.getElementById('contacto-form') ||
    document.querySelector('form');

  let lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    overlay.classList.add('is-open');
    document.body.classList.add('modal-open');
    card.focus();
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  // Cerrar al hacer click fuera de la tarjeta
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Cerrar con el botón (X)
  btnClose?.addEventListener('click', closeModal);

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeModal();
    }
  });

  
  if (form) {
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      e.preventDefault();
      openModal();
    });
  }
})();



// ===== ZONA CLUBS – MODAL ACCESO TIENDA ONLINE =====
(function(){
  const openBtn   = document.getElementById('club-esparreguera');
  const modal     = document.getElementById('modal-club');
  const closeBtn  = document.getElementById('modal-club-close');
  const form      = document.getElementById('form-club');
  const inputPass = document.getElementById('club-password');

  if(!openBtn || !modal) return;

  const openModal = () => {
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    inputPass.value = '';
    setTimeout(() => inputPass.focus(), 10);
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  };

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  closeBtn.addEventListener('click', closeModal);

  // Cerrar clicando fuera de la tarjeta
  modal.addEventListener('click', (e) => {
    if(e.target === modal) closeModal();
  });

  // Cerrar con tecla Esc
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Enviar y redirigir si hay contraseña
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (inputPass.value.trim() === '') {
      inputPass.focus();
      inputPass.reportValidity && inputPass.reportValidity();
      return;
    }
    // Redirección a la tienda
    window.location.href = 'tiendaonline.html';
  });
})();







/* ===== MODAL CESTA ===== */

(function(){
  const overlay   = document.getElementById('cart-overlay');
  if(!overlay) return;

  const scrim     = overlay.querySelector('.cart__scrim');
  const panel     = overlay.querySelector('.cart__panel');
  const btnClose  = overlay.querySelectorAll('[data-cart-close], .cart__close');

  // Cuerpos: vacío / lleno
  const bodyEmpty = overlay.querySelector('.cart__body--empty');
  const bodyFull  = overlay.querySelector('.cart__body--full');

  // Elementos de producto (estado lleno)
  const elThumb   = overlay.querySelector('#cartProdThumb');
  const elTitle   = overlay.querySelector('#cartProdTitle');
  const elSize    = overlay.querySelector('#cartProdSize');
  const elName    = overlay.querySelector('#cartName');
  const elNumber  = overlay.querySelector('#cartNumber');
  const elQtyOut  = overlay.querySelector('#cartQty');
  const btnMinus  = overlay.querySelector('[data-qty-minus]');
  const btnPlus   = overlay.querySelector('[data-qty-plus]');
  const elTotal   = overlay.querySelector('#cartTotal');
  const btnCheckout = overlay.querySelector('#btnCheckout');

  // Abridores (icono cesta en header, etc.)
  const openers   = document.querySelectorAll('[data-cart-open]');

  // Precio base
  const BASE_PRICE = 32.90;
  // Formatea a "32,90 €"
  const fmt = (n)=> n.toLocaleString('es-ES', {style:'currency', currency:'EUR'});

  // Estado interno
  let qty = 1;

  function setBodies({empty=false}={}){
    if(empty){
      bodyEmpty.removeAttribute('hidden');
      bodyFull.setAttribute('hidden','');
    }else{
      bodyFull.removeAttribute('hidden');
      bodyEmpty.setAttribute('hidden','');
    }
  }

  function openCart(){
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cart-open');
    // Accesibilidad: foco dentro
    requestAnimationFrame(()=> panel.focus());
  }
  function closeCart(){
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cart-open');
  }

  // Abrir desde disparadores (mostrando vacío por defecto)
  openers.forEach(el=>{
    el.addEventListener('click', (e)=>{
      e.preventDefault();
      setBodies({empty:true});
      openCart();
    });
  });

  // Cerrar: botón, scrim, ESC
  btnClose.forEach(b=> b.addEventListener('click', closeCart));
  scrim.addEventListener('click', closeCart);
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && overlay.classList.contains('is-open')) closeCart();
  });

  // Actualiza total
  function updateTotal(){
    const total = BASE_PRICE * qty;
    elTotal.textContent = fmt(total);
    elQtyOut.textContent = qty;
  }

  // Cantidad (1..5)
  if(btnMinus && btnPlus){
    btnMinus.addEventListener('click', ()=>{
      qty = Math.max(1, qty-1);
      updateTotal();
    });
    btnPlus.addEventListener('click', ()=>{
      qty = Math.min(5, qty+1);
      updateTotal();
    });
  }

  // ===== Integración con la página ITEM =====
  // Al pulsar el CTA de la ficha, mostrar estado LLENO con los datos.
  const addToCartBtn = document.querySelector('.btn-item-cta');
  if(addToCartBtn){
    addToCartBtn.addEventListener('click', (e)=>{
      e.preventDefault();

      // Obtener datos de la ficha
      const title  = (document.querySelector('.item__title')?.textContent || '').trim();
      const thumb  = document.getElementById('item-main-img')?.getAttribute('src') || '';
      const name   = (document.getElementById('item-name')?.value || '').trim();
      const dorsal = (document.getElementById('item-number')?.value || '').trim();

      // Talla (radio seleccionado)
      let size = '';
      const checked = document.querySelector('input[name="size"]:checked');
      if(checked) size = checked.value;

      // Validación mínima (si quieres forzar que no abra si falta info)
      // if(!name || !dorsal || !size){ alert('Completa nombre, dorsal y talla'); return; }

      // Inyectar datos en el modal
      if(elTitle)   elTitle.textContent = title || 'Producto';
      if(elThumb && thumb) elThumb.src = thumb;
      if(elSize)    elSize.textContent = size || '—';
      if(elName)    elName.textContent = name || '—';
      if(elNumber)  elNumber.textContent = dorsal || '—';

      // Reiniciar cantidad/total
      qty = 1;
      updateTotal();

      // Mostrar estado lleno y abrir
      setBodies({empty:false});
      openCart();
    });
  }

  // Acción "Finalizar compra"
  // el modal de "Pedido confirmado" lo montarás después)
  if(btnCheckout){
    btnCheckout.addEventListener('click', ()=>{
      // Lanza evento para que otro módulo abra el modal de confirmación
      document.dispatchEvent(new CustomEvent('cart:checkout'));
    });
  }
})();



/* ===== CESTA → Abrir modal "Pedido confirmado" ===== */
(function () {
  const cart = document.getElementById('cart-overlay');
  const pedido = document.getElementById('modal-pedido');
  if (!cart || !pedido) return;

  const panel = cart.querySelector('.cart__panel');

  function closeCart() {
    cart.classList.remove('is-open');
    cart.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cart-open');
  }

  function openPedido() {
    pedido.classList.add('is-open');
    pedido.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    pedido.querySelector('.modal-card')?.focus();
  }

  // Delegación: captura clicks en #btnCheckout dentro del panel de la cesta
  panel.addEventListener('click', (e) => {
    const btn = e.target.closest('#btnCheckout');
    if (!btn) return;
    e.preventDefault();
    closeCart();
    setTimeout(openPedido, 120); // deja cerrar la animación del drawer
  });
})();




/* ===== Modal "Pedido confirmado" ===== */
(function () {
  const pedidoModal = document.getElementById('modal-pedido');
  if (!pedidoModal) return;

  const pedidoCard  = pedidoModal.querySelector('.modal-card');
  const btnClose    = pedidoModal.querySelector('.modal-close');

  const cartOverlay = document.getElementById('cart-overlay');
  const btnCheckout = document.getElementById('btnCheckout'); // botón "Finalizar compra" de la cesta

  function openPedido() {
    pedidoModal.classList.add('is-open');
    pedidoModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    // Foco accesible
    if (pedidoCard && typeof pedidoCard.focus === 'function') {
      pedidoCard.focus();
    }
  }

  function closePedidoAndGoHome() {
    pedidoModal.classList.remove('is-open');
    pedidoModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    // Redirigir al home
    window.location.href = 'index.html';
  }

  function closeCartIfOpen() {
    if (!cartOverlay) return;
    cartOverlay.classList.remove('is-open');
    cartOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cart-open');
  }

  // Abrir "Pedido confirmado" desde el botón "Finalizar compra" de la cesta
  if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
      closeCartIfOpen();
      // Pequeño delay para que cierre la animación de la cesta
      setTimeout(openPedido, 150);
    });
  }

  // Cerrar con botón
  if (btnClose) btnClose.addEventListener('click', closePedidoAndGoHome);

  // Cerrar haciendo clic fuera (scrim)
  pedidoModal.addEventListener('click', (e) => {
    if (e.target === pedidoModal) closePedidoAndGoHome();
  });

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pedidoModal.classList.contains('is-open')) {
      closePedidoAndGoHome();
    }
  });
})();



/* ===== MODALES USUARIO (login / register separados) ===== */
(function(){
  const body = document.body;

  const loginOverlay = document.getElementById('user-login');
  const registerOverlay = document.getElementById('user-register');

  if(!loginOverlay || !registerOverlay) return;

  const openers = document.querySelectorAll('[data-user-open]');
  const loginClose = loginOverlay.querySelector('.user-close');
  const registerClose = registerOverlay.querySelector('.user-close');

  const loginTabs = loginOverlay.querySelectorAll('[data-user-to]');
  const registerTabs = registerOverlay.querySelectorAll('[data-user-to]');

  const loginForm = document.getElementById('user-login-form');
  const registerForm = document.getElementById('user-register-form');

  function lockScroll(on){
    body.classList.toggle('modal-open', on);
  }

  function openLogin(e){
    if(e) e.preventDefault();
    registerOverlay.classList.remove('is-open');
    loginOverlay.classList.add('is-open');
    lockScroll(true);
    setTimeout(()=>loginOverlay.querySelector('.user-card').focus(), 0);
    setTabs(loginOverlay, 'login');
  }
  function openRegister(e){
    if(e) e.preventDefault();
    loginOverlay.classList.remove('is-open');
    registerOverlay.classList.add('is-open');
    lockScroll(true);
    setTimeout(()=>registerOverlay.querySelector('.user-card').focus(), 0);
    setTabs(registerOverlay, 'register');
  }
  function closeAll(){
    loginOverlay.classList.remove('is-open');
    registerOverlay.classList.remove('is-open');
    lockScroll(false);
  }

  function setTabs(root, which){
    const tabs = root.querySelectorAll('.user-tab');
    tabs.forEach(t => t.classList.toggle('is-active', t.dataset.userTo === which));
  }

  // Abrir desde el icono
  openers.forEach(el => el.addEventListener('click', openLogin));

  // Cerrar con botón X
  loginClose.addEventListener('click', closeAll);
  registerClose.addEventListener('click', closeAll);

  // Cerrar haciendo click fuera de la tarjeta
  [loginOverlay, registerOverlay].forEach(ov =>
    ov.addEventListener('click', (e)=>{
      if(e.target === ov) closeAll();
    })
  );

  // Tabs: cambiar de modal
  loginTabs.forEach(btn => {
    btn.addEventListener('click', (e)=>{
      if(btn.dataset.userTo === 'register') openRegister(e);
    });
  });
  registerTabs.forEach(btn => {
    btn.addEventListener('click', (e)=>{
      if(btn.dataset.userTo === 'login') openLogin(e);
    });
  });

  // Enviar formularios => cerrar modal
  if(loginForm){
    loginForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      closeAll();
    });
  }
  if(registerForm){
    registerForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      closeAll();
    });
  }

  // Esc para cerrar
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && (loginOverlay.classList.contains('is-open') || registerOverlay.classList.contains('is-open'))){
      closeAll();
    }
  });
})();
