import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Landing from './Landing'

describe('Landing', () => {
  it('exibe o nome do aniversariante no título', () => {
    render(<Landing onEscolha={vi.fn()} />)
    expect(screen.getByRole('heading', { name: /thalisson/i })).toBeInTheDocument()
  })

  it('exibe os dois botões de resposta', () => {
    render(<Landing onEscolha={vi.fn()} />)
    expect(screen.getByText(/sim, vou/i)).toBeInTheDocument()
    expect(screen.getByText(/não vou poder/i)).toBeInTheDocument()
  })

  it('chama onEscolha(true) ao clicar em "Sim, vou"', async () => {
    const onEscolha = vi.fn()
    render(<Landing onEscolha={onEscolha} />)
    await userEvent.click(screen.getByText(/sim, vou/i))
    expect(onEscolha).toHaveBeenCalledWith(true)
  })

  it('chama onEscolha(false) ao clicar em "Não vou poder"', async () => {
    const onEscolha = vi.fn()
    render(<Landing onEscolha={onEscolha} />)
    await userEvent.click(screen.getByText(/não vou poder/i))
    expect(onEscolha).toHaveBeenCalledWith(false)
  })
})
