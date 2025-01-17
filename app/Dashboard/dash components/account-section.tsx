import React from 'react'
import { useSession } from "next-auth/react"

const AccountSection = () => {
    const { data: session } = useSession();

    return (
        <div className="flex flex-col min-h-screen items-center py-10 bg-gray-100 dark:bg-gray-800">
            {/* Header Section */}
            <div className="flex flex-col items-center mb-12">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">My Account</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">Manage or update your account here.</p>           
            </div>
            
            {/* Account Details */}
            <div className="flex flex-col gap-6 w-[90%] sm:w-[400px] mx-auto">
                
                {/* User Details Card */}
                <div className="p-6 border rounded-lg shadow-lg w-full bg-white dark:bg-gray-700 dark:border-gray-600">
                    <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">User Details</h4>
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Name:</span>
                            <span className="text-sm font-medium text-gray-800 dark:text-white">{session?.user?.name || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Email:</span>
                            <span className="text-sm font-medium text-gray-800 dark:text-white">{session?.user?.email || "N/A"}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                {/* <div className="flex justify-center gap-4 mt-6">
                    <button type="submit" className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-6 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        Update Account
                    </button>
                </div> */}
            </div>
        </div>
    )
}

export default AccountSection;
