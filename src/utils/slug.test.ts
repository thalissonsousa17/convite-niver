import { describe, it, expect } from 'vitest'
import { gerarSlug } from './slug'

describe('gerarSlug', () => {
  it('converte nome simples para minúsculo com hífens', () => {
    expect(gerarSlug('Familia Silva')).toBe('familia-silva')
  })

  it('remove acentos e cedilha', () => {
    expect(gerarSlug('João Conceição')).toBe('joao-conceicao')
    expect(gerarSlug('Família Araújo')).toBe('familia-araujo')
  })

  it('trata múltiplos espaços e caracteres especiais', () => {
    expect(gerarSlug('Casa  da  Tia')).toBe('casa-da-tia')
    expect(gerarSlug('Amigos & Família')).toBe('amigos-familia')
  })

  it('remove hífens no início e no fim', () => {
    expect(gerarSlug(' Turma ')).toBe('turma')
  })

  it('aceita números no slug', () => {
    expect(gerarSlug('Grupo 1')).toBe('grupo-1')
  })

  it('retorna string vazia para entrada vazia', () => {
    expect(gerarSlug('')).toBe('')
  })
})
