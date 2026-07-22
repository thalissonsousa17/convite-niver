import { useEffect, useState } from 'react'
import { supabase, type Confirmacao, type Grupo } from '../lib/supabase'

type Aba = 'convidados' | 'grupos'

export default function AdminDashboard() {
  const [aba, setAba] = useState<Aba>('convidados')

  return (
    <>
      <style>{`
        @media print {
          body > * { display: none !important; }
          #print-area { display: block !important; position: static !important; }
          #print-area * { color: #000 !important; background: #fff !important; border-color: #ccc !important; }
        }
      `}</style>

      <div
        id="print-area"
        className="relative z-10 w-full max-w-3xl rounded-[28px] border border-ouro/20 bg-noite-2 p-6 shadow-2xl shadow-black/40 sm:p-10"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold text-creme">Painel admin</h2>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-creme/60 transition hover:text-creme"
          >
            Sair
          </button>
        </div>

        <div className="mt-5 flex gap-2 rounded-2xl bg-noite p-1 print:hidden">
          <BotaoAba ativa={aba === 'convidados'} onClick={() => setAba('convidados')}>
            Convidados
          </BotaoAba>
          <BotaoAba ativa={aba === 'grupos'} onClick={() => setAba('grupos')}>
            Grupos / Famílias
          </BotaoAba>
        </div>

        {aba === 'convidados' ? <AbaConvidados /> : <AbaGrupos />}
      </div>
    </>
  )
}

