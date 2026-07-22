import { useEffect, useState } from 'react'
import Card from '../components/Card'
import ConfettiBurst from '../components/ConfettiBurst'
import { festa } from '../config/festa'
import type { DadosConfirmacao } from './RSVPForm'

const DUR_BOOM = 900 // ms que o boom fica na tela

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

function BoomScreen() {
  const ring: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    width: '180px',
    height: '180px',
    borderRadius: '50%',
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        overflow: 'hidden',
      }}
    >
      {/* Flash de fundo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, #fbbf24 0%, #f97316 35%, #0ea5e9 65%, transparent 80%)',
          animationName: 'boomFlash',
          animationDuration: `${DUR_BOOM}ms`,
          animationFillMode: 'forwards',
          animationTimingFunction: 'ease-out',
        }}
      />

      {/* Anel dourado */}
      <div
        style={{
          ...ring,
          border: '10px solid #fbbf24',
          boxShadow: '0 0 50px #fbbf24, 0 0 100px #f97316',
          animationName: 'boomRing',
          animationDuration: `${DUR_BOOM * 0.95}ms`,
          animationFillMode: 'forwards',
          animationTimingFunction: 'ease-out',
        }}
      />

      {/* Anel azul (delay pequeno) */}
      <div
        style={{
          ...ring,
          width: '120px',
          height: '120px',
          border: '7px solid #0ea5e9',
          boxShadow: '0 0 40px #0ea5e9',
          animationName: 'boomRing2',
          animationDuration: `${DUR_BOOM * 0.85}ms`,
          animationDelay: '80ms',
          animationFillMode: 'forwards',
          animationTimingFunction: 'ease-out',
        }}
      />

      {/* Estrela de fundo */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          fontSize: '160px',
          lineHeight: 1,
          animationName: 'boomStar',
          animationDuration: `${DUR_BOOM}ms`,
          animationFillMode: 'forwards',
          animationTimingFunction: 'ease-out',
          filter: 'blur(2px)',
          opacity: 0.6,
        }}
      >
        ✦
      </div>

      {/* Emoji central */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          fontSize: '90px',
          lineHeight: 1,
          animationName: 'boomEmoji',
          animationDuration: `${DUR_BOOM}ms`,
          animationFillMode: 'forwards',
          animationTimingFunction: 'ease-out',
        }}
      >
        🎉
      </div>
    </div>
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
