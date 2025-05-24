'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function LandingLoader() {
  const [step, setStep] = useState<'human' | 'logo' | 'text'>('human')

  useEffect(() => {
    const t1 = setTimeout(() => setStep('logo'), 2000)
    const t2 = setTimeout(() => setStep('text'), 3500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800 transition-all duration-700 ease-in-out">
      {step === 'human' && (
        <img
          src="/human-outline.svg"
          alt="Human"
          className="w-24 h-24 opacity-100 transition-opacity duration-700"
        />
      )}

      {step === 'logo' && (
        <Image
          src="/logo.png"
          alt="IGOR Logo"
          width={100}
          height={100}
          className="animate-pulse drop-shadow-lg transition-opacity duration-700"
        />
      )}

      {step === 'text' && (
        <div className="mt-6 text-center">
          <p className="text-lg italic text-gray-600">AI is taking over...</p>
          <p className="text-2xl font-bold mt-2">Bienvenido a IGOR</p>
        </div>
      )}
    </div>
  )
}
