export default function AboutPage() {
  return (
    <div className="min-h-screen pt-36 pb-24 px-6 lg:px-12 max-w-5xl mx-auto">
      {/* 헤더 */}
      <div className="mb-16">
        <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest text-blue-400 uppercase mb-4">About Us</span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          구매부터 AS까지,<br />한 사람이 끝까지 책임합니다.
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
          EK 메디칼은 피부과·정형외과 원장님의 의료기기 파트너입니다.<br />
          기기 선정 컨설팅부터 납품 후 12개월 전담 관리, 투자 회수 시뮬레이션까지 제공합니다.
        </p>
      </div>

      {/* 숫자로 보는 EK 메디칼 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {[
          { stat: '3.2년', label: '평균 파트너십 기간' },
          { stat: '4시간', label: 'AS 평균 응대 시간' },
          { stat: '200+', label: '누적 공급 기기 수' },
          { stat: '98%', label: '고객 재구매율' },
        ].map((item, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-white mb-1">{item.stat}</p>
            <p className="text-gray-400 text-sm">{item.label}</p>
          </div>
        ))}
      </div>

      {/* 회사 소개 */}
      <div className="space-y-12 mb-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">우리가 하는 일</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              EK 메디칼은 의료기기 도매업·판매·유통·공급을 전문으로 하는 기업입니다.
              피부과, 정형외과, 재활의학과 원장님들과 평균 3.2년 이상의 파트너십을 유지하고 있습니다.
            </p>
            <p className="text-gray-400 leading-relaxed">
              단순 판매가 아닌, 기기 선정 단계부터 ROI 분석, 납품, 교육, AS까지
              의료기기 도입의 전 과정을 함께합니다.
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6 space-y-3">
            {[
              '의료기기 기기 선정 컨설팅',
              '납품 후 12개월 전담 AS',
              '투자 회수 시뮬레이션 제공',
              '의료소모품 정기 공급',
              '의원 전용 화장품 공급',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 회사 정보 */}
      <div className="glass-card rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">회사 정보</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          {[
            { label: '상호명', value: '주식회사 이케이메디칼' },
            { label: '대표자', value: '최원재' },
            { label: '사업자등록번호', value: '212-86-17374' },
            { label: '사업영역', value: '의료기기 도매업·판매·유통·공급' },
            { label: '주소', value: '경기도 광주시 중앙로 351, 2층 (송정동)' },
            { label: '설립연도', value: '2020년' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-gray-500 w-28 flex-shrink-0">{item.label}</span>
              <span className="text-gray-200">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
