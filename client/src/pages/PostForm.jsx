import React, { useState, useEffect } from 'react';
import api from '../api/apiClient';
import { useNavigate, useParams } from 'react-router-dom';

export default function PostForm({ edit }) {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (edit && id) {
      api.get(`/posts/${id}`).then(r => {
        setTitle(r.data.title || '');
        setContent(r.data.content || '');
        setCategories((r.data.categories||[]).map(c=>c._id).join(','));
      }).catch(()=>{});
    }
  }, [edit, id]);

  const submit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', title);
    form.append('content', content);
    form.append('categories', categories);
    if (file) form.append('featuredImage', file);

    try {
      const res = edit ? await api.put(`/posts/${id}`, form) : await api.post('/posts', form);
      navigate(`/posts/${res.data._id}`);
    } catch (err) { alert('Failed'); }
  };

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" rows={8} />
      <input value={categories} onChange={e => setCategories(e.target.value)} placeholder="categoryIds comma separated" />
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button type="submit">Save</button>
    </form>
  );
}
