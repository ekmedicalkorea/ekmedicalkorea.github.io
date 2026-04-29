import { useEffect, useState, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const services = [
  {
    number: '01',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
    accent: 'from-blue-500 to-cyan-400',
    glow: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    tag: '기기 선정',
    title: '기기 선정\n컨설팅',
    highlight: '"어떤 거 사면 돼요?"에\n그 자리에서 답드립니다.',
    body: '진료 과목, 환자 연령대, 월 내원 수, 목표 시술 단가까지 듣고 난 뒤 제안합니다.',
    stats: [
      { label: '평균 상담 시간', value: '40분' },
      { label: '기존 비교 대비', value: '1/15 수준' },
    ],
  },
  {
    number: '02',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    accent: 'from-indigo-500 to-purple-400',
    glow: 'bg-indigo-500/20',
    border: 'border-indigo-500/30',
    tag: '전담 AS',
    title: '납품 후\n12개월 전담 관리',
    highlight: '담당자가 바뀌면\n사전에 직접 연락드립니다.',
    body: '담당자 1인이 납품부터 1년간 고정 배정됩니다. 인수인계도 직접 처리합니다.',
    stats: [
      { label: 'AS 응대', value: '평균 4시간 이내' },
      { label: '출장 방문', value: '영업일 2일 이내' },
    ],
  },
  {
    number: '03',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M7 17v-4" />
        <path d="M12 17v-8" />
        <path d="M17 17v-6" />
      </svg>
    ),
    accent: 'from-cyan-500 to-teal-400',
    glow: 'bg-cyan-500/20',
    border: 'border-cyan-500/30',
    tag: 'ROI 분석',
    title: '투자 회수\n시뮬레이션',
    highlight: '구매 결정 전에\nROI 계산서를 먼저 드립니다.',
    body: '시술 단가 × 예상 월 케이스 수 기준으로 손익분기 시점을 월 단위로 제시합니다.',
    stats: [
      { label: '제공 자료', value: '맞춤형 ROI 계산서' },
      { label: '평균 BEP', value: '7.3개월' },
    ],
  },
]

export default function Service() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps',
  })
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [current, setCurrent] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
    setCurrent(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <section id="service" className="relative w-full py-24 lg:py-32 overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] transform translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 lg:mb-16">
          <div>
            <span className="text-blue-500 font-bold tracking-[0.2em] text-xs uppercase mb-3 block">
              3. Service
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              EK 메디칼이<br className="hidden sm:block" /> 다르게 하는 세 가지
            </h2>
          </div>

          {/* Nav arrows */}
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canPrev}
              className="w-11 h-11 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 flex items-center justify-center text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canNext}
              className="w-11 h-11 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 flex items-center justify-center text-white transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel — bleeds past container */}
      <div className="relative z-10">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex pl-6 lg:pl-[max(1.5rem,calc(50vw-42rem))] gap-5 lg:gap-6">
            {services.map((s, i) => (
              <div
                key={i}
                className="flex-none w-[85vw] sm:w-[400px] lg:w-[420px]"
              >
                <div className="group relative flex flex-col h-full min-h-[480px] rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden hover:border-white/20 transition-all duration-300">

                  {/* Top accent strip */}
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${s.accent} opacity-70`} />

                  {/* Glow blob */}
                  <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full ${s.glow} blur-[60px] opacity-60 group-hover:opacity-90 transition-opacity duration-300`} />

                  <div className="relative flex flex-col flex-grow p-8 lg:p-10">
                    {/* Number + icon row */}
                    <div className="flex items-start justify-between mb-8">
                      <span className={`text-6xl font-black bg-gradient-to-br ${s.accent} bg-clip-text text-transparent leading-none select-none opacity-40`}>
                        {s.number}
                      </span>
                      <div className={`w-14 h-14 rounded-2xl border ${s.border} bg-white/5 flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300`}>
                        {s.icon}
                      </div>
                    </div>

                    {/* Tag */}
                    <span className={`inline-block text-xs font-semibold tracking-widest uppercase mb-3 bg-gradient-to-r ${s.accent} bg-clip-text text-transparent`}>
                      {s.tag}
                    </span>

                    {/* Title */}
                    <h3 className="text-2xl lg:text-[1.6rem] font-bold text-white leading-tight mb-5 whitespace-pre-line">
                      {s.title}
                    </h3>

                    {/* Highlight quote */}
                    <p className={`text-[15px] font-medium text-white/70 leading-relaxed border-l-2 border-transparent bg-gradient-to-r ${s.accent} bg-[length:2px_100%] bg-no-repeat bg-left pl-4 mb-4 whitespace-pre-line`}>
                      {s.highlight}
                    </p>

                    {/* Body */}
                    <p className="text-gray-400 text-[15px] leading-relaxed flex-grow mb-8">
                      {s.body}
                    </p>

                    {/* Stats */}
                    <div className="mt-auto pt-6 border-t border-white/8 space-y-3">
                      {s.stats.map((stat, j) => (
                        <div key={j} className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">{stat.label}</span>
                          <span className={`font-semibold bg-gradient-to-r ${s.accent} bg-clip-text text-transparent`}>
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Right padding sentinel */}
            <div className="flex-none w-6 lg:w-[max(1.5rem,calc(50vw-42rem))]" />
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {services.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`슬라이드 ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                current === i
                  ? 'w-6 bg-blue-400'
                  : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
