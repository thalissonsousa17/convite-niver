import { useState } from 'react'
import Card from '../components/Card'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [entrando, setEntrando] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)

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
          <div className="relative">
            <input
              type={mostrarSenha ? 'text' : 'password'}
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-xl border border-creme/15 bg-noite px-4 py-3 pr-12 text-creme outline-none focus:border-turquesa"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-creme/40 transition hover:text-creme/80"
              tabIndex={-1}
              aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {mostrarSenha ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
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
