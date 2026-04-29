const checks = [
  '상담 소요 시간: 40분 이내',
  '담당자 직통 연결 (대표번호 아님)',
  '상담 후 구매 압박 없음',
]

export default function CTA() {
  return (
    <section id="cta" className="max-w-5xl mx-auto px-6 lg:px-8 w-full py-12 pb-24">
      <div className="relative rounded-[3rem] overflow-hidden border border-white/10 bg-gradient-to-br from-blue-900/40 via-[#0a0e1a] to-purple-900/40 p-10 md:p-20 text-center shadow-2xl backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            지금 상담 신청하면,{' '}
            <br className="hidden md:block" />
            다음 주 안에 답이 나옵니다.
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            "요즘 이런 기기 알아보고 있어요" 한 마디면 충분합니다.{' '}
            <br className="hidden md:block" />
            EK 메디칼은 첫 상담을 완전 무료로 진행합니다.
          </p>

          <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center mb-12 text-left">
            {checks.map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-200 font-medium">{text}</span>
              </div>
            ))}
          </div>

          <button className="bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold py-5 px-10 rounded-full inline-flex items-center gap-3 transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:-translate-y-1 mb-6">
            무료 상담 신청하기
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <div className="inline-flex items-center gap-2 text-sm text-gray-400 bg-black/20 px-4 py-2 rounded-full border border-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
              <path d="M12 2C6.48 2 2 5.58 2 10c0 2.58 1.54 4.88 3.93 6.27-.22 1.09-.79 3.03-.84 3.23-.05.21.14.3.3.2.14-.1 2.22-1.42 3.63-2.31C10 17.8 10.98 18 12 18c5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
            </svg>
            카카오톡 채널{' '}
            <span className="text-white font-medium">@EK메디칼</span>
            <span className="mx-2 w-1 h-1 rounded-full bg-gray-600" />
            영업일 기준 4시간 이내 답변
          </div>
        </div>
      </div>
    </section>
  )
}
