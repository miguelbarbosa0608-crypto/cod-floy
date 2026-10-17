// /sitemap.xml gerado pelo servidor a partir de SITE_URL (src/data/site.ts).
// O site tem uma página só; se novas páginas forem criadas, adicione os caminhos em PAGINAS.
import { createFileRoute } from "@tanstack/react-router";
import { urlAbsoluta } from "@/data/site";

const PAGINAS = [{ caminho: "/", prioridade: "1.0", frequencia: "monthly" }];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const urls = PAGINAS.map(
          (p) =>
            `  <url>\n    <loc>${urlAbsoluta(p.caminho)}</loc>\n    <changefreq>${p.frequencia}</changefreq>\n    <priority>${p.prioridade}</priority>\n  </url>`,
        ).join("\n");
        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
          {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=3600",
            },
          },
        );
      },
    },
  },
});
