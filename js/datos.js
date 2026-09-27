/* ============================================================
   PubliGraff — datos del sitio
   ------------------------------------------------------------
   Este es el ÚNICO archivo que hay que editar para:
     · cambiar teléfono, correo, dirección u horario
     · agregar / quitar productos o modelos
     · actualizar precios (o esconderlos todos)

   Cómo agregar un producto: copia un bloque { id: ..., } completo
   dentro de PRODUCTOS y cambia sus datos. El "id" se usa en la
   dirección de la página (producto.html?id=saquitos), así que
   debe ser único, en minúsculas y sin espacios ni tildes.

   Precios: cada modelo puede tener una lista "precios".
     { cant: 500, total: 20000 }  → precio del paquete completo
     { cant: 100, unitario: 350 } → precio por unidad
   Si un modelo no tiene "precios", se muestra "Cotiza a medida".
   ============================================================ */

var CONFIG = {
  empresa: 'PubliGraff',
  whatsapp: '56984633328',              // sin + ni espacios
  whatsappVisible: '+56 9 8463 3328',
  correo: 'cualestubolsa@gmail.com',
  direccion: 'San Joaquín, Santiago',
  horario: 'Lun a Vie 9:00–18:00 · Sáb 9:00–13:00',

  mostrarPrecios: true,                 // false = oculta todos los precios del sitio
  notaPrecios: 'Precios referenciales 2025, netos (+ IVA), impresión 1 color 1 cara salvo que se indique otra cosa. Te confirmamos el valor final al cotizar.'
};

var CATEGORIAS = [
  { id: 'gastronomia',  nombre: 'Gastronomía',              desc: 'Saquitos, individuales, papel antigrasa y envases.', img: 'imagenes/productos/saquitos-foto.jpg' },
  { id: 'bolsas',       nombre: 'Bolsas y empaques',        desc: 'Bolsas de papel, TNT, delivery y cajas.',            img: 'imagenes/productos/bolsas-manilla-modelos.jpg' },
  { id: 'publicidad',   nombre: 'Publicidad',               desc: 'Imanes, calendarios, stickers y atriles.',           img: 'imagenes/productos/atril-3.jpg' },
  { id: 'promocionales',nombre: 'Artículos promocionales',  desc: 'Tazones, agendas y lápices con tu logo.',            img: 'imagenes/productos/tazones.jpg' },
  { id: 'ropa',         nombre: 'Ropa corporativa',         desc: 'Polerones estampados y poleras bordadas.',           img: 'imagenes/productos/polerones-impresos-2.jpg' },
  { id: 'ecologico',    nombre: 'Línea ecológica',          desc: 'Empaques reciclables y reutilizables.',              img: 'imagenes/productos/bolsas-tnt.jpg' }
];

/* Productos que se muestran en la portada (por id, en este orden) */
var DESTACADOS = ['saquitos', 'bolsas-manilla', 'individuales', 'imanes-calendario', 'bolsas-tnt', 'papel-antigrasa', 'tazones', 'polerones'];

