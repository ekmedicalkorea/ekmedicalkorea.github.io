import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useIntranetAuth } from '../../context/IntranetAuthContext'
import {
  LayoutDashboard, Inbox, CheckSquare, FileText, MessageSquare,
  Calendar, Settings, ShoppingCart, Package, ClipboardList,
  Truck, ChevronDown, ChevronRight, LogOut, User, Menu, X
} from 'lucide-react'

const menuGroups = [
  {
    label: '홈',
    items: [
      { path: '/intranet/dashboard', label: '대시보드', icon: LayoutDashboard },
      { path: '/intranet/inbox', label: '소통인박스', icon: Inbox },
    ]
  },
  {
    label: '업무',
    items: [
      { path: '/intranet/tasks', label: '업무현황', icon: CheckSquare },
      { path: '/intranet/approval', label: '전자결재', icon: FileText },
      { path: '/intranet/board', label: '업무게시판', icon: MessageSquare },
      { path: '/intranet/calendar', label: '캘린더', icon: Calendar },
      { path: '/intranet/account', label: '계정/비밀번호', icon: Settings },
    ]
  },
  {
    label: '주문',
    items: [
      { path: '/intranet/sales', label: '판매현황', icon: ShoppingCart },
      { path: '/intranet/inventory', label: '재고현황', icon: Package },
      { path: '/intranet/purchase-orders', label: '발주현황', icon: ClipboardList },
      { path: '/intranet/delivery', label: '배송현황', icon: Truck },
    ]
  }
]

function SidebarGroup({ group, collapsed }) {
  const [open, setOpen] = useState(true)

  if (collapsed) {
    return (
      <div className="mb-1">
        {group.items.map(item => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.label}
              className={({ isActive }) =>
                `flex items-center justify-center h-10 w-full hover:bg-[#243552] transition-colors ${isActive ? 'bg-[#1976d2]' : ''}`
              }
            >
              <Icon size={18} className="text-gray-300" />
            </NavLink>
          )
        })}
      </div>
    )
  }

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-200 transition-colors"
      >
        <span>{group.label}</span>
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>
      {open && (
        <div>
          {group.items.map(item => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors border-l-2 ${
                    isActive
                      ? 'text-white bg-[#243552] border-[#1976d2]'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#1e2d42] border-transparent'
                  }`
                }
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function IntranetLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const { intranetUser, signOut } = useIntranetAuth()
  const navigate = useNavigate()

  function handleSignOut() {
    signOut()
    navigate('/intranet')
  }

  return (
    <div className="flex h-screen bg-[#f0f2f5] font-sans overflow-hidden">
      <aside className={`flex flex-col bg-[#1a2940] transition-all duration-200 flex-shrink-0 ${collapsed ? 'w-14' : 'w-52'}`}>
        <div className={`flex items-center h-14 border-b border-[#243552] flex-shrink-0 ${collapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}>
          <div className="w7 h-7 bg-[#1976d2] rounded flex items-center justify-center flex-shrink-0"><span className="text-white text-xs font-bold">EK</span></div>
          {!collapsed && <span className="text-white text-sm font-semibold truncate">EK Medical</span>}
        </div>
        <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
          {menuGroups.map(group => (<SidebarGroup key={group.label} group={group} collapsed={collapsed} />))}
        </nav>
        {!collapsed && (<div className="border-t border-[#243552] p-3 flex-shrink-0"><div className="flex items-center gap-2 mb-2"><div className="w-7 h-7 bg-[#1976d2] rounded-full flex items-center justify-center flex-shrink-0"><User size={14} className="text-white" /></div><div className="min-w-0"><p className="text-white text-xs font-medium truncate">{intranetUser?.name}</p><p className="text-gray-400 text-xs truncate">{intranetUser?.role}</p></div></div><button onClick={handleSignOut} className="w5ull flex items-center gap-2 text-gray-400 hover:text-white text-xs py-1.5 px-2 rounded hover:bg-[#243552] transition-colors"><LogOut size={13} /><span>로그아웃</span></button></div>)}
        {collapsed && (<div className="border-t border-[#243552] py-2 flex-shrink-0"><button onClick={handleSignOut} title="로그아웃" className="flex items-center justify-center h-10 w-full hover:bg-[#243552] transition-colors"><LogOut size={16} className="text-gray-400" /></button></div>)}
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0"><header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 flex-shrink-0 shadow-sm"><button onClick={() => setCollapsed(v => !v)} className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors">{collapsed ? <Menu size={18} /> : <X size={18} />}</button><div className="flex-1" /><div className="flex items-center gap-2 text-sm text-gray-600"><User size={15} /><span>{intranetUser?.name}</span><span className="text-gray-300">|</span><span className="text-xs text-gray-400">{intranetUser?.role}</span></div></header><main className="flex-1 overflow-y-auto p-5"><Outlet /></main></div>
    </div>
  )
}
