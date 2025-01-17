'use client';

import { motion } from 'framer-motion';

export function CallToAction() {
  return (
    <section id="cta" className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Empower Your Guild Management with Masamune
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Simplify your guild operations, track scholars' progress effortlessly, and make data-driven decisions to scale your guild efficiently. 
            With Masamune, you'll have all the tools you need to lead your guild to success.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              Why Choose Masamune?
            </h3>
            <ul className="list-disc list-inside space-y-3 text-lg">
              <li>Real-time insights into scholar performance and market trends.</li>
              <li>Effortless management of guilds and scholars, regardless of size.</li>
              <li>Powerful analytics to help you make informed decisions.</li>
              <li>Seamless tracking of scholar earnings, Axie progress, and more.</li>
            </ul>
          </div>

          <div className="relative mr-auto ml-auto">
            <div className="absolute inset-0 from-orange-600 to-orange-700 opacity-50 z-10"></div>
            <img 
              src="/images/wow-cta.png" 
              alt="Guild Manager" 
              className="rounded-lg shadow-lg w-[320px] h-[320px] bg-gradient-radial from-orange-500 to-gray-100 "
              style={{
                background: 'radial-gradient(circle, rgba(249,124,0,1) 0%, rgba(255,255,255,1) 61%)'
              }}
              
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
