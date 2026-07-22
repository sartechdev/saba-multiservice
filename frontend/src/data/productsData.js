import caloventorImg from '../assets/caloventor.webp';
import controlesImg from '../assets/controles.webp';
import productoImg from '../assets/producto.webp';

export const CATEGORIES = [
  { id: 'todos', name: 'Todos los productos', slug: 'todos' },
  { id: 'nuevos', name: 'Electrodomésticos Nuevos', slug: 'electrodomesticos-nuevos' },
  { id: 'repuestos', name: 'Repuestos y Accesorios', slug: 'repuestos-accesorios' },
  { id: 'tv-pc', name: 'Accesorios TV / Celular / PC', slug: 'accesorios-tv-pc' }
];

export const INITIAL_PRODUCTS = [
  // 1. Electrodomésticos Nuevos
  {
    id: 'prod-1',
    slug: 'caloventor-liliana-2000w-turbocalefactor',
    name: 'Caloventor Liliana 2000W Turbo Calefactor',
    category_id: 'nuevos',
    category_name: 'Electrodomésticos Nuevos',
    price: 48500,
    price_on_request: false,
    images: [caloventorImg, productoImg],
    stock_status: 'Inmediato en local',
    short_desc: 'Calefactor compacto de alta potencia con termostato regulable y doble nivel de calor.',
    description: 'El caloventor Liliana 2000W es ideal para climatizar tus ambientes en invierno con rapidez y bajo consumo. Cuenta con selector de dos intensidades térmicas (1000W y 2000W), función ventilación para el verano y corte de seguridad por sobrecalentamiento. Diseño compacto y liviano para trasladar fácilmente por toda la casa.',
    specs: [
      'Potencia máxima: 2000 Watts',
      'Niveles de calor: 2 (1000W / 2000W)',
      'Función ventilador de aire frío',
      'Termostato ambiental regulable',
      'Sistema de seguridad anticalentamiento',
      'Garantía oficial de fábrica: 12 meses'
    ],
    featured: true
  },
  {
    id: 'prod-2',
    slug: 'ventilador-pie-industrial-liliana-20-pulgadas',
    name: 'Ventilador de Pie Industrial Liliana 20 Pulgadas',
    category_id: 'nuevos',
    category_name: 'Electrodomésticos Nuevos',
    price: 89900,
    price_on_request: false,
    images: [productoImg, caloventorImg],
    stock_status: 'Inmediato en local',
    short_desc: 'Ventilador de alta velocidad con cabezal basculante, palas metálicas y motor reforzado.',
    description: 'Potente ventilador de pie diseñado para uso intenso en hogares, talleres y locales comerciales. Con cabezal oscilante de 20 pulgadas, palas metálicas de máximo caudal y base pesada antideslizante para una estabilidad inquebrantable.',
    specs: [
      'Diámetro: 20 pulgadas (50 cm)',
      'Palas metálicas de 3 aspas aerodinámicas',
      '3 velocidades regulables',
      'Altura ajustable telescópica hasta 1.70m',
      'Oscilación automática 90 grados',
      'Garantía: 1 año'
    ],
    featured: true
  },
  {
    id: 'prod-3',
    slug: 'pava-electrica-peabody-acero-inoxidable-corte-mate',
    name: 'Pava Eléctrica Peabody Acero Inoxidable con Corte Mate',
    category_id: 'nuevos',
    category_name: 'Electrodomésticos Nuevos',
    price: 54000,
    price_on_request: false,
    images: [productoImg],
    stock_status: 'Inmediato en local',
    short_desc: 'Pava eléctrica de 1.7L en acero inoxidable con temperatura exacta para mate y té.',
    description: 'Disfrutá del mate perfecto sin quemar la yerba gracias al selector exclusivo térmico de Peabody. Cuerpo exterior en acero inoxidable esmerilado de alta durabilidad, base giratoria 360° y corte automático al hervir.',
    specs: [
      'Capacidad total: 1.7 Litros',
      'Potencia: 2000W de calentamiento ultra rápido',
      'Selector de temperatura digital/mecánico (Mate 80°C o Hervir 100°C)',
      'Filtro removible lavable antisarro',
      'Cuerpo de acero inoxidable'
    ],
    featured: false
  },

  // 2. Repuestos y Accesorios de Línea Blanca
  {
    id: 'prod-4',
    slug: 'control-remoto-universal-smart-tv-todas-las-marcas',
    name: 'Control Remoto Universal Smart TV Todas las Marcas',
    category_id: 'repuestos',
    category_name: 'Repuestos y Accesorios',
    price: 12500,
    price_on_request: false,
    images: [controlesImg],
    stock_status: 'Stock permanente',
    short_desc: 'Control remoto compatible con Samsung, LG, Philips, Noblex, TCL, BGH y Android TV.',
    description: 'Solución rápida y definitiva si se te rompió o extravió el control de tu televisor. Compatible con más del 98% de los Smart TV del mercado argentino. Incluye accesos directos a Netflix, YouTube y Prime Video. Configuración en 1 paso guiada por nuestro equipo técnico en mostrador.',
    specs: [
      'Compatibilidad universal preprogramada y por código',
      'Botones dedicados para plataformas de streaming (Netflix, YouTube)',
      'Teclas de alta sensibilidad de silicona duradera',
      'Requiere 2 pilas AAA (no incluidas)',
      'Probado y verificado en nuestro mostrador con probador digital'
    ],
    featured: true
  },
  {
    id: 'prod-5',
    slug: 'plato-giratorio-cristal-templado-para-microondas-24cm-27cm-31cm',
    name: 'Plato Giratorio Cristal Templado para Microondas (24, 27 y 31 cm)',
    category_id: 'repuestos',
    category_name: 'Repuestos y Accesorios',
    price: null,
    price_on_request: true,
    images: [productoImg],
    stock_status: 'A consultar medida en local',
    short_desc: 'Platos de vidrio templado originales y universales con trébol central o lisos para todas las marcas.',
    description: 'Disponemos de una amplia variedad de platos giratorios de cristal templado termoresistente para hornos microondas BGH, Samsung, LG, Whirlpool, Atma y Philco. Contamos con trébol de arrastre central grande, mediano o plato liso.',
    specs: [
      'Material: Cristal borosilicato templado para microondas',
      'Medidas disponibles: 24.5 cm, 27 cm, 28.5 cm y 31.5 cm',
      'Encastre: Trébol de 3 pestañas o arrastre plano',
      'Repuesto 100% original de alta resistencia térmica'
    ],
    featured: false
  },
  {
    id: 'prod-6',
    slug: 'magnetron-y-placa-universal-inverter-para-microondas',
    name: 'Magnetrón y Placa Universal Inverter para Microondas',
    category_id: 'repuestos',
    category_name: 'Repuestos y Accesorios',
    price: null,
    price_on_request: true,
    images: [productoImg, controlesImg],
    stock_status: 'A pedido / Taller',
    short_desc: 'Componentes electrónicos originales para reparación y reemplazo en microondas.',
    description: 'Repuestos técnicos especializados para talleres y particulares. Magnetrones de alta eficiencia, capacitores de alta tensión, diodos HV y placas electrónicas universales con temporizador digital y relés de potencia.',
    specs: [
      'Magnetrón de reemplazo standard 2M214 / 2M219',
      'Placas universales con display LED digital y teclado de membrana o perilla',
      'Componentes testeados bajo estrictas normas de seguridad y aislamiento'
    ],
    featured: false
  },

  // 3. Accesorios TV / Celular / PC
  {
    id: 'prod-7',
    slug: 'soporte-mural-articulado-smart-tv-32-a-65-pulgadas',
    name: 'Soporte Mural Articulado para Smart TV de 32 a 65 Pulgadas',
    category_id: 'tv-pc',
    category_name: 'Accesorios TV / PC',
    price: 32000,
    price_on_request: false,
    images: [productoImg],
    stock_status: 'Inmediato en local',
    short_desc: 'Soporte de pared con doble brazo articulado, giro 180° e inclinación para LED/QLED.',
    description: 'Asegurá tu Smart TV a la pared con máxima firmeza y flexibilidad de movimiento. Doble brazo de acero reforzado que soporta hasta 45 kg, compatible con estándares VESA desde 100x100 hasta 400x400 mm. Permite extender el televisor, girarlo hacia ambos lados e inclinarlo para evitar reflejos.',
    specs: [
      'Compatibilidad de pantalla: 32 a 65 pulgadas',
      'Capacidad de carga máxima: 45 kg',
      'Estándar VESA: 100x100, 200x200, 300x300, 400x400 mm',
      'Inclinación: +15° / -15° y giro lateral 180°',
      'Incluye kit completo de tornillos, tarugos y nivel de burbuja'
    ],
    featured: true
  },
  {
    id: 'prod-8',
    slug: 'cable-hdmi-2-1-4k-8k-ultra-high-speed-mallado-2-metros',
    name: 'Cable HDMI 2.1 Ultra High Speed 4K/8K Mallado Reforzado (2m)',
    category_id: 'tv-pc',
    category_name: 'Accesorios TV / PC',
    price: 14900,
    price_on_request: false,
    images: [controlesImg, productoImg],
    stock_status: 'Inmediato en local',
    short_desc: 'Transmisión de video ultra HD 4K 120Hz con conectores bañados en oro 24K.',
    description: 'El cable HDMI definitivo para conectar consolas de última generación (PS5, Xbox Series X), computadoras gamer, Apple TV y soundbars eARC a tu Smart TV 4K/8K. Malla exterior de nylon trenzado antidesgaste y blindaje múltiple contra interferencias.',
    specs: [
      'Versión HDMI: 2.1 (Compatible con 2.0 y 1.4)',
      'Ancho de banda: 48 Gbps (Soporta 8K@60Hz y 4K@120Hz)',
      'Soporte HDR dinámico, Dolby Vision, Dolby Atmos y eARC',
      'Longitud: 2.0 Metros con conectores dorados antioxidación'
    ],
    featured: false
  },
  {
    id: 'prod-9',
    slug: 'fuente-de-alimentacion-universal-regulable-para-monitores-y-audio',
    name: 'Fuente de Alimentación Universal Regulable 12V / 24V para Monitores y Audio',
    category_id: 'tv-pc',
    category_name: 'Accesorios TV / PC',
    price: 21500,
    price_on_request: false,
    images: [productoImg],
    stock_status: 'Inmediato en local',
    short_desc: 'Cargador y fuente con voltaje múltiple intercambiable y 8 fichas conectoras universales.',
    description: 'Reemplazo ideal para fuentes quemadas de monitores LED, tiras LED, consolas de sonido, routers y pequeños dispositivos electrónicos. Permite seleccionar el voltaje exacto y adaptar la ficha con polaridad protegida.',
    specs: [
      'Salida de voltaje seleccionable: 3V, 4.5V, 6V, 7.5V, 9V, 12V y 24V',
      'Corriente de salida: hasta 3 o 5 Amperes según modelo',
      'Incluye 8 puntas intercambiables milimetradas',
      'Protección contra cortocircuito, sobretensión y sobrecalentamiento'
    ],
    featured: false
  }
];
