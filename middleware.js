const MARKDOWN_CONTENT = `# Saba Multiservice - Servicio Técnico Oficial y Repuestos en Santa Fe

> **Saba Multiservice** es el centro de servicio técnico especializado líder en Santa Fe Capital, con más de 25 años de trayectoria en reparación de electrodomésticos, Smart TV y comercialización de repuestos originales multimarca.

- **Ubicación:** Catamarca 3420, Santa Fe Capital (S3000), Santa Fe, Argentina.
- **WhatsApp de Atención Inmediata:** [+54 9 342 501-1410](https://wa.me/5493425011410)
- **Horarios de Atención:**
  - Lunes a Viernes: 08:30 a 18:00 hs (corrido)
  - Sábados: 09:00 a 13:00 hs
- **Garantía:** Garantía escrita en mano de obra y repuestos en todas las reparaciones.

---

## Servicios Técnicos Especializados

### 1. Smart TV y Audio
- Reparación y recambio de tiras de retroiluminación LED (pantallas oscuras con sonido).
- Reparación a nivel componente de fuentes de poder y placas main (equipos que no encienden o quedan en stand-by).
- Reemplazo y configuración de mandos a distancia originales.
- Marcas: Samsung, LG, Philips, TCL, Noblex, Hitachi, RCA, Sony, etc.

### 2. Microondas
- Recambio de magnetrones, placas de mica, fusibles de alta tensión y condensadores.
- Reemplazo de platos giratorios de vidrio y crucetas motrices.
- Reparación de teclados táctiles de membrana y placas de control.
- Marcas: BGH, Philco, Whirlpool, Samsung, Atma, etc.

### 3. Línea Blanca (Lavarropas, Secarropas, Lavavajillas)
- Cambio de bombas de desagote, válvulas de entrada de agua y presostatos.
- Recambio de rodamientos (rulemanes), retenes y crucetas de tambor.
- Reparación y reprogramación de placas electrónicas y selectores.
- Marcas: Drean, Longvie, Patrick, Whirlpool, Electrolux, Aurora, Bosch, etc.

---

## Catálogo de Repuestos y Accesorios
Disponemos de un amplio stock para entrega inmediata en taller o envío:
- **Controles Remotos:** Mandos originales para Smart TV (con acceso directo a Netflix, YouTube, Prime Video) y acondicionadores de aire.
- **Componentes Electrónicos:** Placas madre, fuentes de alimentación, barras LED.
- **Repuestos Mecánicos:** Bloques de puerta para lavarropas, tiradores, mangueras, fuelles y termostatos.

---

## Cómo Solicitar Presupuesto o Asistencia Técnica
1. Visita nuestro taller en **Catamarca 3420, Santa Fe Capital**.
2. Envía un mensaje directo a nuestro WhatsApp: \`+54 9 342 501-1410\` indicando marca, modelo y falla del equipo.
3. Completa el formulario de presupuesto online en nuestra web oficial: [https://www.saba-multiservice.com/#cotizar](https://www.saba-multiservice.com/#cotizar).

---

## Recursos para Agentes y Desarrolladores
- **Catálogo de APIs:** \`/.well-known/api-catalog\`
- **Manifiesto ARD:** \`/.well-known/ai-catalog.json\`
- **MCP Server Card:** \`/.well-known/mcp/server-card.json\`
- **Agent Skills:** \`/.well-known/agent-skills/index.json\`
- **Autenticación:** \`/auth.md\`
`;

export const config = {
  matcher: ['/', '/index.html']
};

export default function middleware(request) {
  const accept = request.headers.get('accept') || '';
  if (accept.includes('text/markdown')) {
    return new Response(MARKDOWN_CONTENT, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'X-Markdown-Tokens': '950',
        'Vary': 'Accept',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=0, must-revalidate'
      }
    });
  }
}
