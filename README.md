# Convite de Aniversário 🎉

App de convite com RSVP: quem recebe o link marca **Sim/Não**, preenche o nome (e do
acompanhante, se houver) e recebe um convite personalizado com explosão de confete.
Todas as respostas ficam salvas no Supabase, e você acompanha tudo numa área
administrativa protegida por login em `/admin`.

## 1. Editar os dados da festa

Abra `src/config/festa.ts` e preencha com as informações reais: nome do
aniversariante, idade, data, horário, local e mensagem do convite.

## 2. Criar o projeto no Supabase (banco + login)

1. Crie uma conta em [supabase.com](https://supabase.com) e clique em **New project**.
2. Escolha um nome, senha do banco e região (ex: São Paulo) e aguarde a criação (~2 min).
3. No menu lateral, vá em **SQL Editor** → **New query**, cole o conteúdo do arquivo
   `supabase/schema.sql` (deste projeto) e clique em **Run**. Isso cria a tabela
   `confirmacoes` já com as permissões corretas (qualquer um pode confirmar presença,
   só você logado pode ver a lista).
4. Vá em **Authentication → Users → Add user** e crie o seu usuário admin (e-mail e
   senha que você vai usar para logar em `/admin`).
5. Vá em **Project Settings → API** e copie:
   - **Project URL**
   - **anon public key**

## 3. Configurar as variáveis de ambiente

Copie o arquivo de exemplo e preencha com os dados do passo anterior:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

## 4. Rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` para o convite e `http://localhost:5173/admin`
para a área administrativa.

## 5. Publicar na Vercel

1. Suba este projeto para um repositório no GitHub.
2. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e importe o repositório.
3. A Vercel detecta automaticamente que é um projeto Vite — não precisa mudar nada no build.
4. Em **Environment Variables**, adicione as duas variáveis do passo 3
   (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`).
5. Clique em **Deploy**. Em ~1 minuto você recebe o link público (ex:
   `https://convite-thalin.vercel.app`) — é esse link que você envia para os convidados.

## Como funciona por dentro

- `/` — fluxo do convidado: Sim/Não → formulário de nome (+ acompanhante, se marcado,
  ou apenas nome se marcar Não) → tela final com confete e o convite personalizado.
- `/admin` — tela de login (e-mail/senha do usuário Supabase que você criou) e, depois
  de logado, a lista de todos que responderam, com contagem de confirmados, total de
  pessoas (contando acompanhantes) e quem não vai.
- Toda resposta (Sim ou Não) é gravada na tabela `confirmacoes` do Supabase — é a sua
  "planilha" de controle, sempre atualizada em tempo real.
- Segurança: as regras (Row Level Security) do banco garantem que qualquer visitante
  só pode *inserir* uma resposta, mas só quem faz login consegue *ler* a lista completa.

## Estrutura de pastas

```
src/
  config/festa.ts       ← dados da festa (edite aqui)
  lib/supabase.ts        ← conexão com o Supabase
  hooks/useAuth.ts        ← controle de sessão de login
  components/             ← Card, decoração de balões/serpentinas, confete
  pages/
    ConviteFlow.tsx       ← orquestra o fluxo do convidado
    Landing.tsx           ← tela Sim/Não
    RSVPForm.tsx          ← formulário de quem vai
    DeclineForm.tsx       ← formulário de quem não vai
    InviteReveal.tsx      ← convite final com confete
    Decline.tsx           ← tela de agradecimento de quem não vai
    AdminLogin.tsx        ← login do organizador
    AdminDashboard.tsx    ← lista de confirmados
supabase/schema.sql       ← script SQL para rodar no Supabase
```
