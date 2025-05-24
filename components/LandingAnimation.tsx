'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function LandingAnimation() {
  const [step, setStep] = useState<'start' | 'glitch' | 'logo' | 'text' | 'login'>('start')

  useEffect(() => {
    const t1 = setTimeout(() => setStep('glitch'), 1500)
    const t2 = setTimeout(() => setStep('logo'), 3000)
    const t3 = setTimeout(() => setStep('text'), 4500)
    const t4 = setTimeout(() => setStep('login'), 7000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [])

  return (
    <div className={`${inter.className} h-screen w-screen overflow-hidden bg-black text-white transition-all duration-1000 ease-in-out`}>
      <div className={`flex h-full transition-all duration-1000 ease-in-out ${step === 'login' ? 'w-1/2' : 'w-full'} items-center justify-center`}>
        {step === 'start' && <img src="/human-outline.svg" alt="Human" className="w-24 h-24" />}
        {step === 'glitch' && <img src="/human-outline.svg" alt="Human Glitch" className="w-24 h-24 animate-glitch" />}
        {step === 'logo' && <Image src="/logo.png" alt="IGOR Logo" width={200} height={200} className="animate-fade-in drop-shadow-xl" />}
        {step === 'text' && (
          <div className="mt-8 text-center animate-fade-in">
            <p className="text-4xl font-semibold tracking-wide">Say HI to IGOR</p>
          </div>
        )}
      </div>

      {step === 'login' && (
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white text-black flex items-center justify-center animate-fade-in">
          <div className="w-2/3 max-w-md text-center">
            <Image src="/logo.png" alt="IGOR Logo" width={60} height={60} className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4">Iniciar sesión</h2>
            <input type="text" placeholder="User" className="w-full mb-2 px-4 py-2 bg-gray-300 text-black" />
            <input type="password" placeholder="Password" className="w-full mb-4 px-4 py-2 bg-gray-300 text-black" />
            <button className="px-6 py-2 bg-gray-700 text-white">Login</button>
          </div>
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
