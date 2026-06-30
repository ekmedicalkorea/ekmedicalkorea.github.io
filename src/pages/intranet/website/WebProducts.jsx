import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../../lib/supabase'
import { Search, Plus, Pencil, X, Upload, Loader, Image as ImageIcon } from 'lucide-react'

const CAT = { consumables:'의료소모품', devices:'의료기기', cosmetics:'화장품', injectables:'주사제' }

const EMPTY_INFO = { purpose:'', usage:'', precautions:'', warranty:'', importer:'', country:'', consumer_support:'' }
const EMPTY_FORM = {
  name:'', category:'consumables', subcategory:'', price:'', unit:'',
  manufacturer:'', description:'', is_active:true, image_url:'',
  spec:'', origin:'', product_code:'', shipping_fee:'',
  detail_content:'', detail_images:[],
  product_info: { ...EMPTY_INFO }
}

export default function WebProducts() {
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [stockEdits, setStockEdits] = useState({})

  // 모달
  const [modal, setModal]         = useState(null)   // null | 'new' | { type:'edit', id }
  const [form, setForm]           = useState(EMPTY_FORM)
  const [activeTab, setActiveTab] = useState('basic') // 'basic' | 'detail' | 'info' | 'images'
  const [saving, setSaving]       = useState(false)
  const [imgUploading, setImgUploading]         = useState(false)
  const [detailImgUploading, setDetailImgUploading] = useState(false)
  const [imgPreview, setImgPreview]             = useState('')
  const mainImgRef   = useRef(null)
  const detailImgRef = useRef(null)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('products')
      .select('id,name,category,subcategory,price,unit,stock,is_active,manufacturer,description,image_url,spec,origin,product_code,shipping_fee,detail_content,detail_images,product_info')
      .order('name')
    setProducts(data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  /* ── 재고·활성 인라인 편집 ── */
  async function updateStock(id, val) {
    const stock = val === '' ? null : Math.max(0, parseInt(val) || 0)
    await supabase.from('products').update({ stock }).eq('id', id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock } : p))
    setStockEdits(prev => { const n = {...prev}; delete n[id]; return n })
  }
  async function toggleActive(id, current) {
    await supabase.from('products').update({ is_active: !current }).eq('id', id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p))
  }

  /* ── 모달 열기 ── */
  function openNew() {
    setForm({ ...EMPTY_FORM, product_info: { ...EMPTY_INFO }, detail_images: [] })
    setImgPreview('')
    setActiveTab('basic')
    setModal('new')
  }
  function openEdit(p) {
    setForm({
      name: p.name||'', category: p.category||'consumables',
      subcategory: p.subcategory||'', price: p.price||'',
      unit: p.unit||'', manufacturer: p.manufacturer||'',
      description: p.description||'', is_active: p.is_active,
      image_url: p.image_url||'',
      spec: p.spec||'', origin: p.origin||'',
      product_code: p.product_code||'', shipping_fee: p.shipping_fee||'',
      detail_content: p.detail_content||'',
      detail_images: Array.isArray(p.detail_images) ? p.detail_images : [],
      product_info: {
        ...EMPTY_INFO,
        ...(p.product_info || {})
      }
    })
    setImgPreview(p.image_url||'')
    setActiveTab('basic')
    setModal({ type:'edit', id: p.id })
  }

  /* ── 대표 이미지 업로드 ── */
  async function handleImgUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImgUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
      setForm(f => ({ ...f, image_url: publicUrl }))
      setImgPreview(publicUrl)
    }
    setImgUploading(false)
  }

  /* ── 상세 이미지 업로드 ── */
  async function handleDetailImgUpload(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setDetailImgUploading(true)
    const urls = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `detail/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
        urls.push(publicUrl)
      }
    }
    setForm(f => ({ ...f, detail_images: [...(f.detail_images || []), ...urls] }))
    setDetailImgUploading(false)
  }

  function removeDetailImg(idx) {
    setForm(f => ({ ...f, detail_images: f.detail_images.filter((_, i) => i !== idx) }))
  }

  /* ── 저장 ── */
  async function handleSave() {
    if (!form.name.trim()) return alert('제품명을 입력하세요.')
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      category: form.category,
      subcategory: form.subcategory.trim() || null,
      price: form.price ? String(form.price) : null,
      unit: form.unit.trim() || null,
      manufacturer: form.manufacturer.trim() || null,
      description: form.description.trim() || null,
      is_active: form.is_active,
      image_url: form.image_url || null,
      spec: form.spec.trim() || null,
      origin: form.origin.trim() || null,
      product_code: form.product_code.trim() || null,
      shipping_fee: form.shipping_fee.trim() || null,
      detail_content: form.detail_content.trim() || null,
      detail_images: form.detail_images.length ? form.detail_images : [],
      product_info: form.product_info,
    }
    if (modal === 'new') {
      const { error } = await supabase.from('products').insert(payload)
      if (!error) { await load(); setModal(null) }
      else alert('저장 실패: ' + error.message)
    } else {
      const { error } = await supabase.from('products').update(payload).eq('id', modal.id)
      if (!error) {
        setProducts(prev => prev.map(p => p.id === modal.id ? { ...p, ...payload } : p))
        setModal(null)
      } else alert('저장 실패: ' + error.message)
    }
    setSaving(false)
  }

  /* ── 필터 ── */
  const filtered = products.filter(p => {
    const matchCat = catFilter === 'all' || p.category === catFilter
    const q = search.trim().toLowerCase()
    const matchSearch = !q || p.name?.toLowerCase().includes(q) || p.manufacturer?.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  const TABS = [
    { key:'basic',  label:'기본 정보' },
    { key:'detail', label:'상세 내용' },
    { key:'info',   label:'제품 정보' },
    { key:'images', label:'상세 이미지' },
  ]

  function setInfo(field, val) {
    setForm(f => ({ ...f, product_info: { ...f.product_info, [field]: val } }))
  }

  return (
    <div>
      <div className="mb-4 pb-3 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-base font-semibold text-gray-800">제품 관리</h1>
        <button onClick={openNew}
          className="flex items-center gap-1.5 bg-[#1976d2] text-white text-xs font-medium px-3 py-2 rounded hover:bg-[#1565c0] transition-colors">
          <Plus size={13} /> 신규 등록
        </button>
      </div>

      <div className="flex gap-2 mb-3 flex-wrap">
        {[['all','전체'], ...Object.entries(CAT)].map(([k,v]) => (
          <button key={k} onClick={() => setCatFilter(k)}
            className={`px-3 py-1.5 rounded text-xs font-medium border ${catFilter===k ? 'bg-[#1976d2] text-white border-[#1976d2]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
            {v} ({k==='all' ? products.length : products.filter(p=>p.category===k).length})
          </button>
        ))}
      </div>

      <div className="relative mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="제품명, 제조사 검색..."
          className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#1976d2]" />
      </div>

      {loading ? <p className="text-sm text-gray-400 py-10 text-center">불러오는 중...</p> : (
        <div className="bg-white border border-gray-200 rounded overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['카테고리','제품명','가격','단위','재고','상태',''].map(h => (
                <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2"><span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{CAT[p.category]||p.category}</span></td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {p.image_url
                        ? <img src={p.image_url} className="w-7 h-7 rounded object-cover border border-gray-100 flex-shrink-0" />
                        : <div className="w-7 h-7 rounded bg-gray-100 flex-shrink-0" />
                      }
                      <div>
                        <p className="text-xs font-medium text-gray-800 truncate max-w-[180px]">{p.name}</p>
                        {p.subcategory && <p className="text-[10px] text-gray-400">{p.subcategory}</p>}
                        {p.manufacturer && <p className="text-[10px] text-gray-400">{p.manufacturer}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-700">{isNaN(Number(p.price)) ? p.price : Number(p.price).toLocaleString()+'원'}</td>
                  <td className="px-3 py-2 text-xs text-gray-500">{p.unit||'-'}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <input type="number" min="0"
                        value={stockEdits[p.id] ?? (p.stock ?? '')}
                        onChange={e => setStockEdits(prev => ({...prev, [p.id]: e.target.value}))}
                        onBlur={e => stockEdits[p.id] !== undefined && updateStock(p.id, e.target.value)}
                        placeholder="미관리"
                        className={`w-16 border rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-[#1976d2] ${p.stock===0?'border-red-300 bg-red-50':p.stock!=null&&p.stock<=10?'border-orange-300 bg-orange-50':'border-gray-200'}`}
                      />
                      {p.stock===0 && <span className="text-[10px] text-red-500 font-bold">품절</span>}
                      {p.stock!=null && p.stock>0 && p.stock<=10 && <span className="text-[10px] text-orange-500">부족</span>}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => toggleActive(p.id, p.is_active)}
                      className={`text-xs px-2 py-1 rounded-full font-medium ${p.is_active?'bg-green-50 text-green-600':'bg-gray-100 text-gray-400'}`}>
                      {p.is_active ? '판매중' : '숨김'}
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => openEdit(p)}
                      className="p-1.5 rounded text-gray-400 hover:text-[#1976d2] hover:bg-blue-50 transition-colors">
                      <Pencil size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-sm text-gray-400 py-8 text-center">검색 결과가 없습니다.</p>}
        </div>
      )}

      {/* ── 수정/등록 모달 ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">

            {/* 헤더 */}
            <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0">
              <h2 className="font-semibold text-gray-800">{modal === 'new' ? '신규 제품 등록' : '제품 수정'}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            {/* 탭 */}
            <div className="flex border-b flex-shrink-0">
              {TABS.map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                    activeTab===t.key ? 'border-[#1976d2] text-[#1976d2]' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* 본문 */}
            <div className="flex-1 overflow-y-auto p-5">

              {/* ── 기본 정보 탭 ── */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  {/* 대표 이미지 */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">대표 이미지</label>
                    <div className="flex items-center gap-3">
                      {imgPreview
                        ? <img src={imgPreview} className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                        : <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center"><Upload size={20} className="text-gray-300" /></div>
                      }
                      <div>
                        <input ref={mainImgRef} type="file" accept="image/*" className="hidden" onChange={handleImgUpload} />
                        <button onClick={() => mainImgRef.current?.click()} disabled={imgUploading}
                          className="flex items-center gap-1.5 text-xs border border-gray-200 px-3 py-2 rounded hover:bg-gray-50 text-gray-600">
                          {imgUploading ? <><Loader size={12} className="animate-spin" /> 업로드 중...</> : <><Upload size={12} /> 이미지 선택</>}
                        </button>
                        {imgPreview && (
                          <button onClick={() => { setImgPreview(''); setForm(f => ({...f, image_url:''})) }}
                            className="mt-1 text-xs text-red-400 hover:text-red-600 block">이미지 제거</button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 제품명 */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">제품명 *</label>
                    <input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="제품명 입력" />
                  </div>

                  {/* 카테고리 + 하위카테고리 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">카테고리</label>
                      <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]">
                        {Object.entries(CAT).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">하위 카테고리</label>
                      <input value={form.subcategory} onChange={e => setForm(f=>({...f,subcategory:e.target.value}))}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="예: 주사침, 장갑" />
                    </div>
                  </div>

                  {/* 가격 + 단위 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">가격 (원)</label>
                      <input type="number" value={form.price} onChange={e => setForm(f=>({...f,price:e.target.value}))}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">단위</label>
                      <input value={form.unit} onChange={e => setForm(f=>({...f,unit:e.target.value}))}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="예: 100EA/CASE" />
                    </div>
                  </div>

                  {/* 제조사 + 규격 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">제조사</label>
                      <input value={form.manufacturer} onChange={e => setForm(f=>({...f,manufacturer:e.target.value}))}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="제조사명" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">규격/스펙</label>
                      <input value={form.spec} onChange={e => setForm(f=>({...f,spec:e.target.value}))}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="예: 250*200*40mm" />
                    </div>
                  </div>

                  {/* 원산지 + 제품코드 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">원산지</label>
                      <input value={form.origin} onChange={e => setForm(f=>({...f,origin:e.target.value}))}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="예: 대한민국" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">제품코드</label>
                      <input value={form.product_code} onChange={e => setForm(f=>({...f,product_code:e.target.value}))}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="제품코드" />
                    </div>
                  </div>

                  {/* 배송비 */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">배송비</label>
                    <input value={form.shipping_fee} onChange={e => setForm(f=>({...f,shipping_fee:e.target.value}))}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2]" placeholder="예: 5000원 (5만원 이상 무료배송)" />
                  </div>

                  {/* 간략 설명 */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">간략 설명</label>
                    <textarea value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))}
                      rows={2} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2] resize-none" placeholder="제품 한 줄 설명" />
                  </div>

                  {/* 판매 상태 */}
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm(f=>({...f,is_active:e.target.checked}))}
                      className="w-4 h-4 accent-[#1976d2]" />
                    <label htmlFor="is_active" className="text-sm text-gray-700">홈페이지에 판매중으로 표시</label>
                  </div>
                </div>
              )}

              {/* ── 상세 내용 탭 ── */}
              {activeTab === 'detail' && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">상세 내용</label>
                  <textarea value={form.detail_content} onChange={e => setForm(f=>({...f,detail_content:e.target.value}))}
                    rows={18} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2] resize-none font-mono" placeholder="상세 페이지에 표시될 내용을 입력하세요." />
                  <p className="text-[11px] text-gray-400 mt-1">{form.detail_content.length}자</p>
                </div>
              )}

              {/* ── 제품 정보 탭 ── */}
              {activeTab === 'info' && (
                <div className="space-y-3">
                  {[
                    ['purpose',          '용도/사용목적'],
                    ['usage',            '사용방법'],
                    ['precautions',      '사용 시 주의사항'],
                    ['warranty',         '품질보증기준'],
                    ['importer',         '수입업자'],
                    ['country',          '제조국'],
                    ['consumer_support', '소비자상담실'],
                  ].map(([field, label]) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                      <textarea value={form.product_info[field]||''} onChange={e => setInfo(field, e.target.value)}
                        rows={2} className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1976d2] resize-none" />
                    </div>
                  ))}
                </div>
              )}

              {/* ── 상세 이미지 탭 ── */}
              {activeTab === 'images' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-gray-500">상세 이미지 ({form.detail_images.length}장)</label>
                    <div>
                      <input ref={detailImgRef} type="file" accept="image/*" multiple className="hidden" onChange={handleDetailImgUpload} />
                      <button onClick={() => detailImgRef.current?.click()} disabled={detailImgUploading}
                        className="flex items-center gap-1.5 text-xs bg-[#1976d2] text-white px-3 py-1.5 rounded hover:bg-[#1565c0] disabled:opacity-50">
                        {detailImgUploading ? <><Loader size={12} className="animate-spin" /> 업로드 중...</> : <><ImageIcon size={12} /> 이미지 추가</>}
                      </button>
                    </div>
                  </div>

                  {form.detail_images.length === 0
                    ? (
                      <div className="border-2 border-dashed border-gray-200 rounded-lg py-12 text-center">
                        <ImageIcon size={32} className="text-gray-200 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">상세 이미지를 추가하세요</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-3">
                        {form.detail_images.map((url, idx) => (
                          <div key={idx} className="relative group">
                            <img src={url} className="w-full aspect-square object-cover rounded-lg border border-gray-200" />
                            <button onClick={() => removeDetailImg(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <X size={12} />
                            </button>
                            <p className="text-[10px] text-gray-400 text-center mt-1">{idx+1}번</p>
                          </div>
                        ))}
                      </div>
                    )
                  }
                </div>
              )}
            </div>

            {/* 푸터 */}
            <div className="px-5 py-4 border-t flex gap-2 justify-between items-center flex-shrink-0">
              <div className="flex gap-1">
                {TABS.map((t, i) => (
                  <div key={t.key} className={`w-2 h-2 rounded-full ${activeTab===t.key ? 'bg-[#1976d2]' : 'bg-gray-200'}`} />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setModal(null)}
                  className="px-4 py-2 text-sm border border-gray-200 rounded text-gray-500 hover:bg-gray-50">취소</button>
                <button onClick={handleSave} disabled={saving}
                  className="px-4 py-2 text-sm bg-[#1976d2] text-white rounded hover:bg-[#1565c0] disabled:opacity-50 font-medium">
                  {saving ? '저장 중...' : '저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
