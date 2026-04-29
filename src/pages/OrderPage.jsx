import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

export default function OrderPage() {
  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ hospital: '', name: '', phone: '', email: '', memo: '' })
  const [submitted, setSubmitted] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    clearCart()
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">주문 접수 완료!</h2>
        <p className="text-gray-500 mb-8">담당자가 영업일 기준 4시간 이내에 연락드립니다.</p>
        <button onClick={() => navigate('/')} className="btn-gradient px-8 py-3 rounded-lg font-semibold">
          홈으로
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-12 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">주문하기</h1>
      <p className="text-gray-400 text-sm mb-8">주문 정보를 입력하시면 담당자가 확인 후 연락드립니다.</p>

      <div className="grid lg:grid-cols-5 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-4">
          <div className="card p-5 space-y-4">
            <h2 className="font-semibold text-gray-800">주문자 정보</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">병원명 *</label>
                <input type="text" required value={form.hospital} onChange={e => set('hospital', e.target.value)}
                  placeholder="○○피부과의원"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1251A3] text-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">원장님 성함 *</label>
                <input type="text" required value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="홍길동"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1251A3] text-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">연락처 *</label>
                <input type="tel" required value={form.phone} onChange={e => set('phone', e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1251A3] text-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">이메일</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="example@hospital.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1251A3] text-gray-700" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">추가 문의사항</label>
              <textarea rows={3} value={form.memo} onChange={e => set('memo', e.target.value)}
                placeholder="수량, 납기, 특이사항 등"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1251A3] text-gray-700 resize-none" />
            </div>
          </div>
          <button type="submit" className="btn-gradient w-full py-3.5 rounded-lg font-semibold text-base">
            주문 접수하기
          </button>
        </form>

        <div className="lg:col-span-2">
          <div className="card p-5 sticky top-24">
            <h3 className="font-semibold text-gray-800 mb-3">주문 요약</h3>
            {items.length === 0 ? (
              <p className="text-gray-400 text-sm">장바구니가 비어있습니다.</p>
            ) : (
              <>
                <div className="space-y-2 mb-3">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate flex-1 mr-2">{item.name} × {item.quantity}</span>
                      <span className="text-gray-800 font-medium whitespace-nowrap">{(item.price * item.quantity).toLocaleString()}원</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold">
                  <span className="text-gray-700">합계</span>
                  <span className="text-[#1251A3]">{totalPrice.toLocaleString()}원</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
