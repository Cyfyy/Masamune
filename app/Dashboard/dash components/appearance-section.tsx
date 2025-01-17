import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

const Appearance = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col items-center min-h-screen py-10 bg-gray-100">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-12">
        <h3 className="text-2xl font-bold text-gray-800">Appearance</h3>
        <p className="text-sm text-gray-500">Change the theme of the dashboard.</p>
      </div>

      {/* Theme Change Section */}
      <div className="flex flex-col gap-6 w-[90%] sm:w-[400px] mx-auto">
        
        {/* Theme Card */}
        <div className="p-6 border rounded-lg shadow-lg w-full bg-white">
          <h4 className="text-xl font-semibold mb-4 text-gray-800">Change Theme</h4>
          <div className="flex flex-col space-y-4">
            
            {/* Theme Toggle Button */}
            <div className="flex justify-between w-full mt-5">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex w-full items-center justify-between py-3 px-6 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 transition-colors duration-300 ease-in-out outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {theme === 'dark' ? (
                  <Sun className="h-6 w-6 text-yellow-500" />
                ) : (
                  <Moon className="h-6 w-6 text-gray-800" />
                )}
                <span className="ml-3 text-sm font-semibold text-gray-700">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>
            </div>

            {/* Reserved for Future Use */}
            <div className="flex justify-between"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Appearance
