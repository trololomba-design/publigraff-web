/* ============================================================
   PubliGraff — main.js  ·  Vanilla JS, sin dependencias
   Los datos (productos, precios, contacto) viven en js/datos.js

   Cada página HTML tiene <body data-pagina="…"> y dos marcadores:
     <div data-header></div>  → aquí se dibuja la barra superior y el menú
     <div data-footer></div>  → aquí se dibuja el pie de página
   Así el menú y el pie se editan en un solo lugar (este archivo).
   ============================================================ */
(function () {
  'use strict';

  /* ── UTILIDADES ─────────────────────────────────────────── */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pagina = document.body.getAttribute('data-pagina') || '';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function miles(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function pesos(n) { return '$' + miles(n); }
  function normalizar(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function urlWhatsapp(texto) {
    return 'https://wa.me/' + CONFIG.whatsapp + (texto ? '?text=' + encodeURIComponent(texto) : '');
  }
  function urlCorreo(asunto, cuerpo) {
    return 'mailto:' + CONFIG.correo +
      '?subject=' + encodeURIComponent(asunto || 'Cotización') +
      (cuerpo ? '&body=' + encodeURIComponent(cuerpo) : '');
  }
  function abrir(url) {
    if (url.indexOf('mailto:') === 0) { window.location.href = url; }
    else { window.open(url, '_blank', 'noopener'); }
  }

  function producto(id) {
    for (var i = 0; i < PRODUCTOS.length; i++) if (PRODUCTOS[i].id === id) return PRODUCTOS[i];
    return null;
  }
  function categoria(id) {
    for (var i = 0; i < CATEGORIAS.length; i++) if (CATEGORIAS[i].id === id) return CATEGORIAS[i];
    return null;
  }
  function urlProducto(p) { return 'producto.html?id=' + encodeURIComponent(p.id); }
  function urlCategoria(id) { return 'productos.html?cat=' + encodeURIComponent(id); }
  function productosDe(catId) {
    return PRODUCTOS.filter(function (p) { return p.categorias.indexOf(catId) > -1; });
  }

  /* Precio de un tramo: devuelve { total, unitario } */
  function precioTramo(t) {
    if (t.total != null) return { total: t.total, unitario: t.total / t.cant };
    return { total: t.unitario * t.cant, unitario: t.unitario };
  }
  /* Tramo más barato de un producto (para "Desde …" y para ordenar) */
  function tramoMinimo(p) {
    var min = null;
    p.modelos.forEach(function (m) {
      (m.precios || []).forEach(function (t) {
        var pr = precioTramo(t);
        if (min === null || pr.total < min.total) min = { total: pr.total, cant: t.cant, unitario: pr.unitario, porUnidad: t.unitario != null };
      });
    });
    return min;
  }
  function textoDesde(p) {
    if (!CONFIG.mostrarPrecios) return '';
    var min = tramoMinimo(p);
    if (!min) return '';
    return min.porUnidad
      ? 'Desde ' + pesos(min.unitario) + ' c/u'
      : 'Desde ' + pesos(min.total) + ' · ' + miles(min.cant) + ' u.';
  }

  var iconoWapp = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8 8 0 0 1-2.4-1.5 9 9 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.5-.5.3-.5a.6.6 0 0 0 0-.5l-1-2.2c-.2-.6-.4-.5-.6-.5h-.6a1 1 0 0 0-.8.4A3.3 3.3 0 0 0 5.7 9c0 1.5 1 2.9 1.2 3.1s2.1 3.3 5.2 4.6c2.6 1 3.2.8 3.8.8s1.8-.7 2-1.5.3-1.4.2-1.5-.3-.2-.6-.4zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2z"/></svg>';


  /* ══════════════════════════════════════════════════════════
     MENÚ Y PIE DE PÁGINA (compartidos por todas las páginas)
     ══════════════════════════════════════════════════════════ */
  var MENU = [
    { id: 'inicio',    texto: 'Inicio',               url: 'index.html' },
    { id: 'productos', texto: 'Productos',            url: 'productos.html' },
    { id: 'nosotros',  texto: 'Nosotros',             url: 'nosotros.html' },
    { id: 'preguntas', texto: 'Preguntas frecuentes', url: 'preguntas.html' },
    { id: 'contacto',  texto: 'Contacto',             url: 'contacto.html' }
  ];
  function esActivo(m) { return m.id === pagina || (m.id === 'productos' && pagina === 'producto'); }
  function enlacesMenu() {
    return MENU.map(function (m) {
      return '<a href="' + m.url + '"' + (esActivo(m) ? ' class="is-activo" aria-current="page"' : '') + '>' + m.texto + '</a>';
    }).join('');
  }

  var header = $('[data-header]');
  if (header) {
    header.outerHTML =
      '<div class="topbar"><div class="contenedor topbar__inner">' +
        '<span>Diseño gratis · Despacho a todo Chile</span>' +
        '<div class="topbar__datos">' +
          '<a data-wapp href="#">WhatsApp <span data-dato="whatsappVisible"></span></a>' +
          '<a data-mail href="#"><span data-dato="correo"></span></a>' +
        '</div>' +
      '</div></div>' +
      '<header class="nav" data-nav>' +
        '<div class="contenedor nav__inner">' +
          '<a href="index.html" class="nav__logo" aria-label="PubliGraff — inicio">' +
            '<img src="imagenes/logos/logo-publicgraff.png" alt="PubliGraff, servicios gráficos y publicitarios" width="560" height="318">' +
          '</a>' +
          '<nav class="nav__links" aria-label="Principal">' + enlacesMenu() + '</nav>' +
          '<button class="btn btn--marca nav__lista" type="button" data-abrir-lista>' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5h11M9 12h11M9 19h11M4 5h.01M4 12h.01M4 19h.01"/></svg>' +
            '<span class="nav__lista-txt">Mi cotización</span> <span class="contador-lista" data-contador>0</span>' +
          '</button>' +
          '<button class="nav__hamburger" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="menu-movil" data-hamburger>' +
            '<span></span><span></span><span></span>' +
          '</button>' +
        '</div>' +
        '<nav class="menu-movil" id="menu-movil" aria-label="Menú móvil" hidden>' + enlacesMenu() + '</nav>' +
      '</header>';
  }

  var footer = $('[data-footer]');
  if (footer) {
    footer.outerHTML =
      '<footer class="footer">' +
        '<div class="contenedor footer__inner">' +
          '<div class="footer__col">' +
            '<img class="footer__logo" src="imagenes/logos/logo-publicgraff.png" alt="PubliGraff" width="560" height="318">' +
            '<p>Servicios gráficos y publicitarios a medida desde 2010. Imprimimos en nuestro propio taller en San Joaquín.</p>' +
          '</div>' +
          '<nav class="footer__col" aria-label="Categorías"><h4>Productos</h4>' +
            CATEGORIAS.map(function (c) { return '<a href="' + urlCategoria(c.id) + '">' + esc(c.nombre) + '</a>'; }).join('') +
          '</nav>' +
          '<nav class="footer__col" aria-label="Sitio"><h4>PubliGraff</h4>' +
            MENU.map(function (m) { return '<a href="' + m.url + '">' + m.texto + '</a>'; }).join('') +
          '</nav>' +
          '<div class="footer__col"><h4>Contacto</h4>' +
            '<a data-wapp href="#">WhatsApp <span data-dato="whatsappVisible"></span></a>' +
            '<a data-mail href="#"><span data-dato="correo"></span></a>' +
            '<span data-dato="direccion"></span>' +
            '<span data-dato="horario"></span>' +
          '</div>' +
        '</div>' +
        '<p class="footer__legal">© ' + new Date().getFullYear() + ' PubliGraff · Servicios Gráficos y Publicitarios</p>' +
      '</footer>';
  }


  /* ── MENÚ MÓVIL Y SOMBRA DEL MENÚ AL HACER SCROLL ───────── */
  var hamburger = $('[data-hamburger]');
  var menuMovil = $('#menu-movil');
  function menu(abrirlo) {
    if (!hamburger || !menuMovil) return;
    menuMovil.hidden = !abrirlo;
    hamburger.classList.toggle('is-open', abrirlo);
    hamburger.setAttribute('aria-expanded', String(abrirlo));
  }
  if (hamburger) hamburger.addEventListener('click', function () { menu(menuMovil.hidden); });

  var nav = $('[data-nav]');
  function sombraNav() { if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 10); }
  sombraNav();
  window.addEventListener('scroll', sombraNav, { passive: true });


  /* ══════════════════════════════════════════════════════════
     LISTA DE COTIZACIÓN
     Se guarda en el navegador del visitante (localStorage) para
     que pueda recorrer varias páginas y enviar todo junto.
     ══════════════════════════════════════════════════════════ */
  var CLAVE = 'publigraff-cotizacion';
  var CLAVE_DATOS = 'publigraff-datos-cliente';

  function leer(clave, porDefecto) {
    try { var v = JSON.parse(localStorage.getItem(clave)); return v == null ? porDefecto : v; }
    catch (e) { return porDefecto; }
  }
  function guardar(clave, valor) {
    try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (e) { /* modo privado */ }
  }

  var lista = leer(CLAVE, []);
  if (!Array.isArray(lista)) lista = [];

  function agregarALista(item) {
    var existente = null;
    lista.forEach(function (it) { if (it.pid === item.pid && it.modelo === item.modelo) existente = it; });
    if (existente) existente.cantidad = item.cantidad;
    else lista.push(item);
    guardar(CLAVE, lista);
    pintarLista();
    // Pequeño "salto" del contador para que se note que se agregó
    $$('[data-contador]').forEach(function (el) {
      el.classList.remove('is-salto'); void el.offsetWidth; el.classList.add('is-salto');
    });
  }
  function quitarDeLista(i) {
    lista.splice(i, 1);
    guardar(CLAVE, lista);
    pintarLista();
  }

  function modeloDe(p, nombre) {
    return p ? p.modelos.filter(function (x) { return x.nombre === nombre; })[0] : null;
  }
  /* Precio referencial de un ítem si la cantidad calza con un tramo */
  function precioItem(it) {
    if (!CONFIG.mostrarPrecios) return null;
    var m = modeloDe(producto(it.pid), it.modelo);
    if (!m || !m.precios) return null;
    var n = parseInt(String(it.cantidad).replace(/\D/g, ''), 10);
    for (var i = 0; i < m.precios.length; i++) if (m.precios[i].cant === n) return precioTramo(m.precios[i]).total;
    return null;
  }

  function lineaItem(it, i) {
    var p = producto(it.pid);
    var m = modeloDe(p, it.modelo);
    var detalle = it.modelo + (m && /\d/.test(m.medida || '') && m.medida !== it.modelo ? ' (' + m.medida + ')' : '');
    var cant = /^\d+$/.test(String(it.cantidad)) ? miles(it.cantidad) + ' unidades' : (it.cantidad || 'cantidad por definir');
    var pr = precioItem(it);
    return (i + 1) + '. ' + (p ? p.nombre : it.pid) + ' — ' + detalle + ' — ' + cant + (pr ? ' (ref. ' + pesos(pr) + ' + IVA)' : '');
  }

  function mensajeLista(datos) {
    var l = ['Hola PubliGraff, quiero cotizar lo siguiente:', ''];
    lista.forEach(function (it, i) { l.push(lineaItem(it, i)); });
    l.push('');
    if (datos.nombre) l.push('Nombre: ' + datos.nombre);
    if (datos.comuna) l.push('Comuna / ciudad: ' + datos.comuna);
    if (datos.comentario) l.push('Comentarios: ' + datos.comentario);
    return l.join('\n');
  }

  /* Botones flotantes, aviso y panel lateral: se crean aquí para no repetir HTML */
  var flotantes = document.createElement('div');
  flotantes.className = 'flotantes';
  flotantes.innerHTML =
    '<button type="button" class="flotantes__lista" data-abrir-lista hidden>' +
      'Mi cotización <span class="contador-lista" data-contador>0</span>' +
    '</button>' +
    '<a class="flotantes__wapp" data-wapp href="#" aria-label="Escríbenos por WhatsApp">' + iconoWapp +
      '<span class="flotantes__tip">¿Dudas? Escríbenos</span></a>';
  document.body.appendChild(flotantes);

  var aviso = document.createElement('div');
  aviso.className = 'aviso';
  aviso.setAttribute('role', 'status');
  aviso.hidden = true;
  document.body.appendChild(aviso);
  var avisoTimer = null;
  function mostrarAviso(html) {
    aviso.innerHTML = html;
    aviso.hidden = false;
    aviso.classList.remove('is-visible'); void aviso.offsetWidth; aviso.classList.add('is-visible');
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(function () { aviso.hidden = true; }, 5000);
  }

  var fondo = document.createElement('div');
  fondo.className = 'panel-fondo';
  fondo.hidden = true;
  var panel = document.createElement('aside');
  panel.className = 'panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-labelledby', 'panel-titulo');
  panel.hidden = true;
  panel.innerHTML =
    '<header class="panel__head">' +
      '<h2 id="panel-titulo">Mi cotización</h2>' +
      '<button type="button" class="panel__cerrar" aria-label="Cerrar" data-cerrar-panel>&times;</button>' +
    '</header>' +
    '<div class="panel__cuerpo">' +
      '<div class="panel__vacio" data-panel-vacio>' +
        '<p><strong>Tu lista está vacía.</strong></p>' +
        '<p>Entra a un producto, elige el modelo y la cantidad, y presiona <em>Agregar a mi cotización</em>. También puedes escribirnos directamente.</p>' +
        '<a class="btn btn--marca" href="productos.html">Ver productos</a>' +
      '</div>' +
      '<ul class="panel__items" data-panel-items></ul>' +
      '<form class="panel__form" data-panel-form novalidate>' +
        '<div class="campo"><label for="p-nombre">Tu nombre</label><input id="p-nombre" name="nombre" type="text" autocomplete="name" required></div>' +
        '<div class="campo"><label for="p-comuna">Comuna / ciudad de entrega</label><input id="p-comuna" name="comuna" type="text" autocomplete="address-level2"></div>' +
        '<div class="campo"><label for="p-comentario">Comentarios <span class="opcional">(opcional)</span></label><textarea id="p-comentario" name="comentario" rows="2" placeholder="Colores, fecha, si ya tienes logo…"></textarea></div>' +
        '<p class="formulario__error" data-panel-error hidden>Escribe tu nombre para enviar la cotización.</p>' +
        '<button type="submit" class="btn btn--wapp btn--bloque" data-via="whatsapp">' + iconoWapp + ' Enviar por WhatsApp</button>' +
        '<button type="submit" class="btn btn--outline btn--bloque" data-via="correo">Enviar por correo</button>' +
        '<p class="formulario__nota">Se abrirá WhatsApp o tu correo con la lista lista para enviar. Los precios son referenciales.</p>' +
      '</form>' +
    '</div>';
  document.body.appendChild(fondo);
  document.body.appendChild(panel);


  /* ── DATOS DE CONTACTO EN TODA LA PÁGINA ────────────────── */
  $$('[data-dato]').forEach(function (el) {
    var v = CONFIG[el.getAttribute('data-dato')];
    if (v != null) el.textContent = v;
  });
  $$('[data-wapp]').forEach(function (a) {
    a.href = urlWhatsapp(a.getAttribute('data-texto') || 'Hola, me gustaría cotizar un trabajo de impresión.');
    a.target = '_blank'; a.rel = 'noopener';
  });
  $$('[data-mail]').forEach(function (a) { a.href = urlCorreo('Cotización de impresión'); });


  var ultimoFoco = null;
  function abrirPanel() {
    ultimoFoco = document.activeElement;
    menu(false);
    aviso.hidden = true;
    pintarLista();
    fondo.hidden = false; panel.hidden = false;
    document.body.classList.add('sin-scroll');
    requestAnimationFrame(function () { panel.classList.add('is-open'); fondo.classList.add('is-open'); });
    $('.panel__cerrar', panel).focus();
  }
  function cerrarPanel() {
    panel.classList.remove('is-open'); fondo.classList.remove('is-open');
    document.body.classList.remove('sin-scroll');
    setTimeout(function () { panel.hidden = true; fondo.hidden = true; }, 280);
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-abrir-lista]')) { e.preventDefault(); abrirPanel(); }
    else if (e.target.closest('[data-cerrar-panel]')) { cerrarPanel(); }
  });
  fondo.addEventListener('click', cerrarPanel);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (!panel.hidden) cerrarPanel(); menu(false); }
  });

  function pintarLista() {
    var n = lista.length;
    $$('[data-contador]').forEach(function (el) { el.textContent = n; });
    $$('.flotantes__lista').forEach(function (b) { b.hidden = n === 0; });

    $('[data-panel-vacio]', panel).hidden = n > 0;
    $('[data-panel-form]', panel).hidden = n === 0;
    $('[data-panel-items]', panel).innerHTML = lista.map(function (it, i) {
      var p = producto(it.pid);
      var img = p && p.imagenes[0] ? '<img src="' + esc(p.imagenes[0]) + '" alt="">' : '';
      var pr = precioItem(it);
      return '<li class="item">' + img +
        '<div class="item__txt">' +
          '<a class="item__nombre" href="' + (p ? urlProducto(p) : '#') + '">' + esc(p ? p.nombre : it.pid) + '</a>' +
          '<span class="item__modelo">' + esc(it.modelo) + '</span>' +
          '<label class="item__cant">Cantidad <input type="text" inputmode="numeric" value="' + esc(it.cantidad) + '" data-cant="' + i + '"></label>' +
          (pr ? '<span class="item__precio">Ref. ' + pesos(pr) + ' + IVA</span>' : '') +
        '</div>' +
        '<button type="button" class="item__quitar" data-quitar="' + i + '" aria-label="Quitar ' + esc(p ? p.nombre : '') + '">&times;</button>' +
      '</li>';
    }).join('');
  }

  panel.addEventListener('click', function (e) {
    var q = e.target.closest('[data-quitar]');
    if (q) quitarDeLista(parseInt(q.getAttribute('data-quitar'), 10));
  });
  panel.addEventListener('change', function (e) {
    var c = e.target.getAttribute('data-cant');
    if (c != null && lista[c]) {
      lista[c].cantidad = e.target.value.trim();
      guardar(CLAVE, lista);
      pintarLista();
    }
  });

  /* Recordar nombre y comuna entre visitas */
  var formPanel = $('[data-panel-form]', panel);
  var datosCliente = leer(CLAVE_DATOS, {});
  ['nombre', 'comuna'].forEach(function (k) { if (datosCliente[k]) formPanel.elements[k].value = datosCliente[k]; });

  var viaPanel = 'whatsapp';
  $$('button[type="submit"]', formPanel).forEach(function (b) {
    b.addEventListener('click', function () { viaPanel = b.getAttribute('data-via'); });
  });
  formPanel.addEventListener('submit', function (e) {
    e.preventDefault();
    var datos = {
      nombre: formPanel.elements.nombre.value.trim(),
      comuna: formPanel.elements.comuna.value.trim(),
      comentario: formPanel.elements.comentario.value.trim()
    };
    var err = $('[data-panel-error]', panel);
    if (!datos.nombre) { err.hidden = false; formPanel.elements.nombre.focus(); return; }
    err.hidden = true;
    guardar(CLAVE_DATOS, { nombre: datos.nombre, comuna: datos.comuna });
    var texto = mensajeLista(datos);
    abrir(viaPanel === 'correo' ? urlCorreo('Cotización — ' + datos.nombre, texto) : urlWhatsapp(texto));
  });

  pintarLista();


  /* ══════════════════════════════════════════════════════════
     TARJETAS (se usan en varias páginas)
     ══════════════════════════════════════════════════════════ */
  function tarjetaProducto(p) {
    var cat = categoria(p.categorias[0]);
    var desde = textoDesde(p);
    var nModelos = p.modelos.length;
    return '<a class="producto reveal" href="' + urlProducto(p) + '">' +
      '<div class="producto__img">' +
        '<img src="' + esc(p.imagenes[0]) + '" alt="' + esc(p.nombre) + '" loading="lazy">' +
        (nModelos > 1 ? '<span class="producto__chip">' + nModelos + ' modelos</span>' : '') +
      '</div>' +
      '<div class="producto__cuerpo">' +
        '<p class="producto__cat">' + esc(cat ? cat.nombre : '') + '</p>' +
        '<h3 class="producto__nombre">' + esc(p.nombre) + '</h3>' +
        '<p class="producto__desc">' + esc(p.resumen) + '</p>' +
        '<div class="producto__pie">' +
          '<span class="producto__precio">' + (desde || 'Cotiza a medida') + '</span>' +
          '<span class="producto__ver" aria-hidden="true">→</span>' +
        '</div>' +
      '</div>' +
    '</a>';
  }

  function tarjetaCategoria(c) {
    return '<a class="categoria reveal' + (c.id === 'ecologico' ? ' categoria--eco' : '') + '" href="' + urlCategoria(c.id) + '">' +
      '<span class="categoria__img"><img src="' + esc(c.img) + '" alt="" loading="lazy"></span>' +
      '<span class="categoria__txt"><strong>' + esc(c.nombre) + '</strong><span>' + productosDe(c.id).length + ' productos</span></span>' +
    '</a>';
  }

  var contCats = $('[data-categorias]');
  if (contCats) contCats.innerHTML = CATEGORIAS.map(tarjetaCategoria).join('');

  var contDestacados = $('[data-destacados]');
  if (contDestacados) {
    contDestacados.innerHTML = (window.DESTACADOS || []).map(producto).filter(Boolean).map(tarjetaProducto).join('');
  }


  /* ══════════════════════════════════════════════════════════
     CATÁLOGO  (productos.html?cat=…&q=…&orden=…)
     ══════════════════════════════════════════════════════════ */
  var grid = $('[data-grid]');
  if (grid) {
    var params = new URLSearchParams(window.location.search);
    var estado = {
      cat: params.get('cat') || 'todos',
      q: params.get('q') || '',
      orden: params.get('orden') || 'relevancia'
    };
    if (estado.cat !== 'todos' && !categoria(estado.cat)) estado.cat = 'todos';

    var inputBuscar = $('[data-buscar-catalogo]');
    var selOrden = $('[data-orden]');
    inputBuscar.value = estado.q;
    selOrden.value = estado.orden;

    // Lista de categorías (costado en escritorio, botones deslizables en celular)
    var contLado = $('[data-categorias-lado]');
    function itemLado(id, nombre, n) {
      return '<button type="button" class="lado__item" data-filtro="' + id + '">' +
        '<span>' + esc(nombre) + '</span><span class="lado__n">' + n + '</span></button>';
    }
    contLado.innerHTML = itemLado('todos', 'Todos los productos', PRODUCTOS.length) +
      CATEGORIAS.map(function (c) { return itemLado(c.id, c.nombre, productosDe(c.id).length); }).join('');

    function coincide(p, q) {
      if (!q) return true;
      var texto = normalizar([p.nombre, p.resumen, p.descripcion, p.modelos.map(function (m) { return m.nombre + ' ' + (m.uso || ''); }).join(' ')].join(' '));
      return normalizar(q).split(/\s+/).every(function (palabra) {
        // "saquitos" también encuentra "saquito", "bolsas" encuentra "bolsa"
        return texto.indexOf(palabra) > -1 || texto.indexOf(palabra.replace(/e?s$/, '')) > -1;
      });
    }

    function pintarCatalogo() {
      var cat = categoria(estado.cat);
      $('[data-cat-titulo]').textContent = cat ? cat.nombre : 'Todos los productos';
      $('[data-cat-desc]').textContent = cat ? cat.desc : 'Bolsas, envases, publicidad, artículos promocionales y ropa con tu logo.';
      $('[data-miga-cat]').textContent = cat ? cat.nombre : 'Todos';
      document.title = (cat ? cat.nombre : 'Productos') + ' — PubliGraff';

      $$('[data-filtro]', contLado).forEach(function (b) {
        var activo = b.getAttribute('data-filtro') === estado.cat;
        b.classList.toggle('is-activo', activo);
        b.setAttribute('aria-pressed', String(activo));
      });

      var visibles = PRODUCTOS.filter(function (p) {
        return (estado.cat === 'todos' || p.categorias.indexOf(estado.cat) > -1) && coincide(p, estado.q);
      });
      if (estado.orden === 'precio') {
        visibles = visibles.slice().sort(function (a, b) {
          var ma = tramoMinimo(a), mb = tramoMinimo(b);
          if (!ma && !mb) return 0;
          if (!ma) return 1;
          if (!mb) return -1;
          return ma.total - mb.total;
        });
      } else if (estado.orden === 'nombre') {
        visibles = visibles.slice().sort(function (a, b) { return a.nombre.localeCompare(b.nombre, 'es'); });
      }

      grid.innerHTML = visibles.map(tarjetaProducto).join('') ||
        '<div class="sin-resultados"><p><strong>No encontramos productos para "' + esc(estado.q) + '".</strong></p>' +
        '<p>Igual podemos imprimirlo: escríbenos y te cotizamos.</p>' +
        '<a class="btn btn--wapp" target="_blank" rel="noopener" href="' + urlWhatsapp('Hola, quiero cotizar: ' + estado.q) + '">' + iconoWapp + ' Consultar por WhatsApp</a></div>';
      animarNuevos(grid);

      var txt = visibles.length + ' producto' + (visibles.length === 1 ? '' : 's');
      if (estado.q) txt += ' para <strong>"' + esc(estado.q) + '"</strong>';
      if (estado.q || estado.cat !== 'todos') txt += ' · <button type="button" class="enlace" data-limpiar>Ver todos</button>';
      $('[data-resultado]').innerHTML = txt;

      var u = new URL(window.location.href);
      ['cat', 'q', 'orden'].forEach(function (k) { u.searchParams.delete(k); });
      if (estado.cat !== 'todos') u.searchParams.set('cat', estado.cat);
      if (estado.q) u.searchParams.set('q', estado.q);
      if (estado.orden !== 'relevancia') u.searchParams.set('orden', estado.orden);
      history.replaceState(null, '', u.pathname + u.search);
    }

    contLado.addEventListener('click', function (e) {
      var b = e.target.closest('[data-filtro]'); if (!b) return;
      estado.cat = b.getAttribute('data-filtro');
      pintarCatalogo();
    });
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-limpiar]')) {
        estado.cat = 'todos'; estado.q = ''; inputBuscar.value = '';
        pintarCatalogo();
      }
    });
    $('[data-form-catalogo]').addEventListener('submit', function (e) {
      e.preventDefault();
      estado.q = inputBuscar.value.trim();
      pintarCatalogo();
    });
    var tBuscar = null;
    inputBuscar.addEventListener('input', function () {
      clearTimeout(tBuscar);
      tBuscar = setTimeout(function () { estado.q = inputBuscar.value.trim(); pintarCatalogo(); }, 250);
    });
    selOrden.addEventListener('change', function () { estado.orden = selOrden.value; pintarCatalogo(); });

    pintarCatalogo();
  }


  /* ══════════════════════════════════════════════════════════
     FICHA DE PRODUCTO  (producto.html?id=…)
     ══════════════════════════════════════════════════════════ */
  if (pagina === 'producto') {
    var id = new URLSearchParams(window.location.search).get('id');
    var p = producto(id);

    if (!p) {
      $('[data-no-encontrado]').hidden = false;
    } else {
      var cat = categoria(p.categorias[0]);
      document.title = p.nombre + ' personalizados — PubliGraff';
      var metaDesc = $('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', p.nombre + ' con tu logo. ' + p.resumen + ' Revisa modelos y precios y cotiza por WhatsApp o correo.');

      $('[data-ficha]').hidden = false;
      $('[data-seccion-modelos]').hidden = false;

      var miga = $('[data-miga-categoria]');
      miga.textContent = cat ? cat.nombre : 'Productos';
      miga.href = cat ? urlCategoria(cat.id) : 'productos.html';
      $('[data-miga-producto]').textContent = p.nombre;

      $('[data-titulo]').textContent = p.nombre;
      $('[data-descripcion]').textContent = p.descripcion;
      $('[data-caracteristicas]').innerHTML = (p.caracteristicas || []).map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('');
      var desde = textoDesde(p);
      $('[data-desde]').innerHTML = desde
        ? '<strong>' + desde + '</strong><span>+ IVA · precio referencial</span>'
        : '<strong>Precio según cantidad y diseño</strong><span>Te cotizamos sin compromiso</span>';
      var bWapp = $('[data-wapp-producto]');
      bWapp.href = urlWhatsapp('Hola, quiero información sobre ' + p.nombre + '.');
      bWapp.target = '_blank'; bWapp.rel = 'noopener';

      // Galería
      var principal = $('[data-galeria-principal]');
      principal.src = p.imagenes[0];
      principal.alt = p.nombre;
      var minis = $('[data-galeria-miniaturas]');
      if (p.imagenes.length > 1) {
        minis.innerHTML = p.imagenes.map(function (src, i) {
          return '<button type="button" class="galeria__mini' + (i === 0 ? ' is-activa' : '') + '" data-src="' + esc(src) + '" aria-label="Ver imagen ' + (i + 1) + '">' +
            '<img src="' + esc(src) + '" alt=""></button>';
        }).join('');
        minis.addEventListener('click', function (e) {
          var b = e.target.closest('[data-src]'); if (!b) return;
          principal.classList.remove('is-cambio'); void principal.offsetWidth; principal.classList.add('is-cambio');
          principal.src = b.getAttribute('data-src');
          $$('.galeria__mini', minis).forEach(function (x) { x.classList.toggle('is-activa', x === b); });
        });
      }

      // Modelos
      var contModelos = $('[data-modelos]');
      contModelos.innerHTML = p.modelos.map(function (m, mi) {
        var conPrecios = CONFIG.mostrarPrecios && m.precios && m.precios.length;
        var opciones;
        if (conPrecios) {
          opciones = '<fieldset class="tramos"><legend>Elige la cantidad</legend>' +
            m.precios.map(function (t, ti) {
              var pr = precioTramo(t);
              return '<label class="tramo">' +
                '<input type="radio" name="m' + mi + '" value="' + t.cant + '"' + (ti === 0 ? ' checked' : '') + '>' +
                '<span class="tramo__cant">' + miles(t.cant) + ' u.</span>' +
                '<span class="tramo__precio">' + pesos(pr.total) + '</span>' +
                '<span class="tramo__unit">' + pesos(pr.unitario) + ' c/u</span>' +
              '</label>';
            }).join('') +
            '<label class="tramo tramo--otra">' +
              '<input type="radio" name="m' + mi + '" value="otra">' +
              '<span class="tramo__cant">Otra cantidad</span>' +
              '<input type="text" inputmode="numeric" class="tramo__input" placeholder="Ej: 1.500" aria-label="Otra cantidad para ' + esc(m.nombre) + '">' +
            '</label>' +
          '</fieldset>';
        } else {
          opciones = '<div class="campo"><label for="c' + mi + '">Cantidad aproximada</label>' +
            '<input id="c' + mi + '" type="text" inputmode="numeric" class="modelo__cant" placeholder="Ej: 100"></div>';
        }
        return '<article class="modelo reveal" data-modelo="' + mi + '">' +
          '<header class="modelo__head">' +
            '<h3 class="modelo__nombre">' + esc(m.nombre) + '</h3>' +
            (m.medida ? '<p class="modelo__medida">' + esc(m.medida) + '</p>' : '') +
            (m.uso ? '<p class="modelo__uso">' + esc(m.uso) + '</p>' : '') +
          '</header>' +
          opciones +
          '<div class="modelo__acciones">' +
            '<button type="button" class="btn btn--marca btn--bloque" data-agregar>Agregar a mi cotización</button>' +
            '<button type="button" class="btn btn--enlace" data-consultar>' + iconoWapp + ' Consultar solo este modelo</button>' +
          '</div>' +
        '</article>';
      }).join('');

      $('[data-nota-precios]').textContent = CONFIG.mostrarPrecios ? CONFIG.notaPrecios : '';

      var cantidadElegida = function (card) {
        var r = $('input[type="radio"]:checked', card);
        if (r) return r.value === 'otra' ? $('.tramo__input', card).value.trim() : r.value;
        var i = $('.modelo__cant', card);
        return i ? i.value.trim() : '';
      };

      contModelos.addEventListener('focusin', function (e) {
        // Escribir en "Otra cantidad" selecciona esa opción
        if (e.target.classList.contains('tramo__input')) {
          e.target.closest('.tramo').querySelector('input[type="radio"]').checked = true;
        }
      });
      contModelos.addEventListener('click', function (e) {
        var card = e.target.closest('.modelo'); if (!card) return;
        var m = p.modelos[parseInt(card.getAttribute('data-modelo'), 10)];
        var cant = cantidadElegida(card);

        var bAgregar = e.target.closest('[data-agregar]');
        if (bAgregar) {
          agregarALista({ pid: p.id, modelo: m.nombre, cantidad: cant });
          bAgregar.classList.add('is-ok');
          bAgregar.textContent = '✓ Agregado';
          setTimeout(function () { bAgregar.classList.remove('is-ok'); bAgregar.textContent = 'Agregar a mi cotización'; }, 1800);
          mostrarAviso('<span><strong>' + esc(p.nombre) + '</strong> · ' + esc(m.nombre) + ' agregado a tu cotización.</span>' +
            '<button type="button" class="enlace" data-abrir-lista>Ver y enviar</button>');
        }
        if (e.target.closest('[data-consultar]')) {
          abrir(urlWhatsapp('Hola PubliGraff, quiero cotizar:\n\n' + lineaItem({ pid: p.id, modelo: m.nombre, cantidad: cant }, 0)));
        }
      });

      // Relacionados: misma categoría principal
      var relacionados = PRODUCTOS.filter(function (x) {
        return x.id !== p.id && x.categorias.indexOf(p.categorias[0]) > -1;
      }).slice(0, 4);
      if (relacionados.length) {
        $('[data-seccion-relacionados]').hidden = false;
        $('[data-relacionados]').innerHTML = relacionados.map(tarjetaProducto).join('');
      }
    }
  }


  /* ── FORMULARIO DE CONTACTO (contacto.html) ─────────────── */
  var form = $('[data-formulario]');
  if (form) {
    var sel = $('[data-select-productos]', form);
    var preProducto = producto(new URLSearchParams(window.location.search).get('producto'));
    sel.innerHTML = '<option value="">Elige un producto (opcional)</option>' +
      PRODUCTOS.map(function (x) {
        return '<option' + (preProducto && preProducto.id === x.id ? ' selected' : '') + '>' + esc(x.nombre) + '</option>';
      }).join('') +
      '<option>Otro / no estoy seguro</option>';

    var via = 'whatsapp';
    $$('button[type="submit"]', form).forEach(function (b) {
      b.addEventListener('click', function () { via = b.getAttribute('data-via'); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var err = $('[data-error]', form);
      if (!f.nombre.value.trim()) { err.hidden = false; f.nombre.focus(); return; }
      err.hidden = true;
      var l = ['Hola PubliGraff, me gustaría cotizar:', ''];
      if (f.producto.value) l.push('Producto: ' + f.producto.value);
      if (f.cantidad.value.trim()) l.push('Cantidad: ' + f.cantidad.value.trim());
      if (f.mensaje.value.trim()) l.push('Detalles: ' + f.mensaje.value.trim());
      l.push('');
      l.push('Nombre: ' + f.nombre.value.trim());
      if (f.negocio.value.trim()) l.push('Negocio: ' + f.negocio.value.trim());
      if (f.comuna.value.trim()) l.push('Comuna / ciudad: ' + f.comuna.value.trim());
      var texto = l.join('\n');
      abrir(via === 'correo' ? urlCorreo('Cotización — ' + f.nombre.value.trim(), texto) : urlWhatsapp(texto));
    });
  }


  /* ══════════════════════════════════════════════════════════
     ANIMACIONES
     ══════════════════════════════════════════════════════════ */

  /* Aparición al hacer scroll: todo lo que tenga .reveal entra
     suavemente desde abajo cuando aparece en pantalla. Los elementos
     de una misma grilla entran uno tras otro (efecto cascada). */
  var io = null;
  if (!reducirMovimiento && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('animar');
    io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        // Se muestra al entrar en pantalla, o si ya quedó arriba (scroll muy rápido)
        if (!en.isIntersecting && en.boundingClientRect.top > 0) return;
        var el = en.target;
        var hermanos = el.parentElement ? $$(':scope > .reveal', el.parentElement) : [el];
        var i = Math.max(0, hermanos.indexOf(el));
        el.style.transitionDelay = (i % 8) * 70 + 'ms';
        el.classList.add('is-visible');
        io.unobserve(el);
        // Quitar el retraso después, para que el hover responda al tiro
        setTimeout(function () { el.style.transitionDelay = ''; }, 900);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  }
  function animarNuevos(ctx) {
    $$('.reveal:not(.is-visible)', ctx).forEach(function (el) {
      if (io) io.observe(el); else el.classList.add('is-visible');
    });
  }
  animarNuevos(document);

  /* Respaldo: si el visitante salta de golpe (tecla Fin, barra de scroll),
     el observador no alcanza a avisar; mostramos todo lo que ya quedó atrás. */
  if (io) {
    var revisando = false;
    window.addEventListener('scroll', function () {
      if (revisando) return;
      revisando = true;
      requestAnimationFrame(function () {
        revisando = false;
        $$('.reveal:not(.is-visible)').forEach(function (el) {
          if (el.getBoundingClientRect().top < window.innerHeight) {
            el.classList.add('is-visible');
            io.unobserve(el);
          }
        });
      });
    }, { passive: true });
  }

  /* La cifra de productos se calcula sola desde js/datos.js */
  $$('[data-contar-productos]').forEach(function (el) {
    el.textContent = PRODUCTOS.length;
    el.setAttribute('data-contar', PRODUCTOS.length);
  });

  /* Números que cuentan hasta su valor al aparecer (ej: +15 años) */
  $$('[data-contar]').forEach(function (el) {
    var destino = parseInt(el.getAttribute('data-contar'), 10);
    var prefijo = el.getAttribute('data-prefijo') || '';
    var sufijo = el.getAttribute('data-sufijo') || '';
    if (reducirMovimiento || !('IntersectionObserver' in window)) return;
    el.textContent = prefijo + '0' + sufijo;
    var ioc = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return;
      ioc.disconnect();
      var t0 = null;
      requestAnimationFrame(function paso(t) {
        if (t0 === null) t0 = t;
        var k = Math.min((t - t0) / 1200, 1);
        el.textContent = prefijo + Math.round(destino * (1 - Math.pow(1 - k, 3))).toLocaleString('es-CL') + sufijo;
        if (k < 1) requestAnimationFrame(paso);
      });
    }, { threshold: 0.6 });
    ioc.observe(el);
  });

  /* Portada: las fotos del mosaico van rotando suavemente */
  var mosaico = $('[data-mosaico]');
  if (mosaico && !reducirMovimiento) {
    var fotos = [
      'imagenes/productos/saquitos-foto.jpg', 'imagenes/productos/bolsas-manilla-modelos.jpg',
      'imagenes/productos/polerones-impresos-2.jpg', 'imagenes/productos/atril-4.jpg',
      'imagenes/productos/bolsas-tnt.jpg', 'imagenes/productos/papel-antigrasa-modelos.jpg',
      'imagenes/productos/cajas-personalizadas.jpg', 'imagenes/productos/atril-2.jpg'
    ];
    var celdas = $$('img', mosaico);
    var siguiente = celdas.length, turno = 0;
    setInterval(function () {
      if (document.hidden) return;
      var img = celdas[turno % celdas.length];
      var nueva = fotos[siguiente % fotos.length];
      img.classList.add('is-saliendo');
      setTimeout(function () {
        img.onload = function () { img.classList.remove('is-saliendo'); };
        img.src = nueva;
      }, 450);
      turno++; siguiente++;
    }, 2800);
  }

  /* Transición suave al cambiar de página */
  if (!reducirMovimiento) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^(mailto|tel|https?):/i.test(href)) return;
      e.preventDefault();
      document.body.classList.add('saliendo');
      setTimeout(function () { window.location.href = href; }, 180);
    });
    window.addEventListener('pageshow', function () { document.body.classList.remove('saliendo'); });
  }


  /* ── VIDEOS DEL TALLER: se reproducen solo mientras se ven ─ */
  var videos = $$('video');
  if (videos.length && 'IntersectionObserver' in window) {
    var iov = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { var pr = en.target.play(); if (pr && pr.catch) pr.catch(function () {}); }
        else en.target.pause();
      });
    }, { threshold: 0.4 });
    videos.forEach(function (v) { iov.observe(v); });
  }

})();
