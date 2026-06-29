import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useIntranetAuth } from '../../../context/IntranetAuthContext'
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'

const TYPE_COLOR = {
  '일정': 'bg-blue-500',
  '마감': 'bg-red-500',
  '회의': 'bg-green-500',
  '기타': 'bg-gray-400',
}

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

export default function CalendarPage() {
  const { intranetUser } = useIntranetAuth()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [events, setEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', date: '', type: '일정', note: '' })

  async function load() {
    const start = `${year}-${String(month+1).padStart(2,'0')}-01`
    const end = `${year}-${String(month+2).padStart(2,'0')}-01`
    const { data } = await supabase.from('intranet_calendar').select('*')
      .gte('date', start).lt('date', end).order('date')
    setEvents(data ?? [])
  }

  useEffect(() => { load() }, [year, month])

  function prevMonth() {
    if (month === 0) { setYear(y => y-1); setMonth(11) } else setMonth(m => m-1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y+1); setMonth(0) } else setMonth(m => m+1)
  }

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month+1, 0).getDate()
  const cells = Array.from({ length: Math.ceil((firstDay + daysInMonth) / 7) * 7 }, (_, i) => {
    const d = i - firstDay + 1
    return d > 0 && d <= daysInMonth ? d : null
  })

  const getEvents = day => {
    if (!day) return []
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return events.filter(e => e.date === dateStr)
  }

  const isToday = day => day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  async function handleCreate() {
    if (!form.title || !form.date) return
    await supabase.from('intranet_calendar').insert({ ...form, user_id: intranetUser?.id, user_name: intranetUser?.name })
    setShowModal(false)
    setForm({ title: '', date: selectedDate || '', type: '일정', note: '' })
    load()
  }

  async function handleDelete(id) {
    await supabase.from('intranet_calendar').delete().eq('id', id)
    load()
  }

  const selectedDateStr = selectedDate
    ? `${year}-${String(month+1).padStart(2,'0')}-${String(selectedDate).padStart(2,'0')}`
    : null

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-200">
        <h1 className="text-base font-semibold text-gray-800">캘린더</h1>
        <button
          onClick={() => { setShowModal(true); setForm(f => ({ ...f, date: selectedDateStr || today.toISOString().slice(0,10) })) }}
          className="flex items-center gap-1.5 bg-[#1976d2] text-white text-xs px-3 py-2 rounded hover:bg-[#1565c0]">
          <Plus size={14} /> 일정 추가
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded"><ChevronLeft size={18} /></button>
        <h2 className="text-sm font-semibold text-gray-800">{year}년 {month+1}월</h2>
        <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded"><ChevronRight size={18} /></button>
      </div>

      <div className="flex gap-4">
        {/* Calendar Grid */}
        <div className="flex-1 bg-white rounded border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-200">
            {DAYS.map((d, i) => (
              <div key={d} className={`py-2 text-center text-xs font-semibold ${i===0?'text-red-500':i===6?'text-blue-500':'text-gray-600'}`}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              const evts = getEvents(day)
              const isSelected = day && selectedDate === day
              return (
                <div
                  key={i}
                  onClick={() => day && setSelectedDate(day)}
                  className={`min-h-20 p-1.5 border-b border-r border-gray-100 cursor-pointer transition-colors
                    ${!day ? 'bg-gray-50' : 'hover:bg-blue-50'}
                    ${isSelected ? 'bg-blue-50' : ''}`}
                >
                  {day && (
                    <>
                      <span className={`inline-flex items-center justify-center w-6 h-6 text-xs rounded-full
                        ${isToday(day) ? 'bg-[#1976d2] text-white font-bold' : i%7===0 ? 'text-red-500' : i%7===6 ? 'text-blue-500' : 'text-gray-700'}`}>
                        {day}
                      </span>
                      <div className="mt-0.5 space-y-0.5">
                        {evts.slice(0,3).map(e => (
                          <div key={e.id} className={`text-white text-xs px-1 py-0.5 rounded truncate ${TYPE_COLOR[e.type] ?? 'bg-gray-400'}`}>
                            {e.title}
                          </div>
                        ))}
                        {evts.length > 3 && <div className="text-xs text-gray-400">+{evts.length-3}</div>}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Side panel */}
        <div className="w-56 flex-shrink-0">
          {selectedDate ? (
            <div className="bg-white rounded border border-gray-200 p-3">
              <h3 className="text-xs font-semibold text-gray-700 mb-2">{month+1}/{selectedDate} 일정</h3>
              {getEvents(selectedDate).length === 0 ? (
                <p className="text-xs text-gray-400">일정 없음</p>
              ) : (
                <div className="space-y-2">
                  {getEvents(selectedDate).map(e => (
                    <div key={e.id} className="flex items-start justify-between gap-1">
                      <div>
                        <span className={`inline-block w-2 h-2 rounded-full mr-1 ${TYPE_COLOR[e.type] ?? 'bg-gray-400'}`} />
                        <span className="text-xs text-gray-700">{e.title}</span>
                        {e.note && <p className="text-xs text-gray-400 ml-3">{e.note}</p>}
                      </div>
                      {e.user_id === intranetUser?.id && (
                        <button onClick={() => handleDelete(e.id)} className="text-gray-300 hover:text-red-500 flex-shrink-0">
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded border border-gray-200 p-3">
              <p className="text-xs text-gray-400">날짜를 클릭하면 일정이 표시됩니다.</p>
            </div>
          )}

          {/* Legend */}
          <div className="bg-white rounded border border-gray-200 p-3 mt-3">
            <h3 className="text-xs font-semibold text-gray-700 mb-2">분류</h3>
            {Object.entries(TYPE_COLOR).map(([k, v]) => (
              <div key={k} className="flex items-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${v}`} />
                <span className="text-xs text-gray-600">{k}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">일정 추가</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">일정명 *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="일정 제목" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">날짜 *</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">분류</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]">
                    {Object.keys(TYPE_COLOR).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">메모</label>
                <input value={form.note} onChange={e => setForm({...form, note: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="메모 (선택)" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50">취소</button>
              <button onClick={handleCreate} className="px-4 py-2 text-sm bg-[#1976d2] text-white rounded hover:bg-[#1565c0]">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
