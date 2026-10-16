// Declara NODE_ENV para permitir `process.env.NODE_ENV` com ponto: o Vite só substitui essa forma
// exata no build do navegador (`process.env['NODE_ENV']` quebraria no cliente).
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: string | undefined;
  }
}
