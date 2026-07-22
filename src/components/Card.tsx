import type { ReactNode } from 'react'

export default function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative z-10 w-full max-w-md rounded-[28px] border border-ouro/20 bg-noite-2 p-8 shadow-2xl shadow-black/40 sm:p-10 ${className}`}
    >
      {children}
    </div>
  )
}
