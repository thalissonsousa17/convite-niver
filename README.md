# Convite de Aniversário 🎉

App web de convite interativo com confirmação de presença (RSVP), painel administrativo e sistema de convites por grupos/famílias. Personalizável para qualquer evento — basta editar um único arquivo de configuração.

---

## Funcionalidades

### Para os convidados
- Convite animado com balões e serpentinas no fundo
- Botão **"Sim, vou!"** → formulário de nome + acompanhante → tela final com explosão e confete
- Botão **"Não vou poder"** → formulário de registro + tela de agradecimento
- **Convite de grupo/família** via link único (`/g/:slug`): um clique confirma toda a família

### Para o organizador (`/admin`)
- Login protegido com e-mail e senha (Supabase Auth)
- Campo senha com botão para mostrar/ocultar
- **Aba Convidados:** lista de todos, contadores (confirmados / total de pessoas / recusados), exportar CSV, imprimir lista com linhas de assinatura, excluir com modal de confirmação
- **Aba Grupos/Famílias:** criar grupos com nome + membros, copiar link compartilhável, exportar CSV de grupos, imprimir lista por grupo com linhas de assinatura, excluir com modal, botão Atualizar

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + TypeScript |
| Bundler | Vite 8 |
| Estilo | Tailwind CSS v4 (`@theme` + CSS custom properties) |
| Roteamento | React Router v7 |
| Backend/DB | Supabase (PostgreSQL + Auth + PostgREST) |
| Deploy | Vercel (SPA com `vercel.json` rewrites) |
| Testes | Vitest + React Testing Library |

---

## Estrutura do projeto

```
src/
  config/
    festa.ts            ← dados da festa (único arquivo a editar por evento)
  lib/
    supabase.ts         ← cliente Supabase + tipos + mock para modo demo
  hooks/
    useAuth.ts          ← gerencia sessão de login do admin
  utils/
    slug.ts             ← gerarSlug() — normaliza nome em URL amigável
    membros.ts          ← listarMembros() — formata lista com "e" no final
  components/
    Card.tsx            ← container visual principal
    PartyDecor.tsx      ← balões e serpentinas animados no fundo
    ConfettiBurst.tsx   ← explosão de confete (canvas-confetti)
    BoomScreen.tsx      ← animação de explosão compartilhada
  pages/
    Landing.tsx         ← tela inicial: Sim / Não
    ConviteFlow.tsx     ← orquestra o fluxo individual do convidado
    RSVPForm.tsx        ← formulário de quem vai (nome + acompanhante)
    InviteReveal.tsx    ← convite final com confete
    DeclineForm.tsx     ← formulário de quem não vai
    Decline.tsx         ← tela de agradecimento a quem não vai
    GrupoConvite.tsx    ← convite de grupo via /g/:slug
    AdminLogin.tsx      ← login do organizador
    AdminDashboard.tsx  ← painel admin (convidados + grupos)
  test/
    setup.ts            ← configuração global dos testes (jest-dom)
supabase/
  schema.sql            ← script SQL completo (tabelas + RLS)
vercel.json             ← rewrite para SPA routing
```

---

## Configuração da festa

Abra `src/config/festa.ts` e preencha:

```typescript
export const festa = {
  aniversariante: 'Maria',
  idade: '30',
  data: 'Sábado, 15 de março de 2026',
  horario: '14h00',
  local: 'Rua das Palmeiras, 200 — Jardim Primavera',
  linkLocal: 'https://maps.google.com/?q=Rua+das+Palmeiras,200',
  mensagemConvite: 'chegou a hora de celebrar os 30 anos de Maria! Vai ter festa, bolo e muita alegria.',
  observacoes: 'Bebidas alcoólicas serão por conta de cada convidado. 🍺',
}
```

---

