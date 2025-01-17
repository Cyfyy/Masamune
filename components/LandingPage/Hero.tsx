'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { LoginModal } from '@/components/Login/login-modal'
import { Button } from '@/components/ui/button'

export function Hero() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  
  return (
    <>
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-background text-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-5">
          <motion.div 
            className="md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-6xl font-bold mb-4">
              Track Your Scholar <span className="text-orange-500">Axie Infinity</span> Progress
            </h1>
            <p className="text-xl md:text-base text-muted-foreground mb-8">
              The ultimate tool for Guild Managers to track their Scholars.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" onClick={() => setIsLoginModalOpen(true)}>
                Get Started
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="md:w-1/2 mt-12 md:mt-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 1.05 }}
          >
            <Image
              src="/images/axie.jpg"
              alt="Axie Infinity Origins"
              width={570}
              height={300}
              className="rounded-lg shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSwitchToSignup={() => console.log('Switching to signup modal')}
      />
    </>
  )
}

