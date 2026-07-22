import { useEffect } from 'react'
import confetti from 'canvas-confetti'

const CORES = ['#0ea5e9', '#fbbf24', '#10b981', '#f97316', '#f0f9ff']

// Dispara a explosão de confete assim que o componente monta.
// Usado na tela de revelação do convite, o "momento" principal da experiência.
export default function ConfettiBurst() {
  useEffect(() => {
    const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduzMovimento) return

    const duracao = 1600
    const fim = Date.now() + duracao

    const disparar = () => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.6 },
        colors: CORES,
      })
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.6 },
        colors: CORES,
      })
      if (Date.now() < fim) {
        requestAnimationFrame(disparar)
      }
    }

    // Explosão central inicial + os dois jatos laterais em loop curto
    confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 }, colors: CORES })
    disparar()
  }, [])

  return null
}
