import { describe, it, expect } from 'vitest'
import { listarMembros } from './membros'

describe('listarMembros', () => {
  it('retorna o único nome quando há um só membro', () => {
    expect(listarMembros(['Ana'])).toBe('Ana')
  })

  it('une dois membros com "e"', () => {
    expect(listarMembros(['Ana', 'Pedro'])).toBe('Ana e Pedro')
  })

  it('une três membros com vírgula e "e" no final', () => {
    expect(listarMembros(['Ana', 'Pedro', 'Lucas'])).toBe('Ana, Pedro e Lucas')
  })

  it('une quatro ou mais membros corretamente', () => {
    expect(listarMembros(['Ana', 'Pedro', 'Lucas', 'Bia'])).toBe('Ana, Pedro, Lucas e Bia')
  })

  it('retorna string vazia para array vazio', () => {
    expect(listarMembros([])).toBe('')
  })
})
