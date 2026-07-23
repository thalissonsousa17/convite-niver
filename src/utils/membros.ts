export function listarMembros(membros: string[]): string {
  if (membros.length === 0) return ''
  if (membros.length === 1) return membros[0]
  const ultimo = membros[membros.length - 1]
  const demais = membros.slice(0, -1)
  return `${demais.join(', ')} e ${ultimo}`
}