function BotaoAba({ ativa, onClick, children }: { ativa: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${
        ativa ? 'bg-ouro text-noite' : 'text-creme/60 hover:text-creme'
      }`}
    >
      {children}
    </button>
  )
}

/* ─── ABA CONVIDADOS ─────────────────────────────────────────────── */
function AbaConvidados() {
  const [lista, setLista] = useState<Confirmacao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setCarregando(true)
    const { data, error } = await supabase
      .from('confirmacoes')
      .select('*')
      .order('criado_em', { ascending: false })

    if (error) setErro('Não foi possível carregar a lista.')
    else setLista(data ?? [])
    setCarregando(false)
  }

  async function excluir(id: string) {
    if (!confirm('Excluir este registro?')) return
    const { error } = await supabase.from('confirmacoes').delete().eq('id', id)
    if (!error) setLista((prev) => prev.filter((c) => c.id !== id))
  }

  function exportarCSV() {
    const cabecalho = ['Nome', 'Acompanhante', 'Status', 'Data de resposta']
    const linhas = lista.map((c) => [
      c.nome,
      c.nome_acompanhante || '',
      c.confirmado ? 'Confirmado' : 'Não vai',
      new Date(c.criado_em).toLocaleString('pt-BR'),
    ])
    const csv = [cabecalho, ...linhas]
      .map((l) => l.map((v) => `"${v}"`).join(';'))
      .join('\n')

    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'convidados-thalin.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const confirmados = lista.filter((c) => c.confirmado)
  const recusados = lista.filter((c) => !c.confirmado)
  const totalPessoas = confirmados.reduce((acc, c) => acc + (c.tem_acompanhante ? 2 : 1), 0)

  return (
    <>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <Resumo rotulo="Confirmaram" valor={confirmados.length} cor="var(--color-turquesa)" />
        <Resumo rotulo="Total de pessoas" valor={totalPessoas} cor="var(--color-ouro)" />
        <Resumo rotulo="Não vão" valor={recusados.length} cor="var(--color-fucsia)" />
      </div>

      {erro && <p className="mt-6 text-sm text-fucsia">{erro}</p>}
      {carregando && <p className="mt-6 text-sm text-creme/60">Carregando…</p>}

      {!carregando && !erro && (
        <>
          <div className="mt-6 flex gap-3 print:hidden">
            <button onClick={carregar} className="text-sm text-creme/60 transition hover:text-creme">
              ↺ Atualizar
            </button>
            <button
              onClick={exportarCSV}
              className="flex items-center gap-2 rounded-xl bg-turquesa/20 px-4 py-2 text-sm font-semibold text-turquesa transition hover:bg-turquesa/30"
            >
              ⬇ Exportar .csv
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-xl bg-ouro/20 px-4 py-2 text-sm font-semibold text-ouro transition hover:bg-ouro/30"
            >
              🖨 Imprimir
            </button>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-creme/10">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-creme/10 text-creme/60">
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">Nome</th>
                  <th className="p-3 font-semibold">Acompanhante</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Respondeu em</th>
                  <th className="p-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {lista.map((c, i) => (
                  <tr key={c.id} className="border-b border-creme/5 last:border-0">
                    <td className="p-3 text-creme/40">{i + 1}</td>
                    <td className="p-3 font-medium text-creme">{c.nome}</td>
                    <td className="p-3 text-creme/70">{c.nome_acompanhante || '—'}</td>
                    <td className="p-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        c.confirmado ? 'bg-turquesa/20 text-turquesa' : 'bg-fucsia/20 text-fucsia'
                      }`}>
                        {c.confirmado ? '✓ Confirmado' : '✗ Não vai'}
                      </span>
                    </td>
                    <td className="p-3 text-creme/60">
                      {new Date(c.criado_em).toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => excluir(c.id)}
                        title="Excluir"
                        className="rounded-lg p-1.5 text-creme/30 transition hover:bg-red-500/20 hover:text-red-400"
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
                {lista.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-creme/50">
                      Ninguém respondeu ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}

/* ─── ABA GRUPOS ─────────────────────────────────────────────────── */
function AbaGrupos() {
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [carregando, setCarregando] = useState(true)
  const [nomeGrupo, setNomeGrupo] = useState('')
  const [membros, setMembros] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [copiado, setCopiado] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setCarregando(true)
    const { data } = await supabase
      .from('grupos')
      .select('*')
      .order('criado_em', { ascending: false })
    setGrupos(data ?? [])
    setCarregando(false)
  }

  function gerarSlug(nome: string) {
    return nome
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  async function criarGrupo() {
    const listaMembros = membros
      .split('\n')
      .map((m) => m.trim())
      .filter(Boolean)

    if (!nomeGrupo.trim() || listaMembros.length === 0) {
      setErro('Preencha o nome do grupo e pelo menos um membro.')
      return
    }

    setSalvando(true)
    setErro(null)

    const slug = gerarSlug(nomeGrupo)
    const { error } = await supabase.from('grupos').insert({
      slug,
      nome_grupo: nomeGrupo.trim(),
      membros: listaMembros,
      confirmado: false,
    })

    setSalvando(false)

    if (error) {
      setErro(
        error.message.includes('unique')
          ? 'Já existe um grupo com esse nome. Tente outro.'
          : 'Erro ao criar grupo.'
      )
      return
    }

    setNomeGrupo('')
    setMembros('')
    carregar()
  }

  async function excluirGrupo(id: string) {
    if (!confirm('Excluir este grupo?')) return
    const { error } = await supabase.from('grupos').delete().eq('id', id)
    if (!error) setGrupos((prev) => prev.filter((g) => g.id !== id))
  }

  function copiarLink(slug: string) {
    const link = `${window.location.origin}/g/${slug}`
    navigator.clipboard.writeText(link)
    setCopiado(slug)
    setTimeout(() => setCopiado(null), 2000)
  }

  const totalConfirmados = grupos
    .filter((g) => g.confirmado)
    .reduce((acc, g) => acc + g.membros.length, 0)
  const totalPendentes = grupos.filter((g) => !g.confirmado).length

  return (
    <>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <Resumo rotulo="Grupos criados" valor={grupos.length} cor="var(--color-fucsia)" />
        <Resumo rotulo="Pessoas confirmadas" valor={totalConfirmados} cor="var(--color-turquesa)" />
        <Resumo rotulo="Aguardando" valor={totalPendentes} cor="var(--color-ouro)" />
      </div>

      {/* Formulário novo grupo */}
      <div className="mt-6 rounded-2xl border border-ouro/20 bg-noite p-5">
        <h3 className="font-display font-bold text-creme">Novo grupo / família</h3>

        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs text-creme/60">Nome do grupo</label>
            <input
              type="text"
              value={nomeGrupo}
              onChange={(e) => setNomeGrupo(e.target.value)}
              placeholder="Ex: Família Silva"
              className="w-full rounded-xl border border-creme/10 bg-noite-3 px-4 py-2.5 text-sm text-creme placeholder:text-creme/30 focus:outline-none focus:ring-2 focus:ring-ouro/40"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-creme/60">
              Membros <span className="text-creme/40">(um nome por linha)</span>
            </label>
            <textarea
              value={membros}
              onChange={(e) => setMembros(e.target.value)}
              placeholder={"João Silva\nMaria Silva\nPedro Silva\nDona Rosa"}
              rows={4}
              className="w-full rounded-xl border border-creme/10 bg-noite-3 px-4 py-2.5 text-sm text-creme placeholder:text-creme/30 focus:outline-none focus:ring-2 focus:ring-ouro/40"
            />
          </div>

          {nomeGrupo && (
            <p className="text-xs text-creme/40">
              Link: <span className="text-creme/70">/g/{gerarSlug(nomeGrupo)}</span>
            </p>
          )}

          {erro && <p className="text-xs text-red-400">{erro}</p>}

          <button
            onClick={criarGrupo}
            disabled={salvando}
            className="w-full rounded-xl bg-ouro py-3 font-semibold text-noite transition hover:bg-ouro/90 disabled:opacity-60"
          >
            {salvando ? 'Criando…' : '+ Criar grupo e gerar link'}
          </button>
        </div>
      </div>

      {carregando && <p className="mt-6 text-sm text-creme/60">Carregando…</p>}

      {!carregando && grupos.length === 0 && (
        <p className="mt-6 text-center text-sm text-creme/50">Nenhum grupo criado ainda.</p>
      )}

      {!carregando && grupos.length > 0 && (
        <div className="mt-4 space-y-3">
          {grupos.map((g) => (
            <div key={g.id} className="rounded-2xl border border-creme/10 bg-noite p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-creme">{g.nome_grupo}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      g.confirmado ? 'bg-turquesa/20 text-turquesa' : 'bg-ouro/20 text-ouro'
                    }`}>
                      {g.confirmado ? '✓ Confirmado' : '⏳ Pendente'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-creme/60">{g.membros.join(' · ')}</p>
                  <p className="mt-1 truncate text-xs text-creme/30">
                    {window.location.origin}/g/{g.slug}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => copiarLink(g.slug)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      copiado === g.slug
                        ? 'bg-turquesa/20 text-turquesa'
                        : 'bg-creme/10 text-creme hover:bg-creme/20'
                    }`}
                  >
                    {copiado === g.slug ? '✓ Copiado!' : '📋 Copiar link'}
                  </button>
                  <button
                    onClick={() => excluirGrupo(g.id)}
                    className="rounded-lg p-1.5 text-creme/30 transition hover:bg-red-500/20 hover:text-red-400"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

function Resumo({ rotulo, valor, cor }: { rotulo: string; valor: number; cor: string }) {
  return (
    <div className="rounded-2xl bg-noite p-4 text-center">
      <p className="font-display text-3xl font-bold" style={{ color: cor }}>
        {valor}
      </p>
      <p className="mt-1 text-xs text-creme/60">{rotulo}</p>
    </div>
  )
}
