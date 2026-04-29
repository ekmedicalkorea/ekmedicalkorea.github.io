import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 flex flex-col items-center justify-center text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">장바구니가 비어있습니다</h2>
        <p className="text-gray-400 mb-8">제품을 담아보세요.</p>
        <button onClick={() => navigate('/products')} className="btn-gradient px-8 py-3 rounded-lg font-semibold">
          제품 보러가기
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-12 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">장바구니</h1>
        <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 transition-colors">전체 삭제</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item.id} className="card p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300 flex-shrink-0 border border-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 truncate">{item.name}</p>
                <p className="text-sm text-gray-400">{item.price.toLocaleString()}원 / {item.unit}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 rounded border border-gray-200 hover:border-gray-400 text-gray-600 flex items-center justify-center text-lg leading-none">−</button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 rounded border border-gray-200 hover:border-gray-400 text-gray-600 flex items-center justify-center text-lg leading-none">+</button>
              </div>
              <p className="font-semibold text-gray-800 w-24 text-right text-sm">{(item.price * item.quantity).toLocaleString()}원</p>
              <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 transition-colors ml-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="card p-5 h-fit sticky top-24">
          <h3 className="font-bold text-gray-800 mb-4">결제 정보</h3>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between text-gray-600">
              <span>상품 수</span><span>{items.reduce((s, i) => s + i.quantity, 0)}개</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>상품 금액</span><span>{totalPrice.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>배송비</span><span className="text-green-600">무료</span>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between font-bold mb-4">
            <span>총 금액</span>
            <span className="text-[#1251A3] text-lg">{totalPrice.toLocaleString()}원</span>
          </div>
          <button onClick={() => navigate('/order')} className="btn-gradient w-full py-3 rounded-lg font-semibold">
            주문하기
          </button>
          <button onClick={() => navigate('/products')} className="w-full py-2.5 mt-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors">
            쇼핑 계속하기
          </button>
        </div>
      </div>
    </div>
  )
}
