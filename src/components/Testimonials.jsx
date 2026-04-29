const testimonials = [
  {
    quote: '"기기가 고장났을 때 진짜 실력이 보이더라고요."',
    body: '토요일 오후에 IPL이 멈췄는데, 문자 한 통에 2시간 만에 연락이 왔고 월요일 오전 첫 진료 전에 해결이 됐습니다. 다른 업체였으면 일주일은 걸렸을 거예요.',
    initial: '박',
    gradient: 'from-blue-500 to-purple-600',
    name: '박○○ 원장',
    detail: '서울 은평구 피부과 | 기기 도입 2년차',
  },
  {
    quote: '"견적서가 아니라 계산서를 가져왔어요."',
    body: '처음 미팅에서 몇 달 만에 본전 뽑힌다는 숫자를 우리 병원 데이터 기준으로 짜줬습니다. 설득이 아니라 근거였어요. 그래서 믿었습니다.',
    initial: '이',
    gradient: 'from-teal-500 to-blue-600',
    name: '이○○ 원장',
    detail: '경기 수원시 피부과 | 기기 도입 1년차',
  },
  {
    quote: '"개원할 때 뭘 사야 할지 진짜 몰랐는데."',
    body: '예산 3천만 원으로 뭘 먼저 갖춰야 하는지 순서까지 잡아줬어요. 덕분에 개원 6개월 만에 추가 기기를 들였습니다.',
    initial: '최',
    gradient: 'from-orange-500 to-pink-600',
    name: '최○○ 원장',
    detail: '부산 해운대구 피부과 | 개원 8개월차',
  },
  {
    quote: '"5년 거래하면서 담당자가 한 번도 안 바뀌었어요."',
    body: '지금 담당자는 저보다 우리 병원 기기 현황을 더 잘 알아요. 매번 새 사람한테 상황 설명하는 게 너무 피곤했거든요.',
    initial: '김',
    gradient: 'from-indigo-500 to-blue-600',
    name: '김○○ 원장',
    detail: '인천 남동구 정형외과 | 거래 5년차',
  },
]

const QuoteIcon = () => (
  <svg className="w-8 h-8 text-blue-500/50 mb-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
)

export default function Testimonials() {
  return (
    <section id="testimonials" className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-24">
      <div className="flex flex-col items-start mb-12">
        <span className="text-blue-500 text-sm font-bold tracking-widest uppercase mb-4">
          4. Voices
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          원장님들의 후기
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t, i) => (
          <div key={i} className="glass-card rounded-3xl p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <QuoteIcon />
              <h4 className="text-xl font-bold text-white mb-4 leading-tight">{t.quote}</h4>
              <p className="text-gray-400 leading-relaxed mb-8">{t.body}</p>
            </div>
            <div className="flex items-center gap-4 border-t border-white/10 pt-6 mt-auto">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-sm font-bold text-white`}>
                {t.initial}
              </div>
              <div>
                <p className="text-white font-medium">{t.name}</p>
                <p className="text-gray-500 text-sm">{t.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
