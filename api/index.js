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
    content = `# Saba Multiservice - Servicio Técnico Oficial y Repuestos en Santa Fe

> Centro de servicio técnico especializado en reparación de Smart TV, microondas, hornos eléctricos y pequeños electrodomésticos en Santa Fe Capital (+25 años de trayectoria). Venta de repuestos originales y controles remotos. (Aclaración: NO se repara línea blanca).

- **Ubicación:** Catamarca 3420, Santa Fe Capital, Argentina.
- **WhatsApp:** +54 9 342 501-1410
- **Horarios:** Lunes a Viernes 08:30 a 18:00 hs, Sábados 09:00 a 13:00 hs.
- **API Catalog:** /.well-known/api-catalog
- **MCP Server Card:** /.well-known/mcp/server-card.json
- **Agent Skills:** /.well-known/agent-skills/index.json
- **Auth:** /auth.md
`;
  }

  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('x-markdown-tokens', '950');
  res.setHeader('Vary', 'Accept');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');

  return res.status(200).send(content);
}
