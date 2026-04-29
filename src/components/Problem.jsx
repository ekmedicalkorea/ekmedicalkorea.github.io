const problems = [
  {
    num: '01',
    color: '#e11d48',
    bgColor: 'bg-[#e11d48]/20',
    textColor: 'text-[#e11d48]',
    shadowColor: 'shadow-[0_0_15px_rgba(225,29,72,0.3)]',
    accentBg: 'bg-[#e11d48]/10',
    statColor: 'text-[#e11d48]',
    title: '"샀더니 담당자가 없어졌어요."',
    body: (
      <>
        기기 구매 후 AS를 요청했을 때 담당자가 퇴사했거나 연락이 끊긴 경험,
        피부과 원장님의 <span className="text-white font-semibold">68%</span>가 한 번 이상 겪었습니다.
      </>
    ),
    sub: '고장난 장비 앞에서 예약 환자를 돌려보낸 날, 그 손해는 고스란히 원장님 몫이었습니다.',
    statLabel: '경험 비율',
    stat: '68%',
  },
  {
    num: '02',
    color: '#3b82f6',
    bgColor: 'bg-[#3b82f6]/20',
    textColor: 'text-[#3b82f6]',
    shadowColor: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    accentBg: 'bg-[#3b82f6]/10',
    statColor: 'text-[#3b82f6]',
    title: '"비교하다가 하루가 다 갔어요."',
    body: (
      <>
        레이저 기기 하나 바꾸려면 업체 최소 5곳, 견적서 비교에 평균{' '}
        <span className="text-white font-semibold">11시간</span>이 사라집니다.
      </>
    ),
    sub: '스펙은 비슷해 보이는데 가격은 3배 차이, 어디서 무엇을 믿어야 할지 모르겠다는 게 솔직한 현실입니다.',
    statLabel: '평균 소요 시간',
    stat: '11시간',
  },
  {
    num: '03',
    color: '#8b5cf6',
    bgColor: 'bg-[#8b5cf6]/20',
    textColor: 'text-[#8b5cf6]',
    shadowColor: 'shadow-[0_0_15px_rgba(139,92,246,0.3)]',
    accentBg: 'bg-[#8b5cf6]/10',
    statColor: 'text-[#8b5cf6]',
    title: '"샀는데 환자 반응이 없었어요."',
    body: (
      <>
        업체 설명대로라면 바로 매출이 올라야 했는데, 도입 후 6개월이 지나도 투자금
        회수가 안 되는 경우, 개원 5년 미만 원장님 중{' '}
        <span className="text-white font-semibold">10명 중 4명</span>이 경험합니다.
      </>
    ),
    sub: 'ROI 계산 없이 제품만 팔고 간 업체 탓입니다.',
    statLabel: '실패 경험',
    stat: '40%',
  },
]

export default function Problem() {
  return (
    <section id="problem" className="bg-navy-900 py-24 lg:py-32 relative border-t border-white/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-sm font-bold tracking-widest text-blue-500 uppercase mb-4 block">
            2. Problem
          </span>
          <p className="text-xl md:text-2xl text-gray-400 font-medium mb-6">
            원장님이 자주 하시는 말씀입니다
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            "딱 세 가지가 제일<br className="md:hidden" /> 힘들었어요."
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {problems.map((p) => (
            <div
              key={p.num}
              className="glass-card rounded-3xl p-8 flex flex-col h-full relative overflow-hidden group transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${p.accentBg} rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
              <div className="flex-1 z-10">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${p.bgColor} ${p.textColor} font-bold text-lg mb-6 ${p.shadowColor}`}>
                  {p.num}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 leading-snug">{p.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{p.body}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{p.sub}</p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 z-10 flex items-end justify-between">
                <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">{p.statLabel}</span>
                <span className={`text-4xl font-bold ${p.statColor}`}>{p.stat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
