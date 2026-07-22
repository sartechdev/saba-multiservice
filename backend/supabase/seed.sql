-- Seed data for categories
INSERT INTO public.categories (id, name, slug, type) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Electrodomésticos Nuevos', 'electrodomesticos-nuevos', 'electrodomesticos_nuevos'),
  ('22222222-2222-2222-2222-222222222222', 'Repuestos y Accesorios', 'repuestos-accesorios', 'repuestos_accesorios'),
  ('33333333-3333-3333-3333-333333333333', 'TV, Celular y Computación', 'tv-celular-computacion', 'tv_celular_pc')
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  type = EXCLUDED.type;

-- Seed data for products
INSERT INTO public.products (id, category_id, name, description, price, price_on_request, images, available) VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    'Smart TV 43" Full HD LG',
    'Televisor Smart TV LG con pantalla Full HD, inteligencia artificial ThinQ AI, HDR activo y sistema operativo webOS.',
    289999.00,
    false,
    ARRAY['/placeholder-tv.webp'],
    true
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'Control Remoto Universal Smart TV',
    'Control remoto universal compatible con todas las marcas principales de televisores (Samsung, LG, Sony, Philips, etc.). Listo para usar.',
    7500.00,
    false,
    ARRAY['/placeholder-remote.webp'],
    true
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    'Soporte Móvil de Pared para TV 32" a 55"',
    'Soporte reforzado articulado con doble brazo, inclinable y giratorio. Soporta hasta 35kg. Incluye kit de instalación completo.',
    12500.00,
    false,
    ARRAY['/placeholder-bracket.webp'],
    true
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'Horno Eléctrico Ultracomb 40L',
    'Horno de mesa de 40 litros de capacidad con convector, timer, control de temperatura hasta 250 grados y tres funciones de cocción.',
    null,
    true,
    ARRAY['/placeholder-oven.webp'],
    true
  ),
  (
    'a5555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'Microondas Digital BGH Quick Chef 20L',
    'Microondas digital con plato giratorio, 5 niveles de potencia, programas automáticos de cocción y descongelado por peso.',
    185000.00,
    false,
    ARRAY['/placeholder-microwave.webp'],
    true
  ),
  (
    'a6666666-6666-6666-6666-666666666666',
    '22222222-2222-2222-2222-222222222222',
    'Placa Main TV LG 43LJ5500',
    'Placa principal de repuesto para Smart TV LG de 43 pulgadas. Probada con garantía técnica en nuestro taller.',
    null,
    true,
    ARRAY['/placeholder-mainboard.webp'],
    true
  ),
  (
    'a7777777-7777-7777-7777-777777777777',
    '11111111-1111-1111-1111-111111111111',
    'Ventilador de Pared Liliana 20"',
    'Ventilador de pared de 3 velocidades con oscilación lateral, rejilla metálica y control a cordón. Potente motor de 90W.',
    85000.00,
    false,
    ARRAY['/placeholder-fan.webp'],
    false
  )
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  price_on_request = EXCLUDED.price_on_request,
  images = EXCLUDED.images,
  available = EXCLUDED.available;

-- Seed data for repair_brands
INSERT INTO public.repair_brands (id, name, logo_url, display_order) VALUES
  ('b1111111-1111-1111-1111-111111111111', 'Samsung', '/logos/samsung.svg', 1),
  ('b2222222-2222-2222-2222-222222222222', 'LG', '/logos/lg.svg', 2),
  ('b3333333-3333-3333-3333-333333333333', 'Whirlpool', '/logos/whirlpool.svg', 3),
  ('b4444444-4444-4444-4444-444444444444', 'Philips', '/logos/philips.svg', 4),
  ('b5555555-5555-5555-5555-555555555555', 'Drean', '/logos/drean.svg', 5),
  ('b6666666-6666-6666-6666-666666666666', 'Peabody', '/logos/peabody.svg', 6)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  logo_url = EXCLUDED.logo_url,
  display_order = EXCLUDED.display_order;
