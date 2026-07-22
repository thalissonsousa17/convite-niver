-- Rode este script no SQL Editor do seu projeto Supabase (Supabase Dashboard > SQL Editor > New query)

create table if not exists public.confirmacoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tem_acompanhante boolean not null default false,
  nome_acompanhante text,
  confirmado boolean not null, -- true = vai comparecer, false = não vai
  criado_em timestamptz not null default now()
);

alter table public.confirmacoes enable row level security;

-- Qualquer visitante (não logado) pode INSERIR uma confirmação (preencher o convite)
create policy "Qualquer um pode confirmar presença"
  on public.confirmacoes
  for insert
  to anon
  with check (true);

-- Só usuários autenticados (você, o organizador) podem LER a lista de convidados
create policy "Somente admin logado pode ver a lista"
  on public.confirmacoes
  for select
  to authenticated
  using (true);

-- Ninguém (nem anon nem authenticated) pode alterar ou apagar registros pela API pública.
-- Se precisar corrigir algo, use o Table Editor do Supabase Dashboard.

-- Depois de rodar isso, crie o usuário admin em:
-- Supabase Dashboard > Authentication > Users > Add user
-- (use o e-mail e senha que você vai usar para logar na tela /admin do site)
