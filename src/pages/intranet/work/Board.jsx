import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useIntranetAuth } from '../../../context/IntranetAuthContext'
import { Plus, ArrowLeft, Trash2 } from 'lucide-react'

const CATEGORIES = ['전체', '공지', '업무', '기타']
const CAT_COLOR = { '공지': 'bg-red-100 text-red-700', '업무': 'bg-blue-100 text-blue-700', '기타': 'bg-gray-100 text-gray-600' }

export default function Board() {
  const { intranetUser } = useIntranetAuth()
  const [posts, setPosts] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('전체')
  const [showWrite, setShowWrite] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', category: '업무' })
  const [page, setPage] = useState(1)
  const PER_PAGE = 15

  async function load() {
    setLoading(true)
    let query = supabase.from('intranet_board').select('*', { count: 'exact' }).order('created_at', { ascending: false })
    if (category !== '전체') query = query.eq('category', category)
    const { data } = await query.range((page-1)*PER_PAGE, page*PER_PAGE-1)
    setPosts(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [category, page])

  async function handleCreate() {
    if (!form.title || !form.content) return
    await supabase.from('intranet_board').insert({
      ...form,
      author_id: intranetUser?.id,
      author_name: intranetUser?.name,
    })
    setShowWrite(false)
    setForm({ title: '', content: '', category: '업무' })
    load()
  }

  async function handleDelete(id) {
    if (!confirm('삭제하시겠습니까?')) return
    await supabase.from('intranet_board').delete().eq('id', id)
    setSelected(null)
    load()
  }

  const fmt = iso => iso ? new Date(iso).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' }) : ''

  if (showWrite) return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-200">
        <button onClick={() => setShowWrite(false)} className="text-gray-400 hover:text-gray-600"><ArrowLeft size={16} /></button>
        <h1 className="text-base font-semibold text-gray-800">게시글 작성</h1>
      </div>
      <div className="bg-white rounded border border-gray-200 p-5 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="text-xs text-gray-600 mb-1 block">제목 *</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="제목 입력" />
          </div>
          <div>
            <label className="text-xs text-gray-600 mb-1 block">분류</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]">
              {['공지','업무','기타'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">내용 *</label>
          <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={12} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2] resize-none" placeholder="내용 입력" />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={() => setShowWrite(false)} className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">취소</button>
          <button onClick={handleCreate} className="px-4 py-2 text-sm bg-[#1976d2] text-white rounded hover:bg-[#1565c0]">등록</button>
        </div>
      </div>
    </div>
  )

  if (selected) return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-200">
        <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><ArrowLeft size={16} /></button>
        <h1 className="text-base font-semibold text-gray-800">업무게시판</h1>
      </div>
      <div className="bg-white rounded border border-gray-200 p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-2 py-0.5 rounded text-xs ${CAT_COLOR[selected.category] ?? 'bg-gray-100 text-gray-600'}`}>{selected.category}</span>
              <h2 className="text-sm font-semibold text-gray-800">{selected.title}</h2>
            </div>
            <p className="text-xs text-gray-500">{selected.author_name} · {fmt(selected.created_at)}</p>
          </div>
          {selected.author_id === intranetUser?.id && (
            <button onClick={() => handleDelete(selected.id)} className="text-gray-300 hover:text-red-500 transition-colors">
              <Trash2 size={15} />
            </button>
          )}
        </div>
        <div className="border-t border-gray-100 pt-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {selected.content}
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-200">
        <h1 className="text-base font-semibold text-gray-800">업무게시판</h1>
        <button onClick={() => setShowWrite(true)} className="flex items-center gap-1.5 bg-[#1976d2] text-white text-xs px-3 py-2 rounded hover:bg-[#1565c0]">
          <Plus size={14} /> 글 작성
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-1.5 mb-4">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => { setCategory(c); setPage(1) }}
            className={`px-3 py-1.5 text-xs rounded border transition-colors ${category === c ? 'bg-[#1976d2] text-white border-[#1976d2]' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-600 w-16">분류</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-600">제목</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-600 w-20">작성자</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-600 w-24">작성일</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center text-xs text-gray-400 py-10">불러오는 중...</td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan={4} className="text-center text-xs text-gray-400 py-10">게시글이 없습니다.</td></tr>
            ) : posts.map((p, i) => (
              <tr key={p.id} onClick={() => setSelected(p)}
                className={`border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
                <td className="px-3 py-2.5 text-center">
                  <span className={`px-1.5 py-0.5 rounded text-xs ${CAT_COLOR[p.category] ?? 'bg-gray-100 text-gray-600'}`}>{p.category}</span>
                </td>
                <td className="px-4 py-2.5 text-xs text-gray-800 font-medium hover:text-[#1976d2]">{p.title}</td>
                <td className="px-3 py-2.5 text-center text-xs text-gray-500">{p.author_name}</td>
                <td className="px-3 py-2.5 text-center text-xs text-gray-500">{fmt(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-1 mt-4">
        <button onClick={() => setPage(v => Math.max(1, v-1))} disabled={page === 1}
          className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40">이전</button>
        <span className="px-3 py-1.5 text-xs text-gray-600">{page} 페이지</span>
        <button onClick={() => setPage(v => v+1)} disabled={posts.length < PER_PAGE}
          className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40">다음</button>
      </div>
    </div>
  )
}
