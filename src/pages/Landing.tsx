import Card from '../components/Card'
import { festa } from '../config/festa'

export default function Landing({ onEscolha }: { onEscolha: (vai: boolean) => void }) {
  return (
    <Card>
      <p className="font-display text-sm uppercase tracking-[0.2em] text-turquesa">
        Convite de aniversário
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-creme sm:text-5xl">
        {festa.aniversariante}
        {festa.idade ? ` faz ${festa.idade} anos` : ' está de aniversário'}!
      </h1>
      <p className="mt-4 text-base leading-relaxed text-creme/80">{festa.mensagemConvite}</p>

      <p className="mt-8 font-display text-lg text-ouro">Você vai estar lá?</p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => onEscolha(true)}
          className="flex-1 rounded-2xl bg-fucsia px-6 py-4 font-display text-lg font-semibold text-creme transition hover:brightness-110 active:scale-[0.98]"
        >
          Sim, vou! 🎉
        </button>
        <button
          onClick={() => onEscolha(false)}
          className="flex-1 rounded-2xl border border-creme/20 bg-transparent px-6 py-4 font-display text-lg font-semibold text-creme/80 transition hover:bg-creme/5 active:scale-[0.98]"
        >
          Não vou poder
        </button>
      </div>
    </Card>
  )
}
