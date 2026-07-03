import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Clock, MessageSquare, Heart } from 'lucide-react';
import { format } from 'date-fns';

const Home = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/categories');
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = `${BASE_URL}/api/posts?page=${page}`;
      if (keyword) url += `&keyword=${keyword}`;
      if (activeCategory) url += `&category=${activeCategory}`;

      const { data } = await axios.get(url);
      setPosts(data.posts);
      setPages(data.pages);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page, activeCategory, keyword]); // will re-fetch when these change

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  return (
    <div className="space-y-8">
      {/* Hero / Search Section */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Discover <span className="text-indigo-600">Ideas</span> That Matter
        </h1>
        <p className="text-gray-500 max-w-2xl text-lg mb-8">
          Read, write, and deepen your understanding on topics ranging from technology to lifestyle.
        </p>
        
        <form onSubmit={handleSearch} className="w-full max-w-xl relative">
          <input
            type="text"
            placeholder="Search for articles..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-full focus:ring-2 focus:ring-indigo-500 shadow-inner text-gray-700 outline-none transition"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Search className="absolute left-4 top-4 text-gray-400" size={20} />
          <button type="submit" className="absolute right-2 top-2 bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition">
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar for Categories */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Explore Topics</h3>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => { setActiveCategory(''); setPage(1); }}
                className={`text-left px-4 py-2 rounded-lg transition font-medium ${activeCategory === '' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                All Topics
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => { setActiveCategory(c._id); setPage(1); }}
                  className={`text-left px-4 py-2 rounded-lg transition font-medium ${activeCategory === c._id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
              <h3 className="text-xl font-semibold text-gray-700">No articles found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or category filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <Link to={`/post/${post.slug}`} key={post._id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition duration-300 flex flex-col">
                    <div className="h-48 bg-gray-200 overflow-hidden relative">
                      {post.coverImage && post.coverImage !== 'no-photo.jpg' ? (
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-300">
                          <Heart size={48} />
                        </div>
                      )}
                      {post.category && (
                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-indigo-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                          {post.category.name}
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition line-clamp-2">
                        {post.title}
                      </h2>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
                        {post.subtitle}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-50 mt-auto">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-gray-700">{post.author?.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><Clock size={14} /> {format(new Date(post.createdAt), 'MMM d')}</span>
                          <span className="flex items-center gap-1"><Heart size={14} /> {post.likes?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  {[...Array(pages).keys()].map((x) => (
                    <button
                      key={x + 1}
                      onClick={() => setPage(x + 1)}
                      className={`w-10 h-10 rounded-lg font-medium transition ${
                        page === x + 1 
                          ? 'bg-indigo-600 text-white shadow-md' 
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {x + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
