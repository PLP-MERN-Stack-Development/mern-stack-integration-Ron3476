import React, { useEffect, useState } from 'react';
import api from '../api/apiClient';
import { useParams, Link } from 'react-router-dom';

export default function PostView() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => { api.get(`/posts/${id}`).then(r => setPost(r.data)).catch(()=>{}); }, [id]);

  const addComment = async () => {
    try {
      const updated = { ...post, comments: [...(post.comments||[]), { author: 'Anonymous', text: comment }] };
      const res = await api.put(`/posts/${id}`, updated);
      setPost(res.data);
      setComment('');
    } catch (err) { alert('Failed'); }
  };

  if (!post) return <div>Loading...</div>;
  return (
    <div>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <div style={{ marginTop: 12 }}>
        <Link to={`/posts/${id}/edit`}>Edit</Link>
        <h3>Comments</h3>
        {post.comments && post.comments.map((c,i) => <div key={i}><b>{c.author}</b>: {c.text}</div>)}
        <input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Add comment" />
        <button onClick={addComment}>Add comment</button>
      </div>
    </div>
  );
}
