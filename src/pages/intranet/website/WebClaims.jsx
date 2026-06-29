import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { ChevronDown, ChevronRight } from 'lucide-react'

const STATUS_LIST = ['접수','처리중','완료','거절']
const STATUS_COLOR = { '접수':'bg-yellow-100 text-yellow-700','처리중':'bg-blue-100 text-blue-700','완료':'bg-green-100 text-green-700','거절':'bg-red-100 text-red-700' }

export default function WebClaims() {
  const [claims, setClaims] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('claims')
  const [expanded, setExpanded] = useState(null)
  const [notes, setNotes] = useState({})

  async function load() {
    setLoading(true)
    const [{ data: c }, { data: i }] = await Promise.all([
      supabase.from('claims').select('*, profiles(company_name,name,phone)').order('created_at', { ascending: false }),
      supabase.from('inquiries').select('*, profiles(company_name,name)').order('created_at', { ascending: false }),
    ])
    setClaims(c || [])
    setInquiries(i || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function updateClaimStatus(id, status, note) {
    const updates = { status }
    if (note !== undefined) updates.admin_note = note
    await supabase.from('claims').update(updates).eq('id', id)
    setClaims(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  async function replyInquiry(id, reply) {
    await supabase.from('inquiries').update({ reply, status: '답변완료' }).eq('id', id)
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, reply, status: '답변완료' } : i))
  }

  return (
    <div>
      <div className="mb-4 pb-3 border-b border-gray-200">
        <h1 className="text-base font-semibold text-gray-800">클레임 / 문의</h1>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('claims')}
          className={`px-4 py-2 rounded text-xs font-medium border ${tab==='claims' ? 'bg-[#1976d2] text-white border-[#1976d2]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
          클레임 ({claims.length})
        </button>
        <button onClick={() => setTab('inquiries')}
          className={`px-4 py-2 rounded text-xs font-medium border ${tab==='inquiries' ? 'bg-[#1976d2] text-white border-[#1976d2]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
          1:1 문의 ({inquiries.length})
        </button>
      </div>

      {loading ? <p className="text-sm text-gray-400 py-10 text-center">불러오는 중...</p> : tab === 'claims' ? (
        <div className="space-y-2">
          {claims.length === 0 ? <p className="text-sm text-gray-400 py-10 text-center">클레임이 없습니다.</p> : claims.map(c => (
            <div key={c.id} className="bg-white border border-gray-200 rounded">
              <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(expanded===c.id?null:c.id)}>
                {expanded===c.id ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div><p className="text-gray-400">거래처</p><p className="font-medium">{c.profiles?.company_name||c.profiles?.name||'-'}</p></div>
                  <div><p className="text-gray-400">유형</p><p>{c.type||'-'}</p></div>
                  <div><p className="text-gray-400">접수일</p><p>{new Date(c.created_at).toLocaleDateString('ko-KR')}</p></div>
                  <div>
                    <select value={c.status} onChange={e => updateClaimStatus(c.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded font-medium cursor-pointer border-0 ${STATUS_COLOR[c.status]||'bg-gray-100 text-gray-600'}`}
                      onClick={e => e.stopPropagation()}>
                      {STATUS_LIST.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              {expanded===c.id && (
                <div className="border-t border-gray-100 p-3 bg-gray-50 space-y-2">
                  <p className="text-xs text-gray-700"><span className="text-gray-400">사유:</span> {c.reason||'-'}</p>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">관리자 메모</label>
                    <div className="flex gap-2">
                      <input value={notes[c.id] ?? (c.admin_note||'')} onChange={e => setNotes(n=>({...n,[c.id]:e.target.value}))}
                        className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#1976d2]" placeholder="메모 입력" />
                      <button onClick={() => updateClaimStatus(c.id, c.status, notes[c.id]??c.admin_note)}
                        className="px-3 py-1 bg-[#1976d2] text-white text-xs rounded">저장</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {inquiries.length === 0 ? <p className="text-sm text-gray-400 py-10 text-center">문의가 없습니다.</p> : inquiries.map(i => (
            <div key={i.id} className="bg-white border border-gray-200 rounded">
              <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(expanded===i.id?null:i.id)}>
                {expanded===i.id ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
                <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  <div><p className="text-gray-400">거래처</p><p className="font-medium">{i.profiles?.company_name||i.profiles?.name||'-'}</p></div>
                  <div><p className="text-gray-400">제목</p><p className="truncate">{i.subject||'-'}</p></div>
                  <div><p className="text-gray-400">접수일</p><p>{new Date(i.created_at).toLocaleDateString('ko-KR')}</p></div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded flex-shrink-0 ${i.status==='답변완료' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{i.status||'미답변'}</span>
              </div>
              {expanded===i.id && (
                <div className="border-t border-gray-100 p-3 bg-gray-50 space-y-2">
                  <p className="text-xs text-gray-700 whitespace-pre-wrap">{i.content||'-'}</p>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">답변</label>
                    <div className="flex gap-2">
                      <textarea value={notes[i.id] ?? (i.reply||'')} onChange={e => setNotes(n=>({...n,[i.id]:e.target.value}))} rows={2}
                        className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs resize-none focus:outline-none focus:border-[#1976d2]" placeholder="답변 입력" />
                      <button onClick={() => replyInquiry(i.id, notes[i.id]??i.reply??'')}
                        className="px-3 bg-[#1976d2] text-white text-xs rounded">저장</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
