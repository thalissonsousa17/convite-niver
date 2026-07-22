import Card from '../components/Card'
import { festa } from '../config/festa'

export default function Decline({ onVoltar }: { onVoltar: () => void }) {
  return (
    <Card className="text-center">
      <p className="text-4xl">💌</p>
      <h2 className="mt-4 font-display text-2xl font-bold text-creme">
        Que pena que você não vai poder vir!
      </h2>
      <p className="mt-3 text-creme/70">
        Sua resposta foi registrada. {festa.aniversariante} vai sentir sua falta, mas vamos
        brindar com carinho por você também. 🥂
      </p>
      <button
        onClick={onVoltar}
        className="mt-6 rounded-2xl border border-creme/20 px-6 py-3 text-sm text-creme/80 transition hover:bg-creme/5"
      >
        Voltar
      </button>
    </Card>
  )
}
