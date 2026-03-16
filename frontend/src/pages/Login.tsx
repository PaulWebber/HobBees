/**
 * Login Page Component
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/store/context/AuthContext'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

const Login = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [passwordByteLength, setPasswordByteLength] = useState(0)
  
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    // Calculate byte length
    const byteLength = new TextEncoder().encode(newPassword).length
    setPasswordByteLength(byteLength)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Validate password length (bcrypt has 72-byte limit)
      const passwordBytes = new TextEncoder().encode(password).length
      if (passwordBytes > 72) {
        setError('Password is too long. Maximum is 72 bytes. Please use a shorter password.')
        setIsLoading(false)
        return
      }

      if (isRegisterMode) {
        await register(username, email, password)
      } else {
        await login(username, password)
      }
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bee-black px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-bee-yellow mb-2">🐝 HobBees</h1>
          <p className="text-gray-600">Track your hobbies with ease</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />

          {isRegisterMode && (
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          )}

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            placeholder="Enter your password"
          />
          {isRegisterMode && passwordByteLength > 60 && (
            <p className={`text-xs mt-1 ${passwordByteLength > 72 ? 'text-red-600' : 'text-yellow-600'}`}>
              Password length: {passwordByteLength}/72 bytes
              {passwordByteLength > 72 && ' - Too long!'}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Please wait...' : isRegisterMode ? 'Register' : 'Login'}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode)
              setError('')
            }}
            className="text-bee-yellow hover:text-bee-yellow-dark text-sm"
          >
            {isRegisterMode
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
