# CLAUDE.md — Memória do projeto convite-aniversario

Este arquivo descreve o projeto, as decisões tomadas e as convenções adotadas para que qualquer sessão futura possa retomar o trabalho sem perda de contexto.

---

## O que é o projeto

App web de convite interativo com RSVP. Os convidados recebem um link, confirmam ou recusam presença, e o organizador acompanha tudo em um painel protegido em `/admin`.

---

## Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 (sintaxe `@theme { --color-* }` — NÃO usar `tailwind.config.js`)
- React Router v7 (BrowserRouter)
- Supabase (PostgreSQL + Auth + PostgREST + RLS)
- Vercel (deploy + SPA rewrites via `vercel.json`)
- Vitest + React Testing Library (testes unitários e de componente)

---

## Arquivo central de configuração

`src/config/festa.ts` é o único arquivo que muda entre eventos. Contém nome, idade, data, horário, local, link do mapa, mensagem do convite e observações.

---

## Banco de dados

Duas tabelas criadas pelo `supabase/schema.sql`:

- **`confirmacoes`**: respostas individuais (nome, tem_acompanhante, nome_acompanhante, confirmado)
- **`grupos`**: convites de família com slug único, array de membros e flag confirmado

RLS configurada:
- `anon` pode `INSERT` em confirmacoes e `UPDATE` de confirmado em grupos
- `authenticated` (admin logado) pode `SELECT`, `DELETE`, criar grupos
- Nenhuma deleção em massa pela API pública

---

## Rotas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | ConviteFlow | Fluxo individual: Landing → RSVPForm/DeclineForm → resultado |
| `/admin` | AdminRoute | Login (se não autenticado) ou AdminDashboard |
| `/g/:slug` | GrupoConvite | Convite de grupo/família com confirmação em um clique |

`vercel.json` faz rewrite de tudo para `/` (SPA routing).

---

## Componentes e utilitários importantes

### `src/components/BoomScreen.tsx`
Animação de explosão compartilhada. Exporta `default BoomScreen` e `DUR_BOOM = 900` (ms). Usada em `InviteReveal` e `GrupoConvite`.

### `src/utils/slug.ts` — `gerarSlug(nome)`
Normaliza NFD → remove diacríticos → lowercase → hífens. Usada no AdminDashboard ao criar grupos.

### `src/utils/membros.ts` — `listarMembros(membros[])`
Formata array como "A, B e C". Usada em GrupoConvite.

### `src/lib/supabase.ts`
Se as variáveis `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` estiverem ausentes, exporta um `mockClient` para rodar o app em modo demo sem Supabase.

---

## Paleta de cores (Tailwind CSS v4)

Definida via `@theme` no CSS global (NÃO em tailwind.config.js):

| Token | Cor |
|-------|-----|
| `noite` | fundo escuro principal |
| `noite-2` | fundo dos cards |
| `creme` | texto principal |
| `ouro` | destaques amarelos |
| `turquesa` | azul-esverdeado de destaque |
| `fucsia` | rosa/magenta de ação |

---

## Animações

Keyframes definidos inline no `<head>` do `index.html`:
- `boomFlash`, `boomRing`, `boomRing2`, `boomStar`, `boomEmoji` — usados em BoomScreen
- `balloonRise` — balões subindo no fundo (PartyDecor)
- `pop` — entrada dos cards (`animate-[pop_0.5s_ease-out]`)

Balões usam `animationFillMode: 'both'` + delays negativos para aparecerem pré-animados.

---

## Decisões de CSS que devem ser mantidas

### Print (AdminDashboard)
```css
@media print {
  body * { visibility: hidden; }
  #print-area, #print-area * { visibility: visible; }
}
```
**NÃO usar `display: none` em `body > *`** — isso esconde o `#root` e o React não renderiza nada na impressão. A abordagem `visibility: hidden` mantém o DOM intacto.

### Listas de impressão
`imprimirListaConvidados()` e `imprimirListaGrupos()` abrem uma nova janela com HTML formatado via `window.open()`. Isso evita problemas com CSS de impressão do React.

---

## Convenções de código

- Componentes internos de aba/seção declarados como `function` nomeadas no mesmo arquivo (ex: `AbaConvidados`, `AbaGrupos`, `Resumo`, `Modal`, `BotaoAba`)
- Estado de confirmação de exclusão: `confirmarExcluir: string | null` — guarda o `id` a excluir; `null` = modal fechado
- Slug gerado a partir do `nome_grupo` no momento do `INSERT`; único no banco
- CSV exportado com BOM (`'﻿'`) para compatibilidade com Excel
- Grupos exibem membros no título da página de convite (não o nome do grupo)

---

## Testes

Framework: **Vitest + @testing-library/react + jsdom**

Configuração em `vite.config.ts` (campo `test`) e setup em `src/test/setup.ts`.

```bash
npm test              # roda uma vez
npm run test:watch    # modo watch
npm run test:coverage # cobertura
```

Arquivos de teste ficam junto ao arquivo testado ou em `src/pages/*.test.tsx`.  
Mocks de Supabase são feitos com `vi.mock('../lib/supabase', () => ({ ... }))`.

---

## Variáveis de ambiente necessárias

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

Configuradas na Vercel em **Project Settings → Environment Variables**.  
Localmente: copiar `.env.example` para `.env`.

---

## Histórico de decisões relevantes

| Decisão | Motivo |
|---------|--------|
| Mock client em supabase.ts | Evitar tela em branco quando .env não está configurado |
| `visibility: hidden` no print CSS | `display: none` quebrava o React root |
| `window.open()` para listas de impressão | CSS de impressão do React era conflitante |
| BoomScreen extraída como componente | Reutilizada em InviteReveal e GrupoConvite |
| Tela de grupo confirmado em âmbar | Diferencia visualmente do azul escuro padrão |
| Slug gerado via NFD + regex | Suporta nomes com acentos portugueses |
| Modal customizado em vez de `confirm()` | `confirm()` nativo não segue o tema visual do app |
| `htmlFor` nos labels do AdminLogin | Necessário para acessibilidade e para `getByLabelText` nos testes |
