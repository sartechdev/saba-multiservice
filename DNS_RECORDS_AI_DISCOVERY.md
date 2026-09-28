# Registros DNS para Descubrimiento Agéntico (DNS-AID y ARD)

Para completar el 100% de la auditoría de agentes de IA en **isitagentready.com** (que prueba la resolución mediante DoH - DNS-over-HTTPS), debes agregar estos registros en tu proveedor de DNS (Cloudflare, DonWeb, Nic.ar, Vercel, etc.):

---

## 1. Registros DNS-AID (RFC 9460 / Draft Mozley-Williams DNS-AID)

Agrega en tu zona DNS los siguientes registros bajo el subdominio `_agents`:

### Formato Zona BIND / Exportable:
```dns
; Registro Principal DNS-AID para agentes A2A
_a2a._agents.saba-multiservice.com. 3600 IN HTTPS 1 www.saba-multiservice.com. alpn="h2,h3" port=443

; Registro de Índice para agentes
_index._agents.saba-multiservice.com. 3600 IN HTTPS 1 www.saba-multiservice.com. alpn="h2,h3" port=443

; Registro ARD (Agent Resource Discovery) para catálogo de recursos
_catalog._agents.saba-multiservice.com. 3600 IN TXT "url=https://www.saba-multiservice.com/.well-known/ai-catalog.json"
```

---

## 2. Cómo cargarlos si usas Cloudflare Dashboard:

1. Ve a tu panel de **Cloudflare** -> Selecciona tu dominio `saba-multiservice.com` -> **DNS** -> **Records**.
2. **Registro 1 (HTTPS):**
   - **Type:** `HTTPS`
   - **Name:** `_a2a._agents`
   - **Priority:** `1`
   - **Target:** `www.saba-multiservice.com`
   - **Value / Parameters:** `alpn="h2,h3" port=443`
3. **Registro 2 (HTTPS):**
   - **Type:** `HTTPS`
   - **Name:** `_index._agents`
   - **Priority:** `1`
   - **Target:** `www.saba-multiservice.com`
   - **Value / Parameters:** `alpn="h2,h3" port=443`
4. **Registro 3 (TXT):**
   - **Type:** `TXT`
   - **Name:** `_catalog._agents`
   - **Content:** `url=https://www.saba-multiservice.com/.well-known/ai-catalog.json`
5. **Activar DNSSEC:**
   - En Cloudflare -> **DNS** -> **Settings** -> Activar **DNSSEC** (con un clic). Cloudflare te dará los registros DS para colocar en nic.ar si tu dominio es .com/.ar.

---

## 3. Cloudflare 1-Click "Markdown for Agents" (Opcional):
- Si tu tráfico pasa por Cloudflare, puedes ir a **AI Crawl Control** o **Rules** y activar con 1 clic **Markdown for Agents**, aunque ya quedó configurado y soportado nativamente en `vercel.json` con `Accept: text/markdown` apuntando a `/index.md`.