## Banco de dados (Supabase)

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) → **New project**
2. Aguarde a criação (~2 min)
3. No menu lateral: **SQL Editor → New query** → cole o conteúdo de `supabase/schema.sql` → **Run**
4. Crie o usuário admin: **Authentication → Users → Add user** (e-mail + senha para usar em `/admin`)
5. Copie em **Project Settings → API**: a **Project URL** e a **anon public key**

### Tabelas criadas pelo schema.sql

**`confirmacoes`** — respostas individuais
| coluna | tipo | descrição |
|--------|------|-----------|
| id | uuid | chave primária |
| nome | text | nome do convidado |
| tem_acompanhante | boolean | se vai com acompanhante |
| nome_acompanhante | text\|null | nome do acompanhante |
| confirmado | boolean | true = vai / false = não vai |
| criado_em | timestamptz | data/hora da resposta |

**`grupos`** — convites de família/grupo
| coluna | tipo | descrição |
|--------|------|-----------|
| id | uuid | chave primária |
| slug | text | identificador único na URL (ex: `familia-silva`) |
| nome_grupo | text | nome do grupo para o admin |
| membros | text[] | array com os nomes dos membros |
| confirmado | boolean | true = grupo confirmou |
| criado_em | timestamptz | data/hora do cadastro |

### Políticas RLS
- **Anônimo** pode apenas `INSERT` em `confirmacoes` e atualizar `confirmado` em `grupos`
- **Autenticado** pode `SELECT`, `DELETE` e criar novos grupos
- Ninguém apaga ou altera registros pela API pública sem login

---

## Variáveis de ambiente

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

> **Modo demo:** sem as variáveis, o app usa um cliente mock — funciona visualmente mas não salva dados.

---

## Desenvolvimento local

```bash
npm install
npm run dev        # http://localhost:5173
```

- `/` — fluxo do convidado
- `/admin` — painel administrativo
- `/g/:slug` — convite de grupo (ex: `/g/familia-silva`)

---

## Testes

```bash
npm test                # roda todos os testes uma vez
npm run test:watch      # modo watch (re-roda ao salvar)
npm run test:coverage   # relatório de cobertura
```

### Cobertura atual (27 testes)

| Arquivo | O que testa |
|---------|-------------|
| `utils/slug.test.ts` | `gerarSlug`: acentos, hífens, espaços, caracteres especiais |
| `utils/membros.test.ts` | `listarMembros`: 0, 1, 2, 3 e 4+ membros |
| `pages/Landing.test.tsx` | renderização do título, botões Sim/Não, callbacks |
| `pages/RSVPForm.test.tsx` | validação, campo acompanhante, submit, erro, voltar |
| `pages/AdminLogin.test.tsx` | campos, toggle mostrar/ocultar senha, botão Entrar |

---

## Deploy na Vercel

1. Suba o projeto para o GitHub
2. Em [vercel.com](https://vercel.com): **Add New → Project** → importe o repositório
3. Em **Environment Variables**, adicione `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
4. **Deploy** — a Vercel detecta Vite automaticamente

O arquivo `vercel.json` garante que o roteamento SPA funcione corretamente:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```

---

## Fluxos principais

```
Convidado individual
  / → Landing (Sim/Não)
        ↓ Sim
      RSVPForm (nome + acompanhante)
        ↓ submit → Supabase
      BoomScreen (explosão 900ms)
        ↓
      InviteReveal (convite + confete)

Convidado individual
  / → Landing
        ↓ Não
      DeclineForm (nome)
        ↓ submit → Supabase
      Decline (agradecimento)

Convite de grupo
  /g/:slug → GrupoConvite
    carregando → confirmar → BoomScreen → confirmado (âmbar)
    ou: já confirmado → direto para confirmado (âmbar)
    ou: slug inválido → erro

Admin
  /admin → AdminLogin (e-mail + senha)
         → AdminDashboard
             ├── Aba Convidados (lista, CSV, print, excluir)
             └── Aba Grupos (criar, copiar link, CSV, print, excluir)
```
