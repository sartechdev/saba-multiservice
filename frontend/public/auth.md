# Saba Multiservice auth.md

Protocolo y directrices de autenticación y registro para Agentes Autónomos de Inteligencia Artificial en **Saba Multiservice** (Santa Fe Capital, Argentina).

## Información del Servicio
- **Emisor / Issuer:** `https://www.saba-multiservice.com`
- **Recurso Protegido (PRM):** `https://www.saba-multiservice.com`
- **Metadatos OAuth:** `https://www.saba-multiservice.com/.well-known/oauth-authorization-server`
- **Metadatos de Recurso (RFC 9728):** `https://www.saba-multiservice.com/.well-known/oauth-protected-resource`
- **Endpoint de Registro de Agentes:** `https://www.saba-multiservice.com/auth/agent-register`

## Audiencia Objetivo
Este estándar permite a agentes de IA interactuar de manera segura y programática con los servicios de catálogo de repuestos y recepción de solicitudes de servicio técnico.

## Métodos de Identidad y Registro Soportados

1. **Anonymous / Client Credentials (Recomendado para lectura de catálogo):**
   - Agentes no autenticados o con credenciales anónimas pueden consultar el catálogo de repuestos y verificar disponibilidad sin requerir autenticación previa.
   - Endpoint de obtención de token: `POST /auth/token` con `grant_type=client_credentials`.

2. **Verified Email / Assertion (Para envío de presupuestos por clientes):**
   - Para registrar presupuestos a nombre de un usuario o cliente, el agente debe proveer un correo verificado o número de WhatsApp válido para contactar al cliente.
   - Token de acceso enviado mediante cabecera HTTP:
     ```http
     Authorization: Bearer <access_token>
     ```

3. **ID-JAG (Identity Assertion):**
   - Soportado mediante tipo de aserción `urn:ietf:params:oauth:token-type:id-jag`.

## Alcances (Scopes) Disponibles
- `read:products`: Consulta pública del stock de repuestos y accesorios.
- `read:quotes`: Consulta del estado de reparación técnica de un equipo.
- `write:quotes`: Creación de una nueva solicitud de presupuesto en taller.

## Contacto Humano y Taller
- **Dirección:** Catamarca 3420, Santa Fe Capital, Argentina.
- **WhatsApp:** +54 9 342 501-1410
- **Email:** contacto@saba-multiservice.com
