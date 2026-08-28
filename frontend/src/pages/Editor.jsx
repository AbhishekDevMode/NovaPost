import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { ArrowLeft, Plus, Image as ImageIcon, Tag, FolderPlus, Save } from 'lucide-react';

const Editor = () => {
  const BASE_URL = API_BASE_URL;

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('Draft');

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/categories`);
        setCategories(data);
        if (data.length > 0 && !category) {
          setCategory(data[0]._id);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const analyticsRes = await axios.get(`${BASE_URL}/api/analytics`, config);
          const post = analyticsRes.data.posts.find((p) => p._id === id);
          if (post) {
            setTitle(post.title);
            setSubtitle(post.subtitle || '');
            setContent(post.content);
            setCoverImage(post.coverImage || '');
            setCategory(post.category?._id || '');
            setTags(post.tags?.join(', ') || '');
            setStatus(post.status);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchPost();
    }
  }, [id, user]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`${BASE_URL}/api/categories`, { name: newCatName }, config);
      setCategories([...categories, data]);
      setCategory(data._id);
      setNewCatName('');
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '');

      const postData = {
        title,
        subtitle,
        content,
        coverImage,
        category,
        tags: tagsArray,
        status,
      };

      if (id) {
        await axios.put(`${BASE_URL}/api/posts/id/${id}`, postData, config);
      } else {
        await axios.post(`${BASE_URL}/api/posts`, postData, config);
      }

      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving post');
    }
    setLoading(false);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  return (
    <div className="max-w-6xl mx-auto my-8 px-4 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-xs border border-zinc-200/80">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition"
            title="Back to Dashboard"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
              {id ? 'Edit Story' : 'Draft New Story'}
            </h1>
            <p className="text-xs text-zinc-400">Compose and format your article</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-100 p-1 rounded-full border border-zinc-200/60">
            <button
              onClick={() => setStatus('Draft')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                status === 'Draft' ? 'bg-amber-100 text-amber-800 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Draft
            </button>
            <button
              onClick={() => setStatus('Published')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                status === 'Published' ? 'bg-emerald-100 text-emerald-800 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Published
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-full shadow-xs transition disabled:opacity-50"
          >
            <Save size={15} />
            <span>{loading ? 'Saving...' : `Save as ${status}`}</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Editor Body */}
        <div className="lg:w-2/3 bg-white p-6 sm:p-8 rounded-3xl shadow-xs border border-zinc-200/80 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Article Title</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xl font-bold text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:bg-white focus:border-indigo-600 transition"
              placeholder="Enter a descriptive, engaging title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">Subtitle / Abstract</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:bg-white focus:border-indigo-600 transition"
              placeholder="Brief summary or hook..."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-zinc-700">Body Content</label>
            <div className="rounded-2xl border border-zinc-200 overflow-hidden min-h-[350px]">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                placeholder="Write your main article content here..."
                className="h-72"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Publishing Meta */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-xs border border-zinc-200/80 space-y-6">
            <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-100 pb-3">Publish Settings</h3>

            {/* Cover Image */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                <ImageIcon size={14} className="text-zinc-400" /> Cover Image URL
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:bg-white transition"
                placeholder="https://images.unsplash.com/..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
              {coverImage && (
                <div className="rounded-xl overflow-hidden h-36 bg-zinc-100 border border-zinc-200 mt-2">
                  <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                <FolderPlus size={14} className="text-zinc-400" /> Category
              </label>
              <select
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:bg-white transition cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>

              {/* Create Category form */}
              <form onSubmit={handleCreateCategory} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add new topic..."
                  className="flex-1 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-600/30"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-zinc-900 hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                <Tag size={14} className="text-zinc-400" /> Tags
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:bg-white transition"
                placeholder="react, tailwind, design (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
