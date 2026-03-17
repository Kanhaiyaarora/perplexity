import React, { useState } from 'react'
import { Link } from 'react-router'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = event => {
    event.preventDefault()
    // TODO: replace with real call to backend auth/register API
    console.log('Register submit', { username, email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-cyan-950 to-blue-950 p-5">
      <div className="w-full max-w-md bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 sm:p-10">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-cyan-300 drop-shadow-sm">Create Account</h1>
          <p className="text-sm text-slate-300 mt-2">Register now to access advanced features.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block text-slate-100">
            <span className="text-sm font-semibold">Username</span>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              placeholder="john_doe"
              className="mt-2 w-full rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-2 text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </label>

          <label className="block text-slate-100">
            <span className="text-sm font-semibold">Email</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="email@example.com"
              className="mt-2 w-full rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-2 text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </label>

          <label className="block text-slate-100">
            <span className="text-sm font-semibold">Password</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-2 text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </label>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/40 hover:from-cyan-400 hover:to-blue-400 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-300">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-300 hover:text-indigo-100">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
