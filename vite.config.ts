// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     VITE_* env injection, @ path alias, React/TanStack dedupe, error logger plugins, and
//     sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
//
// Deploy: Netlify. O plugin oficial @netlify/vite-plugin-tanstack-start gera a saída do site
// (dist/client) e a função de servidor (SSR + server functions, ex.: o formulário de contato).
// Por isso o Nitro do pacote do Lovable (que geraria um build para Cloudflare) fica desligado.
// Configuração de build da Netlify em netlify.toml.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import netlify from "@netlify/vite-plugin-tanstack-start";

export default defineConfig({
  nitro: false,
  plugins: [netlify()],
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  vite: {
    // Só no modo de desenvolvimento: otimiza estas dependências logo no início, numa passada só.
    // Sem isso o Vite as descobre depois, reotimiza duas vezes em paralelo e, no Windows, a troca
    // da pasta de cache falha (EPERM), deixando a página sem carregar o JavaScript.
    optimizeDeps: {
      include: [
        "@tanstack/router-core",
        "@tanstack/router-core/isServer",
        "@tanstack/router-core/ssr/client",
        "seroval",
      ],
    },
  },
});
