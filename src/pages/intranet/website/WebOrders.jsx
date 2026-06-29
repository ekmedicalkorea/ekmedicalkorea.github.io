import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { ChevronDown, ChevronRight, Download } from 'lucide-react'

const STATUS_LIST = ['접수','처리중','배송중','완료','취소']
const STATUS_COLOR = {
  '접수':'bg-yellow-100 text-yellow-700',
  '처리중':'bg-blue-100 text-blue-700',
  '배송중':'bg-purple-100 text-purple-700',
  '완료':'bg-green-100 text-green-700',
  '취소':'bg-red-100 text-red-700',
}

export default function WebOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [updating, setUpdating] = useState(null)

  async function load() {
    setLoading(true)
    const { data: od } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    const { data: oi } = await supabase.from('order_items').select('*')
    if (od) setOrders(od.map(o => ({ ...o, items: (oi||[]).filter(i => i.order_id === o.id) })))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function updateStatus(id, status) {
    setUpdating(id)
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    setUpdating(null)
  }

  const filtered = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter)

  function exportCSV() {
    const rows = [['주문번호','거래처','담당자','연락처','상품','금액','상태','주문일']]
    filtered.forEach(o => {
      const items = (o.items||[]).map(i => `${i.product_name} x${i.quantity}`).join(' / ')
      rows.push([o.id.slice(0,8).toUpperCase(), o.hospital||'-', o.name||'-', o.phone||'-', items||'-', o.total_price||0, o.status, new Date(o.created_at).toLocaleDateString('ko-KR')])
    })
    const csv = '﻿' + rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `주문내역_${new Date().toLocaleDateString('ko-KR')}.csv`
    a.click()
  }

  return (
    <div>
      <div className="mb-4 pb-3 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-800">주문 관리</h1>
        <button onClick={exportCSV} className="flex items-center gap-1 text-xs border border-gray-300 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-50">
          <Download size={13} /> CSV 다운로드
        </button>
      </div>

      <div className="flex gap-1.5 mb-4 flex-wrap">
        {['all', ...STATUS_LIST].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${statusFilter===s ? 'bg-[#1976d2] text-white border-[#1976d2]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
            {s === 'all' ? `전체 (${orders.length})` : `${s} (${orders.filter(o=>o.status===s).length})`}
          </button>
        ))}
      </div>

      {loading ? <p className="text-sm text-gray-400 py-10 text-center">불러오는 중...</p> :
      filtered.length === 0 ? <p className="text-sm text-gray-400 py-10 text-center">주문이 없습니다.</p> : (
        <div className="space-y-2">
          {filtered.map(o => (
            <div key={o.id} className="bg-white border border-gray-200 rounded">
              <div className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(expanded===o.id?null:o.id)}>
                {expanded===o.id ? <ChevronDown size={14} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />}
                <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                  <div><p className="text-gray-400">주문번호</p><p className="font-mono font-medium">{o.id.slice(0,8).toUpperCase()}</p></div>
                  <div><p className="text-gray-400">거래처</p><p className="font-medium truncate">{o.hospital||'-'}</p></div>
                  <div><p className="text-gray-400">담당자</p><p className="truncate">{o.name||'-'}</p></div>
                  <div><p className="text-gray-400">금액</p><p className="font-semibold text-[#1976d2]">{Number(o.total_price||0).toLocaleString()}원</p></div>
                  <div><p className="text-gray-400">주문일</p><p>{new Date(o.created_at).toLocaleDateString('ko-KR')}</p></div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                  <select
                    value={o.status}
                    disabled={updating===o.id}
                    onChange={e => updateStatus(o.id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded border-0 font-medium cursor-pointer ${STATUS_COLOR[o.status]}`}>
                    {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              {expanded===o.id && (
                <div className="border-t border-gray-100 p-3 bg-gray-50">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs mb-3">
                    <div><span className="text-gray-400">연락처</span><p className="font-medium">{o.phone||'-'}</p></div>
                    <div><span className="text-gray-400">이메일</span><p className="font-medium">{o.email||'-'}</p></div>
                    <div><span className="text-gray-400">배송지</span><p className="font-medium">{o.address||'-'}</p></div>
                    {o.tracking_number && <div><span className="text-gray-400">운송장</span><p className="font-medium">{o.courier} {o.tracking_number}</p></div>}
                    {o.memo && <div className="col-span-2"><span className="text-gray-400">메모</span><p>{o.memo}</p></div>}
                  </div>
                  {(o.items||[]).length > 0 && (
                    <table className="w-full text-xs">
                      <thead><tr className="text-gray-400 border-b border-gray-200">
                        <th className="text-left pb-1">상품명</th><th className="text-right pb-1">수량</th><th className="text-right pb-1">단가</th><th className="text-right pb-1">소계</th>
                      </tr></thead>
                      <tbody>{(o.items||[]).map((i,idx) => (
                        <tr key={idx} className="border-b border-gray-100 last:border-0">
                          <td className="py-1">{i.product_name}</td>
                          <td className="py-1 text-right">{i.quantity}</td>
                          <td className="py-1 text-right">{Number(i.price||0).toLocaleString()}원</td>
                          <td className="py-1 text-right font-medium">{Number((i.price||0)*(i.quantity||1)).toLocaleString()}원</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
