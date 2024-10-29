import React from 'react'
import { Button } from './components/ui/button'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Auth from './pages/auth/Index'
import Chat from './pages/chat/Index'
import Profile from './pages/profile/Index'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/Auth" />} />      </Routes>
    </BrowserRouter>
  )
}

export default App