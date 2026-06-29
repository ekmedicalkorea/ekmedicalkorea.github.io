import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { IntranetAuthProvider, useIntranetAuth } from '../../context/IntranetAuthContext'
import IntranetLogin from './IntranetLogin'
import IntranetLayout from './IntranetLayout'
import Dashboard from './home/Dashboard'
import Inbox from './home/Inbox'
import TaskStatus from './work/TaskStatus'
import Approval from './work/Approval'
import Board from './work/Board'
import CalendarPage from './work/CalendarPage'
import AccountSettings from './work/AccountSettings'
import SalesStatus from './order/SalesStatus'
import Inventory from './order/Inventory'
import PurchaseOrders from './order/PurchaseOrders'
import Delivery from './order/Delivery'

function ProtectedRoute({ children }) {
  const { intranetUser, loading } = useIntranetAuth()
  const navigate = useNavigate()
  useEffect(() => { if (!loading && !intranetUser) navigate('/intranet') }, [intranetUser, loading])
  if (loading) return (<div className="min-h-screen bg-[#1a2940] flex items-center justify-center"><div className="text-white text-sm">로딩 중...</div></div>)
  return intranetUser ? children : null
}

function IntranetRoutes() {
  const { intranetUser } = useIntranetAuth()
  return (
    <Routes>
      <Route path="" element={intranetUser ? <Navigate to="/intranet/dashboard" replace /> : <IntranetLogin />} />
      <Route element={<ProtectedRoute><IntranetLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="tasks" element={<TaskStatus />} />
        <Route path="approval" element={<Approval />} />
        <Route path="board" element={<Board />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="account" element={<AccountSettings />} />
        <Route path="sales" element={<SalesStatus />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="purchase-orders" element={<PurchaseOrders />} />
        <Route path="delivery" element={<Delivery />} />
        <Route path="*" element={<Navigate to="/intranet/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default function IntranetApp() {
  return (<IntranetAuthProvider><IntranetRoutes /></IntranetAuthProvider>)
}
