import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase, type Grupo } from '../lib/supabase'
import Card from '../components/Card'
import ConfettiBurst from '../components/ConfettiBurst'
import BoomScreen, { DUR_BOOM } from '../components/BoomScreen'
import { festa } from '../config/festa'
import { listarMembros } from '../utils/membros'

type Fase = 'carregando' | 'confirmar' | 'boom' | 'confirmado' | 'naoEncontrado'

export default function GrupoConvite() {
  const { slug } = useParams<{ slug: string }>()
  const [grupo, setGrupo] = useState<Grupo | null>(null)
  const [fase, setFase] = useState<Fase>('carregando')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase
        .from('grupos')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error || !data) {
        setFase('naoEncontrado')
        return
      }

      setGrupo(data)
      setFase(data.confirmado ? 'confirmado' : 'confirmar')
    }

    carregar()
  }, [slug])

  async function handleConfirmar() {
    if (!grupo) return
    setEnviando(true)

    const { error } = await supabase
      .from('grupos')
      .update({ confirmado: true })
      .eq('slug', slug)

    setEnviando(false)
    if (!error) {
      setFase('boom')
      setTimeout(() => setFase('confirmado'), DUR_BOOM)
    }
  }

  if (fase === 'carregando') {
    return (
      <Card className="text-center">
        <p className="text-creme/60">Carregando convite…</p>
      </Card>
    )
  }

  if (fase === 'naoEncontrado') {
    return (
      <Card className="text-center">
        <p className="text-3xl">😕</p>
        <p className="mt-3 font-display text-xl font-bold text-creme">Convite não encontrado</p>
        <p className="mt-2 text-sm text-creme/60">Verifique o link com quem te enviou.</p>
      </Card>
    )
  }

  if (fase === 'boom') {
    return <BoomScreen />
  }

  if (fase === 'confirmado' && grupo) {
    return (
      <>
        <ConfettiBurst />
        <Card className="animate-[pop_0.5s_ease-out] text-center !bg-gradient-to-b !from-[#78350f] !to-[#92400e] !border-amber-500/30">
          <p className="text-4xl">🎊</p>
          <h1 className="mt-3 font-display text-2xl font-bold text-white">
            Presença confirmada!
          </h1>
          <p className="mt-3 text-amber-100">
            <span className="font-semibold text-amber-300">{listarMembros(grupo.membros)}</span>
            , pode chegar que vocês já estão confirmados! A festa vai ser incrível. Até domingo! 🎉
          </p>
          <div className="mt-6 space-y-2 rounded-2xl bg-black/20 p-5 text-left">
            <Detalhe rotulo="📅 Data" valor={festa.data} />
            <Detalhe rotulo="🕛 Horário" valor={festa.horario} />
            <Detalhe rotulo="📍 Local" valor={festa.local} link={festa.linkLocal || undefined} />
            {festa.observacoes && (
              <Detalhe rotulo="ℹ️ Obs" valor={festa.observacoes} />
            )}
          </div>
          <p className="mt-6 text-sm text-amber-200/70">Salva essa tela ou tira um print. A gente te espera! 🥳</p>
        </Card>
      </>
    )
  }

  if (fase === 'confirmar' && grupo) {
    return (
      <Card className="text-center">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-turquesa">
          Convite de Aniversário
        </p>

        <h1 className="mt-3 font-display text-2xl font-bold leading-snug text-creme sm:text-3xl">
          Olá, <span className="text-ouro">{listarMembros(grupo.membros)}</span>! 🎉
        </h1>

        <p className="mt-3 text-creme/70">{festa.mensagemConvite}</p>

        <div className="mt-5 space-y-2 rounded-2xl bg-noite p-5 text-left">
          <Detalhe rotulo="📅 Data" valor={festa.data} />
          <Detalhe rotulo="🕛 Horário" valor={festa.horario} />
          <Detalhe rotulo="📍 Local" valor={festa.local} link={festa.linkLocal || undefined} />
          {festa.observacoes && (
            <Detalhe rotulo="ℹ️ Obs" valor={festa.observacoes} />
          )}
        </div>

        <button
          onClick={handleConfirmar}
          disabled={enviando}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-turquesa to-fucsia py-4 font-display text-lg font-bold text-white shadow-lg transition hover:opacity-90 disabled:opacity-60"
        >
          {enviando ? 'Confirmando…' : 'Sim, todos vamos! 🎉'}
        </button>
      </Card>
    )
  }

  return null
}

function Detalhe({ rotulo, valor, link }: { rotulo: string; valor: string; link?: string }) {
  return (
    <p className="text-sm text-creme/85">
      <span className="font-semibold text-creme">{rotulo}: </span>
      {link ? (
        <a href={link} target="_blank" rel="noreferrer" className="text-turquesa underline underline-offset-2">
          {valor}
        </a>
      ) : (
        valor
      )}
    </p>
  )
}
