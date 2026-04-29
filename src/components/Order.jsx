export default function Order() {
  return (
    <section id="order" className="py-24 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest text-blue-400 uppercase mb-4">
            Order
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            의료기기 주문 문의
          </h2>
          <p className="text-gray-400 text-lg">
            아래 양식을 작성해주시면 담당자가 빠르게 연락드립니다.
          </p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">병원명</label>
              <input
                type="text"
                placeholder="○○피부과의원"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">원장님 성함</label>
              <input
                type="text"
                placeholder="홍길동"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">연락처</label>
              <input
                type="tel"
                placeholder="010-0000-0000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">이메일</label>
              <input
                type="email"
                placeholder="example@hospital.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">관심 기기</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none">
              <option value="" className="bg-[#0a0e1a]">선택해주세요</option>
              <option value="laser" className="bg-[#0a0e1a]">레이저 기기</option>
              <option value="shockwave" className="bg-[#0a0e1a]">체외충격파</option>
              <option value="diagnostic" className="bg-[#0a0e1a]">진단 장비</option>
              <option value="other" className="bg-[#0a0e1a]">기타</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">문의 내용</label>
            <textarea
              rows={4}
              placeholder="필요하신 기기나 문의사항을 자유롭게 작성해주세요."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="btn-gradient w-full py-4 rounded-xl text-white font-semibold text-lg"
          >
            주문 문의 보내기
          </button>
        </form>
      </div>
    </section>
  )
}
