export const products = [
  // 의료소모품
  { id: 1, category: 'consumables', name: '일회용 주사기 세트', price: 15000, unit: '박스 (100개입)', description: '멸균 처리된 일회용 주사기. 다양한 사이즈 구성.', image: null },
  { id: 2, category: 'consumables', name: '의료용 라텍스 장갑', price: 12000, unit: '박스 (100개입)', description: '분말 없는 멸균 라텍스 장갑. S/M/L 사이즈.', image: null },
  { id: 3, category: 'consumables', name: '상처 드레싱 세트', price: 8500, unit: '세트 (50개입)', description: '흡수성 패드 및 고정 테이프 포함 드레싱 키트.', image: null },
  { id: 4, category: 'consumables', name: '멸균 생리식염수', price: 5000, unit: '500ml × 10병', description: '상처 세척 및 희석에 사용하는 멸균 생리식염수.', image: null },
  { id: 5, category: 'consumables', name: '수술용 마스크', price: 18000, unit: '박스 (50개입)', description: '3중 필터 구조, 높은 차단율의 의료용 마스크.', image: null },

  // 의료기기
  { id: 6, category: 'devices', name: 'CO₂ 레이저 기기', price: 15000000, unit: '대', description: '피부과·성형외과 전용. 점·사마귀·흉터 치료에 최적화된 레이저.', image: null },
  { id: 7, category: 'devices', name: '체외충격파 치료기', price: 8000000, unit: '대', description: '정형외과·재활의학과용. 근골격계 통증 치료에 효과적.', image: null },
  { id: 8, category: 'devices', name: 'IPL 광선 치료기', price: 12000000, unit: '대', description: '색소 병변·혈관 병변·제모에 활용 가능한 멀티 파장 기기.', image: null },
  { id: 9, category: 'devices', name: '초음파 진단기', price: 6500000, unit: '대', description: '소형 휴대형 초음파. 내과·정형외과·산부인과 활용 가능.', image: null },
  { id: 10, category: 'devices', name: 'RF 고주파 리프팅기', price: 9000000, unit: '대', description: '피부 탄력 개선 고주파 치료기. 리프팅 효과 우수.', image: null },

  // 화장품
  { id: 11, category: 'cosmetics', name: '피부 재생 세럼', price: 35000, unit: '50ml', description: '시술 후 피부 재생에 특화된 고농축 세럼. 의원 전용.', image: null },
  { id: 12, category: 'cosmetics', name: '진정 마스크팩', price: 28000, unit: '10매', description: '레이저·필링 후 즉각 진정 효과. 히알루론산·판테놀 함유.', image: null },
  { id: 13, category: 'cosmetics', name: '자외선차단 크림 SPF50+', price: 22000, unit: '50ml', description: 'PA++++ 등급 자외선 차단. 시술 후 필수 관리 제품.', image: null },
  { id: 14, category: 'cosmetics', name: '장벽 강화 모이스처라이저', price: 32000, unit: '80ml', description: '세라마이드·나이아신아마이드 함유. 손상 피부 장벽 복구.', image: null },
  { id: 15, category: 'cosmetics', name: '클렌징 폼 (민감성)', price: 18000, unit: '150ml', description: '약산성 저자극 클렌저. 시술 후 세안 및 민감한 피부용.', image: null },
]

export const categories = [
  { key: 'all', label: '전체' },
  { key: 'consumables', label: '의료소모품' },
  { key: 'devices', label: '의료기기' },
  { key: 'cosmetics', label: '화장품' },
]

export const categoryLabel = {
  consumables: '의료소모품',
  devices: '의료기기',
  cosmetics: '화장품',
}
