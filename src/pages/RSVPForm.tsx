import { useState } from 'react'
import Card from '../components/Card'

export type DadosConfirmacao = {
  nome: string
  temAcompanhante: boolean
  nomeAcompanhante: string
}

export default function RSVPForm({
  enviando,
  erro,
  onEnviar,
  onVoltar,
}: {
  enviando: boolean
  erro: string | null
  onEnviar: (dados: DadosConfirmacao) => void
  onVoltar: () => void
}) {
  const [nome, setNome] = useState('')
  const [temAcompanhante, setTemAcompanhante] = useState(false)
  const [nomeAcompanhante, setNomeAcompanhante] = useState('')

  const podeEnviar = nome.trim().length > 1 && (!temAcompanhante || nomeAcompanhante.trim().length > 1)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!podeEnviar || enviando) return
    onEnviar({ nome: nome.trim(), temAcompanhante, nomeAcompanhante: nomeAcompanhante.trim() })
  }

  return (
    <Card>
      <button
        onClick={onVoltar}
        className="mb-4 text-sm text-creme/60 transition hover:text-creme"
      >
        ← voltar
      </button>

      <h2 className="font-display text-3xl font-bold text-creme">Que ótimo! 🎊</h2>
      <p className="mt-2 text-creme/70">Como podemos te chamar no convite?</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ouro">Seu nome</span>
          <input
            autoFocus
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Maria Silva"
            className="rounded-xl border border-creme/15 bg-noite px-4 py-3 text-creme placeholder:text-creme/30 outline-none focus:border-turquesa"
          />
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={temAcompanhante}
            onChange={(e) => setTemAcompanhante(e.target.checked)}
            className="h-5 w-5 rounded border-creme/30 accent-fucsia"
          />
          <span className="text-sm text-creme/85">Vou levar acompanhante / cônjuge</span>
        </label>

        {temAcompanhante && (
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-ouro">Nome do acompanhante</span>
            <input
              value={nomeAcompanhante}
              onChange={(e) => setNomeAcompanhante(e.target.value)}
              placeholder="Ex: João Silva"
              className="rounded-xl border border-creme/15 bg-noite px-4 py-3 text-creme placeholder:text-creme/30 outline-none focus:border-turquesa"
            />
          </label>
        )}

        {erro && <p className="text-sm text-fucsia">{erro}</p>}

        <button
          type="submit"
          disabled={!podeEnviar || enviando}
          className="mt-2 rounded-2xl bg-ouro px-6 py-4 font-display text-lg font-semibold text-noite transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {enviando ? 'Enviando…' : 'Ver meu convite'}
        </button>
      </form>
    </Card>
  )
}
