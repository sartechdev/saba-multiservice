/**
 * Configuración canónica de Servicios de Reparación y Catálogo de Saba Multiservice.
 * Fuente única de datos para componentes React (ServicioTecnico, Home, etc.) y agentes WebMCP.
 */

export const REPAIR_SERVICES = [
  {
    id: 'smart-tv',
    icon: '📺',
    title: 'TV LED / LCD y Smart TV',
    shortTitle: 'Smart TV',
    symptoms: [
      'No enciende o queda en standby',
      'Círculos o puntos blancos en la pantalla (difusores desprendidos)',
      'Imagen oscura / pantalla negra pero con sonido (falla de backlight)',
      'No tiene sonido o audio distorsionado',
      'Reinicio constante en logo de la marca (firmware/eMMC)',
      'Fallas en entradas HDMI o conectividad WiFi'
    ],
    desc: 'Reparación de placas de fuente, main, tiras de LED con base disipadora y reprogramación de memorias.',
    marcas: ['Samsung', 'LG', 'Philips', 'TCL', 'Noblex', 'Philco', 'BGH', 'Sony', 'RCA', 'Hitachi']
  },
  {
    id: 'microondas',
    icon: '⚡',
    title: 'Hornos Microondas',
    shortTitle: 'Microondas',
    symptoms: [
      'Interiores amarillentos, oxidados o despintados (esmaltado epoxi sanitario)',
      'No calienta (falla en magnetrón, capacitor o diodo HV)',
      'El plato no gira (motor síncrono o cruceta motriz rota)',
      'Chispazos internos (placa de mica o guía de ondas quemada)',
      'Teclado o panel de membrana táctil no responde'
    ],
    desc: 'Restauración y pintura epoxi para microondas, recambio de magnetrones, micas, platos y motores de giro.',
    marcas: ['BGH', 'Philco', 'Whirlpool', 'Samsung', 'LG', 'Atma', 'Panasonic', 'Moulinex']
  },
  {
    id: 'hornos-electricos',
    icon: '🍳',
    title: 'Hornos Eléctricos',
    shortTitle: 'Hornos Eléctricos',
    symptoms: [
      'No calienta arriba, abajo o ninguna de las dos zonas',
      'No regula temperatura o quema los alimentos (termostato)',
      'Llave selectora de calor rota o derretida',
      'Timer o temporizador trabado',
      'Hace saltar el disyuntor al encender'
    ],
    desc: 'Cambio de resistencias tubulares blindadas, termostatos bimetálicos, llaves selectoras y temporizadores.',
    marcas: ['Atma', 'BGH', 'Ultracomb', 'Liliana', 'Oster', 'Peabody', 'Ariston', 'Longvie', 'Yelmo']
  },
  {
    id: 'aspiradoras',
    icon: '🧹',
    title: 'Aspiradoras',
    shortTitle: 'Aspiradoras',
    symptoms: [
      'Pérdida notable de potencia o fuerza de succión',
      'Olor a quemado o recalentamiento del motor',
      'Ruido metálico o chirrido excesivo',
      'Se apaga a los pocos minutos por protector térmico',
      'Enrollador de cable retráctil roto o trabado'
    ],
    desc: 'Mantenimiento de motores, recambio de carbones, turbinas, filtros HEPA y reparación de cables retráctiles.',
    marcas: ['Electrolux', 'Philips', 'Liliana', 'Atma', 'Yelmo', 'Kärcher', 'Black & Decker', 'Samsung']
  },
  {
    id: 'lustraspiradoras',
    icon: '✨',
    title: 'Lustraspiradoras',
    shortTitle: 'Lustraspiradoras',
    symptoms: [
      'No arranca o genera chispazos en el motor',
      'Los cepillos no giran o patinan (correas desgastadas)',
      'Vibración intensa o ruidos en el eje',
      'Pérdida de tracción o potencia'
    ],
    desc: 'Cambio de carbones, rectificado de colector, reemplazo de correas dentadas, bujes y porta-cepillos.',
    marcas: ['Electrolux', 'Liliana', 'Yelmo', 'Ultracomb']
  },
  {
    id: 'centrifugadoras',
    icon: '🌀',
    title: 'Centrifugadoras (Secarropas Centrífugos)',
    shortTitle: 'Centrifugadoras',
    symptoms: [
      'La ropa sigue húmeda después de centrifugar (no levanta RPM)',
      'Hace ruido fuerte, golpea o tiembla fuertemente (tensores vencidos)',
      'El motor no gira, zumba o se frena',
      'Freno atascado (no libera al arrancar o no frena al abrir la tapa)',
      'Pérdida de agua por la base / fuelle de goma roto'
    ],
    desc: 'Reparación de secarropas centrífugos: cambio de rulemanes, bujes, capacitor, tensores de suspensión, cables de freno y fuelles.',
    marcas: ['Koh-i-noor', 'Columbia', 'Drean', 'Peabody', 'Liliana'],
    notaEspecial: 'Reparamos secarropas centrífugos. NO realizamos reparación de lavarropas automáticos ni heladeras.'
  },
  {
    id: 'calefaccion',
    icon: '🔥',
    title: 'Calefacción y Estufas Eléctricas',
    shortTitle: 'Calefacción',
    symptoms: [
      'Caloventor no gira el forzador o no tira aire caliente',
      'Velas halógenas o tubos de cuarzo quemados',
      'Interruptor antivuelco de seguridad descompuesto',
      'Radiador de aceite o convector no calienta o corta solo'
    ],
    desc: 'Reparación de caloventores, estufas halógenas, convectores y radiadores eléctricos.',
    marcas: ['Liliana', 'Atma', 'Peabody', 'Axel', 'Electrolux', 'Magiclick']
  },
  {
    id: 'airfryer',
    icon: '🍟',
    title: 'Freidoras de Aire (Air Fryer)',
    shortTitle: 'Air Fryer',
    symptoms: [
      'No calienta pero enciende el ventilador',
      'El ventilador no gira (comida no dora de forma pareja)',
      'No enciende / panel digital apagado',
      'Falla de sensor de canasto o perillas rotas'
    ],
    desc: 'Recambio de resistencias circulares, forzadores de convección, fusibles térmicos y placas lógicas.',
    marcas: ['Philips', 'Moulinex', 'Atma', 'Peabody', 'Oster', 'Liliana', 'Ultracomb', 'Xiaomi']
  },
  {
    id: 'licuadoras',
    icon: '🥤',
    title: 'Licuadoras',
    shortTitle: 'Licuadoras',
    symptoms: [
      'Cuchillas trabadas o con holgura excesiva',
      'Acople de arrastre barrido (gira en falso)',
      'Motor echa humo o genera chispas',
      'Fuga de líquido por la base de la jarra'
    ],
    desc: 'Reemplazo de coronas y acoples motrices, bujes, cuchillas de acero inoxidable y carbones de motor.',
    marcas: ['Oster', 'Moulinex', 'Philips', 'Atma', 'Braun', 'Liliana', 'Peabody']
  },
  {
    id: 'procesadoras',
    icon: '🥗',
    title: 'Procesadoras de Cocina y Minipimers',
    shortTitle: 'Procesadoras',
    symptoms: [
      'No enciende (sistema de traba de seguridad de tapa no acciona)',
      'Engranajes o poleas internas barridas',
      'Motor recalentado o bloqueado',
      'Juego o rotura en el acople de accesorios'
    ],
    desc: 'Reparación de sistemas de seguridad, sustitución de engranajes internos, embragues y motores.',
    marcas: ['Philips', 'Liliana', 'Moulinex', 'Braun', 'Atma', 'Peabody', 'Kenwood']
  }
];

