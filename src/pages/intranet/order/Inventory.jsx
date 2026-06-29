import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { Search, Package, AlertCircle } from 'lucide-react'

const CATEGORY_COLOR = {
  '의료소모품': 'bg-blue-100 text-blue-700',
  '화장품': 'bg-pink-100 text-pink-700',
  '주사제': 'bg-purple-100 text-purple-700',
}

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('전체')
  const [stats, setStats] = useState({ total: 0, byCategory: {} })

  async function load() {
    setLoading(true)
    let query = supabase.from('products').select('*').order('name')
    if (search) query = query.ilike('name', `%${search}%`)
    if (category !== '전체') query = query.eq('category', category)
    const { data } = await query
    const list = data ?? []
    setProducts(list)

    // stats
    const byCategory = {}
    list.forEach(p => { byCategory[p.category] = (byCategory[p.category] || 0) + 1 })
    setStats({ total: list.length, byCategory })
    setLoading(false)
  }

  useEffect(() => { load() }, [search, category])

  const categories = ['전체', '의료소모품', '화장품', '주사제']

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-200">
        <h1 className="text-base font-semibold text-gray-800">재고현황</h1>
        <p className="text-xs text-gray-500">Supabase DB 기준 실시간</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-white border border-gray-200 rounded p-3 text-center">
          <p className="text-xs text-gray-500">전체</p>
          <p className="text-xl font-bold text-gray-800 mt-1">{stats.total}</p>
        </div>
        {['의료소모품', '화장품', '주사제'].map(cat => (
          <div key={cat} className="bg-white border border-gray-200 rounded p-3 text-center">
            <p className="text-xs text-gray-500">{cat}</p>
            <p className="text-xl font-bold text-gray-800 mt-1">{stats.byCategory[cat] ?? 0}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="제품명 검색"
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#1976d2]" />
        </div>
        <div className="flex gap-1">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1.5 text-xs rounded border transition-colors ${category === c ? 'bg-[#1976d2] text-white border-[#1976d2]' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-600">제품명</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-600 w-24">카테고리</th>
              <th className="text-right px-3 py-2.5 text-xs font-medium text-gray-600 w-24">판매가</th>
              <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-600">제조사</th>
              <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-600">규격</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center text-xs text-gray-400 py-10">불러오는 중...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-xs text-gray-400 py-10">제품이 없습니다.</td></tr>
            ) : products.map((p, i) => (
              <tr key={p.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i%2===0?'':'bg-gray-50/40'}`}>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <Package size={13} className="text-gray-400 flex-shrink-0" />
                    <span className="text-xs font-medium text-gray-800">{p.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <span className={`px-1.5 py-0.5 rounded text-xs ${CATEGORY_COLOR[p.category] ?? 'bg-gray-100 text-gray-600'}`}>{p.category}</span>
                </td>
                <td className="px-3 py-2.5 text-right text-xs text-gray-700">
                  {p.price ? `${p.price.toLocaleString('ko-KR')}원` : '-'}
                </td>
                <td className="px-3 py-2.5 text-xs text-gray-600">{p.manufacturer ?? '-'}</td>
                <td className="px-3 py-2.5 text-xs text-gray-600">{p.specification ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-3 text-right">총 {products.length}발 제품</p>
    </div>
  )
}
