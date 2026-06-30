import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'

const CATEGORIES = [
  { key: 'all', label: '전체' },
  { key: 'consumables', label: '의료소모품' },
  { key: 'injectables', label: '주사제' },
  { key: 'devices', label: '의료기기' },
  { key: 'cosmetics', label: '화장품' },
]
const CAT_LABEL = {
  consumables: '의료소모품',
  injectables: '주사제',
  devices: '의료기기',
  cosmetics: '화장품',
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || 'all'
  const activeSubcat = searchParams.get('subcategory') || ''
  const searchQuery = searchParams.get('search') || ''

  const [products, setProducts] = useState([])
  const [catCounts, setCatCounts] = useState({})
  const [subcats, setSubcats] = useState([])
  const [loading, setLoading] = useState(true)
  const [addedId, setAddedId] = useState(null)
  const { addItem } = useCart()
  const navigate = useNavigate()

  // 카테고리별 개수 + subcategory 목록 로드
  useEffect(() => {
    async function loadMeta() {
      const { data } = await supabase
        .from('products')
        .select('category, subcategory')
        .eq('is_active', true)
      if (!data) return
      const counts = { all: data.length }
      CATEGORIES.forEach(c => {
        if (c.key !== 'all') counts[c.key] = data.filter(p => p.category === c.key).length
      })
      setCatCounts(counts)

      if (activeCategory !== 'all') {
        const subs = [...new Set(data.filter(p => p.category === activeCategory && p.subcategory).map(p => p.subcategory))]
        setSubcats(subs.sort())
      } else {
        setSubcats([])
      }
    }
    loadMeta()
  }, [activeCategory])

  // 제품 로드
  useEffect(() => {
    async function load() {
      setLoading(true)
      let query = supabase.from('products').select('*').eq('is_active', true).order('name', { ascending: true })
      if (activeCategory !== 'all') query = query.eq('category', activeCategory)
      if (activeSubcat) query = query.eq('subcategory', activeSubcat)
      if (searchQuery) query = query.ilike('name', `%${searchQuery}%`)
      const { data } = await query
      setProducts(data || [])
      setLoading(false)
    }
    load()
  }, [activeCategory, activeSubcat, searchQuery])

  function setCategory(key) {
    if (key === 'all') setSearchParams({})
    else setSearchParams({ category: key })
  }

  function setSubcategory(sub) {
    if (activeSubcat === sub) setSearchParams({ category: activeCategory })
    else setSearchParams({ category: activeCategory, subcategory: sub })
  }

  function handleAddToCart(product) {
    addItem(product, 1)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  function handleOrder(product) {
    addItem(product, 1)
    navigate('/order')
  }

  const pageLabel = activeSubcat
    ? activeSubcat
    : (searchQuery ? `"${searchQuery}" 검색 결과` : CATEGORIES.find(c => c.key === activeCategory)?.label)

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex gap-6">
      {/* 사이드바 */}
      <aside className="hidden md:block w-48 flex-shrink-0">
        <div className="card p-0 overflow-hidden">
          <div className="bg-[#1251A3] text-white text-sm font-semibold px-4 py-3">카테고리</div>
          <ul>
            {CATEGORIES.map(cat => (
              <li key={cat.key}>
                <button
                  onClick={() => setCategory(cat.key)}
                  className={`w-full text-left px-4 py-2.5 text-sm border-b border-gray-100 flex items-center justify-between transition-colors ${
                    activeCategory === cat.key && !activeSubcat ? 'bg-blue-50 text-[#1251A3] font-semibold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.label}</span>
                  {catCounts[cat.key] !== undefined && (
                    <span className="text-xs text-gray-400 font-normal">{catCounts[cat.key]}</span>
                  )}
                </button>
                {/* 하위 카테고리 */}
                {activeCategory === cat.key && cat.key !== 'all' && subcats.length > 0 && (
                  <ul className="bg-gray-50 border-b border-gray-100">
                    {subcats.map(sub => (
                      <li key={sub}>
                        <button
                          onClick={() => setSubcategory(sub)}
                          className={`w-full text-left px-6 py-2 text-xs border-b border-gray-100 last:border-0 transition-colors ${
                            activeSubcat === sub ? 'bg-blue-100 text-[#1251A3] font-semibold' : 'text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          └ {sub}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-800">{pageLabel}</h1>
            <p className="text-sm text-gray-400">{loading ? '로딩 중...' : `${products.length}개 제품`}</p>
          </div>
          {/* 모바일 카테고리 */}
          <div className="flex gap-2 md:hidden flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${activeCategory === cat.key ? 'bg-[#1251A3] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="w-full aspect-square rounded-lg bg-gray-100 mb-3" />
                <div className="h-3 bg-gray-100 rounded mb-2 w-1/3" />
                <div className="h-4 bg-gray-100 rounded mb-1" />
                <div className="h-3 bg-gray-100 rounded mb-3 w-2/3" />
                <div className="h-8 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="card p-16 text-center text-gray-400">제품이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <div key={product.id} className="card p-4 flex flex-col">
                <div className="w-full aspect-square rounded-lg bg-gray-50 flex items-center justify-center mb-3 overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                </div>
                <span className="text-[10px] font-semibold text-[#1251A3] bg-blue-50 px-1.5 py-0.5 rounded self-start mb-1.5">
                  {product.subcategory || CAT_LABEL[product.category] || product.category}
                </span>
                <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 flex-1">{product.name}</h3>
                <p className="text-xs text-gray-400 mb-2 line-clamp-2">{product.description}</p>
                <div className="mb-3">
                  <span className="text-base font-bold text-gray-900">{Number(product.price).toLocaleString()}원</span>
                  {product.unit && <span className="text-xs text-gray-400 ml-1">/ {product.unit}</span>}
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => handleAddToCart(product)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                      addedId === product.id ? 'bg-green-50 border-green-300 text-green-600' : 'border-[#1251A3] text-[#1251A3] hover:bg-blue-50'
                    }`}>
                    {addedId === product.id ? '✓ 담김' : '장바구니'}
                  </button>
                  <button onClick={() => handleOrder(product)}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold bg-[#1251A3] text-white hover:bg-[#0e3f82] transition-colors">
                    주문하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
