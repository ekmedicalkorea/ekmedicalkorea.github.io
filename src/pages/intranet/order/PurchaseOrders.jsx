import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { Plus, X, Search } from 'lucide-react'

const STATUS_COLOR = {
  '요청': 'bg-yellow-100 text-yellow-700',
  '발주완료': 'bg-blue-100 text-blue-700',
  '입고완료': 'bg-green-100 text-green-700',
  '취소': 'bg-red-100 text-red-700',
}

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('전체')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ supplier: '', product: '', quantity: '', unit_price: '', status: '요청', order_date: '', expected_date: '', note: '' })

  async function load() {
    setLoading(true)
    let query = supabase.from('intranet_purchase_orders').select('*').order('order_date', { ascending: false })
    if (search) query = query.ilike('supplier', `%${search}%`)
    if (filterStatus !== '전체') query = query.eq('status', filterStatus)
    const { data } = await query
    setOrders(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [search, filterStatus])

  async function handleCreate() {
    if (!form.supplier || !form.product || !form.order_date) return
    await supabase.from('intranet_purchase_orders').insert({
      ...form,
      quantity: Number(form.quantity) || 0,
      unit_price: Number(form.unit_price) || 0,
    })
    setShowModal(false)
    setForm({ supplier: '', product: '', quantity: '', unit_price: '', status: '요청', order_date: '', expected_date: '', note: '' })
    load()
  }

  async function updateStatus(id, status) {
    await supabase.from('intranet_purchase_orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  async function handleDelete(id) {
    if (!confirm('삭제하시겠습니까?')) return
    await supabase.from('intranet_purchase_orders').delete().eq('id', id)
    setOrders(prev => prev.filter(o => o.id !== id))
  }

  const fmt = n => n?.toLocaleString('ko-KR') ?? '-'

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-200">
        <h1 className="text-base font-semibold text-gray-800">발주현황</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 bg-[#1976d2] text-white text-xs px-3 py-2 rounded hover:bg-[#1565c0]">
          <Plus size={14} /> 발주 등록
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="공급업체 검색"
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1976d2]" />
        </div>
        <div className="flex gap-1">
          {['전체', ...Object.keys(STATUS_COLOR)].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 text-xs rounded border transition-colors ${filterStatus === s ? 'bg-[#1976d2] text-white border-[#1976d2]' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-600">공급업체</th>
              <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-600">제품명</th>
              <th className="text-right px-3 py-2.5 text-xs font-medium text-gray-600 w-16">수량</th>
              <th className="text-right px-3 py-2.5 text-xs font-medium text-gray-600 w-28">합계</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-600 w-24">상태</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-600 w-24">발주일</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-600 w-24">입고예정일</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center text-xs text-gray-400 py-10">불러오는 중...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={8} className="text-center text-xs text-gray-400 py-10">발주 데이터가 없습니다.</td></tr>
            ) : orders.map((o, i) => (
              <tr key={o.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i%2===0?'':'bg-gray-50/40'}`}>
                <td className="px-4 py-2.5 text-xs font-medium text-gray-800">{o.supplier}</td>
                <td className="px-3 py-2.5 text-xs text-gray-700">{o.product}</td>
                <td className="px-3 py-2.5 text-xs text-right text-gray-700">{o.quantity}</td>
                <td className="px-3 py-2.5 text-xs text-right font-medium text-gray-800">{fmt(o.quantity * o.unit_price)}</td>
                <td className="px-3 py-2.5 text-center">
                  <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                    className={`px-1.5 py-0.5 rounded text-xs border-0 cursor-pointer ${STATUS_COLOR[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {Object.keys(STATUS_COLOR).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2.5 text-center text-xs text-gray-500">{o.order_date}</td>
                <td className="px-3 py-2.5 text-center text-xs text-gray-500">{o.expected_date ?? '-'}</td>
                <td className="px-2 py-2.5 text-center">
                  <button onClick={() => handleDelete(o.id)} className="text-gray-300 hover:text-red-500 transition-colors"><X size={13} /></button>
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
            <h2 className="text-sm font-semibold text-gray-800 mb-4">발주 등록</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">공급업체 *</label>
                  <input value={form.supplier} onChange={e => setForm({...form, supplier: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="공급업체명" />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">제품명 *</label>
                  <input value={form.product} onChange={e => setForm({...form, product: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="제품명" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">수량</label>
                  <input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="0" />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">단가 (원)</label>
                  <input type="number" value={form.unit_price} onChange={e => setForm({...form, unit_price: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">발주일 *</label>
                  <input type="date" value={form.order_date} onChange={e => setForm({...form, order_date: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">입고예정일</label>
                  <input type="date" value={form.expected_date} onChange={e => setForm({...form, expected_date: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">메모</label>
                <input value={form.note} onChange={e => setForm({...form, note: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="메모 (선택)" />
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
