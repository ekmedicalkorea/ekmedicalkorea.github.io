import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { Plus, X, Search } from 'lucide-react'

const STATUS_COLOR = {
  '�ƅ': 'bg-yellow-100 text-yellow-700',
  '흨정에': 'bg-blue-100 text-blue-700',
  '안고퐙': 'bg-green-100 text-green-700',
  '취소': 'bg-red-100 text-red-700',
}

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('전체')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ supplier: '', product: '', quantity: '', unit_price: '', status: '�ƅ', order_date: '', expected_date: '', note: '' })

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
    setForm({ supplier: '', product: '', quantity: '', unit_price: '', status: '�ƅ', order_date: '', expected_date: '', note: '' })
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
        <h1 className="text-base font-semibold text-gray-800">흨정완황</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 bg-[#1976d2] text-white text-xs px-3 py-2 rounded hover:bg-[#1565c0]">
          <Plus size={14} /> 흨� 비랛맅
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="가죁등큸 ��색"
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
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-600">가죋등큸</th>
              <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-600">제품명</th>
              <th className="text-right px-3 py-2.5 text-xs font-medium text-gray-600 w-16">수량</th>
              <th className="text-right px-3 py-2.5 text-xs font-medium text-gray-600 w-28">관가</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-600 w-24">상태</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-600 w-24">읨정