import { useState } from 'react'
import { LoginModal } from './login-modal'
import { ForgotPasswordModal } from './forgot-password-modal'

export default function ParentModal() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(true)
  const [isForgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false)

  // Switch to Forgot Password Modal
  const handleSwitchToForgotPassword = () => {
    setLoginModalOpen(false)  // Close login modal when switching
    setForgotPasswordModalOpen(true)  // Open forgot password modal
  }

  return (
    <>
      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToSignup={() => console.log('Switch to Signup')}
        onSwitchToForgotPassword={handleSwitchToForgotPassword}  // Switch to forgot password modal
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setForgotPasswordModalOpen(false)}  // Close forgot password modal
      />
    </>
  )
}
