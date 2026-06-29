import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Search } from 'lucide-react'

const CAT = { consumables:'의료소모품', devices:'의료기기', cosmetics:'화장품', injectables:'주사제' }

export default function WebProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [stockEdits, setStockEdits] = useState({})

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('products').select('id,name,category,subcategory,price,unit,stock,is_active,manufacturer').order('name')
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function updateStock(id, val) {
    const stock = val === '' ? null : Math.max(0, parseInt(val) || 0)
    await supabase.from('products').update({ stock }).eq('id', id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock } : p))
    setStockEdits(prev => { const n = {...prev}; delete n[id]; return n })
  }

  async function toggleActive(id, current) {
    await supabase.from('products').update({ is_active: !current }).eq('id', id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p))
  }

  const filtered = products.filter(p => {
    const matchCat = catFilter === 'all' || p.category === catFilter
    const q = search.trim().toLowerCase()
    const matchSearch = !q || p.name?.toLowerCase().includes(q) || p.manufacturer?.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  const stockColor = (s) => s === null ? 'text-gray-400' : s === 0 ? 'text-red-600 font-bold' : s <= 10 ? 'text-orange-500 font-medium' : 'text-gray-700'

  return (
    <div>
      <div className="mb-4 pb-3 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-800">제품 관리</h1>
        <p className="text-xs text-gray-400">이미지 변경은 홈페이지 관리자 페이지를 이용하세요</p>
      </div>

      <div className="flex gap-2 mb-3 flex-wrap">
        {[['all','전체'], ...Object.entries(CAT)].map(([k,v]) => (
          <button key={k} onClick={() => setCatFilter(k)}
            className={`px-3 py-1.5 rounded text-xs font-medium border ${catFilter===k ? 'bg-[#1976d2] text-white border-[#1976d2]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
            {v} ({k==='all' ? products.length : products.filter(p=>p.category===k).length})
          </button>
        ))}
      </div>

      <div className="relative mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="제품명, 제조사 검색..."
          className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1976d2]" />
      </div>

      {loading ? <p className="text-sm text-gray-400 py-10 text-center">불러오는 중...</p> : (
        <div className="bg-white border border-gray-200 rounded overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['카테고리','제품명','가격','단위','재고','상태'].map(h => (
                <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2"><span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{CAT[p.category]||p.category}</span></td>
                  <td className="px-3 py-2">
                    <p className="text-xs font-medium text-gray-800 truncate max-w-[200px]">{p.name}</p>
                    {p.manufacturer && <p className="text-[10px] text-gray-400">{p.manufacturer}</p>}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-700">{isNaN(Number(p.price)) ? p.price : Number(p.price).toLocaleString()+'원'}</td>
                  <td className="px-3 py-2 text-xs text-gray-500">{p.unit||'-'}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <input
                        type="number" min="0"
                        value={stockEdits[p.id] ?? (p.stock ?? '')}
                        onChange={e => setStockEdits(prev => ({...prev, [p.id]: e.target.value}))}
                        onBlur={e => stockEdits[p.id] !== undefined && updateStock(p.id, e.target.value)}
                        placeholder="미관리"
                        className={`w-16 border rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-[#1976d2] ${
                          p.stock===0 ? 'border-red-300 bg-red-50' : p.stock!==null && p.stock<=10 ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                        } ${stockColor(p.stock)}`}
                      />
                      {p.stock === 0 && <span className="text-[10px] text-red-500 font-bold">품절</span>}
                      {p.stock !== null && p.stock > 0 && p.stock <= 10 && <span className="text-[10px] text-orange-500">부족</span>}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => toggleActive(p.id, p.is_active)}
                      className={`text-xs px-2 py-1 rounded-full font-medium ${p.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {p.is_active ? '판매중' : '숨김'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-sm text-gray-400 py-8 text-center">검색 결과가 없습니다.</p>}
        </div>
      )}
    </div>
  )
}
