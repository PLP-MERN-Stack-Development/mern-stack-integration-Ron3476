import React, { useContext, useEffect, useState } from 'react';
import api from '../api/apiClient';
import { AppContext } from '../context/AppContext';

function PostCard({ post, onDelete }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 10 }}>
      <h3>{post.title}</h3>
      {post.featuredImage && <img src={import.meta.env.VITE_API_URL.replace('/api','') + post.featuredImage} alt='' style={{ maxWidth: '100%' }} />}
      <p>{post.content.slice(0, 120)}...</p>
      <div style={{ display: 'flex', gap: 10 }}>
        <a href={'/posts/' + post._id}>View</a>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

export default function Home() {
  const { posts, setPosts } = useContext(AppContext);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});

  useEffect(() => {
    let cancelled = false;
    api.get(`/posts?page=${page}&limit=6`).then(res => {
      if (cancelled) return;
      setPosts(res.data.data);
      setMeta(res.data.meta);
    }).catch(()=>{});
    return () => { cancelled = true; };
  }, [page]);

  const handleDelete = async (id) => {
    const old = [...posts];
    setPosts(posts.filter(p => p._id !== id));
    try {
      await api.delete(`/posts/${id}`);
    } catch (err) {
      setPosts(old);
      alert('Delete failed');
    }
  };

  return (
    <div>
      <h1>Posts</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {posts && posts.map(p => <PostCard key={p._id} post={p} onDelete={() => handleDelete(p._id)} />)}
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => setPage(p => Math.max(1, p-1))}>Prev</button>
        <span style={{ margin: '0 8px' }}>{meta.page || 1} / {Math.max(1, Math.ceil((meta.total||0)/(meta.limit||6)))}</span>
        <button onClick={() => setPage(p => p+1)}>Next</button>
      </div>
    </div>
  );
}
