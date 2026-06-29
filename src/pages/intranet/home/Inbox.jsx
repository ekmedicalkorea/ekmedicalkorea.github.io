import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useIntranetAuth } from '../../../context/IntranetAuthContext'
import { Send, Inbox as InboxIcon, Trash2, RefreshCw, PenSquare } from 'lucide-react'

function PageHeader({ title }) {
  return (
    <div className="mb-5 pb-3 border-b border-gray-200">
      <h1 className="text-base font-semibold text-gray-800">{title}</h1>
    </div>
  )
}

export default function InboxPage() {
  const { intranetUser } = useIntranetAuth()
  const [tab, setTab] = useState('received') // received | sent
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showCompose, setShowCompose] = useState(false)
  const [users, setUsers] = useState([])

  // Compose state
  const [toId, setToId] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)

  async function loadMessages() {
    if (!intranetUser) return
    setLoading(true)
    setSelected(null)
    let query = supabase.from('intranet_inbox').select('*').order('created_at', { ascending: false })
    if (tab === 'received') query = query.eq('receiver_id', intranetUser.id)
    else query = query.eq('sender_id', intranetUser.id)
    const { data } = await query
    setMessages(data ?? [])
    setLoading(false)
  }

  async function loadUsers() {
    const { data } = await supabase.from('intranet_users').select('id, name').neq('id', intranetUser?.id)
    setUsers(data ?? [])
  }

  useEffect(() => { loadMessages() }, [tab, intranetUser])
  useEffect(() => { loadUsers() }, [intranetUser])

  async function markRead(msg) {
    setSelected(msg)
    if (tab === 'received' && !msg.is_read) {
      await supabase.from('intranet_inbox').update({ is_read: true }).eq('id', msg.id)
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m))
    }
  }

  async function handleDelete(id) {
    await supabase.from('intranet_inbox').delete().eq('id', id)
    setMessages(prev => prev.filter(m => m.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  async function handleSend() {
    if (!toId || !subject || !body) return
    setSending(true)
    await supabase.from('intranet_inbox').insert({
      sender_id: intranetUser.id,
      sender_name: intranetUser.name,
      receiver_id: toId,
      subject,
      body,
      is_read: false,
    })
    setSending(false)
    setShowCompose(false)
    setToId(''); setSubject(''); setBody('')
    if (tab === 'sent') loadMessages()
  }

  const fmt = iso => iso ? new Date(iso).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="소통인박스" />

      {/* Compose modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">새 메시지 작성</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">받는 사람</label>
                <select value={toId} onChange={e => setToId(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]">
                  <option value="">선택</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">제목</label>
                <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="제목 입력" />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">내용</label>
                <textarea value={body} onChange={e => setBody(e.target.value)} rows={5} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2] resize-none" placeholder="내용 입력" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowCompose(false)} className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">취소</button>
              <button onClick={handleSend} disabled={sending} className="px-4 py-2 text-sm bg-[#1976d2] text-white rounded hover:bg-[#1565c0] disabled:opacity-60 flex items-center gap-2">
                <Send size={14} />{sending ? '전송 중...' : '전송'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded border border-gray-200 flex" style={{ height: 'calc(100vh - 220px)', minHeight: '400px' }}>
        {/* Left panel */}
        <div className="w-72 border-r border-gray-200 flex flex-col flex-shrink-0">
          {/* Action */}
          <div className="p-3 border-b border-gray-100 flex items-center gap-2">
            <button
              onClick={() => setShowCompose(true)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#1976d2] text-white text-xs py-2 rounded hover:bg-[#1565c0] transition-colors"
            >
              <PenSquare size={13} /> 새 메시지
            </button>
            <button onClick={loadMessages} className="p-2 border border-gray-200 rounded hover:bg-gray-50">
              <RefreshCw size={13} className="text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {[['received', '받은 메시지', InboxIcon], ['sent', '보낸 메시지', Send]].map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs transition-colors ${tab === id ? 'border-b-2 border-[#1976d2] text-[#1976d2] font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Icon size={12} />{label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="text-xs text-gray-400 text-center py-8">불러오는 중...</p>
            ) : messages.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">메시지가 없습니다.</p>
            ) : messages.map(m => (
              <div
                key={m.id}
                onClick={() => markRead(m)}
                className={`p-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === m.id ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-xs font-medium ${!m.is_read && tab === 'received' ? 'text-gray-900' : 'text-gray-600'}`}>
                    {tab === 'received' ? m.sender_name : m.receiver_id}
                  </span>
                  <span className="text-xs text-gray-400">{fmt(m.created_at)}</span>
                </div>
                <p className={`text-xs truncate ${!m.is_read && tab === 'received' ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>{m.subject}</p>
                {!m.is_read && tab === 'received' && (
                  <span className="inline-block w-1.5 h-1.5 bg-[#1976d2] rounded-full mt-1" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selected ? (
            <div className="p-5 flex-1 overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">{selected.subject}</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {tab === 'received' ? `보낸 사람: ${selected.sender_name}` : `받는 사람: ${selected.receiver_id}`} · {fmt(selected.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed border-t border-gray-100 pt-4">
                {selected.body}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-gray-400">메시지를 선택하세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
