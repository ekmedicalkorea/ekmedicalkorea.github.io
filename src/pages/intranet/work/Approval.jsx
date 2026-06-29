import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useIntranetAuth } from '../../../context/IntranetAuthContext'
import { Plus, FileText, CheckCircle, XCircle, Clock } from 'lucide-react'

const STATUS_COLOR = {
  '결재중': 'bg-blue-100 text-blue-700',
  '승인': 'bg-green-100 text-green-700',
  '반려': 'bg-red-100 text-red-700',
}

export default function Approval() {
  const { intranetUser } = useIntranetAuth()
  const [tab, setTab] = useState('all') // all | mine | pending
  const [docs, setDocs] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ title: '', content: '', approver_id: '' })

  async function load() {
    setLoading(true)
    let query = supabase.from('intranet_approvals').select('*').order('created_at', { ascending: false })
    if (tab === 'mine') query = query.eq('requester_id', intranetUser?.id)
    if (tab === 'pending') query = query.eq('approver_id', intranetUser?.id).eq('status', '결재중')
    const { data } = await query
    setDocs(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [tab, intranetUser])
  useEffect(() => { supabase.from('intranet_users').select('id, name').then(({ data }) => setUsers(data ?? [])) }, [])

  async function handleCreate() {
    if (!form.title || !form.approver_id) return
    await supabase.from('intranet_approvals').insert({
      ...form,
      requester_id: intranetUser?.id,
      requester_name: intranetUser?.name,
      status: '결재중',
    })
    setShowModal(false)
    setForm({ title: '', content: '', approver_id: '' })
    load()
  }

  async function handleApprove(id, status) {
    await supabase.from('intranet_approvals').update({ status, approved_at: new Date().toISOString() }).eq('id', id)
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status } : d))
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }))
  }

  const getName = id => users.find(u => u.id === id)?.name ?? id ?? '-'

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-200">
        <h1 className="text-base font-semibold text-gray-800">전자결재</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 bg-[#1976d2] text-white text-xs px-3 py-2 rounded hover:bg-[#1565c0]">
          <Plus size={14} /> 결재 요청
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {[['all','전체'], ['mine','내 결재'], ['pending','결재 대기']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 text-xs border-b-2 -mb-px transition-colors ${tab === id ? 'border-[#1976d2] text-[#1976d2] font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-4" style={{ minHeight: '400px' }}>
        {/* List */}
        <div className="w-80 flex-shrink-0 bg-white rounded border border-gray-200 overflow-hidden">
          {loading ? (
            <p className="text-xs text-gray-400 text-center py-10">불러오는 중...</p>
          ) : docs.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-10">결재 문서가 없습니다.</p>
          ) : docs.map(d => (
            <div key={d.id} onClick={() => setSelected(d)}
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === d.id ? 'bg-blue-50' : ''}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`px-1.5 py-0.5 rounded text-xs ${STATUS_COLOR[d.status] ?? 'bg-gray-100 text-gray-600'}`}>{d.status}</span>
                <span className="text-xs text-gray-400">{d.created_at?.slice(0,10)}</span>
              </div>
              <p className="text-xs font-medium text-gray-800 truncate">{d.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">요청: {getName(d.requester_id)}</p>
            </div>
          ))}
        </div>

        {/* Detail */}
        <div className="flex-1 bg-white rounded border border-gray-200 p-5">
          {selected ? (
            <>
              <div className="flex items-start justify-between mb-4 pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">{selected.title}</h2>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span>요청자: {getName(selected.requester_id)}</span>
                    <span>결재자: {getName(selected.approver_id)}</span>
                    <span>{selected.created_at?.slice(0,10)}</span>
                    <span className={`px-1.5 py-0.5 rounded ${STATUS_COLOR[selected.status] ?? 'bg-gray-100 text-gray-600'}`}>{selected.status}</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed mb-6">{selected.content || '내용 없음'}</div>
              {selected.status === '결재중' && selected.approver_id === intranetUser?.id && (
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button onClick={() => handleApprove(selected.id, '승인')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                    <CheckCircle size={13} /> 승인
                  </button>
                  <button onClick={() => handleApprove(selected.id, '반려')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white text-xs rounded hover:bg-red-600">
                    <XCircle size={13} /> 반려
                  </button>
                </div>
              )}
              {selected.approved_at && (
                <p className="text-xs text-gray-400 mt-3">처리일시: {new Date(selected.approved_at).toLocaleString('ko-KR')}</p>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <FileText size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">문서를 선택하세요.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">결재 요청</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">제목 *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="결재 문서 제목" />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">결재자 *</label>
                <select value={form.approver_id} onChange={e => setForm({...form, approver_id: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]">
                  <option value="">선택</option>
                  {users.filter(u => u.id !== intranetUser?.id).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">내용</label>
                <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={5} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2] resize-none" placeholder="결재 내용 입력" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">취소</button>
              <button onClick={handleCreate} className="px-4 py-2 text-sm bg-[#1976d2] text-white rounded hover:bg-[#1565c0]">제출</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
