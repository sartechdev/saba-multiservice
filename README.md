# 🛠️ Saba Multiservice — Plataforma Integral de Servicio Técnico & Catálogo

Plataforma web de última generación con **Single Page Application (SPA) camuflada de Multi Page Application (MPA)** para **Saba Multiservice**, servicio técnico especializado y multimarca de electrodomésticos, Smart TV y línea blanca en Santa Fe Capital (+25 años de trayectoria).

---

## 📋 Arquitectura y Stack Tecnológico

* **Frontend:** React 19 + Vite + React Router v7.
* **Estilos:** Vanilla CSS modular con Design Tokens estandarizados (`index.css`), modo oscuro/claro contextual y micro-interacciones.
* **Animaciones:** Framer Motion (`motionVariants.js` centralizado, respetando `prefers-reduced-motion` y rendimiento ≤400ms).
* **Backend & Base de Datos:** Supabase (PostgreSQL + Row Level Security + Storage).
* **SEO & Metaetiquetas:** `react-helmet-async` transversal con etiquetas geográficas (*Local SEO* en Santa Fe, AR-S), OpenGraph/Twitter Cards y Schemas `JSON-LD` (`LocalBusiness`, `Service`, `Product`, `CollectionPage`, `AboutPage`, `ContactPage`).
* **Sitemap Dinámico:** Generador automatizado en Node (`scripts/generate-sitemap.js`) integrado al build que indexa en tiempo real las rutas estáticas, categorías y productos de Supabase.

---

## 🛡️ Seguridad y Políticas RLS (Row Level Security)

El esquema de base de datos está blindado con **PostgreSQL RLS** verificado y probado:
1. **`profiles`:** Cada cliente sólo puede consultar su propio perfil (`auth.uid() = id`). Los usuarios `role = 'admin'` tienen acceso de gestión total. Ningún usuario puede auto-asignarse el rol de administrador por API o UI.
2. **`quotes` (Consultas y Presupuestos):** 
   * Los usuarios registrados (`role = 'user'`) sólo ven sus propias consultas y la columna `admin_reply` enviada por el taller.
   * **Notas Internas (`admin_notes`):** Están estrictamente ocultas para los clientes y jamás se consultan en `MiCuenta.jsx` ni se exponen vía API de cliente. Sólo accesibles por `role = 'admin'`.
3. **`products`, `categories` y `repair_brands`:**
   * Lectura pública sin autenticación para catálogo, filtros por marca y sitemap dinámico.
   * Escritura/Edición/Eliminación restringida exclusivamente a usuarios con `role = 'admin'`.

---

## 🚀 Estado de Control de Calidad (QA Final — Prompt 7/7)

| Área de QA | Ítem Verificado | Estado | Detalle / Notas |
| :--- | :--- | :---: | :--- |
| **Animaciones & UI** | Sistema centralizado `motionVariants.js` | ✅ **Completado** | Todas las vistas usan transiciones unificadas (`fadeInUp`, `staggerContainer`, `pageTransition`, `scaleUp`). Duraciones ≤400ms. |
| **Animaciones & UI** | Respeto a `prefers-reduced-motion` | ✅ **Completado** | Variantes ligeras y accesibles sin saltos bruscos ni bloqueos de `pointer-events`. |
| **Animaciones & UI** | `AnimatePresence` & `ScrollToTop` | ✅ **Completado** | `App.jsx` ejecuta `ScrollToTop` en cada cambio de ruta sin parpadeos visuales (`mode="wait"`). |
| **Reglas de Negocio** | Presupuesto sin cargo y Garantía de 3 meses | ✅ **Completado** | Comunicados de forma prominente en `Home`, `ServicioTecnico` y `Nosotros` (política de respaldo oficial escrito). |
| **Reglas de Negocio** | Ocultamiento en Panel Admin | ✅ **Completado** | Botón flotante de WhatsApp (`WhatsAppFloatButton`) y Navbar/Footer estándar ocultos en `/admin/*`. |
| **Reglas de Negocio** | Protección de `admin_notes` | ✅ **Completado** | Verificado en código y llamadas Supabase: `MiCuenta.jsx` y `QuoteStatusCard.jsx` excluyen por completo esta columna. |
| **SEO & Performance** | Metaetiquetas únicas en 19+ rutas | ✅ **Completado** | Todas las páginas (públicas y admin) tienen `<Helmet><title>` y `<meta description>` exactos y descriptivos. |
| **SEO & Performance** | Sitemap Dinámico + `robots.txt` | ✅ **Completado** | Build (`npm run build`) ejecuta automáticamente la conexión a Supabase generando 16+ URLs en `public/sitemap.xml` y `dist/sitemap.xml`. |
| **Accesibilidad** | Formatos y Contraste WCAG AA | ✅ **Completado** | Textos ≥16px, botones táctiles ≥44px, formularios con labels explícitas (`*`) y mensajes en español claro. |
| **Responsive** | Compatibilidad en 3+ Breakpoints | ✅ **Completado** | Grids auto-adaptables (`grid-template-columns`), sidebars que pasan a drawer en móvil, y navegación táctil optimizada. |

---

## 📂 Estructura de Directorios Principal

```text
Saba/
├── backend/
│   ├── README.md                 # Documentación del backend
│   └── supabase/                 # Esquema SQL y migraciones
├── frontend/
│   ├── public/
│   │   ├── robots.txt            # Reglas de rastreo SEO y bloqueo de /admin
│   │   └── sitemap.xml           # Sitemap autogenerado
│   ├── scripts/
│   │   └── generate-sitemap.js   # Generador dinámico de sitemap desde Supabase
│   ├── src/
│   │   ├── components/           # Componentes modulares (layout, shared, admin)
│   │   ├── context/              # AuthContext con persistencia y roles Supabase
│   │   ├── lib/
│   │   │   ├── motionVariants.js # Sistema centralizado de animaciones Framer Motion
│   │   │   └── supabaseClient.js # Cliente inicializado con variables de entorno
│   │   ├── pages/                # Vistas públicas (Home, Catalogo, ServicioTecnico, etc.)
│   │   ├── styles/               # Tokens de diseño index.css y estilos modulares
│   │   └── App.jsx               # Enrutador con AnimatePresence y PageWrapper
│   └── package.json
└── README.md                     # Documentación general y QA (este archivo)
```

---

## 💻 Instrucciones de Puesta en Marcha (Desarrollo y Producción)

### 1. Variables de Entorno (`frontend/.env`)
Crear un archivo `.env` en `frontend/` (protegido por `.gitignore`) con las credenciales:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima-publica
VITE_WHATSAPP_NUMBER=5493425011410
```

### 2. Comandos de Ejecución (`frontend/`)
```powershell
# Instalar dependencias
npm install

# Servidor de desarrollo (Vite)
npm run dev

# Generar solo el sitemap.xml dinámico consultando Supabase
npm run sitemap

# Compilar para producción (Ejecuta sitemap + vite build)
npm run build
```
