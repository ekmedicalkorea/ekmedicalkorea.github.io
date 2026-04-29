import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'
import logo from '../assets/logo_ekmedical_white.png'

export default function Header() {
  const [productOpen, setProductOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { totalCount } = useCart()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`)
  }

  return (
    <>
      {/* 상단 유틸리티 바 */}
      <div className="bg-[#1251A3] text-white text-xs py-1.5 px-6 lg:px-12 flex justify-end items-center gap-4">
        {user ? (
          <>
            <span className="opacity-80">{user.user_metadata?.name || user.email}</span>
            <button onClick={signOut} className="opacity-80 hover:opacity-100">로그아웃</button>
          </>
        ) : (
          <>
            <button onClick={() => setAuthOpen(true)} className="opacity-80 hover:opacity-100">로그인</button>
            <span className="opacity-40">|</span>
            <button onClick={() => setAuthOpen(true)} className="opacity-80 hover:opacity-100">회원가입</button>
          </>
        )}
        <span className="opacity-40">|</span>
        <button onClick={() => navigate('/order')} className="opacity-80 hover:opacity-100">주문조회</button>
        <span className="opacity-40">|</span>
        <button onClick={() => navigate('/cart')} className="opacity-80 hover:opacity-100 flex items-center gap-1">
          장바구니 {totalCount > 0 && <span className="bg-white text-[#1251A3] rounded-full px-1.5 font-bold">{totalCount}</span>}
        </button>
      </div>

      {/* 메인 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3 flex items-center gap-6">
          {/* 로고 */}
          <Link to="/" className="flex-shrink-0">
            <div className="bg-[#1251A3] rounded-lg overflow-hidden" style={{width: '180px', height: '56px'}}>
              <img
                src={logo}
                alt="EK메디칼 로고"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: 'scale(2.0)',
                  transformOrigin: 'center center',
                }}
              />
            </div>
          </Link>

          {/* 검색창 */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="flex">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="제품명, 카테고리를 검색하세요"
                className="w-full border border-gray-300 border-r-0 rounded-l-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1251A3] text-gray-700"
              />
              <button type="submit" className="bg-[#1251A3] hover:bg-[#0e3f82] text-white px-5 rounded-r-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* 우측 아이콘 */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button onClick={() => setAuthOpen(true)} className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-[#1251A3] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[10px]">{user ? '마이페이지' : '로그인'}</span>
            </button>
            <button onClick={() => navigate('/cart')} className="relative flex flex-col items-center gap-0.5 text-gray-600 hover:text-[#1251A3] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-[10px]">장바구니</span>
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 네비게이션 바 */}
        <nav className="border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center gap-0 text-sm font-medium">
            <Link to="/" className="px-4 py-3 text-gray-700 hover:text-[#1251A3] hover:bg-blue-50 transition-colors">홈</Link>
            <Link to="/about" className="px-4 py-3 text-gray-700 hover:text-[#1251A3] hover:bg-blue-50 transition-colors">회사소개</Link>

            {/* Product 드롭다운 */}
            <div className="relative" onMouseEnter={() => setProductOpen(true)} onMouseLeave={() => setProductOpen(false)}>
              <Link to="/products" className="flex items-center gap-1 px-4 py-3 text-gray-700 hover:text-[#1251A3] hover:bg-blue-50 transition-colors">
                제품
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 transition-transform ${productOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              {productOpen && (
                <div className="absolute top-full left-0 w-40 pt-0 z-50">
                  <div className="bg-white border border-gray-200 rounded-b-xl shadow-lg py-1">
                    <Link to="/products?category=consumables" onClick={() => setProductOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1251A3] transition-colors">의료소모품</Link>
                    <Link to="/products?category=devices" onClick={() => setProductOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1251A3] transition-colors">의료기기</Link>
                    <Link to="/products?category=cosmetics" onClick={() => setProductOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1251A3] transition-colors">화장품</Link>
                  </div>
                </div>
              )}
            </div>

          </div>
        </nav>
      </header>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  )
}
