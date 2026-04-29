export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-10 px-6 lg:px-12 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#1251A3] flex items-center justify-center text-white font-bold text-sm">EK</div>
          <span className="text-white font-bold text-lg">이케이메디칼</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-1.5 text-sm mb-6">
          <p><span className="text-gray-400">상호명</span> &nbsp; 주식회사 이케이메디칼</p>
          <p><span className="text-gray-400">대표자</span> &nbsp; 최원제</p>
          <p><span className="text-gray-400">사업자등록번호</span> &nbsp; 212-86-17374</p>
          <p><span className="text-gray-400">주소</span> &nbsp; 경기도 광주시 중앙로 351, 2층 (송정동)</p>
          <p><span className="text-gray-400">사업영역</span> &nbsp; 의료기기 도매업 · 판매 · 유통 · 공급</p>
        </div>
        <div className="border-t border-gray-700 pt-5 text-xs text-gray-500">
          © 2026 주식회사 이케이메디칼. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
