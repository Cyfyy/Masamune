'use client';

import { motion } from 'framer-motion'

export function Contact() {
  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Have questions? We're here to help!
          </p>
        </motion.div>
        <motion.form 
          className="max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Name</label>
            <input type="text" id="name" name="name" className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border rounded-lg focus:outline-none focus:border-orange-500" required />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Email</label>
            <input type="email" id="email" name="email" className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border rounded-lg focus:outline-none focus:border-orange-500" required />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Message</label>
            <textarea id="message" name="message" rows={4} className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border rounded-lg focus:outline-none focus:border-orange-500" required></textarea>
          </div>
          <motion.button 
            type="submit" 
            className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send Message
          </motion.button>
        </motion.form>
      </div>
    </section>
  )
}