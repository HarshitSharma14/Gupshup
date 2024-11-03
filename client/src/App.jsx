import React, { useState } from 'react'
import { Button } from './components/ui/button'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Auth from './pages/auth/Index'
import Chat from './pages/chat/Index'
import Profile from './pages/profile/Index'
import { useAppStore } from './store'
import { apiClient } from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore()
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />
}

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore()
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children
}

const App = () => {

  const { userInfo, setUserInfo } = useAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true
        })
        console.log({ response })
      }
      catch (e) {
        console.log({ e })
      }
    }
    if (!userInfo) {
      getUserData();
    }
    else {
      setLoading(false)
    }
  }, [userInfo, setUserInfo])

  if (loading) {
    return <div >Loading....</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={
          <AuthRoute>
            <Auth />
          </AuthRoute>} />
        <Route path="/chat" element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute>
          <Profile />
        </PrivateRoute>} />
        <Route path="*" element={<Navigate to="/Auth" />} />      </Routes>
    </BrowserRouter>
  )
}

export default App