var PRODUCTOS = [

  /* ───────────── GASTRONOMÍA ───────────── */
  {
    id: 'saquitos',
    nombre: 'Saquitos de papel café',
    categorias: ['gastronomia', 'bolsas', 'ecologico'],
    resumen: 'Para panaderías, empanadas, papas fritas y comida para llevar.',
    descripcion: 'Saquitos de papel café (kraft) impresos con tu logo. Tenemos formatos desde ½ kilo hasta 8 kilos, así que sirven desde una porción de papas fritas hasta el pan del día.',
    imagenes: ['imagenes/productos/saquitos-modelos.jpg', 'imagenes/productos/saquitos-foto.jpg', 'imagenes/productos/saquitos-papel.jpg'],
    caracteristicas: ['Papel café kraft', 'Impresión 1 color 1 cara', 'Diseño gratis', 'Desde 500 unidades'],
    modelos: [
      { nombre: '½ y 1 kilo', medida: '8 × 23 cm · 12 × 23 cm', uso: 'Papas fritas, pan, dulces',
        precios: [{ cant: 500, total: 20000 }, { cant: 1000, total: 25000 }, { cant: 2000, total: 45000 }, { cant: 3000, total: 60000 }, { cant: 4000, total: 75000 }, { cant: 5000, total: 95000 }] },
      { nombre: '2 y 3 kilos', medida: '16 × 28 cm · 16 × 33 cm', uso: 'Empanadas, pan, pastelería',
        precios: [{ cant: 500, total: 25000 }, { cant: 1000, total: 35000 }, { cant: 2000, total: 55000 }, { cant: 3000, total: 65000 }, { cant: 4000, total: 80000 }, { cant: 5000, total: 110000 }] },
      { nombre: '4, 5 y 6 kilos', medida: '19 × 38 cm · 18 × 42 cm · 18 × 48 cm', uso: 'Panadería, pedidos grandes',
        precios: [{ cant: 500, total: 35000 }, { cant: 1000, total: 55000 }, { cant: 2000, total: 80000 }, { cant: 3000, total: 120000 }, { cant: 4000, total: 135000 }, { cant: 5000, total: 160000 }] },
      { nombre: '7 y 8 kilos', medida: '26 × 48 cm · 26 × 49 cm', uso: 'Panadería, despacho mayorista',
        precios: [{ cant: 500, total: 40000 }, { cant: 1000, total: 70000 }, { cant: 2000, total: 120000 }, { cant: 3000, total: 145000 }, { cant: 4000, total: 185000 }, { cant: 5000, total: 245000 }] }
    ]
  },

  {
    id: 'individuales',
    nombre: 'Individuales de papel',
    categorias: ['gastronomia'],
    resumen: 'Para mesas de restaurantes, cafeterías y fuentes de soda.',
    descripcion: 'Individuales de papel impresos con tu marca, tu carta o tus promociones. Elige papel kraft (café) o bond (blanco). También cotizamos otros tamaños e impresión a todo color.',
    imagenes: ['imagenes/productos/individuales-papel.jpg'],
    caracteristicas: ['Tamaño 25 × 36 cm', 'Papel 70 g', 'Impresión 1 color 1 cara', 'Desde 1.000 unidades'],
    modelos: [
      { nombre: 'Papel kraft 70 g', medida: '25 × 36 cm', uso: 'Estilo rústico, café natural',
        precios: [{ cant: 1000, total: 55000 }, { cant: 2000, total: 80000 }, { cant: 3000, total: 110000 }, { cant: 4000, total: 140000 }, { cant: 5000, total: 175000 }, { cant: 10000, total: 345000 }] },
      { nombre: 'Papel bond 70 g', medida: '25 × 36 cm', uso: 'Fondo blanco, más contraste',
        precios: [{ cant: 1000, total: 50000 }, { cant: 2000, total: 75000 }, { cant: 3000, total: 100000 }, { cant: 4000, total: 135000 }, { cant: 5000, total: 170000 }, { cant: 10000, total: 330000 }] },
      { nombre: 'Otro tamaño o a todo color', medida: 'A medida', uso: 'Cuéntanos qué necesitas' }
    ]
  },

  {
    id: 'papel-antigrasa',
    nombre: 'Papel antigrasa',
    categorias: ['gastronomia'],
    resumen: 'Para envolver hamburguesas, sándwiches y comida rápida.',
    descripcion: 'Papel antigrasa impreso con tu logo o un diseño de patrón. Resiste la grasa y deja tu marca en cada pedido.',
    imagenes: ['imagenes/productos/papel-antigrasa-modelos.jpg', 'imagenes/productos/papel-antigrasa.jpg'],
    caracteristicas: ['4 tamaños', 'Impresión 1 color 1 cara', 'Diseño gratis', 'Desde 500 unidades'],
    modelos: [
      { nombre: '20 × 30 cm', medida: '20 × 30 cm', uso: 'Sándwich, completo',
        precios: [{ cant: 500, total: 25000 }, { cant: 1000, total: 40000 }, { cant: 2000, total: 55000 }] },
      { nombre: '25 × 35 cm', medida: '25 × 35 cm', uso: 'Hamburguesa',
        precios: [{ cant: 500, total: 28000 }, { cant: 1000, total: 45000 }, { cant: 2000, total: 60000 }] },
      { nombre: '28 × 35 cm', medida: '28 × 35 cm', uso: 'Hamburguesa grande, bandejas',
        precios: [{ cant: 500, total: 35000 }, { cant: 1000, total: 55000 }, { cant: 2000, total: 70000 }] },
      { nombre: '30 × 40 cm', medida: '30 × 40 cm', uso: 'Bandejas, fondo de caja',
        precios: [{ cant: 500, total: 45000 }, { cant: 1000, total: 60000 }, { cant: 2000, total: 90000 }] }
    ]
  },

  {
    id: 'porta-comida',
    nombre: 'Porta comida rápida',
    categorias: ['gastronomia', 'bolsas'],
    resumen: 'Envases impresos para completos, pizza, hamburguesas y papas fritas.',
    descripcion: 'Envases de cartón impresos con tu marca para servir o despachar comida rápida. Cuéntanos qué vendes y te recomendamos el formato.',
    imagenes: ['imagenes/productos/porta-comida-rapida.jpg'],
    caracteristicas: ['Cartón para alimentos', 'Impreso con tu marca', 'Diseño gratis'],
    modelos: [
      { nombre: 'Porta completos', medida: 'Según formato', uso: 'Completos y hot dogs' },
      { nombre: 'Porta pizza (triángulo)', medida: 'Según formato', uso: 'Pizza por porción' },
      { nombre: 'Caja hamburguesa', medida: 'Según formato', uso: 'Hamburguesas y sándwiches' },
      { nombre: 'Porta papas fritas', medida: 'Según formato', uso: 'Papas fritas y snacks' }
    ]
  },

  {
    id: 'posavasos',
    nombre: 'Posavasos',
    categorias: ['gastronomia', 'publicidad'],
    resumen: 'Cartón absorbente impreso para bares, cervecerías y restaurantes.',
    descripcion: 'Posavasos de cartón absorbente con tu logo. Una forma económica de que tu marca esté en cada mesa.',
    imagenes: ['imagenes/productos/posavasos.jpg'],
    caracteristicas: ['Cartón absorbente', 'Redondos o cuadrados', 'Diseño gratis'],
    modelos: [
      { nombre: 'Posavaso redondo', medida: 'Según diseño', uso: 'Bares y cervecerías' },
      { nombre: 'Posavaso cuadrado', medida: 'Según diseño', uso: 'Restaurantes y cafeterías' }
    ]
  },

  /* ───────────── BOLSAS Y EMPAQUES ───────────── */
  {
    id: 'bolsas-manilla',
    nombre: 'Bolsas de papel con manilla',
    categorias: ['bolsas', 'ecologico'],
    resumen: 'Para tiendas, farmacias, pastelerías y retail.',
    descripcion: 'Bolsas de papel kraft con manilla de papel torcido, impresas con tu logo. Tenemos 6 tamaños, desde bolsa chica de regalo hasta bolsa grande de compras.',
    imagenes: ['imagenes/productos/bolsas-manilla-modelos.jpg', 'imagenes/productos/bolsas-manilla.jpg'],
    caracteristicas: ['Papel kraft', 'Manilla de papel torcido', '6 tamaños', 'Desde 100 unidades'],
    modelos: [
      { nombre: 'Chica', medida: '22 × 30 × 10 cm', uso: 'Accesorios, regalos pequeños',
        precios: [{ cant: 100, total: 45000 }, { cant: 500, total: 90000 }, { cant: 1000, total: 150000 }] },
      { nombre: 'Mediana ancha', medida: '26 × 30 × 17 cm', uso: 'Pastelería, cajas',
        precios: [{ cant: 100, total: 48000 }, { cant: 500, total: 95000 }, { cant: 1000, total: 160000 }] },
      { nombre: 'Mediana', medida: '31 × 33 × 11 cm', uso: 'Tienda, farmacia',
        precios: [{ cant: 100, total: 55000 }, { cant: 500, total: 105000 }, { cant: 1000, total: 190000 }] },
      { nombre: 'Mediana alta', medida: '30 × 41 × 12 cm', uso: 'Ropa, botellas',
        precios: [{ cant: 100, total: 60000 }, { cant: 500, total: 110000 }, { cant: 1000, total: 195000 }] },
      { nombre: 'Grande horizontal', medida: '40 × 30 × 12 cm', uso: 'Ropa, retail',
        precios: [{ cant: 100, total: 65000 }, { cant: 500, total: 120000 }, { cant: 1000, total: 210000 }] },
      { nombre: 'Extra grande', medida: '45 × 48 × 15 cm', uso: 'Compras grandes',
        precios: [{ cant: 100, total: 75000 }, { cant: 500, total: 210000 }, { cant: 1000, total: 280000 }] }
    ]
  },

  {
    id: 'bolsas-delivery',
    nombre: 'Bolsas delivery',
    categorias: ['bolsas', 'gastronomia', 'ecologico'],
    resumen: 'Bolsas de papel con asa troquelada para despachos de comida.',
    descripcion: 'Bolsas de papel con fuelle ancho y asa troquelada, pensadas para que las cajas y envases de comida viajen derechos. Impresas con tu logo.',
    imagenes: ['imagenes/productos/bolsas-delivery.jpg'],
    caracteristicas: ['Papel kraft', 'Asa troquelada', 'Base ancha de 15 cm', 'Desde 100 unidades'],
    modelos: [
      { nombre: 'Delivery cuadrada', medida: '28 × 28 × 15 cm', uso: 'Pedidos individuales',
        precios: [{ cant: 100, unitario: 350 }, { cant: 500, unitario: 320 }, { cant: 1000, unitario: 300 }] },
      { nombre: 'Delivery alta', medida: '28 × 35 × 15 cm', uso: 'Pedidos dobles, bebidas',
        precios: [{ cant: 100, unitario: 400 }, { cant: 500, unitario: 380 }, { cant: 1000, unitario: 350 }] }
    ]
  },

  {
    id: 'bolsas-tnt',
    nombre: 'Bolsas TNT reutilizables',
    categorias: ['bolsas', 'ecologico'],
    resumen: 'Bolsas de tela no tejida, resistentes y reutilizables.',
    descripcion: 'Bolsas de TNT (tela no tejida) con tu logo. Se reutilizan muchas veces, así que tu marca sigue a la vista mucho después de la compra. Disponibles en varios colores.',
    imagenes: ['imagenes/productos/bolsas-tnt.jpg'],
    caracteristicas: ['Reutilizables', 'Varios colores', '3 tamaños', 'Desde 100 unidades'],
    modelos: [
      { nombre: 'Chica', medida: '25 × 30 × 8 cm', uso: 'Regalos, eventos',
        precios: [{ cant: 100, unitario: 350 }, { cant: 500, unitario: 330 }, { cant: 1000, unitario: 300 }] },
      { nombre: 'Mediana', medida: '30 × 40 × 12 cm', uso: 'Tiendas, ferias',
        precios: [{ cant: 100, unitario: 450 }, { cant: 500, unitario: 400 }, { cant: 1000, unitario: 380 }] },
      { nombre: 'Grande', medida: '45 × 45 × 15 cm', uso: 'Supermercado, compras grandes',
        precios: [{ cant: 100, unitario: 520 }, { cant: 500, unitario: 470 }, { cant: 1000, unitario: 450 }] }
    ]
  },

  {
    id: 'cajas',
    nombre: 'Cajas personalizadas',
    categorias: ['bolsas'],
    resumen: 'Cajas de cartón impresas a todo color, en distintos tamaños.',
    descripcion: 'Cajas de cartón impresas a todo color con tu marca: para delivery, regalos corporativos o packaging de producto. Diferentes tamaños y colores.',
    imagenes: ['imagenes/productos/cajas-personalizadas.jpg'],
    caracteristicas: ['Impresión a todo color', 'Diferentes tamaños', 'Diseño gratis'],
    modelos: [
      { nombre: 'Caja SuperBox con manilla', medida: 'Según formato', uso: 'Delivery, combos, regalos' },
      { nombre: 'Cajita personalizada', medida: 'A medida', uso: 'Packaging de producto, regalos' }
    ]
  },

  /* ───────────── PUBLICIDAD ───────────── */
  {
    id: 'imanes-calendario',
    nombre: 'Imanes con calendario',
    categorias: ['publicidad'],
    resumen: 'Tu negocio en el refrigerador de tus clientes todo el año.',
    descripcion: 'Imanes con el calendario del año y los datos de tu negocio. Ideales para delivery, gas, agua, veterinarias y cualquier servicio que tus clientes necesiten tener a mano.',
    imagenes: ['imagenes/productos/imanes-calendario.jpg'],
    caracteristicas: ['Tamaño 7 × 9 cm aprox.', 'Impresión a todo color', 'Diseño gratis', 'Desde 100 unidades'],
    modelos: [
      { nombre: 'Imán con calendario', medida: '7 × 9 cm', uso: 'Todo color',
        precios: [{ cant: 100, total: 28000 }, { cant: 200, total: 48000 }, { cant: 300, total: 55000 }, { cant: 400, total: 68000 }, { cant: 500, total: 80000 }, { cant: 1000, total: 125000 }] }
    ]
  },

  {
    id: 'imanes',
    nombre: 'Imanes publicitarios',
    categorias: ['publicidad'],
    resumen: 'Imanes de corte recto o con la forma que quieras.',
    descripcion: 'Imanes para refrigerador con tu logo y teléfono. Elige corte recto o con forma (tu mascota, tu producto, tu logo).',
    imagenes: ['imagenes/productos/imanes-forma.jpg'],
    caracteristicas: ['Corte recto o con forma', 'Impresión a todo color', 'Diseño gratis', 'Desde 100 unidades'],
    modelos: [
      { nombre: 'Corte recto chico', medida: '6 × 8 cm', uso: 'Tarjeta de presentación',
        precios: [{ cant: 100, total: 25000 }, { cant: 300, total: 40000 }, { cant: 500, total: 60000 }, { cant: 1000, total: 80000 }] },
      { nombre: 'Corte recto grande', medida: '9 × 8 cm', uso: 'Más espacio para tu info',
        precios: [{ cant: 100, total: 35000 }, { cant: 300, total: 45000 }, { cant: 500, total: 65000 }, { cant: 1000, total: 85000 }] },
      { nombre: 'Con forma chico', medida: '5 × 9 cm', uso: 'Silueta a elección',
        precios: [{ cant: 100, total: 35000 }, { cant: 300, total: 60000 }, { cant: 500, total: 85000 }, { cant: 1000, total: 110000 }] },
      { nombre: 'Con forma grande', medida: '8 × 9 cm', uso: 'Silueta a elección',
        precios: [{ cant: 100, total: 40000 }, { cant: 300, total: 65000 }, { cant: 500, total: 90000 }, { cant: 1000, total: 125000 }] }
    ]
  },

  {
    id: 'stickers',
    nombre: 'Stickers adhesivos',
    categorias: ['publicidad'],
    resumen: 'Adhesivos a todo color para envases, bolsas y promociones.',
    descripcion: 'Stickers personalizados a todo color. Úsalos para cerrar bolsas, marcar envases o regalarlos a tus clientes. Diferentes tamaños.',
    imagenes: ['imagenes/productos/stickers.jpg'],
    caracteristicas: ['Impresión a todo color', 'Diferentes tamaños', 'Diseño gratis', 'Desde 500 unidades'],
    modelos: [
      { nombre: 'Sticker 5 × 5 cm', medida: '5 × 5 cm', uso: 'Sellos para bolsas y envases',
        precios: [{ cant: 500, total: 38000 }, { cant: 1000, total: 62000 }] },
      { nombre: 'Otro tamaño o forma', medida: 'A medida', uso: 'Cuéntanos qué necesitas' }
    ]
  },

  {
    id: 'atril',
    nombre: 'Gráfica para atril metálico',
    categorias: ['publicidad'],
    resumen: 'Afiches para atriles de vereda: menú del día, promociones, horarios.',
    descripcion: 'Imprimimos la gráfica para tu atril metálico de vereda, lista para cambiarla cuando renueves tu menú o tus promociones.',
    imagenes: ['imagenes/productos/atril-1.jpg', 'imagenes/productos/atril-2.jpg', 'imagenes/productos/atril-3.jpg', 'imagenes/productos/atril-4.jpg'],
    caracteristicas: ['Para exterior', 'Impresión a todo color', 'Diseño gratis'],
    modelos: [
      { nombre: 'Gráfica para atril', medida: 'Según tu atril', uso: 'Menú, promociones, horarios' }
    ]
  },

  /* ───────────── ARTÍCULOS PROMOCIONALES ───────────── */
  {
    id: 'tazones',
    nombre: 'Tazones personalizados',
    categorias: ['promocionales'],
    resumen: 'Tazones con tu logo para regalos corporativos y eventos.',
    descripcion: 'Tazones de cerámica impresos con tu logo o diseño. Un regalo útil para clientes y equipos, disponible en diferentes tamaños y colores.',
    imagenes: ['imagenes/productos/tazones.jpg'],
    caracteristicas: ['Diferentes tamaños', 'Diferentes colores', 'Diseño gratis'],
    modelos: [
      { nombre: 'Tazón blanco', medida: 'Según modelo', uso: 'Regalo corporativo' },
      { nombre: 'Tazón con interior y asa de color', medida: 'Según modelo', uso: 'Combina con tu marca' }
    ]
  },

  {
    id: 'agendas',
    nombre: 'Agendas personalizadas',
    categorias: ['promocionales'],
    resumen: 'Agendas y cuadernos con tu marca para clientes y equipos.',
    descripcion: 'Agendas con la portada de tu empresa, en diferentes tamaños y colores. Ideales para fin de año, inducciones y ferias.',
    imagenes: ['imagenes/productos/agendas.jpg'],
    caracteristicas: ['Diferentes tamaños', 'Diferentes colores', 'Diseño gratis'],
    modelos: [
      { nombre: 'Agenda tapa kraft', medida: 'Según tamaño', uso: 'Estilo natural' },
      { nombre: 'Agenda tapa impresa a todo color', medida: 'Según tamaño', uso: 'Portada con tu diseño' }
    ]
  },

  {
    id: 'lapices',
    nombre: 'Lápices impresos',
    categorias: ['promocionales'],
    resumen: 'Lápices pasta con tu logo, en diferentes estilos.',
    descripcion: 'Lápices pasta impresos con tu logo. El regalo promocional más económico para ferias, eventos y mostrador.',
    imagenes: ['imagenes/productos/lapices.jpg'],
    caracteristicas: ['Diferentes estilos', 'Impresos con tu logo'],
    modelos: [
      { nombre: 'Lápiz pasta impreso', medida: 'Según modelo', uso: 'Ferias, eventos, mostrador' }
    ]
  },

  /* ───────────── ROPA CORPORATIVA ───────────── */
  {
    id: 'polerones',
    nombre: 'Polerones estampados',
    categorias: ['ropa'],
    resumen: 'Polerones con tu logo estampado por serigrafía.',
    descripcion: 'Polerones estampados por serigrafía para uniformes, equipos, generaciones y eventos. Estampamos en pecho, espalda o ambos.',
    imagenes: ['imagenes/productos/polerones-impresos-2.jpg', 'imagenes/productos/polerones-impresos.jpg'],
    caracteristicas: ['Serigrafía', 'Pecho y/o espalda', 'Diseño gratis'],
    modelos: [
      { nombre: 'Estampado en pecho', medida: 'Logo chico', uso: 'Uniforme de trabajo' },
      { nombre: 'Estampado en espalda', medida: 'Logo grande', uso: 'Equipos y eventos' },
      { nombre: 'Pecho y espalda', medida: 'Dos ubicaciones', uso: 'Máxima visibilidad' }
    ]
  },

  {
    id: 'poleras',
    nombre: 'Poleras bordadas',
    categorias: ['ropa'],
    resumen: 'Poleras de piqué con tu logo bordado.',
    descripcion: 'Poleras tipo piqué con el logo de tu empresa bordado. Una terminación duradera y de buena presencia para tu equipo.',
    imagenes: ['imagenes/productos/poleras-bordadas.jpg'],
    caracteristicas: ['Bordado', 'Polera piqué', 'Diseño gratis'],
    modelos: [
      { nombre: 'Polera piqué bordada', medida: 'Logo en pecho', uso: 'Uniforme corporativo' }
    ]
  }
];
