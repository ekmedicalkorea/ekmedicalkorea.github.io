import { useState } from 'react'
import { useIntranetAuth } from '../../../context/IntranetAuthContext'
import { User, Lock, CheckCircle } from 'lucide-react'

export default function AccountSettings() {
  const { intranetUser, updatePassword } = useIntranetAuth()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setSuccess(false)
    if (!current || !next || !confirm) { setError('모든 항목을 입력해주세요.'); return }
    if (next !== confirm) { setError('새 비밀번호가 일치하지 않습니다.'); return }
    if (next.length < 4) { setError('비밀번호는 4자리 이상이어야 합니다.'); return }
    setLoading(true)
    const { error: err } = await updatePassword(current, next)
    setLoading(false)
    if (err) { setError(err); return }
    setSuccess(true)
    setCurrent(''); setNext(''); setConfirm('')
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-5 pb-3 border-b border-gray-200">
        <h1 className="text-base font-semibold text-gray-800">계정/비밀번호</h1>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
          <User size={15} className="text-[#1976d2]" /> 계정 정보
        </h2>
        <div className="space-y-3">
          <div className="flex border-b border-gray-50 pb-2">
            <span className="text-xs text-gray-500 w-24">이름</span>
            <span className="text-xs text-gray-800 font-medium">{intranetUser?.name}</span>
          </div>
          <div className="flex border-b border-gray-50 pb-2">
            <span className="text-xs text-gray-500 w-24">아이디</span>
            <span className="text-xs text-gray-800">{intranetUser?.username}</span>
          </div>
          <div className="flex border-b border-gray-50 pb-2">
            <span className="text-xs text-gray-500 w-24">직급/역할</span>
            <span className="text-xs text-gray-800">{intranetUser?.role ?? '-'}</span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded border border-gray-200 p-5">
        <h2 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
          <Lock size={15} className="text-[#1976d2]" /> 비밀번호 변경
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">현재 비밀번호</label>
            <input
              type="password"
              value={current}
              onChange={e => setCurrent(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]"
              placeholder="현재 비밀번호"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">새 비밀번호</label>
            <input
              type="password"
              value={next}
              onChange={e => setNext(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]"
              placeholder="새 비밀번호 (4자리 이상)"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">새 비밀번호 확인</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]"
              placeholder="새 비밀번호 재입력"
            />
          </div>
          {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
          {success && (
            <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
              <CheckCircle size={13} /> 비밀번호가 변경되었습니다.
            </div>
          )}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1976d2] hover:bg-[#1565c0] text-white text-sm py-2.5 rounded transition-colors disabled:opacity-60"
            >
              {loading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