export const TALLER_POLICIES = {
  direccion: 'Catamarca 3420, Santa Fe Capital, Santa Fe, Argentina',
  whatsapp: '+54 9 342 501-1410',
  horarios: 'Lunes a Viernes 08:30 a 18:00 hs | Sábados 09:00 a 13:00 hs',
  diagnostico: 'Diagnóstico y presupuesto 100% sin cargo en mostrador',
  garantia: '90 días (3 meses) de garantía escrita en repuestos y mano de obra',
  informesSeguros: 'Emisión de informes técnicos oficiales para aseguradoras del hogar',
  limites: {
    reparaCentrifugadoras: true,
    reparaLavarropas: false,
    reparaHeladeras: false,
    nota: 'Saba Multiservice NO realiza reparación ni servicio técnico de lavarropas automáticos ni heladeras.'
  }
};

export const WEB_CATALOG = {
  descripcion: 'Catálogo de venta online disponible en https://www.saba-multiservice.com/#catalogo',
  categorias: [
    {
      id: 'smart-tv',
      nombre: 'Repuestos de Smart TV',
      items: ['Tiras de LED con disipador', 'Placas Main', 'Fuentes', 'T-Con', 'Cables Flex', 'Módulos WiFi']
    },
    {
      id: 'controles',
      nombre: 'Controles Remotos',
      items: ['Controles para Smart TV (todas las marcas con acceso directo)', 'Controles para Aire Acondicionado']
    },
    {
      id: 'microondas',
      nombre: 'Repuestos para Microondas',
      items: ['Magnetrones', 'Placas de mica', 'Platos de vidrio templado', 'Crucetas de arrastre', 'Pintura epoxi']
    },
    {
      id: 'linea-blanca-venta',
      nombre: 'Repuestos para Línea Blanca (Venta de partes)',
      items: ['Bombas de desagote', 'Válvulas de carga', 'Correas', 'Fuelles para lavarropas']
    },
    {
      id: 'pequenos-electro',
      nombre: 'Repuestos para Pequeños Electrodomésticos',
      items: ['Acoples de licuadora', 'Cuchillas', 'Resistencias de hornos', 'Termostatos', 'Capacitores y bujes']
    }
  ]
};
