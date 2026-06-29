import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { Plus, X, Search } from 'lucide-react'

const STATUS_COLOR = {
  '완료': 'bg-green-100 text-green-700',
  '진행중': 'bg-blue-100 text-blue-700',
  '취소': 'bg-red-100 text-red-700',
}

export default function SalesStatus() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ customer: '', product: '', quantity: '', unit_price: '', status: '완료', sale_date: '', note: '' })
  const [total, setTotal] = useState({ count: 0, amount: 0 })

  async function load() {
    setLoading(true)
    let query = supabase.from('intranet_sales').select('*').order('sale_date', { ascending: false })
    if (search) query = query.ilike('customer', `%${search}%`)
    const { data } = await query
    const list = data ?? []
    setSales(list)
    setTotal({
      count: list.length,
      amount: list.reduce((s, r) => s + (r.quantity * r.unit_price || 0), 0)
    })
    setLoading(false)
  }

  useEffect(() => { load() }, [search])

  async function handleCreate() {
    if (!form.customer || !form.product || !form.sale_date) return
    await supabase.from('intranet_sales').insert({
      ...form,
      quantity: Number(form.quantity) || 0,
      unit_price: Number(form.unit_price) || 0,
    })
    setShowModal(false)
    setForm({ customer: '', product: '', quantity: '', unit_price: '', status: '완료', sale_date: '', note: '' })
    load()
  }

  async function handleDelete(id) {
    if (!confirm('삭제하시겠습니까?')) return
    await supabase.from('intranet_sales').delete().eq('id', id)
    load()
  }

  const fmt = n => n?.toLocaleString('ko-KR') ?? '-'

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-200">
        <h1 className="text-base font-semibold text-gray-800">판매현황</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 bg-[#1976d2] text-white text-xs px-3 py-2 rounded hover:bg-[#1565c0]">
          <Plus size={14} /> 판매 등록
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white border border-gray-200 rounded p-4">
          <p className="text-xs text-gray-500">총 판매 건수</p>
          <p className="text-xl font-bold text-gray-800 mt-1">{total.count}건</p>
        </div>
        <div className="bg-white border border-gray-200 rounded p-4">
          <p className="text-xs text-gray-500">총 판매 금액</p>
          <p className="text-xl font-bold text-[#1976d2] mt-1">{fmt(total.amount)}원</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="거래처명 검색"
          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1976d2]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-600">거래처</th>
              <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-600">제품명</th>
              <th className="text-right px-3 py-2.5 text-xs font-medium text-gray-600 w-16">수량</th>
              <th className="text-right px-3 py-2.5 text-xs font-medium text-gray-600 w-24">단가</th>
              <th className="text-right px-3 py-2.5 text-xs font-medium text-gray-600 w-28">합계</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-600 w-16">상태</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-600 w-24">판매일</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center text-xs text-gray-400 py-10">불러오는 중...</td></tr>
            ) : sales.length === 0 ? (
              <tr><td colSpan={8} className="text-center text-xs text-gray-400 py-10">판매 데이터가 없습니다.</td></tr>
            ) : sales.map((s, i) => (
              <tr key={s.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i%2===0?'':'bg-gray-50/40'}`}>
                <td className="px-4 py-2.5 text-xs font-medium text-gray-800">{s.customer}</td>
                <td className="px-3 py-2.5 text-xs text-gray-700">{s.product}</td>
                <td className="px-3 py-2.5 text-xs text-right text-gray-700">{s.quantity}</td>
                <td className="px-3 py-2.5 text-xs text-right text-gray-700">{fmt(s.unit_price)}</td>
                <td className="px-3 py-2.5 text-xs text-right font-medium text-gray-800">{fmt(s.quantity * s.unit_price)}</td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`px-1.5 py-0.5 rounded text-xs ${STATUS_COLOR[s.status] ?? 'bg-gray-100 text-gray-600'}`}>{s.status}</span>
                </td>
                <td className="px-3 py-2.5 text-center text-xs text-gray-500">{s.sale_date}</td>
                <td className="px-2 py-2.5 text-center">
                  <button onClick={() => handleDelete(s.id)} className="text-gray-300 hover:text-red-500 transition-colors"><X size={13} /></button>
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
            <h2 className="text-sm font-semibold text-gray-800 mb-4">판매 등록</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">거래처 *</label>
                  <input value={form.customer} onChange={e => setForm({...form, customer: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="거래처명" />
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
                  <label className="text-xs text-gray-600 mb-1 block">판매일 *</label>
                  <input type="date" value={form.sale_date} onChange={e => setForm({...form, sale_date: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">상태</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]">
                    {Object.keys(STATUS_COLOR).map(s => <option key={s} value={s}>{s}</option>)}
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
              <button onClick={handleCreate} className="px-4 py-2 text-sm bg-[#1976d2] text-white rounded hover:bg-[#1565c0]">등록</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
