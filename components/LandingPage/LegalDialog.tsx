'use client'

import { useState } from 'react'
import TermsOfUse from '@/components/LandingPage/TermsOfUse'
import PrivacyPolicy from '@/components/LandingPage/PrivacyPolicy'

type LegalDocType = 'terms' | 'privacy'

export function LegalDialog({ children, type }: { children: React.ReactNode, type: LegalDocType }) {
  const [isOpen, setIsOpen] = useState(false)

  const title = type === 'terms' ? 'Terms of Use' : 'Privacy Policy'
  const Content = type === 'terms' ? TermsOfUse : PrivacyPolicy

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">{title}</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Close
              </button>
            </div>
            <div className="p-6">
              <Content />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

