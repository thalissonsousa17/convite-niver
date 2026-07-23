import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  },
}))

import AdminLogin from './AdminLogin'

describe('AdminLogin', () => {
  it('renderiza campos de e-mail e senha', () => {
    render(<AdminLogin />)
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('campo senha começa como password (oculto)', () => {
    render(<AdminLogin />)
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password')
  })

  it('clique no olho revela a senha', async () => {
    render(<AdminLogin />)
    const toggle = screen.getByRole('button', { name: /mostrar senha/i })
    await userEvent.click(toggle)
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'text')
  })

  it('segundo clique no olho oculta a senha novamente', async () => {
    render(<AdminLogin />)
    await userEvent.click(screen.getByRole('button', { name: /mostrar senha/i }))
    await userEvent.click(screen.getByRole('button', { name: /ocultar senha/i }))
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password')
  })

  it('botão Entrar está presente', () => {
    render(<AdminLogin />)
    expect(screen.getByRole('button', { name: /^entrar$/i })).toBeInTheDocument()
  })
})
