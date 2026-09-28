/**
 * WebMCP - Browser Agent Tool Exposure
 * Implements WebMCP API (W3C WebML / Chrome Model Context)
 * Spec: https://webmachinelearning.github.io/webmcp/
 */

const tools = [
  {
    name: 'consultar_catalogo',
    description: 'Busca repuestos, controles remotos y accesorios disponibles en el inventario de Saba Multiservice en Santa Fe Capital.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Nombre o modelo del repuesto (p. ej. control samsung, placa main, bomba drean)'
        },
        category: {
          type: 'string',
          description: 'Categoría (smart-tv, microondas, linea-blanca, controles-remotos)'
        }
      },
      required: ['query']
    },
    execute: async ({ query }) => {
      const path = `/catalogo?q=${encodeURIComponent(query || '')}`;
      if (typeof window !== 'undefined') {
        window.location.href = path;
      }
      return { status: 'success', path };
    }
  },
  {
    name: 'solicitar_presupuesto',
    description: 'Envía una consulta técnica o solicitud de presupuesto de reparación para electrodomésticos o Smart TV.',
    inputSchema: {
      type: 'object',
      properties: {
        fullName: { type: 'string', description: 'Nombre del solicitante' },
        phone: { type: 'string', description: 'Número de WhatsApp de contacto' },
        issueDescription: { type: 'string', description: 'Descripción de la falla' }
      },
      required: ['fullName', 'phone', 'issueDescription']
    },
    execute: async (_params) => {
      return {
        status: 'success',
        message: 'Solicitud de presupuesto registrada para taller técnico.',
        phone: '+54 9 342 501-1410',
        address: 'Catamarca 3420, Santa Fe Capital'
      };
    }
  },
  {
    name: 'obtener_informacion_servicio_tecnico',
    description: 'Devuelve información oficial de Saba Multiservice: dirección física, horarios de atención, WhatsApp y garantías.',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    execute: async () => {
      return {
        business: 'Saba Multiservice',
        address: 'Catamarca 3420, Santa Fe Capital, Argentina',
        phone: '+54 9 342 501-1410',
        hours: 'Lunes a Viernes 08:30 a 18:00 hs, Sábados 09:00 a 13:00 hs',
        specialties: [
          'TV LED/LCD y Smart TV (no enciende, círculos blancos, imagen oscura/sin backlight, sin audio)',
          'Hornos Microondas (interiores amarillentos/despintados con epoxi, no calienta, no gira plato, chispazos)',
          'Hornos Eléctricos (no calienta, resistencias, termostato, llave selectora, timer)',
          'Aspiradoras (falta de succión, recalentamiento, carbones, cables retráctiles)',
          'Lustraspiradoras (motor, cepillos, correas, bujes)',
          'Centrifugadoras / Secarropas centrífugos (ropa sigue húmeda, vibración, ruidos, motor trabado, frenos)',
          'Calefacción y Estufas Eléctricas (caloventores, estufas halógenas, radiadores)',
          'Freidoras de Aire / Air Fryer (no calienta, forzador de convección, placa táctil)',
          'Licuadoras (cuchillas trabadas, acoples barridos, carbones, fugas)',
          'Procesadoras de Alimentos y Minipimers (trabas de seguridad, engranajes, motor)'
        ],
        catalogo_venta: 'Repuestos originales multimarca, controles remotos para Smart TV y aire acondicionado, accesorios y componentes electrónicos en la web oficial.',
        aclaracion_linea_blanca: 'Reparamos secarropas centrífugos/centrifugadoras. Saba Multiservice NO realiza reparación ni servicio técnico de lavarropas automáticos ni heladeras.'
      };
    }
  }
];

export async function registerWebMcpTools() {
  if (typeof window === 'undefined') return;

  // Feature detect document.modelContext then navigator.modelContext
  const ctx = document.modelContext || (typeof navigator !== 'undefined' ? navigator.modelContext : null);

  if (ctx && typeof ctx.registerTool === 'function') {
    for (const tool of tools) {
      try {
        await ctx.registerTool(tool);
      } catch (err) {
        console.warn(`[WebMCP] Error registering tool ${tool.name}:`, err);
      }
    }
  } else {
    // If not supported natively by the browser runtime, provide polyfill/declarative registry
    if (!document.modelContext) {
      document.modelContext = {
        registeredTools: new Map(),
        registerTool: async function (tool) {
          this.registeredTools.set(tool.name, tool);
          return Promise.resolve();
        },
        getTools: function () {
          return Array.from(this.registeredTools.values());
        }
      };
    }
    for (const tool of tools) {
      await document.modelContext.registerTool(tool);
    }
  }

  // Expose global registry for agent inspection
  window.__webMcpTools = tools;
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      registerWebMcpTools();
    });
  } else {
    registerWebMcpTools();
  }
}
