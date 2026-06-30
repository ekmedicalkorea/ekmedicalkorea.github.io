import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'


const CAT_LABEL = { consumables: '의료소모품', devices: '의료기기', cosmetics: '화장품' }
const categories = [
  { key: 'consumables', label: '의료소모품', icon: '💉', desc: '주사기, 장갑, 드레싱 등' },
  { key: 'devices', label: '의료기기', icon: '🏥', desc: '레이저, 충격파, 진단기 등' },
  { key: 'cosmetics', label: '화장품', icon: '✨', desc: '재생세럼, 자외선차단제 등' },
]

export default function HomePage() {
  const { addItem } = useCart()
  const [addedId, setAddedId] = useState(null)
  const [bestProducts, setBestProducts] = useState([])

  useEffect(() => {
    supabase.from('products').select('*').eq('is_active', true).order('created_at', { ascending: true }).limit(6)
      .then(({ data }) => setBestProducts(data || []))
  }, [])

  function handleAdd(product) {
    addItem(product, 1)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <div className="min-h-screen">
      {/* 히어로 배너 */}
      <section className="bg-gradient-to-r from-[#1251A3] to-[#1a6fd4] text-white py-14 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-2 uppercase tracking-widest">EK 메디칼 공식 쇼핑몰</p>
            <h1 className="text-xl md:text-2xl font-bold mb-6 leading-tight">
              의료기기·소모품·화장품<br />한 곳에서 편리하게 주문하세요
            </h1>
            <div className="flex gap-3 flex-wrap">
              <Link to="/products" className="bg-white text-[#1251A3] font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors">
                전체 제품 보기
              </Link>
              <Link to="/order" className="border border-white/40 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-white/10 transition-colors">
                주문 문의하기
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <img src="/hero.png" alt="EK 메디칼" className="h-48 w-auto object-contain drop-shadow-lg" />
          </div>
        </div>
      </section>

      {/* 카테고리 */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <h2 className="text-xl font-bold text-gray-800 mb-5">카테고리</h2>
        <div className="grid grid-cols-3 gap-4">
          {categories.map(cat => (
            <Link key={cat.key} to={`/products?category=${cat.key}`}
              className="card p-5 flex flex-col items-center text-center hover:border-[#1251A3] group">
              <span className="text-4xl mb-3">{cat.icon}</span>
              <p className="font-semibold text-gray-800 group-hover:text-[#1251A3] transition-colors">{cat.label}</p>
              <p className="text-gray-400 text-xs mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 베스트 제품 */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800">베스트 제품</h2>
          <Link to="/products" className="text-sm text-[#1251A3] hover:underline">더보기 →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {bestProducts.length === 0
            ? [...Array(6)].map((_, i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="w-full aspect-square rounded-lg bg-gray-100 mb-3" />
                  <div className="h-3 bg-gray-100 rounded mb-2 w-1/2" />
                  <div className="h-4 bg-gray-100 rounded mb-1" />
                  <div className="h-6 bg-gray-100 rounded mt-2" />
                </div>
              ))
            : bestProducts.map(product => (
                <div key={product.id} className="card p-4 flex flex-col">
                  <div className="w-full aspect-square rounded-lg bg-gray-50 flex items-center justify-center mb-3 overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-[#1251A3] bg-blue-50 px-1.5 py-0.5 rounded self-start mb-1.5">
                    {CAT_LABEL[product.category] || product.category}
                  </span>
                  <p className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 flex-1">{product.name}</p>
                  <p className="text-sm font-bold text-[#1251A3] mb-2">{Number(product.price).toLocaleString()}원</p>
                  <button onClick={() => handleAdd(product)}
                    className={`w-full text-xs py-1.5 rounded-lg font-medium transition-all ${addedId === product.id ? 'bg-green-100 text-green-600' : 'bg-[#1251A3] text-white hover:bg-[#0e3f82]'}`}>
                    {addedId === product.id ? '✓ 담김' : '장바구니'}
                  </button>
                </div>
              ))
          }
        </div>
      </section>

      {/* 안내 배너 */}
      <section className="bg-white border-t border-b border-gray-200 py-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '🚚', title: '빠른 배송', desc: '서울 당일 · 전국 익일' },
            { icon: '🔧', title: '전담 AS', desc: '4시간 이내 응대' },
            { icon: '📋', title: '견적서 제공', desc: '맞춤형 ROI 분석' },
            { icon: '✅', title: '정품 보증', desc: '100% 공식 정품만 공급' },
          ].map((item, i) => (
            <div key={i}>
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
              <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
