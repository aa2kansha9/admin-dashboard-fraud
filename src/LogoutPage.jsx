import { FiShield, FiCheckCircle, FiHome } from 'react-icons/fi'

function LogoutPage({ onLogin }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-[#C05746] to-[#1A365D] rounded-2xl flex items-center justify-center shadow-lg">
              <FiShield className="text-white text-3xl" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </div>

        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheckCircle className="text-green-500 text-4xl" />
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-[#1A365D] mb-2">Logged Out Successfully</h1>
        <p className="text-gray-500 mb-6">
          Thank you for using FraudShield Admin Portal. You have been securely logged out.
        </p>

        {/* Login Button */}
        <button
          onClick={onLogin}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#C05746] text-white rounded-xl hover:bg-red-600 transition shadow-md"
        >
          <FiHome size={18} />
          Back to Login
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-8">
          FraudShield Admin Portal v1.0 | Protecting users from financial fraud
        </p>
      </div>
    </div>
  )
}

export default LogoutPage