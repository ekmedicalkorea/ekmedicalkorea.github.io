export default function Hero() {
  return (
    <main className="relative min-h-screen flex items-center pt-40 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Medical Professional Consultation"
          className="w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-[#060913]/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060913] via-[#060913]/90 to-transparent w-full lg:w-4/5" />
        <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-[#060913] to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-bold tracking-widest text-gray-300 uppercase">MEDICAL EQUIPMENT PARTNER</span>
          </div>

          {/* Headline */}
          <h1 className="text-[1.75rem] md:text-[2.5rem] lg:text-[3rem] leading-[1.15] font-bold text-white mb-8 tracking-tight">
            원장님, 의료기기 때문에<br />
            <span className="text-white">진료 준비할 시간을</span><br />
            <span className="hero-gradient-text">빼앗기고 계신가요?</span>
          </h1>

          {/* Sub-copy */}
          <div className="mb-10 space-y-4">
            <p className="text-xl md:text-2xl font-semibold text-white/90">
              구매부터 AS까지, 한 사람이 끝까지 책임집니다.
            </p>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl font-medium">
              EK 메디칼은 로컬 피부과·정형외과 원장님의<br className="hidden sm:block" />
              기기 파트너로 평균 3.2년을 함께하고 있습니다.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href="#cta"
              className="btn-gradient w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-white font-semibold text-lg"
            >
              지금 무료 상담 신청하기
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#cta"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-medium text-lg border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Contact us
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
