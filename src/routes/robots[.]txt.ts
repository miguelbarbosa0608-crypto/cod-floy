// /robots.txt gerado pelo servidor, com o endereço do sitemap baseado em SITE_URL (src/data/site.ts).
import { createFileRoute } from "@tanstack/react-router";
import { urlAbsoluta } from "@/data/site";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(`User-agent: *\nAllow: /\n\nSitemap: ${urlAbsoluta("/sitemap.xml")}\n`, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
