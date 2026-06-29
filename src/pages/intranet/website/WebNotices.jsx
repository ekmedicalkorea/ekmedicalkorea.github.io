import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Plus, Pencil, Trash2, Pin, X } from 'lucide-react'

export default function WebNotices() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title:'', content:'', category:'공지', is_pinned:false })
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('notices').select('*').order('is_pinned', { ascending: false }).order('created_at', { ascending: false })
    setNotices(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setEditing(null)
    setForm({ title:'', content:'', category:'공지', is_pinned:false })
    setModal(true)
  }

  function openEdit(n) {
    setEditing(n.id)
    setForm({ title:n.title, content:n.content||'', category:n.category||'공지', is_pinned:n.is_pinned||false })
    setModal(true)
  }

  async function handleSave() {
    if (!form.title.trim()) return
    setSaving(true)
    if (editing) {
      await supabase.from('notices').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing)
    } else {
      await supabase.from('notices').insert(form)
    }
    setSaving(false)
    setModal(false)
    load()
  }

  async function handleDelete(id) {
    if (!window.confirm('공지사항을 삭제하시겠습니까?')) return
    await supabase.from('notices').delete().eq('id', id)
    setNotices(prev => prev.filter(n => n.id !== id))
  }

  async function togglePin(id, current) {
    await supabase.from('notices').update({ is_pinned: !current }).eq('id', id)
    setNotices(prev => prev.map(n => n.id === id ? { ...n, is_pinned: !current } : n))
  }

  async function toggleActive(id, current) {
    await supabase.from('notices').update({ is_active: !current }).eq('id', id)
    setNotices(prev => prev.map(n => n.id === id ? { ...n, is_active: !current } : n))
  }

  return (
    <div>
      <div className="mb-4 pb-3 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-800">공지사항</h1>
        <button onClick={openAdd} className="flex items-center gap-1 text-xs bg-[#1976d2] hover:bg-[#1565c0] text-white px-3 py-1.5 rounded">
          <Plus size={13} /> 공지 추가
        </button>
      </div>

      {loading ? <p className="text-sm text-gray-400 py-10 text-center">불러오는 중...</p> :
      notices.length === 0 ? <p className="text-sm text-gray-400 py-10 text-center">공지사항이 없습니다.</p> : (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          {notices.map((n, idx) => (
            <div key={n.id} className={`flex items-start gap-3 p-3 ${idx > 0 ? 'border-t border-gray-100' : ''} hover:bg-gray-50`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {n.is_pinned && <Pin size={11} className="text-[#1976d2] flex-shrink-0" />}
                  <span className="text-xs font-medium text-gray-800 truncate">{n.title}</span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded flex-shrink-0">{n.category}</span>
                </div>
                {n.content && <p className="text-[11px] text-gray-400 truncate">{n.content}</p>}
                <p className="text-[10px] text-gray-300 mt-0.5">{new Date(n.created_at).toLocaleDateString('ko-KR')}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleActive(n.id, n.is_active)}
                  className={`text-[10px] px-2 py-0.5 rounded ${n.is_active !== false ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {n.is_active !== false ? '게시중' : '숨김'}
                </button>
                <button onClick={() => togglePin(n.id, n.is_pinned)} title="상단고정"
                  className={`p-1 rounded hover:bg-blue-50 ${n.is_pinned ? 'text-[#1976d2]' : 'text-gray-300 hover:text-[#1976d2]'}`}>
                  <Pin size={13} />
                </button>
                <button onClick={() => openEdit(n)} className="p-1 rounded text-gray-400 hover:text-[#1976d2] hover:bg-blue-50"><Pencil size={13} /></button>
                <button onClick={() => handleDelete(n.id)} className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">{editing ? '공지 수정' : '공지 추가'}</h3>
              <button onClick={() => setModal(false)}><X size={16} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-600 mb-1 block">제목 *</label>
                  <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="공지 제목" />
                </div>
                <div className="w-28">
                  <label className="text-xs text-gray-600 mb-1 block">분류</label>
                  <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]">
                    <option>공지</option><option>이벤트</option><option>업데이트</option><option>기타</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">내용</label>
                <textarea value={form.content} onChange={e => setForm(f=>({...f,content:e.target.value}))} rows={5}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2] resize-none" placeholder="공지 내용" />
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" checked={form.is_pinned} onChange={e => setForm(f=>({...f,is_pinned:e.target.checked}))} />
                상단 고정
              </label>
            </div>
            <div className="flex gap-2 px-5 pb-5">
              <button onClick={() => setModal(false)} className="flex-1 border border-gray-300 text-gray-600 text-sm py-2 rounded hover:bg-gray-50">취소</button>
              <button onClick={handleSave} disabled={saving || !form.title.trim()}
                className="flex-1 bg-[#1976d2] hover:bg-[#1565c0] text-white text-sm py-2 rounded disabled:opacity-60">
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
