import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const missingEnv = !supabaseUrl || !supabaseAnonKey

if (missingEnv) {
  console.warn(
    '[modo demo] Faltam VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY — respostas não serão salvas.'
  )
}

// Cliente mock usado quando o .env não está configurado (modo visual/demo)
const mockClient = {
  from: () => ({
    insert: async () => ({ error: null }),
    select: () => ({
      order: async () => ({ data: [], error: null }),
    }),
  }),
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
    signInWithPassword: async () => ({
      data: null,
      error: { message: 'Supabase não configurado' },
    }),
    signOut: async () => ({}),
  },
}

export const supabase = missingEnv
  ? (mockClient as any)
  : createClient(supabaseUrl, supabaseAnonKey)

export type Confirmacao = {
  id: string
  nome: string
  tem_acompanhante: boolean
  nome_acompanhante: string | null
  confirmado: boolean
  criado_em: string
}

export type Grupo = {
  id: string
  slug: string
  nome_grupo: string
  membros: string[]
  confirmado: boolean
  criado_em: string
}
