import React from 'react'

const LogsSection = () => {
  const logs = [
    { id: 1, timestamp: '2024-12-09', action: 'Logged in'},
    { id: 2, timestamp: '2024-12-09', action: 'Added 1 Scholar'},
    { id: 3, timestamp: '2024-12-09', action: 'Updated Scholar #1'},
    // { id: 4, timestamp: '2024-12-09 11:05:12', action: 'Logged out'},
  ];

  return (
    <div className="flex flex-col items-center min-h-screen py-10 bg-gray-100">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-12">
        <h3 className="text-2xl font-bold text-gray-800">Logs</h3>
        <p className="text-sm text-gray-500">View and manage your logs here.</p>
      </div>

      {/* Logs Card Section */}
      <div className="flex flex-col gap-6 w-[90%] sm:w-[400px] mx-auto">
        
        {/* Logs Card */}
        <div className="p-6 border rounded-lg shadow-lg w-full bg-white">
          <h4 className="text-xl font-semibold mb-4 text-gray-800">User Logs</h4>

          {/* Logs Display */}
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex justify-between p-4 border-b last:border-0">
                <span className="text-sm text-gray-600">{log.timestamp}</span>
                <div className="flex flex-col text-sm">
                  <span className="font-medium">{log.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogsSection;
