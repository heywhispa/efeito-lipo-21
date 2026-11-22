// Fast lint tier. Everything here runs without type information, which is
// what keeps it quick enough for a pre-commit hook. The rules that need the
// type checker live in eslint.typed.config.mjs and run on their own script.
//
// Adaptado a este projeto (Next.js 16 + React 19 + TypeScript):
//   - código na raiz: app/, lib/, hooks/, types/, proxy.ts e as funções Deno
//     em supabase/functions/ (não existe src/)
//   - sem camadas formais, então o bloco import-x do modelo foi removido
//   - presets de Next/React não foram ativados (próximo passo opcional)
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

import quality from "./eslint-rules/index.cjs";

const testFiles = [
  "**/*{.,-}{test,spec}.{js,jsx,ts,tsx,mjs,cjs,mts,cts}",
  "**/{__tests__,__mocks__,fixtures,mocks}/**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}",
];

// Pastas reais do app (não há src/). components/ ainda não existe, mas fica
// coberta para quando for criada.
const appCode = [
  "app/**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}",
  "lib/**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}",
  "hooks/**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}",
  "types/**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}",
  "components/**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}",
  "supabase/functions/**/*.{js,ts}",
  "proxy.ts",
];

export default defineConfig([
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        // Arquivos .js/.jsx/.mjs com JSX também precisam ser entendidos.
        ecmaFeatures: { jsx: true },
      },
      // js.configs.recommended turns on no-undef, which knows nothing about
      // the runtime this project targets. Next.js roda no navegador e no
      // Node, então valem os dois conjuntos de globais.
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    // Regras do preset tseslint.configs.strict que já têm violações no código.
    // Ficam em "warn" com a contagem medida; voltam para "error" quando zerar.
    rules: {
      "@typescript-eslint/no-explicit-any": "warn", // baseline 22/11/2026: 12 violações (todas nos webhooks de pagamento, fora da faxina)
      "@typescript-eslint/no-non-null-assertion": "warn", // baseline 22/11/2026: 1 violação
      "@typescript-eslint/no-dynamic-delete": "warn", // baseline 22/11/2026: 1 violação
    },
  },

  // Framework presets. Uncomment only what this project actually uses, and
  // add the matching import at the top of the file. Turning on a preset
  // wholesale is the opposite of what the rest of this config does -- prefer
  // a curated subset per plugin, added as its own files-scoped block below.
  //
  //   nextPlugin.configs["core-web-vitals"],
  //   reactPlugin.configs.flat["jsx-runtime"],
  //   reactHooks.configs.flat.recommended,

  {
    files: appCode,
    plugins: { quality },
    rules: {
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-var": "error",
      "prefer-const": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn", // baseline 22/11/2026: 3 violações (todas em app/efeito-lipo-quiz/_quiz.tsx, arquivo de checkout, fora da faxina)
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // The size and complexity budget is all "warn" on purpose. These
      // numbers are a conversation starter about factoring, not a gate --
      // promote one to "error" once the count for it reaches zero.
      complexity: ["warn", 12], // baseline 22/11/2026: 18 violações
      "max-depth": ["warn", 4], // baseline 22/11/2026: 0 violações
      "max-statements": ["warn", 20], // baseline 22/11/2026: 13 violações
      "max-params": ["warn", 4], // baseline 22/11/2026: 0 violações
      "max-lines-per-function": [
        "warn",
        { max: 150, skipBlankLines: true, skipComments: true },
      ], // baseline 22/11/2026: 4 violações
      "max-nested-callbacks": ["warn", 3], // baseline 22/11/2026: 0 violações
      "quality/max-lines": ["warn", { max: 350 }], // baseline 22/11/2026: 4 violações
      // Módulo de log = lib/log.ts (só repassa para o console); ele tem o
      // bloco "off" mais abaixo. As 9 que sobram são das funções de pagamento
      // (supabase/functions/greenn-webhook e hotmart-webhook, Deno, sem o
      // alias @/), que ficam de fora da faxina.
      "quality/no-direct-console": ["warn", { logger: "o lib/log.ts" }], // baseline 22/11/2026: 9 violações
      // Módulo de dados = lib/supabase.ts (REST do Supabase com a chave
      // service_role, sem SDK). Ele não exporta um "client": exporta as
      // funções abaixo. Apresentação = componentes e páginas .tsx, e hooks/.
      // Rotas de API (app/api/**/route.ts) são .ts e ficam de fora.
      "quality/no-direct-data-access": [
        "warn", // baseline 22/11/2026: 12 violações
        {
          modules: ["@/lib/supabase"],
          bindings: [
            "sbUpsert",
            "sbInsertIgnore",
            "sbInsert",
            "sbRpc",
            "sbRpcAll",
            "sbSelect",
            "sbSelectAll",
          ],
          layers: ["/components/", "/hooks/"],
          extensions: [".tsx"],
        },
      ],
    },
  },
  {
    // O próprio módulo de log é o único lugar que chama o console direto.
    files: ["lib/log.ts"],
    rules: { "quality/no-direct-console": "off" },
  },
  {
    // O código já tem comentários "eslint-disable-line react-hooks/exhaustive-deps"
    // (app/efeito-lipo-quiz/_quiz.tsx). Sem o plugin, o ESLint acusa "regra não
    // encontrada" como erro. Como os presets de React não entram agora, esta
    // regra vazia só registra o nome. Apague este bloco quando instalar o
    // eslint-plugin-react-hooks de verdade. O aviso de "diretiva não usada"
    // fica desligado aqui só porque a regra vazia nunca reporta nada, e o
    // `lint:fix` apagaria esses comentários do código do app.
    files: ["**/*.{jsx,tsx}"],
    linterOptions: { reportUnusedDisableDirectives: "off" },
    plugins: {
      "react-hooks": {
        rules: {
          "exhaustive-deps": { meta: { schema: false }, create: () => ({}) },
        },
      },
    },
  },
  {
    // Funções do Supabase rodam no Deno, não no Node.
    files: ["supabase/functions/**/*.{js,ts}"],
    languageOptions: {
      globals: { Deno: "readonly" },
    },
  },
  {
    // The same file budget for test files, at "warn". Also placed after the
    // "error" block for the same ordering reason. Two glob branches, because
    // a file counts as a test either by suffix or by directory -- and the
    // suffix branch alone misses test-support files that live in __tests__/
    // without being *.test.ts themselves.
    files: testFiles,
    plugins: { quality },
    rules: {
      "quality/max-lines": ["warn", { max: 350, includeTests: true }],
    },
  },
  {
    files: testFiles,
    rules: {
      // These three fire heavily on describe/it nesting and on long arrange
      // sections without pointing at a real problem. complexity, max-depth
      // and max-params stay on for tests -- they were not part of the noise.
      "max-statements": "off",
      "max-lines-per-function": "off",
      "max-nested-callbacks": "off",
    },
  },
  {
    files: ["eslint-rules/**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { module: "readonly", require: "readonly" },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  globalIgnores([
    // Agent harness files, vendored automation and standalone tooling are not
    // the application this config polices.
    ".claude/**",
    ".github/agents/**",
    ".github/hooks/**",
    ".github/skills/**",
    "node_modules/**",
    ".next/**",
    "out/**",
    "dist/**",
    "build/**",
    "coverage/**",
    ".vercel/**",
    "supabase/.temp/**",
    "**/*.tsbuildinfo",
    "next-env.d.ts",
    "package-lock.json",
  ]),
]);
