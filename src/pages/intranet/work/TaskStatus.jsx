import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useIntranetAuth } from '../../../context/IntranetAuthContext'
import { Plus, X } from 'lucide-react'

const STATUS_LIST = ['대기', '진행중', '완료']
const PRIORITY_LIST = ['낮음', '보통', '높음', '긴급']

const statusColor = {
  '대기': 'bg-gray-100 text-gray-600',
  '진행중': 'bg-blue-100 text-blue-700',
  '완료': 'bg-green-100 text-green-700',
}
const priorityColor = {
  '낮음': 'bg-gray-100 text-gray-500',
  '보통': 'bg-yellow-100 text-yellow-700',
  '높음': 'bg-orange-100 text-orange-700',
  '긴급': 'bg-red-100 text-red-700',
}

export default function TaskStatus() {
  const { intranetUser } = useIntranetAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('전체')
  const [users, setUsers] = useState([])

  const [form, setForm] = useState({ title: '', assignee_id: '', priority: '보통', due_date: '', note: '' })

  async function load() {
    setLoading(true)
    let query = supabase.from('intranet_tasks').select('*').order('created_at', { ascending: false })
    if (filterStatus !== '전체') query = query.eq('status', filterStatus)
    const { data } = await query
    setTasks(data ?? [])
    setLoading(false)
  }

  async function loadUsers() {
    const { data } = await supabase.from('intranet_users').select('id, name')
    setUsers(data ?? [])
  }

  useEffect(() => { load() }, [filterStatus])
  useEffect(() => { loadUsers() }, [])

  async function handleCreate() {
    if (!form.title) return
    await supabase.from('intranet_tasks').insert({
      ...form,
      status: '대기',
      creator_id: intranetUser?.id,
      creator_name: intranetUser?.name,
    })
    setShowModal(false)
    setForm({ title: '', assignee_id: '', priority: '보통', due_date: '', note: '' })
    load()
  }

  async function updateStatus(id, status) {
    await supabase.from('intranet_tasks').update({ status }).eq('id', id)
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
  }

  async function deleteTask(id) {
    if (!confirm('삭제하시겠습니까?')) return
    await supabase.from('intranet_tasks').delete().eq('id', id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const getName = id => users.find(u => u.id === id)?.name ?? id ?? '-'

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-200">
        <h1 className="text-base font-semibold text-gray-800">업무현황</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 bg-[#1976d2] text-white text-xs px-3 py-2 rounded hover:bg-[#1565c0]">
          <Plus size={14} /> 업무 등록
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-1.5 mb-4">
        {['전체', ...STATUS_LIST].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 text-xs rounded border transition-colors ${filterStatus === s ? 'bg-[#1976d2] text-white border-[#1976d2]' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-600">업무명</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-600 w-20">우선순위</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-600 w-20">담당자</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-600 w-20">상태</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-600 w-24">마감일</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-600 w-16">삭제</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center text-xs text-gray-400 py-10">불러오는 중...</td></tr>
            ) : tasks.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-xs text-gray-400 py-10">등록된 업무가 없습니다.</td></tr>
            ) : tasks.map((t, i) => (
              <tr key={t.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                <td className="px-4 py-2.5">
                  <p className="text-xs text-gray-800 font-medium">{t.title}</p>
                  {t.note && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{t.note}</p>}
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`px-2 py-0.5 rounded text-xs ${priorityColor[t.priority] ?? 'bg-gray-100 text-gray-600'}`}>{t.priority}</span>
                </td>
                <td className="px-3 py-2.5 text-center text-xs text-gray-600">{getName(t.assignee_id)}</td>
                <td className="px-3 py-2.5 text-center">
                  <select
                    value={t.status}
                    onChange={e => updateStatus(t.id, e.target.value)}
                    className={`px-2 py-0.5 rounded text-xs border-0 cursor-pointer ${statusColor[t.status] ?? 'bg-gray-100 text-gray-600'}`}
                  >
                    {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2.5 text-center text-xs text-gray-600">{t.due_date ?? '-'}</td>
                <td className="px-3 py-2.5 text-center">
                  <button onClick={() => deleteTask(t.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <X size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">업무 등록</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">업무명 *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="업무명 입력" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">담당자</label>
                  <select value={form.assignee_id} onChange={e => setForm({...form, assignee_id: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]">
                    <option value="">선택</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">우선순위</label>
                  <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]">
                    {PRIORITY_LIST.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">마감일</label>
                <input type="date" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">메모</label>
                <textarea value={form.note} onChange={e => setForm({...form, note: e.target.value})} rows={3} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2] resize-none" placeholder="메모 (선택)" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">취소</button>
              <button onClick={handleCreate} className="px-4 py-2 text-sm bg-[#1976d2] text-white rounded hover:bg-[#1565c0]">등록</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
