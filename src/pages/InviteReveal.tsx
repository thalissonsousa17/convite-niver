import { useEffect, useState } from 'react'
import Card from '../components/Card'
import ConfettiBurst from '../components/ConfettiBurst'
import BoomScreen, { DUR_BOOM } from '../components/BoomScreen'
import { festa } from '../config/festa'
import type { DadosConfirmacao } from './RSVPForm'

export default function InviteReveal({ dados }: { dados: DadosConfirmacao }) {
  const [fase, setFase] = useState<'boom' | 'card'>('boom')

  useEffect(() => {
    const t = setTimeout(() => setFase('card'), DUR_BOOM)
    return () => clearTimeout(t)
  }, [])

  const nomes = dados.temAcompanhante && dados.nomeAcompanhante
    ? `${dados.nome} e ${dados.nomeAcompanhante}`
    : dados.nome

  if (fase === 'boom') {
    return <BoomScreen />
  }


  return (
    <>
      <ConfettiBurst />
      <Card className="animate-[pop_0.5s_ease-out] text-center">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-turquesa">
          Presença confirmada
        </p>

        <h1 className="mt-3 font-display text-3xl font-bold leading-snug text-creme sm:text-4xl">
          {nomes},{' '}
          {dados.temAcompanhante ? 'vocês estão confirmados!' : 'você está confirmado!'}
          {' '}🎊
        </h1>

        <p className="mt-4 text-creme/80">
          A festa de aniversário de{' '}
          <span className="font-semibold text-ouro">{festa.aniversariante}</span>
          {festa.idade ? ` (${festa.idade} anos)` : ''}{' '}
          vai ser incrível — e você faz parte disso!
        </p>

        <div className="mt-6 space-y-2 rounded-2xl bg-noite p-5 text-left">
          <Detalhe rotulo="📅 Data" valor={festa.data} />
          <Detalhe rotulo="🕛 Horário" valor={festa.horario} />
          <Detalhe
            rotulo="📍 Local"
            valor={festa.local}
            link={festa.linkLocal || undefined}
          />
        </div>

        {festa.observacoes && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-ouro/40 bg-ouro/15 px-5 py-4 text-left">
            <span className="text-2xl">⚠️</span>
            <p className="text-sm font-semibold leading-snug text-ouro">
              {festa.observacoes}
            </p>
          </div>
        )}

        <p className="mt-6 text-sm text-creme/60">
          Salva essa tela ou tira um print. A gente te espera! 🥳
        </p>
      </Card>
    </>
  )
}


function Detalhe({ rotulo, valor, link }: { rotulo: string; valor: string; link?: string }) {
  return (
    <p className="text-sm text-creme/85">
      <span className="font-semibold text-creme">{rotulo}: </span>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="text-turquesa underline underline-offset-2"
        >
          {valor}
        </a>
      ) : (
        valor
      )}
    </p>
  )
}
