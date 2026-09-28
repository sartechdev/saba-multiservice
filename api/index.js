import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  let content = '';

  const possiblePaths = [
    path.join(process.cwd(), 'frontend', 'dist', 'index.md'),
    path.join(process.cwd(), 'frontend', 'public', 'index.md'),
    path.join(process.cwd(), 'public', 'index.md'),
    path.join(process.cwd(), 'index.md')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        content = fs.readFileSync(p, 'utf8');
        break;
      } catch {
        // continue
      }
    }
  }

  if (!content) {
    content = `# Saba Multiservice - Servicio Técnico Oficial y Catálogo de Repuestos en Santa Fe

> Centro de servicio técnico especializado en reparación de Smart TV, microondas, hornos eléctricos, aspiradoras, lustraspiradoras, centrifugadoras y electrodomésticos en Santa Fe Capital (+25 años de trayectoria). Venta del catálogo oficial de repuestos originales y controles remotos. (Aclaración: SÍ se reparan centrifugadoras/secarropas centrífugos, pero NO se repara línea blanca mayor: lavarropas automáticos ni heladeras).

- **Ubicación:** Catamarca 3420, Santa Fe Capital, Argentina.
- **WhatsApp:** +54 9 342 501-1410
- **Horarios:** Lunes a Viernes 08:30 a 18:00 hs, Sábados 09:00 a 13:00 hs.
- **API Catalog:** /.well-known/api-catalog
- **MCP Server Card:** /.well-known/mcp/server-card.json
- **Agent Skills:** /.well-known/agent-skills/index.json
- **Documento Maestro:** /SERVICIOS_Y_CATALOGO.md
- **Auth:** /auth.md
`;
  }

  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('x-markdown-tokens', '1250');
  res.setHeader('Vary', 'Accept');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');

  return res.status(200).send(content);
}
