import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { CheckCircle, XCircle, Pencil, X, Mail, KeyRound } from 'lucide-react'

const STATUS_TABS = [
  { key: 'pending',  label: '승인 대기', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { key: 'approved', label: '승인 완료', color: 'bg-green-50  text-green-700  border-green-200'  },
  { key: 'rejected', label: '거절',      color: 'bg-red-50    text-red-700    border-red-200'    },
]

const EMPTY_FORM = { company_name:'', contact_name:'', phone:'', email:'' }

export default function WebPartners() {
  const [profiles, setProfiles]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [tab, setTab]                 = useState('pending')
  const [processing, setProcessing]   = useState(null)

  // 수정 모달
  const [editTarget, setEditTarget]   = useState(null)   // profile object
  const [form, setForm]               = useState(EMPTY_FORM)
  const [saving, setSaving]           = useState(false)
  const [resetSent, setResetSent]     = useState({})     // { [id]: true }
  const [resetLoading, setResetLoading] = useState(null)

  async function load(status) {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('status', status)
      .eq('is_admin', false)
      .order('created_at', { ascending: false })
    setProfiles(data || [])
    setLoading(false)
  }

  useEffect(() => { load(tab) }, [tab])

  async function updateStatus(id, status) {
    setProcessing(id)
    await supabase.from('profiles').update({ status }).eq('id', id)
    setProfiles(prev => prev.filter(p => p.id !== id))
    setProcessing(null)
  }

  function openEdit(p) {
    setForm({
      company_name:  p.company_name || p.hospital || '',
      contact_name:  p.contact_name || p.name || '',
      phone:         p.phone || '',
      email:         p.email || '',
    })
    setEditTarget(p)
  }

  async function handleSave() {
    if (!form.email.trim()) return alert('이메일(ID)을 입력하세요.')
    setSaving(true)
    const { error } = await supabase.from('profiles').update({
      company_name: form.company_name.trim() || null,
      contact_name: form.contact_name.trim() || null,
      phone:        form.phone.trim() || null,
      email:        form.email.trim(),
    }).eq('id', editTarget.id)

    if (!error) {
      setProfiles(prev => prev.map(p =>
        p.id === editTarget.id
          ? { ...p, company_name: form.company_name, contact_name: form.contact_name, phone: form.phone, email: form.email }
          : p
      ))
      setEditTarget(null)
    } else {
      alert('저장 실패: ' + error.message)
    }
    setSaving(false)
  }

  async function sendResetEmail(p) {
    const email = p.email
    if (!email) return alert('이메일 정보가 없습니다.')
    setResetLoading(p.id)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://ekmedicalkorea.com/#/reset-password',
    })
    if (!error) {
      setResetSent(prev => ({ ...prev, [p.id]: true }))
    } else {
      alert('발송 실패: ' + error.message)
    }
    setResetLoading(null)
  }

  return (
    <div>
      <div className="mb-4 pb-3 border-b border-gray-200">
        <h1 className="text-base font-semibold text-gray-800">거래처 관리</h1>
      </div>

      <div className="flex gap-2 mb-4">
        {STATUS_TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded text-xs font-medium border transition-all ${tab===t.key ? t.color : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading
        ? <p className="text-sm text-gray-400 py-10 text-center">불러오는 중...</p>
        : profiles.length === 0
          ? <p className="text-sm text-gray-400 py-10 text-center">해당 거래처가 없습니다.</p>
          : (
        <div className="space-y-3">
          {profiles.map(p => {
            const company = p.company_name || p.hospital || '-'
            const contact = p.contact_name || p.name || '-'
            return (
              <div key={p.id} className="bg-white border border-gray-200 rounded p-4">

                {/* 승인 완료 탭: ID(이메일) 강조 배너 */}
                {tab === 'approved' && (
                  <div className="mb-3 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded px-3 py-2">
                    <Mail size={13} className="text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-blue-400 font-medium">로그인 ID (이메일)</p>
                      <p className="text-xs font-semibold text-blue-700">{p.email || '등록 없음'}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
                  {[
                    ['상호명', company],
                    ['담당자', contact],
                    ['연락처', p.phone || '-'],
                    ['이메일', p.email || '-'],
                    ['사업자번호', p.business_number || '-'],
                    ['신청일', new Date(p.created_at).toLocaleDateString('ko-KR')],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-gray-400 mb-0.5">{label}</p>
                      <p className="font-medium text-gray-800">{val}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-100 flex-wrap">
                  {/* 승인 대기 */}
                  {tab === 'pending' && (
                    <>
                      <button disabled={processing===p.id} onClick={() => updateStatus(p.id, 'approved')}
                        className="flex items-center gap-1 px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs rounded disabled:opacity-50">
                        <CheckCircle size={13} /> 승인
                      </button>
                      <button disabled={processing===p.id} onClick={() => updateStatus(p.id, 'rejected')}
                        className="flex items-center gap-1 px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-xs rounded disabled:opacity-50">
                        <XCircle size={13} /> 거절
                      </button>
                    </>
                  )}

                  {/* 승인 완료 */}
                  {tab === 'approved' && (
                    <>
                      <button onClick={() => openEdit(p)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs rounded border border-blue-200">
                        <Pencil size={12} /> 정보 수정
                      </button>
                      <button
                        disabled={resetLoading === p.id || resetSent[p.id]}
                        onClick={() => sendResetEmail(p)}
                        className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded border ${
                          resetSent[p.id]
                            ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-default'
                            : 'bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200'
                        }`}>
                        <KeyRound size={12} />
                        {resetLoading === p.id ? '발송 중...' : resetSent[p.id] ? '이메일 발송됨' : '비밀번호 재설정'}
                      </button>
                      <button disabled={processing===p.id} onClick={() => updateStatus(p.id, 'rejected')}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded">
                        승인 취소
                      </button>
                    </>
                  )}

                  {/* 거절 */}
                  {tab === 'rejected' && (
                    <button disabled={processing===p.id} onClick={() => updateStatus(p.id, 'approved')}
                      className="px-4 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-xs rounded">
                      승인으로 변경
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── 수정 모달 ── */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="font-semibold text-gray-800">거래처 정보 수정</h2>
              <button onClick={() => setEditTarget(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            <div className="p-5 space-y-3">
              {/* 이메일 (ID) */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  로그인 ID (이메일) *
                </label>
                <input value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]"
                  placeholder="example@email.com" />
                <p className="text-[11px] text-gray-400 mt-1">※ 이메일 변경 시 거래처 로그인 ID가 변경됩니다.</p>
              </div>

              {/* 상호명 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">상호명 / 병원명</label>
                <input value={form.company_name} onChange={e => setForm(f => ({...f, company_name: e.target.value}))}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" />
              </div>

              {/* 담당자 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">담당자명</label>
                <input value={form.contact_name} onChange={e => setForm(f => ({...f, contact_name: e.target.value}))}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" />
              </div>

              {/* 연락처 */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">연락처</label>
                <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" />
              </div>

              <div className="bg-blue-50 rounded p-3 text-xs text-blue-600">
                <p className="font-medium mb-0.5">비밀번호 변경 방법</p>
                <p>목록에서 <span className="font-semibold">비밀번호 재설정</span> 버튼을 누르면 거래처 이메일로 재설정 링크가 발송됩니다.</p>
              </div>
            </div>

            <div className="px-5 py-4 border-t flex gap-2 justify-end">
              <button onClick={() => setEditTarget(null)}
                className="px-4 py-2 text-sm border border-gray-200 rounded text-gray-500 hover:bg-gray-50">취소</button>
              <button onClick={handleSave} disabled={saving}
                className="px-4 py-2 text-sm bg-[#1976d2] text-white rounded hover:bg-[#1565c0] disabled:opacity-50 font-medium">
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
