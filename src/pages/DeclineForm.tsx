import { useState } from 'react'
import Card from '../components/Card'

export default function DeclineForm({
  enviando,
  erro,
  onEnviar,
  onVoltar,
}: {
  enviando: boolean
  erro: string | null
  onEnviar: (nome: string) => void
  onVoltar: () => void
}) {
  const [nome, setNome] = useState('')
  const podeEnviar = nome.trim().length > 1

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!podeEnviar || enviando) return
    onEnviar(nome.trim())
  }

  return (
    <Card>
      <button onClick={onVoltar} className="mb-4 text-sm text-creme/60 transition hover:text-creme">
        ← voltar
      </button>

      <h2 className="font-display text-2xl font-bold text-creme">Poxa, vamos sentir sua falta 💔</h2>
      <p className="mt-2 text-creme/70">Antes de fechar, quem está respondendo?</p>

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

        {erro && <p className="text-sm text-fucsia">{erro}</p>}

        <button
          type="submit"
          disabled={!podeEnviar || enviando}
          className="mt-2 rounded-2xl border border-creme/20 px-6 py-4 font-display text-lg font-semibold text-creme transition hover:bg-creme/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {enviando ? 'Enviando…' : 'Confirmar resposta'}
        </button>
      </form>
    </Card>
  )
}
