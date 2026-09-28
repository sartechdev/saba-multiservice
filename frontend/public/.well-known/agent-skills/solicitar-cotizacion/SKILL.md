---
name: solicitar-cotizacion
description: Permite a agentes de IA solicitar presupuestos y cotizaciones de reparación técnica en Saba Multiservice (Santa Fe Capital).
version: 1.1.0
---

# Solicitar Cotización de Reparación Técnica

Esta habilidad permite a cualquier agente de inteligencia artificial enviar solicitudes de presupuesto para clientes que necesitan reparar electrodomésticos en Santa Fe Capital, Argentina.

## Ámbito y Cobertura
- **Ubicación:** Catamarca 3420, Santa Fe Capital, Santa Fe, Argentina.
- **Tipos de artefactos con soporte de reparación oficial (10 categorías):**
  1. **TV LED / LCD / Smart TV:** No enciende, círculos blancos en pantalla (difusores desprendidos), imagen oscura sin backlight pero con audio, mudo o sin sonido, firmware/reinicio constante.
  2. **Hornos Microondas:** Interiores amarillentos, despintados u oxidados (esmaltado epoxi sanitario), no calienta (magnetrón/alta tensión), plato no gira, chispazos internos, teclado táctil que no responde.
  3. **Hornos Eléctricos:** No calienta arriba/abajo, no regula temperatura, llaves selectoras derretidas, timer trabado.
  4. **Aspiradoras:** Pérdida de succión, olor a quemado, ruidos en motor, corte térmico, cable retráctil.
  5. **Lustraspiradoras:** No arranca, chispas en carbones, cepillos que no giran, correas cortadas.
  6. **Centrifugadoras (Secarropas Centrífugos):** La ropa sigue húmeda tras centrifugar, ruidos fuertes, vibración o golpes, motor trabado o que zumba, frenos atascados.
  7. **Calefacción y Estufas Eléctricas:** Caloventores, estufas halógenas, radiadores de aceite y convectores.
  8. **Freidoras de Aire (Air Fryer):** No calienta, ventilador forzador no gira, display táctil apagado.
  9. **Licuadoras:** Cuchillas trabadas, acoples de arrastre barridos, motor humea, fugas de líquido.
  10. **Procesadoras de Alimentos y Minipimers:** Fallas en trabas de seguridad, engranajes desgastados, motor recalentado.
- **ACLARACIÓN CRÍTICA DE LÍMITES:**
  - **SÍ se reparan centrifugadoras / secarropas centrífugos.**
  - **Saba Multiservice NO realiza reparación técnica de lavarropas automáticos ni de heladeras.**
- **Catálogo de Venta:** Repuestos originales y controles remotos disponibles en https://www.saba-multiservice.com/#catalogo.

## Flujo de Ejecución

1. **Recolección de Datos:**
   - Nombre y teléfono del cliente (imprescindible para contacto por WhatsApp).
   - Tipo de equipo, marca y modelo si se conoce.
   - Descripción del síntoma o falla experimentada.

2. **Envío de la Solicitud:**
   - Realizar una llamada HTTP POST a `https://www.saba-multiservice.com/api/quotes` con el payload JSON especificado en `openapi.json`.
   - O alternativamente abrir el enlace de WhatsApp del taller: `https://wa.me/5493425011410?text=Hola%20Saba%20Multiservice,%20deseo%20presupuesto%20para...`

3. **Respuesta al Usuario:**
   - Informar al cliente que su solicitud fue enviada al taller de Saba Multiservice en Catamarca 3420.
   - Brindar los horarios de atención: Lunes a Viernes de 08:30 a 18:00 hs, Sábados de 09:00 a 13:00 hs.
   - Recordar que el diagnóstico en mostrador es **100% sin cargo** y cuenta con 90 días de garantía.
