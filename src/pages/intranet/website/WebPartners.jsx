import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { CheckCircle, XCircle } from 'lucide-react'

const STATUS_TABS = [
  { key: 'pending', label: '승인 대기', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { key: 'approved', label: '승인 완료', color: 'bg-green-50 text-green-700 border-green-200' },
  { key: 'rejected', label: '거절', color: 'bg-red-50 text-red-700 border-red-200' },
]

export default function WebPartners() {
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('pending')
  const [processing, setProcessing] = useState(null)

  async function load(status) {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').eq('status', status).eq('is_admin', false).order('created_at', { ascending: false })
    setProfiles(data || [])
    setLoading(false)
  }

  useEffect(() => { load(tab) }, [tab])

  async function updateStatus(id, status) {
    setProcessing(id)
    await supabase.from('profiles').update({ status }).eq('id', id)
    setProfiles(prev => prev.filter(p => p.id !== id))
    setProcessing(null)
  }

  return (
    <div>
      <div className="mb-4 pb-3 border-b border-gray-200">
        <h1 className="text-base font-semibold text-gray-800">거래처 관리</h1>
      </div>

      <div className="flex gap-2 mb-4">
        {STATUS_TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded text-xs font-medium border transition-all ${tab===t.key ? t.color : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? <p className="text-sm text-gray-400 py-10 text-center">불러오는 중...</p> :
      profiles.length === 0 ? <p className="text-sm text-gray-400 py-10 text-center">해당 거래처가 없습니다.</p> : (
        <div className="space-y-3">
          {profiles.map(p => (
            <div key={p.id} className="bg-white border border-gray-200 rounded p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
                {[['상호명', p.company_name||p.hospital||'-'], ['담당자', p.contact_name||p.name||'-'],
                  ['연락처', p.phone||'-'], ['이메일', p.email||'-'],
                  ['사업자번호', p.business_number||'-'], ['신청일', new Date(p.created_at).toLocaleDateString('ko-KR')]
                ].map(([label, val]) => (
                  <div key={label}><p className="text-gray-400 mb-0.5">{label}</p><p className="font-medium text-gray-800">{val}</p></div>
                ))}
              </div>
              {tab === 'pending' && (
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button disabled={processing===p.id} onClick={() => updateStatus(p.id, 'approved')}
                    className="flex items-center gap-1 px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs rounded disabled:opacity-50">
                    <CheckCircle size={13} /> 승인
                  </button>
                  <button disabled={processing===p.id} onClick={() => updateStatus(p.id, 'rejected')}
                    className="flex items-center gap-1 px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-xs rounded disabled:opacity-50">
                    <XCircle size={13} /> 거절
                  </button>
                </div>
              )}
              {tab === 'approved' && (
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button disabled={processing===p.id} onClick={() => updateStatus(p.id, 'rejected')}
                    className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded disabled:opacity-50">
                    승인 취소
                  </button>
                </div>
              )}
              {tab === 'rejected' && (
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button disabled={processing===p.id} onClick={() => updateStatus(p.id, 'approved')}
                    className="px-4 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-xs rounded disabled:opacity-50">
                    승인으로 변경
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
