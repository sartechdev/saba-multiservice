---
name: solicitar-cotizacion
description: Permite a agentes de IA solicitar presupuestos y cotizaciones de reparación técnica en Saba Multiservice (Santa Fe Capital).
version: 1.0.0
---

# Solicitar Cotización de Reparación Técnica

Esta habilidad permite a cualquier agente de inteligencia artificial enviar solicitudes de presupuesto para clientes que necesitan reparar electrodomésticos en Santa Fe Capital, Argentina.

## Ámbito y Cobertura
- **Ubicación:** Catamarca 3420, Santa Fe Capital, Santa Fe, Argentina.
- **Tipos de artefactos soportados:** Smart TV (LED, OLED, QLED), Hornos Microondas, Hornos Eléctricos, Audio, Calefacción eléctrica y Ventilación.
- **ACLARACIÓN CRÍTICA:** Saba Multiservice **NO realiza reparación de línea blanca** (no repara lavarropas, heladeras, secarropas ni lavavajillas).
- **Marcas soportadas:** Samsung, LG, Philips, TCL, Noblex, Philco, BGH, Ultracomb, Atma, Sony, Hitachi, RCA y multimarca.

## Flujo de Ejecución

1. **Recolección de Datos:**
   - Nombre y teléfono del cliente (imprescindible para WhatsApp).
   - Tipo de equipo, marca y modelo si se conoce.
   - Descripción del síntoma o falla experimentada.

2. **Envío de la Solicitud:**
   - Realizar una llamada HTTP POST a `https://www.saba-multiservice.com/api/quotes` con el payload JSON especificado en `openapi.json`.
   - O alternativamente abrir el enlace de WhatsApp del taller: `https://wa.me/5493425011410?text=Hola%20Saba%20Multiservice,%20deseo%20presupuesto%20para...`

3. **Respuesta al Usuario:**
   - Informar al cliente que su solicitud fue enviada al taller de Saba Multiservice.
   - Brindar los horarios de atención: Lunes a Viernes de 08:30 a 18:00 hs, Sábados de 09:00 a 13:00 hs.
