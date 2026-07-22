import { useEffect, useState } from 'react'
import { supabase, type Confirmacao } from '../lib/supabase'

export default function AdminDashboard() {
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

  function imprimir() {
    window.print()
  }

  const confirmados = lista.filter((c) => c.confirmado)
  const recusados = lista.filter((c) => !c.confirmado)
  const totalPessoas = confirmados.reduce((acc, c) => acc + (c.tem_acompanhante ? 2 : 1), 0)

  return (
    <>
      {/* Estilos de impressão — esconde tudo exceto a tabela */}
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
        {/* Cabeçalho */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold text-creme">Lista de convidados</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={carregar}
              className="text-sm text-creme/60 transition hover:text-creme"
              title="Atualizar lista"
            >
              ↺ Atualizar
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-sm text-creme/60 transition hover:text-creme"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Resumo */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <Resumo rotulo="Confirmaram" valor={confirmados.length} cor="var(--color-turquesa)" />
          <Resumo rotulo="Total de pessoas" valor={totalPessoas} cor="var(--color-ouro)" />
          <Resumo rotulo="Não vão" valor={recusados.length} cor="var(--color-fucsia)" />
        </div>

        {erro && <p className="mt-6 text-sm text-fucsia">{erro}</p>}
        {carregando && <p className="mt-6 text-sm text-creme/60">Carregando…</p>}

        {!carregando && !erro && (
          <>
            {/* Botões de exportar e imprimir */}
            <div className="mt-6 flex gap-3 print:hidden">
              <button
                onClick={exportarCSV}
                className="flex items-center gap-2 rounded-xl bg-turquesa/20 px-4 py-2 text-sm font-semibold text-turquesa transition hover:bg-turquesa/30"
              >
                ⬇ Exportar planilha (.csv)
              </button>
              <button
                onClick={imprimir}
                className="flex items-center gap-2 rounded-xl bg-ouro/20 px-4 py-2 text-sm font-semibold text-ouro transition hover:bg-ouro/30"
              >
                🖨 Imprimir lista
              </button>
            </div>

            {/* Tabela */}
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
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            c.confirmado
                              ? 'bg-turquesa/20 text-turquesa'
                              : 'bg-fucsia/20 text-fucsia'
                          }`}
                        >
                          {c.confirmado ? '✓ Confirmado' : '✗ Não vai'}
                        </span>
                      </td>
                      <td className="p-3 text-creme/60">
                        {new Date(c.criado_em).toLocaleString('pt-BR')}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => excluir(c.id)}
                          title="Excluir registro"
                          className="rounded-lg p-1.5 text-creme/30 transition hover:bg-red-500/20 hover:text-red-400"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                  {lista.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-creme/50">
                        Ninguém respondeu ainda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
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
