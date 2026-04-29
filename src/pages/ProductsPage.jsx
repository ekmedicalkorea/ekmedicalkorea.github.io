import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { products, categories, categoryLabel } from '../data/products'
import { useCart } from '../context/CartContext'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || 'all'
  const searchQuery = searchParams.get('search') || ''
  const [addedId, setAddedId] = useState(null)
  const { addItem } = useCart()
  const navigate = useNavigate()

  let filtered = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory)
  if (searchQuery) filtered = filtered.filter(p => p.name.includes(searchQuery) || p.description.includes(searchQuery))

  function handleAddToCart(product) {
    addItem(product, 1)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  function handleOrder(product) {
    addItem(product, 1)
    navigate('/order')
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex gap-6">
      {/* 사이드바 */}
      <aside className="hidden md:block w-48 flex-shrink-0">
        <div className="card p-0 overflow-hidden">
          <div className="bg-[#1251A3] text-white text-sm font-semibold px-4 py-3">카테고리</div>
          <ul>
            {categories.map(cat => (
              <li key={cat.key}>
                <button
                  onClick={() => setSearchParams(cat.key === 'all' ? {} : { category: cat.key })}
                  className={`w-full text-left px-4 py-2.5 text-sm border-b border-gray-100 last:border-0 transition-colors ${
                    activeCategory === cat.key
                      ? 'bg-blue-50 text-[#1251A3] font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {cat.label}
                  <span className="float-right text-gray-400 text-xs">
                    {cat.key === 'all' ? products.length : products.filter(p => p.category === cat.key).length}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 min-w-0">
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              {searchQuery ? `"${searchQuery}" 검색 결과` : categories.find(c => c.key === activeCategory)?.label}
            </h1>
            <p className="text-sm text-gray-400">{filtered.length}개 제품</p>
          </div>
          {/* 모바일 카테고리 */}
          <div className="flex gap-2 md:hidden flex-wrap">
            {categories.map(cat => (
              <button key={cat.key}
                onClick={() => setSearchParams(cat.key === 'all' ? {} : { category: cat.key })}
                className={`px-3 py-1 rounded-full text-xs font-medium ${activeCategory === cat.key ? 'bg-[#1251A3] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 제품 그리드 */}
        {filtered.length === 0 ? (
          <div className="card p-16 text-center text-gray-400">검색 결과가 없습니다.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(product => (
              <div key={product.id} className="card p-4 flex flex-col">
                {/* 이미지 */}
                <div className="w-full aspect-square rounded-lg bg-gray-50 flex items-center justify-center mb-3 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>

                <span className="text-[10px] font-semibold text-[#1251A3] bg-blue-50 px-1.5 py-0.5 rounded self-start mb-1.5">
                  {categoryLabel[product.category]}
                </span>

                <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 flex-1">{product.name}</h3>
                <p className="text-xs text-gray-400 mb-2 line-clamp-2">{product.description}</p>

                <div className="mb-3">
                  <span className="text-base font-bold text-gray-900">{product.price.toLocaleString()}원</span>
                  <span className="text-xs text-gray-400 ml-1">/ {product.unit}</span>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                      addedId === product.id
                        ? 'bg-green-50 border-green-300 text-green-600'
                        : 'border-[#1251A3] text-[#1251A3] hover:bg-blue-50'
                    }`}
                  >
                    {addedId === product.id ? '✓ 담김' : '장바구니'}
                  </button>
                  <button
                    onClick={() => handleOrder(product)}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold bg-[#1251A3] text-white hover:bg-[#0e3f82] transition-colors"
                  >
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
