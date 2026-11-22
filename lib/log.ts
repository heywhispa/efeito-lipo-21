// Módulo de log do projeto. Só repassa para o console, com o mesmo método e os
// mesmos argumentos, então a saída no navegador e nos logs da Vercel não muda.
// Isomórfico de propósito (sem 'server-only', sem módulos do Node): pode ser
// importado por páginas, componentes de cliente, rotas e pelo proxy.ts (edge).
// O console é lido na hora de cada chamada, não guardado na importação, para
// respeitar quem troca o console depois (ex.: o Next em modo dev).
export const log = {
  log: (...args: unknown[]) => console.log(...args),
  info: (...args: unknown[]) => console.info(...args),
  warn: (...args: unknown[]) => console.warn(...args),
  error: (...args: unknown[]) => console.error(...args),
  debug: (...args: unknown[]) => console.debug(...args),
}
