"use client";

import React, { useState } from "react";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const query = new URLSearchParams(window.location.search);
  const token = query.get("token"); // Extract token from URL

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccessMessage(data.message);
    } else {
      setErrorMessage(data.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Reset Your Password</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </form>

        {errorMessage && (
          <p className="mt-4 text-sm text-red-600 text-center">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="mt-4 text-sm text-green-600 text-center">{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
