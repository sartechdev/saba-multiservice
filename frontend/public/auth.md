---
agent_auth:
  skill: "https://www.saba-multiservice.com/auth.md"
  register_uri: "https://www.saba-multiservice.com/auth/agent-register"
  identity_endpoint: "https://www.saba-multiservice.com/agent/identity"
  claim_endpoint: "https://www.saba-multiservice.com/agent/identity/claim"
  claim_uri: "https://www.saba-multiservice.com/auth/claim"
  events_endpoint: "https://www.saba-multiservice.com/agent/event/notify"
  identity_types_supported:
    - anonymous
    - identity_assertion
    - service_auth
---

# auth.md

You are an agent. This service supports **agentic registration**: discover → register → (claim if needed) → exchange for an access_token → call API.

- **Service Name:** Saba Multiservice
- **Resource Server (PRM):** `https://www.saba-multiservice.com/.well-known/oauth-protected-resource`
- **Authorization Server:** `https://www.saba-multiservice.com/.well-known/oauth-authorization-server`
- **Identity Endpoint:** `https://www.saba-multiservice.com/agent/identity`
- **Registration URI:** `https://www.saba-multiservice.com/auth/agent-register`
- **Token Endpoint:** `https://www.saba-multiservice.com/auth/token`

## Step 1 — Discovery

Fetch the Protected Resource Metadata:
```http
GET /.well-known/oauth-protected-resource HTTP/1.1
Host: www.saba-multiservice.com
```

Fetch the Authorization Server metadata:
```http
GET /.well-known/oauth-authorization-server HTTP/1.1
Host: www.saba-multiservice.com
```

## Step 2 — Identity & Registration Methods

1. **Anonymous / Client Credentials (Public Catalog Read):**
   - No user identity required for catalog queries.
   - Endpoint: `POST /auth/token` with `grant_type=client_credentials`.

2. **Verified Email / Assertion (Quote Requests on behalf of clients):**
   - Provide client email or verified WhatsApp contact (`+54 9 342 501-1410`).
   - Assertion types: `urn:ietf:params:oauth:token-type:id-jag` and `verified_email`.

## Scopes Supported
- `read:products`: Consulta de repuestos, precios y disponibilidad en Santa Fe.
- `read:quotes`: Seguimiento de órdenes de reparación y estado de servicio técnico.
- `write:quotes`: Creación de presupuestos y solicitudes de reparación técnica.

## Contacto & Taller Físico
- **Ubicación:** Catamarca 3420, Santa Fe Capital, Argentina.
- **WhatsApp:** +54 9 342 501-1410
- **Email:** contacto@saba-multiservice.com
