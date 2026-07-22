import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Landing from './Landing'
import RSVPForm, { type DadosConfirmacao } from './RSVPForm'
import InviteReveal from './InviteReveal'
import DeclineForm from './DeclineForm'
import Decline from './Decline'

type Etapa = 'landing' | 'form' | 'reveal' | 'declineForm' | 'declineThanks'

export default function ConviteFlow() {
  const [etapa, setEtapa] = useState<Etapa>('landing')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [dadosConfirmados, setDadosConfirmados] = useState<DadosConfirmacao | null>(null)

  async function handleConfirmar(dados: DadosConfirmacao) {
    setEnviando(true)
    setErro(null)
    const { error } = await supabase.from('confirmacoes').insert({
      nome: dados.nome,
      tem_acompanhante: dados.temAcompanhante,
      nome_acompanhante: dados.temAcompanhante ? dados.nomeAcompanhante : null,
      confirmado: true,
    })
    setEnviando(false)

    if (error) {
      setErro('Não conseguimos salvar sua confirmação. Tenta de novo?')
      return
    }
    setDadosConfirmados(dados)
    setEtapa('reveal')
  }

  async function handleDeclinar(nome: string) {
    setEnviando(true)
    setErro(null)
    const { error } = await supabase.from('confirmacoes').insert({
      nome,
      tem_acompanhante: false,
      nome_acompanhante: null,
      confirmado: false,
    })
    setEnviando(false)

    if (error) {
      setErro('Não conseguimos salvar sua resposta. Tenta de novo?')
      return
    }
    setEtapa('declineThanks')
  }

  if (etapa === 'form') {
    return (
      <RSVPForm
        enviando={enviando}
        erro={erro}
        onEnviar={handleConfirmar}
        onVoltar={() => setEtapa('landing')}
      />
    )
  }

  if (etapa === 'reveal' && dadosConfirmados) {
    return <InviteReveal dados={dadosConfirmados} />
  }

  if (etapa === 'declineForm') {
    return (
      <DeclineForm
        enviando={enviando}
        erro={erro}
        onEnviar={handleDeclinar}
        onVoltar={() => setEtapa('landing')}
      />
    )
  }

  if (etapa === 'declineThanks') {
    return <Decline onVoltar={() => setEtapa('landing')} />
  }

  return (
    <Landing onEscolha={(vai) => setEtapa(vai ? 'form' : 'declineForm')} />
  )
}
