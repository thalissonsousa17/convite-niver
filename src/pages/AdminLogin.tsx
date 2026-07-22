import { useState } from 'react'
import Card from '../components/Card'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [entrando, setEntrando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEntrando(true)
    setErro(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    setEntrando(false)
    if (error) setErro('E-mail ou senha inválidos.')
  }

  return (
    <Card>
      <h2 className="font-display text-2xl font-bold text-creme">Área do organizador</h2>
      <p className="mt-2 text-sm text-creme/70">Entre para ver a lista de convidados confirmados.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ouro">E-mail</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-creme/15 bg-noite px-4 py-3 text-creme outline-none focus:border-turquesa"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ouro">Senha</span>
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="rounded-xl border border-creme/15 bg-noite px-4 py-3 text-creme outline-none focus:border-turquesa"
          />
        </label>

        {erro && <p className="text-sm text-fucsia">{erro}</p>}

        <button
          type="submit"
          disabled={entrando}
          className="mt-2 rounded-2xl bg-ouro px-6 py-3 font-display text-lg font-semibold text-noite transition hover:brightness-105 disabled:opacity-50"
        >
          {entrando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </Card>
  )
}
