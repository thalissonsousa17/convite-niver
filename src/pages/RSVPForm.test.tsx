import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RSVPForm from './RSVPForm'

const baseProps = {
  enviando: false,
  erro: null,
  onEnviar: vi.fn(),
  onVoltar: vi.fn(),
}

describe('RSVPForm', () => {
  it('renderiza o campo de nome', () => {
    render(<RSVPForm {...baseProps} />)
    expect(screen.getByPlaceholderText(/ex: maria silva/i)).toBeInTheDocument()
  })

  it('botão de enviar fica desabilitado com nome vazio', () => {
    render(<RSVPForm {...baseProps} />)
    expect(screen.getByRole('button', { name: /ver meu convite/i })).toBeDisabled()
  })

  it('botão habilita ao digitar nome válido', async () => {
    render(<RSVPForm {...baseProps} />)
    await userEvent.type(screen.getByPlaceholderText(/ex: maria silva/i), 'Ana')
    expect(screen.getByRole('button', { name: /ver meu convite/i })).not.toBeDisabled()
  })

  it('exibe campo de acompanhante ao marcar o checkbox', async () => {
    render(<RSVPForm {...baseProps} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(screen.getByPlaceholderText(/ex: joão silva/i)).toBeInTheDocument()
  })

  it('chama onEnviar com os dados corretos ao submeter', async () => {
    const onEnviar = vi.fn()
    render(<RSVPForm {...baseProps} onEnviar={onEnviar} />)
    await userEvent.type(screen.getByPlaceholderText(/ex: maria silva/i), 'Ana')
    await userEvent.click(screen.getByRole('button', { name: /ver meu convite/i }))
    expect(onEnviar).toHaveBeenCalledWith(
      expect.objectContaining({ nome: 'Ana', temAcompanhante: false }),
    )
  })

  it('exibe mensagem de erro quando erro não é null', () => {
    render(<RSVPForm {...baseProps} erro="Erro de teste" />)
    expect(screen.getByText('Erro de teste')).toBeInTheDocument()
  })

  it('chama onVoltar ao clicar em voltar', async () => {
    const onVoltar = vi.fn()
    render(<RSVPForm {...baseProps} onVoltar={onVoltar} />)
    await userEvent.click(screen.getByText(/← voltar/i))
    expect(onVoltar).toHaveBeenCalled()
  })
})
