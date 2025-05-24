'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function LandingAnimation() {
  const [step, setStep] = useState<'start' | 'glitch' | 'logo' | 'text'>('start')

  useEffect(() => {
    const t1 = setTimeout(() => setStep('glitch'), 1500)
    const t2 = setTimeout(() => setStep('logo'), 3000)
    const t3 = setTimeout(() => setStep('text'), 4500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  return (
    <div className={`${inter.className} relative flex flex-col items-center justify-center h-screen bg-black text-white transition-all duration-1000 ease-in-out`}>
      {step === 'start' && (
        <img
          src="/human-outline.svg"
          alt="Human"
          className="w-24 h-24 opacity-100 transition-opacity duration-1000"
        />
      )}

      {step === 'glitch' && (
        <img
          src="/human-outline.svg"
          alt="Human Glitch"
          className="w-24 h-24 animate-glitch"
        />
      )}

      {step === 'logo' && (
        <Image
          src="/logo.png"
          alt="IGOR Logo"
          width={100}
          height={100}
          className="animate-fade-in drop-shadow-xl"
        />
      )}

      {step === 'text' && (
        <div className="mt-8 text-center animate-fade-in">
          <p className="text-2xl font-semibold tracking-wide">Say welcome to IGOR</p>
        </div>
      )}

      <style jsx>{`
        @keyframes glitch {
          0% { transform: translate(0px, 0px); opacity: 1; }
          20% { transform: translate(-2px, 1px); opacity: 0.8; }
          40% { transform: translate(2px, -1px); opacity: 1; }
          60% { transform: translate(-1px, 2px); opacity: 0.9; }
          80% { transform: translate(1px, -2px); opacity: 1; }
          100% { transform: translate(0px, 0px); opacity: 1; }
        }
        .animate-glitch {
          animation: glitch 0.3s infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-in-out forwards;
        }
      `}</style>
    </div>
  )
}
