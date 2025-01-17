import { LegalDialog } from '@/components/LandingPage/LegalDialog'

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Links Section */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-10 items-center">
            <LegalDialog type="terms">
              <button className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Terms of Use
              </button>
            </LegalDialog>
            <LegalDialog type="privacy">
              <button className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                Privacy Policy
              </button>
            </LegalDialog>
          </div>

          {/* Copyright Section */}
          <p className="text-base text-gray-500 dark:text-gray-400 text-center md:text-right">
            © 2024 Masamune. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

