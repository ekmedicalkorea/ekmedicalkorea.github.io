import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthModal({ onClose }) {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (mode === 'signup' && form.password !== form.confirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    setLoading(true)
    const { error } = mode === 'login'
      ? await signIn(form.email, form.password)
      : await signUp(form.email, form.password, form.name)
    setLoading(false)
    if (error) {
      setError(error.message === 'Invalid login credentials' ? '이메일 또는 비밀번호가 올바르지 않습니다.' : error.message)
    } else {
      if (mode === 'signup') {
        setError('가입 완료! 이제 로그인하세요.')
        setMode('login')
      } else {
        navigate('/')
        onClose()
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-300 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-1">{mode === 'login' ? '로그인' : '회원가입'}</h2>
        <p className="text-gray-400 text-sm mb-6">{mode === 'login' ? '계정에 로그인하세요.' : 'EK 메디칼 회원이 되세요.'}</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">이름 (병원명)</label>
              <input type="text" required value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="홍길동 / ○○피부과"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#1251A3]" />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">이메일</label>
            <input type="email" required value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="example@hospital.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#1251A3]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">비밀번호</label>
            <input type="password" required value={form.password} onChange={e => set('password', e.target.value)}
              placeholder="8자 이상"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#1251A3]" />
          </div>
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">비밀번호 확인</label>
              <input type="password" required value={form.confirm} onChange={e => set('confirm', e.target.value)}
                placeholder="비밀번호 재입력"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#1251A3]" />
            </div>
          )}
          {error && (
            <p className={`text-xs px-3 py-2 rounded-lg ${error.includes('완료') ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>{error}</p>
          )}
          <button type="submit" disabled={loading}
            className="btn-gradient w-full py-3 rounded-lg font-semibold disabled:opacity-50 mt-1">
            {loading ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          {mode === 'login' ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}{' '}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
            className="text-[#1251A3] font-medium hover:underline">
            {mode === 'login' ? '회원가입' : '로그인'}
          </button>
        </p>
      </div>
    </div>
  )
}
