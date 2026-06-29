import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { useIntranetAuth } from '../../../context/IntranetAuthContext'
import {
  Package, ShoppingCart, ClipboardList, Truck,
  Inbox, CheckSquare, FileText, ArrowRight
} from 'lucide-react'

function StatCard({ icon: Icon, label, value, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow text-left w-full"
    >
      <div className={`w-12 h-12 rounded flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </button>
  )
}

function SectionHeader({ title, path }) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold text-gray-700 border-l-2 border-[#1976d2] pl-2">{title}</h2>
      <button
        onClick={() => navigate(path)}
        className="text-xs text-[#1976d2] hover:underline flex items-center gap-1"
      >더보기 <ArrowRight size={12} /></button>
    </div>
  )
}

export default function Dashboard() {
  const { intranetUser } = useIntranetAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ products: 0, orders: 0, purchases: 0, deliveries: 0 })
  const [recentTasks, setRecentTasks] = useState([])
  const [recentApprovals, setRecentApprovals] = useState([])
  const [unreadInbox, setUnreadInbox] = useState(0)

  useEffect(() => {
    async function load() {
      const [prodRes, orderRes, purchaseRes, deliveryRes, taskRes, approvalRes, inboxRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('intranet_sales').select('id', { count: 'exact', head: true }),
        supabase.from('intranet_purchase_orders').select('id', { count: 'exact', head: true }),
        supabase.from('intranet_deliveries').select('id', { count: 'exact', head: true }).eq('status', '배송중'),
        supabase.from('intranet_tasks').select('id, title, status, due_date').order('created_at', { ascending: false }).limit(5),
        supabase.from('intranet_approvals').select('id, title, status, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('intranet_inbox').select('id', { count: 'exact', head: true }).eq('receiver_id', intranetUser?.id).eq('is_read', false),
      ])
      setStats({ products: prodRes.count ?? 0, orders: orderRes.count ?? 0, purchases: purchaseRes.count ?? 0, deliveries: deliveryRes.count ?? 0 })
      setRecentTasks(taskRes.data ?? [])
      setRecentApprovals(approvalRes.data ?? [])
      setUnreadInbox(inboxRes.count ?? 0)
    }
    if (intranetUser) load()
  }, [intranetUser])

  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
  const statusColor = { '진행중': 'bg-blue-100 text-blue-700', '완료': 'bg-green-100 text-green-700', '결재': 'bg-blue-100 text-blue-700' }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-5"><h1 className="text-lg font-semibold text-gray-800">안녕하세요, {intranetUser?.name}님</h1><p className="text-sm text-gray-500 mt-0.5">{today}</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Package} label="전체 제품" value={stats.products} color="bg-[#1976d2]" onClick={() => navigate('/intranet/inventory')} />
        <StatCard icon={ShoppingCart} label="판매 ��수" value={stats.orders} color="bg-[#388e3c]" onClick={() => navigate('/intranet/sales')} />
        <StatCard icon={ClipboardList} label="밝주 걩수" value={stats.purchases} color="bg-[#f57c00]" onClick={() => navigate('/intranet/purchase-orders')} />
        <StatCard icon={Truck} label="배송 줉" value={stats.deliveries} color="bg-[#7b1fa2]" onClick={() => navigate('/intranet/delivery')} />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button onClick={() => navigate('/intranet/inbox')} className="bg-white border border-gray-200 rounded p-3 flex items-center gap-3 hover:shadow-md transition-shadow"><Inbox size={18} className="text-[#1976d2]" /><div className="text-left"><p className="text-sm font-medium text-gray-700">소통읋밅스</p>{unreadInbox > 0 && <p className="text-xs text-red-500">춽지 않은 뙔시지 {unreadInbox}건</p>}{unreadInbox === 0 && <p className="text-xs text-gray-400">새 메시지 없음</p>}</div></button>
        <button onClick={() => navigate('/intranet/tasks')} className="bg-white border border-gray-200 rounded p-3 flex items-center gap-3 hover:shadow-md transition-shadow"><CheckSquare size={18} className="text-[#388e3c]" /><div className="text-left"><p className="text-sm font-medium text-gray-700">업무현황</p><p className="text-xs text-gray-400">진행 중 중 업무</p></div></button>
        <button onClick={() => navigate('/intranet/approval')} className="bg-white border border-gray-200 rounded p-3 flex items-center gap-3 hover:shadow-md transition-shadow"><FileText size={18} className="text-[#f57c00]" /><div className="text-left"><p className="text-sm font-medium text-gray-700">전자결재</p><p className="text-xs text-gray-400">결재 대기를 문서</p></div></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded border border-gray-200 p-4"><SectionHeader title="최근 업무" path="/intranet/tasks" />{recentTasks.length === 0 ? (<p className="text-sm text-gray-400 py-4 text-center">등闄지 업무가 없습니다.</p>) : (<table className="w-full text-xs"><thead><tr className="border-b border-gray-100"><th className="text-left py-1.5 text-gray-500 font-medium">업무명</th><th className="text-center py-1.5 text-gray-500 font-medium w-16">상태</th><th className="text-right py-1.5 text-gray-500 font-medium w-20">마감일</th></tr></thead><tbody>{recentTasks.map(t => (<tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-2 text-gray-700 truncate max-w-0" style={{maxWidth:'140px'}}>{t.title}</td><td className="py-2 text-center"><span className={`px-1.5 py-0.5 rounded text-xs ${statusColor[t.status] ?? 'bg-gray-100 text-gray-600'}`}>{t.status}</span></td><td className="py-2 text-right text-gray-500">{t.due_date ?? '-'}</td></tr>))}</tbody></table>)}</div>
        <div className="bg-white rounded border border-gray-200 p-4"><SectionHeader title="최근 결재" path="/intranet/approval" />{recentApprovals.length === 0 ? (<p className="text-sm text-gray-400 py-4 text-center">결재 묮서가 없습니다.</p>) : (<table className="w-full text-xs"><thead><tr className="border-b border-gray-100"><th className="text-left py-1.5 text-gray-500 font-medium">묬서명</th><th className="text-center py-1.5 text-gray-500 font-medium w-16">상태</th><th className="text-right py-1.5 text-gray-500 font-medium w-20">일자</th></tr></thead><tbody>{recentApprovals.map(a => (<tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-2 text-gray-700 truncate max-w-0" style={{maxWidth:'140px'}}>{a.title}</td><td className="py-2 text-center"><span className={`px-1.5 py-0.5 rounded text-xs ${statusColor[t.status] ?? 'bg-gray-100 text-gray-600'}`}>{a.status}</span></td><td className="py-2 text-right text-gray-500">{a.created_at?.slice(0,10) ?? '-'}</td></tr>))}</tbody></table>)}</div>
      </div>
    </div>
  )
}
