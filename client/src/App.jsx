import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import PostView from './pages/PostView'
import PostForm from './pages/PostForm'
import { AppProvider } from './context/AppContext'

export default function App() {
  return (
    <AppProvider>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
        <nav style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <Link to='/'>Home</Link>
          <Link to='/posts/new'>New Post</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/new" element={<PostForm />} />
          <Route path="/posts/:id" element={<PostView />} />
          <Route path="/posts/:id/edit" element={<PostForm edit />} />
        </Routes>
      </div>
    </AppProvider>
  )
}
