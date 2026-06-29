import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const IntranetAuthContext = createContext(null)

export function IntranetAuthProvider({ children }) {
  const [intranetUser, setIntranetUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('intranet_user')
    if (stored) {
      try { setIntranetUser(JSON.parse(stored)) } catch {}
    }
    setLoading(false)
  }, [])

  async function signIn(username, password) {
    const { data, error } = await supabase
      .from('intranet_users')
      .select('id, username, name, role')
      .eq('username', username)
      .eq('password', password)
      .single()

    if (error || !data) return { error: '아이디 또는 비밀번호가 올바르지 않습니다.' }

    localStorage.setItem('intranet_user', JSON.stringify(data))
    setIntranetUser(data)
    return { error: null }
  }

  function signOut() {
    localStorage.removeItem('intranet_user')
    setIntranetUser(null)
  }

  async function updatePassword(currentPassword, newPassword) {
    if (!intranetUser) return { error: '로그인이 필요합니다.' }

    const { data, error } = await supabase
      .from('intranet_users')
      .select('id')
      .eq('id', intranetUser.id)
      .eq('password', currentPassword)
      .single()

    if (error || !data) return { error: '현재 비밀번호가 올바르지 않습니다.' }

    const { error: updateError } = await supabase
      .from('intranet_users')
      .update({ password: newPassword })
      .eq('id', intranetUser.id)

    if (updateError) return { error: '비밀번호 변경에 실패했습니다.' }
    return { error: null }
  }

  return (
    <IntranetAuthContext.Provider value={{ intranetUser, loading, signIn, signOut, updatePassword }}>
      {children}
    </IntranetAuthContext.Provider>
  )
}

export const useIntranetAuth = () => useContext(IntranetAuthContext)
