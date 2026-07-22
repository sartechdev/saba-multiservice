import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper para leer variables de entorno desde .env local si no están en process.env
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    lines.forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

async function generateSitemap() {
  console.log('🔄 Generando sitemap.xml SEO dinámico...');
  loadEnv();

  const baseUrl = 'https://sabamultiservice.com.ar';
  const today = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/catalogo', priority: '0.9', changefreq: 'daily' },
    { loc: '/servicio-tecnico', priority: '0.9', changefreq: 'weekly' },
    { loc: '/nosotros', priority: '0.8', changefreq: 'monthly' },
    { loc: '/contacto', priority: '0.8', changefreq: 'monthly' },
    { loc: '/terminos-y-condiciones', priority: '0.5', changefreq: 'yearly' },
    { loc: '/politicas-de-privacidad', priority: '0.5', changefreq: 'yearly' },
  ];

  let dynamicProductUrls = [];
  let dynamicCategoryUrls = [];

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Consultar productos activos
      const { data: products, error: prodErr } = await supabase
        .from('products')
        .select('slug, updated_at')
        .eq('available', true);

      if (!prodErr && products) {
        dynamicProductUrls = products.map(p => ({
          loc: `/producto/${p.slug}`,
          priority: '0.8',
          changefreq: 'weekly',
          lastmod: p.updated_at ? p.updated_at.split('T')[0] : today
        }));
        console.log(`✅ ${dynamicProductUrls.length} productos dinámicos incorporados al sitemap.`);
      }

      // Consultar categorías
      const { data: categories, error: catErr } = await supabase
        .from('categories')
        .select('slug');

      if (!catErr && categories) {
        dynamicCategoryUrls = categories.map(c => ({
          loc: `/catalogo?categoria=${c.slug}`,
          priority: '0.7',
          changefreq: 'weekly',
          lastmod: today
        }));
        console.log(`✅ ${dynamicCategoryUrls.length} categorías dinámicas incorporadas al sitemap.`);
      }
    } catch (err) {
      console.warn('⚠️ No se pudo conectar a Supabase durante la compilación del sitemap, se usarán solo URLs estáticas:', err.message);
    }
  } else {
    console.warn('⚠️ Variables de Supabase no encontradas, generando sitemap estático.');
  }

  const allUrls = [...staticUrls, ...dynamicCategoryUrls, ...dynamicProductUrls];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allUrls.map(u => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    <lastmod>${u.lastmod || today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

  const publicPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(publicPath, xmlContent, 'utf-8');
  console.log(`🚀 sitemap.xml guardado en public/sitemap.xml (${allUrls.length} URLs totales)`);

  const distDir = path.resolve(__dirname, '../dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), xmlContent, 'utf-8');
    console.log(`🚀 sitemap.xml copiado en dist/sitemap.xml`);
  }
}

generateSitemap();
